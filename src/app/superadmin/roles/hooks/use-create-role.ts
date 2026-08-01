import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../services/roles.service";
import { QUERY_KEYS } from "@/constants/constants";
import type { RoleData } from "../pages/roles-page.types";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleData, Error, { roleName: string; description?: string }>({
    mutationFn: async ({ roleName, description }) => {
      const { data } = await createRole({ role_name: roleName, description });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
    },
  });
};
