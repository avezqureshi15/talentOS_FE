import { PLANNER_KIND_SWITCHER_LABELS } from "./planner-kind-switcher.constants";
import type { PlannerKindSwitcherProps } from "./planner-kind-switcher.types";
import "./planner-kind-switcher.css";

export const PlannerKindSwitcher = ({
  activeKind,
  onKindChange,
}: PlannerKindSwitcherProps) => {
  const labels = PLANNER_KIND_SWITCHER_LABELS;
  return (
    <div className="pks-row">
      <div className="pks-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeKind === "interview"}
          className={`pks-tab${activeKind === "interview" ? " pks-tab--active" : ""}`}
          onClick={() => onKindChange("interview")}
        >
          {labels.INTERVIEW}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeKind === "screening"}
          className={`pks-tab${activeKind === "screening" ? " pks-tab--active" : ""}`}
          onClick={() => onKindChange("screening")}
        >
          {labels.SCREENING}
        </button>
      </div>
      {activeKind === "screening" && (
        <span className="pks-hint">{labels.SCREENING_HINT}</span>
      )}
    </div>
  );
};
