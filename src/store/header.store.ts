import { create } from "zustand";

export type HeaderViewOption = {
  key: string;
  label: string;
  icon: string;
};

export type HeaderSearchConfig = {
  placeholder?: string;
  shortcut?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export type HeaderViewSwitcherConfig = {
  options: HeaderViewOption[];
  active: string;
  onChange: (key: string) => void;
};

export type HeaderActionConfig = {
  key: string;
  label: string;
  icon?: string;
  iconPosition?: "left" | "right";
  variant?: "primary" | "outline";
  onClick?: () => void;
  loading?: boolean;
  loadingText?: string;
  error?: string | null;
};

export type HeaderConfig = {
  title?: string;
  totalCount?: number;
  search?: HeaderSearchConfig | null;
  viewSwitcher?: HeaderViewSwitcherConfig | null;
  actions?: HeaderActionConfig[];
};

type HeaderState = {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
  updateConfig: (patch: Partial<HeaderConfig>) => void;
  clearConfig: () => void;
};

const defaultConfig: HeaderConfig = {};

export const useHeaderStore = create<HeaderState>((set) => ({
  config: defaultConfig,
  setConfig: (config) => set({ config }),
  updateConfig: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
  clearConfig: () => set({ config: defaultConfig }),
}));
