/**
 * RecentSearches.jsx
 * Chip list of the last 5 successful city searches from localStorage.
 */

/**
 * @param {{
 *   searches: string[],
 *   onSelect: (city: string) => void,
 * }} props
 */
export default function RecentSearches({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null;

  return (
    <nav aria-label="Recent searches">
      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
        Recent
      </p>
      <div className="flex flex-wrap gap-2">
        {searches.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="
              px-3 py-1 rounded-full text-sm
              bg-white/20 hover:bg-white/35 text-white
              focus:outline-none focus:ring-2 focus:ring-white/60
              transition
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
