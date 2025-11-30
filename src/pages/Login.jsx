import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/";
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Login riuscito → vai alla Home
    window.location.href = "/";
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
