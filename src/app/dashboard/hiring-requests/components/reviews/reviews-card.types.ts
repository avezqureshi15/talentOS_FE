export type InterviewDetails = {
  round: string;
  interviewer: string;
  role: string;
  jdHref: string;
  jdLabel: string;
  candidate: string;
  occurredOn: string;
  duration: string;
  interviewType: string;
  status: string;
};

export type InterviewerReview = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  reviewLink: string;
  interview: InterviewDetails;
};

export type SidePanelContentProps = {
  interview: InterviewDetails;
};
