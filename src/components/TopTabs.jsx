import styles from "./TopTabs.module.css";

export default function TopTabs() {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.tab} ${styles.active}`}>Bacheca</div>
      <div className={styles.tab}>Broadcast</div>
      <div className={styles.tab}>Mercatino</div>
    </nav>
  );
}

