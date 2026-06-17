type HistoryItem = {
  label: string;
  active?: boolean;
};

export type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  Icon: any;
};
