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

  const pay = data.payload as any;

  const entities = [
    { key: "hiringRequest", type: "hiring-request" as const, id: pay.hiring_request_id ?? "" },
    { key: "applicant", type: "candidate" as const, id: pay.applicant_id ?? "" },
    { key: "interviewer", type: "user" as const, id: pay.interviewer_id ?? "" },
  ].filter((e) => e.id);

  const { resolved, loading } = useEntityResolution(entities);

  const ids = (pay.emp_ids ?? "").split(", ").filter(Boolean);
  const empEntities = ids.map((id: string, i: number) => ({ key: `emp_${i}`, type: "user" as const, id }));
  const { resolved: empResolved, loading: empLoading } = useEntityResolution(empEntities);

  const headerIcon = INTENT_HEADER_ICONS[data.intent] ?? "bx bx-terminal";
  const headerLabel = INTENT_LABELS[data.intent] ?? data.intent;

  const renderInquireCard = () => (
    <div className="command-card">
      <div className="command-card__header">
        <i className={INTENT_HEADER_ICONS[data.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
        <span>{headerLabel}</span>
      </div>
      <div className="command-card__body">
        <div className="command-card__entity-chip">
          <i className={INTENT_HEADER_ICONS[data.intent] ?? HYBRID_INTENT_FALLBACK_ICON} />
          <span>{pay.applicant_name ?? pay.user_name ?? pay.name_field ?? ""}</span>
        </div>
        {(pay.applicant_email ?? pay.user_email) && (
          <div className="command-card__row">
            <span className="command-card__label">Email</span>
            <span className="command-card__value">{pay.applicant_email ?? pay.user_email}</span>
          </div>
        )}
        {pay.raw_text_context && (
          <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
        )}
      </div>
    </div>
  );

  const renderDefaultCard = () => (
    <div className="command-card">
      <div className="command-card__header">
        <i className={headerIcon} />
        <span>{headerLabel}</span>
      </div>
      <div className="command-card__body">
        {pay.hiring_request_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.HIRING_REQUEST}</span>
            <EntityLabel label={resolved.hiringRequest} loading={loading} />
          </div>
        )}
        {pay.applicant_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.CANDIDATE}</span>
            <EntityLabel label={resolved.applicant} loading={loading} />
          </div>
        )}
        {pay.interviewer_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.INTERVIEWER}</span>
            <EntityLabel label={resolved.interviewer} loading={loading} />
          </div>
        )}
        {pay.slot_id && (
          <div className="command-card__row">
            <span className="command-card__label">{COMMAND_CARD_LABELS.TIME_SLOT}</span>
            <span className="command-card__value">10:00 AM - 11:00 AM</span>
          </div>
        )}
        {pay.raw_text_context && (
          <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
        )}
      </div>
    </div>
  );

  switch (data.intent) {
    case "ASK_SLOTS":
    case "ask slots availability": {
      const empLabels = empEntities.map((e: { key: string }) => empResolved[e.key]).filter(Boolean);
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
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    }
    case "SEND_MAIL":
      return (
        <div className="command-card">
          <div className="command-card__header">
            <i className="bx bx-envelope" />
            <span>{COMMAND_CARD_LABELS.SEND_MAIL}</span>
          </div>
          <div className="command-card__body">
            <div className="command-card__row">
              <span className="command-card__label">{COMMAND_CARD_LABELS.EMPLOYEE}</span>
              <EntityLabel label={resolved.applicant} loading={loading} />
            </div>
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    case "interviews": {
      const interviewLabel = pay.interview_label ?? pay.interview_id;
      const status = resolveInterviewStatus(pay.interview_id ?? "");
      return (
        <div className="command-card">
          <div className="command-card__header">
            <i className="bx bx-calendar-check" />
            <span>{interviewLabel}</span>
            {status && <span className={`command-card__status command-card__status--${status}`}>{status}</span>}
          </div>
          <div className="command-card__body">
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    }
    case "alerts":
      return (
        <div className="command-card">
          <div className="command-card__header">
            <i className="bx bx-bell" />
            <span>{pay.alert_label ?? pay.alert_id}</span>
          </div>
          <div className="command-card__body">
            {pay.alert_type && (
              <div className="command-card__row">
                <span className="command-card__label">Type</span>
                <span className="command-card__value">{pay.alert_type}</span>
              </div>
            )}
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    case "rounds":
      return (
        <div className="command-card">
          <div className="command-card__header">
            <i className="bx bx-calendar-check" />
            <span>{pay.round_label ?? pay.round_id}</span>
          </div>
          <div className="command-card__body">
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    case "book-interview":
      return (
        <div className="command-card">
          <div className="command-card__header">
            <i className="bx bx-calendar-check" />
            <span>{COMMAND_CARD_LABELS.INTERVIEW_BOOKING}</span>
          </div>
          <div className="command-card__body">
            {pay.jd_title && (
              <div className="command-card__row">
                <span className="command-card__label">Job</span>
                <span className="command-card__value">{pay.jd_title}</span>
              </div>
            )}
            {pay.candidate_name && (
              <div className="command-card__row">
                <span className="command-card__label">{COMMAND_CARD_LABELS.CANDIDATE}</span>
                <span className="command-card__value">{pay.candidate_name}</span>
              </div>
            )}
            {pay.interviewer_names && (
              <div className="command-card__row">
                <span className="command-card__label">{COMMAND_CARD_LABELS.INTERVIEWER}</span>
                <span className="command-card__value">{pay.interviewer_names}</span>
              </div>
            )}
            {pay.round_name && (
              <div className="command-card__row">
                <span className="command-card__label">Round</span>
                <span className="command-card__value">{pay.round_name}</span>
              </div>
            )}
            {pay.slot_label && (
              <div className="command-card__row">
                <span className="command-card__label">{COMMAND_CARD_LABELS.TIME_SLOT}</span>
                <span className="command-card__value">{pay.slot_label}</span>
              </div>
            )}
            {pay.raw_text_context && (
              <blockquote className="command-card__context">{pay.raw_text_context}</blockquote>
            )}
          </div>
        </div>
      );
    default:
      return data.intent.startsWith("INQUIRE_") ? renderInquireCard() : renderDefaultCard();
  }
};

export default CommandCard;
