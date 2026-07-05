/**
 * ForecastCard.jsx
 * Single day forecast: date, icon, description, min/max temp.
 */

import WeatherIcon, { getWeatherInfo } from './WeatherIcon';

/**
 * @param {number} c
 * @returns {number}
 */
function toF(c) {
  return Math.round(c * 9 / 5 + 32);
}

/**
 * Format an ISO date string to a short weekday + date.
 * @param {string} dateStr  e.g. "2026-07-06"
 * @returns {string}        e.g. "Mon 6 Jul"
 */
function formatDate(dateStr) {
  try {
    // Parse as local date to avoid UTC offset shifts
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

/**
 * @param {{
 *   day: { date: string, weatherCode: number, tempMin: number, tempMax: number },
 *   unit: 'C'|'F',
 * }} props
 */
export default function ForecastCard({ day, unit }) {
  const { description } = getWeatherInfo(day.weatherCode);
  const min = unit === 'F' ? toF(day.tempMin) : Math.round(day.tempMin);
  const max = unit === 'F' ? toF(day.tempMax) : Math.round(day.tempMax);
  const unitLabel = unit === 'F' ? '°F' : '°C';

  return (
    <div
      className="
        flex flex-col items-center gap-2 px-4 py-4 rounded-2xl
        bg-white/15 backdrop-blur-md border border-white/20 text-white
        min-w-[100px] flex-1 shadow
      "
      aria-label={`Forecast for ${formatDate(day.date)}: ${description}, ${min}–${max}${unitLabel}`}
    >
      <p className="text-xs font-semibold opacity-70 whitespace-nowrap">{formatDate(day.date)}</p>
      <WeatherIcon code={day.weatherCode} size="text-3xl" />
      <p className="text-xs opacity-60 text-center leading-tight">{description}</p>
      <div className="flex gap-2 text-sm font-semibold mt-auto">
        <span className="opacity-70">{min}{unitLabel}</span>
        <span>·</span>
        <span>{max}{unitLabel}</span>
      </div>
    </div>
  );
}
