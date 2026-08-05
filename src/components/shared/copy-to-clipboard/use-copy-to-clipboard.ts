import { useCallback, useEffect, useRef, useState } from "react";
import { COPY_FEEDBACK_MS } from "./copy-to-clipboard.constants";

/**
 * Shared copy-to-clipboard hook with a legacy execCommand fallback and a
 * transient "copied" acknowledgement state.
 */
export function useCopyToClipboard(resetAfterMs = COPY_FEEDBACK_MS) {
  // justification: UI state — transient "copied" acknowledgement feedback
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        if (resetTimerRef.current !== null) {
          window.clearTimeout(resetTimerRef.current);
        }
        resetTimerRef.current = window.setTimeout(() => setCopied(false), resetAfterMs);
      } catch {
        setCopied(false);
      }
    },
    [resetAfterMs],
  );

  // justification: cleanup — cancels the pending feedback-reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return { copied, copy };
}
