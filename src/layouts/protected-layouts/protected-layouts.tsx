import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";

import { Icon } from "@/components/ui/icons";
import Header from "@/layouts/protected-layouts/components/header/header";
import Sidebar from "@/layouts/protected-layouts/components/sidebar/sidebar";
import { useChatHistory } from "@/layouts/protected-layouts/components/sidebar/hooks/use-chat-history";
import { useDeleteChat } from "@/layouts/protected-layouts/components/sidebar/hooks/use-delete-chat";
import { useRenameChat } from "@/layouts/protected-layouts/components/sidebar/hooks/use-rename-chat";
import { useChatStore } from "@/store/chat.store";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import CommandPalette from "@/layouts/protected-layouts/components/command-palette/command-palette";
import { useCommandPalette } from "@/layouts/protected-layouts/components/command-palette/hooks/use-command-palette";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { ROUTES } from "@/constants/routes";
import { KEYBOARD_SHORTCUTS } from "@/constants/keyboard-shortcuts";
import { useUiStore } from "@/store/ui.store";
import { STORAGE_KEYS } from "@/constants/constants";
import { getUx, patchUx } from "@/utils/storage";
import { useAurora } from "@/hooks/use-aurora";

function getInitialSidebarState(): boolean {
  const ux = getUx(STORAGE_KEYS.UX);
  if (ux.sb === undefined) {
    patchUx(STORAGE_KEYS.UX, { sb: false });
    return false;
  }
  return ux.sb;
}

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
  const { show: showAurora } = useAurora();
  const ux = useMemo(() => getUx(STORAGE_KEYS.UX), []);
  const showHint = !ux.sbh && !sidebarOpen && !showAurora;
  const handleHintDismiss = useCallback(() => {
    patchUx(STORAGE_KEYS.UX, { sbh: true });
  }, []);
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
    setSidebarOpen((prev) => {
      const next = !prev;
      patchUx(STORAGE_KEYS.UX, { sb: next });
      return next;
    });
  }, []);

  const handleAlerts = useCallback(() => {
    navigate("/hiring-requests?tab=alerts&highlight=true");
  }, [navigate]);

  const handleInterviews = useCallback(() => {
    navigate("/hiring-requests?tab=interviews");
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
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.INTERVIEWS.code) {
        e.preventDefault();
        handleInterviews();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === k.ALERTS.code) {
        e.preventDefault();
        handleAlerts();
      }
      if (e.altKey && e.code === k.SHORTCUTS.code) {
        e.preventDefault();
        useUiStore.getState().toggleShortcutsModal();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleNewChat, handleHome, handleToggleSidebar, handleAlerts, handleInterviews]);

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
          onToggleSidebar={handleToggleSidebar}
          Icon={Icon}
          showHint={showHint}
          onHintDismiss={handleHintDismiss}
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
