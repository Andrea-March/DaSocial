import styles from "./TopTabs.module.css";

export default function TopTabs({ tabs, active, onChange }) {
  return (
    <nav className={styles.nav}>
      {tabs.map((t) => (
        <div
          key={t.value}
          className={`${styles.tab} ${active === t.value ? styles.active : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </div>
      ))}
    </nav>
  );
}
