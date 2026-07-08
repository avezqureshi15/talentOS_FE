import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from '@/router/routes'
import { AuthProvider } from '@/app/auth/components/AuthProvider'
import ErrorBoundary from '@/components/ui/error-boundary/error-boundary'
import ErrorFallback from '@/components/ui/error-fallback/error-fallback'
import LoadingSpinner from '@/components/ui/loading-spinner/loading-spinner'
import { ERROR_FALLBACK_LABELS } from '@/constants/error-labels'
import { GOOGLE_CLIENT_ID } from '@/constants/constants'
import ToastContainer from '@/components/ui/toast/toast-container'
import '@/index.css'
import '@/App.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title={ERROR_FALLBACK_LABELS.APP_CRASH_TITLE}
          message={ERROR_FALLBACK_LABELS.APP_CRASH_MESSAGE}
        />
      }
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
              <RouterProvider router={router} />
            </Suspense>
            <ToastContainer />
          </AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
