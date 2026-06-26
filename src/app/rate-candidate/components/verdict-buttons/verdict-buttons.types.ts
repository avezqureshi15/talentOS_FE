export type VerdictValue = "reject" | "hold" | "advance";

export type VerdictButtonsProps = {
  value: VerdictValue | null;
  onChange: (value: VerdictValue) => void;
};
