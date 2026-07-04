import { useEffect, useState, useCallback, useRef } from "react";
import { STORAGE_KEYS, TWENTY_FOUR_HOURS, AURORA_AUTO_HIDE_MS } from "@/constants/constants";
import { hasUxElapsed, patchUx } from "@/utils/storage";

export function useAurora() {
  const [show, setShow] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (dismissedRef.current) return;

    if (hasUxElapsed(STORAGE_KEYS.UX, "at", TWENTY_FOUR_HOURS)) {
      patchUx(STORAGE_KEYS.UX, { at: Date.now() });
      setShow(true);

      const timer = setTimeout(() => setShow(false), AURORA_AUTO_HIDE_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    setShow(false);
    patchUx(STORAGE_KEYS.UX, { at: Date.now() });
  }, []);

  return { show, dismiss };
}
