import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/button/button";
import IconButton from "@/components/ui/icon-button/icon-button";
import Select from "@/components/ui/select/select";
import { useHeaderStore } from "@/store/header.store";
import { HIRING_TABS } from "@/constants/routes";
import { springSnap } from "@/utils/motion";
import CandidateHeader from "./candidate-header";
import TabDropdown from "./tab-dropdown";
import JdDetailModal from "@/app/dashboard/hiring-requests-detail/components/modal/jd-detail-modal/jd-detail-modal";

import "./header.css";
import type {
  HeaderLeftProps,
  HeaderRightProps,
  HeaderProps,
} from "./header.types";

/* ───────── LEFT ───────── */

const HeaderLeft: React.FC<HeaderLeftProps> = () => {
  return <div className="header-left-empty" />;
};

/* ───────── JOBS TOOLBAR ───────── */

const JobsToolbar = ({ Icon }: { Icon: Record<string, React.ComponentType<{ className?: string }>> }) => {
  const config = useHeaderStore((s) => s.config);
  const { title, titleIcon, subtitle, meta, search, filters, viewSwitcher, actions, totalCount } = config;
  const navigate = useNavigate();
  const location = useLocation();
  const isTabRoute = HIRING_TABS.some((t) => location.pathname.endsWith(`/${t}`));
  const [jdModalOpen, setJdModalOpen] = useState(false);

  if (meta) {
    return <CandidateHeader title={title} avatarLabel={config.avatarLabel} meta={meta} actions={actions} />;
  }

  return (
    <div className="jobs-toolbar">
      <div className="jobs-toolbar-left">
        {isTabRoute ? (
          <>
            <TabDropdown totalCount={totalCount} />
            {config.badge && (
              <span className="header-badge">
                {config.badge.icon && <i className={config.badge.icon} />}
                <span>{config.badge.label}</span>
              </span>
            )}
            {config.hiringRequestName && (
              <span className="hiring-request-chip" onClick={() => setJdModalOpen(true)}><span className="hiring-request-chip-text">{config.hiringRequestName}</span></span>
            )}
          </>
        ) : (
          title && (
            config.backRoute ? (
              <button className="jobs-title-group jobs-title-group--back" onClick={() => navigate(config.backRoute!)}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {titleIcon && <i className={titleIcon} />}
                  <span className="jobs-title">{title}</span>
                </div>
              </button>
            ) : (
              <div className={`jobs-title-group${subtitle ? " jobs-title-group--stacked" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {titleIcon && <i className={titleIcon} />}
                  <h1 className="jobs-title">{title}</h1>
                  {totalCount !== undefined && <span className="jobs-count-pill">{totalCount}</span>}
                </div>
                {subtitle && <span className="jobs-subtitle">{subtitle}</span>}
              </div>
            )
          )
        )}

      </div>

      <div className="jobs-toolbar-right">
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
        {filters?.map((filter, i) => (
          <Select
            key={i}
            className="header-filter-select"
            options={filter.options}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            variant="secondary"
            size="sm"
          />
        ))}
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
                className={`jobs-add-btn${action.className ? ` ${action.className}` : ""}${action.disabled ? " jobs-add-btn--disabled" : ""}`}
                onClick={action.onClick}
                disabled={action.disabled}
                whileHover={action.disabled ? {} : { scale: 1.02 }}
                whileTap={action.disabled ? {} : { scale: 0.97 }}
                transition={springSnap}
              >
                {action.icon && <i className={action.icon} />}
                <span className="btn-label">{action.label}</span>
              </motion.button>
            ) : (
              <div>
              <Button
                className={`jobs-export-btn${action.className ? ` ${action.className}` : ""}`}
                onClick={action.onClick}
                disabled={action.disabled}
                loading={action.loading}
                loadingText={action.loadingText}
                icon={action.icon}
                iconPosition={action.iconPosition ?? "right"}
              >
                <span className="btn-label">{action.label}</span>
              </Button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {config.hiringRequest && (
        <JdDetailModal open={jdModalOpen} onClose={() => setJdModalOpen(false)} hiringRequest={config.hiringRequest} />
      )}
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

/* ─── HIRING ROUTE CHECK ─── */

function isHiringTabRoute(pathname: string): boolean {
  return HIRING_TABS.some((t) => pathname.endsWith(`/${t}`));
}

function isHiringDetailRoute(pathname: string): boolean {
  return /^\/hiring-requests\/\d+/.test(pathname);
}

function isHiringListRoute(pathname: string): boolean {
  return pathname === "/hiring-requests" || pathname.startsWith("/hiring-requests?") || pathname === "/hiring-requests/";
}

/* ───────── HEADER ───────── */

const Header: React.FC<HeaderProps> = ({ Icon, sidebarOpen }) => {
  const config = useHeaderStore((s) => s.config);
  const hasConfig = !!config.title;
  const hasMeta = hasConfig && !!config.meta;
  const location = useLocation();

  const onHiringTab = isHiringTabRoute(location.pathname);
  const onHiringDetail = isHiringDetailRoute(location.pathname);
  const onHiringList = isHiringListRoute(location.pathname);

  return (
    <header className={`header${hasMeta ? " header--has-meta" : ""}${sidebarOpen ? " header--sidebar-open" : ""}`}>
      {onHiringTab || onHiringList || (onHiringDetail && hasConfig) || hasConfig ? (
        <JobsToolbar Icon={Icon} />
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
