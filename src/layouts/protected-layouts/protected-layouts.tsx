import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { Icon } from "@/components/ui/icons";
import Header from "@/components/ui/header/header";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { useChatHistory } from "@/components/ui/sidebar/hooks/use-chat-history";
import { useChatStore } from "@/store/chat.store";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { chatId: paramsChatId } = useParams();
  const storeChatId = useChatStore((s) => s.chatId);
  const activeChatId = paramsChatId ?? storeChatId;
  const { data: chats } = useChatHistory();

  const handleSelectChat = (id: string) => {
    window.location.href = `/chat/${id}`;
  };

  return (
    <div className="chat-root">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chats={chats ?? { today: [], earlier: [] }}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        Icon={Icon}
      />

      <main className="chat-main">
        <Header
          mounted={false}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          Icon={Icon}
        />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
