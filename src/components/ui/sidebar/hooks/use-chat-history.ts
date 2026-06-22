import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { fetchChats } from "@/services/chat/chat-history";
import type { ChatHistoryItem } from "@/services/chat/chat-history";

export type GroupedChats = {
  today: ChatHistoryItem[];
  earlier: ChatHistoryItem[];
};

const isToday = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const useChatHistory = () => {
  return useQuery<GroupedChats>({
    queryKey: [QUERY_KEYS.CHAT_HISTORY],
    queryFn: async () => {
      const chats = await fetchChats();
      const today: ChatHistoryItem[] = [];
      const earlier: ChatHistoryItem[] = [];

      for (const chat of chats) {
        if (isToday(chat.created_at)) {
          today.push(chat);
        } else {
          earlier.push(chat);
        }
      }

      return { today, earlier };
    },
    staleTime: 30_000,
  });
};
