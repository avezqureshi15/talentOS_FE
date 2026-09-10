export const CREATE_HR_MODAL = {
  TITLE: "Create Hiring Request",
  ICON: "bx-briefcase",
  CANCEL: "Cancel",
  BACK: "Back",
  NEXT: "Next",
  SUBMIT: "Create",
  SUBMITTING: "Creating...",
  SUCCESS: "Hiring request created",
  HINT: "Required fields are marked with *",
  ACTIVE_LABEL: "Active listing",
  ACTIVE_HINT: "On by default — untick to keep the listing inactive",
  STEP_LABELS: ["Basic Details", "Requirements & Benefits", "Assign the Job"],
  STEP_TITLE: (step: number, total: number, label: string) =>
    `Step ${step} of ${total} — ${label}`,
  ASSIGN_QUESTION: "Do you want to assign this job to someone?",
  ASSIGN_NOW: "Assign now",
  ASSIGN_SKIP: "Skip",
  ASSIGN_SKIP_HINT:
    "You're automatically added as the owner. You can add team members later from the job's Team tab.",
  ASSIGN_SEARCH_PLACEHOLDER: "Type a name or email...",
  ASSIGN_SEARCH_LABEL: "Search users",
  ASSIGN_ADD: "Add",
  ASSIGN_EMPTY: "No users found",
  ASSIGN_LOADING: "Loading users...",
  ASSIGN_ALREADY_ADDED: "This user is already added",
  ASSIGN_ADDED_HINT: "Pick a user, then Add. Repeat for more people.",
  ASSIGN_CREATE: "Create Job",
  ASSIGN_CREATE_WITH_TEAM: "Create & Assign",
  ASSIGN_FAILED: (n: number) => `Job created, but ${n} assignment(s) failed`,
} as const;

export const CREATE_HR_DEPARTMENT_PRESETS = [
  "Engineering",
  "QA",
  "DevOps",
  "HR",
  "IT Admin",
  "Business Analyst",
  "Account Manager",
  "Leadership",
] as const;

export const CREATE_HR_LOCATION_PRESETS = [
  "Remote",
  "Bangalore",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Delhi",
  "Noida",
  "Gurgaon",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
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
    placeholder: "Select or type a department",
    required: true,
    maxLength: 255,
  },
  location: {
    label: "Location",
    placeholder: "Select or type a location, then press Enter",
    required: true,
    maxLength: 255,
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
    placeholder: "One requirement per line",
    required: true,
  },
  benefits: {
    label: "Benefits",
    placeholder: "One benefit per line (optional)",
    required: false,
  },
  custom_evaluation_criteria: {
    label: "Custom evaluation criteria",
    placeholder: "ATS / screening criteria…",
    required: true,
  },
} as const;

export const CREATE_HR_ERRORS = {
  REQUIRED: "This field is required",
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  LOCATION_ITEM_MAX: (max: number) => `Each location must be at most ${max} characters`,
} as const;

export const INITIAL_CREATE_HR_VALUES = {
  title: "",
  department: "",
  location: [] as string[],
  type: "",
  description: "",
  requirements: "",
  benefits: "",
  custom_evaluation_criteria: "",
  is_active: true,
};
