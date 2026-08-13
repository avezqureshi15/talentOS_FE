import type { Role } from "@/constants/roles";

export type RoleDocsFeature = {
  id: string;
  label: string;
  description: string;
  permissions: Record<Role, boolean>;
};

export const ROLE_DOCS_PERSONAS: Role[] = [
  "superadmin",
  "account_admin",
  "job_owner",
  "recruiter",
  "reviewer",
];

export const ROLE_DOCS_FEATURES: RoleDocsFeature[] = [
  {
    id: "view-candidates",
    label: "View candidates",
    description: "Open candidate lists, profiles and every hiring step for a job.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: true },
  },
  {
    id: "submit-candidate-feedback",
    label: "Submit candidate feedback (Accept/Reject/Watchlist)",
    description: "Shortlist, select, hold or reject candidates from the pipeline.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: false },
  },
  {
    id: "export-reports",
    label: "Export reports",
    description: "Export job data and download the candidate report.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: true },
  },
  {
    id: "invite-candidates",
    label: "Invite candidates",
    description: "Import candidates into a job from an Excel sheet.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: false },
  },
  {
    id: "manage-job-settings",
    label: "Manage job settings",
    description: "Edit the details of existing job postings.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: false },
  },
  {
    id: "manage-application-workflow",
    label: "Manage application workflow",
    description: "Drive candidates through the pipeline: schedule rounds, move and import.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: false },
  },
  {
    id: "edit-interview-plan",
    label: "Edit interview plan",
    description: "Edit the AI interview plan, questions and call window of a job.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: false, reviewer: false },
  },
  {
    id: "add-members-to-job-team",
    label: "Add existing members to job team",
    description: "Add members, assign owners or remove people from a job team.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: false, reviewer: false },
  },
  {
    id: "invite-new-users",
    label: "Invite new users to organisation",
    description: "Send invitations and manage pending invites for the workspace.",
    permissions: { superadmin: true, account_admin: true, job_owner: false, recruiter: false, reviewer: false },
  },
  {
    id: "view-job-analytics",
    label: "View job analytics",
    description: "See job listings and opening details across the workspace.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: true, reviewer: true },
  },
  {
    id: "create-jobs",
    label: "Create jobs",
    description: "Publish new job postings from the Job Listings page.",
    permissions: { superadmin: true, account_admin: true, job_owner: true, recruiter: false, reviewer: false },
  },
  {
    id: "manage-organisation-users",
    label: "Manage organisation users",
    description: "Administer user profiles, roles and access across the platform.",
    permissions: { superadmin: true, account_admin: true, job_owner: false, recruiter: false, reviewer: false },
  },
  {
    id: "manage-apps-api-keys",
    label: "Manage apps / API keys",
    description: "Create, rotate and delete API keys used for AI integrations.",
    permissions: { superadmin: true, account_admin: true, job_owner: false, recruiter: false, reviewer: false },
  },
];
