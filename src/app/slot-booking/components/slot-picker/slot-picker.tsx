import { useState, useCallback } from "react";
import { SLOT_PICKER_LABELS } from "./slot-picker.constants";
import type { SlotPickerProps } from "./slot-picker.types";
import "./slot-picker.css";

const formatValue = (value: string) => {
  const [start, end] = value.split("-");
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
};

const SlotPicker = ({
  slots,
  selectedSlots,
  onToggleSlot,
  customSlots,
  onAddCustomSlot,
  onRemoveCustomSlot,
}: SlotPickerProps) => {
  const [customStart, setCustomStart] = useState("09:00");
  const [customEnd, setCustomEnd] = useState("10:00");
  const available = slots.filter((s) => s.available);

  const handleAddCustom = useCallback(() => {
    const value = `${customStart}-${customEnd}`;
    if (!customSlots.includes(value)) {
      onAddCustomSlot(value);
    }
  }, [customStart, customEnd, customSlots, onAddCustomSlot]);

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

      <div className={available.length === 0 ? "slot-grid slot-grid--empty" : "slot-grid"}>
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

      {customSlots.length > 0 && (
        <div className="slot-custom-grid">
          <div className="slot-custom-grid-header">
            <span className="slot-picker-title">{SLOT_PICKER_LABELS.CUSTOM_SLOTS_TITLE}</span>
            <span className="slot-picker-badge">{customSlots.length} added</span>
          </div>
          <div className="slot-custom-chips">
            {customSlots.map((value) => (
              <div key={value} className="slot-chip slot-chip--custom">
                <span>{formatValue(value)}</span>
                <button
                  className="slot-chip-remove"
                  onClick={() => onRemoveCustomSlot(value)}
                  title={SLOT_PICKER_LABELS.REMOVE}
                  type="button"
                >
                  <i className="bx bx-x" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="slot-custom-inputs">
        <div className="slot-custom-header">
          <i className="bx bx-plus-circle" />
          <span>{SLOT_PICKER_LABELS.CUSTOM_TITLE}</span>
        </div>
        <div className="slot-custom-fields">
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
