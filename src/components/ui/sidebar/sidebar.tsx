import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import "./sidebar.css";
import type { SidebarProps, ChatHistoryItem } from "@/components/ui/sidebar/sidebar.types";
import { Link } from "react-router-dom";
import { SIDEBAR_LABELS, SIDEBAR_USER } from "@/constants/constants";
import BaseModal from "@/components/ui/modal/base-modal";

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

  const renderChatItem = (chat: ChatHistoryItem) => {
    const isRenaming = renamingChatId === chat.id;
    return (
      <div
        key={chat.id}
        className={`sidebar-subitem-wrapper ${activeChatId === chat.id ? "sidebar-subitem-wrapper--active" : ""}`}
      >
        {isRenaming ? (
          <div className="sidebar-subitem sidebar-subitem--renaming">
            <input
              ref={renameInputRef}
              className="sidebar-rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename(chat.id);
                }
                if (e.key === "Escape") {
                  setRenamingChatId(null);
                }
              }}
              onBlur={() => commitRename(chat.id)}
            />
          </div>
        ) : (
          <>
            <button
              onClick={() => onSelectChat?.(chat.id)}
              className="sidebar-subitem"
            >
              <span className="sidebar-subitem-title">{chat.title}</span>
            </button>
            <div className="sidebar-subitem-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="sidebar-menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === chat.id ? null : chat.id);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="8" cy="13" r="1.5" />
                </svg>
              </button>
              {menuOpen === chat.id && (
                <div className="sidebar-menu-dropdown" ref={menuRef}>
                  <button
                    className="sidebar-menu-item"
                    onClick={() => {
                      setRenamingChatId(chat.id);
                      setRenameValue(chat.title);
                      setMenuOpen(null);
                    }}
                  >
                    {SIDEBAR_LABELS.RENAME}
                  </button>
                  <button
                    className="sidebar-menu-item sidebar-menu-item--danger"
                    onClick={() => {
                      setMenuOpen(null);
                      setDeleteTargetId(chat.id);
                    }}
                  >
                    {SIDEBAR_LABELS.DELETE}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

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
              <Group title={SIDEBAR_LABELS.TODAY}>
                {chats.today.map((chat) => renderChatItem(chat))}
              </Group>
            )}

            {chats.earlier.length > 0 && (
              <Group title={SIDEBAR_LABELS.EARLIER}>
                {chats.earlier.map((chat) => renderChatItem(chat))}
              </Group>
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
        <div className="sidebar-user">
          <div className="sidebar-user__row">
            <div className="sidebar-avatar">{SIDEBAR_USER.INITIALS}</div>

            <div>
              <div className="sidebar-user__name">{SIDEBAR_USER.NAME}</div>
              <div className="sidebar-user__email">
                {SIDEBAR_USER.EMAIL}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Delete confirmation modal */}
      <BaseModal
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete chat?"
      >
        <div className="sidebar-delete-body">
          <p className="sidebar-delete-text">
            This will permanently delete this chat and its messages.
          </p>
          <div className="sidebar-delete-actions">
            <button
              className="sidebar-delete-btn sidebar-delete-btn--cancel"
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </button>
            <button
              className="sidebar-delete-btn sidebar-delete-btn--confirm"
              onClick={() => {
                if (deleteTargetId) {
                  onDeleteChat?.(deleteTargetId);
                }
                setDeleteTargetId(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </BaseModal>
    </aside>
  );
};

export default Sidebar;

/* helpers */
const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <p className="sidebar-group-title">{title}</p>
    {children}
  </>
);
