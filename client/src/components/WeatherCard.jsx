'use client';

import { Wind, Droplets, Gauge, Eye, Thermometer } from 'lucide-react';
import WeatherIcon, { getWeatherInfo } from './WeatherIcon';

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function fmt(celsius, unit) {
  return unit === 'F' ? `${toF(celsius)}°F` : `${Math.round(celsius)}°C`;
}
function formatDatetime(dt) {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch { return dt; }
}

const STAT_COLORS = [
  'text-orange-300',
  'text-blue-300',
  'text-teal-300',
  'text-purple-300',
  'text-green-300',
];

export default function WeatherCard({ weather, unit }) {
  if (!weather) return null;
  const { description } = getWeatherInfo(weather.weatherCode);

  const stats = [
    { Icon: Thermometer, label: 'Feels like', value: fmt(weather.feelsLike, unit) },
    { Icon: Droplets,    label: 'Humidity',   value: `${weather.humidity}%` },
    { Icon: Wind,        label: 'Wind',        value: `${Math.round(weather.windSpeed)} km/h` },
    { Icon: Gauge,       label: 'Pressure',    value: `${Math.round(weather.pressure)} hPa` },
    { Icon: Eye,         label: 'Visibility',  value: weather.visibility >= 1000 ? `${(weather.visibility / 1000).toFixed(1)} km` : `${Math.round(weather.visibility)} m` },
  ];

  return (
    <div className="glass rounded-3xl overflow-hidden text-white shadow-2xl" aria-label={`Current weather in ${weather.city}`}>

      {/* Hero section */}
      <div className="px-6 sm:px-8 pt-7 pb-6">
        {/* Location */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{weather.city}</h2>
            {weather.country && (
              <span className="text-base font-normal text-white/55 tracking-wide">{weather.country}</span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-1.5 tracking-wide">{formatDatetime(weather.datetime)}</p>
        </div>

        {/* Temp + icon */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-7xl sm:text-8xl font-thin leading-none tracking-tighter">
              {fmt(weather.temperature, unit)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <p className="text-base text-white/65 font-light">{description}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <WeatherIcon code={weather.weatherCode} size={72} className="text-white/90 drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 sm:mx-8 h-px bg-white/10" />

      {/* Stats grid */}
      <div className="px-6 sm:px-8 py-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ Icon, label, value }, i) => (
          <div key={label} className="glass-dark stat-card rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className={`shrink-0 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center ${STAT_COLORS[i]}`}>
              <Icon size={16} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none mb-1">{label}</p>
              <p className="text-sm font-semibold truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
