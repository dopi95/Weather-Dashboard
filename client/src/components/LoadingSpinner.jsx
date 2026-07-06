export default function LoadingSpinner() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading weather data" className="flex flex-col gap-4">
      {/* Main card skeleton */}
      <div className="glass rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 sm:px-8 pt-7 pb-6 flex flex-col gap-4">
          <div className="skeleton h-8 w-40 rounded-xl" />
          <div className="skeleton h-4 w-28 rounded-lg" />
          <div className="flex items-end justify-between mt-2">
            <div className="skeleton h-20 w-36 rounded-2xl" />
            <div className="skeleton h-16 w-16 rounded-full" />
          </div>
        </div>
        <div className="mx-6 sm:mx-8 h-px bg-white/10" />
        <div className="px-6 sm:px-8 py-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="glass rounded-3xl px-5 sm:px-6 py-5 shadow-2xl">
        <div className="skeleton h-4 w-28 rounded-lg mb-4" />
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton flex-1 min-w-22 h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
