/**
 * LoadingSpinner.jsx
 * Centered spinner shown while fetching data.
 */

export default function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
      aria-label="Loading weather data"
    >
      <div
        className="
          w-12 h-12 rounded-full border-4 border-white/30 border-t-white
          animate-spin
        "
        aria-hidden="true"
      />
      <p className="text-white/70 text-sm">Loading…</p>
    </div>
  );
}
