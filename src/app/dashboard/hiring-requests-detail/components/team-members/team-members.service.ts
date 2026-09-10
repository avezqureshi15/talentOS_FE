import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  AddTeamMemberPayload,
  JobTeamMember,
  JobTeamResponse,
  UpdateTeamMemberPayload,
} from "./team-members.types";

const teamPath = (hiringRequestId: string) =>
  API_ENDPOINTS.JOB_TEAM.replace("{hiring_request_id}", hiringRequestId);

const memberPath = (hiringRequestId: string, userId: number) =>
  API_ENDPOINTS.JOB_TEAM_MEMBER.replace("{hiring_request_id}", hiringRequestId).replace(
    "{user_id}",
    String(userId)
  );

export const getJobTeam = (hiringRequestId: string) =>
  httpClient.get<JobTeamResponse>(teamPath(hiringRequestId));

export const addJobTeamMember = (hiringRequestId: string, payload: AddTeamMemberPayload) =>
  httpClient.post<JobTeamResponse>(teamPath(hiringRequestId), payload);

export const updateJobTeamMember = (
  hiringRequestId: string,
  userId: number,
  payload: UpdateTeamMemberPayload
) => httpClient.patch<JobTeamResponse>(memberPath(hiringRequestId, userId), payload);

export const removeJobTeamMember = (hiringRequestId: string, userId: number) =>
  httpClient.delete<JobTeamResponse>(memberPath(hiringRequestId, userId));

export type { JobTeamMember };
