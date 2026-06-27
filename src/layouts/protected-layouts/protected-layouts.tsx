import { useState, useCallback, useEffect, Suspense } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";

import { Icon } from "@/components/ui/icons";
import Header from "@/components/ui/header/header";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { useChatHistory } from "@/components/ui/sidebar/hooks/use-chat-history";
import { useDeleteChat } from "@/components/ui/sidebar/hooks/use-delete-chat";
import { useRenameChat } from "@/components/ui/sidebar/hooks/use-rename-chat";
import { useChatStore } from "@/store/chat.store";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import CommandPalette from "@/components/ui/command-palette/command-palette";
import { useCommandPalette } from "@/components/ui/command-palette/hooks/use-command-palette";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { KEYBOARD_SHORTCUTS } from "@/constants/keyboard-shortcuts";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { chatId: paramsChatId } = useParams();
  const storeChatId = useChatStore((s) => s.chatId);
  const activeChatId = paramsChatId ?? storeChatId;
  const { data: chats, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatHistory();
  const navigate = useNavigate();
  const resetChat = useChatStore((s) => s.reset);

  const handleSelectChat = (id: string) => {
    navigate(`${ROUTES.CHAT}/${id}`);
  };

  const handleSelectHiringRequest = useCallback(
    (id: string) => {
      navigate(`${ROUTES.HIRING_REQUESTS}/${id}`);
    },
    [navigate],
  );

  const deleteChatMutation = useDeleteChat();
  const renameChatMutation = useRenameChat();

  const handleRenameChat = useCallback(
    (chatId: string, title: string) => {
      renameChatMutation.mutate({ chatId, title });
    },
    [renameChatMutation],
  );

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChatMutation.mutate(chatId);
      if (activeChatId === chatId) {
        resetChat();
        navigate(ROUTES.CHAT);
      }
    },
    [activeChatId, deleteChatMutation, resetChat, navigate],
  );

  const handleNewChat = useCallback(() => {
    resetChat();
    navigate(ROUTES.CHAT);
  }, [navigate, resetChat]);

  const handleHome = useCallback(() => {
    navigate(ROUTES.HIRING_REQUESTS);
  }, [navigate]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleActionCenter = useCallback(() => {
    navigate("/hiring-requests?tab=action-center&highlight=true");
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = KEYBOARD_SHORTCUTS;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.HOME.code) {
        e.preventDefault();
        handleHome();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.NEW_CHAT.code) {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.TOGGLE_SIDEBAR.code) {
        e.preventDefault();
        handleToggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.ACTION_CENTER.code) {
        e.preventDefault();
        handleActionCenter();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleNewChat, handleHome, handleToggleSidebar, handleActionCenter]);

  const {
    isOpen: cmdOpen,
    query: cmdQuery,
    setQuery: setCmdQuery,
    sections: cmdSections,
    selectedIndex: cmdSelectedIndex,
    open: cmdOpenPalette,
    close: cmdClose,
    handleKeyDown: cmdHandleKeyDown,
    loadMore: cmdLoadMore,
    hasMore: cmdHasMore,
    isLoadingMore: cmdIsLoadingMore,
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
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
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
          <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
            <Outlet />
          </Suspense>
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
        onLoadMore={cmdLoadMore}
        hasMore={cmdHasMore}
        isLoadingMore={cmdIsLoadingMore}
      />
    </div>
  );
}
