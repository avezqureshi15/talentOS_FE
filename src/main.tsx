import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/routes'
import ErrorBoundary from '@/components/ui/error-boundary/error-boundary'
import ErrorFallback from '@/components/ui/error-fallback/error-fallback'
import '@/index.css'
import '@/App.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Application Crash"
          message="The application encountered a critical error. Please refresh the page."
        />
      }
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
