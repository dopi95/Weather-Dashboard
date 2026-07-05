/**
 * WeatherCard.jsx
 * Displays current weather conditions for a location.
 * Accepts a `unit` prop ('C' | 'F') and converts client-side — no re-fetch.
 */

import WeatherIcon, { getWeatherInfo } from './WeatherIcon';

/**
 * Convert Celsius to Fahrenheit (display only).
 * @param {number} c
 * @returns {number}
 */
function toF(c) {
  return Math.round(c * 9 / 5 + 32);
}

/**
 * Format a display temperature string.
 * @param {number} celsius
 * @param {'C'|'F'} unit
 * @returns {string}
 */
function fmt(celsius, unit) {
  return unit === 'F' ? `${toF(celsius)}°F` : `${Math.round(celsius)}°C`;
}

/**
 * Format the datetime string from the backend (ISO 8601 without Z).
 * @param {string} dt  e.g. "2026-07-05T23:40"
 * @returns {string}   e.g. "Sun, Jul 5, 2026 · 23:40"
 */
function formatDatetime(dt) {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dt;
  }
}

/**
 * @param {{
 *   weather: {
 *     city: string, country: string, datetime: string,
 *     temperature: number, feelsLike: number, weatherCode: number,
 *     windSpeed: number, humidity: number, pressure: number, visibility: number
 *   },
 *   unit: 'C'|'F',
 * }} props
 */
export default function WeatherCard({ weather, unit }) {
  if (!weather) return null;

  const { description } = getWeatherInfo(weather.weatherCode);

  return (
    <div
      className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-6 text-white shadow-lg"
      aria-label={`Current weather in ${weather.city}`}
    >
      {/* Location & datetime */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold leading-tight">
          {weather.city}
          {weather.country ? (
            <span className="ml-2 text-base font-normal opacity-80">{weather.country}</span>
          ) : null}
        </h2>
        <p className="text-sm opacity-70 mt-0.5">{formatDatetime(weather.datetime)}</p>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center gap-4 mb-6">
        <WeatherIcon code={weather.weatherCode} size="text-6xl" />
        <div>
          <p className="text-6xl font-thin leading-none">{fmt(weather.temperature, unit)}</p>
          <p className="text-base opacity-80 mt-1">{description}</p>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <Detail label="Feels like" value={fmt(weather.feelsLike, unit)} />
        <Detail label="Humidity" value={`${weather.humidity}%`} />
        <Detail label="Wind" value={`${Math.round(weather.windSpeed)} km/h`} />
        <Detail label="Pressure" value={`${Math.round(weather.pressure)} hPa`} />
        <Detail
          label="Visibility"
          value={
            weather.visibility >= 1000
              ? `${(weather.visibility / 1000).toFixed(1)} km`
              : `${Math.round(weather.visibility)} m`
          }
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="opacity-60">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
