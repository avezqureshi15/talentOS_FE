import { useState } from "react";
import type { SkillChipsProps } from "./skill-chips.types";
import "./skill-chips.css";

const _MAX_CUSTOM_SKILLS: number = 20;

const SkillChips = ({ title, chips, selected, onToggle }: SkillChipsProps) => {
  // justification: tracks the custom skill input value
  const [inputValue, setInputValue] = useState("");

  const chipKeys = new Set(chips.map((c) => c.key));
  const customSkills = selected.filter((s) => !chipKeys.has(s));
  const atLimit = selected.length >= _MAX_CUSTOM_SKILLS;

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !selected.includes(trimmed) && !atLimit) {
      onToggle(trimmed);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

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
        {customSkills.map((skill) => (
          <button
            key={skill}
            className="skill-chip skill-chip--active skill-chip--custom"
            onClick={() => onToggle(skill)}
            type="button"
          >
            <i className="bx bx-check skill-chip-check" />
            {skill}
            <i className="bx bx-x skill-chip-remove" />
          </button>
        ))}
        {!atLimit && (
          <div className="skill-chip-add-row">
            <input
              className="skill-chip-input"
              type="text"
              placeholder="Add skill..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="skill-chip-add-btn"
              onClick={handleAdd}
              disabled={!inputValue.trim()}
              type="button"
            >
              <i className="bx bx-plus" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillChips;
