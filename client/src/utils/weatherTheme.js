/**
 * weatherTheme.js
 * Pure function: WMO weatherCode + current hour → Tailwind gradient class string.
 */

/**
 * Return a Tailwind gradient class based on WMO weather code and hour of day.
 *
 * @param {number|null} weatherCode  - WMO code (0–99). null = default.
 * @param {number}      hour         - Hour of day (0–23, local time).
 * @returns {string}                 - Tailwind bg-gradient class string.
 */
export function getWeatherTheme(weatherCode, hour) {
  // Night override (18:00 – 05:59)
  if (hour >= 18 || hour < 6) {
    return 'bg-gradient-to-br from-indigo-900 to-slate-900';
  }

  if (weatherCode === null || weatherCode === undefined) {
    return 'bg-gradient-to-br from-sky-400 to-blue-600';
  }

  // Clear sky
  if (weatherCode === 0 || weatherCode === 1) {
    return 'bg-gradient-to-br from-yellow-300 to-orange-400';
  }

  // Partly cloudy / overcast
  if (weatherCode === 2 || weatherCode === 3) {
    return 'bg-gradient-to-br from-slate-400 to-blue-300';
  }

  // Fog
  if (weatherCode === 45 || weatherCode === 48) {
    return 'bg-gradient-to-br from-gray-300 to-gray-500';
  }

  // Drizzle / Rain
  if ((weatherCode >= 51 && weatherCode <= 67)) {
    return 'bg-gradient-to-br from-blue-700 to-slate-600';
  }

  // Snow
  if (weatherCode >= 71 && weatherCode <= 77) {
    return 'bg-gradient-to-br from-blue-100 to-white';
  }

  // Rain showers
  if (weatherCode >= 80 && weatherCode <= 82) {
    return 'bg-gradient-to-br from-blue-600 to-slate-500';
  }

  // Snow showers
  if (weatherCode === 85 || weatherCode === 86) {
    return 'bg-gradient-to-br from-blue-100 to-slate-200';
  }

  // Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) {
    return 'bg-gradient-to-br from-purple-900 to-slate-700';
  }

  // Default
  return 'bg-gradient-to-br from-sky-400 to-blue-600';
}
