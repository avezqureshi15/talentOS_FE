export const JOB_ROLES = ["job_owner", "recruiter", "reviewer"] as const;

export type JobRole = (typeof JOB_ROLES)[number];

export const JOB_ROLE_LABELS: Record<JobRole, string> = {
  job_owner: "Job Owner",
  recruiter: "Recruiter",
  reviewer: "Reviewer",
};

export type JobTeamMember = {
  user_id: number;
  name: string;
  email: string;
  is_owner: boolean;
  role: JobRole;
};

export type JobTeamResponse = {
  hiring_request_id: string;
  data: JobTeamMember[];
  total: number;
};

export type AddTeamMemberPayload = {
  user_id: number;
  is_owner: boolean;
  role: JobRole;
};

export type UpdateTeamMemberPayload = {
  is_owner?: boolean;
  role?: JobRole;
};
