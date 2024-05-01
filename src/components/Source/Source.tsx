import React from "react";
import styles from "./Source.module.css";
import Image from "next/image";
import {
  cutString,
  formatFileSize,
  getSecondLevelDomain,
} from "../../utils/utils";
import Widget from "../Widget/Widget";
import { FileInfo } from "@/utils/types";
import { Skeleton } from "@nextui-org/skeleton";

import SourceLogo from "../../../public/svgs/Source.svg";
import Doc from "../../../public/svgs/Doc.svg";

type Props = {
  mode: string;
  fileInfo?: FileInfo;
  searchResults?: any;
};

const Source = (props: Props) => {
  if (props.mode !== "chat") {
    return (
      <div className={styles.sourceContainer}>
        <div className={styles.sourceTextRow}>
          <Image src={SourceLogo} alt="Source" className={styles.sourceImg} />
          <p className={styles.sourceText}>Source</p>
        </div>
        {props.mode === "image" ? (
          <div className={styles.sourceRow}>
            <div className={styles.fileBox}>
              <Image alt="Document" src={Doc} className={styles.fileImage} />
              <div className={styles.fileBoxTextContainer}>
                <div className={styles.fileName}>
                  {cutString(props.fileInfo?.name || "", 20)}
                </div>
                <div className={styles.fileTextRow}>
                  <div className={styles.fileSizeText}>
                    {formatFileSize(props.fileInfo?.size || 0)}
                  </div>
                  <div className={styles.dot} />
                  <div className={styles.fileDate}>{props.fileInfo?.date}</div>
                </div>
              </div>
            </div>
          </div>
        ) : props.mode === "search" &&
          props.searchResults?.data?.webPages?.value &&
          props.searchResults.data.webPages.value.length > 0 ? (
          <div className={styles.sourceRow}>
            {props.searchResults.data.webPages.value
              .slice(0, 3)
              .map((item: any, index: number) => (
                <div
                  className={styles.sourceBox}
                  key={index}
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <div className={styles.sourceBoxText}>
                    {cutString(item.snippet)}
                  </div>
                  <div className={styles.sourceBoxRow}>
                    <div className={styles.sourceBoxRow}>
                      <Image
                        width={24}
                        height={24}
                        alt="Favicon"
                        src={`/api/favicon?url=${encodeURIComponent(item.url)}`}
                        className={styles.sourceFavicon}
                      />
                      <div className={styles.sourceFaviconText}>
                        {cutString(getSecondLevelDomain(item.url), 12)}
                      </div>
                    </div>
                    <div className={styles.dot} />
                    <div className={styles.sourceIndex}>{index + 1}</div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.sourceRow}>
            <Skeleton className={styles.skeletonBox} />
            <Skeleton className={styles.skeletonBox} />
            <Skeleton className={styles.skeletonBox} />
          </div>
        )}
        {props.mode === "search" && <Widget data={props.searchResults?.data} />}
      </div>
    );
  }

  return null;
};

export default Source;
