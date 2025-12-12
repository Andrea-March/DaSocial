import { useEffect, useState } from "react";
import { X } from "lucide-react";
import styles from "./BookImagePreview.module.css";

export default function BookImagePreview({ src, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // avvia animazione in entrata
    setVisible(true);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 150); // tempo per animazione out
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={`${styles.content} ${
          visible ? styles.animateIn : styles.animateOut
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={handleClose}>
          <X size={22} />
        </button>
        <img src={src} className={styles.image} alt="" />
      </div>
    </div>
  );
}
