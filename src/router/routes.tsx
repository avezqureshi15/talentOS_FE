import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/app/auth/pages/login";
import ProtectedRoute from "@/router/protected-route";
import ProtectedLayout from "@/layouts/protected-layouts/protected-layouts";
import Chat from "@/app/chat/pages/chat";
import HiringRequests from "@/app/dashboard/hiring-requests/pages/hiring-requests";
import HiringRequestDetails from "@/app/dashboard/hiring-requests-detail/pages/hiring-requests-detail";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorFallback title="Page Error" message="Failed to load login page." />,
  },

  {
    errorElement: <ErrorFallback title="Application Error" message="Something went wrong. Please sign in again." />,
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          // root redirect INSIDE protected flow
          {
            path: "/",
            element: <Navigate to="/chat" replace />,
          },

          { path: "/chat", element: <Chat /> },
          { path: "/chat/:chatId", element: <Chat /> },
          { path: "/hiring-requests", element: <HiringRequests /> },
          { path: "/hiring-requests/:id", element: <HiringRequestDetails /> },
        ],
      },
    ],
  },
]);