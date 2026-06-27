import React, { useEffect } from "react";
import SendButton from "@/components/ui/send-button/send-button";
import ChatTokens from "./chat-tokens";
import "./chat-input.css";
import type { ChatInputProps } from "./chat-input.types";
import { useMentionEngine } from "@/components/shared/mentions/use-mention-engine";
import { useCommandMenu } from "@/components/shared/mentions/use-command-menu";
import MentionPopup, { resolveMenuSelection } from "@/components/shared/mentions/mentions";
import { WIZARD_LABELS } from "@/components/shared/mentions/mentions.constants";
import { CHAT_INPUT_LABELS } from "./chat-input.constants";
import type { WizardStage } from "@/components/shared/mentions/mentions.types";
import { WIZARD_ACTIONS } from "@/components/shared/mentions/wizard.config";
import { useAutoResize } from "./hooks/use-auto-resize";

const ChatInput: React.FC<ChatInputProps> = ({
  mounted = true,
  input,
  setInput,
  onSend,
  onWizardComplete,
}) => {
  const { textareaRef } = useAutoResize(input);
  const engine = useMentionEngine();
  const menu = useCommandMenu();
  const { show, tokens, wizardStage, wizardActionId, handleChange, startWizard, advanceWizard, reset } = engine;

  const isFullyTokenized = wizardActionId ? tokens.length === (WIZARD_ACTIONS[wizardActionId]?.totalTokens ?? 0) : false;
  const isWizardActive = wizardStage > 0;
  const loadStageItems = (i: number) => { const s = wizardActionId ? WIZARD_ACTIONS[wizardActionId]?.stages[i] : null; if (s) s.fetcher("").then((items) => menu.loadWizardItems(items)); };

  useEffect(() => { if (wizardStage >= 1) loadStageItems(wizardStage - 1); if (isWizardActive) textareaRef.current?.focus(); }, [wizardStage, tokens.length]);

  const handleStartWizard = (actionId: string) => { startWizard(actionId); setInput(""); };

  const handleAdvanceWizard = (item: { id: string; label: string }) => {
    const nf = advanceWizard(item);
    if (!nf) { menu.resetToRoot(); return; }
    nf().then((items) => menu.loadWizardItems(items));
  };

  const handleWizardSelect = (stage: WizardStage, item: { id: string; label: string }) => {
    switch (stage) {
      case 0: handleStartWizard(item.id); break;
      case 1: case 2: case 3: handleAdvanceWizard(item); break;
    }
  };

  const executeWizard = () => {
    const rawText = input.trim(), entityToken = tokens.find(t => t.type === "entity"), applicantToken = tokens.find(t => t.type === "applicant"), interviewerToken = tokens.find(t => t.type === "interviewer"), slotToken = tokens.find(t => t.type === "slot");
    if (entityToken) {
      const intent = ({ "hr-request": "INQUIRE_HR_REQUEST", "applicants": "INQUIRE_APPLICANT" } as const)[wizardActionId ?? ""] ?? "INQUIRE_EMPLOYEE";
      onWizardComplete?.({
        message_type: "HYBRID_QUESTION",
        intent,
        payload: { id_field: entityToken.relationalId ?? entityToken.id, name_field: entityToken.label, raw_text_context: rawText },
      });
    } else {
      onWizardComplete?.({
        message_type: "COMMAND_EXECUTION",
        intent: wizardActionId ?? "UNKNOWN",
        payload: {
          applicant_id: applicantToken?.relationalId ?? applicantToken?.id ?? "",
          interviewer_id: interviewerToken?.relationalId ?? interviewerToken?.id ?? "",
          slot_id: slotToken?.relationalId ?? slotToken?.id ?? "",
          raw_text_context: rawText,
        },
      }, {
        applicantName: applicantToken?.label ?? "",
        interviewerName: interviewerToken?.label ?? "",
        slotLabel: slotToken?.label ?? "",
        rawText,
      });
    }
    reset();
    menu.resetToRoot();
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (show && !isWizardActive) {
      const items = menu.isListView ? menu.listItems : menu.filteredEntries;
      if (items.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            menu.moveDown();
            return;
          case "ArrowUp":
            e.preventDefault();
            menu.moveUp();
            return;
          case "Enter":
            if (!e.shiftKey) {
              e.preventDefault();
              const current = menu.selectCurrentItem();
              if (current) {
                const result = resolveMenuSelection(current, menu.isListView, menu.activeEntry);
                switch (result.action) {
                  case "wizard":
                    handleWizardSelect(result.stage, { id: current.id, label: current.label });
                    break;
                  case "navigate":
                    menu.navigateTo(result.entry);
                    break;
                  default:
                    engine.insert(result.text, input, setInput);
                }
              }
            }
            return;
        }
      }
      return;
    }

    if (isWizardActive && show) {
      if (menu.listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            menu.moveDown();
            return;
          case "ArrowUp":
            e.preventDefault();
            menu.moveUp();
            return;
          case "Enter":
            if (!e.shiftKey) {
              e.preventDefault();
              const item = menu.selectCurrentItem() as { id: string; label: string } | null;
              if (item) handleWizardSelect(wizardStage, item);
            }
            return;
          case "Escape":
            e.preventDefault();
            reset();
            menu.resetToRoot();
            return;
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
  };

  const handleResetTokens = () => {
    setInput("");
    reset();
    menu.resetToRoot();
  };
  return (
    <div className={`cui-fade-up cui-d3${mounted ? "" : " opacity-0"}`}>
      <div className="chat-input-root">
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <div className="chat-input-field-wrapper">
              <ChatTokens tokens={tokens} onReset={handleResetTokens} />
              <textarea
                ref={textareaRef}
                className="chat-input-textarea"
                value={input}
                onChange={(e) => { setInput(e.target.value); handleChange(e.target.value, e.target.value.length); }}
                onKeyDown={handleKeyDown}
                placeholder={CHAT_INPUT_LABELS.PLACEHOLDER}
                rows={1}
              />
            </div>
            <SendButton
              disabled={!input.trim() && !isFullyTokenized}
              onClick={() => { if (isFullyTokenized) { executeWizard(); } else if (input.trim()) { onSend(); } }}
            />
          </div>
          {isFullyTokenized && (
            <div className="ci-execution-cue">{(wizardActionId ? WIZARD_ACTIONS[wizardActionId]?.executionCue : null) ?? WIZARD_LABELS.EXECUTION_CUE}</div>
          )}
          <MentionPopup
            show={show}
            menu={menu}
            onInsert={(text) => engine.insert(text, input, setInput)}
            onWizardSelect={handleWizardSelect}
            wizardStage={wizardStage}
            tokens={tokens}
          />
        </div>
      </div>
    </div>
  );
};
export default ChatInput;