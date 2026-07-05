/**
 * ErrorMessage.jsx
 * User-friendly error display with optional retry callback.
 */

/**
 * @param {{
 *   message: string,
 *   onRetry?: () => void,
 * }} props
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        flex flex-col items-center gap-3 py-8 px-4
        text-center text-white
      "
    >
      <span className="text-4xl" aria-hidden="true">⚠️</span>
      <p className="text-base font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            mt-2 px-4 py-2 rounded-xl text-sm font-semibold
            bg-white/25 hover:bg-white/40
            focus:outline-none focus:ring-2 focus:ring-white/60
            transition
          "
          aria-label="Retry loading weather data"
        >
          Try again
        </button>
      )}
    </div>
  );
}
