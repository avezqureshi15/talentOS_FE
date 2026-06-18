import type { AIResponse } from "../../../app/chat/pages/chat.type";
import { cleanMarkdown, context } from "../util";

export const candidateStatusResponses = {
  default: () =>
    ({
      type: "stream",
      steps: [
        "Querying Talent OS Database...",
        "Fetching candidate interview pipeline...",
        "Compiling round-wise evaluation..."
      ],
      suggestions: [
        { label: "Get more Details about Round", action: "role:details" },
        { label: "Cancel next Round", action: "role:cancel" }
      ],
      final: [
        {
          type: "markdown",
          content: cleanMarkdown(`
# 📊 Candidate Interview Status — ${context.role}

## 🧑‍💼 Interview Pipeline Overview

### 🔹 Screening Round
- **Interviewer:** Neel  
- **Status:** Cleared initial screening  
- **Remarks:** Good communication and role alignment  

---

### 🔹 Technical Round 1
- **Interviewer:** Sandheep Kumar  
- **Status:** Completed  
- **Remarks:** Strong fundamentals. Solved core DSA/system problems effectively  

---

### 🔹 Technical Round 2
- **Interviewer:** Pranav Sathish  
- **Status:** In Progress  
- **Remarks:** Interview is currently ongoing  

---

## 📌 Summary
- Candidate cleared Screening round
- Technical Round 1 passed successfully
- Technical Round 2 is ongoing
- Overall: Positive progression so far

---

## ⚡ Current Status
🟡 Candidate is actively in Technical Round 2
`)
        }
      ]
    } satisfies AIResponse)
};