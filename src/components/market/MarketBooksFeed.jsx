import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import BookCard from "./BookCard";
import styles from "./MarketFeed.module.css";
import { useMarketContext } from "../../context/MarketContext";

export default function MarketBooksFeed() {
  const [books, setBooks] = useState([]);
  const { lastDeletedBookId, lastUpdatedBook, lastCreatedBook } = useMarketContext();

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (!lastDeletedBookId) return;

    setBooks((prev) =>
      prev.filter((b) => b.id !== lastDeletedBookId)
    );
  }, [lastDeletedBookId]);

  useEffect(() => {
    if (!lastUpdatedBook) return;

    setBooks((prev) =>
      prev.map((b) =>
        b.id === lastUpdatedBook.id ? lastUpdatedBook : b
      )
    );
  }, [lastUpdatedBook]);

  useEffect(() => {
    if (lastCreatedBook) setBooks([lastCreatedBook, ...books]);
  }, [lastCreatedBook]);

  async function loadBooks() {
    const { data, error } = await supabase
      .from("market_books")
      .select(`
        *,
        profiles ( username, avatar_url )
      `)
      .order("created_at", { ascending: false });

    if (!error) setBooks(data);
  }

  if (books.length === 0)
    return <p className={styles.empty}>Nessun libro in vendita</p>;

  return (
    <div className={styles.feed}>
      {books.map((b) => (
        <BookCard
          book={b}
          key={b.id}
          onUpdated={(updatedBook) => {
            setBooks((prev) =>
              prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
            );
          }}
          onDeleted={(id) => {
            setBooks((prev) => prev.filter((b) => b.id !== id));
          }}
        />
      ))}
    </div>
  );
}
