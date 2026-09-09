import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";

export function invalidateHiringRequestQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUEST] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINAL_VERDICTS] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] }),
  ]);
}
