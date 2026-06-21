import React from "react";
import IconButton from "@/components/ui/icon-button/icon-button";
import ShareButton from "@/components/ui/share-button/share-button";

import "./header.css";
import type { HeaderLeftProps, HeaderProps } from "./header.types";

/* ───────── LEFT ───────── */


const HeaderLeft: React.FC<HeaderLeftProps> = ({
  sidebarOpen,
  setSidebarOpen,
  Icon,
}) => {
  if (sidebarOpen) return <div className="header-left-empty" />;

  return (
    <IconButton onClick={() => setSidebarOpen(true)}>
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
  return (
    <div className="header-right">
      <IconButton>
        <Icon.Dots />
      </IconButton>

      <ShareButton icon={<Icon.Share />} />

      <IconButton>
        <Icon.Edit />
      </IconButton>
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