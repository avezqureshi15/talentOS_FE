import { useRef, useEffect, useCallback } from "react";

export const useAutoResize = (input: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, []);

  // Explanation: adjusts textarea height whenever input value changes to prevent scrolling
  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  return { textareaRef, adjustHeight };
};
