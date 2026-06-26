import { SLOT_PICKER_LABELS } from "./slot-picker.constants";
import type { SlotPickerProps } from "./slot-picker.types";
import "./slot-picker.css";

const SlotPicker = ({ slots, selectedSlots, onToggleSlot }: SlotPickerProps) => {
  const available = slots.filter((s) => s.available);

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
    </div>
  );
};

export default SlotPicker;
