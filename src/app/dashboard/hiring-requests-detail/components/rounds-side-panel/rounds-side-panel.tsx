import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import PanelSkeleton from "./panel-skeleton";
import PanelContent from "./panel-content";
import { useRoundDetail } from "./use-round-detail";
import { shouldSplitRoundPanel } from "./round-panel-layout.helpers";
import type { RoundsSidePanelProps } from "./rounds-side-panel.types";
import { ROUNDS_PANEL_LABELS, ROUNDS_PANEL_STATUS } from "./rounds-side-panel.constants";
import "./rounds-side-panel.css";

const RoundsSidePanel = ({ open, roundId, onClose, hideReviews }: RoundsSidePanelProps) => {
  const { data: round, isLoading, isFetching, isError, refetch } = useRoundDetail(roundId);
  const wide = shouldSplitRoundPanel(round, hideReviews);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={ROUNDS_PANEL_LABELS.TITLE}
      variant="centered"
      className={`rp-modal${wide ? " rp-modal--wide" : ""}`}
    >
      {isLoading && <PanelSkeleton />}
      {isError && (
        <div className="rp-status rp-status--error">
          <p>{ROUNDS_PANEL_STATUS.ERROR}</p>
          <Button className="action-link action-link-btn" onClick={() => refetch()} loading={isFetching}>
            {ROUNDS_PANEL_STATUS.RETRY}
          </Button>
        </div>
      )}
      {round && <PanelContent round={round} hideReviews={hideReviews} />}
    </BaseModal>
  );
};

export default RoundsSidePanel;
