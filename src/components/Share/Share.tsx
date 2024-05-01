import React from "react";
import styles from "./Share.module.css";
import Image from "next/image";
import toast from "react-hot-toast";
import { Modal, ModalContent } from "@nextui-org/modal";
import { ChatThread } from "@/utils/types";
import {
  cutString,
  formatDateLong,
  getReadingTimeInMinutes,
} from "@/utils/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  chatThread: ChatThread;
};

const Share = (props: Props) => {
  const firstChat = props.chatThread.chats[0];
  const formattedDate = formatDateLong();
  const readingTime = getReadingTimeInMinutes(props.chatThread.chats);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
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
    props.onClose();
  };

  return (
    <Modal
      size={"lg"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>Share link to chat</div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.ogImage}>
                <div className={styles.textContainer}>
                  <div className={styles.question}>
                    {cutString(firstChat.question, 64)}
                  </div>
                  <div
                    className={styles.time}
                  >{`${formattedDate} - ${readingTime} min read`}</div>
                </div>
                <Image
                  width={50}
                  height={50}
                  src={"/Logo.svg"}
                  alt={"Omniplex"}
                  className={styles.logo}
                />
              </div>
              <div className={styles.button} onClick={handleShare}>
                <Image
                  width={18}
                  height={18}
                  src={"/svgs/Link.svg"}
                  alt={"Link"}
                />
                <div className={styles.buttonText}>Share</div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Share;
