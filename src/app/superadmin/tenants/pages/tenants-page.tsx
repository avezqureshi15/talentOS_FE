import { useCallback, useEffect, useState, useRef } from "react";
import { getTenants, updateTenant, type Tenant } from "@/app/superadmin/tenants/services/tenants.service";
import TenantTable from "@/app/superadmin/tenants/components/tenant-table";
import CreateTenantModal from "@/app/superadmin/tenants/components/create-tenant-modal";
import EditTenantModal from "@/app/superadmin/tenants/components/edit-tenant-modal";
import DeleteTenantDialog from "@/app/superadmin/tenants/components/delete-dialog";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [inviteInfo, setInviteInfo] = useState<{ admin_email: string; invite_token: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchTenants = useCallback(async (p: number, q: string, s: string) => {
    setLoading(true);
    try {
      const { data } = await getTenants({
        page: p,
        per_page: 20,
        q: q || undefined,
        status: s || undefined,
      });
      setTenants(data.data);
      setTotal(data.total);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTenants(page, search, statusFilter);
  }, [page, search, statusFilter, fetchTenants]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTenants(1, q, statusFilter), 300);
  };

  const handleStatusFilter = (s: string) => {
    setStatusFilter(s);
    setPage(1);
  };

  const refresh = () => fetchTenants(page, search, statusFilter);

  const handleApprove = async (tenant: Tenant) => {
    try {
      await updateTenant(tenant.id, {
        verification_status: "approved",
      });
      refresh();
    } catch {
      /* ignore */
    }
  };

  const handleReject = async (tenant: Tenant) => {
    try {
      await updateTenant(tenant.id, {
        verification_status: "rejected",
      });
      refresh();
    } catch {
      /* ignore */
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="tenants-page">
      <div className="tenants-header">
        <div>
          <h1 className="tenants-title">Tenant Management</h1>
          <p className="tenants-subtitle">Manage organizations, approve signups, and provision new tenants</p>
        </div>
        <button className="tenants-btn tenants-btn--primary" onClick={() => { setInviteInfo(null); setShowCreateModal(true); }}>
          Create Tenant
        </button>
      </div>

      <div className="tenants-filters">
        <div className="tenants-search-bar">
          <span className="bx bx-search tenants-search-icon" />
          <input
            type="text"
            className="tenants-search-input"
            placeholder="Search by name or slug"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select
          className="tenants-status-select"
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="tenants-content">
        <TenantTable
          tenants={tenants}
          loading={loading}
          onEdit={(t) => setEditTenant(t)}
          onDelete={(t) => setDeleteTarget(t)}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {totalPages > 1 && (
          <div className="tenants-pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {showCreateModal && !inviteInfo && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(info) => {
            setInviteInfo(info);
            refresh();
          }}
        />
      )}

      {inviteInfo && (
        <div className="modal-overlay" onClick={() => { setInviteInfo(null); setShowCreateModal(false); }}>
          <div className="modal-content modal-content--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tenant Created</h2>
              <button className="modal-close" onClick={() => { setInviteInfo(null); setShowCreateModal(false); }}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Tenant created successfully. An invite has been sent to:</p>
              <p style={{ fontWeight: 600, marginTop: 8 }}>{inviteInfo.admin_email}</p>
              <div className="tenants-invite-token">
                <label>Invite Link (send to admin):</label>
                <code>{window.location.origin}/auth/invite/{inviteInfo.invite_token}</code>
                <button
                  className="tenants-btn tenants-btn--sm"
                  onClick={() => navigator.clipboard.writeText(
                    `${window.location.origin}/auth/invite/${inviteInfo.invite_token}`
                  )}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn--primary" onClick={() => { setInviteInfo(null); setShowCreateModal(false); }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {editTenant && (
        <EditTenantModal
          tenant={editTenant}
          onClose={() => setEditTenant(null)}
          onSuccess={() => { setEditTenant(null); refresh(); }}
        />
      )}

      {deleteTarget && (
        <DeleteTenantDialog
          tenant={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => { setDeleteTarget(null); refresh(); }}
        />
      )}
    </div>
  );
}
