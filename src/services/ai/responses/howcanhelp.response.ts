import type { AIResponse } from "../../../app/chat/pages/chat.type";

export const howCanHelpResponses = {
  default: () =>
    ({
      type: "text",
      text: "Sure, Let me know with which kinds of tasks we want to proceed further",
      suggestions: [
        { label: "Make Job Description", action: "role:make job description" },
        { label: "Make Linkedin Hiring Post", action: "role:make linkedin hiring post" },
      ]
    } satisfies AIResponse),

};