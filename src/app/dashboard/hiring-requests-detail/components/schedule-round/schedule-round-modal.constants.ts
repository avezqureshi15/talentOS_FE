import type { Interviewer, DaySchedule } from "./schedule-round-modal.types";

export const SR_LABELS = {
  STEP_1_TITLE: "Select Interviewer & Time Slot",
  STEP_1_DESC: "Choose an interviewer and pick a slot from their availability.",
  INTERVIEWER_PLACEHOLDER: "Search interviewer...",
  NO_INTERVIEWER: "Select an interviewer to see their availability.",
  NO_SLOTS: "No available slots for this week.",
  SELECT_SLOT: "Select a time slot",
  SELECT_DATE: "Select a date",

  STEP_2_TITLE: "Confirm & Send Invite",
  STEP_2_DESC: "Review the details and configure the meeting.",
  CANDIDATE_LABEL: "Candidate",
  INTERVIEWER_LABEL: "Interviewer",
  DATE_LABEL: "Date",
  TIME_LABEL: "Time",
  GMEET_TOGGLE: "Generate Google Meet Link",
  INVITE_PREVIEW: "Hi {candidate}, your Round 1 interview with {interviewer} has been scheduled for {date} at {time}. A Google Meet link has been generated for this session.",

  STEP_3_SUCCESS: "Round 1 Scheduled Successfully!",
  STEP_3_SUBTEXT: "Google Meet link and calendar invites have been sent to {candidate} and {interviewer}.",
  DONE: "Done",

  BACK: "Back",
  NEXT: "Next",
  SEND_INVITE: "Send Invite",
};

export const MOCK_INTERVIEWERS: Interviewer[] = [
  { id: "int-1", name: "Neel Mehta", role: "Senior Frontend Engineer" },
  { id: "int-2", name: "Priya Sharma", role: "Engineering Manager" },
  { id: "int-3", name: "Arun Kumar", role: "Tech Lead" },
  { id: "int-4", name: "Sneha Patel", role: "Senior Backend Engineer" },
  { id: "int-5", name: "Rahul Verma", role: "Product Manager" },
  { id: "int-6", name: "Ananya Gupta", role: "UX Designer" },
  { id: "int-7", name: "Vikram Singh", role: "Data Scientist" },
  { id: "8", name: "Kavita Nair", role: "DevOps Engineer" },
  { id: "9", name: "Rohit Joshi", role: "Full Stack Developer" },
  { id: "10", name: "Meera Iyer", role: "QA Lead" },
  { id: "11", name: "Aditya Kapoor", role: "Principal Architect" },
  { id: "12", name: "Pooja Deshmukh", role: "HR Business Partner" },
  { id: "13", name: "Karan Malhotra", role: "Mobile Developer" },
  { id: "14", name: "Isha Reddy", role: "Product Designer" },
  { id: "15", name: "Manoj Tiwari", role: "Security Engineer" },
  { id: "16", name: "Divya Menon", role: "Technical Writer" },
  { id: "17", name: "Siddharth Rao", role: "Site Reliability Engineer" },
  { id: "18", name: "Tanya Bhatia", role: "Machine Learning Engineer" },
  { id: "19", name: "Akhil Chopra", role: "Blockchain Developer" },
  { id: "20", name: "Nandini Krishnan", role: "Solutions Architect" },
];

const NOW = new Date();
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const UNAVAILABLE: Record<string, string[]> = {
  "0": ["09:00", "12:00", "16:00"],
  "1": ["10:00", "14:00"],
  "2": ["11:00", "15:00"],
  "3": ["09:00", "13:00", "17:00"],
  "4": ["12:00", "16:00"],
};

export function genWeekSchedule(): DaySchedule[] {
  const monday = getMonday(NOW);
  const week: DaySchedule[] = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const slots: { time: string; status: "available" | "unavailable" }[] = [];
    const dayKey = String(i);
    const busy = UNAVAILABLE[dayKey] ?? [];

    for (let h = 9; h <= 17; h++) {
      const time = `${pad(h)}:00`;
      slots.push({
        time,
        status: busy.includes(time) ? "unavailable" : "available",
      });
    }

    week.push({
      day: DAY_NAMES[date.getDay()],
      date: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
      slots,
    });
  }

  return week;
}
