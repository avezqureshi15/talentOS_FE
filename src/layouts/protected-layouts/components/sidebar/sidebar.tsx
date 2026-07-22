import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { getInitials } from "@/utils/user";
import "./sidebar.css";
import type { SidebarProps, ChatHistoryItem } from "@/layouts/protected-layouts/components/sidebar/sidebar.types";
import { SIDEBAR_LABELS } from "@/constants/constants";
import SidebarGroup from "./sidebar-group";
import DeleteChatModal from "./delete-chat-modal";
import ChatItem from "./chat-item";
import SidebarNav from "./sidebar-nav";
import SidebarUserPopover from "@/layouts/protected-layouts/components/sidebar/sidebar-user-popover/sidebar-user-popover";
import { Sidebar as SidebarShell, SidebarSection } from "@/components/ui/sidebar";

const navItems = [
  { icon: "bx bx-home", label: SIDEBAR_LABELS.HIRING_REQUESTS, shortcut: "Ctrl+Shift+H", href: "/hiring-requests" },
  { icon: "bx bx-calendar-check", label: "Interviews", shortcut: "Ctrl+Shift+I", href: "/hiring-requests?tab=interviews" },
  { icon: "bx bx-bell", label: "Alerts", shortcut: "Ctrl+Shift+A", href: "/hiring-requests?tab=alerts" },
];

const secondaryItems = [
  { icon: "bx bx-search", label: SIDEBAR_LABELS.SEARCH, shortcut: "Ctrl+K" },
  { icon: "bx bx-plus-circle", label: SIDEBAR_LABELS.NEW_CHAT, shortcut: "Ctrl+Shift+C", href: "/chat" },
];

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [autoOpenUser, setAutoOpenUser] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const sentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (hasMore && !isLoadingMore) {
        onLoadMore?.();
      }
    }, [hasMore, isLoadingMore, onLoadMore]),
    !!hasMore && !isLoadingMore,
  );

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

  const allNavItems = [...navItems, ...secondaryItems];

  /* ---------- Collapsed Icon Strip ---------- */

  if (!sidebarOpen) {
    return (
      <SidebarShell open={sidebarOpen}>
        <div className="sidebar-collapsed-inner">
          <div className="sidebar-collapsed-top">
            <button
              className="sidebar-collapsed-btn"
              onClick={() => setSidebarOpen(true)}
              title="Expand sidebar"
            >
              <i className="bx bx-chevron-right" />
            </button>

            <div className="sidebar-collapsed-nav">
              {allNavItems.map((item) => (
                <div key={item.label} className="sidebar-tooltip-wrapper">
                  <button
                    className="sidebar-collapsed-btn"
                    onClick={() => {
                      if (item.href) navigate(item.href);
                      else if (item.label === SIDEBAR_LABELS.SEARCH) onSearch?.();
                    }}
                  >
                    <i className={item.icon} />
                  </button>
                  <span className="sidebar-tooltip">
                    {item.label}
                    {item.shortcut && <span className="sidebar-tooltip-shortcut">({item.shortcut})</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>


          <div className="sidebar-tooltip-wrapper">
            <button
              className="sidebar-collapsed-avatar"
              onClick={() => { setSidebarOpen(true); setAutoOpenUser(true); }}
            >
              {user ? getInitials(user.name) : "?"}
            </button>
            <span className="sidebar-tooltip">
              {user?.name ?? "User"}
            </span>
          </div>
        </div>
      </SidebarShell>
    );
  }

  /* ---------- Expanded Sidebar ---------- */

  return (
    <SidebarShell open={sidebarOpen}>
      <SidebarNav Icon={Icon} onSearch={onSearch} onClose={() => setSidebarOpen(false)} />

      {/* HISTORY */}
      <div className="sidebar__history">
        <SidebarSection
          title={SIDEBAR_LABELS.HISTORY}
          collapsible
          defaultOpen={historyOpen}
          onToggle={(o) => setHistoryOpen(o)}
        >
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
        </SidebarSection>
      </div>

      {/* USER */}
      <SidebarUserPopover
        autoOpen={autoOpenUser}
        onAutoOpened={() => setAutoOpenUser(false)}
      />

      <DeleteChatModal
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => { if (deleteTargetId) { onDeleteChat?.(deleteTargetId); } setDeleteTargetId(null); }}
      />
    </SidebarShell>
  );
};

export default Sidebar;
