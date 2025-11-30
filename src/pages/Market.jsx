import styles from "./Market.module.css";
import MarketItem from "../components/MarketItem";

const mockItems = [
  {
    id: 1,
    title: "Libro di Matematica - Edizione Blu",
    price: "€12",
    image: "/mock/book.jpg",
    description: "Buone condizioni, qualche evidenziatura.",
  },
  {
    id: 2,
    title: "Fisica Vol.2 Zanichelli",
    price: "€9",
    image: "/mock/physics.jpg",
    description: "Condizioni ottime.",
  }
];

export default function Market() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mercatino</h1>

      {mockItems.map(item => (
        <MarketItem
          key={item.id}
          title={item.title}
          price={item.price}
          image={item.image}
          description={item.description}
        />
      ))}
    </div>
  );
}
