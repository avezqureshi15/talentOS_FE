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
    willingToRelocate?: string;
  };
  onClose: () => void;
};
