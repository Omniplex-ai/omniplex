import React from "react";
import Image from "next/image";
import { cutString, formatFileSize } from "../../utils/utils";
import styles from "./File.module.css";
import Doc from "../../../public/svgs/Doc.svg";
import { FileInfo } from "@/utils/types";

type FileBoxProps = {
  fileInfo?: FileInfo;
};

const File = ({ fileInfo }: FileBoxProps) => (
  <div className={styles.fileBox}>
    <Image alt="Document" src={Doc} className={styles.fileImage} />
    <div className={styles.fileBoxTextContainer}>
      <div className={styles.fileName}>
        {cutString(fileInfo?.name || "", 20)}
      </div>
      <div className={styles.fileTextRow}>
        <div className={styles.fileSizeText}>
          {formatFileSize(fileInfo?.size || 0)}
        </div>
        <div className={styles.dot} />
        <div className={styles.fileDate}>{fileInfo?.date}</div>
      </div>
    </div>
  </div>
);

export default File;
