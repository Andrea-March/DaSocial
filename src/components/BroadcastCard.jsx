import styles from "./BroadcastCard.module.css";
import { Megaphone, CalendarDays, Pin } from "lucide-react";
import { timeAgo } from "../lib/timeAgo";

export default function BroadcastCard({ broadcast, variant = "minimal" }) {
  const { title, content, image_url, created_at, event_date, pinned } = broadcast;

  const howLongAgo = timeAgo(created_at);
  const isEvent = !!event_date;

  let smallDate = null;
  if (isEvent) {
    const d = new Date(event_date);
    smallDate = d.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short"
    });
  }

  return (
    <div
      className={`${styles.card} ${
        variant === "accent" ? styles.accent : ""
      } ${variant === "icon" ? styles.iconVariant : ""}`}
    >
      {/* ICON VARIANT */}
      {variant === "icon" && (
        <div className={styles.iconWrapper}>
          <Megaphone size={20} className={styles.icon} />
        </div>
      )}

      <div className={styles.main}>

        {/* HEADER: titolo + tempo + pinned */}
        <div className={styles.header}>
            <div className={styles.title}>{title}</div>
          <div className={styles.time}>{howLongAgo}</div>
        </div>
        {(isEvent || pinned) && <div className={styles.metaDivider}></div>}

        {/* META ROW */}
        {(isEvent || pinned) && (
          <div className={styles.metaRow}>
            
            {isEvent && (
              <>
                <span className={styles.eventBadge}>Evento</span>
                <span className={styles.eventDate}>
                  <CalendarDays size={14} /> {smallDate}
                </span>
              </>
            )}

            {pinned && (
              <span className={styles.pinnedBadge}>
                <Pin size={12} className={styles.pinIcon} />
                Fissato
              </span>
            )}

          </div>
        )}

        {/* CONTENUTO */}
        {content && <div className={styles.content}>{content}</div>}

        {/* IMMAGINE */}
        {image_url && (
          <div className={styles.imageWrapper}>
            <img src={image_url} alt="" className={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
}
