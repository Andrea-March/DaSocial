import styles from "./Header.module.css";
import { User as UserIcon } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Header({ onProfileClick }) {
  const { user } = useUser();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.username;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>DaSocial</h1>

      <button className={styles.avatarButton} onClick={onProfileClick}>
        {avatarUrl ? (
          <img src={avatarUrl} className={styles.avatarImg} alt="avatar" />
        ) : username ? (
          <div className={styles.avatarFallback}>
            {username[0].toUpperCase()}
          </div>
        ) : (
          <UserIcon size={20} />
        )}
      </button>
    </header>
  );
}
