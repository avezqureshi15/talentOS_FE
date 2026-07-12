import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CommandEntry, CommandItem, MenuLevel } from "../types";
import { ROOT_MENU } from "../config/command-menu.config";
import { useDebounce } from "@/hooks/use-debounce";

const SEARCH_KEYWORDS: Record<string, string[]> = {
  mail: ["employees-send-mail", "applicants-send-mail"],
  email: ["employees-send-mail", "applicants-send-mail"],
  send: ["employees-send-mail", "applicants-send-mail"],
  book: ["book-interview"],
  schedule: ["book-interview"],
  interview: ["book-interview", "interviews"],
  view: ["employees-view", "applicants-view"],
  see: ["employees-view", "applicants-view"],
  list: ["employees-view", "applicants-view"],
  ask: ["employees-ask-slots"],
  slot: ["employees-ask-slots"],
  availability: ["employees-ask-slots"],
  hiring: ["hr-request"],
  hr: ["hr-request"],
  request: ["hr-request"],
  applicant: ["applicants", "applicants-view", "applicants-send-mail"],
  candidate: ["applicants", "applicants-view", "applicants-send-mail"],
  employee: ["employees", "employees-view", "employees-send-mail"],
  staff: ["employees", "employees-view"],
  ping: ["employees-send-mail"],
};

function entryMatchesSearch(entry: CommandEntry, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  if (entry.label.toLowerCase().includes(q)) return true;
  if (entry.id.toLowerCase().includes(q)) return true;
  if (entry.children?.some((c) => c.label.toLowerCase().includes(q))) return true;

  for (const [keyword, ids] of Object.entries(SEARCH_KEYWORDS)) {
    if (keyword.includes(q) || q.includes(keyword)) {
      if (ids.includes(entry.id)) return true;
      if (entry.children?.some((c) => ids.includes(c.id))) return true;
    }
  }

  return false;
}

export const useCommandMenu = () => {
  const [stack, setStack] = useState<MenuLevel[]>([{ title: "", entries: ROOT_MENU }]);
  const [search, setSearch] = useState("");
  const [listItems, setListItems] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentLevel = stack[stack.length - 1];
  const isListView = currentLevel.entries.length === 1 && !!currentLevel.entries[0].fetcher;
  const activeEntry = isListView ? currentLevel.entries[0] : null;
  const canGoBack = stack.length > 1;

  const filteredEntries = useMemo(
    () => isListView ? [] : currentLevel.entries.filter((e) => entryMatchesSearch(e, search)),
    [isListView, currentLevel.entries, search],
  );

  const activeItems: (CommandEntry | CommandItem)[] = useMemo(
    () => isListView ? listItems : filteredEntries,
    [isListView, listItems, filteredEntries],
  );
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = useMemo(
    () => ["mentions", activeEntry?.id ?? "none", debouncedSearch],
    [activeEntry?.id, debouncedSearch],
  );

  const { data: queryData, isLoading: isQueryLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!activeEntry?.fetcher) return [];
      return activeEntry.fetcher(debouncedSearch);
    },
    enabled: isListView && !!activeEntry?.fetcher,
    staleTime: 30_000,
    gcTime: 60_000,
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredEntries.length, listItems.length, stack.length]);

  useEffect(() => {
    if (queryData && isListView) {
      setListItems(queryData);
    }
  }, [queryData, isListView]);

  const loadWizardItems = useCallback((items: CommandItem[]) => {
    setStack([{ title: "", entries: [{ id: "wizard", label: "", fetcher: async () => items }] }]);
    setSearch("");
  }, []);

  const loadWizardEntry = useCallback((entry: CommandEntry) => {
    setStack([{ title: "", entries: [entry] }]);
    setListItems([]);
    setSearch("");
  }, []);

  const resetToRoot = useCallback(() => {
    setStack([{ title: "", entries: ROOT_MENU }]);
    setSearch("");
    setListItems([]);
  }, []);

  const navigateTo = useCallback((entry: CommandEntry) => {
    if (entry.children) {
      setStack((prev) => [...prev, { title: entry.label, entries: entry.children ?? [] }]);
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
    const idx = Math.min(selectedIndex, activeItems.length - 1);
    return activeItems[idx] ?? null;
  }, [activeItems, selectedIndex]);

  const loadMore = useCallback(async () => {
    if (!activeEntry?.loadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const newItems = await activeEntry.loadMore();
      setListItems((prev) => [...prev, ...newItems]);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeEntry, isLoadingMore]);

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
    loadWizardEntry,
    canGoBack,
    selectedIndex,
    setSelectedIndex,
    moveUp,
    moveDown,
    selectCurrentItem,
    loadMore,
    hasMore: activeEntry?.hasMore ?? false,
    isLoading: isQueryLoading,
    isLoadingMore: isLoadingMore || isQueryLoading,
  };
};
