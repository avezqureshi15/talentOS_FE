export type AiInterviewActionsProps = {
  interviewUrl: string | null | undefined;
  interviewId: string | undefined;
  retrying: boolean;
  recordingPending: boolean;
  onRetry: () => void;
  onOpenRecording: () => void;
};
