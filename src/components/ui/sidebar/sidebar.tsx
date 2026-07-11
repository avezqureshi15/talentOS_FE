import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import "./sidebar.css";
import type { SidebarProps, ChatHistoryItem } from "@/components/ui/sidebar/sidebar.types";
import { Link } from "react-router-dom";
import { SIDEBAR_LABELS } from "@/constants/constants";
import SidebarGroup from "./sidebar-group";
import DeleteChatModal from "./delete-chat-modal";
import ChatItem from "./chat-item";
import SidebarUserPopover from "@/components/ui/sidebar/sidebar-user-popover/sidebar-user-popover";

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  chats,
  activeChatId,
  onSelectChat,
  onSearch,
  onDeleteChat,
  onRenameChat,
  onLoadMore,
  hasMore,
  isLoadingMore,
  Icon,
}) => {
  // justification: historyOpen controls the collapse/expand state of the chat history section
  const [historyOpen, setHistoryOpen] = useState(true);
  // justification: menuOpen tracks which chat's 3-dots menu is currently open
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // justification: renamingChatId tracks which chat title is being edited inline
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  // justification: renameValue holds the current input value during rename
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  // justification: deleteTargetId is the chat waiting for delete confirmation via modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const sentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (hasMore && !isLoadingMore) {
        onLoadMore?.();
      }
    }, [hasMore, isLoadingMore, onLoadMore]),
    !!hasMore && !isLoadingMore,
  );

  // Explanation: close the context menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Explanation: auto-focus the rename input when it appears
  useEffect(() => {
    if (renamingChatId) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingChatId]);

  const commitRename = useCallback(
    (chatId: string) => {
      const trimmed = renameValue.trim();
      if (trimmed && trimmed !== chats.today.find((c) => c.id === chatId)?.title &&
          trimmed !== chats.earlier.find((c) => c.id === chatId)?.title) {
        onRenameChat?.(chatId, trimmed);
      }
      setRenamingChatId(null);
      setMenuOpen(null);
    },
    [renameValue, chats, onRenameChat],
  );

  const renderChatItem = (chat: ChatHistoryItem) => (
    <ChatItem
      key={chat.id}
      chat={chat}
      activeChatId={activeChatId ?? null}
      menuOpen={menuOpen}
      renamingChatId={renamingChatId}
      renameValue={renameValue}
      onSelectChat={(id) => onSelectChat?.(id)}
      onToggleMenu={setMenuOpen}
      onStartRename={(id, title) => { setRenamingChatId(id); setRenameValue(title); }}
      onDeleteTarget={(id) => setDeleteTargetId(id)}
      onRenameInput={setRenameValue}
      onKeyDownRename={(e, chatId) => {
        if (e.key === "Enter") { e.preventDefault(); commitRename(chatId); }
        if (e.key === "Escape") { setRenamingChatId(null); }
      }}
      onBlurRename={commitRename}
      renameInputRef={renameInputRef}
      menuRef={menuRef}
    />
  );

  return (
    <aside className={`sidebar ${!sidebarOpen ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__inner">

        {/* TOP */}
        <div className="sidebar__top">
          <Icon.Logo />

          <button
            className="sidebar-item flex justify-end"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon.DblChevron />
          </button>
        </div>

        {/* NAV */}
        <div className="sidebar__nav">
          <Link to="/hiring-requests">
          <button className="sidebar-item">
             <span className="bx bx-home text-lg" ></span>
             <span className="sidebar-item-label">{SIDEBAR_LABELS.HIRING_REQUESTS}</span>
             <span className="sidebar-shortcut">Ctrl+Shift+H</span>
          </button>
          </Link>
          <Link to="/hiring-requests?tab=interviews">
          <button className="sidebar-item">
            <span className="bx bx-calendar-check text-lg" ></span>
            <span className="sidebar-item-label">Interviews</span>
            <span className="sidebar-shortcut">Ctrl+Shift+I</span>
          </button>
          </Link>
          <Link to="/hiring-requests?tab=alerts">
          <button className="sidebar-item">
            <span className="bx bx-bell text-lg" ></span>
            <span className="sidebar-item-label">Alerts</span>
            <span className="sidebar-shortcut">Ctrl+Shift+A</span>
          </button>
          </Link>
          <button className="sidebar-item" onClick={onSearch}>
            <Icon.Search />
            <span className="sidebar-item-label">{SIDEBAR_LABELS.SEARCH}</span>
            <span className="sidebar-shortcut">Ctrl+K</span>
          </button>
              <Link to="/chat">
          <button className="sidebar-item">
            <Icon.Edit />
            <span className="sidebar-item-label">{SIDEBAR_LABELS.NEW_CHAT}</span>
            <span className="sidebar-shortcut">Ctrl+Shift+C</span>
          </button>
              </Link>
        </div>

        {/* HISTORY */}
        <div className="sidebar__history">
          <div className="sidebar-section-header" onClick={() => setHistoryOpen(!historyOpen)}>
            {SIDEBAR_LABELS.HISTORY} <span className={`sidebar-chevron ${historyOpen ? "" : "sidebar-chevron--collapsed"}`}><Icon.Chevron /></span>
          </div>

          {historyOpen && (
          <div className="sidebar__scroll">

            {chats.today.length > 0 && (
              <SidebarGroup title={SIDEBAR_LABELS.TODAY}>
                {chats.today.map((chat) => renderChatItem(chat))}
              </SidebarGroup>
            )}

            {chats.earlier.length > 0 && (
              <SidebarGroup title={SIDEBAR_LABELS.EARLIER}>
                {chats.earlier.map((chat) => renderChatItem(chat))}
              </SidebarGroup>
            )}

            {isLoadingMore && (
              <div className="sidebar-loading-more">
                <LoadingSpinner size="sm" />
              </div>
            )}

            <div ref={sentinelRef} className="sidebar-scroll-sentinel" />

          </div>
          )}
        </div>

        {/* USER */}
        <SidebarUserPopover />

      </div>

      <DeleteChatModal
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => { if (deleteTargetId) { onDeleteChat?.(deleteTargetId); } setDeleteTargetId(null); }}
      />
    </aside>
  );
};

export default Sidebar;
