import styles from "./ItemCard.module.css";

export default function ItemCard({ item }) {
  return (
    <div className={styles.card}>
      {item.image_url && (
        <img className={styles.image} src={item.image_url} alt={item.title} />
      )}

      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>

        {item.category && (
          <span className={styles.category}>{item.category}</span>
        )}

        {item.price != null && (
          <p className={styles.price}>{item.price}€</p>
        )}
      </div>

      <div className={styles.user}>
        {item.profiles?.avatar_url && (
          <img
            className={styles.avatar}
            src={item.profiles.avatar_url}
            alt=""
          />
        )}
        <span>{item.profiles?.username}</span>
      </div>
    </div>
  );
}
