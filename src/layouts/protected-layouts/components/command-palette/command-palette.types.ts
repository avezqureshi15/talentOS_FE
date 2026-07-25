export type SearchResultItem = {
  id: string;
  label: string;
  sublabel: string;
  type: "action" | "hiring-request" | "tenant";
};

export type CommandPaletteSection = {
  title: string;
  items: SearchResultItem[];
};

export type CommandPaletteConfig = {
  placeholder: string;
  sectionTitle: string;
  search: (query: string) => Promise<SearchResultItem[]>;
  onSelect: (item: SearchResultItem) => void;
};

export type CmdPaletteProviderValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  registerConfig: (config: CommandPaletteConfig) => void;
  unregisterConfig: () => void;
  hasConfig: boolean;
};
