import { createContext, useContext, useState } from "react";

const BroadcastContext = createContext();

export function BroadcastProvider({ children }) {
  // --- EDIT ---
  const [broadcastBeingEdited, setBroadcastBeingEdited] = useState(null);
  const [showEditBroadcast, setShowEditBroadcast] = useState(false);

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
  const [showDeleteBroadcastModal, setShowDeleteBroadcastModal] = useState(false);

  const openDeleteBroadcast = (broadcast) => {
    setBroadcastBeingDeleted(broadcast);
    setShowDeleteBroadcastModal(true);
  };

  const closeDeleteBroadcast = () => {
    setBroadcastBeingDeleted(null);
    setShowDeleteBroadcastModal(false);
  };

  const triggerBroadcastDeleted = (broadcastId) => {
    setBroadcastBeingDeleted(null);
    setShowDeleteBroadcastModal(false);
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
        showDeleteBroadcastModal,
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
