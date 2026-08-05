# talentOS — Role Access Guide

**Who is this document for?** Everyone who uses talentOS — including non-technical team members such as HR, interviewers, and reviewers. It explains, in plain language, what each role can see and do inside the product.

**What is a "role"?** A role is a job title inside your organisation's talentOS workspace. Your role decides which pages you can open and which buttons you can click. If a page or button is not listed for your role, you will not see it.

---

## 1. The Roles at a Glance

| Role | In plain words | Best described as |
|---|---|---|
| **Account Admin** | The person in charge of the workspace. Can do everything the organisation allows, except super-admin platform tasks. | "Workspace owner" |
| **Job Owner** | The person who owns a job / hiring request. Creates jobs, manages the hiring team, designs interviews. | "Hiring manager" |
| **Recruiter** | Runs the day-to-day hiring process: moves candidates through stages, schedules interviews, rates candidates. | "Talent acquisition" |
| **Reviewer** | Reviews and rates candidates, and gives a pass/reject opinion. | "Interviewer / evaluator" |
| **Super Admin** | Platform-level administrator (TalentOS platform team). Manages tenants, API keys, roles. Not a normal day-to-day hiring role. | "Platform admin" |

---

## 2. Plain-Language Guide to Actions

Before the page-by-page breakdown, here is what each action actually means:

| Action | What it means |
|---|---|
| **View** | Open a page and read the information on it. |
| **Evaluate** | Give a score / mark a candidate as good or bad (shortlist, rate, or move a candidate forward in a review). |
| **Reject** | Mark a candidate as rejected (with or without a reason). |
| **Move candidates / Workflow** | Advance candidates through the hiring pipeline (e.g., "Move to AI Screening", "Move to AI Interview", shortlist, schedule or cancel interview rounds). This is the *hiring flow* itself. |
| **Create / Edit / Delete a job** | Make a new hiring request, change its details, or remove it. |
| **Export / Report** | Download candidate data or the job report as an Excel/PDF file. |
| **Manage team** | Add or remove team members on a job (interviewers, recruiters). |
| **Design interviews** | Edit the interview plan: add/remove/edit questions and sections, and generate questions with AI. |
| **Submit review** | Send your candidate rating/verdict to the system. *(Open to everyone — see Section 7.)* |
| **Book slots** | Reserve an interviewer slot on the calendar. *(Open to everyone — see Section 7.)* |
| **Manage settings** | Change organisation settings (company name, details). |
| **Manage users** | Invite new users, change their roles, deactivate accounts. |
| **API keys / Apps** | Manage app integrations and secret keys (technical). |

---

## 3. Page-by-Page Breakdown

### 3.1 Logging In & Getting Access
| Role | Login | Invite by email | Self-signup (pending approval) |
|---|---|---|---|
| Account Admin | Yes | Yes | — |
| Job Owner | Yes | Yes | — |
| Recruiter | Yes | Yes | — |
| Reviewer | Yes | Yes | — |
| Super Admin | Yes (platform console) | — | — |

> Anyone with an existing account can log in with their email. New users are added by an Account Admin (or invited). Google login is available for existing users.

### 3.2 Chat (Team Messaging)
| Role | Chat with team |
|---|---|
| Account Admin | Yes |
| Job Owner | Yes |
| Recruiter | Yes |
| Reviewer | Yes |
| Super Admin | Yes |

All roles can chat — this is how HR and interviewers coordinate.

### 3.3 Hiring Requests (the "Jobs" list)
This is the main list of all open hiring requests.

| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| See the list | Yes | Yes | Yes | Yes | Yes |
| Open a job's workspace | Yes | Yes | Yes | Yes | Yes |
| **Create** a new hiring request | Yes | Yes | No | No | Yes |
| **Edit** a hiring request | Yes | Yes | Yes | No | Yes |
| **Delete** a hiring request | Yes | No | No | No | Yes |
| **Export** jobs/candidates (Excel/PDF) | Yes | Yes | Yes | Yes | Yes |
| **Assign team members** to a job | Yes | Yes | No | No | Yes |

### 3.4 Job Workspace → Applications (the Candidate Pipeline)
Every hiring request has an "Applications" workspace showing candidates at every stage (New → AI Screening → Interview → Evaluated → Hired/Rejected).

| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| View candidates and their details | Yes | Yes | Yes | Yes | Yes |
| **Shortlist** a candidate | Yes | Yes | Yes | Yes | Yes |
| **Reject** a candidate | Yes | Yes | Yes | Yes | Yes |
| **Hold** a candidate | Yes | Yes | Yes | Yes | Yes |
| **Move to next stage** (AI Screening / AI Interview / next round) | Yes | Yes | Yes | **No** | Yes |
| **Schedule / reschedule / cancel** interview rounds | Yes | Yes | Yes | **No** | Yes |
| **Bulk actions** (move many candidates at once) | Yes | Yes | Yes | **No** | Yes |
| Search, filter, view timeline, open round details | Yes | Yes | Yes | Yes | Yes |
| Export candidates/report | Yes | Yes | Yes | Yes | Yes |

> **Reviewers** see a **"LIMITED ACCESS"** badge on the Applications page. They can evaluate, shortlist, hold and reject candidates, but they cannot move candidates through the pipeline or schedule interviews — those actions belong to Admins, Job Owners and Recruiters.

### 3.5 Job Workspace → Interview Design (Questions & Plan)
Where interview questions and sections are designed (including AI-generated questions).

| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| View the interview plan & questions | Yes | Yes | Yes | Yes | Yes |
| **Edit** the plan (add/edit questions & sections) | Yes | Yes | **No** | **No** | Yes |
| **Generate questions with AI** | Yes | Yes | **No** | **No** | Yes |
| Export plan as PDF | Yes | Yes | Yes | Yes | Yes |

> Recruiters and Reviewers see a **"READ ONLY"** badge on this page. They can read the questions, but only Admins and Job Owners can change the plan.

### 3.6 Job Workspace → Team Members
Who is attached to this job (interviewers, recruiters, owner).

| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| See the team list | Yes | Yes | Yes | Yes | Yes |
| **Add / remove / change** team members | Yes | Yes | **No** | **No** | Yes |

### 3.7 Job Workspace → Other Pages
| Page | Purpose | Who can open |
|---|---|---|
| **Decision Board** | Visual board to compare and decide on final candidates | All roles |
| **Round Details** | Deep-dive into a specific interview round and its feedback | All roles |
| **Proctoring** | Monitoring settings for online interviews | All roles |
| **Email Manager** | View/manage candidate communication templates | All roles |

### 3.8 Slot Booking (Interviewer Availability)
Interviewers choose their available time slots on the calendar.

**Open to everyone.** Every role can book and manage slots. Even though this is a scheduled activity, the product deliberately leaves it open so interviewers never need special permissions.

### 3.9 Rate Candidate (Review Submission)
The review form interviewers fill after a round: scores, skills, verdict.

**Open to everyone.** Every role can rate a candidate and submit the review. The "Submit" button is never hidden — like slot booking, review submission is deliberately open to all so interviewers can always record their feedback.

### 3.10 Organisation Settings
| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| **View** organisation profile | Yes | Yes | Yes | Yes | Yes |
| **Edit** organisation profile | Yes | **No** | **No** | **No** | Yes |

> Non-admins see the organisation profile in **read-only** mode. Only the Account Admin can change it.

### 3.11 Admin → Users Management
| Capability | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| Invite new users | Yes | No | No | No | Yes |
| Change user roles | Yes | No | No | No | Yes |
| Deactivate users | Yes | No | No | No | Yes |
| See which jobs a user works on | Yes | No | No | No | Yes |

### 3.12 Admin → Apps (API Keys & Integrations)
Technical page for integrations.

| Capability | Account Admin | Super Admin |
|---|---|---|
| Manage API keys / apps | Yes | Yes |

### 3.13 Super Admin Only (Platform Console)
| Page | Purpose | Who can open |
|---|---|---|
| **Tenants** | Manage customer organisations | Super Admin only |
| **Roles & Permissions** | Configure what roles can do | Super Admin only |
| **Platform Apps / API keys** | Platform-level integrations | Super Admin only |

---

## 4. Master Comparison Table

Legend: **Yes** = available · **No** = not available (page/button not shown) · **View only** = can open and read, but not change

| Feature / Page | Account Admin | Job Owner | Recruiter | Reviewer | Super Admin |
|---|---|---|---|---|---|
| **Chat** | Yes | Yes | Yes | Yes | Yes |
| **Hiring Requests — view list** | Yes | Yes | Yes | Yes | Yes |
| Create hiring request | Yes | Yes | No | No | Yes |
| Edit hiring request | Yes | Yes | Yes | No | Yes |
| Delete hiring request | Yes | No | No | No | Yes |
| Export / reports | Yes | Yes | Yes | Yes | Yes |
| Assign team members | Yes | Yes | No | No | Yes |
| **Applications — view candidates** | Yes | Yes | Yes | Yes | Yes |
| Shortlist / Hold candidate | Yes | Yes | Yes | Yes | Yes |
| Reject candidate | Yes | Yes | Yes | Yes | Yes |
| Move candidate to next stage | Yes | Yes | Yes | No | Yes |
| Schedule / reschedule / cancel rounds | Yes | Yes | Yes | No | Yes |
| Bulk move candidates | Yes | Yes | Yes | No | Yes |
| **Interview Design — view plan** | Yes | Yes | Yes | Yes | Yes |
| Edit interview plan | Yes | Yes | No | No | Yes |
| Generate questions with AI | Yes | Yes | No | No | Yes |
| **Team Members — view** | Yes | Yes | Yes | Yes | Yes |
| Manage team members | Yes | Yes | No | No | Yes |
| **Decision Board / Round Details / Proctoring / Email Manager** | Yes | Yes | Yes | Yes | Yes |
| **Slot booking** | Yes | Yes | Yes | Yes | Yes |
| **Rate Candidate (submit review)** | Yes | Yes | Yes | Yes | Yes |
| **Organisation — view** | Yes | Yes | Yes | Yes | Yes |
| Organisation — edit | Yes | No | No | No | Yes |
| **Users management (invite/roles/deactivate)** | Yes | No | No | No | Yes |
| **Apps / API keys** | Yes | No | No | No | Yes |
| **Roles & Permissions (platform)** | No | No | No | No | Yes |
| **Tenants (platform)** | No | No | No | No | Yes |

---

## 5. What the Header Badges Mean

You may see small badges at the top-right of a page:

| Badge | Meaning |
|---|---|
| **LIMITED ACCESS** | You can view, evaluate and reject candidates here, but moving candidates between stages and scheduling are restricted to Admins, Job Owners and Recruiters. |
| **READ ONLY** | You can view this page's content, but you cannot edit it. Only Admins and Job Owners can make changes here. |
| Job role badge (e.g., "Interviewer") | The team role you have on this particular job. |

---

## 6. Common Questions (FAQ)

**Q: I am a Reviewer — why can't I see "Move to AI Screening"?**
A: Moving candidates between stages is part of the hiring flow, which is reserved for Admins, Job Owners and Recruiters. Reviewers evaluate and reject candidates but do not operate the pipeline. You'll see the **LIMITED ACCESS** badge on that page.

**Q: I am a Recruiter — why can't I edit the interview plan?**
A: Interview plans are owned by Admins and Job Owners. You can view all questions and use them in interviews. You'll see the **READ ONLY** badge.

**Q: Can I still book a slot if I don't have special permissions?**
A: Yes. Slot booking is open to everyone — no special permission needed.

**Q: Can I still rate a candidate and submit my review?**
A: Yes. Review submission is open to everyone, just like slot booking. The Submit button is always available.

**Q: I am an Account Admin — is there anything I cannot do?**
A: Inside your workspace, you can do everything: manage users, edit settings, create/edit/delete jobs, manage team, design interviews, and run the full pipeline. Platform-level tasks (tenants, roles, platform API keys) are reserved for Super Admin.

**Q: Who can see my candidate evaluations?**
A: Anyone with access to the job's Applications workspace. Evaluations and rejections are part of the shared pipeline.

---

## 7. Important Design Notes

1. **Open to everyone by design:** Two features are intentionally available to every role — **slot booking** and **review (rate candidate) submission**. Even where an internal permission exists, the product never blocks these, so interviewers and reviewers always have what they need.
2. **Settings:** All roles can *view* organisation details. Only the Account Admin can *edit* them.
3. **Access is enforced at two levels:** The app hides pages/buttons you cannot use (so you are never shown a button that would fail), and the server independently blocks actions you are not allowed to perform. This keeps things safe even if a URL is shared manually.
4. **This guide reflects the standard workspace.** Your organisation's Super Admin can fine-tune role permissions in the platform console; if something looks different from this guide, check with your Account Admin or Super Admin.

---

*Document maintained alongside the talentOS codebase. Roles: Account Admin, Job Owner, Recruiter, Reviewer, Super Admin.*
