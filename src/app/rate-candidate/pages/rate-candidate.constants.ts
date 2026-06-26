export const RATE_LABELS = {
  TITLE: "Rate This Interview",
  SUBTITLE: "Evaluation",
  SUBMIT: "Submit Review",
  CLEAR: "Clear All",
  SUBMITTED_TITLE: "Review Submitted",
  MAX_CHARS: 500,
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
  { type: "title", text: "Rohan Mehta" },
  {
    type: "meta",
    items: [
      { icon: "bx bx-briefcase", text: "Frontend Engineer" },
      { icon: "bx bx-calendar", text: "Interviewed: 26 Jun 2026" },
      { icon: "bx bx-user", text: "Interviewer: Avez Qureshi" },
    ],
  },
  { type: "divider" },
  {
    type: "note",
    icon: "bx bx-info-circle",
    heading: "Guidelines",
    text: "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential.",
  },
];

/* Payload shape when sending to backend:
   {
     candidate_name: "Rohan Mehta",
     interview_round: "Technical Round 1",
     interviewer: "Avez Qureshi",
     ratings: {
       communication: 3,
       technical_skills: 4,
       problem_solving: 2,
       cultural_fit: 3,
     },
     average_rating: 3.0,
     skills: ["react", "typescript", "state_mgmt"],
     verdict: "advance",
     review_notes: "Strong technical skills...",
   }
   Backend stores:
   {
     id: uuid,
     candidate_name: string,
     interview_round: string,
     interviewer: string,
     ratings: jsonb,
     average_rating: float,
     verified_skills: text[],
     verdict: "reject" | "hold" | "advance",
     review_notes: text,
     ai_status: "pending" | "matched" | "conflict",
     hr_status: "pending" | "reviewed",
     created_at: timestamp,
     updated_at: timestamp,
   }
*/
