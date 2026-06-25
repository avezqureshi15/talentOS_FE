import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@/components/ui/icon-button/icon-button";
import ShareButton from "@/components/ui/share-button/share-button";

import "./header.css";
import type { HeaderLeftProps, HeaderProps } from "./header.types";
import { useHeaderShare } from "./hooks/useHeaderShare";

/* ───────── LEFT ───────── */


const HeaderLeft: React.FC<HeaderLeftProps> = ({
  sidebarOpen,
  setSidebarOpen,
  Icon,
}) => {
  if (sidebarOpen) return <div className="header-left-empty" />;

  return (
    <IconButton onClick={() => setSidebarOpen(true)} title="Ctrl+Shift+S">
      <Icon.Hamburger />
    </IconButton>
  );
};

/* ───────── RIGHT ───────── */

import type { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

type HeaderRightProps = {
  Icon: Record<string, IconComponent>;
};

const HeaderRight: React.FC<HeaderRightProps> = ({ Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { copied, handleShare } = useHeaderShare();

  const isChat = location.pathname === "/chat" || location.pathname.startsWith("/chat/");
  const isHiringDetail = location.pathname.startsWith("/hiring-requests/");

  return (
    <div className="header-right">
      {/* {isChat && (
        <IconButton>
          <Icon.Dots />
        </IconButton>
      )} */}

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
  setSidebarOpen,
  Icon,
}) => {
  return (
    <header
      className={`header cui-fade-up${mounted ? "" : " opacity-0"}`}
    >
      <HeaderLeft
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        Icon={Icon}
      />

      <HeaderRight Icon={Icon} />
    </header>
  );
};

export default Header;