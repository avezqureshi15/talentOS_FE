import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { SearchResultItem, CommandPaletteSection } from "../command-palette.types";
import { COMMAND_PALETTE_LABELS, SEARCH_DEBOUNCE_MS } from "../command-palette.constants";
import { searchHiringRequests } from "../services/command-palette.service";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

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
};

export const useCommandPalette = (
  onSelectHiringRequest: (id: string) => void,
  onNewChat: () => void,
): UseCommandPaletteReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<HiringRequest[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchHiringRequests(query);
        setResults(data);
      } catch {
        setResults([]);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
    setResults([]);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
    setResults([]);
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

    if (results.length > 0) {
      result.push({
        title: COMMAND_PALETTE_LABELS.HIRING_REQUESTS_SECTION,
        items: results.map((r: HiringRequest) => ({
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
  };
};
