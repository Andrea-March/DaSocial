import styles from "./SectionDivider.module.css";

export default function SectionDivider({ label }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.line}></div>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.line}></div>
    </div>
  );
}
