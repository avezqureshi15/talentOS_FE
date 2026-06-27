import { useState, useEffect, useCallback } from "react";
import type { CommandEntry, CommandItem, MenuLevel } from "./mentions.types";
import { ROOT_MENU } from "./command-menu.config";

export const useCommandMenu = () => {
  const [stack, setStack] = useState<MenuLevel[]>([{ title: "", entries: ROOT_MENU }]);
  const [search, setSearch] = useState("");
  const [listItems, setListItems] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentLevel = stack[stack.length - 1];
  const isListView = currentLevel.entries.length === 1 && !!currentLevel.entries[0].fetcher;
  const activeEntry = isListView ? currentLevel.entries[0] : null;
  const canGoBack = stack.length > 1;

  const filteredEntries = isListView
    ? []
    : currentLevel.entries.filter((e) =>
        e.label.toLowerCase().includes(search.toLowerCase()),
      );

  const activeItems: (CommandEntry | CommandItem)[] = isListView ? listItems : filteredEntries;

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredEntries.length, listItems.length, stack.length]);

  useEffect(() => {
    if (!isListView || !activeEntry?.fetcher) {
      setListItems([]);
      return;
    }
    activeEntry.fetcher(search).then(setListItems);
  }, [search, isListView, activeEntry]);

  const loadWizardItems = useCallback((items: CommandItem[]) => {
    setStack([{ title: "", entries: [{ id: "wizard", label: "", fetcher: async () => items }] }]);
    setSearch("");
  }, []);

  const resetToRoot = useCallback(() => {
    setStack([{ title: "", entries: ROOT_MENU }]);
    setSearch("");
    setListItems([]);
  }, []);

  const navigateTo = useCallback((entry: CommandEntry) => {
    if (entry.children) {
      setStack((prev) => [...prev, { title: entry.label, entries: entry.children }]);
      setSearch("");
    } else if (entry.fetcher) {
      setStack((prev) => [...prev, { title: entry.label, entries: [entry] }]);
      setSearch("");
    }
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
    setSearch("");
  }, []);

  const reset = useCallback(() => {
    setStack([{ title: "", entries: ROOT_MENU }]);
    setSearch("");
    setListItems([]);
  }, []);

  const moveUp = useCallback(() => {
    if (activeItems.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  }, [activeItems.length]);

  const moveDown = useCallback(() => {
    if (activeItems.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % activeItems.length);
  }, [activeItems.length]);

  const selectCurrentItem = useCallback((): (CommandEntry | CommandItem) | null => {
    return activeItems[selectedIndex] ?? null;
  }, [activeItems, selectedIndex]);

  return {
    currentLevel,
    search,
    setSearch,
    filteredEntries,
    listItems,
    isListView,
    activeEntry,
    navigateTo,
    goBack,
    reset,
    resetToRoot,
    loadWizardItems,
    canGoBack,
    selectedIndex,
    setSelectedIndex,
    moveUp,
    moveDown,
    selectCurrentItem,
  };
};
