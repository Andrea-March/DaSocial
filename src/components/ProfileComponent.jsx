import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import styles from "./ProfileComponent.module.css";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";
import { compressImage } from "../lib/compressImage";

export default function ProfileComponent() {
  const { user, profile, setProfile } = useUser();
  const { showToast } = useToast();

  // Campi locali derivati da profiles
  const [bio, setBio] = useState(profile?.bio || "");
  const [classe, setClasse] = useState(profile?.classe || "");
  const [sezione, setSezione] = useState(profile?.sezione || "");

  const fileInputRef = useRef(null);

  const avatarUrl = profile?.avatar_url;
  const username = profile?.username;

  // --- UPLOAD AVATAR ---
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  async function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  // --- LIMITE MAX 10 MB ---
  const MAX_SIZE_MB = 10;
  if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
    showToast("L'immagine è troppo grande (max 10MB)", "error");
    return;
  }

  // --- COMPRESSIONE ---
  const compressed = await compressImage(file);

  // --- CROP 1:1 ---
  const cropped = await cropToSquare(compressed);

  // --- Genera nuovo filePath ---
  const fileExt = "webp"; // meglio forzare sempre webp dopo compressione
  const fileName = `${user.id}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // --- 1) Recupera il vecchio avatar ---
  const { data: profileData } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  const oldUrl = profileData?.avatar_url;
  let oldPath = null;

  if (oldUrl) {
    // Estrai solo "<folder>/<filename>"
    const parts = oldUrl.split("/storage/v1/object/public/avatars/");
    if (parts[1]) oldPath = "avatars/" + parts[1];
  }

  // --- 2) Upload nuovo avatar ---
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, cropped, {
      upsert: true,
      contentType: "image/webp",
    });

  if (uploadError) {
    console.error(uploadError);
    showToast("Errore durante il caricamento", "error");
    return;
  }

  // --- 3) Se esiste il vecchio avatar → cancellalo ---
  if (oldPath && oldPath !== filePath) {
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([oldPath]);

    if (deleteError) {
      console.warn("Impossibile eliminare il vecchio avatar:", deleteError);
      // Non blocchiamo l'utente per un errore di pulizia
    }
  }

  // --- 4) Ottieni nuovo URL pubblico ---
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // --- 5) Aggiorna profilo ---
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (error) {
    showToast("Errore durante l’aggiornamento", "error");
    return;
  }

  // --- 6) Aggiorna stato ---
  setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
  showToast("Foto aggiornata!", "success");
}


  // --- SALVATAGGIO BIO + CLASSE & SEZIONE ---
  async function handleSave() {
    const { error } = await supabase
      .from("profiles")
      .update({
        bio,
        classe,
        sezione,
      })
      .eq("id", user.id);

    if (error) {
      showToast("Errore durante il salvataggio", "error");
      return;
    }

    // Aggiorna nel context
    setProfile((prev) => ({
      ...prev,
      bio,
      classe,
      sezione,
    }));

    showToast("Profilo aggiornato!", "success");
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Il tuo profilo</div>

      {/* AVATAR */}
      <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
        {avatarUrl ? (
          <img src={avatarUrl} className={styles.avatar} alt="Profile" />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className={styles.changePhoto}>Cambia foto</div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* CARD PROFILO */}
      <div className={styles.card}>
        <div className={styles.label}>Email</div>
        <div className={styles.value}>{user.email}</div>

        <div className={styles.label}>Username</div>
        <div className={styles.value}>{username || "—"}</div>

        <div className={styles.label}>Bio</div>
        <textarea
          className={styles.textArea}
          placeholder="Scrivi qualcosa su di te..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Classe</div>
            <input
              className={styles.input}
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              placeholder="es. 3"
            />
          </div>

          <div className={styles.column}>
            <div className={styles.label}>Sezione</div>
            <input
              className={styles.input}
              value={sezione}
              onChange={(e) => setSezione(e.target.value)}
              placeholder="es. B"
            />
          </div>
        </div>
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        Salva modifiche
      </button>
    </div>
  );
}

async function cropToSquare(imageFile) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = () => {
      const size = Math.min(img.width, img.height);

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        size,
        size
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.9);
    };
  });
}