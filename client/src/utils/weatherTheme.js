
/**
 * Return a Tailwind gradient class based on WMO weather code and hour of day.
 *
 * @param {number|null} weatherCode  - WMO code (0–99). null = default.
 * @param {number}      hour         - Hour of day (0–23, local city time).
 * @returns {string}                 - Tailwind bg-gradient class string.
 */
export function getWeatherTheme(weatherCode, hour) {
  const isNight = hour >= 18 || hour < 6;

  if (weatherCode === null || weatherCode === undefined) {
    return isNight
      ? 'bg-gradient-to-br from-indigo-900 to-slate-900'
      : 'bg-gradient-to-br from-sky-400 to-blue-600';
  }

  // Clear sky (0 = clear, 1 = mainly clear)
  if (weatherCode === 0 || weatherCode === 1) {
    return isNight
      ? 'bg-gradient-to-br from-indigo-900 to-slate-900'   // clear night: deep indigo
      : 'bg-gradient-to-br from-yellow-300 to-orange-400'; // clear day: sunny yellow→orange
  }

  // Partly cloudy / overcast (2 = partly cloudy, 3 = overcast)
  if (weatherCode === 2 || weatherCode === 3) {
    return isNight
      ? 'bg-gradient-to-br from-slate-700 to-slate-900'    // cloudy night: dark slate
      : 'bg-gradient-to-br from-slate-400 to-blue-300';   // cloudy day: light slate
  }

  // Fog (45 = fog, 48 = rime fog)
  if (weatherCode === 45 || weatherCode === 48) {
    return isNight
      ? 'bg-gradient-to-br from-gray-700 to-gray-900'      // foggy night: dark gray
      : 'bg-gradient-to-br from-gray-300 to-gray-500';    // foggy day: light gray
  }

  // Drizzle / Rain (51–67)
  if (weatherCode >= 51 && weatherCode <= 67) {
    return isNight
      ? 'bg-gradient-to-br from-blue-900 to-slate-900'     // rainy night: deep blue
      : 'bg-gradient-to-br from-blue-700 to-slate-600';   // rainy day: blue→slate
  }

  // Snow (71–77)
  if (weatherCode >= 71 && weatherCode <= 77) {
    return isNight
      ? 'bg-gradient-to-br from-slate-600 to-slate-800'    // snowy night: dark slate
      : 'bg-gradient-to-br from-blue-100 to-white';       // snowy day: pale blue→white
  }

  // Rain showers (80–82)
  if (weatherCode >= 80 && weatherCode <= 82) {
    return isNight
      ? 'bg-gradient-to-br from-blue-900 to-slate-800'     // shower night: deep blue
      : 'bg-gradient-to-br from-blue-600 to-slate-500';   // shower day: blue→slate
  }

  // Snow showers (85–86)
  if (weatherCode === 85 || weatherCode === 86) {
    return isNight
      ? 'bg-gradient-to-br from-slate-500 to-slate-800'    // snow shower night
      : 'bg-gradient-to-br from-blue-100 to-slate-200';   // snow shower day
  }

  // Thunderstorm (95–99)
  if (weatherCode >= 95 && weatherCode <= 99) {
    return isNight
      ? 'bg-gradient-to-br from-purple-950 to-slate-950'   // thunderstorm night: near-black purple
      : 'bg-gradient-to-br from-purple-900 to-slate-700'; // thunderstorm day: dark purple
  }

  // Default fallback
  return isNight
    ? 'bg-gradient-to-br from-indigo-900 to-slate-900'
    : 'bg-gradient-to-br from-sky-400 to-blue-600';
}
