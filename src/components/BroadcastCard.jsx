import styles from "./BroadcastCard.module.css";
import { Megaphone } from "lucide-react";
import { timeAgo } from "../lib/timeAgo";

export default function BroadcastCard({ broadcast, variant = "minimal" }) {
  const { title, content, image_url, created_at } = broadcast;
  console.log(created_at)
  const howLongAgo = timeAgo(created_at);

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
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.time}>{howLongAgo}</div>
        </div>

        {content && <div className={styles.content}>{content}</div>}

        {image_url && (
          <div className={styles.imageWrapper}>
            <img src={image_url} alt="" className={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
}
