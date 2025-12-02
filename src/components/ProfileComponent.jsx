import { useRef, useState } from "react";
import styles from "./ProfileComponent.module.css";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";

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

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload su storage
    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      showToast("Errore durante il caricamento dell’immagine", "error");
      return;
    }

    // Prende URL pubblico
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Aggiorna DB
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (error) {
      showToast("Errore durante l’aggiornamento del profilo", "error");
      return;
    }

    // Aggiorna il context (UI immediata)
    setProfile((prev) => ({
      ...prev,
      avatar_url: publicUrl,
    }));

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
