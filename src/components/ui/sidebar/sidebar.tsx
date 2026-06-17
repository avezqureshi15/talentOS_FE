import React from "react";
import "./sidebar.css";
import type { SidebarProps } from "./sidebar.type";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useChatStore } from "../../../store/chat.store";

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  Icon,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversations, threadId, switchConversation, startNewChat } =
    useChatStore();

  const handleNewChat = () => {
    startNewChat();
    if (location.pathname !== "/chat") {
      navigate("/chat");
    }
  };

  const handleSelectChat = (id: string) => {
    switchConversation(id);
    if (location.pathname !== "/chat") {
      navigate("/chat");
    }
  };

  return (
    <aside className={`sidebar ${!sidebarOpen ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__inner">
        <div className="sidebar__top">
          <Link to="/chat" className="sidebar-brand">
            <div className="sidebar-logo">
              <Icon.Logo />
            </div>
            <span className="sidebar-brand-wordmark" aria-label="TalentOS">
              <span className="sidebar-brand-talent">Talent</span>
              <span className="sidebar-brand-os">OS</span>
            </span>
          </Link>

          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
          >
            <Icon.DblChevron />
          </button>
        </div>

        <div className="sidebar__nav">
          <Link to="/hiring-requests">
            <button
              type="button"
              className={`sidebar-item${
                location.pathname.startsWith("/hiring-requests")
                  ? " sidebar-item--active"
                  : ""
              }`}
            >
              <span className="bx bx-home text-lg" />
              Hiring Requests
            </button>
          </Link>

          <button type="button" className="sidebar-item">
            <Icon.Search />
            Search
          </button>

          <button
            type="button"
            className="sidebar-new-chat"
            onClick={handleNewChat}
          >
            <Icon.Plus />
            New Chat
          </button>
        </div>

        <div className="sidebar__history">
          <p className="sidebar-group-title">Recent chats</p>
          <div className="sidebar__scroll">
            {conversations.length === 0 ? (
              <p className="sidebar-empty-chats">No chats yet</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  className={`sidebar-subitem${
                    threadId === conv.id ? " sidebar-subitem--active" : ""
                  }`}
                  onClick={() => handleSelectChat(conv.id)}
                  title={conv.title}
                >
                  {conv.title}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user__row">
            <div className="sidebar-avatar">AQ</div>
            <div>
              <div className="sidebar-user__name">Avez Qureshi</div>
              <div className="sidebar-user__email">
                avezqureshi4785@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
