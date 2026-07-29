import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTenantDetail } from "../hooks/use-tenant-detail";
import { getTenants, type Tenant } from "../services/tenants.service";
import TenantUserManagement from "../components/tenant-user-management";
import { useCmdPaletteRegistration } from "@/layouts/protected-layouts/components/command-palette/hooks/use-command-palette-registration";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import "./tenant-detail.css";

export default function TenantDetail() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const id = Number(tenantId);
  const { data: tenant, isLoading, error } = useTenantDetail(id);

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

  if (isLoading) {
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
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="td-page">
        <PageHeader title="Back to Tenants" titleIcon="bx bx-chevron-left" backRoute="/superadmin/tenants" />
        <div className="td-error">{error instanceof Error ? error.message : "Tenant not found"}</div>
      </div>
    );
  }

  const verificationLabel =
    tenant.verification_status.charAt(0).toUpperCase() +
    tenant.verification_status.slice(1);

  return (
    <div className="td-page">
      <PageHeader title="Back to Tenants" titleIcon="bx bx-chevron-left" backRoute="/superadmin/tenants" />

      <div className="td-header">
        <div className="td-header-left">
          <h1 className="td-tenant-name">{tenant.name}</h1>
          <span className="td-tenant-slug">/{tenant.slug}</span>
        </div>
        <div className="td-badges">
          <span className={`td-badge td-badge--${tenant.is_active ? "active" : "inactive"}`}>
            <span className="td-badge-dot" />
            {tenant.is_active ? "Active" : "Suspended"}
          </span>
          <span className={`td-badge td-badge--${tenant.verification_status}`}>
            {verificationLabel}
          </span>
        </div>
      </div>

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

      <TenantUserManagement tenantId={id} />

      {(tenant.logo_url || tenant.website || tenant.phone || tenant.description ||
        tenant.address_line1 || tenant.city || tenant.state || tenant.country ||
        tenant.gst_number) && (
        <div className="td-section">
          <h2 className="td-section-title">Organization Details</h2>
          <div className="td-org-grid">
            {tenant.logo_url && (
              <div className="td-org-field">
                <span className="td-org-label">Logo</span>
                <span className="td-org-value">{tenant.logo_url}</span>
              </div>
            )}
            {tenant.website && (
              <div className="td-org-field">
                <span className="td-org-label">Website</span>
                <span className="td-org-value">{tenant.website}</span>
              </div>
            )}
            {tenant.phone && (
              <div className="td-org-field">
                <span className="td-org-label">Phone</span>
                <span className="td-org-value">{tenant.phone}</span>
              </div>
            )}
            {tenant.description && (
              <div className="td-org-field td-org-field--full">
                <span className="td-org-label">Description</span>
                <span className="td-org-value">{tenant.description}</span>
              </div>
            )}
            {tenant.gst_number && (
              <div className="td-org-field">
                <span className="td-org-label">GST Number</span>
                <span className="td-org-value">{tenant.gst_number}</span>
              </div>
            )}
            {tenant.address_line1 && (
              <div className="td-org-field">
                <span className="td-org-label">Address Line 1</span>
                <span className="td-org-value">{tenant.address_line1}</span>
              </div>
            )}
            {tenant.address_line2 && (
              <div className="td-org-field">
                <span className="td-org-label">Address Line 2</span>
                <span className="td-org-value">{tenant.address_line2}</span>
              </div>
            )}
            {tenant.city && (
              <div className="td-org-field">
                <span className="td-org-label">City</span>
                <span className="td-org-value">{tenant.city}</span>
              </div>
            )}
            {tenant.state && (
              <div className="td-org-field">
                <span className="td-org-label">State</span>
                <span className="td-org-value">{tenant.state}</span>
              </div>
            )}
            {tenant.postal_code && (
              <div className="td-org-field">
                <span className="td-org-label">Postal Code</span>
                <span className="td-org-value">{tenant.postal_code}</span>
              </div>
            )}
            {tenant.country && (
              <div className="td-org-field">
                <span className="td-org-label">Country</span>
                <span className="td-org-value">{tenant.country}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
