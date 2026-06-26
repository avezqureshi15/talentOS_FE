export type TimeSlot = {
  label: string;
  value: string;
  available: boolean;
};

export type SlotPickerProps = {
  slots: TimeSlot[];
  selectedSlots: string[];
  onToggleSlot: (value: string) => void;
};
