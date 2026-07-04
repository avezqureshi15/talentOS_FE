import { useCallback } from "react";
import SendButton from "@/components/ui/send-button/send-button";
import ChatTokens from "./chat-tokens";
import "./chat-input.css";
import type { ChatInputProps } from "./chat-input.types";
import { useMentionEngine } from "@/components/shared/mentions/hooks/use-mention-engine";
import { useCommandMenu } from "@/components/shared/mentions/hooks/use-command-menu";
import MentionPopup from "@/components/shared/mentions/components/mention-popup";
import { resolveMenuSelection } from "@/components/shared/mentions/utils";
import { WIZARD_LABELS } from "@/components/shared/mentions/constants";
import { CHAT_INPUT_LABELS } from "./chat-input.constants";
import { WIZARD_ACTIONS } from "@/components/shared/mentions/config/wizard.config";
import { useAutoResize } from "./hooks/use-auto-resize";
import { useWizard } from "./hooks/use-wizard";

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
  const { show, tokens, wizardStage, wizardActionId, handleChange, insert, reset } = engine;

  const wizard = useWizard(engine, menu, onWizardComplete, input, setInput);

  const {
    multiSelectedIds, isAskSlots, isFullyTokenized, isWizardActive,
    handleWizardSelect, handleToggleMultiSelect, handleAskSlotsConfirm,
    executeWizard, handleResetTokens,
  } = wizard;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                case "wizard": handleWizardSelect(result.stage, { id: current.id, label: current.label }); break;
                case "navigate": menu.navigateTo(result.entry); break;
                default: insert(result.text, input, setInput); break;
              }
            }
          }
          return;
      }
      return;
    }

    if (isWizardActive && show) {
      if (isAskSlots && menu.listItems.length > 0) {
        switch (e.key) {
          case "ArrowDown": e.preventDefault(); menu.moveDown(); return;
          case "ArrowUp": e.preventDefault(); menu.moveUp(); return;
          case "Enter": if (!e.shiftKey) { e.preventDefault(); handleAskSlotsConfirm(); } return;
          case "Escape": e.preventDefault(); reset(); menu.resetToRoot(); return;
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
              const item = menu.selectCurrentItem() as { id: string; label: string } | null;
              if (item) handleWizardSelect(wizardStage as 0 | 1 | 2 | 3 | 4, item);
            }
            return;
          case "Escape": e.preventDefault(); reset(); menu.resetToRoot(); return;
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
  }, [show, isWizardActive, isAskSlots, isFullyTokenized, input, menu, engine, reset, insert, setInput, handleWizardSelect, handleAskSlotsConfirm, executeWizard, handleChange, onSend]);

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
              onClick={() => { if (isFullyTokenized) executeWizard(); else if (input.trim()) onSend(); }}
            />
          </div>
          {isFullyTokenized && (
            <div className="ci-execution-cue">{(wizardActionId ? WIZARD_ACTIONS[wizardActionId]?.executionCue : null) ?? WIZARD_LABELS.EXECUTION_CUE}</div>
          )}
          <MentionPopup
            show={show}
            menu={menu}
            onInsert={(text) => insert(text, input, setInput)}
            onWizardSelect={handleWizardSelect}
            multiSelectedIds={multiSelectedIds}
            onToggleMultiSelect={handleToggleMultiSelect}
            wizardStage={wizardStage}
            tokens={tokens}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
