import styles from "./MarketChoiceSheet.module.css";
import { Book, Package } from "lucide-react";

export default function MarketChoiceSheet({ onClose, onSelect }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.title}>Cosa vuoi vendere?</div>

        {/* BOOK */}
        <button className={styles.option} onClick={() => onSelect("book")}>
          <div className={`${styles.iconBubble} ${styles.primaryBubble}`}>
            <Book size={18} />
          </div>
          <span>Vendi un libro</span>
        </button>

        {/* ITEM */}
        <button className={styles.option} onClick={() => onSelect("item")}>
          <div className={`${styles.iconBubble} ${styles.secondaryBubble}`}>
            <Package size={18} />
          </div>
          <span>Vendi un articolo</span>
        </button>

        <button className={styles.cancel} onClick={onClose}>
          Annulla
        </button>
      </div>
    </div>
  );
}
