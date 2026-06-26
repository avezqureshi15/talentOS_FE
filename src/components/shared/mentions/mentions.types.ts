export type CommandItem = {
  id: string;
  label: string;
  description?: string;
};

export type CommandEntry = {
  id: string;
  label: string;
  icon?: string;
  children?: CommandEntry[];
  searchPlaceholder?: string;
  fetcher?: (query: string) => Promise<CommandItem[]>;
  getInsertText?: (item?: CommandItem) => string;
};

export type MenuLevel = {
  title: string;
  entries: CommandEntry[];
};
