import Skeleton from "@/components/ui/skeleton/skeleton";
import "./normal-round-skeleton.css";

const OVERVIEW_ROWS = 6;
const REVIEW_CARDS = 3;

const NormalRoundSkeleton = () => (
  <div className="nrs-root" aria-hidden="true">
    <header className="nrs-header">
      <Skeleton variant="text" width="200px" height="20px" className="nrs-name" />
      <Skeleton variant="text" width="140px" height="12px" className="nrs-role" />
    </header>

    <div className="nrs-grid">
      <div className="nrs-main">
        {Array.from({ length: REVIEW_CARDS }).map((_, i) => (
          <div className="nrs-card" key={i}>
            <Skeleton variant="rect" width="38%" height="12px" className="nrs-card-title" />
            <Skeleton variant="text" width="100%" height="12px" />
            <Skeleton variant="text" width="92%" height="12px" />
            <Skeleton variant="text" width="64%" height="12px" />
          </div>
        ))}
      </div>

      <aside className="nrs-sidebar">
        <div className="nrs-card">
          <div className="nrs-card-header">
            <Skeleton variant="rect" width="16px" height="16px" borderRadius="4px" />
            <Skeleton variant="text" width="120px" height="10px" />
          </div>
          <div className="nrs-overview-body">
            {Array.from({ length: OVERVIEW_ROWS }).map((_, i) => (
              <div className="nrs-row" key={i}>
                <Skeleton variant="text" width="86px" height="10px" />
                <Skeleton variant="text" width="120px" height="12px" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  </div>
);

export default NormalRoundSkeleton;