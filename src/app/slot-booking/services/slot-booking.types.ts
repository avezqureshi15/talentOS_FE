export type FormValidateResponse = {
  valid: boolean;
  reason: string;
  emp_id?: string;
  type?: string;
};

export type SlotTimeRange = {
  start_at: string;
  end_at: string;
};

export type SlotsCreateRequest = {
  emp_id: string;
  slots: SlotTimeRange[];
};

export type SlotResponse = {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SkippedSlot = {
  start_at: string;
  end_at: string;
  reason: string;
};

export type SlotsCreateResponse = {
  data: SlotResponse[];
  skipped: SkippedSlot[];
};
