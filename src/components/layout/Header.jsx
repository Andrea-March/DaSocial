import styles from "./Header.module.css";
import { User as UserIcon } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";

export default function Header() {
  const { user, profile, avatarSrc } = useUser();
  const username = user?.user_metadata?.username;

  const navigate = useNavigate();

  const onProfileClick = () =>{
    navigate("/profile");
  }

  return (
    <header className={styles.header}>
      <img
        src="/icons/android-chrome-192x192.png"
        alt="DaSocial"
        className={styles.logo} />

      <h1 className={styles.title}>
      DaSocial</h1>
      
      <button className={styles.avatarButton} onClick={onProfileClick}>
         <Avatar
            userId={user.id}
            username={profile.username}
            size="sm"
            clickable
          />
      </button>
    </header>
  );
}
