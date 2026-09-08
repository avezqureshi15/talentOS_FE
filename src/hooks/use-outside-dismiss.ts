import { useEffect, useRef } from "react";

/**
 * Calls `onDismiss` on mousedown outside every provided element ref.
 * Refs are read via a ref so callers can pass inline arrays safely.
 */
export const useOutsideDismiss = (
  enabled: boolean,
  onDismiss: () => void,
  refs: ReadonlyArray<React.RefObject<HTMLElement | null>>,
) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [enabled]);
};
