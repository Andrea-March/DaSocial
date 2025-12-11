import { useState } from "react";
import { useUser } from "../context/UserContext";
import styles from "./Broadcast.module.css";
import NewBroadcast from "../components/NewBroadcast";
import TopTabs from "../components/TopTabs";
import AnnouncementsList from "../components/AnnouncementsList";
import EventsList from "../components/EventsList";
import { useBroadcast } from "../context/broadcastContext";
import Header from "../components/Header";
import Fab from "../components/Fab";
import ConfirmModal from "../components/ConfirmModal";

export default function Broadcast() {
  const [lastCreatedBroadcast, setLastCreatedBroadcast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {profile, canPublishBroadcast} = useUser();
  const [tab, setTab] = useState("announcements");

  const {
    broadcastBeingEdited, 
    showEditBroadcast, 
    closeEditBroadcast, 
    setLastUpdatedBroadcast, 
    broadcastBeingDeleted,
    deleteBroadcast,
    closeDeleteBroadcast
    } = useBroadcast();

  return (
    <> 
      <Header />
      <div className={styles.container}>
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
          <Fab onClick={() => setShowModal(true)} />
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
        {showEditBroadcast && (
          <NewBroadcast
            onClose={() => closeEditBroadcast()}
            onCreated={(newB) => {
              // Aggiorna lista senza ricaricare pagina
              setLastUpdatedBroadcast(newB);
              closeEditBroadcast();
            }}
            broadcastToEdit={broadcastBeingEdited}
          />
        )}
        <ConfirmModal
          open={!!broadcastBeingDeleted}
          title="Eliminare l'annuncio?"
          subtitle="Questa azione non può essere annullata."
          confirmText="Elimina"
          danger
          onConfirm={deleteBroadcast}
          onCancel={closeDeleteBroadcast}
        />
      </div>
    </>
  );
}
