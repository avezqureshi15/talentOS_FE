import { useCallback, useEffect, useState } from "react";
import { getOrganization, updateOrganization } from "../services/organization.service";
import type { Organization, UpdateOrganizationPayload } from "../services/organization.types";
import { OrganizationProfileView } from "../components/organization-profile-view/organization-profile-view";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import "./organization-page.css";

type FieldErrors = {
  phone?: string;
  address_line1?: string;
};

export default function OrganizationPage() {
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.SETTINGS_EDIT);

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<UpdateOrganizationPayload>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getOrganization()
      .then(({ data }) => {
        setOrg(data);
        setForm({
          logo_url: data.logo_url,
          website: data.website,
          phone: data.phone,
          description: data.description,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          gst_number: data.gst_number,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = useCallback(<K extends keyof UpdateOrganizationPayload>(key: K, value: UpdateOrganizationPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "phone" || key === "address_line1") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, []);

  const handleSave = useCallback(async () => {
    const phone = (form.phone ?? "").trim();
    const addressLine1 = (form.address_line1 ?? "").trim();
    const nextErrors: FieldErrors = {};
    if (!phone) nextErrors.phone = "Phone is required";
    if (!addressLine1) nextErrors.address_line1 = "Address Line 1 is required";
    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setSaved(false);
    try {
      const payload: UpdateOrganizationPayload = {
        ...form,
        phone,
        address_line1: addressLine1,
      };
      const { data } = await updateOrganization(payload);
      setOrg(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save organization details";
      setFormError(msg);
    }
    setSaving(false);
  }, [form]);

  const handleReset = useCallback(() => {
    if (!org) return;
    setFieldErrors({});
    setFormError("");
    setForm({
      logo_url: org.logo_url,
      website: org.website,
      phone: org.phone,
      description: org.description,
      address_line1: org.address_line1,
      address_line2: org.address_line2,
      city: org.city,
      state: org.state,
      postal_code: org.postal_code,
      country: org.country,
      gst_number: org.gst_number,
    });
  }, [org]);

  if (loading) {
    return <div className="org-loading">Loading organization details...</div>;
  }

  return (
    <div className="org-page">
      <PageHeader title="Organization Profile"  />

      {canEdit ? (
      <div className="org-card">
        <div className="org-form-grid">
          <div className="org-field org-field--full">
            <label className="org-label">
              Organization Name
              <span className="org-required" aria-hidden="true">*</span>
            </label>
            <div className="org-name-readonly">{org?.name ?? ""}</div>
          </div>

          <div className="org-field">
            <label className="org-label">Logo URL</label>
            <input
              type="text"
              className="org-input"
              value={form.logo_url ?? ""}
              onChange={(e) => set("logo_url", e.target.value || null)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="org-field">
            <label className="org-label">Website</label>
            <input
              type="text"
              className="org-input"
              value={form.website ?? ""}
              onChange={(e) => set("website", e.target.value || null)}
              placeholder="https://example.com"
            />
          </div>

          <div className="org-field">
            <label className="org-label">
              Phone
              <span className="org-required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              className="org-input"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value || null)}
              placeholder="+1 234 567 890"
            />
            {fieldErrors.phone && <p className="org-field-error">{fieldErrors.phone}</p>}
          </div>

          <div className="org-field">
            <label className="org-label">GST Number</label>
            <input
              type="text"
              className="org-input"
              value={form.gst_number ?? ""}
              onChange={(e) => set("gst_number", e.target.value || null)}
              placeholder="GSTIN"
            />
          </div>

          <div className="org-field org-field--full">
            <label className="org-label">Description</label>
            <textarea
              className="org-input org-textarea"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value || null)}
              placeholder="Brief description of your organization..."
            />
          </div>

          <div className="org-field">
            <label className="org-label">
              Address Line 1
              <span className="org-required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              className="org-input"
              value={form.address_line1 ?? ""}
              onChange={(e) => set("address_line1", e.target.value || null)}
              placeholder="Street address"
            />
            {fieldErrors.address_line1 && <p className="org-field-error">{fieldErrors.address_line1}</p>}
          </div>

          <div className="org-field">
            <label className="org-label">Address Line 2</label>
            <input
              type="text"
              className="org-input"
              value={form.address_line2 ?? ""}
              onChange={(e) => set("address_line2", e.target.value || null)}
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="org-field">
            <label className="org-label">City</label>
            <input
              type="text"
              className="org-input"
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value || null)}
              placeholder="City"
            />
          </div>

          <div className="org-field">
            <label className="org-label">State</label>
            <input
              type="text"
              className="org-input"
              value={form.state ?? ""}
              onChange={(e) => set("state", e.target.value || null)}
              placeholder="State"
            />
          </div>

          <div className="org-field">
            <label className="org-label">Postal Code</label>
            <input
              type="text"
              className="org-input"
              value={form.postal_code ?? ""}
              onChange={(e) => set("postal_code", e.target.value || null)}
              placeholder="ZIP / Postal code"
            />
          </div>

          <div className="org-field">
            <label className="org-label">Country</label>
            <input
              type="text"
              className="org-input"
              value={form.country ?? ""}
              onChange={(e) => set("country", e.target.value || null)}
              placeholder="Country"
            />
          </div>
        </div>

        {formError && <p className="org-form-error">{formError}</p>}

        <div className="org-actions">
          {saved && <span className="org-saved-msg">Saved!</span>}
          <button type="button" className="org-btn org-btn--ghost" onClick={handleReset}>
            Reset
          </button>
          <button
            type="button"
            className="org-btn org-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      ) : org ? (
        <OrganizationProfileView org={org} />
      ) : null}
    </div>
  );
}
