import Header from "../components/Header";
import TopTabs from "../components/TopTabs";
import BottomNav from "../components/BottomNav";

import styles from "./Home.module.css";
import Post from "../components/Post";

const posts = [
  {
    id: 1,
    author: "Nome Utente",
    time: "3 ore fa",
    content: "Testo del post",
    image: "/mock/photo1.jpg",
    likes: 12,
    comments: [
      {
        id: 1,
        author: "Nome Utente",
        text: "Testo del commento",
        replies: [
          {
            id: 11,
            author: "Nome Utente",
            text: "Testo del sottocommento"
          }
        ]
      }
    ]
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
        <Header />
        <TopTabs />

        <div className={styles.content}>
            {posts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.title}>Nessun post ancora.</p>
                        <p className={styles.subtitle}>Premi il + in basso per crearne uno.</p>
                    </div>
                ) : (
                    <div className={styles.feed}>
                    {posts.map((p) => (
                        <Post key={p.id} post={p} />
                    ))}
                    </div>
                )}
        </div>

        <BottomNav />
    </div>
  );
}
