import styles from "./AnnouncementSkeleton.module.css";

export default function AnnouncementSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.title}></div>
      <div className={styles.text}></div>
      <div className={styles.textShort}></div>
    </div>
  );
}
