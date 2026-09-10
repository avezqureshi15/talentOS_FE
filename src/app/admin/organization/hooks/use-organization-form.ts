import { useCallback, useEffect, useState } from "react";
import { getOrganization, updateOrganization } from "@/app/admin/organization/services/organization.service";
import type {
  Organization,
  UpdateOrganizationPayload,
} from "@/app/admin/organization/services/organization.types";
import {
  ORG_PAGE_ERRORS,
  ORG_SAVED_FLASH_MS,
} from "@/app/admin/organization/pages/organization-page.constants";
import type { OrganizationFieldErrors } from "@/app/admin/organization/pages/organization-page.types";

const formFromOrg = (data: Organization): UpdateOrganizationPayload => ({
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

export function useOrganizationForm() {
  // UI/form state kept here; initial org load preserved via one-time effect (same timing as before).
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<UpdateOrganizationPayload>({});
  const [fieldErrors, setFieldErrors] = useState<OrganizationFieldErrors>({});
  const [formError, setFormError] = useState("");

  // Load organization once on mount — same getOrganization timing as previous page effect.
  useEffect(() => {
    getOrganization()
      .then(({ data }) => {
        setOrg(data);
        setForm(formFromOrg(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setField = useCallback(
    <K extends keyof UpdateOrganizationPayload>(key: K, value: UpdateOrganizationPayload[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key === "phone" || key === "address_line1") {
        const errorKey: keyof OrganizationFieldErrors = key;
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[errorKey];
          return next;
        });
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const phone = (form.phone ?? "").trim();
    const addressLine1 = (form.address_line1 ?? "").trim();
    const nextErrors: OrganizationFieldErrors = {};
    if (!phone) nextErrors.phone = ORG_PAGE_ERRORS.PHONE_REQUIRED;
    if (!addressLine1) nextErrors.address_line1 = ORG_PAGE_ERRORS.ADDRESS_LINE_1_REQUIRED;
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
      setTimeout(() => setSaved(false), ORG_SAVED_FLASH_MS);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ORG_PAGE_ERRORS.SAVE_FALLBACK;
      setFormError(msg);
    }
    setSaving(false);
  }, [form]);

  const handleReset = useCallback(() => {
    if (!org) return;
    setFieldErrors({});
    setFormError("");
    setForm(formFromOrg(org));
  }, [org]);

  return {
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
  };
}
