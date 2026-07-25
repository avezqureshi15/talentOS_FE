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
  { group: "application", label: "Applications" },
  { group: "chat", label: "Chat" },
  { group: "hiring_request", label: "Hiring Requests" },
  { group: "review", label: "Reviews" },
  { group: "settings", label: "Settings" },
  { group: "slot", label: "Slots" },
  { group: "tenant", label: "Tenants" },
  { group: "user", label: "Users" },
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

  return (
    <div className="rpe-root">
      <div className="rpe-header">
        <div>
          <h2 className="rpe-role-name">{roleName}</h2>
          <p className="rpe-role-meta">
            {checkedCount} / {permissions.length} permissions
            {userCount !== undefined && ` \u00B7 ${userCount} users`}
          </p>
        </div>
      </div>

      <div className="rpe-grid">
        {sortedGroups.map(({ group, label, items }) => {
          const groupChecked = items.filter((i) => i.assigned).length;
          const groupTotal = items.length;
          return (
            <div key={group} className="rpe-group">
              <div className="rpe-group-header">
                <span className="rpe-group-label">{label}</span>
                <span className="rpe-group-count">
                  {groupChecked}/{groupTotal}
                </span>
              </div>
              <div className="rpe-group-items">
                {items.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    className={`rpe-item${p.assigned ? " rpe-item--on" : ""}`}
                    onClick={() => onToggle(p.code)}
                  >
                    <span className="rpe-item-check">
                      {p.assigned ? <i className="bx bx-check" /> : ""}
                    </span>
                    <span className="rpe-item-label">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rpe-sticky-footer">
        <Button variant="matte" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} loading={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
