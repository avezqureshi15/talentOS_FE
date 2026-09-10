import { AlertTriangle } from "lucide-react";
import { PLANNER_DRAFT_BANNER_LABELS } from "./planner-draft-banner.constants";
import type { PlannerDraftBannerProps } from "./planner-draft-banner.types";
import "./planner-draft-banner.css";

export const PlannerDraftBanner = ({ errors }: PlannerDraftBannerProps) => {
  const labels = PLANNER_DRAFT_BANNER_LABELS;
  return (
    <div className="pdb-banner" role="alert">
      <AlertTriangle size={16} className="pdb-icon" />
      <div className="pdb-content">
        <span className="pdb-title">{labels.TITLE}</span>
        <span className="pdb-body">
          {labels.BODY} {labels.RETRY_HINT}
        </span>
        {errors.length > 0 && (
          <span className="pdb-errors">
            {labels.ERRORS_HEADING}: {errors.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
};
