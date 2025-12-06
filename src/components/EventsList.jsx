import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BroadcastCard from "./BroadcastCard";
import styles from "./EventsList.module.css";
import EventCard from "./EventCard";
import CalendarView from "./CalendarView";
import EventsOfDay from "./EventsOfDay";

export default function EventsList({ refreshTrigger }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]); // <-- ricarica dopo nuovo evento

  async function loadEvents() {
    const { data, error } = await supabase
      .from("broadcasts")
      .select("*")
      .not("event_date", "is", null)
      .order("event_date", { ascending: true });

    if (!error) setEvents(data);
  }

  return (
    <div className={styles.container}>
      {events.length === 0 && (
        <p className={styles.empty}>Nessun evento in programma.</p>
      )}
      <CalendarView
        events={events}  
        onSelectDay={(d) => setSelectedDate(d)}
        />

        <EventsOfDay date={selectedDate} events={events} />

      {events.map(ev => (
        <EventCard key={ev.id} item={ev} />
      ))}
    </div>
  );
}
