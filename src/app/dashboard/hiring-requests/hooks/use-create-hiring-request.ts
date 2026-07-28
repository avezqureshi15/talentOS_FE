import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHiringRequest } from "@/services/hiring-requests/hiring-requests";
import type { HiringRequestCreatePayload } from "@/services/hiring-requests/hiring-requests.types";
import { QUERY_KEYS } from "@/constants/constants";

export const useCreateHiringRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HiringRequestCreatePayload) => createHiringRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TYPES] });
    },
  });
};
