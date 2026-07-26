import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRolePermissions } from "../services/roles.service";
import { QUERY_KEYS } from "@/constants/constants";
import type { RoleData } from "../pages/roles-page.types";

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleData, Error, { roleName: string; permissionCodes: string[] }>({
    mutationFn: async ({ roleName, permissionCodes }) => {
      const { data } = await updateRolePermissions(roleName, permissionCodes);
      return data;
    },
    onSuccess: (_data, { roleName }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLE, roleName] });
    },
  });
};
