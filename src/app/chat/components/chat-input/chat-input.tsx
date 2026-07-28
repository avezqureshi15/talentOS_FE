import { useRef, useState, useCallback } from "react";
import SendButton from "@/app/chat/components/send-button/send-button";
import ChatTokens from "./chat-tokens";
import "./chat-input.css";
import type { ChatInputProps } from "./chat-input.types";
import { useMentionEngine } from "@/components/shared/mentions/hooks/use-mention-engine";
import { useCommandMenu } from "@/components/shared/mentions/hooks/use-command-menu";
import MentionPopup from "@/components/shared/mentions/components/mention-popup";
import { COMMON_SLOTS_TAB_ID } from "@/components/shared/mentions/components/slot-tabs/slot-tabs.constants";
import { WIZARD_LABELS } from "@/components/shared/mentions/constants";
import { WIZARD_ACTIONS } from "@/components/shared/mentions/config/wizard.config";
import { fetchSlotsByEmployee } from "@/services/slots/slots";
import { useAutoResize } from "./hooks/use-auto-resize";
import { useWizard } from "./hooks/use-wizard";
import { useTypingPlaceholder } from "./hooks/use-typing-placeholder";
import { useChatKeydown } from "./hooks/use-chat-keydown";

const PLACEHOLDER_PHRASES = [
  "Ask anything...",
  "@ Book Interview",
  "@ Send Mail",
  // "Hiring Requests" renamed to "Job Listings"
  "@ View Job Listings",
  "@ View Applicants",
  "@ View Employees",
  "@ Ask Slots",
  "@ Check Interviews",
];

const ChatInput: React.FC<ChatInputProps> = ({
  mounted = true,
  input,
  setInput,
  onSend,
  onWizardComplete,
  showAurora,
}) => {
  const { textareaRef } = useAutoResize(input);
  const containerRef = useRef<HTMLDivElement>(null);
  const engine = useMentionEngine();
  const menu = useCommandMenu();
  const [inputFocused, setInputFocused] = useState(false);

  useTypingPlaceholder(textareaRef, PLACEHOLDER_PHRASES, !input);
  const { show, tokens, wizardStage, wizardActionId, handleChange, insert, reset } = engine;

  const wizard = useWizard(engine, menu, onWizardComplete, input, setInput);

  const {
    multiSelectedIds, isMultiSelectStage, isFullyTokenized, isWizardActive,
    handleWizardSelect, handleToggleMultiSelect, handleMultiSelectConfirm,
    executeWizard, handleResetTokens,
  } = wizard;

  const {
    isListView, listItems, filteredEntries, activeEntry,
    moveDown, moveUp, selectCurrentItem, navigateTo, resetToRoot,
  } = menu;

  const handleInterviewerChange = useCallback((tabId: string) => {
    const interviewerTokens = tokens.filter((t) => t.type === "interviewer");
    if (tabId === COMMON_SLOTS_TAB_ID) {
      Promise.all(interviewerTokens.map((t) => fetchSlotsByEmployee(t.id)))
        .then((all) => menu.loadWizardItems(all.flat()));
    } else {
      const token = interviewerTokens.find((t) => t.id === tabId);
      if (token) {
        fetchSlotsByEmployee(token.id).then((items) => menu.loadWizardItems(items));
      }
    }
  }, [tokens, menu]);

  const handleKeyDown = useChatKeydown({
    show, isWizardActive, isMultiSelectStage, isFullyTokenized,
    input, setInput, onSend, executeWizard, wizardStage,
    isListView, listItems, filteredEntries, activeEntry,
    moveDown, moveUp, selectCurrentItem, navigateTo, resetToRoot,
    reset, insert, handleChange, handleResetTokens,
    handleWizardSelect, handleMultiSelectConfirm,
  });

  return (
    <div className={`cui-fade-up cui-d3${mounted ? "" : " opacity-0"}`}>
      <div className="chat-input-root">
        <div ref={containerRef} className="chat-input-container">
          <div className={`chat-input-aurora${showAurora ? " chat-input-aurora--active" : ""}`}>
            <div className="chat-input-wrapper">
            <div className="chat-input-field-wrapper">
              <ChatTokens tokens={tokens} onReset={handleResetTokens} />
              <textarea
                ref={textareaRef}
                className="chat-input-textarea"
                value={input}
                onChange={(e) => { setInput(e.target.value); handleChange(e.target.value, e.target.selectionStart); }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                rows={1}
              />
            </div>
            <SendButton
              disabled={!input.trim() && !isFullyTokenized}
              onClick={() => { if (isFullyTokenized) executeWizard(); else if (input.trim()) onSend(); }}
              animate={showAurora && !inputFocused}
            />
          </div>
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
            isMultiSelectStage={isMultiSelectStage}
            tokens={tokens}
            anchorRef={containerRef}
            onInterviewerChange={handleInterviewerChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
