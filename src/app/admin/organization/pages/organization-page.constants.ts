export const ORG_PAGE_LABELS = {
  PAGE_TITLE: "Organization Profile",
  LOADING: "Loading organization details...",
  NAME: "Organization Name",
  LOGO_URL: "Logo URL",
  WEBSITE: "Website",
  PHONE: "Phone",
  GST: "GST Number",
  DESCRIPTION: "Description",
  ADDRESS_LINE_1: "Address Line 1",
  ADDRESS_LINE_2: "Address Line 2",
  CITY: "City",
  STATE: "State",
  POSTAL_CODE: "Postal Code",
  COUNTRY: "Country",
  RESET: "Reset",
  SAVE: "Save Changes",
  SAVING: "Saving...",
  SAVED: "Saved!",
  PLACEHOLDER_LOGO: "https://example.com/logo.png",
  PLACEHOLDER_WEBSITE: "https://example.com",
  PLACEHOLDER_PHONE: "+1 234 567 890",
  PLACEHOLDER_GST: "GSTIN",
  PLACEHOLDER_DESCRIPTION: "Brief description of your organization...",
  PLACEHOLDER_ADDRESS_1: "Street address",
  PLACEHOLDER_ADDRESS_2: "Apartment, suite, etc.",
  PLACEHOLDER_CITY: "City",
  PLACEHOLDER_STATE: "State",
  PLACEHOLDER_POSTAL: "ZIP / Postal code",
  PLACEHOLDER_COUNTRY: "Country",
} as const;

export const ORG_PAGE_ERRORS = {
  PHONE_REQUIRED: "Phone is required",
  ADDRESS_LINE_1_REQUIRED: "Address Line 1 is required",
  SAVE_FALLBACK: "Failed to save organization details",
} as const;

export const ORG_SAVED_FLASH_MS = 2000;
