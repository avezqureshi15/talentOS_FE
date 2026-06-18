import type { AIResponse } from "../../../app/chat/pages/chat.type";
import { cleanMarkdown, context } from "../util";

export const jdAddBonusResponses = {
    default: () =>
    ({
        type: "stream",
        steps: [
            "Understanding user intent...",
            "Fetching Role , Band Level from Webtrack...",
            "Fetching Responsibilities related details from Webtrack...",
            "Generating resume based on Webknot's KPI's..."
        ],
        suggestions: [
            { label: "Publish Job description", action: "role:make job description" },
            { label: "Cancel Application", action: "role:make linkedin hiring post" }
        ],
        final: [
            {
                type: "markdown",
                content: cleanMarkdown(`

OK, I’ve updated the job description with React Native as a bonus skill.

# 💼 Senior ${context.role}

## 🌟 Overview
We are hiring a senior engineer to design and scale systems in a product-based environment.

---

## 🧩 Responsibilities
- Build scalable systems
- Lead architecture decisions
- Work on distributed frontend/backend systems
- Mentor engineers

---

## 🎯 Requirements
- **5+ years of professional experience**
- Strong system design skills
- Production-level experience
- Experience with modern frontend/mobile ecosystems

---

## 🚀 Nice to Have
- Microfrontend experience
- Leadership experience
- **React Native experience (bonus)**
`)
            }
        ]
    } satisfies AIResponse)
};