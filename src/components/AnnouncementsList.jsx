import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BroadcastCard from "./BroadcastCard";
import styles from "./AnnouncementsList.module.css";
import AnnouncementSkeleton from "./AnnouncementSkeleton";
import { useBroadcast } from "../context/broadcastContext";
import DeleteBroadcastModal from "./DeleteBroadcastModal";

export default function AnnouncementsList({ refreshTrigger }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {lastUpdatedBroadcast, showDeleteBroadcastModal, broadcastsToDelete} = useBroadcast();

  /* IMPORTANTE RIORDINARE I BROADCAST SE IN UNO VIENE MODIFICATO IL CAMPO PINNED */
  function sortBroadcasts(list) {
    return [...list].sort((a, b) => {
      // Prima i pinned
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Poi per data di creazione
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }

  // quando un broadcast viene aggiornato
    useEffect(() => {
      if (!lastUpdatedBroadcast) return;
  
      setBroadcasts((prev) => 
        sortBroadcasts(
          prev.map((b) =>
            b.id === lastUpdatedBroadcast.id ? lastUpdatedBroadcast : b
          )
        )
      );
    }, [lastUpdatedBroadcast]);
  
    // quando un broadcast viene eliminato
    useEffect(() => {
      if (!broadcastsToDelete) return;
  
      setBroadcasts((prev) =>
        prev.filter((b) => b.id !== broadcastsToDelete)
      );
    }, [broadcastsToDelete]);
      
  

  useEffect(() => {
    loadAnnouncements();
  }, [refreshTrigger]); // <-- si aggiorna al nuovo broadcast

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("broadcasts")
      .select("*")
      .order("pinned", {ascending: false})
      .order("created_at", { ascending: false });

    if (!error) setBroadcasts(data);
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
      {broadcasts.length === 0 && (
        <p className={styles.empty}>Nessun annuncio presente.</p>
      )}

       <div className="fadeIn">
        {broadcasts.map((item) => (
          <BroadcastCard key={item.id} broadcast={item} variant="icon"/>
        ))}
      </div>
      {showDeleteBroadcastModal && <DeleteBroadcastModal />}
    </div>
  );
}
