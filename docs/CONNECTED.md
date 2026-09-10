# Changes — talentOS + ai-recruitment-poc Integration

## What Was Built

A service-to-service integration that lets talentOS users move candidates to AI screening (Vapi voice call) and AI video interview (LiveKit avatar) rounds on the ai-recruitment-poc platform — **without leaving the talentOS UI**.

---

## Architecture

```
talentOS_FE (React)
  User clicks "Move to AI Screening" / "Move to AI Interview"
  ↓  (axios HTTP)
talentOS_BE (FastAPI :8001)
  ├─ /api/v1/hiring-requests/{hr_id}/ai/candidates/{cand_id}/move-to-screening
  ├─ /api/v1/hiring-requests/{hr_id}/ai/candidates/{cand_id}/trigger-interview
  │
  │  (httpx — API key auth: rhub_...)
  ↓
ai-recruitment-poc (FastAPI :8080)
  └─ /internal/talentos/  (self-contained module)
       ├─ POST /jobs
       ├─ POST /jobs/{id}/candidates
       ├─ POST /jobs/{id}/candidates/{id}/trigger-screening
       ├─ GET  /jobs/{id}/candidates/{id}/screening
       ├─ POST /jobs/{id}/candidates/{id}/trigger-interview
       └─ GET  /jobs/{id}/candidates/{id}/interviews
```

---

## ai-recruitment-poc — Changes

### Footprint: **1 file modified** (main.py), **4 files created** in self-contained module

| File | Action | Purpose |
|---|---|---|
| `backend/app/main.py` | **Modified** (+2 lines) | Import + register `/internal/talentos` router |
| `modules/talentos_integration/__init__.py` | **Created** | Package marker |
| `modules/talentos_integration/talentos_integration_schema.py` | **Created** | 7 Pydantic schemas (request/response) |
| `modules/talentos_integration/talentos_integration_service.py` | **Created** | Adapter service using existing models/repos |
| `modules/talentos_integration/talentos_integration_router.py` | **Created** | 7 endpoints at `/internal/talentos` |

No changes to settings.py, .env.example, dependencies.py, or any other existing file. The entire integration is **one directory** that can be removed with `rm -rf modules/talentos_integration/`.

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/internal/talentos/jobs` | Create job from HiringRequest data |
| `POST` | `/internal/talentos/jobs/{id}/candidates` | Add candidate (name/email/phone) |
| `GET` | `/internal/talentos/jobs/{id}/candidates` | List candidates |
| `POST` | `/internal/talentos/jobs/{id}/candidates/{id}/trigger-screening` | Trigger screening (bypassed — creates `pass` result) |
| `GET` | `/internal/talentos/jobs/{id}/candidates/{id}/screening` | Get screening result |
| `POST` | `/internal/talentos/jobs/{id}/candidates/{id}/trigger-interview` | Create interview session |
| `GET` | `/internal/talentos/jobs/{id}/candidates/{id}/interviews` | List interviews |

### Auth

Uses existing `RequireSuperAdmin` → `get_current_user()`. Works with `rhub_` API keys out of the box (returns synthetic `User(role="superadmin")`).

### Screening Bypass

The `trigger-screening` endpoint creates a `ScreeningCall(result="pass", call_status="completed")` so candidates are immediately interview-ready — no actual Vapi phone call. If real Vapi calls are needed later, remove the bypass and call the existing `screening_trigger_service`.

### Job Creation

Job payload from `HiringRequest`:
```json
{
  "title": "string",
  "description": "string + location/department/type appended",
  "required_skills": ["string"],
  "location": "string",
  "department": "string",
  "employment_type": "string"
}
```

---

## talentOS_BE — Changes

### 4 files modified

| File | Change |
|---|---|
| `app/core/config.py` | Added `RH_API_KEY: str = ""` setting |
| `app/core/ai_recruitment_client.py` | Added `create_job()` method + API key support in `_headers()` |
| `app/modules/hiring_requests/ai_integration_router.py` | `_get_rh_job_id` → `_get_or_create_rh_job` (auto-creates job) |
| `.env.example` | Added `RH_API_KEY=` |

### Auto-Create Job Flow

When `move_to_screening` is called:

1. Fetches `HiringRequest` from DB by `hiring_request_id`
2. **If `rh_external_job_id` is NULL**:
   - Calls `POST /internal/talentos/jobs` with `{title, description, required_skills, location, department, employment_type}` from the HiringRequest
   - Stores the returned job `id` as `hr.rh_external_job_id`
   - Commits to DB
3. **If `rh_external_job_id` exists**: uses it directly
4. Then creates candidate in ai-recruitment-poc
5. Stores returned candidate `id` as `candidate.rh_external_candidate_id`
6. Triggers screening

### Auth Priority

The `AiRecruitmentClient._headers()` method:
1. If `RH_API_KEY` env var is set → uses it as Bearer token (preferred)
2. Falls back to RS256 service JWT (`create_service_token()`) — only works if ai-recruitment-poc verifies it

---

## talentOS_FE — Changes

**0 files modified.** The frontend was already properly wired:

- `services/ai/ai.ts` — `moveToScreening()` sends `{name, email, phone, resume_url}` to BE
- `hooks/use-move-to-screening.ts` — TanStack mutation hook
- `hooks/use-trigger-ai-interview.ts` — TanStack mutation hook
- `components/detail/use-bulk-selection.ts` — orchestrator calls both mutations in sequence
- `constants/api-endpoints.ts` — all 4 AI endpoint templates defined

---

## Full User Flow

### Move to AI Screening

1. HR user selects candidates in `detail.tsx` and clicks **"Move to AI Screening"**
2. `use-bulk-selection.ts` → for each candidate:
   - `moveToScreeningMut({ name, email, phone, resume_url })` → `POST /api/v1/hiring-requests/{id}/ai/candidates/{candId}/move-to-screening`
   - talentOS_BE: auto-creates job if needed → creates candidate in ai-recruitment-poc → triggers screening
   - Then `triggerAiInterviewMut({ interview_type: "AI_SCREENING" })` → `POST .../trigger-interview`
   - Then `updateCandidateRoundStatusMut(...)` → updates local round status

### Move to AI Interview

1. HR user selects candidates and clicks **"Move to AI Interview"**
2. `use-bulk-selection.ts` → for each candidate:
   - `triggerAiInterviewMut({ interview_type: "AI_INTERVIEW" })` → creates interview session on ai-recruitment-poc + local Round record
   - `updateCandidateRoundStatusMut(...)` → updates local round status

---

## How to Test

### Prerequisites

1. **Create an API key on ai-recruitment-poc** (via admin dashboard → App Keys):
   ```
   POST /api/app-keys
   { "name": "talentos-integration" }
   → { "full_key": "rhub_abc123..." }
   ```

2. **Set env vars on talentOS_BE** (`.env`):
   ```
   RH_SERVICE_URL=http://localhost:8080
   RH_API_KEY=rhub_abc123...
   ```

3. **Run both servers**:
   ```powershell
   # ai-recruitment-poc
   cd ai-recruitment-poc
   ./start-dev.ps1

   # talentOS_BE
   cd talentOS_BE
   uvicorn main:app --reload --port 8001
   ```

### Test the Full Flow (automated)

```bash
cd ai-recruitment-poc/backend
python -m pytest tests/test_talentos_integration.py -v
```

This tests:
- Create job → verify description enrichment
- Create candidate → verify fields + pipeline status
- Trigger screening → verify bypass result
- Get screening result → verify pass
- List candidates → verify count
- Duplicate candidate → 409
- Duplicate screening → 409
- Trigger interview → verify created
- List interviews → verify count
- No auth → 401
- Invalid API key → 401

### Test via curl

```bash
# Create job
curl -X POST http://localhost:8080/internal/talentos/jobs \
  -H "Authorization: Bearer rhub_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Senior Engineer","description":"Backend role","required_skills":["Python"],"location":"Bangalore","department":"Engineering","employment_type":"full-time"}'

# Create candidate
curl -X POST http://localhost:8080/internal/talentos/jobs/{job_id}/candidates \
  -H "Authorization: Bearer rhub_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul","email":"rahul@test.com","phone":"+919876543210"}'

# Trigger screening
curl -X POST http://localhost:8080/internal/talentos/jobs/{job_id}/candidates/{cand_id}/trigger-screening \
  -H "Authorization: Bearer rhub_YOUR_KEY"
```

### Test from talentOS UI

1. Log in to talentOS
2. Navigate to a Hiring Request with candidates
3. Select candidates via checkboxes
4. Click **"Move to AI Screening"**
5. Verify toast: "X moved to AI Screening"
6. Candidate round status should update to "SCREENING_ROUND_SCHEDULED"

---

## File Reference

### New Files (ai-recruitment-poc)
```
backend/app/modules/talentos_integration/
├── __init__.py
├── talentos_integration_schema.py
├── talentos_integration_service.py
└── talentos_integration_router.py
```

### Modified Files (ai-recruitment-poc)
```
backend/app/main.py              (+2 lines)
```

### Modified Files (talentOS_BE)
```
app/core/config.py                (+1 line)
app/core/ai_recruitment_client.py (+25 lines)
app/modules/hiring_requests/ai_integration_router.py
.env.example                      (+1 line)
```

### Test Files
```
ai-recruitment-poc/backend/tests/test_talentos_integration.py
```
