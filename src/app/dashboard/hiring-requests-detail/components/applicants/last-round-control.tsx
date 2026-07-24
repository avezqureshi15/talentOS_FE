import type { ActiveInterview } from "./interview-phase.helpers";
import { useApplicationRounds } from "./hooks/use-application-rounds";
import LastRoundLink from "./last-round-link";
import {
  hasClosedFinalVerdict,
  resolveLastRoundId,
  resolveRoundLinkLabel,
} from "./round-display.helpers";

type LastRoundControlProps = {
  candidateId: number;
  currentRoundId?: string;
  status?: string | null;
  activeInterview?: ActiveInterview | null;
  finalVerdict?: string | null;
  /** Final Verdict / other archive read-only lists. */
  closedPipelineView?: boolean;
  onViewRound: (roundId: string) => void;
};

/**
 * Round Details link: Last round for closed decisions / archive views;
 * otherwise Current vs Last from pipeline status.
 */
const LastRoundControl = ({
  candidateId,
  currentRoundId,
  status,
  activeInterview,
  finalVerdict,
  closedPipelineView = false,
  onViewRound,
}: LastRoundControlProps) => {
  const needsFallback = !currentRoundId;
  const { data: rounds } = useApplicationRounds(candidateId, needsFallback);

  const roundId = resolveLastRoundId(currentRoundId, rounds);
  if (!roundId) return null;

  const label = resolveRoundLinkLabel({
    status,
    activeInterview,
    hasFinalVerdict: hasClosedFinalVerdict(finalVerdict),
    closedPipelineView,
  });

  return (
    <LastRoundLink roundId={roundId} label={label} onViewRound={onViewRound} />
  );
};

export default LastRoundControl;
