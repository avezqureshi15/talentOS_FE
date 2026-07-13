import { SLOT_DURATION_MINUTES } from "@/constants/constants";
import { getSlotBounds } from "@/app/slot-booking/utils/slot-env-utils";

export const BOOKING_LABELS = {
  CONFIRM: "Confirm Booking",
  CONFIRMED: "Booking Confirmed",
  CONFIRM_FAILED: "Failed to confirm booking. Please try again.",
  NO_SLOTS: "Select at least one slot to continue",
  LOADING_FORM: "Loading booking details...",
} as const;

export const FORM_ERRORS = {
  MISSING: "Missing booking link. Please contact HR.",
  INVALID: "Invalid booking link. Please contact HR.",
  NOT_FOUND: "This booking link was not found. Please contact HR.",
  EXPIRED: "This booking link has expired. Please contact HR for a new one.",
  ALREADY_SUBMITTED: "You have already submitted your slot preferences. Please contact HR if you need to make any changes.",
  UNKNOWN: "Something went wrong. Please try again or contact HR.",
} as const;

const _bounds = getSlotBounds();

export const SLOT_VALIDATION = {
  MIN_HOUR: _bounds.MIN_HOUR,
  MAX_HOUR: _bounds.MAX_HOUR,
  PAST_TIME_MSG: "Cannot add slots in the past. Please select a future time.",
  OUT_OF_RANGE_MSG: _bounds.OUT_OF_RANGE_MSG,
} as const;

export type ContextSection =
  | { type: "brand" }
  | { type: "divider" }
  | { type: "badge"; text: string }
  | { type: "title"; text: string }
  | { type: "meta"; items: { icon: string; text: string }[] }
  | { type: "note"; icon: string; heading: string; text: string };

export const CONTEXT_SECTIONS: ContextSection[] = [
  { type: "brand" },
  { type: "divider" },
  { type: "badge", text: "Availability Request" },
  { type: "title", text: "Select Your Preferred Slots" },
  {
    type: "meta",
    items: [
      { icon: "bx bx-clock", text: `${SLOT_DURATION_MINUTES} Minutes` },
      { icon: "bx bx-video", text: "Google Meet" },
    ],
  },
  { type: "divider" },
  {
    type: "note",
    icon: "bx bx-info-circle",
    heading: "Instructions",
    text: "Please select your preferred open slots. The HR team will use these to schedule events on your calendar.",
  },
];

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT +5:30)" },
  { value: "America/New_York", label: "America/New_York (GMT -4:00)" },
  { value: "America/Chicago", label: "America/Chicago (GMT -5:00)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (GMT -7:00)" },
  { value: "Europe/London", label: "Europe/London (GMT +1:00)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (GMT +2:00)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT +4:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (GMT +8:00)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (GMT +10:00)" },
] as const;

export type MockSlot = {
  label: string;
  value: string;
  available: boolean;
};

const fmt = (h: number, m: number) => {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const mins = String(Math.round(m)).padStart(2, "0");
  return `${hour12}:${mins} ${period}`;
};

const toValue = (h: number, m: number, endH: number, endM: number) =>
  `${String(h).padStart(2, "0")}:${String(Math.round(m)).padStart(2, "0")}-${String(endH).padStart(2, "0")}:${String(Math.round(endM)).padStart(2, "0")}`;

const genSlots = () => {
  const duration = SLOT_DURATION_MINUTES;
  const bounds = getSlotBounds();
  const slots: MockSlot[] = [];
  const unavailable = new Set(["10:00-10:30", "11:30-12:00", "13:00-13:30", "14:30-15:00", "16:30-17:00"]);
  for (let h = bounds.MIN_HOUR; h < bounds.GEN_END_HOUR; h++) {
    for (let m = 0; m < 60; m += duration) {
      const totalStart = h * 60 + m;
      const totalEnd = totalStart + duration;
      const endH = Math.floor(totalEnd / 60);
      const endM = totalEnd % 60;
      const value = toValue(h, m, endH, endM);
      slots.push({
        label: `${fmt(h, m)} – ${fmt(endH, endM)}`,
        value,
        available: !unavailable.has(value),
      });
    }
  }
  return slots;
};

export const MOCK_SLOTS: MockSlot[] = genSlots();
