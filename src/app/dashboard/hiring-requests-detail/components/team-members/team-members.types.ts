export type JobTeamMember = {
  user_id: number;
  name: string;
  email: string;
  is_owner: boolean;
  role: string;
};

export type JobTeamResponse = {
  hiring_request_id: string;
  data: JobTeamMember[];
  total: number;
};

export type AddTeamMemberPayload = {
  user_id: number;
  is_owner: boolean;
};

export type UpdateTeamMemberPayload = {
  is_owner?: boolean;
};
