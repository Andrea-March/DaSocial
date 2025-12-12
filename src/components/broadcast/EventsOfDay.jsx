import EventCard from "./EventCard";
import styles from "./EventsOfDay.module.css";

export default function EventsOfDay({ date, events }) {
  if (!date) return null;

  const filtered = events.filter(e => {
    const d = new Date(e.event_date);
    return (
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  });

  if (filtered.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        Eventi del {date.toLocaleDateString("it-IT")}
      </h3>

      <div className={styles.list}>
        {filtered.map(ev => (
          <EventCard key={ev.id} item={ev} />
        ))}
      </div>
    </div>
  );
}
