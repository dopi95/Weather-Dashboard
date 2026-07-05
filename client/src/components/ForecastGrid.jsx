/**
 * ForecastGrid.jsx
 * 5-day forecast row: horizontally scrollable on mobile, flex on desktop.
 */

import ForecastCard from './ForecastCard';

/**
 * @param {{
 *   forecast: Array<{ date: string, weatherCode: number, tempMin: number, tempMax: number }>,
 *   unit: 'C'|'F',
 * }} props
 */
export default function ForecastGrid({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <section aria-label="5-day forecast">
      <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">
        5-Day Forecast
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {forecast.map((day) => (
          <div key={day.date} className="snap-start">
            <ForecastCard day={day} unit={unit} />
          </div>
        ))}
      </div>
    </section>
  );
}
