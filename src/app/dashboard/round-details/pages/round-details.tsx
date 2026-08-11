import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import "./round-details.css";
import { fetchRoundDetail } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { toISTDisplay } from "@/utils/date";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { useHeaderShare } from "@/layouts/protected-layouts/components/header/hooks/use-header-share";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import AiInterviewTemplate from "../components/ai-interview-template/ai-interview-template";
import NormalRoundTemplate from "../components/normal-round-template/normal-round-template";
import { useAiInterviews } from "@/hooks/use-ai-interviews";
import { useAiInterviewTemplate } from "@/hooks/use-ai-interview-template";
import type { RoundDetailsParams, RoundDetailsMode } from "./round-details.types";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const detectMode = (data: RoundDetailApiResponse): RoundDetailsMode => {
  if (data.round_type === "AI_INTERVIEW" || data.round_type === "AI_INTERVIEW_ROUND") return "ai-interview";
  return "normal-round";
};

function buildApiHeader(
  data: RoundDetailApiResponse,
  handlers: { onResume: () => void; onShare: () => void; onBack: () => void },
) {
  return {
    title: data.candidate ?? "Round Details",
    avatarLabel: data.candidate ? getInitials(data.candidate) : "?",
    meta: [
      ...(data.round_type ? [{ label: data.round_type }] : data.interview_type ? [{ label: data.interview_type }] : []),
      ...(data.interviewer ? [{ label: data.interviewer }] : []),
      ...(data.occurred_on ? [{ label: toISTDisplay(data.occurred_on) }] : []),
    ].filter(Boolean),
    onBack: handlers.onBack,
    actions: [
      { key: "resume", label: "Resume", icon: "bx-file", onClick: handlers.onResume },
      { key: "share", label: "Share", icon: "bx-share-alt", onClick: handlers.onShare },
    ],
  };
}

const RoundDetails = () => {
  const { id, roundId } = useParams<RoundDetailsParams>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateIdParam = searchParams.get("candidateId");
  const { handleShare } = useHeaderShare();

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId],
    queryFn: () => fetchRoundDetail(roundId!),
    enabled: !!roundId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const onResume = useCallback(() => {
    const url = apiData?.resume_url?.trim();
    if (!url) {
      useToastStore.getState().addToast("No resume available", ToastType.ERROR);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [apiData?.resume_url]);

  const onShare = useCallback(async () => {
    const ok = await handleShare();
    if (ok) {
      useToastStore.getState().addToast("Link copied to clipboard", ToastType.SUCCESS);
    } else {
      useToastStore.getState().addToast("Unable to copy link", ToastType.ERROR);
    }
  }, [handleShare]);

  const onBack = useCallback(() => {
    if (id) {
      navigate(`/hiring-requests/${id}/applications`);
      return;
    }
    navigate(-1);
  }, [id, navigate]);

  const mode: RoundDetailsMode | null = apiData ? detectMode(apiData) : null;
  const isAiInterviewMode = mode === "ai-interview";

  const urlCandidateId = candidateIdParam ? Number(candidateIdParam) : undefined;
  const candidateIdNum =
    apiData?.candidate_id ??
    (urlCandidateId !== undefined && Number.isFinite(urlCandidateId) ? urlCandidateId : undefined);
  const hasCandidate = candidateIdNum !== undefined && Number.isFinite(candidateIdNum);

  const { data: interviews } = useAiInterviews(
    isAiInterviewMode && hasCandidate ? id : undefined,
    isAiInterviewMode && hasCandidate ? candidateIdNum : undefined,
  );
  const interviewId = interviews && interviews.length > 0 ? interviews[0].id : undefined;

  const { data: interviewTemplate, isLoading: interviewLoading, isError: interviewError } = useAiInterviewTemplate(
    isAiInterviewMode ? id : undefined,
    isAiInterviewMode && hasCandidate ? candidateIdNum : undefined,
    isAiInterviewMode ? interviewId : undefined,
    { poll: true },
  );

  if (!roundId) {
    return <div className="rd-root" />;
  }

  const headerConfig = apiData
    ? buildApiHeader(apiData, { onResume, onShare, onBack })
    : null;

  return (
    <div className="rd-root">
      {headerConfig && <PageHeader {...headerConfig} />}

      {isLoading && (
        <div className="rd-split rd-center-row">
          <LoadingSpinner size="md" />
        </div>
      )}

      {isError && (
        <div className="rd-split rd-center-row">
          <p className="rd-error">Failed to load round details.</p>
        </div>
      )}

      {!isLoading && isAiInterviewMode && (
        interviewLoading || !interviewTemplate ? (
          <div className="rd-split rd-center-row">
            <LoadingSpinner size="md" />
          </div>
        ) : interviewError ? (
          <div className="rd-split rd-center-row">
            <p className="rd-error">Failed to load interview assessment.</p>
          </div>
        ) : (
          <AiInterviewTemplate
            data={interviewTemplate}
            hiringRequestId={id}
            candidateId={candidateIdNum}
          />
        )
      )}

      {!isLoading && mode === "normal-round" && apiData && (
        <NormalRoundTemplate data={apiData} candidateId={candidateIdParam} hiringRequestId={id} />
      )}
    </div>
  );
};

export default RoundDetails;
