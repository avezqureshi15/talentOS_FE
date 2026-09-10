import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import {
  getHiringRequestCallWindow,
  updateHiringRequestCallWindow,
} from "@/services/call-window/call-window";
import type {
  CallWindow,
  UpdateCallWindowPayload,
} from "@/services/call-window/call-window.types";

export const useCallWindowData = (hiringRequestId: string) => {
  const windowQuery = useQuery<CallWindow>({
    queryKey: [QUERY_KEYS.CALL_WINDOW, hiringRequestId],
    queryFn: () => getHiringRequestCallWindow(hiringRequestId),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: Boolean(hiringRequestId),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: UpdateCallWindowPayload) =>
      updateHiringRequestCallWindow(hiringRequestId, payload),
  });

  return {
    data: windowQuery.data,
    isLoading: windowQuery.isLoading,
    error: windowQuery.error,
    refetch: windowQuery.refetch,
    save: saveMutation,
  };
};
