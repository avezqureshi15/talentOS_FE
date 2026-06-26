export type ApplicantDetailsModalProps = {
  open: boolean;
  applicantName: string;
  details: {
    currentCtc?: string;
    expectedCtc?: string;
    location?: string;
    yearsOfExperience?: string;
    noticePeriod?: string;
    howDidYouHear?: string;
  };
  onClose: () => void;
};
