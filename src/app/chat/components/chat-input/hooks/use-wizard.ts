import { useCallback, useEffect, useRef, useMemo } from "react";
import type { WizardStage, CommandEntry, CommandItem } from "@/components/shared/mentions/types";
import { WIZARD_ACTIONS } from "@/components/shared/mentions/config/wizard.config";
import { WIZARD_REAL_DATA_SOURCES } from "@/components/shared/mentions/config/wizard-data-sources";
import { MENTION_REGEX } from "@/components/shared/mentions/hooks/use-mention-engine";
import { fetchSlotsByEmployee } from "@/services/slots/slots";
import type { ChatInputProps } from "../chat-input.types";
import { useMultiSelect } from "./use-multi-select";
import { useWizardExecution } from "./use-wizard-execution";

type Engine = {
  wizardStage: number;
  wizardActionId: string | null;
  tokens: { type: string; label: string; id: string; relationalId?: string }[];
  startWizard: (actionId: string) => ((query: string) => Promise<CommandItem[]>) | null;
  advanceWizard: (item: { id: string; label: string; relationalId?: string }) => (() => Promise<CommandItem[]>) | null;
  advanceWizardMulti: (items: CommandItem[]) => void;
  advanceWizardMultiToNext: (items: CommandItem[]) => (() => Promise<CommandItem[]>) | null;
  reset: () => void;
  insert: (text: string, value: string, setValue: (v: string) => void) => void;
  handleChange: (value: string, cursorPos: number) => void;
};

type Menu = {
  listItems: CommandItem[];
  loadWizardItems: (items: CommandItem[]) => void;
  loadWizardEntry: (entry: { id: string; label: string; fetcher?: (q: string) => Promise<CommandItem[]> }) => void;
  resetToRoot: () => void;
  moveDown: () => void;
  moveUp: () => void;
  selectCurrentItem: () => { id: string; label: string } | null;
};

export const useWizard = (
  engine: Engine,
  menu: Menu,
  onWizardComplete: ChatInputProps["onWizardComplete"],
  input: string,
  setInput: (v: string) => void,
) => {
  const { multiSelectedIds, setMultiSelectedIds, handleToggleMultiSelect, clearSelection } = useMultiSelect();
  const inputRef = useRef(input);
  inputRef.current = input;

  const { wizardStage, wizardActionId, tokens, startWizard, advanceWizard, advanceWizardMulti, advanceWizardMultiToNext, reset } = engine;

  const isMultiSelectStage = useMemo(() => {
    if (!wizardActionId || wizardStage === 0) return false;
    const stage = WIZARD_ACTIONS[wizardActionId]?.stages[wizardStage - 1];
    return stage?.isMultiSelect ?? false;
  }, [wizardActionId, wizardStage]);

  const isFullyTokenized = wizardActionId
    ? wizardStage > (WIZARD_ACTIONS[wizardActionId]?.stages.length ?? 0)
    : false;
  const isWizardActive = wizardStage > 0;

  const { executeWizard } = useWizardExecution({
    wizardActionId, tokens, onWizardComplete, reset,
    resetMenu: menu.resetToRoot,
    setInput, clearSelection, inputRef,
  });

  const loadStageItems = useCallback((stageIdx: number) => {
    const action = wizardActionId ? WIZARD_ACTIONS[wizardActionId] : null;
    if (!action) return;
    const stage = action.stages[stageIdx];
    if (!stage) return;

    if (stage.tokenType === "slot") {
      const interviewerToken = tokens.find((t) => t.type === "interviewer");
      const empId = interviewerToken?.id;
      if (empId) {
        const entry: CommandEntry = {
          id: "slot-search",
          label: "Available Slots",
          searchPlaceholder: "Search slots...",
          hasMore: false,
          fetcher: async (query: string) => {
            const items = await fetchSlotsByEmployee(empId);
            if (!query) return items;
            const q = query.toLowerCase();
            return items.filter(
              (s) => s.label.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q),
            );
          },
        };
        entry.fetcher?.("").then(() => menu.loadWizardEntry(entry));
        return;
      }
    }

    const dataSource = wizardActionId ? WIZARD_REAL_DATA_SOURCES[wizardActionId]?.[stageIdx] : null;

    if (dataSource) {
      const entry = dataSource.createEntry();
      if (!entry.fetcher) return;
      entry.fetcher("").then(() => menu.loadWizardEntry(entry));
    } else {
      stage.fetcher("").then((items) => menu.loadWizardItems(items));
    }
  }, [wizardActionId, menu, tokens]);

  useEffect(() => {
    if (wizardStage >= 1) loadStageItems(wizardStage - 1);
  }, [wizardStage]);

  const handleStartWizard = useCallback((actionId: string) => {
    startWizard(actionId);
    setInput(inputRef.current.replace(MENTION_REGEX, ""));
  }, [startWizard, setInput]);

  const handleAdvanceWizard = useCallback((item: { id: string; label: string }) => {
    const nf = advanceWizard(item);
    if (!nf) { menu.resetToRoot(); return; }
    const nextStageIdx = engine.wizardStage;
    const hasRealSource = engine.wizardActionId ? WIZARD_REAL_DATA_SOURCES[engine.wizardActionId]?.[nextStageIdx] : null;
    if (hasRealSource) return;
    nf().then((items) => menu.loadWizardItems(items));
  }, [advanceWizard, menu, engine.wizardStage, engine.wizardActionId]);

  const handleWizardSelect = useCallback((stage: WizardStage, item: { id: string; label: string }) => {
    switch (stage) {
      case 0: handleStartWizard(item.id); break;
      case 1: case 2: case 3: case 4: handleAdvanceWizard(item); break;
    }
  }, [handleStartWizard, handleAdvanceWizard]);

  const handleAskSlotsConfirm = useCallback(() => {
    const selected = menu.listItems.filter((item) => multiSelectedIds.includes(item.id));
    if (selected.length === 0) return;
    advanceWizardMulti(selected);
    setMultiSelectedIds([]);
    menu.resetToRoot();
  }, [menu.listItems, multiSelectedIds, advanceWizardMulti, menu, setMultiSelectedIds]);

  const handleMultiSelectConfirm = useCallback(() => {
    const selected = menu.listItems.filter((item) => multiSelectedIds.includes(item.id));
    if (selected.length === 0) return;

    clearSelection();
    menu.resetToRoot();

    if (engine.wizardActionId === "employees-ask-slots") {
      advanceWizardMulti(selected);
    } else {
      advanceWizardMultiToNext(selected);
    }
  }, [menu.listItems, multiSelectedIds, engine.wizardActionId, advanceWizardMulti, advanceWizardMultiToNext, menu, clearSelection]);

  const handleResetTokens = useCallback(() => {
    setInput("");
    clearSelection();
    reset();
    menu.resetToRoot();
  }, [setInput, clearSelection, reset, menu]);

  return {
    multiSelectedIds,
    setMultiSelectedIds,
    isMultiSelectStage,
    isFullyTokenized,
    isWizardActive,
    handleStartWizard,
    handleAdvanceWizard,
    handleWizardSelect,
    handleToggleMultiSelect,
    handleAskSlotsConfirm,
    handleMultiSelectConfirm,
    executeWizard,
    handleResetTokens,
  };
};
