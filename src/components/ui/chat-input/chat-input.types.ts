import type { ComponentType, Dispatch, SetStateAction } from "react";

type IconComponent = ComponentType<{ className?: string }>;

export type ChatInputProps = {
  mounted?: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  Icon?: Record<string, IconComponent>;
  Waveform?: IconComponent;
  onSend: () => void;
};

export type InputActionsProps = {
  Icon: Record<string, IconComponent>;
  Waveform: IconComponent;
  onSend: () => void;
};
