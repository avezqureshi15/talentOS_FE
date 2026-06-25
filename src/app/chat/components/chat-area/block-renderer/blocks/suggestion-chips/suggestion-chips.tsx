import "./suggestion-chips.css";
import type { SuggestionChipsProps } from "./suggestion-chips.types";

const SuggestionChips = ({
  suggestions,
  onSend,
}: SuggestionChipsProps) => {
  return (
    <div className="chip-row">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="suggestion-chip"
          onClick={() => onSend(s.label)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;