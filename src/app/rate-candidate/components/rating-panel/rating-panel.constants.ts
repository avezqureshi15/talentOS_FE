export const RUBRIC_LEVELS = [
  { score: 1, icon: "bx bx-x-circle", label: "Strong Reject", desc: "Completely lacked the skill" },
  { score: 2, icon: "bx bx-error", label: "Below Average", desc: "Needed heavy prompting" },
  { score: 3, icon: "bx bx-check-circle", label: "Proficient", desc: "Met the core requirements comfortably" },
  { score: 4, icon: "bx bx-hot", label: "Exceptional", desc: "Exceeded expectations / Showed mastery" },
] as const;

export const RATING_CRITERIA = [
  { key: "communication", label: "Communication" },
  { key: "technical_skills", label: "Technical Skills" },
  { key: "problem_solving", label: "Problem Solving" },
  { key: "cultural_fit", label: "Cultural Fit" },
] as const;
