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
  onRemoveCustomSlot,
}: SlotPickerProps) => {
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

      </div>
  );
};

export default SlotPicker;
