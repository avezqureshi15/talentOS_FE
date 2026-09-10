export type VerdictValue = "selected" | "rejected";

export type VerdictButtonsProps = {
  value: VerdictValue | null;
  onChange: (value: VerdictValue) => void;
};
