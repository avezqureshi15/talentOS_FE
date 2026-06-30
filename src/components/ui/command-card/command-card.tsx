import "./command-card.css";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { useEntityResolution } from "@/hooks/use-entity-resolution";
import { resolveInterviewStatus } from "@/app/chat/components/chat-area/chat-area.utils";
import type { CommandCardProps } from "./command-card.types";
import { HYBRID_INTENT_ICONS, HYBRID_INTENT_FALLBACK_ICON, INTENT_HEADER_ICONS, INTENT_LABELS, COMMAND_CARD_LABELS } from "./command-card.constants";

const EntityLabel = ({ label, loading }: { label: string | null | undefined; loading: boolean }) => {
  if (loading) return <Skeleton width="140px" height="16px" />;
  return <span className="command-card__value">{label ?? COMMAND_CARD_LABELS.UNKNOWN}</span>;
};

const CommandCard = ({ data, hybrid }: CommandCardProps) => {
  if (hybrid) {
    return (
      <div className="command-card command-card--hybrid">
        <div className="command-card__question">{hybrid.payload.raw_text_context || COMMAND_CARD_LABELS.NO_QUESTION}</div>
        <div className="command-card__entity-chip">
          <i className={HYBRID_INTENT_ICONS[hybrid.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
          <span>{hybrid.payload.name_field}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const entities = [
    { key: "hiringRequest", type: "hiring-request" as const, id: data.payload.hiring_request_id ?? "" },
    { key: "applicant", type: "candidate" as const, id: data.payload.applicant_id ?? "" },
    { key: "interviewer", type: "user" as const, id: data.payload.interviewer_id ?? "" },
  ].filter((e) => e.id);

  const { resolved, loading } = useEntityResolution(entities);
  const headerIcon = INTENT_HEADER_ICONS[data.intent] ?? "bx bx-terminal";
  const headerLabel = INTENT_LABELS[data.intent] ?? data.intent;

  if (data.intent === "ASK_SLOTS") {
    const ids = data.payload.applicant_ids?.split(", ").filter(Boolean) ?? [];
    const empEntities = ids.map((id, i) => ({ key: `emp_${i}`, type: "candidate" as const, id }));
    const { resolved: empResolved, loading: empLoading } = useEntityResolution(empEntities);
    const empLabels = empEntities.map((e) => empResolved[e.key]).filter(Boolean);

    return (
      <div className="command-card">
        <div className="command-card__header">
          <i className="bx bx-clock" />
          <span>{COMMAND_CARD_LABELS.SLOT_BOOKING}</span>
        </div>
        <div className="command-card__body">
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.EMPLOYEES} ({empLabels.length})</span>
            {empLoading ? <Skeleton width="120px" height="16px" /> : <span className="command-card__value">{empLabels.join(", ")}</span>}
          </div>
          {data.payload.raw_text_context && (
            <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
          )}
        </div>
      </div>
    );
  }

  if (data.intent === "interviews") {
    const interviewLabel = resolved.applicant ?? data.payload.interview_id;
    const status = resolveInterviewStatus(data.payload.interview_id ?? "");
    return (
      <div className="command-card">
        <div className="command-card__header">
          <i className="bx bx-calendar-check" />
          <span>{interviewLabel}</span>
          {status && <span className={`command-card__status command-card__status--${status}`}>{status}</span>}
        </div>
        <div className="command-card__body">
          {data.payload.raw_text_context && (
            <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
          )}
        </div>
      </div>
    );
  }

  if (data.intent.startsWith("INQUIRE_")) {
    return (
      <div className="command-card">
        <div className="command-card__header">
          <i className={INTENT_HEADER_ICONS[data.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
          <span>{headerLabel}</span>
        </div>
        <div className="command-card__body">
          <div className="command-card__entity-chip">
            <i className={INTENT_HEADER_ICONS[data.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
            <span>{data.payload.name_field}</span>
          </div>
          {data.payload.raw_text_context && (
            <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
          )}
        </div>
      </div>
    );
  }

  if (data.intent === "employees-ping") {
    return (
      <div className="command-card">
        <div className="command-card__header">
          <i className="bx bx-message" />
          <span>{COMMAND_CARD_LABELS.PING}</span>
        </div>
        <div className="command-card__body">
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.EMPLOYEE}</span>
            <EntityLabel label={resolved.applicant} loading={loading} />
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
        <i className={headerIcon} />
        <span>{headerLabel}</span>
      </div>
      <div className="command-card__body">
        {data.payload.hiring_request_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.HIRING_REQUEST}</span>
            <EntityLabel label={resolved.hiringRequest} loading={loading} />
          </div>
        )}
        {data.payload.applicant_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.CANDIDATE}</span>
            <EntityLabel label={resolved.applicant} loading={loading} />
          </div>
        )}
        {data.payload.interviewer_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.INTERVIEWER}</span>
            <EntityLabel label={resolved.interviewer} loading={loading} />
          </div>
        )}
        {data.payload.slot_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.TIME_SLOT}</span>
            <span className="command-card__value">{data.payload.slot_id}</span>
          </div>
        )}
        {data.payload.raw_text_context && (
          <blockquote className="command-card__context">{data.payload.raw_text_context}</blockquote>
        )}
      </div>
    </div>
  );
};

export default CommandCard;
