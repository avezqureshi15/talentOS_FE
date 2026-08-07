import Chip from "@/components/ui/chip/chip";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import type { AiScreeningResult } from "@/services/ai/ai.types";
import {
  AI_SCREENING_EXTRACTED_FIELDS,
  AI_SCREENING_LABELS,
  AI_SCREENING_RESULT_BADGES,
  AI_SCREENING_STATUS_BADGES,
  AI_SCREENING_TERMINAL_STATUSES,
  AI_SCREENING_WILLINGNESS_BADGE,
} from "./ai-screening-panel.constants";
import type { AiScreeningPanelProps, AiScreeningPanelViewProps } from "./ai-screening-panel.types";
import "./ai-screening-panel.css";

const AiScreeningPanel = ({ flagged, result }: AiScreeningPanelProps) => {
  if (flagged) {
    return (
      <section className="asp-card">
        <AiScreeningFlaggedNotice flagReason={flagged.flag_reason} />
      </section>
    );
  }
  return (
    <section className="asp-card">
      <AiScreeningHeader data={result?.data} isFetching={result?.isFetching ?? false} />
      <AiScreeningBody result={result} />
    </section>
  );
};

function AiScreeningFlaggedNotice({ flagReason }: { flagReason?: string | null }) {
  return (
    <div className="asp-flagged">
      <span className="asp-flagged-icon" aria-hidden="true">
        <i className="bx bx-error-circle" />
      </span>
      <div className="asp-flagged-body">
        <p className="asp-flagged-title">{AI_SCREENING_LABELS.FLAGGED_TITLE}</p>
        <p className="asp-flagged-text">{AI_SCREENING_LABELS.FLAGGED_BODY}</p>
        {flagReason && (
          <p className="asp-flagged-reason">
            {AI_SCREENING_LABELS.FLAGGED_REASON_PREFIX} {flagReason}
          </p>
        )}
      </div>
    </div>
  );
}

function AiScreeningHeader({ data, isFetching }: { data: AiScreeningResult | undefined; isFetching: boolean }) {
  const statusKey = (data?.call_status || "").toLowerCase();
  const statusBadge = AI_SCREENING_STATUS_BADGES[statusKey];
  const resultKey = (data?.result || "").toLowerCase();
  const resultBadge = AI_SCREENING_RESULT_BADGES[resultKey];
  const retries = data?.retry_count ?? 0;

  return (
    <header className="asp-header">
      <span className="asp-header-icon" aria-hidden="true">
        <i className="bx bx-phone-call" />
      </span>
      <h2 className="asp-title">{AI_SCREENING_LABELS.TITLE}</h2>
      <div className="asp-header-badges">
        {retries > 0 && (
          <span className="asp-retry-note">
            {AI_SCREENING_LABELS.RETRIES_PREFIX} {retries}
          </span>
        )}
        {statusBadge && (
          <Chip variant={statusBadge.variant} size="sm" icon={statusBadge.icon}>
            {statusBadge.label}
          </Chip>
        )}
        {resultBadge && (
          <Chip variant={resultBadge.variant} size="sm" icon={resultBadge.icon}>
            {resultBadge.label}
          </Chip>
        )}
        {isFetching && !!data && <LoadingSpinner size="sm" />}
      </div>
    </header>
  );
}

function AiScreeningBody({ result }: { result: AiScreeningPanelViewProps | undefined }) {
  const data = result?.data;
  const isLoading = result?.isLoading;
  const isError = result?.isError;

  if (isLoading) {
    return (
      <div className="asp-loading">
        <LoadingSpinner size="md" />
      </div>
    );
  }
  if (isError) {
    return <p className="asp-error">{AI_SCREENING_LABELS.ERROR}</p>;
  }
  if (!data) {
    return <p className="asp-empty">{AI_SCREENING_LABELS.MISSING}</p>;
  }

  const status = (data.call_status || "").toLowerCase();
  const isTerminal = AI_SCREENING_TERMINAL_STATUSES.has(status);

  if (!isTerminal && !data.summary && !hasAnyExtracted(data)) {
    return <p className="asp-empty">{AI_SCREENING_LABELS.IN_PROGRESS}</p>;
  }

  return (
    <>
      {data.summary && (
        <div>
          <p className="asp-section-label">{AI_SCREENING_LABELS.SUMMARY}</p>
          <p className="asp-summary">{data.summary}</p>
        </div>
      )}

      {hasAnyExtracted(data) && (
        <div>
          <p className="asp-section-label">{AI_SCREENING_LABELS.DETAILS}</p>
          <ExtractedFieldsGrid data={data} />
        </div>
      )}
    </>
  );
}

function ExtractedFieldsGrid({ data }: { data: AiScreeningResult }) {
  const willingness = data.willingness_to_proceed;
  const willingnessBadge =
    willingness === true ? AI_SCREENING_WILLINGNESS_BADGE.true :
    willingness === false ? AI_SCREENING_WILLINGNESS_BADGE.false : null;

  return (
    <div className="asp-fields-grid">
      {AI_SCREENING_EXTRACTED_FIELDS.map((f) => {
        const value = data[f.key];
        if (!value) return null;
        return (
          <div key={f.key} className="asp-field">
            <span className="asp-field-label">
              <i className={f.icon} /> {f.label}
            </span>
            <span className="asp-field-value">{value}</span>
          </div>
        );
      })}
      {willingnessBadge && (
        <div className="asp-field">
          <span className="asp-field-label">
            <i className="bx bx-check-double" /> Willingness
          </span>
          <span className="asp-field-value">
            <Chip variant={willingnessBadge.variant} size="sm" icon={willingnessBadge.icon}>
              {willingnessBadge.label}
            </Chip>
          </span>
        </div>
      )}
    </div>
  );
}

const hasAnyExtracted = (data: AiScreeningResult): boolean =>
  AI_SCREENING_EXTRACTED_FIELDS.some((f) => !!data[f.key]) || data.willingness_to_proceed !== null;

export default AiScreeningPanel;
