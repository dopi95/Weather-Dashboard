import ForecastCard from './ForecastCard';

export default function ForecastGrid({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <section aria-label="5-day forecast" className="glass rounded-3xl px-5 sm:px-6 py-5 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-1 h-4 rounded-full bg-white/40"></span>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">5-Day Forecast</p>
      </div>
      {/* Mobile: 3 top + 2 bottom centered. Desktop: single row of 5 */}
      <div className="sm:hidden flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2.5">
          {forecast.slice(0, 3).map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5 px-[16.67%]">
          {forecast.slice(3).map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </div>
      </div>
      <div className="hidden sm:grid sm:grid-cols-5 gap-2.5">
        {forecast.map((day) => (
          <ForecastCard key={day.date} day={day} unit={unit} />
        ))}
      </div>
    </section>
  );
}
