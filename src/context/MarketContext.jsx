import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabaseClient";
const MarketContext = createContext();

export function MarketProvider({ children }) {

  function extractPath(url) {
    const match = url.match(/public\/([^/]+)\/(.+)$/);
    if (!match) return null;
    return match[2];
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
  const [bookBeingDeleted, setBookBeingDeleted] = useState(null);
  const [lastDeletedBookId, setLastDeletedBookId] = useState(null);
  const [lastCreatedBook, setLastCreatedBook] = useState(null);

  const openDeleteBook = (book) => setBookBeingDeleted(book);
  const closeDeleteBook = () => setBookBeingDeleted(null);

  const triggerBookDeleted = (id) => {
    setLastDeletedBookId(id);
  };

  const triggerBookCreated = (book) => {
    setLastCreatedBook(book);
  };


  async function deleteBook() {
    if (!bookBeingDeleted) return;

    const book = bookBeingDeleted;

    // 1) delete image
    if (book.image_url) {
      const path = extractPath(book.image_url);
      console.log(path)
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
    closeDeleteBook();
  }

  const [lastUpdatedBook, setLastUpdatedBook] = useState(null);
  function triggerBookUpdated(book) {
    setLastUpdatedBook(book);
  }



  return (
    <MarketContext.Provider
      value={{
        /* items */
        itemBeingDeleted,
        openDeleteItem,
        closeDeleteItem,
        triggerItemDeleted,
        lastDeletedItemId,

        /* books */
        bookBeingDeleted,
        openDeleteBook,
        closeDeleteBook,
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
