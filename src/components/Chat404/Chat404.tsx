import styles from "./Chat404.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Return from "../../../public/svgs/Return.svg";

const Chat404 = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.text}>Page not found</h2>
        <h3 className={styles.subText}>
          The page you are looking for does not exist.
        </h3>
      </div>
      <div className={styles.bottomContainer} onClick={() => router.push("/")}>
        <div className={styles.promptContainer}>
          <div className={styles.promptText}>Return</div>
          <div className={styles.sendButton}>
            <Image src={Return} alt="Return" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat404;
