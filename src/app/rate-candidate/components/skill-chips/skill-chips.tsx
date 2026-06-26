import type { SkillChipsProps } from "./skill-chips.types";
import "./skill-chips.css";

const SkillChips = ({ title, chips, selected, onToggle }: SkillChipsProps) => {
  return (
    <div className="skill-chips">
      <h3 className="skill-chips-title">{title}</h3>
      <div className="skill-chips-grid">
        {chips.map((chip) => {
          const isActive = selected.includes(chip.key);
          return (
            <button
              key={chip.key}
              className={`skill-chip${isActive ? " skill-chip--active" : ""}`}
              onClick={() => onToggle(chip.key)}
              type="button"
            >
              {isActive && <i className="bx bx-check skill-chip-check" />}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SkillChips;
