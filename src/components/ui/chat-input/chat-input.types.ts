import type { Dispatch, SetStateAction } from "react";

export type ChatInputProps = {
  mounted?: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: () => void;
};
