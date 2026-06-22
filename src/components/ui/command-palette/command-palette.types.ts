import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type SearchResultItem = {
  id: string;
  label: string;
  sublabel: string;
  type: "action" | "hiring-request";
  hiringRequest?: HiringRequest;
};

export type CommandPaletteProps = {
  open: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  sections: CommandPaletteSection[];
  selectedIndex: number;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSelectHiringRequest: (id: string) => void;
  onNewChat: () => void;
};

export type CommandPaletteSection = {
  title: string;
  items: SearchResultItem[];
};
