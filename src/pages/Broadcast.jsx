import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import { Plus } from "lucide-react";
import styles from "./Broadcast.module.css";
import BroadcastCard from "../components/BroadcastCard";
import NewBroadcast from "../components/NewBroadcast";
import TopTabs from "../components/TopTabs";
import AnnouncementsList from "../components/AnnouncementsList";
import EventsList from "../components/EventsList";

export default function Broadcast() {
  const [lastCreatedBroadcast, setLastCreatedBroadcast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {profile, canPublishBroadcast} = useUser();
  const [tab, setTab] = useState("announcements");



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Broadcast</h1>
      <TopTabs
        tabs={[
          { label: "Annunci", value: "announcements" },
          { label: "Eventi", value: "events" }
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "announcements" && (
        <AnnouncementsList refreshTrigger={lastCreatedBroadcast} />
      )}

      {tab === "events" && (
        <EventsList refreshTrigger={lastCreatedBroadcast} />
      )}
      <>
      
      {profile && canPublishBroadcast() && (
        <button
          className={styles.newBroadcastBtn}
          onClick={() => setShowModal(true)}
        >
          <Plus />
        </button>
      )}
      </>
      {showModal && (
        <NewBroadcast
          onClose={() => setShowModal(false)}
          onCreated={(newB) => {
            // Aggiorna lista senza ricaricare pagina
            setLastCreatedBroadcast(newB);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
