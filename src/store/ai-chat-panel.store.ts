import { create } from "zustand";

interface AIChatPanelStore {
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

export const useAIChatPanelStore = create<AIChatPanelStore>((set) => ({
  isPanelOpen: false,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
}));
