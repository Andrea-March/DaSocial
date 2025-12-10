import styles from "./BookCard.module.css";

export default function BookCard({ book }) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={book.image_url} alt={book.title} />

      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        {book.author && <p className={styles.author}>{book.author}</p>}
        {book.price && <p className={styles.price}>{book.price}€</p>}
      </div>

      <div className={styles.user}>
        <img className={styles.avatar} src={book.profiles.avatar_url} alt="" />
        <span>{book.profiles.username}</span>
      </div>
    </div>
  );
}
