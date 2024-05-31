import { Timestamp } from "firebase/firestore";
import { Chat, Citation, Message } from "./types";

export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch (error) {
    console.error("An error occurred while parsing the URL:", error);
    return "Invalid URL";
  }
};
export const getSecondLevelDomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".");
    let domain = parts.length > 2 ? parts[parts.length - 2] : parts[0];
    if (domain === "www" && parts.length > 2) {
      domain = parts[parts.length - 3];
    }
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (error) {
    console.error("An error occurred while parsing the URL:", error);
    return "Invalid URL";
  }
};
export const getCurrentDateUTC = (): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const dayName = days[now.getUTCDay()];
  const monthName = months[now.getUTCMonth()];
  const day = now.getUTCDate().toString().padStart(2, "0");
  const year = now.getUTCFullYear();
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");

  return `${dayName}, ${monthName} ${day}, ${year} ${hours}:${minutes}:${seconds} UTC`;
};

export const getInitialMessages = (chat: Chat, data?: string): Message[] => {
  const date = getCurrentDateUTC();
  if (chat.mode === "image") {
    return [
      {
        role: "user",
        content: [
          { type: "text", text: chat.question || "" },
          {
            type: "image_url",
            image_url: {
              url: chat.fileInfo?.url || "",
            },
          },
        ],
      },
    ];
  } else if (chat.mode === "chat") {
    return [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: chat.question || "" },
    ];
  } else if (chat.mode === "search") {
    return [
      {
        role: "system",
        content:
          "Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided web Search Results (URL and Summary)." +
          "You must only use information from the provided search results." +
          "Use an unbiased and journalistic tone." +
          `Use this current date and time: ${date}.` +
          "Combine search results together into a coherent answer." +
          "Do not repeat text. Cite search results using [{number}] notation." +
          "Only cite the most relevant results that answer the question accurately." +
          "If different results refer to different entities with the same name, write separate answers for each entity." +
          "You have the ability to search and will be given websites and the scarped data from them and you will have to make up an answer with that only" +
          "You must must provide citations in the format of [{number}] and it sharts with [{1}].",
      },
      {
        role: "user",
        content: `${data}\n\nQuestion: ${chat.question}`,
      },
    ];
  } else if (chat.mode === "weather") {
    return [
      {
        role: "system",
        content:
          "Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided on the users question and api response." +
          "Talk about the weather answering questions combing the api response and user question" +
          "Use an unbiased and journalistic tone." +
          `Use this current date and time: ${date}.`,
      },
      {
        role: "user",
        content: `${data}\n\nQuestion: ${chat.question}`,
      },
    ];
  } else if (chat.mode === "stock") {
    return [
      {
        role: "system",
        content:
          "Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided on the users question and api response." +
          "Talk about the stock answering questions combing the api response and user question" +
          "Use an unbiased and journalistic tone." +
          `Use this current date and time: ${date}.`,
      },
      {
        role: "user",
        content: `${data}\n\nQuestion: ${chat.question}`,
      },
    ];
  } else if (chat.mode === "dictionary") {
    return [
      {
        role: "system",
        content:
          "Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided on the users question and api response." +
          "Talk about the dictionary answering questions combing the api response and user question" +
          "Use an unbiased and journalistic tone.",
      },
      {
        role: "user",
        content: `${data}\n\nQuestion: ${chat.question}`,
      },
    ];
  } else {
    return [];
  }
};
export const generateCitations = (chat: Chat): Citation[] => {
  if (chat.mode === "search") {
    return (
      chat.searchResults?.data?.webPages?.value
        ?.slice(0, 3)
        .map((webpage: any, index: number) => ({
          number: index + 1,
          url: webpage.url,
        })) || []
    );
  }
  return [];
};

export const cutString = (str: string, maxLength: number = 50) => {
  if (str.length <= maxLength) return str;
  let trimmedStr = str.slice(0, maxLength);
  if (trimmedStr.lastIndexOf(" ") > 0) {
    trimmedStr = trimmedStr.slice(
      0,
      Math.min(trimmedStr.length, trimmedStr.lastIndexOf(" "))
    );
  }
  return trimmedStr + "...";
};
export const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};
export const formatTimestamp = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};
export const getRelativeDateLabel = (dateStr: string) => {
  const itemDate = formatDate(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const formattedItemDate = new Date(itemDate.toDateString());
  const formattedToday = new Date(today.toDateString());
  const formattedYesterday = new Date(yesterday.toDateString());

  if (formattedItemDate.getTime() === formattedToday.getTime()) {
    return "Today";
  } else if (formattedItemDate.getTime() === formattedYesterday.getTime()) {
    return "Yesterday";
  } else {
    return dateStr;
  }
};

export const formatDateLong = (): string =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
export const getReadingTimeInMinutes = (chats: Chat[]): number => {
  const wordsPerMinute = 200;
  const totalWords = chats.reduce((count, chat) => {
    const questionWords = chat.question.trim().split(/\s+/).length;
    const answerWords = chat.answer.trim().split(/\s+/).length;
    return count + questionWords + answerWords;
  }, 0);
  const readingTimeInMinutes = Math.ceil(totalWords / wordsPerMinute);
  return readingTimeInMinutes;
};
