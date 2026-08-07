import ReadMoreText from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/read-more-text";
import { toISTDisplay, toISTTimeRange } from "@/utils/date";
import { useAiScreeningResult } from "@/hooks/use-ai-screening";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import type { TranscriptSection, TranscriptUtterance } from "../../pages/round-details.types";
import AiScreeningPanel from "../ai-screening-panel/ai-screening-panel";
import { AI_SCREENING_ROUND_TYPES } from "../ai-screening-panel/ai-screening-panel.constants";
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

  const { data: screeningResult, isLoading, isError, isFetching } = useAiScreeningResult(
    hiringRequestId,
    data.candidate_id ?? undefined,
    { poll: true, enabled: isAiScreeningRound && !flagged },
  );
  const screeningTranscript = isAiScreeningRound && !flagged && screeningResult?.transcript
    ? buildScreeningTranscriptSections(screeningResult.transcript)
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
              result={{ data: screeningResult, isLoading, isError, isFetching }}
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
          <section className="nrt-card">
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

          {screeningTranscript && (
            <div className="nrt-transcript">
              <TranscriptPanel sections={screeningTranscript} collapsible={false} showSectionHeader={false} showBadge={false} />
            </div>
          )}
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
