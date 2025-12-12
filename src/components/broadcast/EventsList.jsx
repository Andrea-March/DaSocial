import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import BroadcastCard from "./BroadcastCard";
import styles from "./EventsList.module.css";
import EventCard from "./EventCard";
import CalendarView from "./CalendarView";
import EventsOfDay from "./EventsOfDay";
import CalendarSkeleton from "./CalendarSkeleton";
import EventCardSkeleton from "./EventCardSkeleton";
import SectionDivider from "../layout/SectionDivider";

export default function EventsList({ refreshTrigger }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setTimeout(()=>setLoading(false), 500);
  }

  return (
    <div className={styles.container}>
      {!loading && events.length === 0 && (
        <p className={styles.empty}>Nessun evento in programma.</p>
      )}
      {loading ? (
        <>
          <CalendarSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </>
      ) : (
        <div className="fadeIn">
          <CalendarView events={events} onSelectDay={setSelectedDate} />

          {selectedDate && (
            <SectionDivider label="Eventi del giorno" />
          )}

          <EventsOfDay date={selectedDate} events={events} />
          {selectedDate && <SectionDivider label="Tutti gli eventi" />}

          {events.map(ev => (
            <EventCard key={ev.id} item={ev} />
          ))}
        </div>
      )}
    </div>
  );
}
