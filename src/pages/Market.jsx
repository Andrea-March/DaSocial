import { useState } from "react";
import TopTabs from "../components/TopTabs";
import MarketBooksFeed from "../components/MarketBooksFeed";
import MarketItemsFeed from "../components/MarketItemsFeed";
import MarketFab from "../components/MarketFab";
import NewMarketItem from "../components/NewMarketItem";
import styles from "./Market.module.css";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("books");
  const [showNewItem, setShowNewItem] = useState(false);

  const tabs = [
    { label: "Libri", value: "books" },
    { label: "Oggetti", value: "items" }
  ];

  return (
    <div className={styles.container}>
      <TopTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === "books" && <MarketBooksFeed />}
      {activeTab === "items" && <MarketItemsFeed />}

      {/* FAB */}
      <MarketFab onClick={() => setShowNewItem(true)} />

      {/* MODALE */}
      {showNewItem && (
        <NewMarketItem
          onClose={() => setShowNewItem(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}
