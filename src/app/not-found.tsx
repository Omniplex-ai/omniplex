import styles from "@/styles/404.module.css";
import Link from "next/link";
import Image from "next/image";

import Return from "../../public/svgs/Return.svg";

const NotFound = () => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.text}>Page not found</h2>
          <h3 className={styles.subText}>
            The page you are looking for does not exist.
          </h3>
        </div>
      </div>
      <Link href="/">
        <div className={styles.bottomContainer}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Return</div>
            <div className={styles.sendButton}>
              <Image src={Return} alt="Return" width={24} height={24} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NotFound;
