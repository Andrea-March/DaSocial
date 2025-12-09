import { useState, useRef, useEffect } from "react";
import styles from "./NewBroadcast.module.css";

import { X, Image as ImageIcon } from "lucide-react";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";
import imageCompression from "browser-image-compression";
import { useBroadcast } from "../context/broadcastContext";

export default function NewBroadcast({ onClose, onCreated, broadcastToEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  // --- EVENTO ---
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { user, canEditBroadcast } = useUser();
  const { showToast } = useToast();
  const { triggerBroadcastUpdated, closeEditBroadcast } = useBroadcast();

  const MAX_TITLE = 100;
  const MAX_CONTENT = 2000;
  const MAX_SIZE_MB = 10;

  useEffect(() => {
    if (broadcastToEdit) {
      setTitle(broadcastToEdit.title || "");
      setContent(broadcastToEdit.content || null);
      setPinned(broadcastToEdit.pinned);
      setIsEvent(!!broadcastToEdit.event_date);
      setEventDate(broadcastToEdit.event_date ?? null);
      setImagePreview(broadcastToEdit.image_url ?? null);
    }
  }, [broadcastToEdit]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast("Inserisci un titolo.", "error");
      return;
    }

    if (isEvent && !eventDate) {
      showToast("Se è un evento, devi inserire una data.", "error");
      return;
    }

    if (!user) {
      showToast("Errore: utente non autenticato.", "error");
      return;
    }

    let uploadedImageUrl = null;

    // --- IMMAGINE ---
    if (imagePreview) {
      const file = fileInputRef.current?.files?.[0];

      if (file && file.size / 1024 / 1024 > MAX_SIZE_MB) {
        showToast("L'immagine è troppo grande (max 10MB)", "error");
        return;
      }

      if (file) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1600,
          fileType: "image/webp",
          useWebWorker: true
        });

        const ext = "webp";
        const fileName = `${user.id}_${Date.now()}.${ext}`;
        const filePath = `broadcasts/${fileName}`;
        const finalFile = new File([compressed], fileName, { type: "image/webp" });

        const { error: uploadError } = await supabase.storage
          .from("broadcasts")
          .upload(filePath, finalFile);

        if (uploadError) {
          console.error(uploadError);
          showToast("Errore upload immagine.", "error");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("broadcasts")
          .getPublicUrl(filePath);

        uploadedImageUrl = urlData.publicUrl;
      }
    }

    // --- CREA BROADCAST ---
    const { data, error } = await supabase
      .from("broadcasts")
      .insert({
        title,
        content,
        pinned,
        image_url: uploadedImageUrl,
        author_id: user.id,
        event_date: isEvent ? eventDate : null
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast("Errore nella pubblicazione.", "error");
      return;
    }

    showToast("Broadcast pubblicato!", "success");

    onCreated?.(data);
    onClose();
  };

  function extractPath(url) {
    // Prende tutto dopo "public/{bucket}/"
    const match = url.match(/public\/([^/]+)\/(.+)$/);

    if (!match) return null;

    // match[1] = bucket ("posts")
    // match[2] = internal path ("posts/filename.webp")
    return match[2];
  }

  async function handleUpdateBroadcast() {
    if (!user) {
      showToast("Devi essere loggato", "error");
      return;
    }

    // Permessi: puoi mettere ruolo admin o canPublishBroadcast()
    if (!canEditBroadcast()) {
      showToast("Non hai i permessi per modificare questo broadcast", "error");
      return;
    }

    let newImageUrl = broadcastToEdit.image_url;
    let oldImagePath = null;

    // --- 1. Immagine rimossa ---
    if (!imagePreview && broadcastToEdit.image_url) {
      oldImagePath = extractPath(broadcastToEdit.image_url);
      newImageUrl = null;
    }

    // --- 2. Immagine cambiata ---
    if (imagePreview && fileInputRef.current?.files?.[0]) {
      // Se esiste un'immagine precedente -> la elimineremo dopo
      if (broadcastToEdit.image_url) {
        oldImagePath = extractPath(broadcastToEdit.image_url);
      }

      const file = fileInputRef.current.files[0];

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        fileType: "image/webp",
        useWebWorker: true
      });

      const newName = `${user.id}_${Date.now()}.webp`;
      const filePath = `broadcasts/${newName}`;

      const finalFile = new File([compressed], newName, { type: "image/webp" });

      await supabase.storage.from("broadcasts").upload(filePath, finalFile);

      const { data } = supabase.storage.from("broadcasts").getPublicUrl(filePath);
      newImageUrl = data.publicUrl;
    }

    // --- 3. UPDATE via funzione custom che ritorna il broadcast completo ---
   const { data, error } = await supabase.rpc("update_broadcast_get_full", {
      bid: broadcastToEdit.id,
      new_title: title,
      new_content: content,
      new_image_url: newImageUrl,
      new_event_date: eventDate ?? null,
      new_pinned: pinned
    });

    if (error) {
      console.error(error);
      showToast("Errore nell'aggiornamento del broadcast", "error");
      return;
    }

    // --- 4. Rimuovi vecchia immagine se necessario ---
    if (oldImagePath) {
      await supabase.storage.from("broadcasts").remove([oldImagePath]);
    }

    // --- 5. Notifica il feed ---
    triggerBroadcastUpdated(data);

    closeEditBroadcast();
  }


  return (
    <div className={styles.overlay}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.cancel} onClick={onClose}>Annulla</button>
          <span className={styles.title}>Nuovo broadcast</span>
          <button
            className={`${styles.publish} ${
              title.trim() === "" ? styles.disabled : ""
            }`}
            onClick={title.trim() === "" ? undefined : broadcastToEdit ? handleUpdateBroadcast : handlePublish}
          >
            {broadcastToEdit ? "Aggiorna" : "Pubblica"}
          </button>
        </div>

        {/* INPUT TITOLO */}
        <input
          className={styles.titleInput}
          placeholder="Titolo"
          maxLength={MAX_TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* TEXTAREA CONTENUTO */}
        <textarea
          className={styles.textarea}
          placeholder="Scrivi l'annuncio..."
          maxLength={MAX_CONTENT}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* SWITCH PINNED */}
        <label className={styles.switchRow}>
          <span>Fissa in alto</span>
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
        </label>

        {/* SWITCH EVENTO */}
        <label className={styles.switchRow}>
          <span>Questo è un evento</span>
          <input
            type="checkbox"
            checked={isEvent}
            onChange={(e) => {
              const val = e.target.checked;
              setIsEvent(val);
              if (!val) setEventDate(null);
            }}
          />
        </label>

        {/* DATA EVENTO */}
        {isEvent && (
          <input
            type="date"
            className={styles.dateInput}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        )}

        {/* IMMAGINE */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImage}
          hidden
        />

        <div className={styles.imageSection}>
          {imagePreview ? (
            <div className={styles.previewWrapper}>
              <img src={imagePreview} className={styles.imagePreview} />

              <span
                className={styles.changeImage}
                onClick={() => fileInputRef.current.click()}
              >
                Cambia
              </span>

              <span
                className={styles.removeImage}
                onClick={() => setImagePreview(null)}
              >
                Rimuovi
              </span>
            </div>
          ) : (
            <div
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current.click()}
            >
              <ImageIcon size={20} />
              <span>Carica immagine</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
