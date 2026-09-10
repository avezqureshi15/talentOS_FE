import { useId } from "react";
import "./switch.css";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = ({ checked, onCheckedChange, disabled, className = "" }: SwitchProps) => {
  const id = useId();
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => { if (!disabled) onCheckedChange(!checked); }}
      className={`switch-root ${className}${disabled ? " switch-root--disabled" : ""}`}
      data-state={checked ? "checked" : "unchecked"}
    >
      <span className="switch-thumb" data-state={checked ? "checked" : "unchecked"} />
    </button>
  );
};

export default Switch;
