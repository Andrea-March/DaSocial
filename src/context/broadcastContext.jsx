import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabaseClient";
const BroadcastContext = createContext();

export function BroadcastProvider({ children }) {
  // --- EDIT ---
  const [broadcastBeingEdited, setBroadcastBeingEdited] = useState(null);
  const [showEditBroadcast, setShowEditBroadcast] = useState(false);

  function extractPath(url) {
    const match = url.match(/public\/([^/]+)\/(.+)$/);
    return match ? match[2] : null;
  }

  async function deleteBroadcast() {
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

  const openEditBroadcast = (broadcast) => {
    setBroadcastBeingEdited(broadcast);
    setShowEditBroadcast(true);
  };

  const closeEditBroadcast = () => {
    setBroadcastBeingEdited(null);
    setShowEditBroadcast(false);
  };

  const triggerBroadcastUpdated = (updatedBroadcast) => {
    // Notifica il feed
    setLastUpdatedBroadcast(updatedBroadcast);

    // Chiudi modale
    setBroadcastBeingEdited(null);
    setShowEditBroadcast(false);
  };

  // --- DELETE ---
  const [broadcastBeingDeleted, setBroadcastBeingDeleted] = useState(null);

  const openDeleteBroadcast = (broadcast) => {
    setBroadcastBeingDeleted(broadcast);
  };

  const closeDeleteBroadcast = () => {
    setBroadcastBeingDeleted(null);
  };

  const triggerBroadcastDeleted = (broadcastId) => {
    setBroadcastBeingDeleted(null);
    setBroadcastsToDelete(broadcastId); // feed listener
  };

  // --- FEED LISTENERS ---
  const [lastUpdatedBroadcast, setLastUpdatedBroadcast] = useState(null);
  const [broadcastsToDelete, setBroadcastsToDelete] = useState(null);

  return (
    <BroadcastContext.Provider
      value={{
        // edit
        broadcastBeingEdited,
        showEditBroadcast,
        openEditBroadcast,
        closeEditBroadcast,
        triggerBroadcastUpdated,

        // delete
        broadcastBeingDeleted,
        deleteBroadcast,
        openDeleteBroadcast,
        closeDeleteBroadcast,
        triggerBroadcastDeleted,

        // feed notifications
        lastUpdatedBroadcast,
        broadcastsToDelete,
      }}
    >
      {children}
    </BroadcastContext.Provider>
  );
}

export const useBroadcast = () => useContext(BroadcastContext);
