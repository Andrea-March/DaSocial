import styles from "./DeleteBroadcastModal.module.css";
import { useBroadcast } from "../context/broadcastContext";
import { supabase } from "../lib/supabaseClient";

export default function DeleteBroadcastModal() {
  const {
    broadcastBeingDeleted,
    closeDeleteBroadcast,
    triggerBroadcastDeleted
  } = useBroadcast();

  if (!broadcastBeingDeleted) return null;

  function extractPath(url) {
    const match = url.match(/public\/([^/]+)\/(.+)$/);
    return match ? match[2] : null;
  }

  async function handleDelete() {
    const broadcast = broadcastBeingDeleted;

    // delete image
    if (broadcast.image_url) {
      const path = extractPath(broadcast.image_url);
      await supabase.storage.from("broadcasts").remove([path]);
    }

    // delete row
    await supabase.from("broadcasts").delete().eq("id", broadcast.id);

    // notify feed
    triggerBroadcastDeleted(broadcast.id);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.title}>Eliminare il broadcast?</div>
        <div className={styles.subtitle}>L'azione non può essere annullata.</div>

        <button className={styles.deleteBtn} onClick={handleDelete}>
          Elimina
        </button>

        <button className={styles.cancelBtn} onClick={closeDeleteBroadcast}>
          Annulla
        </button>
      </div>
    </div>
  );
}
