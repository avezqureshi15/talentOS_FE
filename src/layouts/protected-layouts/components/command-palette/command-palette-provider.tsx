import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { SearchResultItem, CommandPaletteSection, CommandPaletteConfig, CmdPaletteProviderValue } from "./command-palette.types";
import { SEARCH_DEBOUNCE_MS } from "./command-palette.constants";
import { useDebounce } from "@/hooks/use-debounce";
import CommandPalette from "./command-palette";

export const CmdPaletteContext = createContext<CmdPaletteProviderValue | null>(null);

export default function CmdPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [config, setConfig] = useState<CommandPaletteConfig | null>(null);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const configRef = useRef(config);
  configRef.current = config;

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

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

  const registerConfig = useCallback((c: CommandPaletteConfig) => {
    setConfig(c);
  }, []);

  const unregisterConfig = useCallback(() => {
    setConfig(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const sections = buildSections(results, config);
      const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);

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
              config?.onSelect?.(item);
              close();
              return;
            }
            idx++;
          }
        }
      }
    },
    [results, selectedIndex, config, close],
  );

  useEffect(() => {
    if (!debouncedQuery.trim() || !configRef.current) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    configRef.current.search(debouncedQuery).then((items) => {
      if (!cancelled) {
        setResults(items);
        setSelectedIndex(0);
        setIsSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, open, close]);

  const sections = buildSections(results, config);

  const contextValue: CmdPaletteProviderValue = {
    isOpen,
    open,
    close,
    registerConfig,
    unregisterConfig,
    hasConfig: config !== null,
  };

  return (
    <CmdPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPalette
        open={isOpen}
        query={query}
        onQueryChange={setQuery}
        sections={sections}
        selectedIndex={selectedIndex}
        onClose={close}
        onKeyDown={handleKeyDown}
        isSearching={isSearching}
        onSelectItem={config?.onSelect}
      />
    </CmdPaletteContext.Provider>
  );
}

function buildSections(results: SearchResultItem[], config: CommandPaletteConfig | null): CommandPaletteSection[] {
  if (!config || results.length === 0) return [];

  return [
    {
      title: config.sectionTitle,
      items: results,
    },
  ];
}
