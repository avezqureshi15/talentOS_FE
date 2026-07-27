import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type SearchResultItem = {
  id: string;
  label: string;
  sublabel: string;
  type: "action" | "hiring-request" | "tenant";
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
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

export type CommandPaletteSection = {
  title: string;
  items: SearchResultItem[];
};

export type CommandPaletteConfig = {
  placeholder: string;
  sectionTitle: string;
  search: (q: string) => Promise<SearchResultItem[]>;
  onSelect: (item: { id: string }) => void;
};
