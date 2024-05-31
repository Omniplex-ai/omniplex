import React, { useRef } from "react";
import styles from "./Dictionary.module.css";
import { DictionaryType } from "@/utils/types";
import { Player } from "@lottiefiles/react-lottie-player";
import { Skeleton } from "@nextui-org/skeleton";

import AudioLottie from "../../../public/lottie/Audio.json";

type DictionaryProps = {
  dictionaryResults?: DictionaryType;
};

const Dictionary = ({ dictionaryResults }: DictionaryProps) => {
  const animationRefs = useRef<any[]>([]);

  const handlePlaySound = (audioUrl: string, index: number) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      animationRefs.current[index].play();
      audio.onended = () => {
        animationRefs.current[index].pause();
      };
    }
  };

  return (
    <>
      {dictionaryResults ? (
        <div className={styles.dictionaryContainer}>
          <div className={styles.wordBlock}>
            <div className={styles.word}>{dictionaryResults.word}</div>
            {dictionaryResults.phonetics?.map((phonetic, index) => {
              return (
                <div className={styles.phonetic} key={index}>
                  {phonetic.audio && (
                    <div
                      onClick={() => handlePlaySound(phonetic.audio, index)}
                      className={styles.audioContainer}
                    >
                      <Player
                        src={AudioLottie}
                        ref={(el) => (animationRefs.current[index] = el)}
                        loop={false}
                        autoplay={false}
                        className={styles.audio}
                      />
                    </div>
                  )}
                  {phonetic.text && (
                    <span className={styles.text}>{phonetic.text}</span>
                  )}
                </div>
              );
            })}
          </div>
          {dictionaryResults.meanings?.map((meaning, index) => (
            <div className={styles.meaningBlock} key={index}>
              <div className={styles.partOfSpeech}>{meaning.partOfSpeech}</div>
              {meaning.definitions.slice(0, 1).map((definition, defIndex) => (
                <div className={styles.definition} key={defIndex}>
                  <div className={styles.definitionText}>
                    {definition.definition}
                  </div>
                  {definition.example && <i> e.g., {definition.example}</i>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.dictionaryContainer}>
          <div className={styles.wordBlock}>
            <Skeleton className={styles.skeletonWord} />
            <div className={styles.phonetic}>
              <Skeleton className={styles.audioContainer} />
              <Skeleton className={styles.skeletonText} />
            </div>
          </div>
          <div className={styles.meaningBlock}>
            <Skeleton className={styles.skeletonPartOfSpeech} />
            <div className={styles.definition}>
              <Skeleton
                className={styles.skeletonDefinition}
                style={{ width: "70%" }}
              />
              <Skeleton
                className={styles.skeletonDefinition}
                style={{ width: "50%" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dictionary;
