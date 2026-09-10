import "./error-fallback.css";
import type { ErrorFallbackProps } from "./error-fallback.types";
import { ERROR_FALLBACK_DEFAULTS } from "./error-fallback.constants";

export default function ErrorFallback({
  error,
  onRetry,
  title = ERROR_FALLBACK_DEFAULTS.title,
  message = ERROR_FALLBACK_DEFAULTS.message,
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
