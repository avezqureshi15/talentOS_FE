export type RateHeaderMeta = {
  round?: string | null;
  candidate?: string | null;
  role?: string | null;
  interviewedOn?: string | null;
  interviewer?: string | null;
};

export type RateHeaderProps = {
  meta: RateHeaderMeta;
  title: string;
  subtitle: string;
  guidelines?: string;
};
