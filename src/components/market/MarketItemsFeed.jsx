import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "./ItemCard";
import styles from "./MarketFeed.module.css";

export default function MarketItemsFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("market_items")
      .select(`
        *,
        profiles ( username, avatar_url )
      `)
      .order("created_at", { ascending: false });

    if (!error) setItems(data);
  }

  if (items.length === 0)
    return <p className={styles.empty}>Nessun oggetto in vendita</p>;

  return (
    <div className={styles.feed}>
      {items.map((i) => (
        <ItemCard key={i.id} item={i} />
      ))}
    </div>
  );
}
