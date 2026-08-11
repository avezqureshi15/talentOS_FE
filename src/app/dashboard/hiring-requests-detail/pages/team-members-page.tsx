import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/app/auth/hooks/use-auth";
import {
  useJobTeam,
  useRemoveTeamMember,
  useUpdateTeamMember,
} from "@/app/dashboard/hiring-requests-detail/components/team-members/use-team-members";
import AddTeamMemberModal from "@/app/dashboard/hiring-requests-detail/components/team-members/add-team-member-modal";
import DataTable from "@/components/ui/data-table/data-table";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import { TEAM_MEMBERS_LABELS, formatRoleLabel } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.constants";
import type { JobTeamMember } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.types";
import "./pages.css";

const TeamMembersPage = () => {
  const { id } = useParams<{ id: string }>();
  const { can } = usePermissions();
  const { user } = useAuth();

  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<JobTeamMember | null>(null);

  const { data: team, isLoading, isError } = useJobTeam(id);
  const updateMutation = useUpdateTeamMember(id ?? "");
  const removeMutation = useRemoveTeamMember(id ?? "");

  const members = team?.data ?? [];
  const busy = updateMutation.isPending || removeMutation.isPending;
  const manageable = can(PERMISSIONS.JOB_TEAM_MANAGE);
  const canAssignOwners = user?.role === "account_admin" || user?.role === "superadmin";

  const teamGridTemplate = manageable ? "2fr 1fr 110px" : "2fr 1fr";

  const teamColumns = [
    {
      header: TEAM_MEMBERS_LABELS.MEMBER_TITLE,
      render: (m: JobTeamMember) => (
        <div className="tm-member-cell">
          <PersonAvatar
            className="tm-avatar"
            person={{ name: m.name, email: m.email }}
          />
          <div className="tm-member-info">
            <TruncatedCell text={m.name} className="tm-member-name" />
            <TruncatedCell text={m.email} className="tm-member-email" />
          </div>
        </div>
      ),
    },
    {
      header: TEAM_MEMBERS_LABELS.ROLE_TITLE,
      render: (m: JobTeamMember) => (
        <TruncatedCell text={formatRoleLabel(m.role)} className="tm-designation" />
      ),
    },
    ...(manageable
      ? [
          {
            header: "",
            className: "tm-actions-cell",
            render: (m: JobTeamMember) => (
              <div className="tm-actions-cell">
                {canAssignOwners && (
                  <button
                    type="button"
                    className="tm-action-btn"
                    title={m.is_owner ? "Remove owner role" : "Make owner"}
                    disabled={busy}
                    onClick={() => handleToggleOwner(m)}
                  >
                    <i className={`bx ${m.is_owner ? "bx-user-x" : "bx-user-check"}`} />
                  </button>
                )}
                <button
                  type="button"
                  className="tm-action-btn tm-action-btn--danger"
                  title="Remove from team"
                  disabled={busy}
                  onClick={() => setRemoveTarget(m)}
                >
                  <i className="bx bx-trash" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

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

          {isLoading ? (
            <DataTable
              columns={teamColumns}
              data={[]}
              loading
              keyExtractor={(m) => m.user_id}
              emptyMessage=""
              gridTemplateColumns={teamGridTemplate}
            />
          ) : isError ? (
            <p className="tm-hint">{TEAM_MEMBERS_LABELS.FAILED}</p>
          ) : members.length === 0 ? (
            <div className="tm-empty">
              <i className="bx bx-group" />
              <p className="tm-empty-title">{TEAM_MEMBERS_LABELS.EMPTY_TITLE}</p>
              <p className="tm-empty-subtitle">{TEAM_MEMBERS_LABELS.EMPTY_SUBTITLE}</p>
            </div>
          ) : (
            <DataTable
              columns={teamColumns}
              data={members}
              keyExtractor={(m) => m.user_id}
              emptyMessage=""
              gridTemplateColumns={teamGridTemplate}
            />
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
