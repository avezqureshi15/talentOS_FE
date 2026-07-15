import { useCallback } from "react";
import type { WizardExecutionPayload, HybridQuestionPayload, WizardExecutionSummary } from "@/components/shared/mentions/types";

type Token = { type: string; label: string; id: string; relationalId?: string };

type ExecutionDeps = {
  wizardActionId: string | null;
  tokens: Token[];
  onWizardComplete?: (payload: WizardExecutionPayload | HybridQuestionPayload, summary?: WizardExecutionSummary) => void;
  reset: () => void;
  resetMenu: () => void;
  setInput: (v: string) => void;
  clearSelection: () => void;
  inputRef: React.RefObject<string>;
};

export const useWizardExecution = ({
  wizardActionId, tokens, onWizardComplete, reset, resetMenu, setInput, clearSelection, inputRef,
}: ExecutionDeps) => {
  const executeWizard = useCallback(() => {
    const rawText = inputRef.current?.trim() ?? "";
    const entityToken = tokens.find(t => t.type === "entity");
    const hiringRequestToken = tokens.find(t => t.type === "hiring-request");
    const applicantToken = tokens.find(t => t.type === "applicant");
    const interviewerToken = tokens.find(t => t.type === "interviewer");
    const slotToken = tokens.find(t => t.type === "slot");
    const interviewToken = tokens.find(t => t.type === "interview");
    const alertToken = tokens.find(t => t.type === "alert");

    const mode = entityToken ? "entity"
      : interviewToken ? "interview"
      : alertToken ? "alerts"
      : wizardActionId === "employees-ask-slots" ? "ask-slots"
      : wizardActionId === "send-mail" ? "send-mail"
      : wizardActionId === "book-interview" ? "book-interview"
      : "default";

    switch (mode) {
      case "entity": {
        const intent = ({ "hr-request": "INQUIRE_HR_REQUEST", "applicants-view": "INQUIRE_APPLICANT" } as const)[wizardActionId ?? ""] ?? "INQUIRE_EMPLOYEE";
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent, payload: { id_field: entityToken?.id ?? "", name_field: entityToken?.label ?? "", raw_text_context: rawText } },
          { applicantName: entityToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, hiringRequestName: "" },
        );
        break;
      }
      case "interview": {
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "interviews", payload: { interview_id: interviewToken?.label ?? "", hiring_request_id: "", applicant_id: interviewToken?.relationalId ?? interviewToken?.id ?? "", interviewer_id: "", slot_id: "", raw_text_context: rawText } },
          { applicantName: interviewToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 0 },
        );
        break;
      }
      case "alerts": {
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "alerts", payload: { alert_id: alertToken?.label ?? "", raw_text_context: rawText } },
          { applicantName: alertToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 0 },
        );
        break;
      }
      case "ask-slots": {
        const askTokens = tokens.filter(t => t.type === "ask-slots");
        const employeeNames = askTokens.map(t => t.label).join(", ");
        const employeeIds = askTokens.map(t => t.relationalId ?? t.id).join(", ");
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "ASK_SLOTS", payload: { applicant_ids: employeeIds, raw_text_context: rawText } },
          { applicantName: employeeNames, interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: askTokens.length },
        );
        break;
      }
      case "send-mail": {
        const mailToken = tokens.find(t => t.type === "applicant");
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent: "SEND_MAIL", payload: { employee_name: mailToken?.label ?? "", raw_text_context: rawText } },
          { applicantName: mailToken?.label ?? "", interviewerName: "", slotLabel: "", rawText, selectedEmployeeCount: 1 },
        );
        break;
      }
      case "book-interview": {
        const interviewerTokens = tokens.filter(t => t.type === "interviewer");
        onWizardComplete?.(
          {
            message_type: "COMMAND_EXECUTION" as const,
            intent: "book-interview",
            payload: {
              jd_id: hiringRequestToken?.id ?? hiringRequestToken?.relationalId ?? "",
              jd_title: hiringRequestToken?.label ?? "",
              candidate_id: Number(applicantToken?.relationalId) || Number(applicantToken?.id) || 0,
              candidate_name: applicantToken?.label ?? "",
              interviewer_ids: interviewerTokens.map(t => Number(t.id)).filter(n => n > 0),
              interviewer_names: interviewerTokens.map(t => t.label).join(", "),
              slot_id: slotToken?.id ?? slotToken?.relationalId ?? "",
              slot_label: slotToken?.label ?? "",
              round_name: rawText || "Untitled Round",
              create_google_meet: true,
              raw_text_context: rawText,
            },
          },
          { hiringRequestName: hiringRequestToken?.label ?? "", applicantName: applicantToken?.label ?? "", interviewerName: interviewerTokens.map(t => t.label).join(", "), slotLabel: slotToken?.label ?? "", rawText, selectedEmployeeCount: interviewerTokens.length },
        );
        break;
      }
      default: {
        const intent = wizardActionId ?? "UNKNOWN";
        onWizardComplete?.(
          { message_type: "COMMAND_EXECUTION" as const, intent, payload: { hiring_request_id: hiringRequestToken?.relationalId ?? hiringRequestToken?.id ?? "", applicant_id: applicantToken?.relationalId ?? applicantToken?.id ?? "", interviewer_id: interviewerToken?.relationalId ?? interviewerToken?.id ?? "", slot_id: slotToken?.relationalId ?? slotToken?.id ?? "", raw_text_context: rawText } },
          { hiringRequestName: hiringRequestToken?.label ?? "", applicantName: applicantToken?.label ?? "", interviewerName: interviewerToken?.label ?? "", slotLabel: slotToken?.label ?? "", rawText, selectedEmployeeCount: 0 },
        );
      }
    }

    reset();
    resetMenu();
    setInput("");
    clearSelection();
  }, [tokens, wizardActionId, onWizardComplete, reset, resetMenu, setInput, clearSelection, inputRef]);

  return { executeWizard };
};
