import WeatherIcon, { getWeatherInfo } from './WeatherIcon';

function toF(c) { return Math.round(c * 9 / 5 + 32); }

function formatDate(dateStr) {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return {
      day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    };
  } catch { return { day: dateStr, date: '' }; }
}

export default function ForecastCard({ day, unit }) {
  const { description } = getWeatherInfo(day.weatherCode);
  const min = unit === 'F' ? toF(day.tempMin) : Math.round(day.tempMin);
  const max = unit === 'F' ? toF(day.tempMax) : Math.round(day.tempMax);
  const unitLabel = unit === 'F' ? '°F' : '°C';
  const { day: dayName, date } = formatDate(day.date);

  return (
    <div
      className="glass stat-card rounded-2xl px-3 py-4 sm:px-3 flex flex-col items-center gap-2 text-white w-full shadow-lg"
      aria-label={`${dayName} ${date}: ${description}, ${min}–${max}${unitLabel}`}
    >
      <p className="text-xs font-bold text-white/90 uppercase tracking-widest">{dayName}</p>
      <p className="text-[10px] text-white/40 tracking-wide">{date}</p>

      <div className="my-1 p-2 rounded-xl bg-white/10">
        <WeatherIcon code={day.weatherCode} size={26} className="text-white/90" />
      </div>

      <p className="text-[10px] text-white/50 text-center leading-snug px-1">{description}</p>

      {/* Temp range */}
      <div className="w-full mt-auto">
        <div className="flex justify-between text-[10px] font-semibold mb-1">
          <span className="text-blue-300">{min}{unitLabel}</span>
          <span className="text-orange-300">{max}{unitLabel}</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-linear-to-r from-blue-400 to-orange-400" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
