import { useState, useRef } from "react";
import styles from "./NewBroadcast.module.css";

import { X, Image as ImageIcon } from "lucide-react";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";
import imageCompression from "browser-image-compression";

export default function NewBroadcast({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { user } = useUser();
  const { showToast } = useToast();

  const MAX_TITLE = 100;
  const MAX_CONTENT = 2000;
  const MAX_SIZE_MB = 10;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast("Inserisci un titolo.", "error");
      return;
    }

    if (!user) {
      showToast("Errore: utente non autenticato.", "error");
      return;
    }

    let uploadedImageUrl = null;

    // --- IMMAGINE ---
    if (imagePreview) {
      const file = fileInputRef.current?.files?.[0];

      if (file && file.size / 1024 / 1024 > MAX_SIZE_MB) {
        showToast("L'immagine è troppo grande (max 10MB)", "error");
        return;
      }

      if (file) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
          fileType: "image/webp",
          useWebWorker: true
        });

        const ext = "webp";
        const fileName = `${user.id}_${Date.now()}.${ext}`;
        const filePath = `broadcasts/${fileName}`;
        const finalFile = new File([compressed], fileName, { type: "image/webp" });

        const { error: uploadError } = await supabase.storage
          .from("broadcasts")
          .upload(filePath, finalFile);

        if (uploadError) {
          console.error(uploadError);
          showToast("Errore upload immagine.", "error");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("broadcasts")
          .getPublicUrl(filePath);

        uploadedImageUrl = urlData.publicUrl;
      }
    }

    // --- CREA BROADCAST ---
    const { data, error } = await supabase
      .from("broadcasts")
      .insert({
        title,
        content,
        pinned,
        image_url: uploadedImageUrl,
        author_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast("Errore nella pubblicazione.", "error");
      return;
    }

    // success
    showToast("Broadcast pubblicato!", "success");

    onCreated?.(data);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.cancel} onClick={onClose}>Annulla</button>
          <span className={styles.title}>Nuovo broadcast</span>
          <button
            className={`${styles.publish} ${
              title.trim() === "" ? styles.disabled : ""
            }`}
            onClick={title.trim() === "" ? undefined : handlePublish}
          >
            Pubblica
          </button>
        </div>

        {/* INPUT TITOLO */}
        <input
          className={styles.titleInput}
          placeholder="Titolo"
          maxLength={MAX_TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* TEXTAREA CONTENUTO */}
        <textarea
          className={styles.textarea}
          placeholder="Scrivi l'annuncio..."
          maxLength={MAX_CONTENT}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* SWITCH PINNED */}
        <label className={styles.switchRow}>
          <span>Fissa in alto</span>
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
        </label>

        {/* IMMAGINE */}
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
              <img src={imagePreview} className={styles.imagePreview} />

              <span
                className={styles.changeImage}
                onClick={() => fileInputRef.current.click()}
              >
                Cambia
              </span>

              <span
                className={styles.removeImage}
                onClick={() => setImagePreview(null)}
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
