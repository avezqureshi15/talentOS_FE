import { useState, useCallback, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";

import { Icon } from "@/components/ui/icons";
import Header from "@/components/ui/header/header";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { useChatHistory } from "@/components/ui/sidebar/hooks/use-chat-history";
import { useChatStore } from "@/store/chat.store";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import CommandPalette from "@/components/ui/command-palette/command-palette";
import { useCommandPalette } from "@/components/ui/command-palette/hooks/use-command-palette";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { chatId: paramsChatId } = useParams();
  const storeChatId = useChatStore((s) => s.chatId);
  const activeChatId = paramsChatId ?? storeChatId;
  const { data: chats } = useChatHistory();
  const navigate = useNavigate();
  const resetChat = useChatStore((s) => s.reset);

  const handleSelectChat = (id: string) => {
    window.location.href = `/chat/${id}`;
  };

  const handleSelectHiringRequest = useCallback(
    (id: string) => {
      navigate(`/hiring-requests/${id}`);
    },
    [navigate],
  );

  const handleNewChat = useCallback(() => {
    resetChat();
    navigate("/chat");
  }, [navigate, resetChat]);

  const handleHome = useCallback(() => {
    navigate("/hiring-requests");
  }, [navigate]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyH") {
        e.preventDefault();
        handleHome();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyS") {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleNewChat, handleHome, handleToggleSidebar]);

  const {
    isOpen: cmdOpen,
    query: cmdQuery,
    setQuery: setCmdQuery,
    sections: cmdSections,
    selectedIndex: cmdSelectedIndex,
    open: cmdOpenPalette,
    close: cmdClose,
    handleKeyDown: cmdHandleKeyDown,
  } = useCommandPalette(handleSelectHiringRequest, handleNewChat);

  return (
    <div className="chat-root">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chats={chats ?? { today: [], earlier: [] }}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onSearch={cmdOpenPalette}
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

      <CommandPalette
        open={cmdOpen}
        onClose={cmdClose}
        query={cmdQuery}
        onQueryChange={setCmdQuery}
        sections={cmdSections}
        selectedIndex={cmdSelectedIndex}
        onKeyDown={cmdHandleKeyDown}
        onSelectHiringRequest={handleSelectHiringRequest}
        onNewChat={handleNewChat}
      />
    </div>
  );
}
