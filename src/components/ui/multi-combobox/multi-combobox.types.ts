export type MultiComboboxProps = {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  maxItemLength?: number;
};
