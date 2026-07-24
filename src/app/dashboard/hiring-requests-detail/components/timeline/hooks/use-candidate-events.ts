import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventsByCandidateId } from "@/services/events/events";
import type { EventResponse } from "@/services/events/events.types";
import { formatDateTimeIST } from "@/utils/format-datetime-ist";
import { STATE_TO_LABEL, STATE_TO_STATUS, EVENTS_BY_CANDIDATE_QUERY_KEY } from "../timeline.constants";
import type { TimelineStep } from "../timeline.types";

type UseCandidateEventsResult = {
  steps: TimelineStep[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const mapEventToStep = (event: EventResponse): TimelineStep => ({
  id: event.id,
  title: STATE_TO_LABEL[event.state_code] ?? event.event_name,
  description: event.remark ?? "",
  status: STATE_TO_STATUS[event.state_code] ?? "queued",
  date: formatDateTimeIST(event.created_at),
  actor: event.actor_type ?? undefined,
  actionUrl: event.action_url ?? undefined,
  actionLabel: event.action_label ?? undefined,
});

export const useCandidateEvents = (
  candidateId: number | null,
): UseCandidateEventsResult => {
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: EVENTS_BY_CANDIDATE_QUERY_KEY(candidateId ?? 0),
    queryFn: () => fetchEventsByCandidateId(candidateId!),
    enabled: !!candidateId,
    staleTime: 30_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const steps = useMemo(
    () => (events ?? []).map(mapEventToStep),
    [events],
  );

  return {
    steps,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => {
      void refetch();
    },
  };
};
