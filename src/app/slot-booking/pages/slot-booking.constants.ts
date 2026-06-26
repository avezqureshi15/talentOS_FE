export const BOOKING_LABELS = {
  CONFIRM: "Confirm Booking",
  CONFIRMED: "Booking Confirmed",
  NO_SLOTS: "Select at least one slot to continue",
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
  { type: "badge", text: "Technical Round 1" },
  { type: "title", text: "Frontend Engineer" },
  {
    type: "meta",
    items: [
      { icon: "bx bx-time", text: "30 Minutes" },
      { icon: "bx bx-video", text: "Google Meet / Zoom" },
    ],
  },
  { type: "divider" },
  {
    type: "note",
    icon: "bx bx-info-circle",
    heading: "Instructions",
    text: "Please select 3 slots that work best for your timezone. The interviewer will confirm one of your chosen slots.",
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
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const toValue = (h: number, m: number, endH: number, endM: number) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}-${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

const genSlots = () => {
  const slots: MockSlot[] = [];
  const unavailable = new Set(["10:00-10:30", "11:30-12:00", "13:00-13:30", "14:30-15:00", "16:30-17:00"]);
  for (let h = 9; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const endH = m === 0 ? h : h + 1;
      const endM = m === 0 ? 30 : 0;
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
