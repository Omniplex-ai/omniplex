import styles from "./ChatFetch.module.css";
import { Skeleton } from "@nextui-org/skeleton";

const ChatFetch = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonTextRow}>
        <Skeleton className={styles.skeletonImg} />
        <Skeleton className={styles.skeletonText} />
      </div>
      <Skeleton className={styles.skeletonLine} />
      <Skeleton className={styles.skeletonLine} />
      <Skeleton className={styles.skeletonLine} />
    </div>
  );
};

export default ChatFetch;
