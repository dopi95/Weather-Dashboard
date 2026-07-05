/**
 * SearchBar.jsx
 * Text input + Search button + Geolocation button.
 * Full-width on mobile, constrained on larger screens.
 */

'use client';

import { useState } from 'react';

/**
 * @param {{
 *   onSearch: (city: string) => void,
 *   onGeolocate: () => void,
 *   loading: boolean,
 * }} props
 */
export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full gap-2"
      role="search"
      aria-label="Search for a city"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city…"
        aria-label="City name"
        disabled={loading}
        className="
          flex-1 min-w-0 px-4 py-2 rounded-xl border border-white/30
          bg-white/20 backdrop-blur-sm text-white placeholder-white/60
          focus:outline-none focus:ring-2 focus:ring-white/60
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
      />

      <button
        type="submit"
        disabled={loading || !value.trim()}
        aria-label="Search"
        className="
          px-5 py-2 rounded-xl font-semibold
          bg-white/25 hover:bg-white/40 text-white
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-white/60
          transition
        "
      >
        {loading ? '…' : 'Search'}
      </button>

      <button
        type="button"
        onClick={onGeolocate}
        disabled={loading}
        aria-label="Use my current location"
        title="Use my current location"
        className="
          px-3 py-2 rounded-xl text-xl
          bg-white/25 hover:bg-white/40 text-white
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-white/60
          transition
        "
      >
        📍
      </button>
    </form>
  );
}
