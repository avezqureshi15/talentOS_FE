import { SIDEBAR_LABELS } from "@/constants/constants";
import type { ChatHistoryItem } from "@/layouts/protected-layouts/components/sidebar/sidebar.types";
import { resolveCommandTitle } from "@/app/chat/components/chat-area/chat-area.utils";

type ChatItemProps = {
  chat: ChatHistoryItem;
  activeChatId: string | null;
  menuOpen: string | null;
  renamingChatId: string | null;
  renameValue: string;
  onSelectChat: (id: string) => void;
  onToggleMenu: (id: string | null) => void;
  onStartRename: (id: string, title: string) => void;
  onDeleteTarget: (id: string) => void;
  onRenameInput: (value: string) => void;
  onKeyDownRename: (e: React.KeyboardEvent, chatId: string) => void;
  onBlurRename: (chatId: string) => void;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

const ChatItem = ({
  chat,
  activeChatId,
  menuOpen,
  renamingChatId,
  renameValue,
  onSelectChat,
  onToggleMenu,
  onStartRename,
  onDeleteTarget,
  onRenameInput,
  onKeyDownRename,
  onBlurRename,
  renameInputRef,
  menuRef,
}: ChatItemProps) => {
  const isRenaming = renamingChatId === chat.id;

  return (
    <div
      className={`sidebar-subitem-wrapper ${activeChatId === chat.id ? "sidebar-subitem-wrapper--active" : ""}`}
    >
      {isRenaming ? (
        <div className="sidebar-subitem sidebar-subitem--renaming">
          <input
            ref={renameInputRef}
            className="sidebar-rename-input"
            value={renameValue}
            onChange={(e) => onRenameInput(e.target.value)}
            onKeyDown={(e) => onKeyDownRename(e, chat.id)}
            onBlur={() => onBlurRename(chat.id)}
          />
        </div>
      ) : (
        <>
          <button onClick={() => onSelectChat(chat.id)} className="sidebar-subitem">
            <span className="sidebar-subitem-title">{resolveCommandTitle(chat.title)}</span>
          </button>
          <div className="sidebar-subitem-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="sidebar-menu-trigger"
              onClick={(e) => { e.stopPropagation(); onToggleMenu(menuOpen === chat.id ? null : chat.id); }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
            {menuOpen === chat.id && (
              <div className="sidebar-menu-dropdown" ref={menuRef}>
                <button className="sidebar-menu-item" onClick={() => { onStartRename(chat.id, chat.title); onToggleMenu(null); }}>
                  {SIDEBAR_LABELS.RENAME}
                </button>
                <button className="sidebar-menu-item sidebar-menu-item--danger" onClick={() => { onToggleMenu(null); onDeleteTarget(chat.id); }}>
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

export default ChatItem;
