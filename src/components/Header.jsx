import styles from "./Header.module.css";
import { User as UserIcon } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { usePostContext } from "../context/PostContext";

export default function Header() {
  const { user, profile } = useUser();
  const avatarUrl = profile?.avatar_url;
  const username = user?.user_metadata?.username;

  const navigate = useNavigate();

  const onProfileClick = () =>{
    navigate("/profile");
  }

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
