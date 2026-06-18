import type { AIResponse } from "../../../app/chat/pages/chat.type";
import { cleanMarkdown, context } from "../util";

export const humanlyResponses = {
  default: () =>
    ({
      type: "stream",
      steps: [
        "Understanding user intent...",
        "Adding Human Touch..",
        "Generating response..."
      ],
      suggestions: [
        { label: "Publish Job description", action: "role:make job description" },
        { label: "Cancel Application", action: "role:make linkedin hiring post" }
      ],
      final: [
        {
          type: "markdown",
          content: cleanMarkdown(`
You are correct , it looks more like system generated , let's add a human feel.

# 💼 Senior ${context.role}

## 🌟 Overview
We are looking for a senior engineer who can help us design, build, and scale reliable systems in a fast-moving product environment.

---

## 🧩 Responsibilities
- Design and build scalable systems
- Take ownership of architecture decisions
- Work across frontend and backend distributed systems
- Mentor and guide junior engineers

---

## 🎯 Requirements
- **5+ years of professional experience**
- Strong understanding of system design and architecture
- Experience shipping production-grade applications
- Comfortable working in fast-paced engineering teams

---

## 🚀 Nice to Have
- Experience with microfrontend architecture
- Prior leadership or mentoring experience
- **React Native experience (bonus, not mandatory)**
`)
        }
      ]
    } satisfies AIResponse)
};