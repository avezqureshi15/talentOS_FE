import "./command-card.css";
import { resolveRelationalLabel } from "@/app/chat/components/chat-area/chat-area.utils";
import type { CommandCardProps } from "./command-card.types";
import { HYBRID_INTENT_ICONS, HYBRID_INTENT_FALLBACK_ICON } from "./command-card.constants";

const CommandCard = ({ data, hybrid }: CommandCardProps) => {
  if (hybrid) {
    return (
      <div className="command-card command-card--hybrid">
        <div className="command-card__question">{hybrid.payload.raw_text_context || "No question provided"}</div>
        <div className="command-card__entity-chip">
          <i className={HYBRID_INTENT_ICONS[hybrid.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
          <span>{hybrid.payload.name_field}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const applicantLabel = resolveRelationalLabel(data.payload.applicant_id ?? "");
  const interviewerLabel = resolveRelationalLabel(data.payload.interviewer_id ?? "");
  const slotLabel = resolveRelationalLabel(data.payload.slot_id ?? "");

  if (data.intent === "employees-ping") {
    return (
      <div className="command-card">
        <div className="command-card__header">
          <i className="bx bx-message" />
          <span>Ping</span>
        </div>
        <div className="command-card__body">
          <div className="command-card__row">
            <span className="command-card__label">Employee</span>
            <span className="command-card__value">{applicantLabel}</span>
          </div>
          {data.payload.raw_text_context && (
            <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="command-card">
      <div className="command-card__header">
        <i className="bx bx-calendar-check" />
        <span>Interview Booking Request</span>
      </div>
      <div className="command-card__body">
        <div className="command-card__row">
          <span className="command-card__label">Candidate</span>
          <span className="command-card__value">{applicantLabel}</span>
        </div>
        <div className="command-card__row">
          <span className="command-card__label">Interviewer</span>
          <span className="command-card__value">{interviewerLabel}</span>
        </div>
        <div className="command-card__row">
          <span className="command-card__label">Time Slot</span>
          <span className="command-card__value">{slotLabel}</span>
        </div>
        {data.payload.raw_text_context && (
          <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
        )}
      </div>
    </div>
  );
};

export default CommandCard;
