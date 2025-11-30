import { supabase } from "../lib/supabaseClient";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      Logout
    </button>
  );
}
