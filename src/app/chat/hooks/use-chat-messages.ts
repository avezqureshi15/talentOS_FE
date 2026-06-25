import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { fetchMessages } from "@/services/chat/chat-history";
import { useChatStore } from "@/store/chat.store";
import type { Message } from "@/app/chat/pages/chat.types";

const toFrontendMessage = (m: {
  id: number;
  role: string;
  content: string;
}): Message => {
  const role = m.role === "assistant" ? "ai" : "user";

  if (role === "user") {
    return { id: m.id, role, content: [{ type: "text", text: m.content }] };
  }

  return { id: m.id, role, content: [{ type: "markdown", content: m.content }] };
};

export const useChatMessages = (chatId: string | null) => {
  const {
    setMessages,
    prependMessages,
    setChatId,
    setHasMore,
    hasMore,
    setStarted,
  } = useChatStore();

  const [isLoadingMore, setIsLoadingMore] = useState(false); // Tracks whether older messages are being fetched

  const query = useQuery({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, chatId],
    queryFn: async () => {
      if (!chatId) return;
      setChatId(chatId);
      setStarted();

      const res = await fetchMessages(chatId, 20);
      const msgs = res.data.map(toFrontendMessage);
      setMessages(msgs);
      setHasMore(res.has_more);
      return msgs;
    },
    enabled: !!chatId,
  });

  const loadMore = useCallback(async () => {
    if (!chatId || !hasMore || isLoadingMore) return;
    setIsLoadingMore(true);

    const msgs = useChatStore.getState().messages;
    const earliestId = msgs.length > 0 ? msgs[0].id : undefined;

    try {
      const res = await fetchMessages(
        chatId,
        20,
        typeof earliestId === "number" ? earliestId : undefined,
      );
      const mapped = res.data.map(toFrontendMessage);
      prependMessages(mapped);
      setHasMore(res.has_more);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, hasMore, isLoadingMore, prependMessages, setHasMore]);

  return { isLoading: query.isLoading, isLoadingMore, loadMore, hasMore };
};
