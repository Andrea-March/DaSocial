import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabaseClient";
const MarketContext = createContext();

const MARKET_TABLES = {
  book: "market_books",
  item: "market_items",
};

export function MarketProvider({ children }) {



  const [confirmConfig, setConfirmConfig] = useState(null);

  const openConfirm = (config) => setConfirmConfig(config);
  const closeConfirm = () => setConfirmConfig(null);

  function extractPath(url) {
    const match = url.match(/public\/([^/]+)\/(.+)$/);
    if (!match) return null;
    return match[2];
  }

  function triggerItemUpdated(item){
    if (item.type === "book") {
      triggerBookUpdated(item.data);
    }

    if (item.type === "item") {
      triggerItemUpdated(item.data);
    }
  }


  async function markTargetSold({ type, id }) {
    const table = MARKET_TABLES[type];
    if (!table) {
      console.error("Unknown market target type:", type);
      return;
    }

    const { data, error } = await supabase
      .from(table)
      .update({ is_sold: true })
      .eq("id", id)
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    triggerItemUpdated({
      type,
      data,
    });
  }

  async function markTargetAvailable({ type, id }) {
    const table = MARKET_TABLES[type];
    if (!table) {
      console.error("Unknown market target type:", type);
      return;
    }

    const { data, error } = await supabase
      .from(table)
      .update({ is_sold: false })
      .eq("id", id)
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    triggerItemUpdated({
      type,
      data,
    });
  }

  function toggleTargetSold(target) {
    if (target.is_sold) {
      return markTargetAvailable(target);
    }
    return markTargetSold(target);
  }

  /* ---------- ITEMS ---------- */
  const [itemBeingDeleted, setItemBeingDeleted] = useState(null);
  const [lastDeletedItemId, setLastDeletedItemId] = useState(null);

  const openDeleteItem = (item) => setItemBeingDeleted(item);
  const closeDeleteItem = () => setItemBeingDeleted(null);

  const triggerItemDeleted = (id) => {
    setLastDeletedItemId(id);
  };

  /* ---------- BOOKS ---------- */
  const [lastDeletedBookId, setLastDeletedBookId] = useState(null);
  const [lastCreatedBook, setLastCreatedBook] = useState(null);

  const triggerBookDeleted = (id) => {
    setLastDeletedBookId(id);
  };

  const triggerBookCreated = (book) => {
    setLastCreatedBook(book);
  };


  async function deleteBook(book) {
    if (!book) return;

    // 1) delete image
    if (book.image_url) {
      const path = extractPath(book.image_url);
      if (path) {
        await supabase.storage
          .from("market_books")
          .remove([path]);
      }
    }

    // 2) delete row
    await supabase
      .from("market_books")
      .delete()
      .eq("id", book.id);

    // 3) update feed
    triggerBookDeleted(book.id);

    // 4) close modal
    closeConfirm();
  }

  const [lastUpdatedBook, setLastUpdatedBook] = useState(null);

  function triggerBookUpdated(book) {
    setLastUpdatedBook(book);
  }



  return (
    <MarketContext.Provider
      value={{
        confirmConfig,
        openConfirm,
        closeConfirm,

        toggleTargetSold,

        /* items */
        itemBeingDeleted,
        openDeleteItem,
        closeDeleteItem,
        triggerItemDeleted,
        lastDeletedItemId,

        /* books */
        triggerBookDeleted,
        lastDeletedBookId,

        lastCreatedBook,
        triggerBookCreated,

        lastUpdatedBook,
        triggerBookUpdated,
        deleteBook
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  return useContext(MarketContext);
}
