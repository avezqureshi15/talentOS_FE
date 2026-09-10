import { useCallback } from "react";
import { stripMentionTrigger } from "../utils";

type UseMentionDismissArgs = {
  input: string;
  setInput: (value: string) => void;
  resetEngine: () => void;
  resetMenu: () => void;
  clearSelection?: () => void;
  focusTarget?: React.RefObject<HTMLElement | null>;
};

/**
 * Single dismiss path for the mentions picker (Escape + click-outside).
 * Closes popup state, clears wizard/menu, strips the unfinished @ trigger,
 * and returns focus to the chat textarea.
 */
export const useMentionDismiss = ({
  input,
  setInput,
  resetEngine,
  resetMenu,
  clearSelection,
  focusTarget,
}: UseMentionDismissArgs) => {
  return useCallback(() => {
    setInput(stripMentionTrigger(input));
    resetEngine();
    resetMenu();
    clearSelection?.();
    requestAnimationFrame(() => {
      focusTarget?.current?.focus();
    });
  }, [input, setInput, resetEngine, resetMenu, clearSelection, focusTarget]);
};
