import LogoutButton from "../components/LogoutButton";
import styles from "./Profile.module.css";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profilo</h1>

      {user && (
        <div className={styles.infoBox}>
          <div className={styles.label}>Email</div>
          <div className={styles.value}>{user.email}</div>

          <div className={styles.label}>Username</div>
          <div className={styles.value}>{user.user_metadata?.username}</div>
        </div>
      )}

      <LogoutButton />
    </div>
  );
}
