import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  open,
  title,
  subtitle,
  confirmText = "Conferma",
  cancelText = "Annulla",
  danger = false,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.title}>{title}</div>

        {subtitle && (
          <div className={styles.subtitle}>{subtitle}</div>
        )}

        <button
          className={`${styles.confirmBtn} ${
            danger ? styles.danger : ""
          }`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>

        <button
          className={styles.cancelBtn}
          onClick={onCancel}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
}
