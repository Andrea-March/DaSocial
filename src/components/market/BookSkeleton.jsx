import styles from './BookSkeleton.module.css'

export default function BookSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.image} />
      </div>

      <div className={styles.info}>
        <div className={styles.title} />
        <div className={styles.author} />
        <div className={styles.price} />
        <div className={styles.avatar} />
      </div>
    </div>
  );
}

