# Page Data Contracts — Frontend ↔ Backend

## 1. Slot Booking Page (`/book-slot`)

### Purpose
Interviewer picks available dates & time slots for a candidate interview round and submits 3 preferred slots.

---

### 1.1 GET – Fetch Booking Config

**Endpoint:** `GET /api/interviews/:interviewId/booking-config`

**Purpose:** Returns all data needed to render the slot-booking page (left context panel, calendar availability, slot definitions).

**Response Body:**

```jsonc
{
  "context": {
    "stage": "Technical Round 1",          // badge label, shown in uppercase
    "candidate_name": "Rohan Mehta",        // main title heading
    "position": "Frontend Engineer",        // meta row 1
    "interview_date": "Interviewed: 26 Jun 2026",  // meta row 2, string is rendered as-is
    "interviewer": "Interviewer: Avez Qureshi",    // meta row 3, string is rendered as-is
    "guidelines": "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential."
  },

  // ── Calendar availability ──
  // Keys are ISO date strings (YYYY-MM-DD), values are the slots for that day.
  // Frontend renders 1 calendar month at a time. Send slots only for dates
  // that fall within the visible month (or the next ~60 days).
  "available_slots": {
    "2026-07-01": [
      { "label": "9:00 AM – 9:30 AM", "available": true },
      { "label": "9:30 AM – 10:00 AM", "available": false },
      { "label": "10:00 AM – 10:30 AM", "available": true }
      // ... 18 half-hour slots (9:00 AM – 6:00 PM)
    ],
    "2026-07-02": [
      // same structure
    ]
    // … more dates
  },

  // ── Slot definitions (used to generate the full grid) ──
  // Frontend uses slots[] to render the 3-column AM/PM grid.
  // If a date key exists in available_slots, those override availability;
  // otherwise every slot defaults to available: true.
  "slots": [
    { "label": "9:00 AM – 9:30 AM", "group": "AM" },
    { "label": "9:30 AM – 10:00 AM", "group": "AM" },
    // … 18 half-hour slots
    { "label": "5:30 PM – 6:00 PM", "group": "PM" }
  ],

  // ── Timezone options (rendered as <select>) ──
  "timezones": [
    { "value": "Asia/Kolkata", "label": "India Standard Time (UTC+5:30)" },
    { "value": "America/New_York", "label": "Eastern Time (UTC-5)" },
    { "value": "Europe/London", "label": "Greenwich Mean Time (UTC+0)" }
    // … any subset of IANA timezones
  ]
}
```

**UI Mapping:**

| JSON field | UI element |
|---|---|
| `context.stage` | Badge pill (uppercase, muted text) |
| `context.candidate_name` | Large heading text |
| `context.position` | Meta row (briefcase icon) |
| `context.interview_date` | Meta row (calendar icon) |
| `context.interviewer` | Meta row (user icon) |
| `context.guidelines` | Info note box (info-circle icon) |
| `available_slots` | Date cells in calendar get a dot indicator; selecting a date loads that date's slots |
| `slots[]` | 3-column grid, AM label above first 9, PM label above last 9 |
| `slots[].available` | `true` = clickable, `false` = disabled ("Unavailable") |
| `timezones[]` | Dropdown select (globe icon, native `<select>`) |

---

### 1.2 POST – Confirm Slot Selection

**Endpoint:** `POST /api/interviews/:interviewId/book-slots`

**Request Body:**

```json
{
  "date": "2026-07-01",
  "selected_slots": [
    "9:00 AM – 9:30 AM",
    "10:00 AM – 10:30 AM",
    "2:00 PM – 2:30 PM"
  ],
  "timezone": "Asia/Kolkata"
}
```

**Response Body (Success):**

```json
{
  "status": "confirmed",
  "message": "Slots submitted successfully. The candidate will be notified.",
  "booking_id": "uuid-string"
}
```

**Response Body (Validation Error):**

```json
{
  "status": "error",
  "message": "At least 3 slots must be selected.",
  "code": "INSUFFICIENT_SLOTS"
}
```

**Frontend Behaviour:**
- On success → shows full-screen green checkmark with "Booking Confirmed" + average rating
- Disables all inputs (textarea, submit button replaced by success badge)
- On error → shows inline error message (not implemented yet, but should be wired)

---

## 2. Rate Candidate Page (`/rate-candidate`)

### Purpose
Interviewer rates a candidate across 4 criteria using a 4-level rubric, toggles verified hard-skill chips, writes notes, and submits a final verdict.

---

### 2.1 GET – Fetch Rating Config

**Endpoint:** `GET /api/interviews/:interviewId/rating-config`

**Purpose:** Returns all data needed to render the rate-candidate page (context panel, criteria, rubric, skill options).

**Response Body:**

```jsonc
{
  "context": {
    "stage": "Technical Round 1",
    "candidate_name": "Rohan Mehta",
    "position": "Frontend Engineer",
    "interview_date": "Interviewed: 26 Jun 2026",
    "interviewer": "Interviewer: Avez Qureshi",
    "guidelines": "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential."
  },

  // ── Rating criteria ──
  // Each criterion renders as a card with a segment track [1][2][3][4].
  "criteria": [
    { "key": "communication", "label": "Communication" },
    { "key": "technical_skills", "label": "Technical Skills" },
    { "key": "problem_solving", "label": "Problem Solving" },
    { "key": "cultural_fit", "label": "Cultural Fit" }
  ],

  // ── Rubric levels ──
  // Shared across all criteria. score=0 means unrated.
  "rubric_levels": [
    {
      "score": 1,
      "icon": "bx bx-x-circle",
      "label": "Strong Reject",
      "desc": "Completely lacked the skill"
    },
    {
      "score": 2,
      "icon": "bx bx-error",
      "label": "Below Average",
      "desc": "Needed heavy prompting"
    },
    {
      "score": 3,
      "icon": "bx bx-check-circle",
      "label": "Proficient",
      "desc": "Met the core requirements comfortably"
    },
    {
      "score": 4,
      "icon": "bx bx-hot",
      "label": "Exceptional",
      "desc": "Exceeded expectations / Showed mastery"
    }
  ],

  // ── Skill chips ──
  // Rendered as toggleable pill buttons in a flex-wrap grid.
  "skills": [
    { "key": "react", "label": "React" },
    { "key": "typescript", "label": "TypeScript" },
    { "key": "nextjs", "label": "Next.js" },
    { "key": "state_mgmt", "label": "State Management" },
    { "key": "system_design", "label": "System Design" },
    { "key": "testing", "label": "Testing" },
    { "key": "css", "label": "CSS / Tailwind" },
    { "key": "graphql", "label": "GraphQL" }
  ]
}
```

**UI Mapping:**

| JSON field | UI element |
|---|---|
| `context.*` | Same as slot-booking (see table above) |
| `criteria[]` | 4 cards, each with a segmented [1][2][3][4] track |
| `rubric_levels[]` | Below the active segment: icon + label + description |
| `skills[]` | Toggleable pill chips (active = white fill, dark text; inactive = glass fill, gray text) |

---

### 2.2 POST – Submit Rating & Review

**Endpoint:** `POST /api/interviews/:interviewId/submit-rating`

**Request Body:**

```json
{
  "ratings": {
    "communication": 3,
    "technical_skills": 4,
    "problem_solving": 2,
    "cultural_fit": 3
  },
  "skills": [
    "react",
    "typescript",
    "state_mgmt"
  ],
  "review": "Strong React and TypeScript fundamentals. Could improve on system design and breaking down large problems. Good team player overall.",
  "verdict": "advance"
}
```

**Field Rules:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `ratings` | `Record<string, number>` | Yes | Keys match `criteria[].key`. Value: 0–4 (0 = not rated). At least one must be > 0. |
| `skills` | `string[]` | No | Array of `skills[].key` values the interviewer confirmed. |
| `review` | `string` | No | Free text, max 500 chars enforced client-side. |
| `verdict` | `"reject" \| "hold" \| "advance"` | Yes | Maps to `ai_status` / `hr_status` conflict pipeline. |

**Response Body (Success):**

```json
{
  "status": "submitted",
  "average_rating": 3.0,
  "verdict": "advance",
  "message": "Review submitted successfully."
}
```

**Response Body (Validation Error):**

```json
{
  "status": "error",
  "message": "Verdict is required.",
  "code": "MISSING_VERDICT"
}
```

**Frontend Behaviour:**
- Submit button disabled until: at least 1 criterion rated AND a verdict selected
- On success → full-screen green checkmark with "Review Submitted" + average rating + verdict pill
- On error → inline error message (to be wired; currently the mock just sets `submitted = true`)

---

## 3. Backend Database Columns (Reference)

These are the columns the backend is expected to store. Shared across both features:

```sql
CREATE TABLE interview_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id    UUID NOT NULL REFERENCES interviews(id),
  candidate_name  VARCHAR(255) NOT NULL,
  position        VARCHAR(255) NOT NULL,
  interviewer     VARCHAR(255) NOT NULL,
  interview_round VARCHAR(100),
  ratings         JSONB,              -- {"communication": 3, ...}
  average_rating  NUMERIC(3,1),        -- computed average of ratings
  verified_skills TEXT[],              -- ["react", "typescript"]
  verdict         VARCHAR(20),         -- 'reject' | 'hold' | 'advance'
  review_notes    TEXT,
  ai_status       VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'matched' | 'conflict'
  hr_status       VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'reviewed'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE slot_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id    UUID NOT NULL REFERENCES interviews(id),
  date            DATE NOT NULL,
  selected_slots  TEXT[],              -- ["9:00 AM – 9:30 AM", ...]
  timezone        VARCHAR(50),
  status          VARCHAR(20) DEFAULT 'confirmed',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Mock → Real Integration Checklist

For each page, replace the mock in `*.constants.ts` with real API calls:

| Page | Constant File | Current Mock | Replace With |
|---|---|---|---|
| Slot Booking | `slot-booking.constants.ts` | `CONTEXT_SECTIONS`, `MOCK_SLOTS`, `TIMEZONES`, `BOOKING_LABELS` | `GET /api/interviews/:id/booking-config` |
| Slot Booking | (submit) | Hardcoded `setConfirmed(true)` | `POST /api/interviews/:id/book-slots` |
| Rate Candidate | `rate-candidate.constants.ts` | `CONTEXT_SECTIONS` | `GET /api/interviews/:id/rating-config` |
| Rate Candidate | (submit) | Hardcoded `setSubmitted(true)` | `POST /api/interviews/:id/submit-rating` |

The page components (`slot-booking.tsx`, `rate-candidate.tsx`) already accept the data as props / state and render based on the shape defined above. Backend just needs to return the same structure as the mock objects.
