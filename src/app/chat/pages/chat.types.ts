
export type StreamInput = {
  text: string;
  chatId?: string | null;
};

export type TextBlock = { type: "text"; text: string };
export type ThinkingBlock = { type: "thinking"; text: string };
export type CodeBlock = { type: "code"; code: string };
export type ImageBlock = { type: "image"; url: string };
export type EmailBlock = { type: "email"; subject?: string; body?: string };
export type LetterBlock = { type: "letter"; subject?: string; name?: string; meta?: string };
export type MarkdownBlock = { type: "markdown"; content: string };

export type ContentBlock =
  | TextBlock
  | ThinkingBlock
  | CodeBlock
  | ImageBlock
  | EmailBlock
  | LetterBlock
  | MarkdownBlock;


export type UserMessage = {
  id: number;
  role: "user";
  content: ContentBlock[];
};


export type Suggestion = {
  label: string;
  action: string;
};


// =============================

export type UIAction =
  | {
      type: "SHOW_JOB_PANEL";
      payload: {
        jobId: string;
        role: string;
        
      };
    };


// =============================
// 5. AI MESSAGE (ONLY RENDER DATA)
// =============================
export type AIMessage = {
  id: number;
  role: "ai";
  content: ContentBlock[];
  suggestions?: Suggestion[];

  // optional side-effect attached to message
  ui_action?: UIAction;
};



export type Message = UserMessage | AIMessage;




export type AIResponse = {
  type: "text" | "stream" | "ui_action";

  // content layer
  text?: string;
  final?: ContentBlock[];

  // streaming layer
  steps?: string[];

  // ui layer
  action?: "SHOW_JOB_PANEL";
  payload?: {
    jobId: string;
    role: string;
  };

  suggestions?: Suggestion[];
};