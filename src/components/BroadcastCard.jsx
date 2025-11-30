import styles from "./BroadcastCard.module.css";

export default function BroadcastCard({ title, time, content }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.time}>{time}</div>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}
