import { create } from "zustand";

type UiState = {
  showShortcutsModal: boolean;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;
  toggleShortcutsModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  showShortcutsModal: false,
  openShortcutsModal: () => set({ showShortcutsModal: true }),
  closeShortcutsModal: () => set({ showShortcutsModal: false }),
  toggleShortcutsModal: () => set((state) => ({ showShortcutsModal: !state.showShortcutsModal })),
}));
