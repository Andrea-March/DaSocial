import styles from "./Avatar.module.css";
import { useUser } from "../../context/UserContext";

export default function Avatar({
  userId,
  avatarUrl,
  username,
  size = "md",
  clickable = false,
}) {
  const { user, avatarSrc } = useUser();

  const isMine = userId === user?.id;

  const src = isMine
    ? avatarSrc
    : avatarUrl;

  const initial = username?.[0]?.toUpperCase() || "?";

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${
        clickable ? styles.clickable : ""
      }`}
    >
      {src ? (
        <img src={src} alt="avatar" />
      ) : (
        <div className={styles.fallback}>{initial}</div>
      )}
    </div>
  );
}
