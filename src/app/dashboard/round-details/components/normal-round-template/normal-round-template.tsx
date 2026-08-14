import ReadMoreText from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/read-more-text";
import { toISTDisplay, toISTTimeRange } from "@/utils/date";
import { useAiScreeningResult } from "@/hooks/use-ai-screening";
import type { AiScreeningResult } from "@/services/ai/ai.types";
import type { RoundDetailApiResponse, ReviewEntity } from "@/services/applications/applications.types";
import type { TranscriptSection, TranscriptUtterance } from "../../pages/round-details.types";
import AiScreeningPanel from "../ai-screening-panel/ai-screening-panel";
import {
  AI_SCREENING_EXTRACTED_FIELDS,
  AI_SCREENING_ROUND_TYPES,
  AI_SCREENING_TERMINAL_STATUSES,
} from "../ai-screening-panel/ai-screening-panel.constants";
import ReviewSection from "./review-section";
import TranscriptPanel from "../transcript-panel/transcript-panel";
import "./normal-round-template.css";

type NormalRoundTemplateProps = {
  data: RoundDetailApiResponse;
  candidateId?: string | null;
  hiringRequestId?: string;
};

const openCandidateCard = (hiringRequestId?: string, candidateId?: string | null) => {
  if (!candidateId || !hiringRequestId) return;
  window.open(`/hiring-requests/${hiringRequestId}/applications?applicant=${candidateId}&view=card`, "_blank");
};

const pickInterviewTypeIcon = (interviewType: string | null | undefined) => {
  const t = interviewType?.toLowerCase() ?? "";
  if (t.includes("tech")) return "bx bx-code-alt";
  if (t.includes("hr")) return "bx bx-user-voice";
  return "bx bx-video";
};

const SPEAKER_LINE = /^(AI|User):\s*(.*)$/i;

const asNullableString = (value: unknown): string | null =>
  typeof value === "string" && value ? value : null;

const asNullableBoolean = (value: unknown): boolean | null =>
  typeof value === "boolean" ? value : null;

const buildStoredScreeningResult = (reviews: ReviewEntity[]): AiScreeningResult | null => {
  const entity = reviews.find((r) => r.entity_type === "ai_screening");
  if (!entity) return null;

  const retryRating = entity.ratings?.find((r) => r.label === "retry_count");
  const retry_count = retryRating ? Math.round(retryRating.score) : 0;

  return {
    screening_call_id: asNullableString(entity.screening_call_id) ?? "",
    call_status: asNullableString(entity.call_status) ?? "",
    result: asNullableString(entity.result),
    availability: asNullableString(entity.availability),
    employment_status: asNullableString(entity.employment_status),
    relevant_experience: asNullableString(entity.relevant_experience),
    current_ctc: asNullableString(entity.current_ctc),
    expected_ctc: asNullableString(entity.expected_ctc),
    notice_period: asNullableString(entity.notice_period),
    location_preference: asNullableString(entity.location_preference),
    communication_quality: asNullableString(entity.communication_quality),
    willingness_to_proceed: asNullableBoolean(entity.willingness_to_proceed),
    summary: asNullableString(entity.summary),
    transcript: asNullableString(entity.transcript),
    call_outcome: asNullableString(entity.call_outcome),
    retry_count,
    created_at: asNullableString(entity.created_at) ?? "",
  };
};

const hasScreeningContent = (result: AiScreeningResult | null | undefined): boolean => {
  if (!result) return false;
  const status = (result.call_status || "").toLowerCase();
  if (AI_SCREENING_TERMINAL_STATUSES.has(status)) return true;
  if (result.summary || (result.transcript ?? "").trim()) return true;
  return (
    AI_SCREENING_EXTRACTED_FIELDS.some((f) => !!result[f.key]) ||
    result.willingness_to_proceed !== null
  );
};

const buildScreeningTranscriptSections = (transcript: string): TranscriptSection[] => {
  const utterances: TranscriptUtterance[] = [];
  for (const line of transcript.split("\n")) {
    const match = SPEAKER_LINE.exec(line.trim());
    if (!match) continue;
    const speaker = match[1].toLowerCase() === "user" ? "CANDIDATE" : "AI";
    const text = match[2].trim();
    if (!text) continue;
    utterances.push({
      id: `u${utterances.length}`,
      speaker,
      text,
    });
  }
  if (utterances.length === 0) {
    utterances.push({
      id: "u0",
      speaker: "CANDIDATE",
      text: transcript.trim(),
    });
  }
  return [{ id: "screening-call", title: "Screening Call", utterances }];
};

const NormalRoundTemplate = ({ data, candidateId, hiringRequestId }: NormalRoundTemplateProps) => {
  const interviewTypeIcon = pickInterviewTypeIcon(data.interview_type);
  const canOpenCandidate = !!(candidateId && hiringRequestId);
  const isAiScreeningRound = !!data.round_type && AI_SCREENING_ROUND_TYPES.has(data.round_type);

  const screeningFlag = data.reviews.find(
    (entity) => entity.entity_type === "ai_screening" && (entity.verdict === "flagged" || entity.flagged === true),
  );
  const flagged = screeningFlag
    ? { flag_reason: typeof screeningFlag.flag_reason === "string" ? screeningFlag.flag_reason : null }
    : null;

  const storedScreening = buildStoredScreeningResult(data.reviews);
  const hasUsableStored = hasScreeningContent(storedScreening);
  const needLivePull = isAiScreeningRound && !flagged && !hasUsableStored;

  const { data: screeningResult, isLoading, isError, isFetching } = useAiScreeningResult(
    hiringRequestId,
    data.candidate_id ?? undefined,
    { poll: true, enabled: needLivePull },
  );

  const screeningSource: AiScreeningResult | undefined =
    hasUsableStored ? (storedScreening ?? undefined) : (screeningResult ?? storedScreening ?? undefined);
  const screeningTranscript = isAiScreeningRound && !flagged && screeningSource?.transcript
    ? buildScreeningTranscriptSections(screeningSource.transcript)
    : null;

  return (
    <div className="nrt-root">
      <header className="nrt-header">
        <h1
          className="nrt-candidate-name"
          onClick={() => openCandidateCard(hiringRequestId, candidateId)}
          style={{ cursor: canOpenCandidate ? "pointer" : "default" }}
        >
          {data.candidate ?? "Candidate"}
        </h1>
        {data.role && <span className="nrt-role-line">{data.role}</span>}
      </header>

      <div className="nrt-grid">
        <div className="nrt-main">
          {isAiScreeningRound && (
            <AiScreeningPanel
              hiringRequestId={hiringRequestId}
              candidateId={data.candidate_id}
              flagged={flagged}
              result={{
                data: screeningSource,
                isLoading: hasUsableStored ? false : isLoading,
                isError: hasUsableStored ? false : isError,
                isFetching: hasUsableStored ? false : isFetching,
              }}
            />
          )}

          {data.reviews.map((entity, i) => (
            <ReviewSection key={i} entity={entity} />
          ))}

          {data.jd_label && (
            <section className="nrt-card">
              <div className="nrt-card-header">
                <i className="bx bx-file" />
                <span>Job Description</span>
              </div>
              <div className="nrt-card-body">
                <ReadMoreText text={data.jd_label} maxLength={300} />
              </div>
            </section>
          )}
        </div>

        <aside className="nrt-sidebar">
          {screeningTranscript && (
            <div className="nrt-transcript">
              <TranscriptPanel sections={screeningTranscript} collapsible={false} showSectionHeader={false} showBadge={false} />
            </div>
          )}

          <section className="nrt-card nrt-overview-card">
            <div className="nrt-card-header">
              <i className="bx bx-info-circle" />
              <span>Interview Overview</span>
            </div>
            <div className="nrt-card-body nrt-overview-body">
              <OverviewItem icon="bx bx-user" label="Candidate" value={data.candidate} />
              <OverviewItem icon="bx bx-user-voice" label="Interviewer" value={data.interviewer} />
              <OverviewItem icon="bx bx-calendar" label="Occurred On" value={toISTDisplay(data.occurred_on)} />
              <OverviewItem icon="bx bx-clock" label="Slot" value={toISTTimeRange(data.slot)} />
              <OverviewItem icon="bx bx-stopwatch" label="Duration" value={data.duration} />
              <OverviewItem icon={interviewTypeIcon} label="Type" value={data.interview_type} />
              {data.status && <OverviewItem icon="bx bx-flag" label="Status" value={data.status} />}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const OverviewItem = ({ icon, label, value }: { icon: string; label: string; value: string | null }) => {
  if (!value) return null;
  return (
    <div className="nrt-overview-row">
      <span className="nrt-overview-label"><i className={icon} /> {label}</span>
      <span className="nrt-overview-value">{value}</span>
    </div>
  );
};

export default NormalRoundTemplate;
