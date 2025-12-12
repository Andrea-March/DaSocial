import styles from "./Fab.module.css";
import { Plus } from "lucide-react";

export default function Fab({ onClick  }) {
  return (
    <button className={styles.fab} onClick={onClick}>
      <Plus size={22} />
    </button>
  );
}
