import { Clock } from 'lucide-react';

export default function RecentSearches({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null;

  return (
    <nav aria-label="Recent searches">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Clock size={11} className="text-white/40" strokeWidth={2} />
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Recent</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="
              px-3.5 py-1.5 rounded-full text-xs font-semibold
              glass hover:bg-white/20 border border-white/20
              text-white/75 hover:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-400/60
              shadow-sm transition-all duration-200
            "
            aria-label={`Search for ${city} again`}
          >
            {city}
          </button>
        ))}
      </div>
    </nav>
  );
}
