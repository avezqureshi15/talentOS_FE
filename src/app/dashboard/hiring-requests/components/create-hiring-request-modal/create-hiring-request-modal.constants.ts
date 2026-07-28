export const CREATE_HR_MODAL = {
  TITLE: "Create Hiring Request",
  ICON: "bx-briefcase",
  CANCEL: "Cancel",
  SUBMIT: "Create",
  SUBMITTING: "Creating...",
  SUCCESS: "Hiring request created",
  HINT: "Required fields are marked with *",
  ACTIVE_LABEL: "Active listing",
  ACTIVE_HINT: "On by default — untick to keep the listing inactive",
} as const;

export const CREATE_HR_LOCATION_PRESETS = [
  "Remote",
  "Bangalore",
  "Mumbai",
  "Hyderabad",
] as const;

export const CREATE_HR_FIELDS = {
  title: {
    label: "Title",
    placeholder: "e.g. Senior Backend Engineer",
    required: true,
    maxLength: 255,
  },
  department: {
    label: "Department",
    placeholder: "Select department",
    required: true,
    maxLength: 255,
  },
  location: {
    label: "Location",
    placeholder: "Select or type a location",
    required: true,
    maxLength: 255,
    listId: "create-hr-location-list",
  },
  type: {
    label: "Type",
    placeholder: "Select type",
    required: true,
    maxLength: 100,
  },
  description: {
    label: "Description",
    placeholder: "Role overview, responsibilities, and context…",
    required: true,
  },
  requirements: {
    label: "Requirements",
    placeholder: "One requirement per line (optional)",
    required: false,
  },
  benefits: {
    label: "Benefits",
    placeholder: "One benefit per line (optional)",
    required: false,
  },
  custom_evaluation_criteria: {
    label: "Custom evaluation criteria",
    placeholder: "Optional ATS / screening criteria…",
    required: false,
  },
} as const;

export const CREATE_HR_ERRORS = {
  REQUIRED: "This field is required",
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
} as const;

export const INITIAL_CREATE_HR_VALUES = {
  title: "",
  department: "",
  location: "",
  type: "",
  description: "",
  requirements: "",
  benefits: "",
  custom_evaluation_criteria: "",
  is_active: true,
} as const;
