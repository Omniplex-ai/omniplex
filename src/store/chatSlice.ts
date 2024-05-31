import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  ChatThread,
  Message,
  Chat,
  Mode,
  WeatherType,
  StockType,
  DictionaryType,
  SearchType,
} from "@/utils/types";

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
    updateMode: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        mode: Mode;
        arg: any;
      }>
    ) => {
      const { threadId, chatIndex, mode, arg } = action.payload;
      if (state.threads[threadId] && state.threads[threadId].chats[chatIndex]) {
        state.threads[threadId].chats[chatIndex].mode = mode;
        state.threads[threadId].chats[chatIndex].arg = arg;
      }
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
    updateSearch: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        searchResults: SearchType;
      }>
    ) => {
      const { threadId, chatIndex, searchResults } = action.payload;
      state.threads[threadId].chats[chatIndex].searchResults = searchResults;
    },
    updateWeather: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        weatherResults: WeatherType;
      }>
    ) => {
      const { threadId, chatIndex, weatherResults } = action.payload;
      state.threads[threadId].chats[chatIndex].weatherResults = weatherResults;
    },
    updateStock: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        stocksResults: StockType;
      }>
    ) => {
      const { threadId, chatIndex, stocksResults } = action.payload;
      state.threads[threadId].chats[chatIndex].stocksResults = stocksResults;
    },
    updateDictionary: (
      state,
      action: PayloadAction<{
        threadId: string;
        chatIndex: number;
        dictionaryResults: DictionaryType;
      }>
    ) => {
      const { threadId, chatIndex, dictionaryResults } = action.payload;
      state.threads[threadId].chats[chatIndex].dictionaryResults =
        dictionaryResults;
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
    updateChatThread: (
      state,
      action: PayloadAction<{
        id: string;
        chats: Chat[];
        messages: Message[];
        shared?: boolean;
      }>
    ) => {
      if (state.threads[action.payload.id]) {
        state.threads[action.payload.id] = {
          ...state.threads[action.payload.id],
          chats: action.payload.chats,
          messages: action.payload.messages,
          shared: action.payload.shared,
        };
      }
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
  updateMode,
  updateMessage,
  updateSearch,
  updateWeather,
  updateStock,
  updateDictionary,
  updateAnswer,
  updateChatThread,
  resetChat,
} = chatSlice.actions;

export const selectChatThread = (state: RootState, threadId: string) =>
  state.chat.threads[threadId];

export default chatSlice.reducer;
