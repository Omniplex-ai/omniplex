export type ListItem = {
  date: string;
  content: string;
};

export type Mode = "search" | "image" | "chat";

export type FileInfo = {
  name: string;
  size: number;
  date: string;
  url: string;
};

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: string };

export type Message = {
  role: "system" | "user" | "assistant";
  content: string | MessageContent[];
};

export type Citation = {
  number: number;
  url: string;
};

export type Chat = {
  mode: "search" | "chat" | "image";
  question: string;
  answer: string;
  query?: string;
  fileInfo?: FileInfo;
  searchResults?: {
    data: {
      webPages: {
        value: {
          url: string;
          snippet: string;
        }[];
      };
    };
  };
};

export type ChatThread = {
  id: string;
  chats: Chat[];
  messages: Message[];
  shared?: boolean;
};

export type LibraryItem = {
  id: string;
  name: string;
  size: number;
  url: string;
  date: string;
};
