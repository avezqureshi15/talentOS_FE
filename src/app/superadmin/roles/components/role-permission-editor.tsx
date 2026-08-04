import { useState } from "react";
import Button from "@/components/ui/button/button";
import { ROLE_DISPLAY } from "@/constants/role-display";
import PermissionDetailsPanel from "../permission-effects/permission-details-panel";
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
  // "Hiring Requests" renamed to "Job Listings"
  { group: "hiring_request", label: "Job Listings", icon: "bx bx-briefcase" },
  { group: "interview", label: "Interview Plan", icon: "bx bx-clipboard" },
  { group: "job", label: "Job Team", icon: "bx bx-group" },
  { group: "report", label: "Reports", icon: "bx bx-bar-chart-alt-2" },
  { group: "review", label: "Reviews", icon: "bx bx-star" },
  { group: "settings", label: "Settings", icon: "bx bx-cog" },
  { group: "slot", label: "Slots", icon: "bx bx-calendar" },
  { group: "tenant", label: "Tenants", icon: "bx bx-building" },
  { group: "user", label: "Users", icon: "bx bx-user-pin" },
];

const FALLBACK_ICON = "bx bx-lock";

const MODULE_LOOKUP = new Map(MODULES.map((m) => [m.group, m]));

export const RolePermissionEditor = ({
  roleName,
  permissions,
  onToggle,
  onSave,
  onCancel,
  saving,
  userCount,
}: Props) => {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const activePermission =
    permissions.find((p) => p.code === activeCode) ?? null;
  const permissionGroups = permissions.reduce<Record<string, PermissionInfo[]>>((acc, p) => {
    (acc[p.group] ??= []).push(p);
    return acc;
  }, {});

  const groups = Object.keys(permissionGroups).sort(
    (a, b) => MODULE_LOOKUP.has(a) === MODULE_LOOKUP.has(b) ? 0 : (MODULE_LOOKUP.has(a) ? -1 : 1)
  );
  const sortedGroups = groups.map((group) => {
    const meta = MODULE_LOOKUP.get(group);
    return {
      group,
      label: meta?.label ?? group,
      icon: meta?.icon ?? FALLBACK_ICON,
      items: permissionGroups[group],
    };
  });

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
              <h3 className="rpe-summary-name">{ROLE_DISPLAY[roleName]?.label ?? roleName}</h3>
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
                  <div
                    key={p.code}
                    className={`rpe-toggle${p.assigned ? " rpe-toggle--on" : ""}`}
                  >
                    <button
                      type="button"
                      className="rpe-toggle-switch"
                      onClick={() => onToggle(p.code)}
                      aria-pressed={p.assigned}
                      title={p.assigned ? "Disable permission" : "Enable permission"}
                    >
                      <span className="rpe-toggle-track">
                        <span className="rpe-toggle-thumb" />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rpe-toggle-label-btn"
                      onClick={() => setActiveCode(p.code)}
                      title={`What happens when "${p.name}" is disabled`}
                    >
                      {!p.enforced && (
                        <span className="rpe-toggle-dot" title="Not enforced yet — toggling this has no effect" />
                      )}
                      <span className="rpe-toggle-label">{p.name}</span>
                      <i className="bx bx-info-circle" />
                    </button>
                  </div>
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

      <PermissionDetailsPanel
        permission={activePermission}
        assigned={activePermission?.assigned ?? false}
        onClose={() => setActiveCode(null)}
        onNavigate={(code) => setActiveCode(code)}
      />
    </div>
  );
};
