import type { Organization } from "../../services/organization.types";

export interface OrgViewField {
  key: string;
  label: string;
  fullWidth?: boolean;
  getValue: (org: Organization) => string | null | undefined;
}

export const ORG_VIEW_FIELDS: OrgViewField[] = [
  { key: "website", label: "Website", getValue: (o) => o.website },
  { key: "phone", label: "Phone", getValue: (o) => o.phone },
  { key: "gst_number", label: "GST Number", getValue: (o) => o.gst_number },
  { key: "description", label: "Description", fullWidth: true, getValue: (o) => o.description },
  { key: "address_line1", label: "Address Line 1", getValue: (o) => o.address_line1 },
  { key: "address_line2", label: "Address Line 2", getValue: (o) => o.address_line2 },
  { key: "city", label: "City", getValue: (o) => o.city },
  { key: "state", label: "State", getValue: (o) => o.state },
  { key: "postal_code", label: "Postal Code", getValue: (o) => o.postal_code },
  { key: "country", label: "Country", getValue: (o) => o.country },
];

export const ORG_VIEW_EMPTY_VALUE = "\u2014";

export const ORG_VIEW_READONLY_HINT = "Read-only view. Only account admins can edit the organization profile.";
