import type { ComponentType } from "react";

export type IconComponent = ComponentType<{ className?: string }>;

export type HeaderProps = {
  Icon: Record<string, IconComponent>;
  sidebarOpen?: boolean;
  onOpenPalette?: () => void;
};

export type HeaderLeftProps = Record<string, never>;

export type HeaderRightProps = {
  Icon: Record<string, IconComponent>;
};

export type ConfigToolbarProps = {
  Icon: Record<string, IconComponent>;
};
