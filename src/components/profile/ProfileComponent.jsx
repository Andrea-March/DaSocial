import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import styles from "./ProfileComponent.module.css";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../context/ToastContext";
import { compressImage } from "../../lib/compressImage";
import { cropToSquare } from "../../lib/cropToSquare";
import Avatar from "../ui/Avatar";

export default function ProfileComponent() {
  const { user, profile, setProfile, avatarSrc } = useUser();
  const { showToast } = useToast();

  // Campi locali derivati da profiles
  const [bio, setBio] = useState(profile?.bio || "");
  const [classe, setClasse] = useState(profile?.classe || "");
  const [sezione, setSezione] = useState(profile?.sezione || "");

  const fileInputRef = useRef(null);

  const username = profile?.username;

  // --- UPLOAD AVATAR ---
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  async function handleFileChange(e) {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    // CLONE del file (fondamentale)
    const file = new File([originalFile], originalFile.name, {
      type: originalFile.type,
    });

    const MAX_SIZE_MB = 10;
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      showToast("L'immagine è troppo grande (max 10MB)", "error");
      return;
    }

    try {
      // 1) compressione + crop (utils condivise)
      const compressed = await compressImage(file);   
      const cropped = await cropToSquare(compressed); 

      /* const filePath = `avatars/${user.id}.webp`; */
      const filePath = `avatars/${user.id}.webp`;
      // 2) upload (sovrascrive automaticamente)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, cropped, {
          upsert: true,
          contentType: "image/webp",
        });

      if (uploadError) throw uploadError;

      // 3) url pubblico
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      const now = new Date().toISOString();

      // 4) update profilo
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          avatar_updated_at: now,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 5) stato locale
      setProfile((prev) => ({
        ...prev,
        avatar_url: publicUrl,
        avatar_updated_at: now,
      }));
      showToast("Foto aggiornata!", "success");

    } catch (err) {
      console.error(err);
      showToast("Errore durante l’aggiornamento dell’avatar", "error");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        {avatarSrc ? (
          <Avatar
            userId={user.id}
            username={profile.username}
            size="lg"
            clickable
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className={styles.changePhoto} onClick={handleAvatarClick}>Cambia foto</div>
      <input
        accept="image/*"
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

