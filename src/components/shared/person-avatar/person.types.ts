export type PersonExtraField = {
  label: string;
  value: string;
  copyable?: boolean;
};

/**
 * Open person model consumed by PersonAvatar / PersonTooltip.
 * All fields except `name` are optional so any data source (UserItem,
 * Employee, Applicant, mock recruiters, mention meta) can be mapped in.
 */
export type Person = {
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  /** arbitrary additional rows rendered under email/phone */
  extraFields?: PersonExtraField[];
  /** override the initials rendered inside the avatar */
  fallbackLabel?: string;
};
