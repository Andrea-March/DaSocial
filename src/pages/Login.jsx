import styles from "./Login.module.css";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("LOGIN:", email, password);
    // Qui poi colleghiamo Supabase
  };

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>DaSocial</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@liceodavincifi.edu.it"
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button type="submit" className={styles.loginBtn}>
          Accedi
        </button>
      </form>

        <p className={styles.smallText}>
            Password dimenticata? 
            <span 
                className={styles.link} 
                onClick={() => window.location.href = "/forgot-password"}
            >
                Recupera
            </span>
            </p>

            <p className={styles.smallText}>
            Non hai un account? 
            <span 
                className={styles.link} 
                onClick={() => window.location.href = "/register"}
            >
                Registrati
            </span>
        </p>
    </div>
  );
}
