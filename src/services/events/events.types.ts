export type EventResponse = {
  id: string;
  entity_type: string;
  entity_id: string;
  job_id: string | null;
  candidate_id: number | null;
  event_name: string;
  state_code: string;
  actor_type: string | null;
  actor_id: string | null;
  remark: string | null;
  action_url: string | null;
  action_label: string | null;
  event_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
