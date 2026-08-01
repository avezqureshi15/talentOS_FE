import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import {
  useJobTeam,
  useRemoveTeamMember,
  useUpdateTeamMember,
} from "@/app/dashboard/hiring-requests-detail/components/team-members/use-team-members";
import TeamMemberRow from "@/app/dashboard/hiring-requests-detail/components/team-members/team-member-row";
import AddTeamMemberModal from "@/app/dashboard/hiring-requests-detail/components/team-members/add-team-member-modal";
import { TEAM_MEMBERS_LABELS } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.constants";
import type { JobTeamMember } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.types";
import "./pages.css";

const TeamMembersPage = () => {
  const { id } = useParams<{ id: string }>();
  const { can } = usePermissions();
  const manageable = can(PERMISSIONS.JOB_TEAM_MANAGE);

  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<JobTeamMember | null>(null);

  const { data: team, isLoading, isError } = useJobTeam(id);
  const updateMutation = useUpdateTeamMember(id ?? "");
  const removeMutation = useRemoveTeamMember(id ?? "");

  const members = team?.data ?? [];

  const handleToggleOwner = (member: JobTeamMember) => {
    if (!id) return;
    updateMutation.mutate({ userId: member.user_id, payload: { is_owner: !member.is_owner } });
  };

  const handleRemove = () => {
    if (!id || !removeTarget) return;
    removeMutation.mutate(removeTarget.user_id, { onSuccess: () => setRemoveTarget(null) });
  };

  return (
    <>
      <ErrorBoundary>
        <div className="tm-page">
          <div className="tm-header-bar">
            <h1 className="tm-heading">{TEAM_MEMBERS_LABELS.PAGE_TITLE}</h1>
            {manageable && (
              <button type="button" className="tm-guide-btn" onClick={() => setAddOpen(true)}>
                <i className="bx bx-user-plus" />
                <span>{TEAM_MEMBERS_LABELS.ADD_MEMBER}</span>
              </button>
            )}
          </div>

          {isLoading && <p className="tm-hint">{TEAM_MEMBERS_LABELS.LOADING}</p>}
          {!isLoading && isError && <p className="tm-hint">{TEAM_MEMBERS_LABELS.FAILED}</p>}
          {!isLoading && !isError && members.length === 0 && (
            <div className="tm-empty">
              <i className="bx bx-group" />
              <p className="tm-empty-title">{TEAM_MEMBERS_LABELS.EMPTY_TITLE}</p>
              <p className="tm-empty-subtitle">{TEAM_MEMBERS_LABELS.EMPTY_SUBTITLE}</p>
            </div>
          )}
          {!isLoading && !isError && members.length > 0 && (
            <div className="tm-table-shell">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>{TEAM_MEMBERS_LABELS.MEMBER_TITLE}</th>
                    <th>{TEAM_MEMBERS_LABELS.ROLE_TITLE}</th>
                    {manageable && <th />}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <TeamMemberRow
                      key={member.user_id}
                      member={member}
                      manageable={manageable}
                      busy={updateMutation.isPending || removeMutation.isPending}
                      onToggleOwner={handleToggleOwner}
                      onRemove={setRemoveTarget}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {id && (
            <AddTeamMemberModal
              open={addOpen}
              onClose={() => setAddOpen(false)}
              hiringRequestId={id}
              existing={members}
            />
          )}

          <BaseModal
            open={!!removeTarget}
            onClose={() => setRemoveTarget(null)}
            title={TEAM_MEMBERS_LABELS.REMOVE_CONFIRM_TITLE}
            icon="bx bx-error-circle"
          >
            <div className="tm-remove-body">
              <p className="tm-remove-text">
                {TEAM_MEMBERS_LABELS.REMOVE_CONFIRM_MESSAGE.replace(
                  "{name}",
                  removeTarget?.name ?? ""
                )}
              </p>
              <div className="tm-remove-actions">
                <Button variant="ghost" onClick={() => setRemoveTarget(null)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRemove}
                  loading={removeMutation.isPending}
                >
                  {removeMutation.isPending ? "Removing..." : "Remove"}
                </Button>
              </div>
            </div>
          </BaseModal>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default TeamMembersPage;
