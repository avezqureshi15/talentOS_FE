export type AccordionCardProps = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  linkHref: string;
  linkLabel: string;
  isOpen: boolean;
  onToggleOpen: (id: string) => void;
  jdHref?: string;
  jdLabel?: string;
  interviewLabel?: string;
  onViewInterview?: () => void;
  onResolve?: (id: string) => void;
  onNotify?: () => Promise<unknown>;
  onNotifyError?: (err: Error) => void;
};
