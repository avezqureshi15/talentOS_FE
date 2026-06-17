
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "thinking"; text: string }
  | { type: "code"; code: string }
  | { type: "image"; url: string }
  | { type: "args"; text: string; collapsed?: boolean }
  | { type: "markdown"; content: string };


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