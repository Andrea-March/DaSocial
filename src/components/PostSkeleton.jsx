import styles from "./PostSkeleton.module.css";

export default function PostSkeleton() {
  return (
    <div className={styles.skeletonPost}>

      <div className={styles.header}>
        <div className={styles.avatar}></div>
        <div className={styles.headerText}>
          <div className={styles.lineShort}></div>
          <div className={styles.lineTiny}></div>
        </div>
      </div>

      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.lineHalf}></div>

      <div className={styles.image}></div>

      <div className={styles.actions}>
        <div className={styles.icon}></div>
        <div className={styles.icon}></div>
      </div>

    </div>
  );
}
