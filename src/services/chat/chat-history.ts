import { BE_API_BASE_URL } from "@/constants/constants";
import { getVisitorId } from "@/utils/visitor";

export type ChatHistoryItem = {
  id: string;
  visitor_id: string;
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
};

type MessagesResponse = {
  data: ChatMessageItem[];
  has_more: boolean;
};

export const fetchChats = async (): Promise<ChatHistoryItem[]> => {
  const visitorId = getVisitorId();
  const res = await fetch(`${BE_API_BASE_URL}/chat/chats?visitor_id=${encodeURIComponent(visitorId)}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch chats: ${res.status}`);
  }

  const body: ChatsResponse = await res.json();
  return body.data;
};

export const fetchMessages = async (
  chatId: string,
  limit = 20,
  before?: number,
): Promise<MessagesResponse> => {
  let url = `${BE_API_BASE_URL}/chat/messages?chat_id=${encodeURIComponent(chatId)}&limit=${limit}`;
  if (before !== undefined) {
    url += `&before=${before}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch messages: ${res.status}`);
  }

  return res.json() as Promise<MessagesResponse>;
};
