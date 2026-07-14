import type { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

export type HeaderProps = {
  mounted: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  Icon: Record<string, IconComponent>;
  showHint: boolean;
  onHintDismiss: () => void;
};

export type HeaderLeftProps = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  Icon: Record<string, IconComponent>;
  showHint: boolean;
  onHintDismiss: () => void;
};

export type HeaderRightProps = {
  Icon: Record<string, IconComponent>;
};
