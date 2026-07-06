import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { WizardStage, CommandItem } from "@/components/shared/mentions/types";
import { WIZARD_ACTIONS } from "@/components/shared/mentions/config/wizard.config";
import { WIZARD_REAL_DATA_SOURCES } from "@/components/shared/mentions/config/wizard-data-sources";
import { MENTION_REGEX } from "@/components/shared/mentions/hooks/use-mention-engine";
import type { ChatInputProps } from "../chat-input.types";

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
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

  const loadStageItems = useCallback((stageIdx: number) => {
    const action = wizardActionId ? WIZARD_ACTIONS[wizardActionId] : null;
    if (!action) return;
    const stage = action.stages[stageIdx];
    if (!stage) return;

    const dataSource = wizardActionId ? WIZARD_REAL_DATA_SOURCES[wizardActionId]?.[stageIdx] : null;

    if (dataSource) {
      const entry = dataSource.createEntry();
      entry.fetcher!("").then(() => menu.loadWizardEntry(entry));
    } else {
      stage.fetcher("").then((items) => menu.loadWizardItems(items));
    }
  }, [wizardActionId, menu]);

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

  const handleToggleMultiSelect = useCallback((itemId: string) => {
    setMultiSelectedIds((prev) => {
      if (prev.includes(itemId)) return prev.filter((id) => id !== itemId);
      if (prev.length >= 10) return prev;
      return [...prev, itemId];
    });
  }, []);

  const handleAskSlotsConfirm = useCallback(() => {
    const selected = menu.listItems.filter((item) => multiSelectedIds.includes(item.id));
    if (selected.length === 0) return;
    advanceWizardMulti(selected);
    setMultiSelectedIds([]);
    menu.resetToRoot();
  }, [menu.listItems, multiSelectedIds, advanceWizardMulti, menu]);

  const handleMultiSelectConfirm = useCallback(() => {
    const selected = menu.listItems.filter((item) => multiSelectedIds.includes(item.id));
    if (selected.length === 0) return;

    setMultiSelectedIds([]);
    menu.resetToRoot();

    if (engine.wizardActionId === "employees-ask-slots") {
      advanceWizardMulti(selected);
    } else {
      const nf = advanceWizardMultiToNext(selected);
      if (nf) nf().then((items) => menu.loadWizardItems(items));
    }
  }, [menu.listItems, multiSelectedIds, engine.wizardActionId, advanceWizardMulti, advanceWizardMultiToNext, menu]);

  const executeWizard = useCallback(() => {
    const rawText = inputRef.current.trim();
    const entityToken = tokens.find(t => t.type === "entity");
    const hiringRequestToken = tokens.find(t => t.type === "hiring-request");
    const applicantToken = tokens.find(t => t.type === "applicant");
    const interviewerToken = tokens.find(t => t.type === "interviewer");
    const slotToken = tokens.find(t => t.type === "slot");
    const interviewToken = tokens.find(t => t.type === "interview");

    if (entityToken) {
      const intent = ({ "hr-request": "INQUIRE_HR_REQUEST", "applicants-view": "INQUIRE_APPLICANT" } as const)[engine.wizardActionId ?? ""] ?? "INQUIRE_EMPLOYEE";
      onWizardComplete?.(
        { message_type: "COMMAND_EXECUTION" as const, intent, payload: { id_field: entityToken.relationalId ?? entityToken.id, name_field: entityToken.label, raw_text_context: rawText } },
        { applicantName: entityToken.label, interviewerName: "", slotLabel: "", rawText, hiringRequestName: "" },
      );
    } else if (interviewToken) {
      onWizardComplete?.(
        { message_type: "COMMAND_EXECUTION" as const, intent: "interviews", payload: { interview_id: interviewToken?.relationalId ?? interviewToken?.id ?? "", hiring_request_id: "", applicant_id: "", interviewer_id: "", slot_id: "", raw_text_context: rawText } },
        { applicantName: interviewToken.label, interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 0 },
      );
      } else if (engine.wizardActionId === "employees-ask-slots") {
        const askTokens = tokens.filter(t => t.type === "ask-slots");
        const employeeNames = askTokens.map(t => t.label).join(", ");
        const employeeIds = askTokens.map(t => t.relationalId ?? t.id).join(", ");
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "ASK_SLOTS", payload: { applicant_ids: employeeIds, raw_text_context: rawText } },
          { applicantName: employeeNames, interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: askTokens.length },
        );
      } else if (engine.wizardActionId === "employees-send-mail") {
        const mailToken = tokens.find(t => t.type === "applicant");
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "SEND_MAIL", payload: { employee_name: mailToken?.label ?? "", raw_text_context: rawText } },
          { applicantName: mailToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 1 },
        );
      } else if (engine.wizardActionId === "applicants-send-mail") {
        const mailToken = tokens.find(t => t.type === "applicant");
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "SEND_MAIL", payload: { employee_name: mailToken?.label ?? "", raw_text_context: rawText } },
          { applicantName: mailToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 1 },
        );
    } else {
      const intent = engine.wizardActionId ?? "UNKNOWN";
      onWizardComplete?.(
        { message_type: "COMMAND_EXECUTION" as const, intent, payload: { hiring_request_id: hiringRequestToken?.relationalId ?? hiringRequestToken?.id ?? "", applicant_id: applicantToken?.relationalId ?? applicantToken?.id ?? "", interviewer_id: interviewerToken?.relationalId ?? interviewerToken?.id ?? "", slot_id: slotToken?.relationalId ?? slotToken?.id ?? "", raw_text_context: rawText } },
        { hiringRequestName: hiringRequestToken?.label ?? "", applicantName: applicantToken?.label ?? "", interviewerName: interviewerToken?.label ?? "", slotLabel: slotToken?.label ?? "", rawText, selectedEmployeeCount: 0 },
      );
    }
    reset();
    menu.resetToRoot();
    setInput("");
    setMultiSelectedIds([]);
  }, [tokens, engine.wizardActionId, onWizardComplete, reset, menu, setInput]);

  const handleResetTokens = useCallback(() => {
    setInput("");
    setMultiSelectedIds([]);
    reset();
    menu.resetToRoot();
  }, [setInput, reset, menu]);

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
    textareaRef,
  };
};
