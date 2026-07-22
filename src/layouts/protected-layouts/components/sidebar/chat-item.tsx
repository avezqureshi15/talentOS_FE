import { motion, AnimatePresence } from "framer-motion";
import { SIDEBAR_LABELS } from "@/constants/constants";
import type { ChatHistoryItem } from "@/layouts/protected-layouts/components/sidebar/sidebar.types";
import { resolveCommandTitle } from "@/app/chat/components/chat-area/chat-area.utils";
import { springSnap } from "@/utils/motion";

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
    <motion.div
      className={`sidebar-subitem-wrapper ${activeChatId === chat.id ? "sidebar-subitem-wrapper--active" : ""}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
          <motion.button
            onClick={() => onSelectChat(chat.id)}
            className="sidebar-subitem"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            transition={springSnap}
          >
            <span className="sidebar-subitem-title">{resolveCommandTitle(chat.title)}</span>
          </motion.button>
          <div className="sidebar-subitem-menu" onClick={(e) => e.stopPropagation()}>
            <motion.button
              className="sidebar-menu-trigger"
              onClick={(e) => { e.stopPropagation(); onToggleMenu(menuOpen === chat.id ? null : chat.id); }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={springSnap}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </motion.button>
            <AnimatePresence>
              {menuOpen === chat.id && (
                <motion.div
                  className="sidebar-menu-dropdown"
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.button
                    className="sidebar-menu-item"
                    onClick={() => { onStartRename(chat.id, chat.title); onToggleMenu(null); }}
                    whileHover={{ x: 3 }}
                    transition={springSnap}
                  >
                    {SIDEBAR_LABELS.RENAME}
                  </motion.button>
                  <motion.button
                    className="sidebar-menu-item sidebar-menu-item--danger"
                    onClick={() => { onToggleMenu(null); onDeleteTarget(chat.id); }}
                    whileHover={{ x: 3 }}
                    transition={springSnap}
                  >
                    {SIDEBAR_LABELS.DELETE}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatItem;
