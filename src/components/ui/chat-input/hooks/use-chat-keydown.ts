import { useCallback } from "react";
import type { WizardStage, CommandEntry, CommandItem } from "@/components/shared/mentions/types";
import { resolveMenuSelection } from "@/components/shared/mentions/utils";

type Deps = {
  show: boolean;
  isWizardActive: boolean;
  isMultiSelectStage: boolean;
  isFullyTokenized: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  executeWizard: () => void;
  wizardStage: WizardStage;
  isListView: boolean;
  listItems: CommandItem[];
  filteredEntries: CommandEntry[];
  activeEntry: CommandEntry | null;
  moveDown: () => void;
  moveUp: () => void;
  selectCurrentItem: () => CommandEntry | CommandItem | null;
  navigateTo: (entry: CommandEntry) => void;
  resetToRoot: () => void;
  reset: () => void;
  insert: (text: string, value: string, setValue: (v: string) => void) => void;
  handleChange: (value: string, cursorPos: number) => void;
  handleWizardSelect: (stage: WizardStage, item: { id: string; label: string }) => void;
  handleMultiSelectConfirm: () => void;
};

export const useChatKeydown = ({
  show, isWizardActive, isMultiSelectStage, isFullyTokenized,
  input, setInput, onSend, executeWizard, wizardStage,
  isListView, listItems, filteredEntries, activeEntry,
  moveDown, moveUp, selectCurrentItem, navigateTo, resetToRoot,
  reset, insert, handleChange,
  handleWizardSelect, handleMultiSelectConfirm,
}: Deps) => {
  return useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (show && !isWizardActive) {
      const items = isListView ? listItems : filteredEntries;
      if (items.length === 0) return;
      switch (e.key) {
        case "ArrowDown": e.preventDefault(); moveDown(); return;
        case "ArrowUp": e.preventDefault(); moveUp(); return;
        case "Enter":
          if (!e.shiftKey) {
            e.preventDefault();
            const current = selectCurrentItem();
            if (current) {
              const result = resolveMenuSelection(current, isListView, activeEntry);
              switch (result.action) {
                case "wizard": handleWizardSelect(result.stage, { id: current.id, label: current.label }); break;
                case "navigate": navigateTo(result.entry); break;
                default: insert(result.text, input, setInput); break;
              }
            }
          }
          return;
      }
      return;
    }

    if (isWizardActive && show) {
      if (isMultiSelectStage && listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); moveDown(); return;
          case "ArrowUp": e.preventDefault(); moveUp(); return;
          case "Enter": if (!e.shiftKey) { e.preventDefault(); handleMultiSelectConfirm(); } return;
          case "Escape": e.preventDefault(); reset(); resetToRoot(); return;
        }
        return;
      }
      if (listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); moveDown(); return;
          case "ArrowUp": e.preventDefault(); moveUp(); return;
          case "Enter":
            if (!e.shiftKey) {
              e.preventDefault();
              const item = selectCurrentItem();
              if (item) handleWizardSelect(wizardStage, { id: item.id, label: item.label });
            }
            return;
          case "Escape": e.preventDefault(); reset(); resetToRoot(); return;
        }
      }
      return;
    }

    if (isFullyTokenized && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeWizard();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSend();
    }
    handleChange(input, input.length);
  }, [
    show, isWizardActive, isMultiSelectStage, isFullyTokenized, input, setInput, onSend, executeWizard, wizardStage,
    isListView, listItems, filteredEntries, activeEntry, moveDown, moveUp, selectCurrentItem, navigateTo, resetToRoot,
    reset, insert, handleChange, handleWizardSelect, handleMultiSelectConfirm,
  ]);
};
