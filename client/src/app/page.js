'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { geocodeCity, reverseGeocode } from '../services/api';
import { getWeatherInfo, getNightBg } from '../components/WeatherIcon';

import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastGrid from '../components/ForecastGrid';
import RecentSearches from '../components/RecentSearches';
import UnitToggle from '../components/UnitToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MAX_RECENT = 5;
const DEFAULT_BG = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&q=80';

export default function Home() {
  const { weather, forecast, loading, error, fetchWeather, clearError } = useWeather();
  const [unit, setUnit] = useState('C');
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
  const [geoError, setGeoError] = useState(null);
  const [clientHour, setClientHour] = useState(null);

  useEffect(() => { setClientHour(new Date().getHours()); }, []);

  const hour = weather
    ? parseInt(weather.datetime.slice(11, 13), 10)
    : (clientHour ?? 12);
  const isNight = hour >= 18 || hour < 6;

  const bgImage = isNight
    ? getNightBg()
    : weather
      ? getWeatherInfo(weather.weatherCode).bg
      : DEFAULT_BG;

  const addRecentSearch = useCallback((city) => {
    setRecentSearches((prev) => {
      const filtered = (prev || []).filter((c) => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, MAX_RECENT);
    });
  }, [setRecentSearches]);

  const clearAllErrors = useCallback(() => {
    clearError();
    setGeoError(null);
  }, [clearError]);

  const handleSearch = useCallback(async (city) => {
    clearAllErrors();
    try {
      const loc = await geocodeCity(city);
      await fetchWeather(loc.lat, loc.lon, loc.city, loc.country);
      addRecentSearch(loc.city);
    } catch (err) {
      setGeoError(err.message || `Could not find "${city}"`);
    }
  }, [clearAllErrors, fetchWeather, addRecentSearch]);

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

  const displayError = geoError || error;

  return (
    <div
      className="weather-bg min-h-screen w-full transition-all duration-700"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Layered overlay: dark base + subtle vignette */}
      <div className="min-h-screen w-full bg-gradient-to-b from-black/60 via-black/40 to-black/70">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-5">

          {/* Header */}
          <header className="flex items-center justify-between fade-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white text-lg sm:text-xl font-bold tracking-tight leading-none">WeatherNow</h1>
                <p className="text-white/40 text-[10px] tracking-widest uppercase leading-none mt-0.5">Real-time forecast</p>
              </div>
            </div>
            <UnitToggle unit={unit} onToggle={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))} />
          </header>

          {/* Search */}
          <div className="fade-up" style={{ animationDelay: '0.05s' }}>
            <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} loading={loading} />
          </div>

          {/* Recent searches */}
          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <RecentSearches searches={recentSearches} onSelect={handleSearch} />
          </div>

          {/* Main content */}
          <main aria-label="Weather information">
            {loading && <LoadingSpinner />}

            {!loading && displayError && (
              <ErrorMessage
                message={displayError}
                onRetry={
                  weather
                    ? () => { clearAllErrors(); fetchWeather(weather.lat, weather.lon, weather.city, weather.country); }
                    : undefined
                }
              />
            )}

            {!loading && !displayError && weather && (
              <div className="flex flex-col gap-4 fade-up">
                <WeatherCard weather={weather} unit={unit} />
                {forecast.length > 0 && <ForecastGrid forecast={forecast} unit={unit} />}
              </div>
            )}

            {!loading && !displayError && !weather && (
              <div className="flex flex-col items-center justify-center py-20 gap-5 text-center fade-up">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center shadow-xl">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Search any city</p>
                  <p className="text-white/50 text-sm mt-1">or tap 📍 to use your current location</p>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
