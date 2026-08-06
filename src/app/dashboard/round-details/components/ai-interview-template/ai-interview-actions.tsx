import { Video, RotateCw } from "lucide-react";
import InterviewLinkChip from "./interview-link-chip";
import type { AiInterviewActionsProps } from "./ai-interview-actions.types";

const AiInterviewActions = ({
  interviewUrl,
  interviewId,
  retrying,
  recordingPending,
  onRetry,
  onOpenRecording,
}: AiInterviewActionsProps) => {
  return (
    <div className="rd-ai-actions">
      <InterviewLinkChip url={interviewUrl} />
      <button
        className="rd-ai-action"
        onClick={onOpenRecording}
        disabled={recordingPending || !interviewId}
      >
        <Video className="rd-ai-action-icon" /> View recording
      </button>
      <button className="rd-ai-action" onClick={onRetry} disabled={retrying}>
        <RotateCw className={`rd-ai-action-icon${retrying ? " rd-ai-action-icon--spin" : ""}`} /> Re-run assessment
      </button>
    </div>
  );
};

export default AiInterviewActions;
