import { useApplicantState } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-state";
import ApplicantMenuButton from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-menu-button/applicant-menu-button";
import { usePermissions } from "@/hooks/use-permissions";
import type { Applicant, MenuAction } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import "./candidate-row-actions.css";

type CandidateRowActionsProps = {
  candidate: Applicant;
  isScreening?: boolean;
  onAction: (handlerKey: string, id: string) => void;
  onMenuAction: (action: MenuAction, id: string) => void;
  onViewProfile: (c: Applicant) => void;
  /** Hides the Call Now action — used when a separate Call Now button is rendered. */
  hideCallNow?: boolean;
};

const VARIANT_CLASS: Record<string, string> = {
  shortlist: "shortlist",
  schedule: "shortlist",
  reschedule: "shortlist",
  move: "shortlist",
  call: "screen-btn",
  screen: "screen-btn",
  reject: "reject",
  cancel: "cancel",
};

const CandidateRowActions = ({
  candidate,
  isScreening = false,
  onAction,
  onMenuAction,
  onViewProfile,
  hideCallNow = false,
}: CandidateRowActionsProps) => {
  const stateConfig = useApplicantState(candidate, isScreening);
  const { can } = usePermissions();

  const visibleActions = stateConfig.actions.filter(
    (action) =>
      (!action.permission || can(action.permission)) &&
      !(hideCallNow && action.handler === "onCallNow"),
  );

  return (
    <div className={`cra${visibleActions.length === 0 ? " cra--flattened" : ""}`} onClick={(e) => e.stopPropagation()}>
      {visibleActions.map((action) => (
        <button
          key={action.handler}
          type="button"
          className={`btn ${VARIANT_CLASS[action.variant] ?? "screen-btn"} compact cra-btn`}
          onClick={(e) => { e.stopPropagation(); onAction(action.handler, candidate.id); }}
        >
          {action.icon && <i className={action.icon} />}
          {action.label}
        </button>
      ))}

      {visibleActions.length === 0 ? (
        <button
          type="button"
          className="btn screen-btn compact cra-btn"
          onClick={(e) => { e.stopPropagation(); onViewProfile(candidate); }}
        >
          <i className="bx bx-user" /> View Profile
        </button>
      ) : (
        <ApplicantMenuButton
          menuActions={[]}
          onMenuAction={onMenuAction}
          id={candidate.id}
          onViewProfile={() => onViewProfile(candidate)}
          className="cra-dots"
        />
      )}
    </div>
  );
};

export default CandidateRowActions;