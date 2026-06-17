import React from "react";
import IconButton from "../icon-button/icon-button";

import "./header.css";
import type { HeaderLeftProps, HeaderProps } from "./header.type";

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

type HeaderRightProps = {
  Icon: any;
};

const HeaderRight: React.FC<HeaderRightProps> = ({ Icon }) => {
  return (
    <div className="header-right">
      <IconButton>
        <Icon.Dots />
      </IconButton>

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