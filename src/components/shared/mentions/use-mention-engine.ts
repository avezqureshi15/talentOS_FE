import { useState, useCallback } from "react";
import type { Token, WizardStage, WizardActionConfig, WizardStageConfig, CommandItem } from "./mentions.types";
import { WIZARD_ACTIONS } from "./wizard.config";

const MENTION_REGEX = /@(\w*)$/;

export const useMentionEngine = () => {
  const [show, setShow] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [wizardStage, setWizardStage] = useState<WizardStage>(0);
  const [wizardActionId, setWizardActionId] = useState<string | null>(null);

  const getAction = useCallback((): WizardActionConfig | null => {
    return wizardActionId ? WIZARD_ACTIONS[wizardActionId] ?? null : null;
  }, [wizardActionId]);

  const getStage = useCallback((): WizardStageConfig | null => {
    const action = getAction();
    if (!action || wizardStage === 0) return null;
    return action.stages[wizardStage - 1] ?? null;
  }, [getAction, wizardStage]);

  const handleChange = useCallback((value: string, cursorPos: number) => {
    if (tokens.length > 0) return;
    const textUntilCursor = value.slice(0, cursorPos);
    const match = textUntilCursor.match(MENTION_REGEX);
    setShow(!!match);
    if (!match) {
      setWizardStage(0);
    }
  }, [tokens.length]);

  const startWizard = useCallback((actionId: string) => {
    const action = WIZARD_ACTIONS[actionId];
    if (!action) return null;
    const actionToken: Token = { type: "action", label: action.label, id: action.id };
    setTokens([actionToken]);
    setWizardStage(1);
    setWizardActionId(actionId);
    setShow(true);
    const firstStage = action.stages[0];
    return firstStage?.fetcher ?? null;
  }, []);

  const advanceWizard = useCallback((item: CommandItem): (() => Promise<CommandItem[]>) | null => {
    const action = WIZARD_ACTIONS[wizardActionId ?? ""];
    if (!action) return null;
    const stage = action.stages[wizardStage - 1];
    if (!stage) return null;

    const newToken: Token = { type: stage.tokenType, label: item.label, id: item.id, relationalId: item.relationalId };
    setTokens((prev) => [...prev, newToken]);

    if (stage.isFinal) {
      setShow(false);
      return null;
    }

    const nextStageIdx = wizardStage;
    const nextStage = action.stages[nextStageIdx];
    if (nextStage) {
      setWizardStage((nextStageIdx + 1) as WizardStage);
      return () => nextStage.fetcher("");
    }
    setShow(false);
    return null;
  }, [wizardActionId, wizardStage]);

  const reset = useCallback(() => {
    setTokens([]);
    setWizardStage(0);
    setWizardActionId(null);
    setShow(false);
  }, []);

  const insert = useCallback((text: string, value: string, setValue: (v: string) => void) => {
    const newText = value.replace(MENTION_REGEX, () => `@${text} `);
    setValue(newText);
    setShow(false);
  }, []);

  return {
    show,
    tokens,
    wizardStage,
    wizardActionId,
    getAction,
    getStage,
    handleChange,
    startWizard,
    advanceWizard,
    insert,
    reset,
  };
};