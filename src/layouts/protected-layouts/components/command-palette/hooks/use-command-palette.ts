import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { isCommandPaletteRoute } from "@/layouts/protected-layouts/components/command-palette/command-palette.registry";
import type { SearchResultItem, CommandPaletteSection } from "@/layouts/protected-layouts/components/command-palette/command-palette.types";
import { COMMAND_PALETTE_LABELS, SEARCH_DEBOUNCE_MS } from "@/layouts/protected-layouts/components/command-palette/command-palette.constants";
import { useHiringSearch } from "./use-hiring-search";
import { useEmployeeSearch } from "./use-employee-search";
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
  onSelectEmployee: (empId: string) => void,
): UseCommandPaletteReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const location = useLocation();
  const isPaletteRoute = isCommandPaletteRoute(location.pathname);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const {
    data: hiringResults,
    fetchNextPage: fetchNextHiringPage,
    hasNextPage: hasNextHiringPage,
    isFetchingNextPage: isFetchingNextHiringPage,
  } = useHiringSearch(debouncedQuery);

  const {
    data: employeeResults,
    fetchNextPage: fetchNextEmployeePage,
    hasNextPage: hasNextEmployeePage,
    isFetchingNextPage: isFetchingNextEmployeePage,
  } = useEmployeeSearch(debouncedQuery);

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
    if (!isPaletteRoute) return;

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
  }, [isPaletteRoute, isOpen, open, close]);

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

    if (hiringResults && hiringResults.length > 0) {
      result.push({
        title: COMMAND_PALETTE_LABELS.HIRING_REQUESTS_SECTION,
        items: hiringResults.map((r) => ({
          id: r.id,
          label: r.title,
          sublabel: `${r.department} - ${r.location}`,
          type: "hiring-request" as const,
          hiringRequest: r,
        })),
      });
    }

    if (employeeResults && employeeResults.length > 0) {
      result.push({
        title: COMMAND_PALETTE_LABELS.EMPLOYEES_SECTION,
        items: employeeResults.map((e) => ({
          id: e.emp_id,
          label: e.name,
          sublabel: `${e.designation ?? "—"} · ${e.department ?? "—"}`,
          type: "employee" as const,
        })),
      });
    }

    return result;
  }, [hiringResults, employeeResults]);

  const totalItems = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.items.length, 0);
  }, [sections]);

  const selectItem = useCallback(
    (item: SearchResultItem) => {
      if (item.type === "action") {
        onNewChat();
      } else if (item.type === "hiring-request") {
        onSelectHiringRequest(item.id);
      } else if (item.type === "employee") {
        onSelectEmployee(item.id);
      }
      close();
    },
    [onNewChat, onSelectHiringRequest, onSelectEmployee, close],
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
    loadMore: () => { fetchNextHiringPage(); fetchNextEmployeePage(); },
    hasMore: !!hasNextHiringPage || !!hasNextEmployeePage,
    isLoadingMore: isFetchingNextHiringPage || isFetchingNextEmployeePage,
  };
};
