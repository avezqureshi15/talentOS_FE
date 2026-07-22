import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import IconButton from "@/components/ui/icon-button/icon-button";
import Button from "@/components/ui/button/button";
import { useHeaderStore } from "@/store/header.store";
import { springSnap } from "@/utils/motion";

import "./header.css";
import type {
  HeaderLeftProps,
  HeaderRightProps,
  HeaderProps,
  ConfigToolbarProps,
} from "./header.types";

/* ───────── LEFT ───────── */

const HeaderLeft: React.FC<HeaderLeftProps> = () => {
  return <div className="header-left-empty" />;
};

/* ───────── CONFIG-DRIVEN TOOLBAR ───────── */

const ConfigToolbar: React.FC<ConfigToolbarProps> = ({
  Icon,
}) => {
  const config = useHeaderStore((s) => s.config);
  const { title, totalCount, search, viewSwitcher, actions } = config;

  return (
    <div className="jobs-toolbar">
      <div className="jobs-toolbar-left">
        {title && (
          <div className="jobs-title-group">
            <h1 className="jobs-title">{title}</h1>
            {totalCount !== undefined && (
              <span className="jobs-count-pill">{totalCount}</span>
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

const Header: React.FC<HeaderProps> = ({
  Icon,
}) => {
  const config = useHeaderStore((s) => s.config);
  const hasConfig = !!config.title;

  return (
    <header className="header">
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
