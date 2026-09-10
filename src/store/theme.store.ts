import { create } from "zustand";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/constants";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * ADDING A NEW THEME — it's a 1-step job:
 *
 *   1. Add one entry to THEME_DEFINITIONS below.
 *      - `base` picks the token set ("dark" or "light", or "system" to follow
 *        the OS).
 *      - If the theme needs extra brand overrides, set `brand: "my-brand"`.
 *   2. (Only when you set `brand`) add a matching `[data-brand="my-brand"]`
 *      block to `src/index.css` with the brand tokens (see `recruit41`).
 *
 * That's it — the Theme tab, persistence, `data-theme`/`data-brand`
 * attributes and system-follow all pick it up automatically.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type ThemeBase = "dark" | "light";

export type ThemeMode = "system" | "dark" | "light" | "recruit41";

export type ThemeDefinition = {
  /** Stored value + key in the Theme tab. */
  value: ThemeMode;
  /** Label shown in the Theme tab. */
  label: string;
  /** Boxicons class for the Theme tab option. */
  icon: string;
  /** Token set this theme is built on. "system" follows the OS. */
  base: ThemeBase | "system";
  /** Optional `data-brand` marker → add a matching `[data-brand="…"]` block in index.css. */
  brand?: string;
  /** Optional hint under the selector (defaults to `label`). */
  hint?: string;
};

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  { value: "light", label: "Light", icon: "bx bx-sun", base: "light" },
  { value: "dark", label: "Dark", icon: "bx bx-moon", base: "dark" },
  {
    value: "recruit41",
    label: "Recruit41 Theme",
    icon: "bx bx-palette",
    base: "light",
    brand: "recruit41",
  },
  {
    value: "system",
    label: "System",
    icon: "bx bx-desktop",
    base: "system",
    hint: "Following system preference",
  },
];

export const DEFAULT_THEME: ThemeMode = "recruit41";

export const THEME_BY_VALUE: Record<string, ThemeDefinition> = Object.fromEntries(
  THEME_DEFINITIONS.map((theme) => [theme.value, theme]),
);

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && value in THEME_BY_VALUE;
}

function getInitialTheme(): ThemeMode {
  const stored = storage.get(STORAGE_KEYS.THEME);
  if (isThemeMode(stored)) return stored;
  // Seed localStorage with the default (Recruit41) so it is always persisted.
  storage.set(STORAGE_KEYS.THEME, DEFAULT_THEME);
  return DEFAULT_THEME;
}

function resolveBase(mode: ThemeMode): ThemeBase {
  const definition = THEME_BY_VALUE[mode];
  if (!definition || definition.base === "system") {
    return window.matchMedia(SYSTEM_DARK_QUERY).matches ? "dark" : "light";
  }
  return definition.base;
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const definition = THEME_BY_VALUE[mode];

  root.setAttribute("data-theme", resolveBase(mode));

  if (definition?.brand) {
    root.setAttribute("data-brand", definition.brand);
  } else {
    root.removeAttribute("data-brand");
  }
}

type ThemeState = {
  theme: ThemeMode;
  resolvedTheme: ThemeBase;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();

  return {
    theme: initial,
    resolvedTheme: resolveBase(initial),
    setTheme: (mode) => {
      storage.set(STORAGE_KEYS.THEME, mode);
      applyTheme(mode);
      set({ theme: mode, resolvedTheme: resolveBase(mode) });
    },
    toggleTheme: () => {
      const next = useThemeStore.getState().theme === "dark" ? "light" : "dark";
      useThemeStore.getState().setTheme(next);
    },
  };
});

applyTheme(getInitialTheme());

if (typeof window !== "undefined" && window.matchMedia) {
  const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
  mediaQuery.addEventListener("change", (e) => {
    const { theme } = useThemeStore.getState();
    if (theme === "system") {
      applyTheme("system");
      useThemeStore.setState({ resolvedTheme: e.matches ? "dark" : "light" });
    }
  });
}
