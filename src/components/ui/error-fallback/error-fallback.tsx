import "./error-fallback.css";

type ErrorFallbackProps = {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
};

export default function ErrorFallback({
  error,
  onRetry,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: ErrorFallbackProps) {
  return (
    <div className="error-fallback" role="alert">
      <div className="error-fallback__icon">!</div>
      <h2 className="error-fallback__title">{title}</h2>
      <p className="error-fallback__message">{message}</p>
      {error && (
        <details className="error-fallback__details">
          <summary>Error details</summary>
          <pre>{error.message}</pre>
        </details>
      )}
      {onRetry && (
        <button
          className="error-fallback__retry"
          onClick={onRetry}
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
