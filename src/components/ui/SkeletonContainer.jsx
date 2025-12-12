import styles from "./Skeleton.module.css";

export default function SkeletonContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}
