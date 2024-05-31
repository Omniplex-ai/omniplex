import { useCallback } from "react";
import toast from "react-hot-toast";

const useChatRetry = () => {
  const handleRetry = useCallback(
    async (
      func: Function,
      maxRetries = 3,
      args: any[] = [],
      delay = 1000
    ): Promise<any> => {
      let attempts = 0;

      while (attempts < maxRetries) {
        try {
          return await func(...args);
        } catch (error) {
          attempts += 1;
          console.error(
            `Error in function: ${func.name}, Retry attempt: ${attempts}`
          );
          if (attempts < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            toast.error("Max retries reached. Please try again later.", {
              position: "top-center",
              style: {
                padding: "6px 18px",
                color: "#fff",
                background: "#FF4B4B",
              },
            });
            throw error;
          }
        }
      }
    },
    []
  );

  return { handleRetry };
};

export default useChatRetry;
