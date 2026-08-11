import { useState } from "react";
import { useRolesList } from "../hooks/use-roles-list";
import { useRoleDetail } from "../hooks/use-role-detail";
import { RolePermissionEditor } from "../components/role-permission-editor";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { ROLE_DISPLAY } from "@/constants/role-display";
import "./roles-page.css";

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: rolesData, isLoading, error: listError } = useRolesList();
  const { data: roleDetail, isFetching: detailLoading } = useRoleDetail(selectedRole);

  const roleList = rolesData?.roles ?? [];
  const permissions = roleDetail?.permissions ?? [];

  const selectedRoleMeta = roleList.find((r) => r.role_name === selectedRole);

  if (isLoading) {
    return <div className="rp-loading">Loading roles...</div>;
  }

  if (listError) {
    return <div className="rp-loading">Failed to load roles</div>;
  }

  return (
    <div className="rp-root">
      <PageHeader
        title="Role Management"
      />

      <div className="rp-card">
        <div className="rp-body">
          <aside className="rp-sidebar">
            <div className="rp-sidebar-header">
              <span className="rp-sidebar-title">Roles</span>
              <span className="rp-sidebar-count">{roleList.length}</span>
            </div>
            <div className="rp-sidebar-list">
              {roleList.map((role) => {
                const isSelected = selectedRole === role.role_name;
                return (
                  <button
                    key={role.role_name}
                    type="button"
                    className={`rp-role-card${isSelected ? " rp-role-card--active" : ""}`}
                    onClick={() => setSelectedRole(role.role_name)}
                  >
                    <div className="rp-role-card-body">
                      <span className="rp-role-card-name">{ROLE_DISPLAY[role.role_name]?.label ?? role.role_name}</span>
                      <div className="rp-role-card-stats">
                        <span className="rp-role-badge">
                          <i className="bx bx-lock" />
                          {role.permission_count} permissions
                        </span>
                        {role.user_count > 0 && (
                          <span className="rp-role-badge">
                            <i className="bx bx-user" />
                            {role.user_count} user{role.user_count !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="rp-detail">
            {!selectedRole && (
              <div className="rp-empty">
                <span className="rp-empty-icon"><i className="bx bx-left-arrow-alt" /></span>
                <p>Select a role to view its permissions</p>
              </div>
            )}

            {detailLoading && selectedRole && (
              <div className="rp-loading">Loading permissions...</div>
            )}

            {!detailLoading && selectedRole && permissions.length > 0 && (
              <RolePermissionEditor
                roleName={selectedRole}
                permissions={permissions}
                userCount={selectedRoleMeta?.user_count}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}