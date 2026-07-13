import type { InterviewEntity, InterviewSubTab } from "./interviews.types";

export const INTERVIEW_SUB_TABS: { key: InterviewSubTab; label: string; icon: string }[] = [
  { key: "incoming", label: "Incoming", icon: "bx bx-calendar" },
  { key: "completed", label: "Completed", icon: "bx bx-check-circle" },
];

export const INTERVIEW_ROOM_LABEL = "Interview Room";
export const CANDIDATE_INFO_LABEL = "Candidate Info";
export const RESCHEDULE_LABEL = "Reschedule";
export const CANCEL_INTERVIEW_LABEL = "Cancel Interview";
export const CANCEL_CONFIRM_LABEL = "Confirm Cancel";
export const NO_INTERVIEWS_LABEL = "No interviews found";
export const COMING_SOON_LABEL = "Coming soon";

export const MOCK_INTERVIEWS: InterviewEntity[] = [
  { id: "iv-1", interviewerName: "Neel Mehta", interviewerEmpId: "emp-001", roundName: "Round 1", interviewStatus: "SCHEDULED", candidateName: "Avez", candidateId: "19d7824f-3521-4bf9-9bf9-b9c464606690", hiringRequestId: "9726376f-e218-4dc3-8f9a-abe8b0668cf4", position: "Frontend Engineer", slotTime: "10:00 AM - 11:00 AM", slotDate: "Today", roomLink: "https://meet.google.com/abc-defg-hij" },
  { id: "iv-2", interviewerName: "Priya Sharma", interviewerEmpId: "emp-002", roundName: "Round 1", interviewStatus: "SCHEDULED", candidateName: "Avinash", candidateId: "usr_e5f6g7h8", hiringRequestId: "7dd7037e-bb6b-4257-8522-8cc500ad92dd", position: "Backend Engineer", slotTime: "2:00 PM - 3:00 PM", slotDate: "Today", roomLink: "https://meet.google.com/klm-nopq-rst" },
  { id: "iv-3", interviewerName: "Arun Kumar", interviewerEmpId: "emp-003", roundName: "Round 2", interviewStatus: "SCHEDULED", candidateName: "Rahul", candidateId: "usr_i9j0k1l2", hiringRequestId: "7dd7037e-bb6b-4257-8522-8cc500ad92dd", position: "Fullstack Developer", slotTime: "4:00 PM - 5:00 PM", slotDate: "Today", roomLink: "https://meet.google.com/uvw-xyz-abc" },
  { id: "iv-4", interviewerName: "Sneha Patel", interviewerEmpId: "emp-004", roundName: "Round 1", interviewStatus: "SCHEDULED", candidateName: "Avez", candidateId: "usr_a1b2c3d4", hiringRequestId: "7dd7037e-bb6b-4257-8522-8cc500ad92dd", position: "Frontend Engineer", slotTime: "10:00 AM - 11:00 AM", slotDate: "Tomorrow", roomLink: "https://meet.google.com/def-ghij-klm" },
  { id: "iv-5", interviewerName: "Rahul Verma", interviewerEmpId: "emp-005", roundName: "Round 3", interviewStatus: "SCHEDULED", candidateName: "Avinash", candidateId: "usr_e5f6g7h8", hiringRequestId: "7dd7037e-bb6b-4257-8522-8cc500ad92dd", position: "Backend Engineer", slotTime: "9:00 AM - 10:00 AM", slotDate: "Yesterday", roomLink: "https://meet.google.com/nop-qrst-uvw" },
];
