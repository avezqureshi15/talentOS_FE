import { useState, useEffect, useCallback, useMemo } from "react";
import type { SearchResultItem, CommandPaletteSection } from "@/components/ui/command-palette/command-palette.types";
import { COMMAND_PALETTE_LABELS, SEARCH_DEBOUNCE_MS } from "@/components/ui/command-palette/command-palette.constants";
import { useHiringSearch } from "./use-hiring-search";
import { useDebounce } from "@/hooks/use-debounce";

type UseCommandPaletteReturn = {
  isOpen: boolean;
  query: string;
  setQuery: (q: string) => void;
  sections: CommandPaletteSection[];
  selectedIndex: number;
  open: () => void;
  close: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  totalItems: number;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
};

export const useCommandPalette = (
  onSelectHiringRequest: (id: string) => void,
  onNewChat: () => void,
): UseCommandPaletteReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const {
    data: results,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHiringSearch(debouncedQuery);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  const sections = useMemo((): CommandPaletteSection[] => {
    const result: CommandPaletteSection[] = [];

    result.push({
      title: COMMAND_PALETTE_LABELS.ACTIONS_SECTION,
      items: [
        {
          id: "new-chat",
          label: COMMAND_PALETTE_LABELS.NEW_CHAT_ACTION,
          sublabel: COMMAND_PALETTE_LABELS.NEW_CHAT_DESC,
          type: "action",
        },
      ],
    });

    if (results && results.length > 0) {
      result.push({
        title: COMMAND_PALETTE_LABELS.HIRING_REQUESTS_SECTION,
        items: results.map((r) => ({
          id: r.id,
          label: r.title,
          sublabel: `${r.department} - ${r.location}`,
          type: "hiring-request" as const,
          hiringRequest: r,
        })),
      });
    }

    return result;
  }, [results]);

  const totalItems = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.items.length, 0);
  }, [sections]);

  const selectItem = useCallback(
    (item: SearchResultItem) => {
      if (item.type === "action") {
        onNewChat();
      } else if (item.type === "hiring-request") {
        onSelectHiringRequest(item.id);
      }
      close();
    },
    [onNewChat, onSelectHiringRequest, close],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === "Enter") {
        e.preventDefault();
        let idx = 0;
        for (const section of sections) {
          for (const item of section.items) {
            if (idx === selectedIndex) {
              selectItem(item);
              return;
            }
            idx++;
          }
        }
      }
    },
    [sections, selectedIndex, totalItems, selectItem],
  );

  return {
    isOpen,
    query,
    setQuery,
    sections,
    selectedIndex,
    open,
    close,
    handleKeyDown,
    totalItems,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
  };
};
