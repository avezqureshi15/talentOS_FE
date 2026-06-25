export type ErrorFallbackProps = {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
};
