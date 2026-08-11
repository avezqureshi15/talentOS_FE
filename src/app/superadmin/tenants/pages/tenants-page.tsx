import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button/button";
import { getTenants, updateTenant, type Tenant } from "@/app/superadmin/tenants/services/tenants.service";
import TenantTable from "@/app/superadmin/tenants/components/tenant-table";
import CreateTenantModal from "@/app/superadmin/tenants/components/create-tenant-modal";
import EditTenantModal from "@/app/superadmin/tenants/components/edit-tenant-modal";
import DeleteTenantDialog from "@/app/superadmin/tenants/components/delete-dialog";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { useCmdPaletteRegistration } from "@/layouts/protected-layouts/components/command-palette/hooks/use-command-palette-registration";

export default function TenantsPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyTenantId, setBusyTenantId] = useState<number | null>(null);
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
    setBusyTenantId(tenant.id);
    try {
      await updateTenant(tenant.id, {
        verification_status: "approved",
      });
      refresh();
    } catch {
      /* ignore */
    } finally {
      setBusyTenantId(null);
    }
  };

  const handleReject = async (tenant: Tenant) => {
    setBusyTenantId(tenant.id);
    try {
      await updateTenant(tenant.id, {
        verification_status: "rejected",
      });
      refresh();
    } catch {
      /* ignore */
    } finally {
      setBusyTenantId(null);
    }
  };

  const handleReactivate = async (tenant: Tenant) => {
    setBusyTenantId(tenant.id);
    try {
      await updateTenant(tenant.id, {
        is_active: true,
      });
      refresh();
    } catch {
      /* ignore */
    } finally {
      setBusyTenantId(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  const handleOpenCreate = useCallback(() => {
    setInviteInfo(null);
    setShowCreateModal(true);
  }, []);

  const cmdPaletteConfig = useMemo(
    () => ({
      placeholder: "Search tenants...",
      sectionTitle: "Tenants",
      search: async (q: string) => {
        if (!q.trim()) return [];
        const { data } = await getTenants({ q, per_page: 10 });
        return data.data.map((t: Tenant) => ({
          id: String(t.id),
          label: t.name,
          sublabel: t.slug,
          type: "tenant" as const,
        }));
      },
      onSelect: (item: { id: string }) => {
        navigate(`/superadmin/tenants/${item.id}`);
      },
    }),
    [navigate],
  );
  useCmdPaletteRegistration(cmdPaletteConfig);

  return (
    <div className="tenants-page">
      <PageHeader
        title="Tenant Management"
        search={{
          placeholder: "Search by name or slug",
          value: search,
          onChange: handleSearch,
        }}
        filters={[
          {
            value: statusFilter,
            onChange: handleStatusFilter,
            options: [
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
            ],
          },
        ]}
        actions={[
          {
            key: "create-tenant",
            label: "Create Tenant",
            variant: "primary",
            onClick: handleOpenCreate,
          },
        ]}
      />

      <div className="tenants-content">
        <TenantTable
          tenants={tenants}
          loading={loading}
          busyTenantId={busyTenantId}
          onEdit={(t) => setEditTenant(t)}
          onSuspend={(t) => setDeleteTarget(t)}
          onApprove={handleApprove}
          onReject={handleReject}
          onReactivate={handleReactivate}
          onRowClick={(t) => navigate(`/superadmin/tenants/${t.id}`)}
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
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(
                    `${window.location.origin}/auth/invite/${inviteInfo.invite_token}`
                  )}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="primary" onClick={() => { setInviteInfo(null); setShowCreateModal(false); }}>
                Done
              </Button>
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
