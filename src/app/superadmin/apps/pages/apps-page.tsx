import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "@/app/superadmin/apps/apps-page.css";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { useAppsList } from "@/app/superadmin/apps/hooks/use-apps-list";
import { useCreateApp } from "@/app/superadmin/apps/hooks/use-create-app";
import { useRevokeApp } from "@/app/superadmin/apps/hooks/use-revoke-app";
import { useRotateKey } from "@/app/superadmin/apps/hooks/use-rotate-key";
import AppsTable from "@/app/superadmin/apps/components/apps-table";
import CreateAppModal from "@/app/superadmin/apps/components/create-app-modal";
import RevokeAppDialog from "@/app/superadmin/apps/components/revoke-app-dialog";
import RotateKeyDialog from "@/app/superadmin/apps/components/rotate-key-dialog";
import { getTenants } from "@/app/superadmin/tenants/services/tenants.service";
import type { AppsScope } from "@/app/superadmin/apps/services/apps.service";
import type { ApiKeyResponse } from "@/app/superadmin/apps/services/apps.service.types";
import type { TenantOption } from "@/app/superadmin/apps/components/create-app-modal.types";

type ModalState = "none" | "create" | "revoke" | "rotate";

export default function AppsPage({ scope = "superadmin" }: { scope?: AppsScope }) {
  const navigate = useNavigate();
  const isSuperadmin = scope === "superadmin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>("none");
  const [selectedApp, setSelectedApp] = useState<ApiKeyResponse | null>(null);

  const { data: tenantsData } = useQuery({
    queryKey: ["superadmin-tenants-options"],
    queryFn: async () => {
      const { data } = await getTenants({ per_page: 100 });
      return data;
    },
    enabled: isSuperadmin,
  });

  const tenants: TenantOption[] = (tenantsData?.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
  }));

  const { data, isLoading } = useAppsList(page, search, tenantId, scope);
  const { mutateAsync: createAppAsync } = useCreateApp(scope);
  const { mutateAsync: revokeAppAsync } = useRevokeApp(scope);
  const { mutateAsync: rotateKeyAsync } = useRotateKey(scope);

  const apps = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleTenantChange = useCallback((value: string) => {
    setTenantId(value === "" ? null : Number(value));
    setPage(1);
  }, []);

  const openModal = useCallback((state: ModalState, app?: ApiKeyResponse) => {
    setSelectedApp(app ?? null);
    setModal(state);
  }, []);

  const closeModal = useCallback(() => {
    setModal("none");
    setSelectedApp(null);
  }, []);

  const handleCreate = useCallback(async (body: { name: string; description?: string; tenant_id?: number | null }) => {
    return await createAppAsync(body);
  }, [createAppAsync]);

  const handleRevoke = useCallback(async () => {
    if (!selectedApp) return;
    await revokeAppAsync(selectedApp.id);
    closeModal();
  }, [selectedApp, revokeAppAsync, closeModal]);

  const handleRotate = useCallback(async () => {
    if (!selectedApp) throw new Error("No app selected");
    return await rotateKeyAsync(selectedApp.id);
  }, [selectedApp, rotateKeyAsync]);

  const handleRowClick = useCallback((app: ApiKeyResponse) => {
    navigate(`${scope === "admin" ? "/admin" : "/superadmin"}/apps/${app.id}`);
  }, [navigate, scope]);

  return (
    <div className="ap-page">
      <PageHeader
        title="App Management"
        search={{
          placeholder: "Search apps...",
          value: search,
          onChange: handleSearch,
        }}
        actions={[
          {
            key: "create-app",
            label: "Create App",
            variant: "primary",
            onClick: () => openModal("create"),
          },
        ]}
      />

      <div className="ap-content">
        {isSuperadmin && (
          <div className="ap-filter-bar">
            <label htmlFor="ap-tenant-filter">Tenant</label>
            <select id="ap-tenant-filter" value={tenantId ?? ""} onChange={(e) => handleTenantChange(e.target.value)}>
              <option value="">All tenants</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        <AppsTable
          apps={apps}
          loading={isLoading}
          showTenant={isSuperadmin}
          onRevoke={(app) => openModal("revoke", app)}
          onRotate={(app) => openModal("rotate", app)}
          onRowClick={handleRowClick}
        />

        {totalPages > 1 && (
          <div className="ap-pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        )}
      </div>

      <CreateAppModal
        open={modal === "create"}
        onClose={closeModal}
        onSuccess={handleCreate}
        tenants={isSuperadmin ? tenants : undefined}
      />

      {selectedApp && (
        <>
          <RevokeAppDialog
            open={modal === "revoke"}
            appName={selectedApp.name}
            onClose={closeModal}
            onConfirm={handleRevoke}
          />

          <RotateKeyDialog
            open={modal === "rotate"}
            appName={selectedApp.name}
            onClose={closeModal}
            onConfirm={handleRotate}
          />
        </>
      )}
    </div>
  );
}
