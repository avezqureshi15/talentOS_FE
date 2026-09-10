import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleHiringRequestStatus } from "@/services/hiring-requests/hiring-requests";
import { QUERY_KEYS } from "@/constants/constants";

export const useToggleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleHiringRequestStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUEST, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS] });
    },
  });
};
