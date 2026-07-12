import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchUsers } from "@/services/users/users";
import { useDebounce } from "@/hooks/use-debounce";

export function useInterviewerSearch(search: string) {
  const debounced = useDebounce(search, 300);

  return useQuery({
    queryKey: [QUERY_KEYS.INTERVIEWER_SEARCH, debounced],
    queryFn: () => fetchUsers(debounced || undefined, 1, 20, true),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
}
