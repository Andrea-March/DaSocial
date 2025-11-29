import styles from "./BottomNav.module.css";
import { Home, Megaphone, PlusCircle, Bell, User } from "lucide-react";


export default function BottomNav() {
  return (
    <nav className={styles.nav}>
        <div className={styles.icon}><Home size={22} /></div>
        <div className={styles.icon}><Megaphone size={22} /></div>
        <div className={styles.add}><PlusCircle size={28} /></div>
        <div className={styles.icon}><Bell size={22} /></div>
        <div className={styles.icon}><User size={22} /></div>
    </nav>
  );
}
