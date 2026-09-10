import { useState, useCallback } from "react";

export const MAX_SELECTION = 10;

export const useMultiSelect = () => {
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);

  const handleToggleMultiSelect = useCallback((itemId: string) => {
    setMultiSelectedIds((prev) => {
      if (prev.includes(itemId)) return prev.filter((id) => id !== itemId);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, itemId];
    });
  }, []);

  const clearSelection = useCallback(() => setMultiSelectedIds([]), []);

  return { multiSelectedIds, setMultiSelectedIds, handleToggleMultiSelect, clearSelection };
};
