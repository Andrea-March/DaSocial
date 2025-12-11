import { useState } from "react";
import TopTabs from "../components/TopTabs";
import MarketBooksFeed from "../components/MarketBooksFeed";
import MarketItemsFeed from "../components/MarketItemsFeed";
import MarketFab from "../components/MarketFab";
import NewMarketItem from "../components/NewMarketItem";
import NewMarketBook from "../components/NewMarketBook";
import MarketChoiceSheet from "../components/MarketChoiceSheet";
import styles from "./Market.module.css";
import Header from "../components/Header";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("books");

  // NEW STATES
  const [showChoiceSheet, setShowChoiceSheet] = useState(false);
  const [modalType, setModalType] = useState(null);

  const tabs = [
    { label: "Libri", value: "books" },
    { label: "Oggetti", value: "items" }
  ];

  function openFabSheet() {
    setShowChoiceSheet(true);
  }

  function handleChoice(type) {
    setShowChoiceSheet(false);
    setModalType(type); // "book" oppure "item"
  }

  function closeModal() {
    setModalType(null);
  }

  return (
    <>
      <Header />

      <div className={styles.container}>
        <TopTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {activeTab === "books" && <MarketBooksFeed />}
        {activeTab === "items" && <MarketItemsFeed />}

        {/* FAB */}
        <MarketFab onOpenSheet={openFabSheet} />

        {/* BOTTOM SHEET SCELTA */}
        {showChoiceSheet && (
          <MarketChoiceSheet
            onClose={() => setShowChoiceSheet(false)}
            onSelect={handleChoice}
          />
        )}

        {/* MODALI */}
        {modalType === "item" && (
          <NewMarketItem
            onClose={closeModal}
            onCreated={() => {}}
          />
        )}

        {modalType === "book" && (
          <NewMarketBook
            onClose={closeModal}
            onCreated={() => {}}
          />
        )}
      </div>
    </>
  );
}
