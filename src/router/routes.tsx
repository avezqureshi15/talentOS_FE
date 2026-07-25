import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/app/auth/pages/login";
import AcceptInvite from "@/app/auth/pages/accept-invite";
import ProtectedRoute from "@/router/protected-route";
import ProtectedLayout from "@/layouts/protected-layouts/protected-layouts";
import Chat from "@/app/chat/pages/chat";
import HiringRequests from "@/app/dashboard/hiring-requests/pages/hiring-requests";
import HiringRequestDetails from "@/app/dashboard/hiring-requests-detail/pages/hiring-requests-detail";
import SlotBooking from "@/app/slot-booking/pages/slot-booking";
import RateCandidate from "@/app/rate-candidate/pages/rate-candidate";
import UsersPage from "@/app/admin/users/pages/users-page";
import RolesPage from "@/app/superadmin/roles/pages/roles-page";
import SettingsPage from "@/app/admin/settings/pages/settings-page";
import TenantsPage from "@/app/superadmin/tenants/pages/tenants-page";
import TenantDetail from "@/app/superadmin/tenants/pages/tenant-detail";
import "@/app/superadmin/tenants/pages/tenants-page.css";
import "@/app/superadmin/tenants/pages/tenant-detail.css";
import RequirePermission from "@/router/require-permission";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { ROUTES } from "@/constants/routes";
import { ERROR_FALLBACK_LABELS } from "@/constants/error-labels";

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
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedRoute allowedRoles={["superadmin", "admin", "hr", "viewer"]} permissions={["chat"]} />,
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
          { path: ROUTES.HIRING_REQUESTS_ID, element: <HiringRequestDetails />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
        ],
      },
      { path: ROUTES.BOOK_SLOT, element: <SlotBooking />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
      { path: ROUTES.BOOK_SLOT_ID, element: <SlotBooking />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
      { path: ROUTES.RATE_CANDIDATE, element: <RateCandidate />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
      { path: ROUTES.RATE_CANDIDATE_ID, element: <RateCandidate />, errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.PAGE_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.PAGE_ERROR_MESSAGE} /> },
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
          { path: "settings", element: <RequirePermission permission="settings.view"><SettingsPage /></RequirePermission> },
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
          { path: "tenants", element: <TenantsPage /> },
          { path: "tenants/:tenantId", element: <TenantDetail /> },
        ],
      },
    ],
  },
]);
