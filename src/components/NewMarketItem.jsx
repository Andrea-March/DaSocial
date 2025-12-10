import { useState, useRef } from "react";
import styles from "./NewMarketItem.module.css";
import { X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import imageCompression from "browser-image-compression";

export default function NewMarketItem({ onClose, onCreated }) {
  const { user } = useUser();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("other");
  const [imagePreview, setImagePreview] = useState(null);

  // --- IMAGE HANDLING (identico a NewPost) ---
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- CREATE MARKET ITEM ---
  async function handleCreate() {
    if (!title.trim()) return;
    if (!user) return;

    let uploadedImageUrl = null;

    if (imagePreview && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];

      // --- COMPRESS METODO IDENTICO A NEWPOST ---
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        fileType: "image/webp",
        useWebWorker: true
      });

      const newName = `${user.id}_${Date.now()}.webp`;
      const filePath = `market_items/${newName}`;

      const finalFile = new File([compressed], newName, {
        type: "image/webp"
      });

      const { error: uploadError } = await supabase.storage
        .from("market_items")
        .upload(filePath, finalFile, { upsert: false });

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from("market_items")
        .getPublicUrl(filePath);

      uploadedImageUrl = data.publicUrl;
    }

    // Insert nel DB + ritorno del record completo
    const { data, error } = await supabase
      .from("market_items")
      .insert({
        user_id: user.id,
        title,
        price: price ? Number(price) : null,
        category,
        image_url: uploadedImageUrl
      })
      .select(`
        *,
        profiles ( username, avatar_url )
      `)
      .single();

    if (!error) {
      onCreated(data);
      onClose();
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.cancel} onClick={onClose}>Annulla</span>
          <span className={styles.title}>Nuovo articolo</span>
          <span
            className={`${styles.publish} ${!title.trim() ? styles.disabled : ""}`}
            onClick={title.trim() ? handleCreate : undefined}
          >
            Pubblica
          </span>
        </div>

        {/* TITLE */}
        <input
          className={styles.input}
          placeholder="Titolo"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* PRICE */}
        <input
          className={styles.input}
          placeholder="Prezzo (opzionale)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="other">Altro</option>
          <option value="electronics">Elettronica</option>
          <option value="school">Materiale scolastico</option>
          <option value="clothes">Abbigliamento</option>
        </select>

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleImage}
        />

        <div className={styles.imageSection}>
          {imagePreview ? (
            <div className={styles.previewWrapper}>
              <img className={styles.imagePreview} src={imagePreview} alt="" />

              <span
                className={styles.changeImage}
                onClick={() => fileInputRef.current.click()}
              >
                Cambia
              </span>

              <span
                className={styles.removeImage}
                onClick={handleRemoveImage}
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
