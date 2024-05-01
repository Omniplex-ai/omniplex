import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Message, Chat, ChatThread } from "@/utils/types";

type ChatState = {
  threads: { [id: string]: ChatThread };
};

const initialState: ChatState = {
  threads: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChatThread: (
      state,
      action: PayloadAction<{ id: string; chat: Chat }>
    ) => {
      state.threads[action.payload.id] = {
        id: action.payload.id,
        chats: [action.payload.chat],
        messages: [],
      };
    },
    addChatThread: (
      state,
      action: PayloadAction<{
        id: string;
        chats: Chat[];
        messages: Message[];
        shared?: boolean;
      }>
    ) => {
      const { id, chats, messages, shared = false } = action.payload;
      state.threads[id] = { id, chats, messages, shared };
    },
    removeChatThread: (state, action: PayloadAction<string>) => {
      delete state.threads[action.payload];
    },
    addChat: (
      state,
      action: PayloadAction<{ threadId: string; chat: Chat }>
    ) => {
      state.threads[action.payload.threadId].chats.push(action.payload.chat);
    },
    addMessage: (
      state,
      action: PayloadAction<{ threadId: string; message: Message }>
    ) => {
      state.threads[action.payload.threadId].messages.push(
        action.payload.message
      );
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        threadId: string;
        messageIndex: number;
        message: Message;
      }>
    ) => {
      const { threadId, messageIndex, message } = action.payload;
      state.threads[threadId].messages[messageIndex] = message;
    },
    updateSearchResults: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        searchResults: any;
      }>
    ) => {
      const { threadId, chatIndex, searchResults } = action.payload;
      state.threads[threadId].chats[chatIndex].searchResults = searchResults;
    },
    updateAnswer: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        answer: string;
      }>
    ) => {
      const { threadId, chatIndex, answer } = action.payload;
      state.threads[threadId].chats[chatIndex].answer = answer;
    },
    resetChat: () => initialState,
  },
});

export const {
  createChatThread,
  addChatThread,
  removeChatThread,
  addChat,
  addMessage,
  updateMessage,
  updateSearchResults,
  updateAnswer,
  resetChat,
} = chatSlice.actions;

export const selectChatThread = (state: RootState, threadId: string) =>
  state.chat.threads[threadId];

export default chatSlice.reducer;
