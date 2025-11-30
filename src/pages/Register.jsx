import styles from "./Register.module.css";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Le password non coincidono");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name.toLowerCase(),
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Successo → redirect al login
    window.location.href = "/login";
  };

  const validateUsername = (u) => {
    const cleaned = u.trim().toLowerCase();
    const regex = /^[a-z0-9._]+$/; 
    return cleaned.length >= 3 && cleaned.length <= 20 && regex.test(cleaned);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (!validateUsername(value)) {
        setUsernameError("L'username deve essere 3-20 caratteri (solo lettere, numeri, . e _)");
    } else {
        setUsernameError("");
    }
  };

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>DaSocial</h1>
      <h2 className={styles.subtitle}>Crea un account</h2>

      <form className={styles.form} onSubmit={handleSubmit}>

        <label className={styles.label}>Username</label>
        <input
            type="text"
            className={styles.input}
            value={name}
            onChange={handleUsernameChange}
            placeholder="username"
        />
        {usernameError && (
            <p className={styles.error}>{usernameError}</p>
        )}

        <label className={styles.label}>Email scolastica</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@studenti.davinci.it"
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <label className={styles.label}>Conferma password</label>
        <input
          type="password"
          className={styles.input}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
        />

        <button type="submit" className={styles.registerBtn}>
          Registrati
        </button>
      </form>

      <p className={styles.smallText}>
        Hai già un account? 
        <span className={styles.link} onClick={() => window.location.href = "/login"}>
            Accedi
        </span>
      </p>
    </div>
  );
}
