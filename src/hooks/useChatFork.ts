import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { addChatThread, selectChatThread } from "@/store/chatSlice";
import { RootState } from "@/store/store";
import { selectUserDetailsState } from "@/store/authSlice";
import { useCallback } from "react";

const useChatFork = (threadId: string) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const chatThread = useSelector((state: RootState) =>
    selectChatThread(state, threadId)
  );
  const userDetails = useSelector(selectUserDetailsState);
  const userId = userDetails.uid;

  const handleFork = useCallback(async () => {
    if (!chatThread) {
      console.log("No chat thread to fork");
      return;
    }

    try {
      const newChatThreadId = nanoid(10);

      if (userId) {
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
    } catch (error) {
      console.error("Error forking chat thread:", error);
    }
  }, [chatThread, dispatch, router, userId]);

  return { handleFork };
};

export default useChatFork;
