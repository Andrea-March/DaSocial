import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BroadcastCard from "./BroadcastCard";
import styles from "./AnnouncementsList.module.css";

export default function AnnouncementsList({ refreshTrigger }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, [refreshTrigger]); // <-- si aggiorna al nuovo broadcast

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("broadcasts")
      .select("*")
      .order("pinned", {ascending: false})
      .order("created_at", { ascending: false });

    if (!error) setItems(data);
  }

  return (
    <div className={styles.container}>
      {items.length === 0 && (
        <p className={styles.empty}>Nessun annuncio presente.</p>
      )}

      {items.map((item) => (
        <BroadcastCard key={item.id} broadcast={item} />
      ))}
    </div>
  );
}
