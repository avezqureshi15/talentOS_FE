export const KEYBOARD_SHORTCUTS = {
  HOME: { ctrl: true, shift: true, code: "KeyH" },
  NEW_CHAT: { ctrl: true, shift: true, code: "KeyC" },
  TOGGLE_SIDEBAR: { ctrl: true, shift: true, code: "KeyS" },
  ALERTS: { ctrl: true, shift: true, code: "KeyA" },
  INTERVIEWS: { ctrl: true, shift: true, code: "KeyI" },
  SEARCH: { ctrl: true, shift: true, code: "KeyK" },
  ASK_AI: { ctrl: true, code: "KeyK" },
  SHORTCUTS: { alt: true, code: "KeyK" },
} as const;
