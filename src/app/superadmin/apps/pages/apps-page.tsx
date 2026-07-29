import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import type { ApiKeyResponse } from "@/app/superadmin/apps/services/apps.service.types";

type ModalState = "none" | "create" | "revoke" | "rotate";

export default function AppsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>("none");
  const [selectedApp, setSelectedApp] = useState<ApiKeyResponse | null>(null);

  const { data, isLoading } = useAppsList(page, search);
  const { mutateAsync: createAppAsync } = useCreateApp();
  const { mutateAsync: revokeAppAsync } = useRevokeApp();
  const { mutateAsync: rotateKeyAsync } = useRotateKey();

  const apps = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
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

  const handleCreate = useCallback(async (body: { name: string; description?: string }) => {
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
    navigate(`/superadmin/apps/${app.id}`);
  }, [navigate]);

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
        <AppsTable
          apps={apps}
          loading={isLoading}
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

      <CreateAppModal open={modal === "create"} onClose={closeModal} onSuccess={handleCreate} />

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
