import React from "react";
import "./sidebar.css";
import type { SidebarProps } from "@/components/ui/sidebar/sidebar.types";
import { Link } from "react-router-dom";
import { SIDEBAR_LABELS, SIDEBAR_USER } from "@/constants/constants";

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  chats,
  activeChatId,
  onSelectChat,
  onSearch,
  Icon,
}) => {
  return (
    <aside className={`sidebar ${!sidebarOpen ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__inner">

        {/* TOP */}
        <div className="sidebar__top">
          <div className="sidebar-logo">
            <Icon.Logo />
          </div>

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
          </button>
              </Link>
        </div>

        {/* HISTORY */}
        <div className="sidebar__history">
          <div className="sidebar-section-header">
            {SIDEBAR_LABELS.HISTORY} <Icon.Chevron />
          </div>

          <div className="sidebar__scroll">

            {chats.today.length > 0 && (
              <Group title={SIDEBAR_LABELS.TODAY}>
                {chats.today.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat?.(chat.id)}
                    className={`sidebar-subitem ${
                      activeChatId === chat.id ? "sidebar-subitem--active" : ""
                    }`}
                  >
                    <span className="sidebar-subitem-title">{chat.title}</span>
                  </button>
                ))}
              </Group>
            )}

            {chats.earlier.length > 0 && (
              <Group title={SIDEBAR_LABELS.EARLIER}>
                {chats.earlier.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat?.(chat.id)}
                    className="sidebar-subitem"
                  >
                    <span className="sidebar-subitem-title">{chat.title}</span>
                  </button>
                ))}
              </Group>
            )}

          </div>
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
