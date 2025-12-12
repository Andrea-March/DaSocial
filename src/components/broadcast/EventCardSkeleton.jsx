import styles from "./EventCardSkeleton.module.css";

export default function EventCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.badge}></div>

      <div className={styles.body}>
        <div className={styles.title}></div>
        <div className={styles.text}></div>
        <div className={styles.image}></div>
      </div>
    </div>
  );
}
