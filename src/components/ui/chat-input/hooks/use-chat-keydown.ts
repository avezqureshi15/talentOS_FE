import { useCallback } from "react";
import type { WizardStage, CommandEntry, CommandItem } from "@/components/shared/mentions/types";
import { resolveMenuSelection } from "@/components/shared/mentions/utils";

type Menu = {
  isListView: boolean;
  listItems: CommandItem[];
  filteredEntries: (CommandEntry | CommandItem)[];
  activeEntry: CommandEntry | null;
  moveDown: () => void;
  moveUp: () => void;
  selectCurrentItem: () => CommandEntry | CommandItem | null;
  navigateTo: (entry: CommandEntry) => void;
  resetToRoot: () => void;
};

type WizardHandlers = {
  handleWizardSelect: (stage: WizardStage, item: { id: string; label: string }) => void;
  handleMultiSelectConfirm: () => void;
};

type Engine = {
  reset: () => void;
  insert: (text: string, value: string, setValue: (v: string) => void) => void;
  handleChange: (value: string, cursorPos: number) => void;
};

type Deps = {
  show: boolean;
  isWizardActive: boolean;
  isMultiSelectStage: boolean;
  isFullyTokenized: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  executeWizard: () => void;
  menu: Menu;
  engine: Engine;
  wizard: WizardHandlers;
};

export const useChatKeydown = ({
  show, isWizardActive, isMultiSelectStage, isFullyTokenized,
  input, setInput, onSend, executeWizard, menu, engine, wizard,
}: Deps) => {
  return useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (show && !isWizardActive) {
      const items = menu.isListView ? menu.listItems : menu.filteredEntries;
      if (items.length === 0) return;
      switch (e.key) {
        case "ArrowDown": e.preventDefault(); menu.moveDown(); return;
        case "ArrowUp": e.preventDefault(); menu.moveUp(); return;
        case "Enter":
          if (!e.shiftKey) {
            e.preventDefault();
            const current = menu.selectCurrentItem();
            if (current) {
              const result = resolveMenuSelection(current, menu.isListView, menu.activeEntry);
              switch (result.action) {
                case "wizard": wizard.handleWizardSelect(result.stage, { id: current.id, label: current.label }); break;
                case "navigate": menu.navigateTo(result.entry); break;
                default: engine.insert(result.text, input, setInput); break;
              }
            }
          }
          return;
      }
      return;
    }

    if (isWizardActive && show) {
      if (isMultiSelectStage && menu.listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); menu.moveDown(); return;
          case "ArrowUp": e.preventDefault(); menu.moveUp(); return;
          case "Enter": if (!e.shiftKey) { e.preventDefault(); wizard.handleMultiSelectConfirm(); } return;
          case "Escape": e.preventDefault(); engine.reset(); menu.resetToRoot(); return;
        }
        return;
      }
      if (menu.listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); menu.moveDown(); return;
          case "ArrowUp": e.preventDefault(); menu.moveUp(); return;
          case "Enter":
            if (!e.shiftKey) {
              e.preventDefault();
              const item = menu.selectCurrentItem();
              if (item) wizard.handleWizardSelect(wizardStage as WizardStage, { id: item.id, label: item.label });
            }
            return;
          case "Escape": e.preventDefault(); engine.reset(); menu.resetToRoot(); return;
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
    engine.handleChange(input, input.length);
  }, [show, isWizardActive, isMultiSelectStage, isFullyTokenized, input, setInput, onSend, executeWizard, menu, engine, wizard]);
};
