import { useState, useRef } from "react";
import styles from "./NewMarketItem.module.css"; // riusiamo gli stessi stili
import { X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../context/UserContext";
import { compressImage } from "../../lib/compressImage";
import { useMarketContext } from "../../context/MarketContext";

export default function NewMarketBook({ onClose }) {
  const { user } = useUser();
  const fileInputRef = useRef(null);

  const { triggerBookCreated } = useMarketContext();

  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [subject, setSubject] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [imagePreview, setImagePreview] = useState(null);

  // --- IMAGE HANDLING ---
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

  // --- CREATE BOOK ---
  async function handleCreate() {
    if (!title.trim()) return;
    if (!user) return;

    let uploadedImageUrl = null;

    // Upload immagine se presente
    if (imagePreview && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];

      const compressed = await compressImage(file);

      const newName = `${user.id}_${Date.now()}.webp`;
      const filePath = `market_books/${newName}`;

      const finalFile = new File([compressed], newName, {
        type: "image/webp"
      });

      const { error: uploadError } = await supabase.storage
        .from("market_books")
        .upload(filePath, finalFile, { upsert: false });

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from("market_books")
        .getPublicUrl(filePath);

      uploadedImageUrl = data.publicUrl;
    }

    // INSERT nel DB
    const { data, error } = await supabase
      .from("market_books")
      .insert({
        user_id: user.id,
        title,
        author,
        edition,
        publisher,
        isbn,
        subject,
        school_year: schoolYear,
        description,
        price: price ? Number(price) : null,
        image_url: uploadedImageUrl
      })
      .select(`
        *,
        profiles ( username, avatar_url )
      `)
      .single();

    if (!error) {
      triggerBookCreated(data);
      onClose();
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.cancel} onClick={onClose}>Annulla</span>
          <span className={styles.title}>Nuovo libro</span>
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
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* AUTHOR */}
        <input
          className={styles.input}
          placeholder="Autore"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        {/* EDITION */}
        <input
          className={styles.input}
          placeholder="Edizione (opzionale)"
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
        />

        {/* PUBLISHER */}
        <input
          className={styles.input}
          placeholder="Casa editrice (opzionale)"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />

        {/* ISBN */}
        <input
          className={styles.input}
          placeholder="ISBN (opzionale)"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        {/* SUBJECT */}
        <input
          className={styles.input}
          placeholder="Materia (opzionale)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* SCHOOL YEAR */}
        <input
          className={styles.input}
          placeholder="Anno scolastico (es. 2° superiore)"
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          className={styles.textarea}
          placeholder="Descrizione (opzionale)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* PRICE */}
        <input
          className={styles.input}
          placeholder="Prezzo (opzionale)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

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
