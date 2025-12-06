import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BroadcastCard from "./BroadcastCard";
import styles from "./AnnouncementsList.module.css";
import AnnouncementSkeleton from "./AnnouncementSkeleton";

export default function AnnouncementsList({ refreshTrigger }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setTimeout(()=> setLoading(false), 500);
  }

    if (loading) {
      return (
        <>
          <AnnouncementSkeleton />
          <AnnouncementSkeleton />
          <AnnouncementSkeleton />
        </>
      );
    }

  return (
    <div className={styles.container}>
      {items.length === 0 && (
        <p className={styles.empty}>Nessun annuncio presente.</p>
      )}

       <div className="fadeIn">
        {items.map((item) => (
          <BroadcastCard key={item.id} broadcast={item} variant="icon"/>
        ))}
      </div>
    </div>
  );
}
