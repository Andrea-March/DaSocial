import EventCard from "./EventCard";

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
    <div style={{ marginTop: "4px", marginBottom: "16px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
        Eventi del {date.toLocaleDateString("it-IT")}
      </h3>

      {filtered.map(ev => (
        <EventCard key={ev.id} item={ev} />
      ))}
    </div>
  );
}
