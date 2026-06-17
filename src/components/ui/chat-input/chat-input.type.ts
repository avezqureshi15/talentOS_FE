
export type ChatInputProps = {
  mounted?: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  Icon?: any;
  onSend: () => void;
};