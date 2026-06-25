import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
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

const flattenAndGroup = (pages: { data: ChatHistoryItem[] }[]): GroupedChats => {
  const today: ChatHistoryItem[] = [];
  const earlier: ChatHistoryItem[] = [];

  for (const page of pages) {
    for (const chat of page.data) {
      if (isToday(chat.created_at)) {
        today.push(chat);
      } else {
        earlier.push(chat);
      }
    }
  }

  return { today, earlier };
};

export const useChatHistory = () => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.CHAT_HISTORY],
    queryFn: ({ pageParam }) =>
      fetchChats(pageParam, PAGINATION.DEFAULT_CHATS_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.has_more ? (lastPageParam as number) + PAGINATION.DEFAULT_CHATS_PAGE_SIZE : undefined,
    staleTime: 30_000,
    select: (data) => flattenAndGroup(data.pages),
  });

  return query;
};
