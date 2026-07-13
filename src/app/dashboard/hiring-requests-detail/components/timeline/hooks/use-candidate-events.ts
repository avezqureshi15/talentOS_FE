import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventsByCandidateId } from "@/services/events/events";
import type { EventResponse } from "@/services/events/events.types";
import { STATE_TO_LABEL, STATE_TO_STATUS, EVENTS_BY_CANDIDATE_QUERY_KEY } from "../timeline.constants";
import type { TimelineStep } from "../timeline.types";

type UseCandidateEventsResult = {
  steps: TimelineStep[];
  loading: boolean;
  error: string | null;
};

const mapEventToStep = (event: EventResponse): TimelineStep => ({
  id: event.id,
  title: STATE_TO_LABEL[event.state_code] ?? event.event_name,
  description: event.remark ?? "",
  status: STATE_TO_STATUS[event.state_code] ?? "queued",
  date: new Date(event.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
  actor: event.actor_type ?? undefined,
  remarks: event.event_metadata
    ? Object.entries(event.event_metadata).map(
        ([key, val]) => `${key}: ${String(val)}`,
      )
    : undefined,
});

export const useCandidateEvents = (
  candidateId: number | null,
): UseCandidateEventsResult => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: EVENTS_BY_CANDIDATE_QUERY_KEY(candidateId ?? 0),
    queryFn: () => fetchEventsByCandidateId(candidateId!),
    enabled: !!candidateId,
  });

  const steps = useMemo(
    () => (events ?? []).map(mapEventToStep),
    [events],
  );

  return {
    steps,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
