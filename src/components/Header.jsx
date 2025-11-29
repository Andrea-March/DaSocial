import styles from "./Header.module.css";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>DaSocial</h1>
      <div className={styles.profileIcon}>
        <User size={22} strokeWidth={2} />
      </div>
    </header>
  );
}
