import { create } from "zustand";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/constants";

function getInitialTheme(): "dark" | "light" {
  const stored = storage.get(STORAGE_KEYS.THEME);
  if (stored === "dark" || stored === "light") return stored;
  return "dark";
}

function applyTheme(theme: "dark" | "light") {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

type ThemeState = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();
  applyTheme(initial);

  return {
    theme: initial,
    toggleTheme: () =>
      set((state) => {
        const next = state.theme === "dark" ? "light" : "dark";
        storage.set(STORAGE_KEYS.THEME, next);
        applyTheme(next);
        return { theme: next };
      }),
  };
});
