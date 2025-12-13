import { useState } from "react";
import BookImagePreview from "./BookImagePreview";
import styles from "./BookCard.module.css";
import { MoreVertical } from "lucide-react";
import { useUser } from "../../context/UserContext";
import ActionMenu from "../ui/ActionMenu";
import { supabase } from "../../lib/supabaseClient";
import { useMarketContext } from "../../context/MarketContext";


export default function BookCard({ book }) {
  const [showPreview, setShowPreview] = useState(false);
  const imageSrc = book.image_url || "/placeholder-book.svg";
  const { openConfirm, deleteBook, toggleTargetSold, closeDeleteItem } = useMarketContext();

  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user?.id === book.user_id;

  function handleToggleSold(book) {
    if (book.is_sold) {
       toggleTargetSold({
            type: "book",
            id: book.id,
            is_sold: book.is_sold,
        })
    } else {
      // conferma solo quando segni come venduto
      openConfirm({
        title: "Segnare come venduto?",
        description: "Il libro verrà contrassegnato come venduto.",
        confirmLabel: "Segna come venduto",
        onConfirm: () =>  toggleTargetSold({
            type: "book",
            id: book.id,
            is_sold: book.is_sold,
        }),
      });
    }
  }



  function handleOffer(book) {
    // TODO: flusso richiesta acquisto
  }

  function handleReport(book) {
    // TODO: segnalazione
  }

  

  const actions = isOwner
    ? [
        {
          label: book.is_sold
            ? "Rimetti disponibile"
            : "Segna come venduto",
          onClick: () =>
            handleToggleSold(book)
        },
        {
          label: "Elimina",
          danger: true,
          onClick: () =>
            openConfirm({
              title: "Eliminare il libro?",
              subtitle: "Questa azione non può essere annullata.",
              confirmText: "Elimina",
              danger: true,
              onConfirm: () => deleteBook(book),
              onCancel: () => closeDeleteItem(),
            }),
        }
      ]
    : [
        {
          label: "Fai un’offerta",
          onClick: () => handleOffer(book),
        },
        {
          label: "Segnala",
          danger: true,
          onClick: () => handleReport(book),
        },
      ];

  return (
    <>
      <div className={`${styles.card} ${book.is_sold ? styles.sold : ""}`}>
        {book.is_sold && <div className={styles.badge}>Venduto</div>}
        {/* ACTIONS */}
        <button
          className={styles.menuBtn}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(true);
          }}
        >
          <MoreVertical size={18} />
        </button>
        
        {/* COVER CLICKABLE */}
        
        <div
          className={styles.imageWrapper}
          onClick={() => setShowPreview(true)}
        >
          <img className={styles.image} src={imageSrc} alt={book.title} />
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          {book.author && <p className={styles.author}>{book.author}</p>}
          {book.price && <p className={styles.price}>{book.price}€</p>}
          <div className={styles.user}>
            <img className={styles.avatar} src={book.profiles.avatar_url} alt="" />
            <span>{book.profiles.username}</span>
          </div>
        </div>
        <ActionMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          actions={actions}
        />

      </div>
      
      {/* FULLSCREEN PREVIEW */}
      {showPreview && (
        <BookImagePreview src={imageSrc} onClose={() => setShowPreview(false)} />
      )}
      
    </>
  );
}
