import type { AIResponse } from "../../../app/chat/pages/chat.type";

export const initResponses = {
  askRole: () =>
    ({
      type: "text",
      text: "Sure, For which position or role are we hiring?",
      suggestions: [
        { label: "Frontend Engineer", action: "role:frontend" },
        { label: "Backend Engineer", action: "role:backend" },
        { label: "Fullstack", action: "role:fullstack" }
      ]
    } satisfies AIResponse),

  default: () =>
    ({
      type: "text",
      text: "Tell me what role you want to hire for.",
      suggestions: [
        { label: "Frontend Engineer", action: "role:frontend" },
        { label: "Backend Engineer", action: "role:backend" },
        { label: "Fullstack", action: "role:fullstack" }
      ]
    } satisfies AIResponse)
};