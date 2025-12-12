import styles from "./BroadcastCard.module.css";
import { Megaphone, CalendarDays, Pin, MoreVertical } from "lucide-react";
import { timeAgo } from "../../lib/timeAgo";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useBroadcast } from "../../context/broadcastContext";
import ActionMenu from "../ui/ActionMenu";

export default function BroadcastCard({ broadcast, variant = "minimal" }) {
  const { title, content, image_url, created_at, event_date, pinned } = broadcast;
  const [menuOpen, setMenuOpen] = useState(false);
  const {openEditBroadcast, openDeleteBroadcast, triggerBroadcastDeleted, closeDeleteBroadcast} = useBroadcast();
  const { canEditBroadcast } = useUser();

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

  
    async function handleDeleteBroadcast() {
      if (!canPublishBroadcast()) {
        showToast("Non hai i permessi per eliminare questo broadcast", "error");
        return;
      }
  
      const broadcast = broadcastBeingDeleted;
  
      // 1. Salviamo path immagine se esiste
      let oldImagePath = null;
      if (broadcast.image_url) {
        oldImagePath = extractPath(broadcast.image_url);
      }
  
      // 2. DELETE broadcast da database
      const { error } = await supabase
        .from("broadcasts")
        .delete()
        .eq("id", broadcast.id);
  
      if (error) {
        console.error(error);
        showToast("Errore nella cancellazione", "error");
        return;
      }
  
      // 3. Rimuovi immagine se presente
      if (oldImagePath) {
        await supabase.storage.from("broadcasts").remove([oldImagePath]);
      }
  
      // 4. Notifica feed
      triggerBroadcastDeleted(broadcast.id);
  
      showToast("Broadcast eliminato", "success");
  
      closeDeleteBroadcast();
    }

  return (
    <div
      className={`${styles.card} ${
        variant === "accent" ? styles.accent : ""
      } ${variant === "icon" ? styles.iconVariant : ""}`}
    >
     

      <div className={styles.main}>

        {/* HEADER: titolo + tempo + pinned */}
        <div className={styles.header}>
           {/* ICON VARIANT */}
            {variant === "icon" && (
              <div className={styles.iconWrapper}>
                <Megaphone size={20} className={styles.icon} />
              </div>
            )}
            <div className={styles.title}>{title}</div>
          <div className={styles.time}>{howLongAgo}</div>
          {/* EDIT SECTION */}
              {canEditBroadcast && (
                <MoreVertical
                  className={styles.menuIcon}
                  onClick={() => setMenuOpen(true)}
                />
              )}

              {menuOpen && canEditBroadcast && (
                <ActionMenu
                  backdrop={false}
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  actions={[
                    {
                      label: "Modifica",
                      onClick: () => openEditBroadcast(broadcast)
                    },
                    {
                      label: "Elimina",
                      danger: true,
                      onClick: () => openDeleteBroadcast(broadcast)
                    }
                  ]}
                />
              )}

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
