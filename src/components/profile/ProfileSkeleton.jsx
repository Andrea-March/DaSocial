import styles from "./ProfileSkeleton.module.css";

export default function ProfileSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.title} />

      <div className={styles.avatarWrapper}>
        <div className={styles.avatar} />
      </div>

      <div className={styles.changePhoto} />

      <div className={styles.card}>
        {/* Email */}
        <div className={styles.label} />
        <div className={styles.value} />

        {/* Username */}
        <div className={styles.label} />
        <div className={styles.value} />

        {/* Bio */}
        <div className={styles.label} />
        <div className={styles.textArea} />

        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label} />
            <div className={styles.input} />
          </div>

          <div className={styles.column}>
            <div className={styles.label} />
            <div className={styles.input} />
          </div>
        </div>
      </div>

      <div className={styles.saveButton} />
    </div>
  );
}
