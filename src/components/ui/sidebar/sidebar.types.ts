import type { ComponentType } from "react";
import type { ChatHistoryItem } from "@/services/chat/chat-history";
import type { GroupedChats } from "@/components/ui/sidebar/hooks/use-chat-history";

type IconComponent = ComponentType<{ className?: string }>;

export type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  chats: GroupedChats;
  activeChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
  onSearch?: () => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, title: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  Icon: Record<string, IconComponent>;
};

export type { ChatHistoryItem, GroupedChats };
