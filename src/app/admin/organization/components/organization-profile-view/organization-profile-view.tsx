import { OrganizationLogoAvatar } from "@/app/admin/organization/components/organization-logo-avatar/organization-logo-avatar";
import {
  ORG_VIEW_EMPTY_VALUE,
  ORG_VIEW_FIELDS,
  ORG_VIEW_READONLY_HINT,
} from "./organization-profile-view.constants";
import type { OrganizationProfileViewProps } from "./organization-profile-view.types";
import "./organization-profile-view.css";

export const OrganizationProfileView = ({ org }: OrganizationProfileViewProps) => {
  return (
    <div className="org-card">
      <div className="org-view-hint">{ORG_VIEW_READONLY_HINT}</div>

      <div className="org-identity">
        <OrganizationLogoAvatar src={org.logo_url} name={org.name} size="lg" />
        <div className="org-identity-text">
          <span className="org-identity-label">Organization Name</span>
          <div className="org-name-readonly">{org.name}</div>
        </div>
      </div>

      <div className="org-view-grid">
        {ORG_VIEW_FIELDS.map((field) => {
          const rawValue = field.getValue(org);
          const value = rawValue && rawValue.trim() !== "" ? rawValue : null;
          return (
            <div
              key={field.key}
              className={`org-view-field${field.fullWidth ? " org-view-field--full" : ""}`}
            >
              <span className="org-view-label">{field.label}</span>
              <span className={`org-view-value${value ? "" : " org-view-value--empty"}`}>
                {value ?? ORG_VIEW_EMPTY_VALUE}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
