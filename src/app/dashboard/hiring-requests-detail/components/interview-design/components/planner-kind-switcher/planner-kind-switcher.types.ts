import type { PlanKind } from "../../interview-design.types";

export interface PlannerKindSwitcherProps {
  activeKind: PlanKind;
  onKindChange: (kind: PlanKind) => void;
}
