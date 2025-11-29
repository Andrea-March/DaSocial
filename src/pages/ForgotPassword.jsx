import styles from "./ForgotPassword.module.css";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("RESET PASSWORD REQUEST:", email);
    // Qui collegheremo Supabase (auth.resetPasswordForEmail)
  };

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>Recupera password</h1>
      <p className={styles.subtitle}>
        Inserisci la tua email scolastica per ricevere il link di reset.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>

        <label className={styles.label}>Email scolastica</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@studenti.davinci.it"
        />

        <button type="submit" className={styles.resetBtn}>
          Invia link di recupero
        </button>
      </form>

      <p className={styles.smallText}>
        Torna al 
        <span 
          className={styles.link}
          onClick={() => window.location.href = "/login"}
        >
          login
        </span>
      </p>
    </div>
  );
}
