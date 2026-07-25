import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/button/button";
import UserTable from "@/app/admin/users/components/user-table";
import InvitesTable from "@/app/admin/users/components/invites-table";
import InviteUserModal from "@/app/admin/users/components/invite-user-modal";
import CreateUserModal from "@/app/admin/users/components/create-user-modal";
import EditUserModal from "@/app/admin/users/components/edit-user-modal";
import DeactivateDialog from "@/app/admin/users/components/deactivate-dialog";
import { useTenantUsers } from "../hooks/use-tenant-users";
import { useTenantInvites } from "../hooks/use-tenant-invites";
import { useRevokeInvite } from "../hooks/use-revoke-invite";
import { QUERY_KEYS } from "@/constants/constants";
import type { AdminUser } from "@/app/admin/users/services/users-admin.service";

type Props = {
  tenantId: number;
};

type Tab = "active" | "invites";

export default function TenantUserManagement({ tenantId }: Props) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("active");
  const [page, setPage] = useState(1);
  const [invitePage, setInvitePage] = useState(1);
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);

  const { data: usersData, isLoading: usersLoading } = useTenantUsers(tenantId, page, search);
  const { data: invitesData, isLoading: inviteLoading } = useTenantInvites(tenantId, invitePage);
  const revokeMutation = useRevokeInvite(tenantId);

  const users = usersData?.data ?? [];
  const total = usersData?.total ?? 0;
  const invites = invitesData?.data ?? [];
  const inviteTotal = invitesData?.total ?? 0;

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANT_USERS, tenantId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANT_INVITES, tenantId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANT, tenantId] });
  }, [queryClient, tenantId]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / 20);
  const inviteTotalPages = Math.ceil(inviteTotal / 20);

  return (
    <>
      <div className="td-section-header">
        <h2 className="td-section-title">
          {tab === "active" ? "Active Users" : "Pending Invites"}
          <span className="td-section-count">{tab === "active" ? total : inviteTotal}</span>
        </h2>
        <div className="td-users-actions">
          <Button variant="primary" onClick={() => setShowInviteModal(true)}>Invite User</Button>
          <Button variant="secondary" onClick={() => setShowCreateModal(true)}>Create User</Button>
        </div>
      </div>

      <div className="td-users-tabs">
        <button
          className={`td-users-tab${tab === "active" ? " td-users-tab--active" : ""}`}
          onClick={() => setTab("active")}
        >
          Active Users
        </button>
        <button
          className={`td-users-tab${tab === "invites" ? " td-users-tab--active" : ""}`}
          onClick={() => setTab("invites")}
        >
          Pending Invites
        </button>
      </div>

      {tab === "active" && (
        <div className="td-search">
          <span className="bx bx-search td-search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      <div className="td-users-content">
        {tab === "active" ? (
          <>
            <div className="td-table-card">
              <UserTable
                users={users}
                loading={usersLoading}
                onEdit={(u) => setEditUser(u)}
                onDeactivate={(u) => setDeactivateTarget(u)}
              />
            </div>
            {totalPages > 1 && (
              <div className="td-pagination">
                <button className="td-pagination-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                <span className="td-pagination-info">Page {page} of {totalPages}</span>
                <button className="td-pagination-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="td-table-card">
              <InvitesTable
                invites={invites}
                loading={inviteLoading}
                onRevoke={(invId) => revokeMutation.mutate(invId)}
              />
            </div>
            {inviteTotalPages > 1 && (
              <div className="td-pagination">
                <button className="td-pagination-btn" disabled={invitePage <= 1} onClick={() => setInvitePage((p) => p - 1)}>Previous</button>
                <span className="td-pagination-info">Page {invitePage} of {inviteTotalPages}</span>
                <button className="td-pagination-btn" disabled={invitePage >= inviteTotalPages} onClick={() => setInvitePage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {showInviteModal && (
        <InviteUserModal
          tenantId={tenantId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => { setShowInviteModal(false); refreshData(); }}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          tenantId={tenantId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); refreshData(); }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          tenantId={tenantId}
          onClose={() => setEditUser(null)}
          onSuccess={() => { setEditUser(null); refreshData(); }}
        />
      )}

      {deactivateTarget && (
        <DeactivateDialog
          user={deactivateTarget}
          tenantId={tenantId}
          onClose={() => setDeactivateTarget(null)}
          onSuccess={() => { setDeactivateTarget(null); refreshData(); }}
        />
      )}
    </>
  );
}
