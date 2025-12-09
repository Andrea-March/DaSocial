import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import styles from "./NewPost.module.css";
import { X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { usePostContext } from "../context/PostContext";
import imageCompression from "browser-image-compression";
import { useToast } from "../context/ToastContext";

export default function NewPost({ onClose, postToEdit }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const MAX_CHARS = 500;
  const MAX_SIZE_MB = 10;
  const fileInputRef = useRef(null);

  const { showToast } = useToast();

  const { triggerPostCreated, triggerPostUpdated } = usePostContext();

  const { user } = useUser();

  useEffect(() => {
    if (postToEdit) {
      setText(postToEdit.content || "");
      setImagePreview(postToEdit.image_url || null);
    }
  }, [postToEdit]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function extractPath(url) {
    // Prende tutto dopo "public/{bucket}/"
    const match = url.match(/public\/([^/]+)\/(.+)$/);

    if (!match) return null;

    // match[1] = bucket ("posts")
    // match[2] = internal path ("posts/filename.webp")
    return match[2];
  }

  async function handleUpdatePost() {
    if (!user || user.id !== postToEdit.user_id) {
      showToast("Non hai i permessi per modificare questo post", "error");
      return;
    }

    let newImageUrl = postToEdit.image_url;
    let oldImagePath = null;

    // Se immagine rimossa
    if (!imagePreview && postToEdit.image_url) {
      oldImagePath = extractPath(postToEdit.image_url);
      newImageUrl = null;
    }

    // Se immagine cambiata
    if (imagePreview && fileInputRef.current?.files?.[0]) {
      if (postToEdit.image_url) {
        oldImagePath = extractPath(postToEdit.image_url);
      }

      const file = fileInputRef.current.files[0];

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        fileType: "image/webp",
        useWebWorker: true
      });

      const newName = `${user.id}_${Date.now()}.webp`;
      const filePath = `posts/${newName}`;

      const finalFile = new File([compressed], newName, { type: "image/webp" });

      await supabase.storage.from("posts").upload(filePath, finalFile);

      const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
      newImageUrl = data.publicUrl;
    }

    // UPDATE con funzione postgres definita su supabase che ritorna l'intero post per aggiornare correttamente il feed
   const { data, error } = await supabase.rpc("update_post_get_full", {
      pid: postToEdit.id,
      new_content: text,
      new_image_url: newImageUrl
    });

    if (error) {
      showToast("Errore nell'aggiornamento", "error");
      return;
    }

    // Rimuovi vecchia immagine
    if (oldImagePath) {
      await supabase.storage.from("posts").remove([oldImagePath]);
    }

    triggerPostUpdated(data);

    onClose();
  }
  
  const handlePost = async () => {
    if (!text.trim()) {
      showToast("Scrivi qualcosa prima di pubblicare!", "error");
      return;
    }

    if (!user) {
      showToast("Utente non autenticato.", "error");
      return;
    }

    let uploadedImageUrl = null;

    // --- SE C'È UN'IMMAGINE, COMPRESSA E CARICATA ---
    if (imagePreview) {
      const file = fileInputRef.current?.files?.[0];
      if (file && file.size / 1024 / 1024 > MAX_SIZE_MB) {
        showToast("L'immagine è troppo grande (max 10MB)", "error");
        return;
      }

      if (file) {
        // 🔥 1) Compress + resize
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,  
          maxWidthOrHeight: 1280,
          fileType: "image/webp",
          useWebWorker: true
        });

        // 🔥 2) Convert blob in File (per Supabase)
        const ext = "webp";
        const fileName = `${user.id}_${Date.now()}.${ext}`;
        const finalFile = new File([compressed], fileName, { type: "image/webp" });

        const filePath = `posts/${fileName}`;

        // 🔥 3) Upload su Supabase
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(filePath, finalFile, { upsert: false });

        if (uploadError) {
          console.error(uploadError);
          alert("Errore nel caricamento dell'immagine.");
          return;
        }

        // 🔥 4) Ottieni URL pubblico
        const { data: urlData } = supabase.storage
          .from("posts")
          .getPublicUrl(filePath);

        uploadedImageUrl = urlData.publicUrl;
      }
    }

    // --- 5) CREA IL POST ---
    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content: text,
        image_url: uploadedImageUrl,
      })
      .select();

    if (error) {
      console.error(error);
      showToast("Errore nella pubblicazione del post", "error");
      return;
    }

    const newPostId = data[0].id;

    // --- 6) RELOAD POST COMPLETO (con JOIN sui profiles) ---
    const { data: fullPost } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        like_count,
        created_at,
        user_id,
        profiles(
          username,
          avatar_url
        )
      `)
      .eq("id", newPostId)
      .single();

    triggerPostCreated(fullPost);

    // --- 7) RESET UI ---
    setImagePreview(null);
    setPostBeingEdited(null);
    setText("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.cancel} onClick={onClose}>Annulla</span>
          <span className={styles.title}>Nuovo post</span>
          <span 
            className={`${styles.publish} ${text.length === 0 ? styles.disabled : ""}`} 
            onClick={
              text.trim().length === 0
                ? undefined
                : postToEdit
                  ? handleUpdatePost
                  : handlePost
            }
          >
            <span className={styles.publish}>
              {postToEdit ? "Salva" : "Pubblica"}
            </span>
          </span>
        </div>

        {/* TEXTAREA */}
        <textarea
          className={styles.textarea}
          placeholder="Scrivi qualcosa..."
          value={text}
          autoFocus
          onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= MAX_CHARS) {
                        setText(value);
                    }}}
        />
        <div 
            className={styles.counter}
            data-warning={text.length === MAX_CHARS}
        >
            {text.length}/{MAX_CHARS}
        </div>

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImage}
          hidden
        />
        <div className={styles.imageSection}>
          {imagePreview ? (
            <div className={styles.previewWrapper}>
                <img className={styles.imagePreview} src={imagePreview} alt="" />
                 {/* CAMBIA */}
                  <span
                    className={styles.changeImage}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Cambia
                  </span>

                  {/* RIMUOVI */}
                  <span
                    className={styles.removeImage}
                    onClick={() => handleRemoveImage()}
                  >
                    Rimuovi
                  </span>
            </div>
          ) : (
            <div
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current.click()}
            >
              <ImageIcon size={20} />
              <span>Carica immagine</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
