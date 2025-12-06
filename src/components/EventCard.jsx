import styles from "./EventCard.module.css";

export default function EventCard({ item }) {
  const date = new Date(item.event_date);
  const day = date.getDate();
  const month = date.toLocaleString("it-IT", { month: "short" });

  return (
    <div className={styles.card}>
      
      {/* BADGE DATA */}
      <div className={styles.dateBadge}>
        <div className={styles.day}>{day}</div>
        <div className={styles.month}>{month}</div>
      </div>

      {/* CONTENUTO */}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.text}>{item.content}</p>

        {item.image_url && (
          <img src={item.image_url} className={styles.image} alt="" />
        )}
      </div>
    </div>
  );
}
