export type Suggestion = {
  label: string;
  action: string;
};

export type SuggestionChipsProps = {
  suggestions: Suggestion[];
  onSend: (text: string) => void;
};
