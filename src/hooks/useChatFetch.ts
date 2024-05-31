import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  selectChatThread,
  addChatThread,
  updateChatThread,
  removeChatThread,
} from "@/store/chatSlice";
import { RootState } from "@/store/store";

const useChatFetch = (id: string) => {
  const dispatch = useDispatch();
  const chatThread = useSelector((state: RootState) =>
    selectChatThread(state, id)
  );
  const [isFetching, setIsFetching] = useState(true);

  const fetchChatThread = useCallback(async () => {
    setIsFetching(true);
    try {
      const indexDocRef = doc(db, "index", id);
      const indexDocSnapshot = await getDoc(indexDocRef);

      if (indexDocSnapshot.exists()) {
        const { userId: indexUserId } = indexDocSnapshot.data();
        const chatThreadRef = doc(db, "users", indexUserId, "history", id);
        const chatThreadDoc = await getDoc(chatThreadRef);

        if (chatThreadDoc.exists()) {
          const chatThreadData = chatThreadDoc.data();
          const isShared = chatThreadData.userId !== indexUserId;

          if (isShared && chatThread) {
            dispatch(
              updateChatThread({
                id,
                chats: chatThreadData.chats,
                messages: chatThreadData.messages,
                shared: isShared,
              })
            );
          } else if (!chatThread) {
            dispatch(
              addChatThread({
                id,
                chats: chatThreadData.chats,
                messages: chatThreadData.messages,
                shared: isShared,
              })
            );
          }
          setIsFetching(false);
          return;
        } else {
          dispatch(removeChatThread(id));
        }
      }
    } catch (error) {
      console.error("Error fetching chat thread:", error);
    }
    setIsFetching(false);
  }, [dispatch, id, chatThread]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      if (!chatThread) {
        await fetchChatThread();
      } else if (chatThread.shared) {
        await fetchChatThread();
      } else {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  return { chatThread, isFetching };
};

export default useChatFetch;
