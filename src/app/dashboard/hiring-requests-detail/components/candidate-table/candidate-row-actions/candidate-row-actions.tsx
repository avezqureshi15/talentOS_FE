import { useApplicantState } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-state";
import { resolveTableRowActions } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/resolve-row-actions";
import ApplicantMenuButton from "@/app/dashboard/hiring-requests-detail/components/applicants/applicant-menu-button/applicant-menu-button";
import { MENU_ACTION_PERMISSIONS } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.constants";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import type { Applicant, MenuAction } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import "./candidate-row-actions.css";

type CandidateRowActionsProps = {
  candidate: Applicant;
  isScreening?: boolean;
  onAction: (handlerKey: string, id: string) => void;
  onMenuAction: (action: MenuAction, id: string) => void;
  onEditDetails?: (candidate: Applicant) => void;
  onTimeline?: (c: Applicant) => void;
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
  onEditDetails,
  onTimeline,
  hideCallNow = false,
}: CandidateRowActionsProps) => {
  const stateConfig = useApplicantState(candidate, isScreening);
  const { can } = usePermissions();
  const canEditDetails = !!onEditDetails && can(PERMISSIONS.APPLICATION_EVALUATE);
  const permitted = {
    ...stateConfig,
    actions: stateConfig.actions.filter((action) => !action.permission || can(action.permission)),
    menuActions: stateConfig.menuActions.filter((action) => can(MENU_ACTION_PERMISSIONS[action])),
  };
  const { primary, secondary, tertiary, overflowActions, menuActions } = resolveTableRowActions(permitted, { hideCallNow });
  const visibleMenuActions = menuActions.filter((action) => can(MENU_ACTION_PERMISSIONS[action]));

  const renderAction = (action: typeof primary, iconOnly: boolean) =>
    action && (
      <button
        type="button"
        className={`btn ${VARIANT_CLASS[action.variant] ?? "screen-btn"} compact cra-btn${iconOnly ? " cra-btn--icon" : ""}`}
        title={action.label}
        aria-label={action.label}
        onClick={(e) => { e.stopPropagation(); onAction(action.handler, candidate.id); }}
      >
        {action.icon && <i className={action.icon} />}
        {!iconOnly && action.label}
      </button>
    );

  return (
    <div className="cra" onClick={(e) => e.stopPropagation()}>
      {renderAction(primary, false)}
      {renderAction(secondary, secondary?.variant === "reject")}
      {renderAction(tertiary, tertiary?.variant === "reject")}
      <ApplicantMenuButton
        menuActions={visibleMenuActions}
        onMenuAction={onMenuAction}
        id={candidate.id}
        extraItems={[
          ...(canEditDetails
            ? [{ key: "edit_details", label: "Edit details", icon: "bx-edit-alt", onSelect: () => onEditDetails?.(candidate) }]
            : []),
          ...overflowActions.map((action) => ({
            key: action.handler,
            label: action.label,
            icon: action.icon.replace(/^bx\s+/, ""),
            onSelect: () => onAction(action.handler, candidate.id),
          })),
          ...(onTimeline
            ? [{ key: "timeline", label: "Timeline", icon: "bx-clock", onSelect: () => onTimeline(candidate) }]
            : []),
        ]}
        className="cra-dots"
      />
    </div>
  );
};

export default CandidateRowActions;
