export type ChatAreaProps = {
  hasStartedChat: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
};

// chat.type.ts

export type TextBlock = {
  type: "text";
  text: string;
};

export type ThinkingBlock = {
  type: "thinking";
  text: string;
};

export type CodeBlock = {
  type: "code";
  code: string;
};

export type ImageBlock = {
  type: "image";
  url: string;
};

export type EmailBlock = {
  type: "email";
  subject?: string;
  body?: string;
};

export type LetterBlock = {
  type: "letter";
  subject?: string;
  name?: string;
  meta?: string;
};

export type MarkdownBlock = {
  type: "markdown";
  content: string;
};

export type StepsBlock = {
  type: "steps";
  title?: string;
  items: string[];
};

export type ArgsBlock = {
  type: "args";
  text: string;
  collapsed?: boolean;
};

export type ContentBlock =
  | TextBlock
  | ThinkingBlock
  | CodeBlock
  | ImageBlock
  | EmailBlock
  | LetterBlock
  | StepsBlock
  | ArgsBlock
  | MarkdownBlock;

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: ContentBlock[];
};