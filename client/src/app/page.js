'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { geocodeCity, reverseGeocode } from '../services/api';
import { getWeatherTheme } from '../utils/weatherTheme';

import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastGrid from '../components/ForecastGrid';
import RecentSearches from '../components/RecentSearches';
import UnitToggle from '../components/UnitToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/** Maximum number of recent searches stored in localStorage */
const MAX_RECENT = 5;

export default function Home() {
  const { weather, forecast, loading, error, fetchWeather, clearError } = useWeather();
  const [unit, setUnit] = useState('C');
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
  const [geoError, setGeoError] = useState(null);

  // Use null on the server/first render so SSR and client agree, then set the
  // real hour after mount to avoid a hydration mismatch from Date().getHours().
  const [clientHour, setClientHour] = useState(null);
  useEffect(() => {
    setClientHour(new Date().getHours());
  }, []);

  // Derive current theme from weather data.
  // Open-Meteo returns `current.time` as a local time string like "2026-07-05T14:00"
  // WITHOUT a timezone offset. Parsing it with `new Date()` would treat it as UTC,
  // giving the wrong hour when the city's timezone differs from the browser's.
  // Parse the hour directly from the "HH" part of the ISO string instead.
  const hour = weather
    ? parseInt(weather.datetime.slice(11, 13), 10)
    : (clientHour ?? 12); // 12 = neutral daytime default before mount
  const themeClass = getWeatherTheme(weather?.weatherCode ?? null, hour);

  /** Push a city name into the recent searches list (max MAX_RECENT, deduplicated) */
  const addRecentSearch = useCallback(
    (city) => {
      setRecentSearches((prev) => {
        const filtered = (prev || []).filter(
          (c) => c.toLowerCase() !== city.toLowerCase()
        );
        return [city, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecentSearches]
  );

  /** Clear both error sources */
  const clearAllErrors = useCallback(() => {
    clearError();
    setGeoError(null);
  }, [clearError]);

  /** Search by city name string */
  const handleSearch = useCallback(
    async (city) => {
      clearAllErrors();
      try {
        const loc = await geocodeCity(city);
        await fetchWeather(loc.lat, loc.lon, loc.city, loc.country);
        addRecentSearch(loc.city);
      } catch (err) {
        // geocodeCity errors (404, network) are surfaced as a local error message.
        // fetchWeather errors are handled inside the hook (sets its own error state).
        setGeoError(err.message || `Could not find "${city}"`);
      }
    },
    [clearAllErrors, fetchWeather, addRecentSearch]
  );

  /** Use browser geolocation */
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    clearAllErrors();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        try {
          const loc = await reverseGeocode(lat, lon);
          await fetchWeather(lat, lon, loc.city, loc.country);
          addRecentSearch(loc.city);
        } catch (err) {
          setGeoError(err.message || 'Failed to load weather for your location.');
        }
      },
      (posErr) => {
        const messages = {
          1: 'Location access denied. Please allow location access and try again.',
          2: 'Location unavailable. Try searching by city name.',
          3: 'Location request timed out. Try again.',
        };
        setGeoError(messages[posErr.code] || 'Could not determine your location.');
      },
      { timeout: 10_000 }
    );
  }, [clearAllErrors, fetchWeather, addRecentSearch]);

  // Merge hook error (weather fetch failures) and local geoError (geocoding / geolocation failures)
  const displayError = geoError || error;

  return (
    <div
      className={`min-h-screen w-full transition-all duration-700 ${themeClass}`}
    >
      <div className="min-h-screen w-full bg-black/10">
        <div className="mx-auto max-w-4xl px-4 py-8 flex flex-col gap-6">

          {/* ── Header ─────────────────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-white text-2xl font-bold tracking-tight drop-shadow">
              🌤️ Weather Dashboard
            </h1>
            <UnitToggle unit={unit} onToggle={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))} />
          </header>

          {/* ── Search bar ─────────────────────────────────────────── */}
          <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} loading={loading} />

          {/* ── Recent searches ────────────────────────────────────── */}
          <RecentSearches searches={recentSearches} onSelect={handleSearch} />

          {/* ── Main content area ──────────────────────────────────── */}
          <main aria-label="Weather information">
            {loading && <LoadingSpinner />}

            {!loading && displayError && (
              <ErrorMessage
                message={displayError}
                onRetry={
                  weather
                    ? () => {
                        clearAllErrors();
                        fetchWeather(weather.lat, weather.lon, weather.city, weather.country);
                      }
                    : undefined
                }
              />
            )}

            {!loading && !displayError && weather && (
              <div className="flex flex-col gap-6">
                {/* Current weather */}
                <WeatherCard weather={weather} unit={unit} />

                {/* 5-day forecast */}
                {forecast.length > 0 && (
                  <ForecastGrid forecast={forecast} unit={unit} />
                )}
              </div>
            )}

            {!loading && !displayError && !weather && (
              <p className="text-center text-white/60 py-16 text-base" aria-live="polite">
                Search for a city or use 📍 to get started.
              </p>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
