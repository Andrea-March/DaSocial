import styles from "./CalendarSkeleton.module.css";

export default function CalendarSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.month}></div>

      <div className={styles.grid}>
        {Array(7 * 5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className={styles.day}></div>
          ))}
      </div>
    </div>
  );
}
