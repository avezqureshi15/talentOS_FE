import type { ComponentType } from "react";

type HistoryItem = {
  label: string;
  active?: boolean;
};

type IconComponent = ComponentType<{ className?: string }>;

export type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  HISTORY_TODAY: HistoryItem[];
  HISTORY_EARLIER: HistoryItem[];
  Icon: Record<string, IconComponent>;
};
