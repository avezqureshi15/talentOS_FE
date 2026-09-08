import { useEffect, useRef } from "react";

/** Calls `onDismiss` on Escape while `enabled` — works regardless of focus target. */
export const useEscapeDismiss = (enabled: boolean, onDismiss: () => void) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onDismissRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
};
