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
  const { openDeleteBook, triggerBookUpdated } = useMarketContext();

  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user?.id === book.user_id;

  async function handleMarkSold(book) {
    const { data, error } = await supabase
      .from("market_books")
      .update({ is_sold: true })
      .eq("id", book.id)
      .select(`
        *,
        profiles ( username, avatar_url )
      `)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    triggerBookUpdated(data);

  }

  async function handleDelete(book) {
    // 1. delete immagine storage
    // 2. delete record DB
  }

  function handleOffer(book) {
    // TODO: flusso richiesta acquisto
  }

  function handleReport(book) {
    // TODO: segnalazione
  }

  const actions = isOwner
    ? [
        !book.is_sold && {
          label: "Segna come venduto",
          onClick: () => handleMarkSold(book),
        },
        {
          label: "Elimina",
          danger: true,
          onClick: () => openDeleteBook(book)
        }
      ].filter(Boolean)
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
