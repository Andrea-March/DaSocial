import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import { Plus } from "lucide-react";
import styles from "./Broadcast.module.css";
import BroadcastCard from "../components/BroadcastCard";
import BottomNav from "../components/BottomNav";
import NewBroadcast from "../components/NewBroadcast";

export default function Broadcast() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {profile, canPublishBroadcast} = useUser();

  useEffect(() => {
    async function loadBroadcasts() {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading broadcasts:", error);
      } else {
        setBroadcasts(data);
      }

      setLoading(false);
    }

    loadBroadcasts();
  }, []);

  return (
    <div className={styles.container}>
      <>
      <h1 className={styles.title}>Broadcast</h1>
      {profile && canPublishBroadcast() && (
        <button
          className={styles.newBroadcastBtn}
          onClick={() => setShowModal(true)}
        >
          <Plus />
        </button>
      )}
      </>

      {loading && <div className={styles.loading}>Caricamento…</div>}

      {!loading && broadcasts.length === 0 && (
        <div className={styles.empty}>Nessun annuncio disponibile</div>
      )}

      {!loading &&
        broadcasts.map((b) => (
          <BroadcastCard key={b.id} broadcast={b} />
        ))}
      {showModal && (
        <NewBroadcast
          onClose={() => setShowModal(false)}
          onCreated={(newB) => {
            // Aggiorna lista senza ricaricare pagina
            setBroadcasts((prev) => [newB, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
