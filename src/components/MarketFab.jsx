import styles from "./MarketFab.module.css";
import { Plus } from "lucide-react";

export default function MarketFab({ onOpenSheet  }) {
  return (
    <button className={styles.fab} onClick={onOpenSheet}>
      <Plus size={22} />
    </button>
  );
}
