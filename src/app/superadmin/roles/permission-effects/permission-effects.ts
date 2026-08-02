export type PermissionEffect = {
  code: string;
  summary: string;
  whatTheyCanDo: string[];
  disabled: {
    blurb: string;
    lostActions: string[];
    stillWorks: string[];
  };
  scenario: string;
  technical?: string;
  related?: string[];
};

export const PERMISSION_EFFECTS: Record<string, PermissionEffect> = {
  "application.view": {
    code: "application.view",
    summary:
      "The master key to the Applications area — it lets the role open candidate lists, candidate profiles and every hiring step for a job.",
    whatTheyCanDo: [
      "Open the Applications page of any job and see the full candidate list",
      "Open any candidate's profile and follow them through every round",
      "View round details, schedules, AI screening results and final verdicts",
      "View (but not edit) the AI Interview Plan and the Call Window",
    ],
    disabled: {
      blurb:
        "This is the master switch for the entire Applications area. Without it, every screen that loads candidate or interview data stops working — the user sees errors or empty pages, and the backend refuses every application-related request.",
      lostActions: [
        "Candidate list, candidate profiles and round details (blocked by the API)",
        "AI screening results and final verdicts (blocked)",
        "Interview Plan and Call Window views (blocked)",
        "Sending application-related emails (blocked)",
      ],
      stillWorks: [
        "Chat and the Job Listings area (subject to their own permissions)",
        "Organization settings (settings.view / settings.edit)",
      ],
    },
    scenario:
      "Anita is a reviewer. If this switch is turned off, the moment she opens a job the candidate list never loads and every applicant option shows an error. She can still chat, but she can no longer see who applied.",
    technical:
      "Backend: GET/POST /applications, most /rounds endpoints, /interviews, /email/send, /ai/questions and /call-window all require application.view (403 \"Missing required permission\"). Exception: GET /rounds/{round_id} is public so the Rate Candidate link works for logged-out reviewers. Frontend does not hide these screens yet.",
    related: ["application.evaluate", "application.reject", "application.workflow"],
  },

  "application.evaluate": {
    code: "application.evaluate",
    summary:
      "Lets the role grade and shortlist candidates — deciding who moves ahead in the screening.",
    whatTheyCanDo: [
      "Shortlist a candidate straight from the applicant card",
      "Use \"Select Candidate\" and \"Hold\" from the candidate's action menu",
      "View the shortlisted candidate list",
    ],
    disabled: {
      blurb:
        "All evaluation controls disappear from applicant cards. The role can still look at candidates, but cannot mark anyone as shortlisted, selected or on hold.",
      lostActions: [
        "Shortlist button (hidden on applicant cards)",
        "\"Select Candidate\" and \"Hold\" options (hidden in the candidate menu)",
        "Shortlisted candidate list (blocked by the API)",
      ],
      stillWorks: [
        "View candidates and their details (application.view)",
        "Reject candidates (application.reject)",
        "Move candidates between rounds (application.workflow, if enabled)",
      ],
    },
    scenario:
      "Rahul is a recruiter. Without Evaluate Applications he can read every profile, but the Shortlist button simply doesn't exist for him — so his team lead has to do the shortlisting.",
    technical:
      "Backend: GET /jobs/{job_id}/candidates and /candidates/shortlisted require application.evaluate. The AI evaluation webhook (/evaluations/evaluate-async) is key-based and not affected.",
    related: ["application.view", "application.reject", "application.workflow"],
  },

  "application.reject": {
    code: "application.reject",
    summary: "Lets the role reject candidates who are not a fit.",
    whatTheyCanDo: [
      "Press Reject on any applicant card",
      "Use \"Reject Candidate\" from the candidate's action menu",
    ],
    disabled: {
      blurb:
        "All Reject controls are hidden on applicant cards. The role can no longer mark anyone as rejected from the user interface.",
      lostActions: [
        "Reject button (hidden on applicant cards)",
        "\"Reject Candidate\" menu option (hidden)",
      ],
      stillWorks: [
        "View and shortlist candidates (application.view / application.evaluate)",
      ],
    },
    scenario:
      "If a recruiter loses Reject Applications, they can see every profile and shortlist, but they have to leave rejection notes for an account admin to process.",
    technical:
      "Frontend hides the buttons today. Backend enforcement is pending — the reject endpoint currently only checks application.view, so the API still works if called directly.",
    related: ["application.view", "application.evaluate"],
  },

  "hiring_request.create": {
    code: "hiring_request.create",
    summary: "Lets the role create new job postings in Job Listings.",
    whatTheyCanDo: [
      "Press \"Create\" on the Job Listings page and publish a new job opening",
    ],
    disabled: {
      blurb:
        "The Create button disappears from the Job Listings page, so the role can no longer post new job openings.",
      lostActions: [
        "\"Create\" button on the Job Listings page (hidden)",
        "Creating a job via the API (blocked with 403)",
      ],
      stillWorks: [
        "View the job list and open existing jobs (hiring_request.view)",
        "Edit existing jobs (hiring_request.edit)",
        "Delete existing jobs (hiring_request.delete)",
      ],
    },
    scenario:
      "The job_owner posts jobs. If Create Hiring Requests is switched off, they can still manage jobs that already exist, but the Create button is gone — no new openings can be published.",
    technical:
      "Backend: POST /hiring-requests requires hiring_request.create (superadmin and account_admin pass automatically by role).",
    related: ["hiring_request.edit", "hiring_request.view", "hiring_request.delete"],
  },

  "hiring_request.edit": {
    code: "hiring_request.edit",
    summary: "Lets the role change the details of existing job postings.",
    whatTheyCanDo: [
      "Edit the title, description, department and other details of a job",
    ],
    disabled: {
      blurb:
        "This permission is reserved for fine-grained control. Today editing a job is governed by the role's access level (recruiter and above can edit), so switching this off does not change the screens yet.",
      lostActions: [
        "No immediate UI change — edit access is currently based on role level, not this switch",
      ],
      stillWorks: [
        "Viewing, creating and deleting jobs (their own permissions)",
      ],
    },
    scenario:
      "Fine-grained editing control is on the roadmap. Once backend enforcement lands, this switch will decide exactly who can edit a job; for now it is a placeholder.",
    technical:
      "Backend: PUT /hiring-requests/{id} is not permission-gated yet (it uses role rank >= recruiter). Enforcement pending.",
    related: ["hiring_request.create", "hiring_request.view", "hiring_request.delete"],
  },

  "hiring_request.view": {
    code: "hiring_request.view",
    summary: "Lets the role see job postings in Job Listings.",
    whatTheyCanDo: [
      "See \"Job Listings\" in the left sidebar and open any job",
    ],
    disabled: {
      blurb:
        "The Job Listings item disappears from the left sidebar. Direct links may still open the page, but several backend job APIs are blocked.",
      lostActions: [
        "\"Job Listings\" sidebar item (hidden)",
        "Some job listing APIs (blocked with 403)",
      ],
      stillWorks: [
        "Chat",
        "The Applications area (application.*) when a job link is available",
      ],
    },
    scenario:
      "A viewer without View Hiring Requests simply won't see Job Listings in their menu anymore — their workspace becomes chat-first.",
    technical:
      "Backend: GET /jobs and /jobs/{id} require hiring_request.view; the /hiring-requests list itself is scoped by team access and not permission-gated yet.",
    related: ["hiring_request.create", "hiring_request.edit", "hiring_request.delete"],
  },

  "hiring_request.delete": {
    code: "hiring_request.delete",
    summary: "Lets the role permanently delete job postings.",
    whatTheyCanDo: [
      "Delete a job posting from Job Listings",
    ],
    disabled: {
      blurb:
        "The role can no longer delete jobs — the delete API rejects them, so any delete action fails with an error.",
      lostActions: [
        "Deleting a job posting (blocked with 403)",
      ],
      stillWorks: [
        "Create, view and edit jobs (their own permissions)",
      ],
    },
    scenario:
      "A safety net: with Delete Hiring Requests off, jobs can be created and edited but never removed by that role — protecting against accidental loss of hiring data.",
    technical:
      "Backend: DELETE /hiring-requests/{id} requires role >= job_owner plus hiring_request.delete.",
    related: ["hiring_request.create", "hiring_request.edit"],
  },

  "user.invite": {
    code: "user.invite",
    summary: "Lets the role send invitations to bring new users into the workspace.",
    whatTheyCanDo: [
      "Open User Management and press \"Invite User\"",
      "See the Pending Invites list, resend or revoke invitations",
    ],
    disabled: {
      blurb:
        "Today the entire User Management page depends on this switch: without it the page and the \"Users\" sidebar item are hidden and invite API calls are rejected.",
      lostActions: [
        "\"Users\" sidebar item and the User Management page (hidden)",
        "\"Invite User\" button and Pending Invites tab (hidden with the page)",
        "Invite, resend and revoke APIs (blocked)",
      ],
      stillWorks: [
        "Everything else an admin does (jobs, settings)",
        "Users can still be managed by a superadmin",
      ],
    },
    scenario:
      "You want only the account admin to bring people in. Switch off Invite Users for recruiter roles — their User Management entry simply vanishes, so no one can bypass the invite process.",
    technical:
      "Backend: invite endpoints currently require user.manage only; enforcing user.invite on them is the pending change that makes this switch truly dynamic.",
    related: ["user.manage"],
  },

  "user.manage": {
    code: "user.manage",
    summary: "Lets the role administer users and control roles in the platform.",
    whatTheyCanDo: [
      "Manage user profiles and details",
      "Access role management (superadmin section)",
    ],
    disabled: {
      blurb:
        "User management and role management screens are hidden — the role loses the ability to administer users and roles entirely.",
      lostActions: [
        "User detail pages (hidden)",
        "Role Management page (hidden — superadmin only anyway)",
        "User and role admin APIs (blocked)",
      ],
      stillWorks: [
        "Inviting users (user.invite, if enabled)",
        "Chat, jobs and applications (their own permissions)",
      ],
    },
    scenario:
      "Rarely turned off. This is the control that keeps user administration in the hands of account admins and superadmins only.",
    technical:
      "Backend: /admin/users and /admin/roles routers require user.manage.",
    related: ["user.invite"],
  },

  "tenant.view": {
    code: "tenant.view",
    summary: "Lets the superadmin see the organization (tenant) list on the platform.",
    whatTheyCanDo: [
      "See \"Tenants\" in the superadmin sidebar",
      "Open any organization's detail page (status, users, apps)",
    ],
    disabled: {
      blurb:
        "The Tenants section disappears for the superadmin and every tenant API is blocked — no organization can be inspected.",
      lostActions: [
        "\"Tenants\" sidebar item (hidden)",
        "Tenant list and detail pages (blocked by the API)",
      ],
      stillWorks: [
        "Apps / API keys management (tenant.edit)",
      ],
    },
    scenario:
      "A superadmin without View Tenant Settings cannot see the list of organizations on the platform at all — it is the master visibility switch for the superadmin area.",
    technical:
      "Backend: /superadmin/tenants router requires tenant.view.",
    related: ["tenant.edit"],
  },

  "tenant.edit": {
    code: "tenant.edit",
    summary: "Lets the superadmin change organizations and manage their apps / API keys.",
    whatTheyCanDo: [
      "Create a new organization (tenant)",
      "Manage apps / API keys for an organization",
    ],
    disabled: {
      blurb:
        "Creating organizations and managing their apps is blocked. Note: editing an organization's basic details currently uses tenant.view, so that still works.",
      lostActions: [
        "Creating a new organization (blocked)",
        "Apps / API key management (hidden and blocked)",
      ],
      stillWorks: [
        "Viewing organizations (tenant.view)",
        "Editing an organization's basic details (currently gated by tenant.view)",
      ],
    },
    scenario:
      "If you want a superadmin who can only inspect organizations, keep View Tenant Settings on and turn Edit Tenant Settings off — they can look but not change anything.",
    technical:
      "Backend: POST /superadmin/tenants requires tenant.view + tenant.edit; the /superadmin/apps router requires tenant.edit.",
    related: ["tenant.view"],
  },

  "api_key.manage": {
    code: "api_key.manage",
    summary: "Lets the role create and manage API keys used for AI integrations.",
    whatTheyCanDo: [
      "Open the Apps / API Keys page and the \"Apps\" tab inside Settings",
      "Create, rotate and delete API keys, and set what they are allowed to do",
    ],
    disabled: {
      blurb:
        "The Apps section disappears: the page and the Settings tab are hidden, and the API key endpoints are blocked.",
      lostActions: [
        "\"Apps\" page (hidden)",
        "\"Apps\" tab inside the Settings modal (hidden)",
        "Create / rotate / delete API keys (blocked)",
      ],
      stillWorks: [
        "Chat, jobs and applications (their own permissions)",
      ],
    },
    scenario:
      "API keys let other systems talk to talentOS as this role. Switch this off and the role can't create new integrations or rotate existing keys.",
    technical:
      "Backend: /admin/apps router requires api_key.manage.",
    related: ["settings.view", "settings.edit"],
  },

  "settings.view": {
    code: "settings.view",
    summary: "Lets the role open the Organization settings page.",
    whatTheyCanDo: [
      "See \"Organization\" in the sidebar and open the organization profile",
    ],
    disabled: {
      blurb:
        "The Organization page and its sidebar item disappear; settings APIs are blocked.",
      lostActions: [
        "\"Organization\" sidebar item (hidden)",
        "Organization settings page (hidden)",
        "Settings APIs (blocked)",
      ],
      stillWorks: [
        "Chat, jobs and applications (their own permissions)",
      ],
    },
    scenario:
      "A clean way to keep lower roles away from organization-level information — without View Settings they never see the Organization page at all.",
    technical:
      "Backend: GET /settings and GET /admin/organization require settings.view.",
    related: ["settings.edit", "api_key.manage"],
  },

  "settings.edit": {
    code: "settings.edit",
    summary: "Lets the role change organization details (name, logo and more).",
    whatTheyCanDo: [
      "Edit the organization profile (name, logo, details) and save the changes",
    ],
    disabled: {
      blurb:
        "The Organization page becomes read-only: the edit form and the Save / Reset buttons disappear and a \"Read-only view\" message is shown. Saving changes is blocked by the API too.",
      lostActions: [
        "Edit form on the Organization page (hidden — read-only view instead)",
        "Save / Reset buttons (hidden)",
        "Update settings APIs (blocked)",
      ],
      stillWorks: [
        "Viewing the Organization page (settings.view)",
      ],
    },
    scenario:
      "The perfect read-only pattern: the account admin can still open the Organization page, but every field is display-only and Save is gone.",
    technical:
      "Backend: PATCH /settings and PATCH /admin/organization require settings.edit.",
    related: ["settings.view"],
  },

  "slot.submit": {
    code: "slot.submit",
    summary:
      "Intended to control slot submission, but today the booking page runs on public email links — this switch does not gate anything.",
    whatTheyCanDo: [
      "Submit a candidate's available time slots for scheduling (via the public booking link)",
    ],
    disabled: {
      blurb:
        "The slot-booking page is public link-based: candidates/faculty who open the link can submit availability even while logged out, with no permission check. This switch is not enforced anywhere today.",
      lostActions: [
        "No immediate UI change (the switch is not wired to any endpoint)",
      ],
      stillWorks: [
        "Public slot booking via email link (unauthenticated)",
        "Everything else (chat, jobs, applications)",
      ],
    },
    scenario:
      "Since booking is public link-based, toggling this switch changes nothing for end users yet. It is reserved for a future flow where only certain roles can submit slots.",
    technical:
      "Backend: POST /slots is now unauthenticated — it requires no token and no permission (only a valid emp_id). slot.submit is not enforced.",
    related: ["slot.view_all"],
  },

  "slot.view_all": {
    code: "slot.view_all",
    summary: "Lets the role view availability slots across candidates.",
    whatTheyCanDo: [
      "View availability slots for employees and candidates",
    ],
    disabled: {
      blurb:
        "All slot endpoints are blocked — any screen that reads or submits availability stops working.",
      lostActions: [
        "Availability slot views (blocked by the API)",
      ],
      stillWorks: [
        "Everything else (chat, jobs, applications)",
      ],
    },
    scenario:
      "Turned off, no one in the role can fetch availability — the admin views freeze. Public booking links keep working because they submit without any permission.",
    technical:
      "Backend: only the admin reads require slot.view_all — GET /slots/by-employee/{employee_id} and GET /slots/employee. POST /slots (the public booking form) is unauthenticated and unaffected.",
    related: ["slot.submit"],
  },

  "review.submit": {
    code: "review.submit",
    summary:
      "Intended to control review submission, but the Rate Candidate form runs on public email links — this switch does not gate anything.",
    whatTheyCanDo: [
      "Submit a candidate review / feedback after an interview round (via the public Rate Candidate link)",
    ],
    disabled: {
      blurb:
        "The Rate Candidate page is public link-based: anyone with the link can submit feedback while logged out, with no permission check. This switch is not enforced anywhere today.",
      lostActions: [
        "No immediate UI change (the switch is not wired to any endpoint)",
      ],
      stillWorks: [
        "Public review submission via email link (unauthenticated)",
        "Everything else (chat, jobs, applications)",
      ],
    },
    scenario:
      "Since feedback is collected through public links, toggling this switch changes nothing for end users yet. It is reserved for a future in-app feedback flow.",
    technical:
      "Backend: PUT /reviews/round/{round_id} and POST /forms/{form_id}/submit are unauthenticated. review.submit is not enforced.",
    related: ["review.view_all"],
  },

  "review.view_all": {
    code: "review.view_all",
    summary: "Lets the role view the reviews and feedback collected for a round.",
    whatTheyCanDo: [
      "See the feedback and ratings given by reviewers for an interview round",
    ],
    disabled: {
      blurb:
        "Reading reviews for a round is blocked — review data returns errors or stays empty.",
      lostActions: [
        "Round review / feedback views (blocked by the API)",
      ],
      stillWorks: [
        "Everything else (chat, jobs, applications)",
      ],
    },
    scenario:
      "If you want reviewers to be able to write feedback but only the account admin to read it, turn this off for reviewers.",
    technical:
      "Backend: GET /reviews/round/{round_id} requires review.view_all.",
    related: ["review.submit"],
  },

  chat: {
    code: "chat",
    summary:
      "The access key to the whole talentOS workspace — lets the role use Chat and all main pages.",
    whatTheyCanDo: [
      "Use the Chat workspace",
      "Reach every main page: Job Listings, applications, notifications and more",
    ],
    disabled: {
      blurb:
        "This is the master access switch for the app. Without it every main screen redirects away — the user cannot use Chat, Job Listings or open any job, and is effectively locked out of the workspace.",
      lostActions: [
        "The entire main app (all pages redirect away)",
        "Chat and the \"New Chat\" sidebar item (hidden)",
      ],
      stillWorks: [
        "Only superadmin-only pages (Tenants, Roles, Apps) — and those are role-restricted anyway",
      ],
    },
    scenario:
      "The harshest switch. Use it to deactivate a persona from the workspace: they keep their account, but the app becomes unusable for them.",
    technical:
      "Frontend enforces this at the app level (ProtectedRoute); backend chat endpoints accept any authenticated user.",
    related: [],
  },

  "report.export": {
    code: "report.export",
    summary: "Lets the role export job data (the candidate report) as a file.",
    whatTheyCanDo: [
      "Press \"Export\" on a job and download the candidate report",
    ],
    disabled: {
      blurb:
        "The Export button is currently shown to everyone and backend enforcement is pending, so switching this off doesn't hide anything yet.",
      lostActions: [
        "No immediate UI change (enforcement pending)",
      ],
      stillWorks: [
        "Everything else (chat, jobs, applications)",
      ],
    },
    scenario:
      "The next step for this switch is to hide the Export button for roles without it — backend enforcement is on the roadmap.",
    technical:
      "Backend: GET /hiring-requests/{id}/export currently checks role rank (>= reviewer), not this permission; enforcement pending.",
    related: ["application.view"],
  },

  "application.workflow": {
    code: "application.workflow",
    summary:
      "Lets the role drive candidates through the hiring pipeline — scheduling rounds, moving candidates and importing.",
    whatTheyCanDo: [
      "Press \"Import\" to bring candidates into a job",
      "Move candidates to the next round, AI screening or AI interview",
      "Schedule, reschedule and cancel rounds from applicant cards",
      "Use \"Join Room\", \"Reschedule\" and \"Cancel\" on interview cards",
    ],
    disabled: {
      blurb:
        "Every pipeline-driving control disappears: import, bulk move actions and round scheduling are all hidden, and the underlying APIs are blocked.",
      lostActions: [
        "\"Import\" button on the job header (hidden)",
        "\"Move to AI Screening\" / \"Move to AI Interview\" bulk actions (hidden)",
        "Move to Next Round / Schedule Round / Reschedule / Cancel buttons on applicant cards (hidden)",
        "\"Join Room\", \"Reschedule\" and \"Cancel\" on interview cards (hidden)",
      ],
      stillWorks: [
        "Viewing and evaluating candidates (application.view / application.evaluate)",
      ],
    },
    scenario:
      "Give a reviewer only viewing and evaluation: without Application Workflow they can't accidentally move or reschedule anyone — the buttons simply don't render.",
    technical:
      "Backend: PATCH round-status, move-to-next-round and the import endpoints require application.workflow (plus application.view).",
    related: ["application.view", "application.evaluate"],
  },

  "interview.plan_edit": {
    code: "interview.plan_edit",
    summary: "Lets the role edit the AI interview plan and the call window of a job.",
    whatTheyCanDo: [
      "Press \"Edit\" on the Interview Plan page and change questions",
      "Generate questions with AI",
      "Edit the call window (timings)",
    ],
    disabled: {
      blurb:
        "The Interview Plan page stays visible but becomes read-only: the Edit and Generate buttons disappear, a \"READ ONLY\" badge is shown, and the call window can't be edited.",
      lostActions: [
        "\"Edit\" button on the Interview Plan page (hidden)",
        "\"Generate Questions\" button (hidden)",
        "Call window editing (hidden)",
        "\"READ ONLY\" badge shown on the page header",
      ],
      stillWorks: [
        "Viewing the plan and its questions (read-only)",
      ],
    },
    scenario:
      "Perfect for reviewers: they see the plan the job owner built, but with a READ ONLY badge — no accidental edits.",
    technical:
      "Backend: PUT /ai/questions, POST /ai/questions/generate and PUT /call-window require interview.plan_edit (plus application.view).",
    related: ["application.view"],
  },

  "job.team_manage": {
    code: "job.team_manage",
    summary: "Lets the role manage who is on a job's team (owner and members).",
    whatTheyCanDo: [
      "Add members to a job's team",
      "Make someone the owner, or remove members from the team",
      "Assign members to a job from the Job Listings table",
    ],
    disabled: {
      blurb:
        "Team management controls disappear: the Add Member button and the Make owner / Remove actions are hidden, and the \"Assign Member\" column vanishes from Job Listings.",
      lostActions: [
        "\"Add Member\" button on the Team Members page (hidden)",
        "\"Make owner\" / \"Remove\" actions (hidden — the actions column is removed)",
        "\"Assign Member\" column in the Job Listings table (hidden)",
        "Team APIs (blocked)",
      ],
      stillWorks: [
        "Viewing the team list",
      ],
    },
    scenario:
      "The job owner builds the team. Everyone else can see who's on it, but only the owner's role (with this switch on) can add or remove people.",
    technical:
      "Backend: POST / PATCH / DELETE /hiring-requests/{id}/team require job.team_manage (via job access context).",
    related: [],
  },
};

export function getPermissionEffect(code: string): PermissionEffect {
  const effect = PERMISSION_EFFECTS[code];
  if (effect) return effect;
  return {
    code,
    summary: "No detailed guide has been added for this permission yet.",
    whatTheyCanDo: ["This permission enables a feature of the platform."],
    disabled: {
      blurb:
        "Turning this off may hide related controls or block the related APIs. Detailed impact will be documented here soon.",
      lostActions: ["Detailed list of hidden controls is pending"],
      stillWorks: ["Everything else (chat, jobs, applications)"],
    },
    scenario:
      "This permission is new. Once its effect is documented, a real-life example will appear here.",
    related: [],
  };
}
