import styles from "./Broadcast.module.css";
import BroadcastCard from "../components/BroadcastCard";
import BottomNav from "../components/BottomNav";

const mockBroadcasts = [
  {
    id: 1,
    title: "Assemblea di Istituto",
    time: "Oggi alle 10:00",
    content: "Si ricorda che oggi alle 10 si terrà l'assemblea di istituto in aula magna.",
  },
  {
    id: 2,
    title: "Avviso importante",
    time: "Ieri",
    content: "Domani i corsi termineranno alle 12:00 per riunione docenti.",
  }
];

export default function Broadcast() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Broadcast</h1>

      {mockBroadcasts.map(b => (
        <BroadcastCard
          key={b.id}
          title={b.title}
          time={b.time}
          content={b.content}
        />
      ))}
      <BottomNav />
    </div>
  );
}
