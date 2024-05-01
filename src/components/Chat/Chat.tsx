"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import Image from "next/image";
import Source from "../Source/Source";
import Answer from "../Answer/Answer";
import Actions from "../Actions/Actions";
import Prompt from "../Prompt/Prompt";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { generateCitations, getInitialMessages } from "../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { selectUserDetailsState } from "@/store/authSlice";
import { selectAI } from "@/store/aiSlice";
import {
  selectChatThread,
  addChatThread,
  updateSearchResults,
  updateAnswer,
  updateMessage,
  addMessage,
  addChat,
} from "@/store/chatSlice";
import { RootState, store } from "@/store/store";
import { Chat as ChatType, Message } from "../../utils/types";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import Return from "../../../public/svgs/Return.svg";

type Props = {
  id: string;
};

const Chat = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ai = useSelector(selectAI);
  const userDetails = useSelector(selectUserDetailsState);
  const chatThread = useSelector((state: RootState) =>
    selectChatThread(state, props.id)
  );
  const userId = userDetails.uid;

  const [isFetching, setIsFetching] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [error, setError] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatThread?.chats]);

  // Development Code
  const lastProcessedChatRef = useRef<number>(0);
  const chatIdCounterRef = useRef<number>(0);

  // Cache for search results
  const searchCache = useRef<{ [query: string]: any }>({});
  const CACHE_TTL = 200 * 1000; // 200 seconds

  // Function to fetch and cache search results
  const handleSearchAndCache = async (query: string) => {
    if (searchCache.current[query] && 
        Date.now() - searchCache.current[query].timestamp < CACHE_TTL) {
      return searchCache.current[query].data;
    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const searchData = await response.json();
    searchCache.current[query] = { data: searchData, timestamp: Date.now() };
    return searchData;
  };

  // Combined response function with scrape and chat
  const handleResponse = async (query: string, question: string) => {
    setIsLoading(true);
    setIsCompleted(false);
    const newController = new AbortController();
    setController(newController);

    let messages = getInitialMessages({ mode: "chat", question }, "");
    messages.forEach((message) => {
      dispatch(addMessage({ threadId: props.id, message }));
    });

    if (ai.customPrompt.length > 0) {
      messages.splice(messages.length - 1, 0, {
        role: "system",
        content: ai.customPrompt,
      });
    }

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          question,
          messages,
          model: ai.model, // Assuming GPT-3.5 by default
          temperature: ai.temperature,
          max_tokens: ai.maxLength,
          // ... other parameters
        }),
        signal: newController.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      setIsLoading(false);
      if (response.body) {
        setError("");
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        while (true) {
          const { value, done } = await reader.read();
          const text = decoder.decode(value);
          answer += text;
          dispatch(
            updateAnswer({
              threadId: props.id,
              chatIndex: chatThread.chats.length - 1,
              answer: answer,
            })
          );
          if (done) {
            break;
          }
        }
        dispatch(
          addMessage({
            threadId: props.id,
            message: { role: "assistant", content: answer },
          })
        );
        setIsStreaming(false);
        setIsCompleted(true);
        updateFirestore();
      }
    } catch (error) {
      setIsLoading(false);
      setIsStreaming(false);
      setIsCompleted(true);
      if ((error as Error).name === "AbortError") {
        await updateFirestore();
        return;
      }
      setError("Something went wrong. Please try again later.");
    } finally {
      setController(null);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    if (chatThread) {
      setIsFetching(false);
      const lastChat = chatThread.chats[chatThread.chats.length - 1];
      const lastChatId = chatIdCounterRef.current;
      console.log("Last chat ID:", lastChatId);
      console.log("Last processed chat ID:", lastProcessedChatRef.current);
      console.log("Check", lastChatId !== lastProcessedChatRef.current);

      if (lastChatId !== lastProcessedChatRef.current) {
        console.log("Last chat ID changed:", lastChatId);

        if (lastChat.mode === "search") {
          handleSearchAndCache(lastChat.query + " " + lastChat.question)
            .then((searchData) => {
              handleResponse(lastChat.query, lastChat.question);
            })
            .catch((error) => {
              console.error(error);
              setError("Error fetching or processing search results");
            });
        } else {
          handleResponse("", lastChat.question);
        }

        lastProcessedChatRef.current = lastChatId;
      }

      chatIdCounterRef.current++;
    }
  }, [chatThread?.chats.length]);

  useEffect(() => {
    const fetchChatThread = async () => {
      setIsFetching(true);
      const db = getFirestore();

      const indexDocRef = doc(db, "index", props.id);
      const indexDocSnapshot = await getDoc(indexDocRef);

      if (indexDocSnapshot.exists()) {
        const { userId: chatThreadUserId } = indexDocSnapshot.data();

        const chatThreadRef = doc(
          db,
          "users",
          chatThreadUserId,
          "history",
          props.id
        );
        const chatThreadDoc = await getDoc(chatThreadRef);

        if (chatThreadDoc.exists()) {
          const chatThreadData = chatThreadDoc.data();
          dispatch(
            addChatThread({
              id: props.id,
              chats: chatThreadData.chats,
              messages: chatThreadData.messages,
              shared: userId !== chatThreadUserId,
            })
          );
          setIsLoading(false);
          setIsCompleted(true);
        } else {
          console.log("Chat thread document does not exist");
          setIsFetching(false);
        }
      } else {
        console.log("Index document does not exist");
        setIsFetching(false);
      }
    };

    if (!chatThread) {
      fetchChatThread();
    }
  }, [props.id, dispatch, userId]);

  const updateFirestore = async () => {
    if (userId) {
      try {
        const updatedState = store.getState();
        const updatedChatThread = selectChatThread(updatedState, props.id);
        const updatedChats = updatedChatThread?.chats || [];
        const updatedMessages = updatedChatThread?.messages || [];
        if (userId) {
          try {
            const chatThreadRef = doc(db, "users", userId, "history", props.id);
            await updateDoc(chatThreadRef, {
              messages: updatedMessages,
              chats: updatedChats,
            });
          } catch (error) {
            console.error("Error updating chat thread in Firestore:", error);
          }
        }
      } catch (error) {
        console.error("Error updating Firestore DB:", error);
      }
    }
  };

  const handleRewrite = async () => {
    console.log("handleRewrite called");
    setIsLoading(true);
    setIsCompleted(false);
    const newController = new AbortController();
    setController(newController);

    const lastChat = chatThread.chats[chatThread.chats.length - 1];
    const lastUserMessage = chatThread.messages.findLast(
      (message) => message.role === "user"
    );

    if (!lastChat.answer) {
      return;
    }

    const messages: Message[] = [];

    const systemMessage = chatThread.messages.find(
      (message) => message.role === "system"
    );
    if (systemMessage) {
      messages.push(systemMessage);
    }
    chatThread.chats.slice(0, -1).forEach((prevChat) => {
      messages.push({ role: "user", content: prevChat.question });
      if (prevChat.answer) {
        messages.push({ role: "assistant", content: prevChat.answer });
      }
    });

    messages.push({
      role: "user",
      content: lastUserMessage?.content ?? lastChat.question,
    });

    if (ai.customPrompt.length > 0) {
      messages.splice(messages.length - 1, 0, {
        role: "system",
        content: ai.customPrompt,
      });
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          model: lastChat.mode === "image" ? "gpt-4-vision-preview" : ai.model,
          temperature: ai.temperature,
          max_tokens: ai.maxLength,
          top_p: ai.topP,
          frequency_penalty: ai.frequency,
          presence_penalty: ai.presence,
        }),
        signal: newController.signal,
      });

      if (!response.ok) {
        setIsLoading(false);
        setIsStreaming(false);
        setError("Something went wrong. Please try again later.");
        return;
      }

      setIsLoading(false);
      if (response.body) {
        setError("");
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        while (true) {
          const { value, done } = await reader.read();
          const text = decoder.decode(value);
          answer += text;
          dispatch(
            updateAnswer({
              threadId: props.id,
              chatIndex: chatThread.chats.length - 1,
              answer: answer,
            })
          );
          if (done) {
            break;
          }
        }
        const lastAssistantMessageIndex = chatThread.messages.findLastIndex(
          (message) => message.role === "assistant"
        );

        if (lastAssistantMessageIndex !== -1) {
          dispatch(
            updateMessage({
              threadId: props.id,
              messageIndex: lastAssistantMessageIndex,
              message: { role: "assistant", content: answer },
            })
          );
        }
        setIsStreaming(false);
        setIsCompleted(true);
        updateFirestore();
      }
    } catch (error) {
      setIsLoading(false);
      setIsStreaming(false);
      setIsCompleted(true);
      if ((error as Error).name === "AbortError") {
        await updateFirestore();
        return;
      }
      setError("Something went wrong. Please try again later.");
    } finally {
      setController(null);
    }
  };

  const handleCancel = () => {
    if (controller) {
      controller.abort();
      setIsStreaming(false);
    }
  };

  const handleSend = (text: string) => {
    if (text.trim() !== "") {
      const newChat: ChatType = {
        mode: chatThread?.chats[0].mode === "search" ? "search" : "chat",
        query: chatThread?.chats[0].mode === "search" ? text.trim() : "",
        question: text,
        answer: "",
      };
      dispatch(addChat({ threadId: props.id, chat: newChat }));
    }
  };

  const handleRetry = async (
    func: Function,
    maxRetries = 3,
    retries = 0,
    ...args: any[]
  ): Promise<any> => {
    if (retries >= maxRetries) {
      setError("Max retries reached. Please try again later.");
      toast.error("Max retries reached. Please try again later.", {
        position: "top-center",
        style: {
          padding: "6px 18px",
          color: "#fff",
          background: "#FF4B4B",
        },
      });
      console.error("Max retries reached for function: ", func);
      return;
    }

    try {
      return await func(...args);
    } catch (error) {
      console.error(
        "Error in function: ",
        func,
        "Retry attempt: ",
        retries + 1
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return handleRetry(func, maxRetries, retries + 1, ...args);
    }
  };

  const handleFork = async () => {
    if (chatThread) {
      console.log("chatThread", chatThread);
      const newChatThreadId = nanoid(10);

      if (userId) {
        console.log("Authenticated user");
        const historyRef = collection(db, "users", userId, "history");
        await setDoc(doc(historyRef, newChatThreadId), {
          chats: chatThread.chats,
          messages: chatThread.messages,
          createdAt: new Date(),
        });
      }

      dispatch(
        addChatThread({
          id: newChatThreadId,
          chats: chatThread.chats,
          messages: chatThread.messages,
        })
      );

      router.push(`/chat/${newChatThreadId}`);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.chat}>
          <p className={styles.question}>Loading...</p>
          <Source mode={"Loading"} />
          <Answer error={""} answer={""} isLoading={isLoading} citations={[]} />
        </div>
      </div>
    );
  }

  if (!chatThread) {
    return (
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.text}>Page not found</h2>
          <h3 className={styles.subText}>
            The page you are looking for does not exist.
          </h3>
        </div>
        <div
          className={styles.bottomContainer}
          onClick={() => router.push("/")}
        >
          <div className={styles.promptContainer}>
            <div className={styles.promptText}>Return</div>
            <div className={styles.sendButton}>
              <Image src={Return} alt="Return" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {chatThread?.chats.map((chat, index) => (
        <div
          ref={index === chatThread.chats.length - 1 ? chatContainerRef : null}
          key={index}
          className={styles.chat}
        >
          <p className={styles.question}>{chat.question}</p>
          <Source
            mode={chat.mode}
            fileInfo={chat.fileInfo}
            searchResults={chat.searchResults}
          />
          <Answer
            error={error}
            answer={chat.answer}
            isLoading={isLoading && index === chatThread.chats.length - 1}
            citations={generateCitations(chat)}
          />
          {index === chatThread.chats.length - 1 && isCompleted && (
            <Actions
              fork={chatThread.shared}
              chat={chat}
              chatThread={chatThread}
              rewrite={handleRewrite}
            />
          )}
          {index < chatThread.chats.length - 1 && (
            <div className={styles.divider} />
          )}
        </div>
      ))}
      <Prompt
        fork={chatThread.shared}
        error={error}
        streaming={isStreaming}
        handleCancel={handleCancel}
        handleSend={handleSend}
        handleFork={handleFork}
        handleRetry={() => {
          // ... retry logic if needed
        }}
      />
    </div>
  );
};

export default Chat;
