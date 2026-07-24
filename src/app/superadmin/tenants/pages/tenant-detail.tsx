import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, Mail } from "lucide-react";
import {
  getTenant,
  getTenantUsers,
  resendInvite,
  type Tenant,
  type TenantUser,
} from "@/app/superadmin/tenants/services/tenants.service";
import DataTable from "@/components/ui/data-table/data-table";
import "./tenant-detail.css";

const ROLE_ORDER: Record<string, number> = {
  superadmin: 0,
  admin: 1,
  hr: 2,
  viewer: 3,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TenantDetail() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  const id = Number(tenantId);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTenant(id)
      .then(({ data }) => setTenant(data))
      .catch((err) => setError(err?.response?.data?.detail ?? "Failed to load tenant"))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchUsers = useCallback(
    async (p: number, q: string) => {
      if (!id) return;
      setUsersLoading(true);
      try {
        const { data } = await getTenantUsers(id, {
          page: p,
          per_page: 20,
          q: q || undefined,
        });
        setUsers(data.data);
        setTotal(data.total);
      } catch {
        /* ignore */
      }
      setUsersLoading(false);
    },
    [id],
  );

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleResendInvite = async (email: string) => {
    setResendingEmail(email);
    try {
      await resendInvite(email, id);
      fetchUsers(page, search);
    } catch {
      /* ignore */
    }
    setResendingEmail(null);
  };

  if (loading) {
    return (
      <div className="td-page">
        <div className="td-skel-back" />

        <div className="td-header">
          <div className="td-header-left">
            <div className="td-skel td-skel--title" />
            <div className="td-skel td-skel--slug" />
          </div>
          <div className="td-badges">
            <div className="td-skel td-skel--badge" />
            <div className="td-skel td-skel--badge" />
          </div>
        </div>

        <div className="td-stats">
          {[1, 2, 3].map((i) => (
            <div className="td-stat-card" key={i}>
              <div className="td-skel td-skel--label" />
              <div className="td-skel td-skel--value" />
            </div>
          ))}
        </div>

        <div className="td-skel td-skel--section-title" />

        <div className="td-skel td-skel--search" />

        <div className="td-table-card">
          {[1, 2, 3, 4, 5].map((i) => (
            <div className="td-skel-row" key={i}>
              <div className="td-skel td-skel--avatar" />
              <div className="td-skel-col">
                <div className="td-skel td-skel--name" />
                <div className="td-skel td-skel--email" />
              </div>
              <div className="td-skel td-skel--role" />
              <div className="td-skel td-skel--provider" />
              <div className="td-skel td-skel--date" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="td-page">
        <button className="td-back" onClick={() => navigate("/superadmin/tenants")}>
          <ChevronLeft size={14} />
          Back to Tenants
        </button>
        <div className="td-error">{error || "Tenant not found"}</div>
      </div>
    );
  }

  const statusLabel = tenant.is_active ? "Active" : "Suspended";
  const verificationLabel =
    tenant.verification_status.charAt(0).toUpperCase() +
    tenant.verification_status.slice(1);

  const sortedUsers = [...users].sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99),
  );

  return (
    <div className="td-page">
      <button className="td-back" onClick={() => navigate("/superadmin/tenants")}>
        <ChevronLeft size={14} />
        Back to Tenants
      </button>

      {/* ── Header ── */}
      <div className="td-header">
        <div className="td-header-left">
          <h1 className="td-tenant-name">{tenant.name}</h1>
          <span className="td-tenant-slug">/{tenant.slug}</span>
        </div>
        <div className="td-badges">
          <span className={`td-badge td-badge--${tenant.is_active ? "active" : "inactive"}`}>
            <span className="td-badge-dot" />
            {statusLabel}
          </span>
          <span className={`td-badge td-badge--${tenant.verification_status}`}>
            {verificationLabel}
          </span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="td-stats">
        <div className="td-stat-card">
          <div className="td-stat-label">Users</div>
          <div className="td-stat-value">{tenant.user_count}</div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-label">Created</div>
          <div className="td-stat-value td-stat-value--date">
            {new Date(tenant.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-label">Last Updated</div>
          <div className="td-stat-value td-stat-value--date">
            {new Date(tenant.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* ── Users Section ── */}
      <div className="td-section-header">
        <h2 className="td-section-title">
          Team Members
          <span className="td-section-count">{total}</span>
        </h2>
      </div>

      <div className="td-search">
        <Search size={14} className="td-search-icon" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {users.length === 0 && !usersLoading ? (
        <div className="td-users-empty">
          {search ? "No users match your search" : "No users in this tenant yet"}
        </div>
      ) : (
        <div className="td-table-card">
          <DataTable
            columns={[
              {
                header: "Name",
                render: (u: TenantUser) => (
                  <div className="td-user-cell">
                    <div className="td-user-avatar">
                      {getInitials(u.name)}
                    </div>
                    <div className="td-user-info">
                      <span className="td-user-name">{u.name}</span>
                      <span className="td-user-email">{u.email}</span>
                    </div>
                  </div>
                ),
              },
              {
                header: "Role",
                render: (u: TenantUser) => (
                  <span className={`td-role td-role--${u.role}`}>{u.role}</span>
                ),
              },
              {
                header: "Provider",
                render: (u: TenantUser) => (
                  <span className="td-provider">{u.auth_provider}</span>
                ),
              },
              {
                header: "Joined",
                render: (u: TenantUser) => (
                  <span className="td-date">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                ),
              },
              {
                header: "",
                render: (u: TenantUser) => (
                  <button
                    className="td-action-btn"
                    disabled={resendingEmail === u.email}
                    onClick={() => handleResendInvite(u.email)}
                    title="Resend Invite"
                  >
                    <Mail size={13} />
                    {resendingEmail === u.email ? "Sending..." : "Resend Invite"}
                  </button>
                ),
                style: { width: "140px" },
              },
            ]}
            data={sortedUsers}
            loading={usersLoading}
            keyExtractor={(u) => u.id}
            emptyMessage="No users found"
            gridTemplateColumns="2fr 1fr 1fr 1fr 140px"
          />
        </div>
      )}

      {/* ── Pagination ── */}
      {Math.ceil(total / 20) > 1 && (
        <div className="td-pagination">
          <button
            className="td-pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="td-pagination-info">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="td-pagination-btn"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
