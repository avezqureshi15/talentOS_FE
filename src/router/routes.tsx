import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/app/auth/pages/login";
import AcceptInvite from "@/app/auth/pages/accept-invite";
import ProtectedRoute from "@/router/protected-route";
import RequirePermission from "@/router/require-permission";
import ProtectedLayout from "@/layouts/protected-layouts/protected-layouts";
import Chat from "@/app/chat/pages/chat";
import HiringRequests from "@/app/dashboard/hiring-requests/pages/hiring-requests";
import Notifications from "@/app/dashboard/notifications/pages/notifications";
import HiringRequestLayout from "@/app/dashboard/hiring-requests-detail/pages/hiring-request-layout";
import ApplicationsPage from "@/app/dashboard/hiring-requests-detail/pages/applications-page";
import InterviewDesignPage from "@/app/dashboard/hiring-requests-detail/pages/interview-design-page";
import ProctoringPage from "@/app/dashboard/hiring-requests-detail/pages/proctoring-page";
import EmailManagerPage from "@/app/dashboard/hiring-requests-detail/pages/email-manager-page";
import TeamMembersPage from "@/app/dashboard/hiring-requests-detail/pages/team-members-page";
import DecisionBoardPage from "@/app/dashboard/hiring-requests-detail/pages/decision-board-page";
import ArchivedCandidatesPage from "@/app/dashboard/hiring-requests-detail/pages/archived-candidates-page";
import RoundDetails from "@/app/dashboard/round-details/pages/round-details";
import SlotBooking from "@/app/slot-booking/pages/slot-booking";
import AiInterviewTest from "@/app/dev/ai-interview-test/ai-interview-test";
import RateCandidate from "@/app/rate-candidate/pages/rate-candidate";
import UsersPage from "@/app/admin/users/pages/users-page";
import UserJobsPage from "@/app/admin/users/pages/user-jobs-page";
import RolesPage from "@/app/superadmin/roles/pages/roles-page";
import OrganizationPage from "@/app/admin/organization/pages/organization-page";
import AppDetailPage from "@/app/superadmin/apps/pages/app-detail-page";
import AppsPage from "@/app/superadmin/apps/pages/apps-page";
import TenantsPage from "@/app/superadmin/tenants/pages/tenants-page";
import TenantDetail from "@/app/superadmin/tenants/pages/tenant-detail";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { ROUTES } from "@/constants/routes";
import { ERROR_FALLBACK_LABELS } from "@/constants/error-labels";
import "@/app/superadmin/tenants/pages/tenants-page.css";
import "@/app/superadmin/tenants/pages/tenant-detail.css";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },

  {
    path: ROUTES.AUTH_INVITE,
    element: <AcceptInvite />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },

  {
    path: ROUTES.BOOK_SLOT,
    element: <SlotBooking />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },
  {
    path: ROUTES.BOOK_SLOT_ID,
    element: <SlotBooking />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },
  {
    path: ROUTES.RATE_CANDIDATE,
    element: <RateCandidate />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },
  {
    path: ROUTES.RATE_CANDIDATE_ID,
    element: <RateCandidate />,
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
  },

  {
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedRoute allowedRoles={["account_admin", "job_owner", "recruiter", "reviewer"]} permissions={["chat"]} redirectPath="/roles" />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to={ROUTES.CHAT} replace />,
          },

          { path: ROUTES.CHAT, element: <Chat />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
          { path: ROUTES.CHAT_ID, element: <Chat />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
          { path: ROUTES.HIRING_REQUESTS, element: <HiringRequests />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
          { path: ROUTES.NOTIFICATIONS, element: <Notifications />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
          { path: ROUTES.ALERTS, element: <Navigate to={ROUTES.NOTIFICATIONS} replace /> },
          { path: ROUTES.ROUND_DETAILS, element: <RoundDetails />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
          {
            path: ROUTES.HIRING_REQUESTS_ID,
            element: <HiringRequestLayout />,
            errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} />,
            children: [
              { index: true, element: <Navigate to="applications" replace /> },
              { path: "applications", element: <ApplicationsPage /> },
              { path: "interview-design", element: <InterviewDesignPage /> },
              { path: "proctoring", element: <ProctoringPage /> },
              { path: "email-manager", element: <EmailManagerPage /> },
              { path: "team-members", element: <TeamMembersPage /> },
              { path: "board", element: <DecisionBoardPage /> },
              { path: "archived", element: <ArchivedCandidatesPage /> },
            ],
          },
        ],
      },
      { path: ROUTES.AI_INTERVIEW_TEST, element: <AiInterviewTest />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
    ],
  },

  // ── Admin routes (permission-gated per page) ──────────────────
  {
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedLayout />,
    children: [
      {
        path: "admin",
        children: [
          { index: true, element: <Navigate to={ROUTES.ADMIN_USERS} replace /> },
          { path: "users", element: <RequirePermission permission="user.invite"><UsersPage /></RequirePermission> },
          { path: "users/:userId", element: <RequirePermission permission="user.manage" allowedRoles={["account_admin"]}><UserJobsPage /></RequirePermission> },
          { path: "organization", element: <RequirePermission permission="settings.view"><OrganizationPage /></RequirePermission> },
          { path: "apps", element: <RequirePermission permission="api_key.manage"><AppsPage scope="admin" /></RequirePermission> },
          { path: "apps/:appId", element: <RequirePermission permission="api_key.manage"><AppDetailPage scope="admin" /></RequirePermission> },
        ],
      },
    ],
  },

  // ── Role management (gated to superadmin) ──────────────────────
  {
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedRoute minimumRole="superadmin" permissions={["user.manage"]} />,
    children: [
      {
        path: "roles",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <RolesPage /> },
        ],
      },
    ],
  },

  // ── Superadmin routes (gated to superadmin only) ─────────────────
  {
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedRoute minimumRole="superadmin" />,
    children: [
      {
        path: "superadmin",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.SUPERADMIN_TENANTS} replace /> },
          { path: "apps", element: <AppsPage /> },
          { path: "apps/:appId", element: <AppDetailPage /> },
          { path: "tenants", element: <TenantsPage /> },
          { path: "tenants/:tenantId", element: <TenantDetail /> },
        ],
      },
    ],
  },
]);