import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import IconButton from "@/components/ui/icon-button/icon-button";
import Button from "@/components/ui/button/button";
import { useHeaderStore } from "@/store/header.store";
import { HIRING_TABS } from "@/constants/routes";
import { springSnap } from "@/utils/motion";

import "./header.css";
import type {
  HeaderLeftProps,
  HeaderRightProps,
  HeaderProps,
  ConfigToolbarProps,
} from "./header.types";

const TAB_LABELS: Record<string, string> = {
  applications: "Applications",
  "interview-design": "Interview Design",
  proctoring: "Proctoring",
};

/* ───────── LEFT ───────── */

const HeaderLeft: React.FC<HeaderLeftProps> = () => {
  return <div className="header-left-empty" />;
};

/* ───────── CONFIG-DRIVEN TOOLBAR ───────── */

const ConfigToolbar: React.FC<ConfigToolbarProps> = ({
  Icon,
}) => {
  const config = useHeaderStore((s) => s.config);
  const { title, avatarLabel, totalCount, meta, search, viewSwitcher, actions } = config;
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTab = HIRING_TABS.find((t) => location.pathname.endsWith(`/${t}`));
  const currentTabIndex = currentTab !== undefined ? HIRING_TABS.indexOf(currentTab) : -1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const navigateTab = (tab: string) => {
    setDropdownOpen(false);
    if (!id) return;
    navigate(`/hiring-requests/${id}/${tab}`);
  };

  if (meta) {
    return (
      <div className="jobs-toolbar">
        <div className="jobs-candidate-left">
          {avatarLabel && (
            <div className="jobs-avatar-ring">{avatarLabel}</div>
          )}
          <div className="jobs-candidate-info">
            <div className="jobs-candidate-top-row">
              <span className="jobs-email-text">{title}</span>
              <span className={`jobs-status-chip jobs-status-chip--${meta[0]?.variant ?? "success"}`}>
                <span className="jobs-status-dot" />
                {meta[0]?.label}
              </span>
              <span className="jobs-job-title-text">{meta[1]?.label}</span>
            </div>
            <div className="jobs-candidate-bottom-row">
              <span>{meta[2]?.label}</span>
              {meta[3] && <span className="jobs-relative-tag">{meta[3].label}</span>}
            </div>
          </div>
        </div>
        <div className="jobs-toolbar-right">
          {actions?.map((action) => (
            <button key={action.key} className="jobs-glass-btn" onClick={action.onClick}>
              {action.icon && <i className={action.icon} />}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-toolbar">
      <div className="jobs-toolbar-left">
        {title && (
          <div className="jobs-title-group" ref={currentTabIndex >= 0 ? dropdownRef : undefined}>
            <div
              className="jobs-title-dropdown-trigger"
              onClick={() => currentTabIndex >= 0 && setDropdownOpen((v) => !v)}
            >
              <h1 className="jobs-title">{title}</h1>
              {currentTabIndex >= 0 && <i className="bx bx-chevron-down jobs-title-dropdown-arrow" />}
            </div>
            {totalCount !== undefined && (
              <span className="jobs-count-pill">{totalCount}</span>
            )}
            {currentTabIndex >= 0 && dropdownOpen && (
              <div className="jobs-title-dropdown">
                {HIRING_TABS.map((tab, i) => (
                  <div
                    key={tab}
                    className={`jobs-title-dropdown-item${i === currentTabIndex ? " jobs-title-dropdown-item--active" : ""}`}
                    onClick={() => navigateTab(tab)}
                  >
                    {TAB_LABELS[tab]}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {search && (
          <div className="jobs-search">
            <Icon.Search />
            <input
              type="text"
              placeholder={search.placeholder ?? "Search..."}
              value={search.value}
              onChange={(e) => search.onChange?.(e.target.value)}
            />
            {search.shortcut && (
              <span className="jobs-search-shortcut">{search.shortcut}</span>
            )}
          </div>
        )}
      </div>

      <div className="jobs-toolbar-right">
        {viewSwitcher && (
          <div className="jobs-view-switcher">
            {viewSwitcher.options.map((opt) => (
              <motion.button
                key={opt.key}
                className={`jobs-view-btn${viewSwitcher.active === opt.key ? " jobs-view-btn--active" : ""}`}
                onClick={() => viewSwitcher.onChange(opt.key)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springSnap}
              >
                <i className={opt.icon} />
                <span className="btn-label">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        )}

        {actions?.map((action) => (
          <React.Fragment key={action.key}>
            {action.variant === "primary" ? (
              <motion.button
                className="jobs-add-btn"
                onClick={action.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnap}
              >
                {action.icon && <i className={action.icon} />}
                <span className="btn-label">{action.label}</span>
              </motion.button>
            ) : (
              <Button
                className="jobs-export-btn"
                onClick={action.onClick}
                loading={action.loading}
                loadingText={action.loadingText}
                icon={action.icon}
                iconPosition={action.iconPosition ?? "right"}
              >
                <span className="btn-label">{action.label}</span>
              </Button>
            )}
            {action.error && <span className="jobs-export-error">{action.error}</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ───────── RIGHT ───────── */

const HeaderRight: React.FC<HeaderRightProps> = ({ Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isChat = location.pathname === "/chat" || location.pathname.startsWith("/chat/");

  if (!isChat) return <div className="header-right" />;

  return (
    <div className="header-right">
      <IconButton onClick={() => navigate("/chat")}>
        <Icon.Edit />
      </IconButton>
    </div>
  );
};

/* ───────── HEADER ───────── */

const Header: React.FC<HeaderProps> = ({ Icon }) => {
  const config = useHeaderStore((s) => s.config);
  const hasConfig = !!config.title;
  const hasMeta = hasConfig && !!config.meta;

  return (
    <header className={`header${hasMeta ? " header--has-meta" : ""}`}>
      {hasConfig ? (
        <ConfigToolbar Icon={Icon} />
      ) : (
        <>
          <HeaderLeft />
          <HeaderRight Icon={Icon} />
        </>
      )}
    </header>
  );
};

export default Header;
