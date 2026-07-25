import { useQuery } from "@tanstack/react-query";
import { getRole } from "../services/roles.service";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { RoleData } from "../pages/roles-page.types";

export const useRoleDetail = (roleName: string | null) => {
  return useQuery<RoleData>({
    queryKey: [QUERY_KEYS.ROLE, roleName],
    queryFn: async () => {
      const { data } = await getRole(roleName!);
      return data;
    },
    enabled: !!roleName,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
};
