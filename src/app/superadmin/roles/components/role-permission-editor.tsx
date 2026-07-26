import Button from "@/components/ui/button/button";
import type { PermissionInfo } from "../pages/roles-page.types";

type Props = {
  roleName: string;
  permissions: PermissionInfo[];
  onToggle: (code: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  userCount?: number;
};

const MODULES = [
  { group: "application", label: "Applications", icon: "bx bx-grid-alt" },
  { group: "chat", label: "Chat", icon: "bx bx-message-detail" },
  { group: "hiring_request", label: "Hiring Requests", icon: "bx bx-briefcase" },
  { group: "review", label: "Reviews", icon: "bx bx-star" },
  { group: "settings", label: "Settings", icon: "bx bx-cog" },
  { group: "slot", label: "Slots", icon: "bx bx-calendar" },
  { group: "tenant", label: "Tenants", icon: "bx bx-building" },
  { group: "user", label: "Users", icon: "bx bx-group" },
];

export const RolePermissionEditor = ({
  roleName,
  permissions,
  onToggle,
  onSave,
  onCancel,
  saving,
  userCount,
}: Props) => {
  const permissionGroups = permissions.reduce<Record<string, PermissionInfo[]>>((acc, p) => {
    (acc[p.group] ??= []).push(p);
    return acc;
  }, {});

  const sortedGroups = MODULES
    .filter((m) => permissionGroups[m.group])
    .map((m) => ({ ...m, items: permissionGroups[m.group] }));

  const checkedCount = permissions.filter((p) => p.assigned).length;
  const totalCount = permissions.length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="rpe-root">
      {/* ── Role Summary Card ── */}
      <div className="rpe-summary">
        <div className="rpe-summary-left">
          <div className="rpe-summary-avatar">{roleName.charAt(0)}</div>
          <div className="rpe-summary-info">
            <div className="rpe-summary-top">
              <h3 className="rpe-summary-name">{roleName}</h3>
              <span className="rpe-summary-badge">
                <i className="bx bx-shield" style={{ marginRight: 4, fontSize: 11 }} />
                {checkedCount === totalCount ? "Full Access" : "Custom"}
              </span>
            </div>
            <span className="rpe-summary-meta">
              {userCount !== undefined && `${userCount} user${userCount !== 1 ? "s" : ""} · `}
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

      {/* ── Permissions Grid ── */}
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
                <span className="rpe-group-count">
                  {groupChecked}/{groupTotal}
                </span>
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
                    <span className="rpe-toggle-label">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sticky Footer ── */}
      <div className="rpe-sticky-footer">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} loading={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
