import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@/components/ui/icon-button/icon-button";
import ShareButton from "@/components/ui/share-button/share-button";

import "./header.css";
import type { HeaderLeftProps, HeaderRightProps, HeaderProps } from "./header.types";
import { useHeaderShare } from "./hooks/use-header-share";

/* ───────── LEFT ───────── */


const HeaderLeft: React.FC<HeaderLeftProps> = ({
  sidebarOpen,
  onToggleSidebar,
  Icon,
  showHint,
  onHintDismiss,
}) => {
  if (sidebarOpen) return <div className="header-left-empty" />;

  return (
    <div className={`header-hamburger-wrapper${showHint ? " header-hamburger--hint" : ""}`}>
      <IconButton onClick={() => { onToggleSidebar(); onHintDismiss(); }} title="Ctrl+Shift+S">
        <Icon.Hamburger />
      </IconButton>
    </div>
  );
};

/* ───────── RIGHT ───────── */

const HeaderRight: React.FC<HeaderRightProps> = ({ Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { copied, handleShare } = useHeaderShare();

  const isChat = location.pathname === "/chat" || location.pathname.startsWith("/chat/");
  const isHiringDetail = location.pathname.startsWith("/hiring-requests/");

  return (
    <div className="header-right">
      {isHiringDetail && (
        <ShareButton
          icon={<Icon.Share />}
          onClick={handleShare}
          label={copied ? "Copied!" : undefined}
        />
      )}

      {isChat && (
        <IconButton onClick={() => navigate("/chat")}>
          <Icon.Edit />
        </IconButton>
      )}
    </div>
  );
};



const Header: React.FC<HeaderProps> = ({
  mounted,
  sidebarOpen,
  onToggleSidebar,
  Icon,
  showHint,
  onHintDismiss,
}) => {
  return (
    <header
      className={`header cui-fade-up${mounted ? "" : " opacity-0"}`}
    >
      <HeaderLeft
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        Icon={Icon}
        showHint={showHint}
        onHintDismiss={onHintDismiss}
      />

      <HeaderRight Icon={Icon} />
    </header>
  );
};

export default Header;
