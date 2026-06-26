import { useState, useEffect, useCallback } from "react";
import type { CommandEntry, CommandItem, MenuLevel } from "./mentions.types";
import { ROOT_MENU } from "./command-menu.config";

export const useCommandMenu = () => {
  // Stack of menu levels for breadcrumb-style navigation
  const [stack, setStack] = useState<MenuLevel[]>([{ title: "", entries: ROOT_MENU }]);
  // Current search query within the active level
  const [search, setSearch] = useState("");
  // Fetched items when viewing a list (HR requests, applicants, employees, slots)
  const [listItems, setListItems] = useState<CommandItem[]>([]);
  // Index of the currently highlighted item for keyboard navigation
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

  // Reset selection highlight when the item list changes (search, navigation, data load)
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredEntries.length, listItems.length, stack.length]);

  // Fetch list items from the active entry's fetcher whenever search or active entry changes
  useEffect(() => {
    if (!isListView || !activeEntry?.fetcher) {
      setListItems([]);
      return;
    }
    activeEntry.fetcher(search).then(setListItems);
  }, [search, isListView, activeEntry]);

  const navigateTo = useCallback((entry: CommandEntry) => {
    if (entry.children) {
      const children = entry.children;
      setStack((prev) => [...prev, { title: entry.label, entries: children }]);
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
    canGoBack,
    selectedIndex,
    setSelectedIndex,
    moveUp,
    moveDown,
    selectCurrentItem,
  };
};
