import { useEffect, useRef, useCallback } from "react";

const TYPING_SPEED = 45;
const DELETING_SPEED = 22;
const PAUSE_AFTER_TYPING = 2200;
const PAUSE_AFTER_DELETING = 400;

export function useTypingPlaceholder(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  phrases: string[],
  isActive: boolean,
) {
  const phraseIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phrasesRef = useRef(phrases);
  phrasesRef.current = phrases;

  const clearAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive || !textareaRef.current || phrases.length === 0) {
      if (!isActive && textareaRef.current) {
        textareaRef.current.placeholder = "";
      }
      return;
    }

    const el = textareaRef.current;

    const tick = () => {
      const list = phrasesRef.current;
      if (!el || list.length === 0) return;

      const phrase = list[phraseIdxRef.current % list.length];

      if (!isDeletingRef.current) {
        charIdxRef.current++;
        el.placeholder = phrase.slice(0, charIdxRef.current);

        if (charIdxRef.current >= phrase.length) {
          isDeletingRef.current = true;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPING);
        } else {
          timeoutRef.current = setTimeout(tick, TYPING_SPEED);
        }
      } else {
        charIdxRef.current--;
        el.placeholder = phrase.slice(0, charIdxRef.current);

        if (charIdxRef.current <= 0) {
          isDeletingRef.current = false;
          charIdxRef.current = 0;
          phraseIdxRef.current = (phraseIdxRef.current + 1) % list.length;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETING);
        } else {
          timeoutRef.current = setTimeout(tick, DELETING_SPEED);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETING);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, textareaRef, phrases.length]);

  return { clearAnimation };
}
