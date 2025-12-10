import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import BookCard from "./BookCard";
import styles from "./MarketFeed.module.css";

export default function MarketBooksFeed() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

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
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
