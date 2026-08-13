import { OrganizationLogoAvatar } from "@/app/admin/organization/components/organization-logo-avatar/organization-logo-avatar";
import { OrganizationProfileView } from "@/app/admin/organization/components/organization-profile-view/organization-profile-view";
import { useOrganizationForm } from "@/app/admin/organization/hooks/use-organization-form";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { ORG_PAGE_LABELS } from "./organization-page.constants";
import "./organization-page.css";

export default function OrganizationPage() {
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.SETTINGS_EDIT);
  const {
    org,
    loading,
    saving,
    saved,
    form,
    fieldErrors,
    formError,
    setField,
    handleSave,
    handleReset,
  } = useOrganizationForm();

  if (loading) {
    return <div className="org-loading">{ORG_PAGE_LABELS.LOADING}</div>;
  }

  const orgName = org?.name ?? "";

  return (
    <div className="org-page">
      <PageHeader title={ORG_PAGE_LABELS.PAGE_TITLE} />

      {canEdit ? (
        <div className="org-card">
          <div className="org-identity">
            <OrganizationLogoAvatar src={form.logo_url} name={orgName} size="lg" />
            <div className="org-identity-text">
              <span className="org-identity-label">
                {ORG_PAGE_LABELS.NAME}
                <span className="org-required" aria-hidden="true">
                  *
                </span>
              </span>
              <div className="org-name-readonly">{orgName}</div>
            </div>
          </div>

          <div className="org-form-grid">
            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.LOGO_URL}</label>
              <input
                type="text"
                className="org-input"
                value={form.logo_url ?? ""}
                onChange={(e) => setField("logo_url", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_LOGO}
              />
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.WEBSITE}</label>
              <input
                type="text"
                className="org-input"
                value={form.website ?? ""}
                onChange={(e) => setField("website", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_WEBSITE}
              />
            </div>

            <div className="org-field">
              <label className="org-label">
                {ORG_PAGE_LABELS.PHONE}
                <span className="org-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                className="org-input"
                value={form.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_PHONE}
              />
              {fieldErrors.phone && <p className="org-field-error">{fieldErrors.phone}</p>}
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.GST}</label>
              <input
                type="text"
                className="org-input"
                value={form.gst_number ?? ""}
                onChange={(e) => setField("gst_number", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_GST}
              />
            </div>

            <div className="org-field org-field--full">
              <label className="org-label">{ORG_PAGE_LABELS.DESCRIPTION}</label>
              <textarea
                className="org-input org-textarea"
                value={form.description ?? ""}
                onChange={(e) => setField("description", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_DESCRIPTION}
              />
            </div>

            <div className="org-field">
              <label className="org-label">
                {ORG_PAGE_LABELS.ADDRESS_LINE_1}
                <span className="org-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                className="org-input"
                value={form.address_line1 ?? ""}
                onChange={(e) => setField("address_line1", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_ADDRESS_1}
              />
              {fieldErrors.address_line1 && (
                <p className="org-field-error">{fieldErrors.address_line1}</p>
              )}
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.ADDRESS_LINE_2}</label>
              <input
                type="text"
                className="org-input"
                value={form.address_line2 ?? ""}
                onChange={(e) => setField("address_line2", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_ADDRESS_2}
              />
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.CITY}</label>
              <input
                type="text"
                className="org-input"
                value={form.city ?? ""}
                onChange={(e) => setField("city", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_CITY}
              />
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.STATE}</label>
              <input
                type="text"
                className="org-input"
                value={form.state ?? ""}
                onChange={(e) => setField("state", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_STATE}
              />
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.POSTAL_CODE}</label>
              <input
                type="text"
                className="org-input"
                value={form.postal_code ?? ""}
                onChange={(e) => setField("postal_code", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_POSTAL}
              />
            </div>

            <div className="org-field">
              <label className="org-label">{ORG_PAGE_LABELS.COUNTRY}</label>
              <input
                type="text"
                className="org-input"
                value={form.country ?? ""}
                onChange={(e) => setField("country", e.target.value || null)}
                placeholder={ORG_PAGE_LABELS.PLACEHOLDER_COUNTRY}
              />
            </div>
          </div>

          {formError && <p className="org-form-error">{formError}</p>}

          <div className="org-actions">
            {saved && <span className="org-saved-msg">{ORG_PAGE_LABELS.SAVED}</span>}
            <button type="button" className="org-btn org-btn--ghost" onClick={handleReset}>
              {ORG_PAGE_LABELS.RESET}
            </button>
            <button
              type="button"
              className="org-btn org-btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? ORG_PAGE_LABELS.SAVING : ORG_PAGE_LABELS.SAVE}
            </button>
          </div>
        </div>
      ) : org ? (
        <OrganizationProfileView org={org} />
      ) : null}
    </div>
  );
}
