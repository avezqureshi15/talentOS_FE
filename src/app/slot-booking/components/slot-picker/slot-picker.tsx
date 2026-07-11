import { useState } from "react";
import { SLOT_PICKER_LABELS } from "./slot-picker.constants";
import type { SlotPickerProps } from "./slot-picker.types";
import "./slot-picker.css";

const SlotPicker = ({ slots, selectedSlots, onToggleSlot }: SlotPickerProps) => {
  const [customStart, setCustomStart] = useState("09:00");
  const [customEnd, setCustomEnd] = useState("10:00");
  const available = slots.filter((s) => s.available);

  const handleAddCustom = () => {
    const value = `${customStart}-${customEnd}`;
    onToggleSlot(value);
  };

  return (
    <div className="slot-picker">
      <div className="slot-picker-header">
        <h3 className="slot-picker-title">{SLOT_PICKER_LABELS.TITLE}</h3>
        {selectedSlots.length > 0 && (
          <span className="slot-picker-badge">
            {selectedSlots.length} selected
          </span>
        )}
      </div>

      <div className="slot-grid">
        {available.length === 0 ? (
          <p className="slot-empty">{SLOT_PICKER_LABELS.NONE}</p>
        ) : (
          available.map((s) => {
            const isSelected = selectedSlots.includes(s.value);
            return (
              <button
                key={s.value}
                className={`slot-chip${isSelected ? " slot-chip--selected" : ""}`}
                onClick={() => onToggleSlot(s.value)}
                type="button"
              >
                {s.label}
              </button>
            );
          })
        )}
      </div>

      <div className="slot-custom">
        <div className="slot-custom-header">
          <i className="bx bx-plus-circle" />
          <span>{SLOT_PICKER_LABELS.CUSTOM_TITLE}</span>
        </div>
        <div className="slot-custom-inputs">
          <label className="slot-custom-field">
            <span className="slot-custom-label">{SLOT_PICKER_LABELS.START_LABEL}</span>
            <input
              type="time"
              className="slot-custom-time"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </label>
          <label className="slot-custom-field">
            <span className="slot-custom-label">{SLOT_PICKER_LABELS.END_LABEL}</span>
            <input
              type="time"
              className="slot-custom-time"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </label>
          <button
            className="slot-custom-add"
            onClick={handleAddCustom}
            type="button"
          >
            {SLOT_PICKER_LABELS.ADD}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotPicker;
