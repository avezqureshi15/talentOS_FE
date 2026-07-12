import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/app/auth/pages/login";
import ProtectedRoute from "@/router/protected-route";
import ProtectedLayout from "@/layouts/protected-layouts/protected-layouts";
import Chat from "@/app/chat/pages/chat";
import HiringRequests from "@/app/dashboard/hiring-requests/pages/hiring-requests";
import HiringRequestDetails from "@/app/dashboard/hiring-requests-detail/pages/hiring-requests-detail";
import SlotBooking from "@/app/slot-booking/pages/slot-booking";
import RateCandidate from "@/app/rate-candidate/pages/rate-candidate";
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
    errorElement: <ErrorFallback title={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_TITLE} message={ERROR_FALLBACK_LABELS.APPLICATION_ERROR_MESSAGE} />,
    element: <ProtectedRoute />,
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
]);