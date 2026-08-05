import { useCallback, useEffect, useRef, useState } from "react";
import { TOOLTIP } from "./tooltip.constants";
import type { TooltipPosition, UseTooltipOptions } from "./tooltip.types";

/**
 * Low-level tooltip state machine: attaches hover handlers to any element
 * and exposes the anchor rect + preferred placement for a portaled
 * TooltipContent. Works for both non-interactive (pointer-events: none)
 * and interactive tooltips (copy buttons etc.) via keepOpen/close.
 */
export function useTooltip<T extends HTMLElement = HTMLElement>({
  openDelay = TOOLTIP.DEFAULT_OPEN_DELAY,
  closeDelay = TOOLTIP.DEFAULT_CLOSE_DELAY,
}: UseTooltipOptions = {}) {
  const anchorRef = useRef<T | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  // justification: UI state — whether the tooltip is currently shown
  const [visible, setVisible] = useState(false);
  // justification: UI state — preferred side derived from anchor height, corrected
  // by placement measurement once the tooltip box is rendered
  const [position, setPosition] = useState<TooltipPosition>("top");
  // justification: UI state — anchor viewport coords consumed by TooltipContent
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setAnchorRect(rect);
    setPosition(rect.top > window.innerHeight / 2 ? "top" : "bottom");
    setVisible(true);
  }, []);

  const scheduleOpen = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openTimerRef.current !== null) return;
    openTimerRef.current = window.setTimeout(open, openDelay);
  }, [open, openDelay]);

  const scheduleClose = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) return;
    closeTimerRef.current = window.setTimeout(
      () => {
        closeTimerRef.current = null;
        setVisible(false);
      },
      closeDelay,
    );
  }, [closeDelay]);

  const keepOpen = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setVisible(false);
  }, [clearTimers]);

  // justification: event-listener subscription — keeps the tooltip glued to the
  // anchor while visible (page scroll + window resize)
  useEffect(() => {
    if (!visible) return;
    const reposition = () => {
      const el = anchorRef.current;
      if (!el) return;
      setAnchorRect(el.getBoundingClientRect());
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [visible]);

  // justification: cleanup — cancels pending open/close timers on unmount
  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    anchorRef,
    visible,
    position,
    anchorRect,
    triggerProps: {
      onMouseEnter: scheduleOpen,
      onMouseLeave: scheduleClose,
    },
    keepOpen,
    close,
  };
}
