import type { CommandItem } from "../../types";

export type SlotTabsProps = {
  listItems: CommandItem[];
  selectedIndex: number;
  onSelect: (item: CommandItem) => void;
  setSelectedIndex: (index: number) => void;
};
