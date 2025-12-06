import styles from "./CalendarView.module.css";
import { useState, useEffect } from "react";

export default function CalendarView({ events = [], onSelectDay }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Mappa delle date che hanno eventi
  const eventDays = new Set(
    events.map(e => {
      const d = new Date(e.event_date);
      return d.getDate();
    })
  );

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const selectedDate = new Date(year, month, day);
    onSelectDay(selectedDate);
  };

  return (
    <div className={styles.calendarWrapper}>
      {/* HEADER MESE */}
      <div className={styles.monthHeader}>
        {currentDate.toLocaleString("it-IT", {
          month: "long",
          year: "numeric"
        })}
      </div>

      {/* HEADER SETTIMANA */}
      <div className={styles.weekRow}>
        {["L", "M", "M", "G", "V", "S", "D"].map((d) => (
          <div key={d} className={styles.weekDay}>{d}</div>
        ))}
      </div>

      {/* GRIGLIA GIORNI */}
      <div className={styles.grid}>
        {/* Vuoti prima del 1° giorno del mese */}
        {Array((firstDay + 6) % 7).fill(null).map((_, i) => (
          <div key={"e" + i} className={styles.emptyCell}></div>
        ))}

        {/* Giorni veri */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const hasEvent = eventDays.has(day);

          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              className={`${styles.dayCell} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              <span className={styles.dayNumber}>{day}</span>

              {hasEvent && <span className={styles.dot}></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
