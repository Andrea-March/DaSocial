import { useEffect, useRef } from "react";
import styles from "./ActionMenu.module.css";

export default function ActionMenu({
  open,
  onClose,
  actions = [],
  backdrop = true,
}) {

  const menuRef = useRef();

  // Chiudi cliccando fuori
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        open
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className={backdrop ? styles.backdrop : ""} onClick={onClose} />

      {/* MENU */}
      <div ref={menuRef} className={`${styles.menu} ${styles.menuOpen}`}>
        {actions.map((a, i) => (
          <div
            key={i}
            className={a.danger ? styles.menuItemDelete : styles.menuItem}
            onClick={() => {
              a.onClick();
              onClose();
            }}
          >
            {a.label}
          </div>
        ))}
      </div>
    </>
  );
}
