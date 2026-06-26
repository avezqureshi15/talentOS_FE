import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/routes'
import ErrorBoundary from '@/components/ui/error-boundary/error-boundary'
import ErrorFallback from '@/components/ui/error-fallback/error-fallback'
import LoadingSpinner from '@/components/ui/loading-spinner/loading-spinner'
import { ERROR_FALLBACK_LABELS } from '@/constants/error-labels'
import '@/index.css'
import '@/app.css'

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
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
