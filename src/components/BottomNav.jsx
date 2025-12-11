import styles from "./BottomNav.module.css";
import { Home, Megaphone, PlusCircle, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import NewPost from "./NewPost";
import { useNavigate, useLocation } from "react-router-dom";
import { usePostContext } from "../context/PostContext";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewPost, setShowNewPost] = useState(false);

  return (
    <nav className={styles.nav}>
        <div className={styles.item}
            onClick={() => navigate("/")}>
          <Home size={24} className={location.pathname === "/" ? styles.active : ""} />
        </div>

        <div className={styles.item}
            onClick={() => navigate("/broadcast")}>
          <Megaphone size={24} className={location.pathname === "/broadcast" ? styles.active : ""} />
        </div>

        <img
          src="/icons/android-chrome-192x192.png"
          alt="DaSocial"
          className={styles.logo} 
        />
        <div className={styles.item}
            onClick={() => navigate("/market")}>
          <ShoppingBag size={24} className={location.pathname === "/market" ? styles.active : ""} />
        </div>

        <div className={styles.item}
            onClick={() => navigate("/profile")}>
          <User size={24} className={location.pathname === "/profile" ? styles.active : ""} />
        </div>
        {showNewPost && <NewPost onClose={() => setShowNewPost(false)} />}
    </nav>
  );
}
