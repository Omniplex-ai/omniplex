"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./MainPrompt.module.css";
import Auth from "../Auth/Auth";
import SpinnerWhite from "../SpinnerWhite/SpinnerWhite";
import toast from "react-hot-toast";
import Sheet from "react-modal-sheet";
import { cutString } from "../../utils/utils";
import { focusOptions } from "../../utils/data";
import { FileInfo, Mode, Chat } from "@/utils/types";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { createChatThread } from "../../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetailsState, selectAuthState } from "@/store/authSlice";
import { db } from "../../../firebaseConfig";
import { storage } from "../../../firebaseConfig";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Arrow from "../../../public/svgs/Arrow.svg";
import Filter from "../../../public/svgs/Filter.svg";
import FileActive from "../../../public/svgs/FileActive.svg";
import Clip from "../../../public/svgs/Clip.svg";
import Check from "../../../public/svgs/Check.svg";
import CrossRed from "../../../public/svgs/CrossRed.svg";

const MainPrompt = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const authState = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const userId = userDetails.uid;

  const [text, setText] = useState("");
  const [width, setWidth] = useState(0);
  const [modal, setModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("");
  const [buttonText, setButtonText] = useState("Attach");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState({
    website: "Focus",
    icon: Filter,
    query: "",
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFocusChange = (
    website: string,
    query: string,
    icon: StaticImageData
  ) => {
    if (website === "Focus") {
      setMode("");
    } else if (website === "Writing") {
      setMode("chat");
    } else {
      setMode("search");
    }
    setFocus({ website, icon, query });
    setOpen(false);
  };

  const handleSend = async () => {
    if (text.trim() !== "") {
      const id = nanoid(10);
      const currentMode = fileInfo ? "image" : mode;
      const chatObject: Chat = {
        mode: currentMode,
        question: text.trim(),
        answer: "",
        query: focus.query,
        ...(fileInfo && { fileInfo }),
      };
      console.log("Chat Mode: ", currentMode);

      if (userId) {
        try {
          console.log("Adding document...", userId);
          const batch = writeBatch(db);
          const historyRef = doc(db, "users", userId, "history", id);
          const indexRef = doc(db, "index", id);
          batch.set(historyRef, {
            chats: [chatObject],
            messages: [],
            createdAt: new Date(),
          });
          batch.set(indexRef, { userId });
          await batch.commit();
          console.log("Documents added successfully.");
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error("Something went wrong", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
        }
      }

      dispatch(createChatThread({ id, chat: chatObject }));
      router.push(`/chat/${id}`);
    } else return;
  };

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && text.trim() !== "") {
      event.preventDefault();
      handleSend();
    } else if (event.key === "Enter" && event.shiftKey) {
    }
  };

  const handleInput = (e: any) => {
    const target = e.target;
    setText(target.value);
    target.style.height = "auto";
    const maxHeight = 512;
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  };

  const handleFile = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/jpg";
    fileInput.addEventListener("change", async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (
          !file ||
          !(
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
          )
        ) {
          toast.error("Please select an image file (PNG, JPG, JPEG).", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should not exceed 5MB.", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          return;
        }
        setLoading(true);
        setButtonText("Processing");
        try {
          if (userId) {
            const libraryId = nanoid(10);
            const storageRef = ref(
              storage,
              `users/${userId}/library/${libraryId}`
            );
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            const newFileInfo: FileInfo = {
              url: url,
              name: file.name,
              size: file.size,
              date: new Date().toLocaleDateString("en-GB"),
            };

            const libraryRef = collection(db, "users", userId, "library");
            await setDoc(doc(libraryRef, libraryId), newFileInfo);

            setFileInfo(newFileInfo);
            setButtonText(file.name);
          } else {
            throw new Error("User not authenticated");
          }
        } catch (error) {
          console.error("Error during the process: ", error);
          toast.error("Something went wrong, try again", {
            position: "top-center",
            style: {
              padding: "6px 18px",
              color: "#fff",
              background: "#FF4B4B",
            },
          });
          setButtonText("Attach");
        } finally {
          setLoading(false);
        }
      } else {
        setButtonText("Attach");
      }
    });

    fileInput.click();
  };

  const handleModal = () => {
    if (authState) {
      handleFile();
    } else {
      setModal("auth");
      onOpen();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Where Knowledge Evolves</div>
      <div className={styles.promptContainer}>
        <textarea
          placeholder="Ask anything..."
          className={styles.promptText}
          value={text}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <div className={styles.mainRow}>
          <div className={styles.sectionRow}>
            {width <= 512 && (
              <div className={styles.button} onClick={() => setOpen(true)}>
                <Image src={focus.icon} alt="Filter" width={24} height={24} />
                <p className={styles.buttonText}>{focus.website}</p>
              </div>
            )}
            {width > 512 ? (
              <Popover
                placement={"bottom-start"}
                radius="lg"
                offset={4}
                containerPadding={0}
                isOpen={open}
                onOpenChange={(open) => setOpen(open)}
              >
                <PopoverTrigger>
                  <div className={styles.button}>
                    <Image
                      src={focus.icon}
                      alt="Filter"
                      width={18}
                      height={18}
                    />
                    <p className={styles.buttonText}>{focus.website}</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContainer}>
                  <div className={styles.popover}>
                    {focusOptions.map((option, index) => (
                      <div
                        key={index}
                        className={styles.popoverBlock}
                        onClick={() =>
                          option.website === "All"
                            ? handleFocusChange("Focus", "", Filter)
                            : handleFocusChange(
                                option.website,
                                option.query,
                                option.icon
                              )
                        }
                      >
                        <div className={styles.popoverTitleContainer}>
                          <Image
                            src={option.icon}
                            alt={option.website}
                            width={24}
                            height={24}
                          />
                          <p className={styles.popoverText}>{option.website}</p>
                        </div>
                        <p className={styles.popoverSmallText}>
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Sheet
                isOpen={open}
                onClose={() => setOpen(false)}
                detent="content-height"
              >
                <Sheet.Container style={{ background: "#232323" }}>
                  <Sheet.Header />
                  <Sheet.Content>
                    <div className={styles.modal}>
                      {focusOptions.map((option, index) => (
                        <React.Fragment key={index}>
                          <div
                            className={styles.modalBlock}
                            onClick={() =>
                              option.website === "All"
                                ? handleFocusChange("Focus", "", Filter)
                                : handleFocusChange(
                                    option.website,
                                    option.query,
                                    option.icon
                                  )
                            }
                          >
                            <div className={styles.modalRow}>
                              <div className={styles.modalTitleContainer}>
                                <Image
                                  src={option.icon}
                                  alt={option.website}
                                  width={24}
                                  height={24}
                                />
                                <p className={styles.modalText}>
                                  {option.website}
                                </p>
                              </div>
                              {focus.website === option.website && (
                                <Image
                                  src={Check}
                                  alt="Check"
                                  width={30}
                                  height={30}
                                />
                              )}
                            </div>
                            <p className={styles.modalSmallText}>
                              {option.description}
                            </p>
                          </div>
                          {index !== 5 && <div className={styles.divider} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => setOpen(false)} />
              </Sheet>
            )}
            <div className={styles.button} onClick={handleModal}>
              {loading ? (
                <div className={styles.spinner} style={{ marginTop: -3 }}>
                  <SpinnerWhite />
                </div>
              ) : fileInfo?.url ? (
                <Image
                  src={FileActive}
                  alt="FileActive"
                  width={18}
                  height={18}
                />
              ) : (
                <Image src={Clip} alt="Clip" width={18} height={18} />
              )}
              <p
                className={styles.buttonText}
                style={{ color: fileInfo?.url ? "#35A7FF" : "#ffffff" }}
              >
                {cutString(buttonText, 15)}
              </p>
              {fileInfo?.url && (
                <Image
                  src={CrossRed}
                  alt="CrossRed"
                  className={styles.cross}
                  onClick={(event) => {
                    event.stopPropagation();
                    setButtonText("Attach");
                    setFileInfo(null);
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.sendButton}>
            <Image
              src={Arrow}
              alt="Arrow"
              width={24}
              height={24}
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
      {modal === "auth" && <Auth isOpen={isOpen} onClose={onClose} />}
    </div>
  );
};

export default MainPrompt;
