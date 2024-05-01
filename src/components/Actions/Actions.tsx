import React from "react";
import styles from "./Actions.module.css";
import Image from "next/image";
import ShareModal from "../Share/Share";
import toast from "react-hot-toast";
import { useDisclosure } from "@nextui-org/react";
import { Chat, ChatThread } from "@/utils/types";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/authSlice";

import Copy from "../../../public/svgs/Copy.svg";
import Share from "../../../public/svgs/Share.svg";
import Rewrite from "../../../public/svgs/Rewrite.svg";

type Props = {
  fork?: boolean;
  chat: Chat;
  rewrite: () => void;
  chatThread: ChatThread;
};

const Actions = (props: Props) => {
  const authState = useSelector(selectAuthState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.chat.answer);
      toast.success("Copied", {
        position: "top-center",
        style: {
          padding: "6px 18px",
          color: "#fff",
          background: "#61d345",
        },
      });
    } catch (err) {
      toast.error("Failed to copy!", {
        position: "top-center",
        style: {
          padding: "6px 18px",
          color: "#fff",
          background: "#FF4B4B",
        },
      });
    }
  };

  return (
    <div className={styles.actionRow}>
      {authState && (
        <div className={styles.actionContainer} onClick={onOpen}>
          <Image src={Share} alt="Share" className={styles.action} />
          <p className={styles.actionText}>Share</p>
        </div>
      )}
      {!props.fork && (
        <div className={styles.actionContainer} onClick={() => props.rewrite()}>
          <Image src={Rewrite} alt="Rewrite" className={styles.action} />
          <p className={styles.actionText}>Rewrite</p>
        </div>
      )}
      <div className={styles.actionContainer} onClick={handleCopy}>
        <Image src={Copy} alt="Copy" className={styles.action} />
        <p className={styles.actionText}>Copy</p>
      </div>
      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        chatThread={props.chatThread}
      />
    </div>
  );
};

export default Actions;
