import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./round-details.css";
import { MOCK_EVALUATION } from "./round-details.constants";
import { fetchRoundDetail } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import AiInterviewTemplate from "../components/ai-interview-template/ai-interview-template";
import NormalRoundTemplate from "../components/normal-round-template/normal-round-template";
import type { RoundDetailsParams, RoundDetailsMode } from "./round-details.types";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const detectMode = (data: RoundDetailApiResponse): RoundDetailsMode => {
  const hasAiReview = data.reviews?.some((r) => r.entity_type === "ai");
  return hasAiReview ? "ai-interview" : "normal-round";
};

function buildMockHeader() {
  const d = MOCK_EVALUATION;
  return {
    title: d.email,
    avatarLabel: getInitials(d.candidateName),
    meta: [
      { label: d.status, variant: "success" as const },
      { label: d.jobTitle },
      { label: d.email },
      { label: "21 Jul, 15:57 IST (1d ago)" },
    ],
    actions: [
      { key: "resume", label: "Resume", icon: "bx-file" },
      { key: "share", label: "Share", icon: "bx-share-alt" },
    ],
  };
}

function buildApiHeader(data: RoundDetailApiResponse) {
  return {
    title: data.candidate ?? "Round Details",
    avatarLabel: data.candidate ? getInitials(data.candidate) : "?",
    meta: [
      ...(data.interview_type ? [{ label: data.interview_type }] : []),
      ...(data.interviewer ? [{ label: data.interviewer }] : []),
      ...(data.occurred_on ? [{ label: data.occurred_on }] : []),
    ].filter(Boolean),
    actions: [
      { key: "resume", label: "Resume", icon: "bx-file" },
      { key: "share", label: "Share", icon: "bx-share-alt" },
    ],
  };
}

const RoundDetails = () => {
  const { id, roundId } = useParams<RoundDetailsParams>();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId],
    queryFn: () => fetchRoundDetail(roundId!),
    enabled: !!roundId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  if (!roundId) {
    return <div className="rd-root" />;
  }

  const mode: RoundDetailsMode = apiData ? detectMode(apiData) : "ai-interview";
  const headerConfig = mode === "ai-interview" ? buildMockHeader() : apiData ? buildApiHeader(apiData) : buildMockHeader();

  return (
    <div className="rd-root">
      <PageHeader {...headerConfig} />

      {isLoading && (
        <div className="rd-split" style={{ alignItems: "center", justifyContent: "center" }}>
          <span className="rd-loading">Loading round details...</span>
        </div>
      )}

      {isError && (
        <div className="rd-split" style={{ alignItems: "center", justifyContent: "center" }}>
          <p className="rd-error">Failed to load round details.</p>
        </div>
      )}

      {!isLoading && mode === "ai-interview" && (
        <AiInterviewTemplate data={MOCK_EVALUATION} />
      )}

      {!isLoading && mode === "normal-round" && apiData && (
        <NormalRoundTemplate data={apiData} candidateId={candidateId} hiringRequestId={id} />
      )}
    </div>
  );
};

export default RoundDetails;
