import { useEffect, useState } from "react";
import styles from "./NewPost.module.css";
import { X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function NewPost({ onClose }) {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const MAX_CHARS = 500;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
    });
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

const handlePost = async () => {
    if (!text.trim()) {
        alert("Scrivi qualcosa prima di pubblicare!");
        return;
    }

    if (!user) {
        alert("Utente non autenticato.");
        return;
    }

    const { data, error } = await supabase
        .from("posts")
        .insert({
        user_id: user.id,
        content: text,
        image_url: null, // per ora niente immagine
        })
        .select();

    if (error) {
        console.error(error);
        alert("Errore nella pubblicazione del post.");
        return;
    }

    // Reset UI
    setText("");
    onClose(); // chiude il modal

    // Se vuoi: ricarica il feed dopo la creazione
    if (onPostCreated) onPostCreated(data[0]);
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
            onClick={text.length === 0 ? undefined : handlePost}
          >
            Pubblica
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
        <div className={styles.imageSection}>
          {imagePreview ? (
            <div className={styles.previewWrapper}>
                <img className={styles.imagePreview} src={imagePreview} alt="" />
                {/* CAMBIA */}
                <label className={styles.changeImage}>
                    Cambia
                    <input type="file" accept="image/*" onChange={handleImage} hidden />
                </label>

                {/* RIMUOVI */}
                <span className={styles.removeImage} onClick={() => setImagePreview(null)}>
                    X
                </span>
            </div>
          ) : (
            <label className={styles.uploadBtn}>
              <ImageIcon size={20} />
              <span>Carica immagine</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
            </label>
          )}
        </div>

      </div>
    </div>
  );
}
