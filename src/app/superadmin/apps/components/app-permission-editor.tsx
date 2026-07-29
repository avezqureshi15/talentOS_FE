import Button from "@/components/ui/button/button";
import type { AppPermissionEditorProps } from "./app-permission-editor.types";
import type { PermissionInfo } from "@/app/superadmin/apps/services/apps.service.types";

const MODULES = [
  { group: "application", label: "Applications", icon: "bx bx-grid-alt" },
  { group: "chat", label: "Chat", icon: "bx bx-message-detail" },
  { group: "hiring_request", label: "Job Listings", icon: "bx bx-briefcase" },
  { group: "review", label: "Reviews", icon: "bx bx-star" },
  { group: "settings", label: "Settings", icon: "bx bx-cog" },
  { group: "slot", label: "Slots", icon: "bx bx-calendar" },
  { group: "tenant", label: "Tenants", icon: "bx bx-building" },
  { group: "user", label: "Users", icon: "bx bx-group" },
];

export default function AppPermissionEditor({
  appName,
  permissions,
  onToggle,
  onSave,
  onCancel,
  saving,
}: AppPermissionEditorProps) {
  const permissionGroups: Record<string, PermissionInfo[]> = {};
  for (const p of permissions) {
    (permissionGroups[p.group] ??= []).push(p);
  }

  const sortedGroups = MODULES
    .filter((m) => permissionGroups[m.group])
    .map((m) => ({ ...m, items: permissionGroups[m.group] }));

  const checkedCount = permissions.filter((p) => p.assigned).length;
  const totalCount = permissions.length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="rpe-root">
      <div className="rpe-summary">
        <div className="rpe-summary-left">
          <div className="rpe-summary-avatar">{appName.charAt(0)}</div>
          <div className="rpe-summary-info">
            <div className="rpe-summary-top">
              <h3 className="rpe-summary-name">{appName}</h3>
              <span className="rpe-summary-badge">
                <i className="bx bx-shield" />
                {checkedCount === totalCount ? "Full Access" : "Custom"}
              </span>
            </div>
            <span className="rpe-summary-meta">
              {checkedCount} of {totalCount} permissions enabled
            </span>
          </div>
        </div>
        <div className="rpe-summary-right">
          <span className="rpe-progress-text">{pct}%</span>
          <div className="rpe-progress-track">
            <div className="rpe-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="rpe-grid">
        {sortedGroups.map(({ group, label, icon, items }) => {
          const groupChecked = items.filter((i) => i.assigned).length;
          const groupTotal = items.length;
          return (
            <div key={group} className="rpe-group">
              <div className="rpe-group-header">
                <span className="rpe-group-label">
                  <i className={icon} />
                  {label}
                </span>
                <span className="rpe-group-count">{groupChecked}/{groupTotal}</span>
              </div>
              <div className="rpe-group-items">
                {items.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    className={`rpe-toggle${p.assigned ? " rpe-toggle--on" : ""}`}
                    onClick={() => onToggle(p.code)}
                  >
                    <span className="rpe-toggle-track">
                      <span className="rpe-toggle-thumb" />
                    </span>
                    <span className="rpe-toggle-label">
                      {p.name}
                      {p.endpoint && <span className="rpe-toggle-endpoint">{p.endpoint}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rpe-sticky-footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onSave} loading={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
