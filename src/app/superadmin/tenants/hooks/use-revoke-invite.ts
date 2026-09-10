import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeInvite } from "@/app/admin/users/services/users-admin.service";
import { QUERY_KEYS } from "@/constants/constants";

export const useRevokeInvite = (tenantId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (inviteId) => {
      await revokeInvite(inviteId, tenantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANT_INVITES, tenantId] });
    },
  });
};
