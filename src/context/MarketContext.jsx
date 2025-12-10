import { createContext, useContext, useState } from "react";

const MarketContext = createContext();

export function MarketProvider({ children }) {
  const [itemBeingDeleted, setItemBeingDeleted] = useState(null);
  const [lastDeletedItemId, setLastDeletedItemId] = useState(null);

  const openDeleteItem = (item) => setItemBeingDeleted(item);
  const closeDeleteItem = () => setItemBeingDeleted(null);

  const triggerItemDeleted = (id) => {
    setLastDeletedItemId(id);
  };

  return (
    <MarketContext.Provider value={{
      itemBeingDeleted,
      openDeleteItem,
      closeDeleteItem,
      triggerItemDeleted,
      lastDeletedItemId
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  return useContext(MarketContext);
}
