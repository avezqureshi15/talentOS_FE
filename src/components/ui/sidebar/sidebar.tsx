import React from "react";
import "./sidebar.css";
import type { SidebarProps } from "@/components/ui/sidebar/sidebar.types";
import { Link } from "react-router-dom";
import { SIDEBAR_LABELS, SIDEBAR_USER } from "@/constants/constants";


const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  HISTORY_TODAY,
  HISTORY_EARLIER,
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
             <span className="bx bx-home text-lg" ></span> {SIDEBAR_LABELS.HIRING_REQUESTS}
          </button>
          </Link>
          <button className="sidebar-item">
            <Icon.Search /> {SIDEBAR_LABELS.SEARCH}
          </button>
              <Link to="/chat">
          <button className="sidebar-item">
            <Icon.Edit /> {SIDEBAR_LABELS.NEW_CHAT}
            <span className="sidebar-badge" />
          </button>
              </Link>
        </div>

        {/* HISTORY */}
        <div className="sidebar__history">
          <div className="sidebar-section-header">
            {SIDEBAR_LABELS.HISTORY} <Icon.Chevron />
          </div>

          <div className="sidebar__scroll">

            <Group title={SIDEBAR_LABELS.TODAY}>
              {HISTORY_TODAY.map(({ label, active }) => (
                <button
                  key={label}
                  className={`sidebar-subitem ${
                    active ? "sidebar-subitem--active" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </Group>

            <Group title={SIDEBAR_LABELS.EARLIER}>
              {HISTORY_EARLIER.map(({ label }) => (
                <button className="sidebar-subitem" key={label}>
                  {label}
                </button>
              ))}
            </Group>

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