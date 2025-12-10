import styles from "./DeleteMarketItemModal.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useMarketContext } from "../../context/MarketContext";

export default function DeleteMarketItemModal() {
  const {
    itemBeingDeleted,
    closeDeleteItem,
    triggerItemDeleted
  } = useMarketContext();

  if (!itemBeingDeleted) return null;

  function extractPath(url) {
    // Prende tutto dopo "public/{bucket}/"
    const match = url.match(/public\/([^/]+)\/(.+)$/);

    if (!match) return null;

    // match[2] = internal path → tipo: "market_items/filename.webp"
    return match[2];
  }

  async function handleDelete() {
    const item = itemBeingDeleted;

    // 1) DELETE image from storage
    if (item.image_url) {
      const path = extractPath(item.image_url);
      if (path) await supabase.storage.from("market_items").remove([path]);
    }

    // 2) DELETE row
    await supabase.from("market_items").delete().eq("id", item.id);

    // 3) Update feed
    triggerItemDeleted(item.id);

    // 4) Close modal
    closeDeleteItem();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.title}>Eliminare l'articolo?</div>
        <div className={styles.subtitle}>Questa azione non può essere annullata.</div>

        <button className={styles.deleteBtn} onClick={handleDelete}>
          Elimina
        </button>

        <button className={styles.cancelBtn} onClick={closeDeleteItem}>
          Annulla
        </button>
      </div>
    </div>
  );
}
