import React, { useState } from "react";
import styles from "./Prompt.module.css";
import Image from "next/image";

import Arrow from "../../../public/svgs/Arrow.svg";
import Retry from "../../../public/svgs/Retry.svg";
import Fork from "../../../public/svgs/Fork.svg";
import Stop from "../../../public/svgs/Stop.svg";

type Props = {
  fork?: boolean;
  error: string;
  block: boolean;
  streaming: boolean;
  handleSend: (text: string) => void;
  handleCancel: () => void;
  handleRetry: () => void;
  handleFork: () => void;
};

const Prompt = (props: Props) => {
  const [text, setText] = useState("");

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && text.trim() !== "") {
      event.preventDefault();
      props.handleSend(text);
      setText("");
    }
  };

  return (
    <>
      {props.fork ? (
        <div className={styles.forkContainer} onClick={props.handleFork}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Fork Thread</div>
            <div className={styles.retryButton}>
              <Image src={Fork} alt="Fork" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : props.error.length > 0 ? (
        <div className={styles.retryContainer} onClick={props.handleRetry}>
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Try Again</div>
            <div className={styles.retryButton}>
              <Image src={Retry} alt="Return" width={24} height={24} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.promptContainer}>
            <input
              disabled={props.streaming || props.block}
              placeholder="Ask anything..."
              className={styles.promptText}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleEnter}
            />
            {props.streaming ? (
              <div className={styles.stopButton} onClick={props.handleCancel}>
                <Image src={Stop} alt="Stop" width={24} height={24} />
              </div>
            ) : (
              <div
                className={styles.sendButton}
                style={{
                  opacity: text.length > 0 ? 1 : 0.5,
                }}
              >
                <Image
                  src={Arrow}
                  alt="Arrow"
                  width={24}
                  height={24}
                  onClick={() => {
                    if (text.trim() !== "") {
                      props.handleSend(text);
                      setText("");
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Prompt;
