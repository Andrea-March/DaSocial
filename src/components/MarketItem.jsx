import styles from "./MarketItem.module.css";

export default function MarketItem({ title, price, image, description }) {
  return (
    <div className={styles.card}>
      {image && <img src={image} className={styles.image} alt="" />}

      <div className={styles.info}>
        <div className={styles.itemTitle}>{title}</div>
        <div className={styles.price}>{price}</div>
        <div className={styles.desc}>{description}</div>
      </div>
    </div>
  );
}
