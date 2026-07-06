'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full" role="search" aria-label="Search for a city">
      {/* Input wrapper */}
      <div className="relative flex-1 min-w-0 glow-focus rounded-2xl">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          strokeWidth={2}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for a city..."
          aria-label="City name"
          disabled={loading}
          className="
            w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm
            glass-light border-0
            text-slate-800 placeholder-slate-400
            focus:outline-none focus:bg-white
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md transition-all duration-200
          "
        />
      </div>

      {/* Search button */}
      <button
        type="submit"
        disabled={loading || !value.trim()}
        aria-label="Search"
        className="
          px-5 py-3.5 rounded-2xl text-sm font-semibold
          bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white shadow-lg
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-400
          transition-all duration-200 flex items-center gap-2 shrink-0
        "
      >
        {loading
          ? <Loader2 size={16} className="animate-spin" />
          : <><Search size={15} strokeWidth={2} /><span className="hidden sm:inline">Search</span></>
        }
      </button>

      {/* Geo button */}
      <button
        type="button"
        onClick={onGeolocate}
        disabled={loading}
        aria-label="Use my current location"
        title="Use my current location"
        className="
          px-4 py-3.5 rounded-2xl
          glass-light hover:bg-white border-0 text-slate-500 hover:text-blue-500
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-400/60
          shadow-md transition-all duration-200 shrink-0
        "
      >
        <MapPin size={16} strokeWidth={2} />
      </button>
    </form>
  );
}
