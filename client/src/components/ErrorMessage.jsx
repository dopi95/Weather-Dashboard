import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="glass rounded-3xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl fade-up"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-white font-semibold text-base">Something went wrong</p>
        <p className="text-white/55 text-sm mt-1 max-w-xs leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold
            bg-white/15 hover:bg-white/25 border border-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-white/40
            transition-all duration-200
          "
          aria-label="Retry loading weather data"
        >
          <RefreshCw size={14} strokeWidth={2} />
          Try again
        </button>
      )}
    </div>
  );
}
