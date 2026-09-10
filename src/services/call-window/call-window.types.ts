export interface CallWindow {
  hiring_request_id: string;
  screening_call_from: string | null;
  screening_call_to: string | null;
  screening_timezone: string;
  sync_status: "synced" | "draft";
  sync_errors: string[];
}

export interface UpdateCallWindowPayload {
  screening_call_from?: string | null;
  screening_call_to?: string | null;
  screening_timezone?: string;
}
