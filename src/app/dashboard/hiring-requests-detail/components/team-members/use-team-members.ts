import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import {
  addJobTeamMember,
  getJobTeam,
  removeJobTeamMember,
  updateJobTeamMember,
} from "./team-members.service";
import type {
  AddTeamMemberPayload,
  JobTeamResponse,
  UpdateTeamMemberPayload,
} from "./team-members.types";

const invalidateTeam = (queryClient: ReturnType<typeof useQueryClient>, hiringRequestId: string) =>
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOB_TEAM, hiringRequestId] });

export const useJobTeam = (hiringRequestId: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEYS.JOB_TEAM, hiringRequestId],
    queryFn: async () => {
      if (!hiringRequestId) throw new Error("Missing hiring request id");
      const { data } = await getJobTeam(hiringRequestId);
      return data;
    },
    enabled: !!hiringRequestId,
  });

export const useAddTeamMember = (hiringRequestId: string) => {
  const queryClient = useQueryClient();

  return useMutation<JobTeamResponse, Error, AddTeamMemberPayload>({
    mutationFn: async (payload) => {
      const { data } = await addJobTeamMember(hiringRequestId, payload);
      return data;
    },
    onSuccess: () => invalidateTeam(queryClient, hiringRequestId),
  });
};

export const useUpdateTeamMember = (hiringRequestId: string) => {
  const queryClient = useQueryClient();

  return useMutation<JobTeamResponse, Error, { userId: number; payload: UpdateTeamMemberPayload }>({
    mutationFn: async ({ userId, payload }) => {
      const { data } = await updateJobTeamMember(hiringRequestId, userId, payload);
      return data;
    },
    onSuccess: () => invalidateTeam(queryClient, hiringRequestId),
  });
};

export const useRemoveTeamMember = (hiringRequestId: string) => {
  const queryClient = useQueryClient();

  return useMutation<JobTeamResponse, Error, number>({
    mutationFn: async (userId) => {
      const { data } = await removeJobTeamMember(hiringRequestId, userId);
      return data;
    },
    onSuccess: () => invalidateTeam(queryClient, hiringRequestId),
  });
};
