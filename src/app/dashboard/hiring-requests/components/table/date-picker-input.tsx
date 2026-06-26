import { useRef } from "react";
import { SELECT_DATE } from "./table.constants";
import type { DatePickerInputProps } from "./table.types";

const DatePickerInput = ({ label, value, onChange }: DatePickerInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <label className="date-filter-field">
      <span>{label}</span>
      <button
        type="button"
        className="date-filter-trigger"
        onClick={() => ref.current?.showPicker()}
      >
        <i className="bx bx-calendar" />
        <span>{value || SELECT_DATE}</span>
      </button>
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="date-filter-hidden"
      />
    </label>
  );
};

export default DatePickerInput;
