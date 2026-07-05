/**
 * WeatherIcon.jsx
 * Maps a WMO weather code to an emoji icon and a text description.
 * Zero dependencies — all emoji, all accessible.
 */

/**
 * Returns { icon, description } for a given WMO weathercode.
 * @param {number} code
 * @returns {{ icon: string, description: string }}
 */
export function getWeatherInfo(code) {
  if (code === 0) return { icon: '☀️', description: 'Clear sky' };
  if (code <= 2) return { icon: '🌤️', description: 'Partly cloudy' };
  if (code === 3) return { icon: '☁️', description: 'Overcast' };
  if (code === 45 || code === 48) return { icon: '🌫️', description: 'Foggy' };
  if (code >= 51 && code <= 57) return { icon: '🌦️', description: 'Drizzle' };
  if (code >= 61 && code <= 67) return { icon: '🌧️', description: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', description: 'Snow' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', description: 'Rain showers' };
  if (code === 85 || code === 86) return { icon: '🌨️', description: 'Snow showers' };
  if (code >= 95 && code <= 99) return { icon: '⛈️', description: 'Thunderstorm' };
  return { icon: '🌡️', description: 'Unknown' };
}

/**
 * WeatherIcon component — renders the emoji for a given WMO code.
 *
 * @param {{ code: number, size?: string, className?: string }} props
 */
export default function WeatherIcon({ code, size = 'text-4xl', className = '' }) {
  const { icon, description } = getWeatherInfo(code ?? 0);
  return (
    <span
      className={`${size} ${className}`}
      role="img"
      aria-label={description}
      title={description}
    >
      {icon}
    </span>
  );
}
