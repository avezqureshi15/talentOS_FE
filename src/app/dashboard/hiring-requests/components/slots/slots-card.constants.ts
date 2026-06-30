import type { InterviewerSlot } from "./slots-card.types";
import { APP_URL } from "@/constants/constants";

export const SLOTS_LABELS = {
  SLOT_LINK: "Slot Link",
  JD: "JD",
  NO_SLOTS: "No interviewers with slots available",
} as const;

const BOOK_SLOT_URL = `${APP_URL}/book-slot`;

export const MOCK_INTERVIEWERS: InterviewerSlot[] = [
  { id: "1", name: "Avez Qureshi", email: "avez@webknot.in", contactNumber: "+91 98765 43210", slotLink: BOOK_SLOT_URL, jdHref: "/hiring-requests/hr-001" },
  { id: "2", name: "Rahul Sharma", email: "rahul@webknot.in", contactNumber: "+91 98765 43211", slotLink: BOOK_SLOT_URL, jdHref: "/hiring-requests/hr-002" },
  { id: "3", name: "Priya Patel", email: "priya@webknot.in", contactNumber: "+91 98765 43212", slotLink: BOOK_SLOT_URL, jdHref: "/hiring-requests/hr-003" },
];
