import React from "react";
import styles from "./Answer.module.css";
import Image from "next/image";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Skeleton } from "@nextui-org/skeleton";
import { Citation } from "@/utils/types";

import Logo from "../../../public/Logo.svg";

type Props = {
  error: string;
  answer: string;
  isLoading: boolean;
  citations: Citation[];
};

const Answer = (props: Props) => {
  const transform = (text: string) => {
    let transformedText = text.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$");

    transformedText = transformedText
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");

    transformedText = transformedText
      .split(/\[\{(\d+)\}\]/)
      .map((part, index) => {
        if (index % 2 === 0) {
          return part;
        } else {
          const citationNumber = parseInt(part);
          const citation = props.citations.find(
            (c) => c.number === citationNumber
          );
          return citation
            ? `<a href="${citation.url}" target="_blank" className="${styles.citations}" >${citationNumber}</a>`
            : part;
        }
      })
      .join("");

    return transformedText;
  };

  return (
    <div className={styles.answerContainer}>
      <div className={styles.answerTextRow}>
        <Image src={Logo} alt="Omniplex" className={styles.answerImg} />
        <p className={styles.answerText}>Answer</p>
      </div>
      {props.isLoading ? (
        <div>
          <Skeleton className={styles.skeletonAnswer} />
          <Skeleton className={styles.skeletonAnswer} />
          <Skeleton className={styles.skeletonAnswer} />
        </div>
      ) : (
        <div className="prose dark:prose-invert break-words prose-p:p-0 prose-pre:p-0 prose-code:m-0">
          <Markdown
            className={styles.answer}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={dark}
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={{
                      margin: 0,
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={styles.code}>{children}</code>
                );
              },
            }}
          >
            {props.error.length > 0 ? props.error : transform(props.answer)}
          </Markdown>
        </div>
      )}
    </div>
  );
};

export default Answer;
