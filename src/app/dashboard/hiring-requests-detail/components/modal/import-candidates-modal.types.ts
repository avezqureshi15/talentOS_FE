export interface ParsedCandidate {
  row: number;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  valid: boolean;
  reason?: string;
}

export interface ImportResult {
  created: number;
  skipped: number;
  errors: { row: number; reason: string }[];
  total: number;
}

export interface ImportCandidatesModalProps {
  open: boolean;
  onClose: () => void;
  hiringRequestId: string;
}
