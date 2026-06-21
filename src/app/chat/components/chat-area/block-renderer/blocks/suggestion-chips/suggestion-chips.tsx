import "./suggestion-chips.css";

type Suggestion = {
  label: string;
  action: string;
};

type SuggestionChipsProps = {
  suggestions: Suggestion[];
  onSend: (text: string) => void;
};

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