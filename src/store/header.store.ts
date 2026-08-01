import { create } from "zustand";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type HeaderViewOption = {
  key: string;
  label: string;
  icon: string;
};

export type HeaderFilterConfig = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
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
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
};

export type HeaderMetaItem = {
  label: string;
  variant?: "success" | "warning" | "danger";
};

export type HeaderBadge = {
  label: string;
  icon?: string;
  tooltip?: string;
};

export type HeaderConfig = {
  title?: string;
  titleIcon?: string;
  backRoute?: string;
  subtitle?: string;
  avatarLabel?: string;
  totalCount?: number;
  meta?: HeaderMetaItem[];
  search?: HeaderSearchConfig | null;
  filters?: HeaderFilterConfig[];
  viewSwitcher?: HeaderViewSwitcherConfig | null;
  actions?: HeaderActionConfig[];
  badge?: HeaderBadge;
  hiringRequestName?: string;
  hiringRequest?: HiringRequest;
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
