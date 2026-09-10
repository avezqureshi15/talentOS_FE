import { create } from "zustand";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/constants";

export type ThemeMode = "system" | "dark" | "light";

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

function getInitialTheme(): ThemeMode {
  const stored = storage.get(STORAGE_KEYS.THEME);
  if (stored === "system" || stored === "dark" || stored === "light") return stored;
  return "dark";
}

function resolveMode(mode: ThemeMode): "dark" | "light" {
  if (mode === "system") {
    return window.matchMedia(SYSTEM_DARK_QUERY).matches ? "dark" : "light";
  }
  return mode;
}

function applyTheme(mode: ThemeMode) {
  if (resolveMode(mode) === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

type ThemeState = {
  theme: ThemeMode;
  resolvedTheme: "dark" | "light";
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();

  return {
    theme: initial,
    resolvedTheme: resolveMode(initial),
    setTheme: (mode) => {
      storage.set(STORAGE_KEYS.THEME, mode);
      applyTheme(mode);
      set({ theme: mode, resolvedTheme: resolveMode(mode) });
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
