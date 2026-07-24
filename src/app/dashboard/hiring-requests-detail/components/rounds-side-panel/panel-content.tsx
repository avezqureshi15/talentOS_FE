import RoundInfoSection from "./round-info-section";
import DecisionsReviewsSection from "./decisions-reviews-section";
import { shouldSplitRoundPanel } from "./round-panel-layout.helpers";
import { displayRoundName } from "../applicants/round-display.helpers";
import type { PanelContentProps } from "./rounds-side-panel.types";

const PanelContent = ({ round, hideReviews }: PanelContentProps) => {
  if (!round) return null;

  const split = shouldSplitRoundPanel(round, hideReviews);

  return (
    <div className={`rp-content${split ? " rp-content--split" : ""}`}>
      <span className="rp-badge">{displayRoundName(round.round)}</span>

      <div className="rp-divider" />

      <div className={`rp-layout${split ? " rp-layout--split" : ""}`}>
        <div className="rp-layout__left">
          <RoundInfoSection round={round} />
        </div>

        {split && (
          <div className="rp-layout__right">
            <DecisionsReviewsSection reviews={round.reviews} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelContent;
