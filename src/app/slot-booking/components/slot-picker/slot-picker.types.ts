export type TimeSlot = {
  label: string;
  value: string;
  available: boolean;
};

export type SlotPickerProps = {
  slots: TimeSlot[];
  selectedSlots: string[];
  onToggleSlot: (value: string) => void;
  customSlots: string[];
  onAddCustomSlot: (value: string) => void;
  onRemoveCustomSlot: (value: string) => void;
};
