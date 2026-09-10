import httpClient from "@/services/http-client";
import { API_ENDPOINTS, PAGINATION } from "@/constants/api-endpoints";

export type ChatHistoryItem = {
  id: string;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessageItem = {
  id: number;
  chat_id: string;
  role: string;
  content: string;
  created_at: string;
};

type ChatsResponse = {
  data: ChatHistoryItem[];
  count: number;
  has_more: boolean;
};

type MessagesResponse = {
  data: ChatMessageItem[];
  has_more: boolean;
};

export const updateChatTitle = async (chatId: string, title: string): Promise<void> => {
  await httpClient.patch(`${API_ENDPOINTS.CHAT_CHAT_DELETE}/${chatId}`, { title });
};

export const deleteChat = async (chatId: string): Promise<void> => {
  await httpClient.delete(`${API_ENDPOINTS.CHAT_CHAT_DELETE}/${chatId}`);
};

export const fetchChats = async (
  offset = 0,
  limit = PAGINATION.DEFAULT_CHATS_PAGE_SIZE,
): Promise<ChatsResponse> => {
  const { data } = await httpClient.get<ChatsResponse>(API_ENDPOINTS.CHAT_CHATS, {
    params: { limit, offset },
  });
  return data;
};

export const fetchMessages = async (
  chatId: string,
  limit = PAGINATION.DEFAULT_CHAT_MESSAGES_LIMIT,
  before?: number,
): Promise<MessagesResponse> => {
  const params: Record<string, string | number> = {
    chat_id: chatId,
    limit,
  };
  if (before !== undefined) {
    params.before = before;
  }
  const { data } = await httpClient.get<MessagesResponse>(API_ENDPOINTS.CHAT_MESSAGES, { params });
  return data;
};
