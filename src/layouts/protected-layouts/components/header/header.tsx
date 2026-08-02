import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/button/button";
import IconButton from "@/components/ui/icon-button/icon-button";
import Select from "@/components/ui/select/select";
import SearchInput from "@/components/ui/search-input/search-input";
import { useHeaderStore } from "@/store/header.store";
import { useInterviewPlannerStore } from "@/store/interview-planner.store";
import { HIRING_TABS } from "@/constants/routes";
import { isCommandPaletteRoute } from "@/layouts/protected-layouts/components/command-palette/command-palette.registry";
import {
  INTERVIEW_TIME_STATUS_LABEL,
  computeInterviewPlanStats,
} from "@/app/dashboard/hiring-requests-detail/components/interview-design/interview-design.stats";
import { springSnap } from "@/utils/motion";
import CandidateHeader from "./candidate-header";
import TabDropdown from "./tab-dropdown";
import NotificationBell from "./notification-bell/notification-bell";
import JdDetailModal from "@/app/dashboard/hiring-requests-detail/components/modal/jd-detail-modal/jd-detail-modal";
import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";

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

const JobsToolbar = ({ onOpenPalette }: { onOpenPalette?: () => void }) => {
  const config = useHeaderStore((s) => s.config);
  const { title, titleIcon, subtitle, meta, search, filters, viewSwitcher, actions, totalCount, badge, badges } = config;

  const [tooltip, setTooltip] = useState<{ lines: string[]; rect: DOMRect; className?: string } | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback((e: React.MouseEvent<HTMLElement>, lines: string[]) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTooltip({ lines, rect: e.currentTarget.getBoundingClientRect(), className: "info-chip-tooltip--below" });
  }, []);

  const hideTooltip = useCallback(() => {
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 80);
  }, []);

  useEffect(() => {
    return () => { if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current); };
  }, []);

  const headerBadges = useMemo(
    () => badges ?? (badge ? [badge] : []),
    [badges, badge],
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isTabRoute = HIRING_TABS.some((t) => location.pathname.endsWith(`/${t}`));
  const isPaletteRoute = isCommandPaletteRoute(location.pathname);
  const [jdModalOpen, setJdModalOpen] = useState(false);

  const isInterviewDesignRoute = location.pathname.endsWith("/interview-design");
  const isPlannerEditing = useInterviewPlannerStore((s) => s.isEditing);
  const plannerActiveKind = useInterviewPlannerStore((s) => s.activeKind);
  const plannerInterviewPlan = useInterviewPlannerStore((s) => s.interviewPlan);
  const plannerScreeningPlan = useInterviewPlannerStore((s) => s.screeningPlan);

  const interviewStats = useMemo(() => {
    if (!isInterviewDesignRoute || !isPlannerEditing) return null;
    const plan =
      plannerActiveKind === "interview" ? plannerInterviewPlan : plannerScreeningPlan;
    return computeInterviewPlanStats(plannerActiveKind, plan);
  }, [
    isInterviewDesignRoute,
    isPlannerEditing,
    plannerActiveKind,
    plannerInterviewPlan,
    plannerScreeningPlan,
  ]);

  if (meta) {
    return <CandidateHeader title={title} avatarLabel={config.avatarLabel} meta={meta} actions={actions} />;
  }

  return (
    <div className="jobs-toolbar">
      <div className="jobs-toolbar-left">
        {isTabRoute ? (
          <>
            <TabDropdown totalCount={totalCount} />
            {headerBadges.map((b) => (
              <span key={b.label} className="header-badge" title={b.tooltip}>
                {b.icon && <i className={`bx ${b.icon}`} />}
                <span>{b.label}</span>
              </span>
            ))}
            {config.hiringRequestName && (
              <span className="hiring-request-chip" onClick={() => setJdModalOpen(true)}><span className="hiring-request-chip-text">{config.hiringRequestName}</span></span>
            )}
            {interviewStats && (
              <div className="header-interview-stats">
                <span className={`header-interview-pill header-interview-pill--${interviewStats.timeStatus}`}>
                  {interviewStats.totalMinutes} / {interviewStats.targetMinutes} min
                </span>
                <span className={`header-interview-status header-interview-status--${interviewStats.timeStatus}`}>
                  {INTERVIEW_TIME_STATUS_LABEL[interviewStats.timeStatus]}
                </span>
                <span className="header-interview-count">{interviewStats.questionCount} questions</span>
              </div>
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
          <SearchInput
            className="jobs-search"
            placeholder={search.placeholder ?? "Search..."}
            value={search.value ?? ""}
            onChange={(value) => search.onChange?.(value)}
            shortcut={search.shortcut}
            onActivate={isPaletteRoute && onOpenPalette ? onOpenPalette : undefined}
          />
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
                className={`jobs-add-btn${action.className ? ` ${action.className}` : ""}${action.disabled ? " jobs-add-btn--disabled" : ""}${action.tooltipLines ? " jobs-add-btn--icon-only" : ""}`}
                onClick={action.onClick}
                disabled={action.disabled}
                onMouseEnter={action.tooltipLines ? (e) => showTooltip(e, action.tooltipLines!) : undefined}
                onMouseLeave={action.tooltipLines ? hideTooltip : undefined}
                whileHover={action.disabled ? {} : { scale: 1.02 }}
                whileTap={action.disabled ? {} : { scale: 0.97 }}
                transition={springSnap}
              >
                {action.icon && <i className={action.icon} />}
                {!action.tooltipLines && <span className="btn-label">{action.label}</span>}
              </motion.button>
            ) : (
              <div
                onMouseEnter={action.tooltipLines ? (e) => showTooltip(e, action.tooltipLines!) : undefined}
                onMouseLeave={action.tooltipLines ? hideTooltip : undefined}
              >
              <Button
                className={`jobs-export-btn${action.className ? ` ${action.className}` : ""}${action.tooltipLines ? " jobs-export-btn--icon-only" : ""}`}
                onClick={action.onClick}
                disabled={action.disabled}
                loading={action.loading}
                loadingText={action.loadingText}
                icon={action.icon}
                iconPosition={action.iconPosition ?? "right"}
              >
                {!action.tooltipLines && <span className="btn-label">{action.label}</span>}
              </Button>
              </div>
            )}
          </React.Fragment>
        ))}
        <NotificationBell />
      </div>

      {config.hiringRequest && (
        <JdDetailModal open={jdModalOpen} onClose={() => setJdModalOpen(false)} hiringRequest={config.hiringRequest} />
      )}

      {tooltip && <InfoChipTooltip lines={tooltip.lines} rect={tooltip.rect} className={tooltip.className} position="bottom" />}
    </div>
  );
};

/* ───────── RIGHT ───────── */

const HeaderRight: React.FC<HeaderRightProps> = ({ Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isChat = location.pathname === "/chat" || location.pathname.startsWith("/chat/");

  if (!isChat) {
    return (
      <div className="header-right">
        <NotificationBell />
      </div>
    );
  }

  return (
    <div className="header-right">
      <NotificationBell />
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

const Header: React.FC<HeaderProps> = ({ Icon, sidebarOpen, onOpenPalette }) => {
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
        <JobsToolbar onOpenPalette={onOpenPalette} />
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
