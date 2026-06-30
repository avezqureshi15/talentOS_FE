import type { InterviewerReview } from "./reviews-card.types";
import { APP_URL } from "@/constants/constants";

export const REVIEWS_LABELS = {
  REVIEW_LINK: "Review",
  INTERVIEW: "Interview",
  NO_REVIEWS: "No pending reviews",
  SIDE_PANEL_TITLE: "Interview Details",
  INTERVIEWER: "Interviewer",
  HIRING_ROLE: "Hiring Role",
  JD: "JD",
  WITH_WHOM: "With Whom",
  OCCURRED_ON: "Occurred On",
  DURATION: "Duration",
  INTERVIEW_TYPE: "Interview Type",
  STATUS: "Status",
} as const;

const RATE_CANDIDATE_URL = `${APP_URL}/rate-candidate`;

export const REVIEW_INFO = [
  { key: "interviewer" as const, label: REVIEWS_LABELS.INTERVIEWER },
  { key: "role" as const, label: REVIEWS_LABELS.HIRING_ROLE },
  { key: "jdLabel" as const, label: REVIEWS_LABELS.JD },
  { key: "candidate" as const, label: REVIEWS_LABELS.WITH_WHOM },
  { key: "occurredOn" as const, label: REVIEWS_LABELS.OCCURRED_ON },
  { key: "duration" as const, label: REVIEWS_LABELS.DURATION },
  { key: "interviewType" as const, label: REVIEWS_LABELS.INTERVIEW_TYPE },
  { key: "status" as const, label: REVIEWS_LABELS.STATUS },
];

export const MOCK_REVIEWERS: InterviewerReview[] = [
  {
    id: "1",
    name: "Avez Qureshi",
    email: "avez@webknot.in",
    contactNumber: "+91 98765 43210",
    reviewLink: RATE_CANDIDATE_URL,
    interview: {
      round: "Technical Round 1",
      interviewer: "Avez Qureshi",
      role: "Senior Frontend Engineer",
      jdHref: "/hiring-requests/hr-001",
      jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
      candidate: "Engineering Team / Frontend Lead",
      occurredOn: "June 27, 2026 • 10:30 AM",
      duration: "45 min",
      interviewType: "Technical Round 1 (Google Meet)",
      status: "Scheduled",
    },
  },
  {
    id: "2",
    name: "Rahul Sharma",
    email: "rahul@webknot.in",
    contactNumber: "+91 98765 43211",
    reviewLink: RATE_CANDIDATE_URL,
    interview: {
      round: "Technical Round 1",
      interviewer: "Rahul Sharma",
      role: "Senior Frontend Engineer",
      jdHref: "/hiring-requests/hr-002",
      jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
      candidate: "Engineering Team / Frontend Lead",
      occurredOn: "June 27, 2026 • 10:30 AM",
      duration: "45 min",
      interviewType: "Technical Round 1 (Google Meet)",
      status: "Scheduled",
    },
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya@webknot.in",
    contactNumber: "+91 98765 43212",
    reviewLink: RATE_CANDIDATE_URL,
    interview: {
      round: "Technical Round 2",
      interviewer: "Priya Patel",
      role: "Senior Frontend Engineer",
      jdHref: "/hiring-requests/hr-003",
      jdLabel: "React, TypeScript, Next.js, and Tailwind CSS. 4+ years experience required.",
      candidate: "Engineering Team / Frontend Lead",
      occurredOn: "June 27, 2026 • 10:30 AM",
      duration: "45 min",
      interviewType: "Technical Round 2 (Google Meet)",
      status: "Scheduled",
    },
  },
];
