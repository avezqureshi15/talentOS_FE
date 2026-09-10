import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getInvites, type AdminUser, type Invite } from "@/app/admin/users/services/users-admin.service";
import UserTable from "@/app/admin/users/components/user-table";
import InvitesTable from "@/app/admin/users/components/invites-table";
import InviteUserModal from "@/app/admin/users/components/invite-user-modal/invite-user-modal";
import CreateUserModal from "@/app/admin/users/components/create-user-modal";
import EditUserModal from "@/app/admin/users/components/edit-user-modal/edit-user-modal";
import DeactivateDialog from "@/app/admin/users/components/deactivate-dialog";
import type { Tab } from "./users-page.types";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import {
  HEADER_REFRESH_ICON,
  HEADER_REFRESH_LABEL,
} from "@/layouts/protected-layouts/components/header/header.constants";
import SearchInput from "@/components/ui/search-input/search-input";
import "./users-page.css";

export default function UsersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("active");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [total, setTotal] = useState(0);
  const [inviteTotal, setInviteTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [invitePage, setInvitePage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadUsers = (p: number, q: string) => {
    setLoading(true);
    getUsers({ page: p, per_page: 20, q: q || undefined })
      .then(({ data }) => {
        setUsers(data.data);
        setTotal(data.total);
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  };

  const loadInvites = (p: number) => {
    setInviteLoading(true);
    getInvites({ page: p, per_page: 20 })
      .then(({ data }) => {
        setInvites(data.data);
        setInviteTotal(data.total);
      })
      .catch(() => { /* ignore */ })
      .finally(() => setInviteLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUsers({ page, per_page: 20, q: search || undefined })
      .then(({ data }) => {
        if (!cancelled) {
          setUsers(data.data);
          setTotal(data.total);
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search]);

  useEffect(() => {
    let cancelled = false;
    setInviteLoading(true);
    getInvites({ page: invitePage, per_page: 20 })
      .then(({ data }) => {
        if (!cancelled) {
          setInvites(data.data);
          setInviteTotal(data.total);
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => {
        if (!cancelled) setInviteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [invitePage]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadUsers(1, q), 300);
  };

  const refreshUsers = () => loadUsers(page, search);
  const refreshInvites = () => loadInvites(invitePage);
  const refreshAll = () => {
    loadUsers(page, search);
    loadInvites(invitePage);
  };

  const isRefreshing = loading || inviteLoading;
  const totalPages = Math.ceil(total / 20);
  const inviteTotalPages = Math.ceil(inviteTotal / 20);

  return (
    <div className="users-page">
      <PageHeader
        title="User Management"
        actions={[
          {
            key: "refresh",
            label: HEADER_REFRESH_LABEL,
            icon: isRefreshing ? "bx bx-loader-alt bx-spin" : HEADER_REFRESH_ICON,
            variant: "primary",
            disabled: isRefreshing,
            onClick: refreshAll,
          },
          {
            key: "invite-user",
            label: "Invite User",
            variant: "primary",
            onClick: () => setShowInviteModal(true),
          },
          // {
          //   key: "create-user",
          //   label: "Create User",
          //   variant: "outline",
          //   onClick: () => setShowCreateModal(true),
          // },
        ]}
      />

      <div className="users-tabs">
        <button
          className={`users-tab ${tab === "active" ? "users-tab--active" : ""}`}
          onClick={() => setTab("active")}
        >
          Active Users {total > 0 && <span className="users-tab-count">{total}</span>}
        </button>
        <button
          className={`users-tab ${tab === "invites" ? "users-tab--active" : ""}`}
          onClick={() => setTab("invites")}
        >
          Pending Invites {inviteTotal > 0 && <span className="users-tab-count">{inviteTotal}</span>}
        </button>
      </div>

      {tab === "active" && (
        <SearchInput
          className="users-search"
          placeholder="Search users by name or email"
          value={search}
          onChange={handleSearch}
        />
      )}

      <div className="users-content">
        {tab === "active" ? (
          <>
            <UserTable
              users={users}
              loading={loading}
              onEdit={(u) => setEditUser(u)}
              onDeactivate={(u) => setDeactivateTarget(u)}
              onViewJobs={(u) => navigate(`/admin/users/${u.id}`)}
            />
            {totalPages > 1 && (
              <div className="users-pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        ) : (
          <>
            <InvitesTable
              invites={invites}
              loading={inviteLoading}
              onRevoke={(id) => {
                import("@/app/admin/users/services/users-admin.service").then((m) =>
                  m.revokeInvite(id).then(refreshInvites)
                );
              }}
            />
            {inviteTotalPages > 1 && (
              <div className="users-pagination">
                <button disabled={invitePage <= 1} onClick={() => setInvitePage((p) => p - 1)}>Previous</button>
                <span>Page {invitePage} of {inviteTotalPages}</span>
                <button disabled={invitePage >= inviteTotalPages} onClick={() => setInvitePage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => { setShowInviteModal(false); refreshInvites(); }}
          mode="existing-and-email"
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); refreshUsers(); }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => { setEditUser(null); refreshUsers(); }}
        />
      )}

      {deactivateTarget && (
        <DeactivateDialog
          user={deactivateTarget}
          onClose={() => setDeactivateTarget(null)}
          onSuccess={() => { setDeactivateTarget(null); refreshUsers(); }}
        />
      )}
    </div>
  );
}
