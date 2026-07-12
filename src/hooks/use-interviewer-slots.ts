import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchInterviewerSchedule } from "@/services/slots/slots";
import type { CommandItem } from "@/components/shared/mentions/types";

export function useInterviewerSlots(empId: string | null) {
  return useQuery<CommandItem[]>({
    queryKey: [QUERY_KEYS.INTERVIEWER_SLOTS, empId],
    queryFn: () => fetchInterviewerSchedule(empId!),
    enabled: !!empId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });
}
