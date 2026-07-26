import { useQuery } from "@tanstack/react-query";
import { listRoles } from "../services/roles.service";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { RoleListItem } from "../pages/roles-page.types";

export const useRolesList = () => {
  return useQuery<{ roles: RoleListItem[] }>({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: async () => {
      const { data } = await listRoles();
      return data;
    },
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
};
