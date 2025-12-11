import { useState } from "react";
import BookImagePreview from "./BookImagePreview";
import styles from "./BookCard.module.css";

export default function BookCard({ book }) {
  const [showPreview, setShowPreview] = useState(false);
  const imageSrc = book.image_url || "/placeholder-book.svg";

  return (
    <>
      <div className={styles.card}>
        
        {/* COVER CLICKABLE */}
        <div
          className={styles.imageWrapper}
          onClick={() => setShowPreview(true)}
        >
          <img className={styles.image} src={imageSrc} alt={book.title} />
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          {book.author && <p className={styles.author}>{book.author}</p>}
          {book.price && <p className={styles.price}>{book.price}€</p>}
          <div className={styles.user}>
            <img className={styles.avatar} src={book.profiles.avatar_url} alt="" />
            <span>{book.profiles.username}</span>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {showPreview && (
        <BookImagePreview src={imageSrc} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
