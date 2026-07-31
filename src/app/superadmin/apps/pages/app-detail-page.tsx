import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAppDetail } from "@/app/superadmin/apps/hooks/use-app-detail";
import { useRevokeApp } from "@/app/superadmin/apps/hooks/use-revoke-app";
import { useRotateKey } from "@/app/superadmin/apps/hooks/use-rotate-key";
import { useUpdatePermissions } from "@/app/superadmin/apps/hooks/use-update-permissions";
import AppPermissionEditor from "@/app/superadmin/apps/components/app-permission-editor";
import RevokeAppDialog from "@/app/superadmin/apps/components/revoke-app-dialog";
import RotateKeyDialog from "@/app/superadmin/apps/components/rotate-key-dialog";
import Button from "@/components/ui/button/button";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import "@/app/superadmin/apps/app-detail-page.css";
import type { AppsScope } from "@/app/superadmin/apps/services/apps.service";
import type { PermissionInfo } from "@/app/superadmin/apps/services/apps.service.types";

type Tab = "details" | "permissions";

export default function AppDetailPage({ scope = "superadmin" }: { scope?: AppsScope }) {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const id = Number(appId);
  const appsBasePath = scope === "admin" ? "/admin/apps" : "/superadmin/apps";
  const { data: app, isLoading, error } = useAppDetail(id, scope);
  const { mutateAsync: revokeAppAsync } = useRevokeApp(scope);
  const { mutateAsync: rotateKeyAsync } = useRotateKey(scope);
  const updatePermsMutation = useUpdatePermissions(scope);
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
  const [showRevoke, setShowRevoke] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  
  const [tab, setTab] = useState<Tab>("details");

  useEffect(() => {
    if (app) setPermissions(app.permissions);
  }, [app]);

  const handleToggle = useCallback((code: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.code === code ? { ...p, assigned: !p.assigned } : p)),
    );
  }, []);

  const handleSavePerms = useCallback(() => {
    if (!app) return;
    const codes = permissions.filter((p) => p.assigned).map((p) => p.code);
    updatePermsMutation.mutate({ appId: app.id, body: { permission_codes: codes } });
  }, [app, permissions, updatePermsMutation]);

  const handleRevoke = useCallback(async () => {
    if (!app) return;
    await revokeAppAsync(app.id);
    setShowRevoke(false);
  }, [app, revokeAppAsync]);

  const handleRotate = useCallback(async () => {
    if (!app) throw new Error("No app selected");
    return await rotateKeyAsync(app.id);
  }, [app, rotateKeyAsync]);

  if (isLoading) {
    return (
      <div className="ad-page">
        <div className="ad-skel-tabs">
          <div className="ad-skel ad-skel--tab" />
          <div className="ad-skel ad-skel--tab" />
        </div>
        <div className="ad-skel-content">
          <div className="ad-skel-card">
            <div className="ad-skel-row">
              <div className="ad-skel ad-skel--title" />
              <div className="ad-skel ad-skel--badge" />
            </div>
            <div className="ad-skel ad-skel--text" />
            <div className="ad-skel-grid">
              <div className="ad-skel ad-skel--field" />
              <div className="ad-skel ad-skel--field" />
              <div className="ad-skel ad-skel--field" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="ad-page">
        <button className="ad-back" onClick={() => navigate(appsBasePath)}>
          <ChevronLeft size={14} />Back to Apps
        </button>
        <div className="ad-error">{error instanceof Error ? error.message : "App not found"}</div>
      </div>
    );
  }

  const hasChanges = tab === "permissions" && JSON.stringify(permissions) !== JSON.stringify(app?.permissions);

  return (
    <div className="ad-page">
      <PageHeader
        title="Back to Apps"
        titleIcon="bx bx-chevron-left"
        backRoute={appsBasePath}
        actions={[
          {
            key: "cancel",
            label: "Cancel",
            variant: "outline",
            onClick: () => setPermissions(app.permissions),
            disabled: !hasChanges || updatePermsMutation.isPending,
          },
          {
            key: "save",
            label: "Save Changes",
            variant: "primary",
            onClick: handleSavePerms,
            loading: updatePermsMutation.isPending,
            disabled: !hasChanges,
          },
        ]}
      />

      <div className="ad-tab-bar">
        <button
          className={`ad-tab${tab === "details" ? " ad-tab--active" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          className={`ad-tab${tab === "permissions" ? " ad-tab--active" : ""}`}
          onClick={() => setTab("permissions")}
        >
          Permissions
        </button>
      </div>

      {tab === "details" && (
        <div className="ad-details">
          <div className="ad-details-card">
            <div className="ad-details-top">
              <div className="ad-details-top-left">
                <h1 className="ad-details-name">{app.name}</h1>
                <span className={`ad-badge ad-badge--${app.is_active ? "active" : "inactive"}`}>
                  <span className="ad-badge-dot" />{app.is_active ? "Active" : "Revoked"}
                </span>
              </div>
              <div className="ad-details-top-actions">
                <Button variant="primary" icon="bx bx-rotate-cw" onClick={() => setShowRotate(true)} disabled={!app.is_active}>
                  Rotate Key
                </Button>
                <Button variant="ghost" icon="bx bx-x-circle" onClick={() => setShowRevoke(true)} disabled={!app.is_active}>
                  Revoke
                </Button>
              </div>
            </div>

            {app.description && <p className="ad-details-desc">{app.description}</p>}

            <div className="ad-details-grid">
              <div className="ad-details-field ad-details-field--key">
                <span className="ad-details-label">API Key</span>
                <div className="ad-details-key-row">
                  <code>{app.key_prefix}...</code>
                </div>
              </div>

              <div className="ad-details-field">
                <span className="ad-details-label">Created</span>
                <span className="ad-details-value">{new Date(app.created_at).toLocaleDateString()}</span>
              </div>

              <div className="ad-details-field">
                <span className="ad-details-label">Last Used</span>
                <span className="ad-details-value">
                  {app.last_used_at ? new Date(app.last_used_at).toLocaleDateString() : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "permissions" && (
        <div className="ad-perms-section">
          <AppPermissionEditor
            appName={app.name}
            permissions={permissions}
            onToggle={handleToggle}
            onSave={handleSavePerms}
            onCancel={() => setPermissions(app.permissions)}
            saving={updatePermsMutation.isPending}
          />
        </div>
      )}

      <RevokeAppDialog open={showRevoke} appName={app.name} onClose={() => setShowRevoke(false)} onConfirm={handleRevoke} />
      <RotateKeyDialog open={showRotate} appName={app.name} onClose={() => setShowRotate(false)} onConfirm={handleRotate} />
    </div>
  );
}
