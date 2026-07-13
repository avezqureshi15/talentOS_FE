export interface SlotBounds {
  MIN_HOUR: number;
  MAX_HOUR: number;
  GEN_END_HOUR: number;
  OUT_OF_RANGE_MSG: string;
}

const _DEV_BOUNDS: SlotBounds = {
  MIN_HOUR: 0,
  MAX_HOUR: 24,
  GEN_END_HOUR: 24,
  OUT_OF_RANGE_MSG: "Slots must be between 12:00 AM and 11:59 PM.",
};

const _PROD_BOUNDS: SlotBounds = {
  MIN_HOUR: 9,
  MAX_HOUR: 19,
  GEN_END_HOUR: 18,
  OUT_OF_RANGE_MSG: "Slots must be between 9:00 AM and 7:00 PM.",
};

let _cached: SlotBounds | null = null;

export function getSlotBounds(): SlotBounds {
  if (!_cached) {
    _cached = import.meta.env.DEV ? _DEV_BOUNDS : _PROD_BOUNDS;
  }
  return _cached;
}
