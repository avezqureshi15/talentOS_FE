import type { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

export type HeaderProps = {
  mounted: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  Icon: Record<string, IconComponent>;
};

export type HeaderLeftProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  Icon: Record<string, IconComponent>;
};

export type HeaderRightProps = {
  Icon: Record<string, IconComponent>;
};
