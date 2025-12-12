import { useState } from "react";
import TopTabs from "../components/layout/TopTabs";
import MarketBooksFeed from "../components/market/MarketBooksFeed";
import MarketItemsFeed from "../components/market/MarketItemsFeed";
import Fab from "../components/layout/Fab";
import NewMarketItem from "../components/market/NewMarketItem";
import NewMarketBook from "../components/market/NewMarketBook";
import MarketChoiceSheet from "../components/market/MarketChoiceSheet";
import styles from "./Market.module.css";
import Header from "../components/layout/Header";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useMarketContext } from "../context/MarketContext";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("books");

  const {bookBeingDeleted, deleteBook, closeDeleteBook} = useMarketContext();
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
        <Fab onClick={openFabSheet} />

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
          />
        )}
        <ConfirmModal
          open={!!bookBeingDeleted}
          title="Eliminare il libro?"
          subtitle="Questa azione non può essere annullata."
          confirmText="Elimina"
          danger
          onConfirm={deleteBook}
          onCancel={closeDeleteBook}
        />
      </div>
    </>
  );
}
