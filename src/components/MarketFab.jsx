import styles from "./MarketFab.module.css";
import { Plus } from "lucide-react";

export default function MarketFab({ onClick }) {
  return (
    <button className={styles.fab} onClick={onClick}>
      <Plus size={22} />
    </button>
  );
}
