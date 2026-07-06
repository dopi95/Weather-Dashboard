'use client';

import {
  Sun, Cloud, CloudSun, CloudFog, CloudDrizzle,
  CloudRain, CloudSnow, CloudLightning, Thermometer,
} from 'lucide-react';

const WEATHER_MAP = {
  0:  { Icon: Sun,           description: 'Clear sky',     bg: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&q=80' },
  1:  { Icon: Sun,           description: 'Mainly clear',  bg: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&q=80' },
  2:  { Icon: CloudSun,      description: 'Partly cloudy', bg: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&q=80' },
  3:  { Icon: Cloud,         description: 'Overcast',      bg: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&q=80' },
  45: { Icon: CloudFog,      description: 'Foggy',         bg: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&q=80' },
  48: { Icon: CloudFog,      description: 'Rime fog',      bg: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&q=80' },
};

export function getWeatherInfo(code) {
  if (code === null || code === undefined) {
    return { Icon: Thermometer, description: 'Unknown', bg: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&q=80' };
  }
  if (WEATHER_MAP[code]) return WEATHER_MAP[code];
  if (code >= 51 && code <= 57)  return { Icon: CloudDrizzle,   description: 'Drizzle',       bg: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&q=80' };
  if (code >= 61 && code <= 67)  return { Icon: CloudRain,      description: 'Rain',          bg: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&q=80' };
  if (code >= 71 && code <= 77)  return { Icon: CloudSnow,      description: 'Snow',          bg: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1600&q=80' };
  if (code >= 80 && code <= 82)  return { Icon: CloudRain,      description: 'Rain showers',  bg: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&q=80' };
  if (code === 85 || code === 86) return { Icon: CloudSnow,     description: 'Snow showers',  bg: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1600&q=80' };
  if (code >= 95 && code <= 99)  return { Icon: CloudLightning, description: 'Thunderstorm',  bg: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600&q=80' };
  return { Icon: Thermometer, description: 'Unknown', bg: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&q=80' };
}

export function getNightBg() {
  return 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1600&q=80';
}

export default function WeatherIcon({ code, size = 40, className = '' }) {
  const { Icon, description } = getWeatherInfo(code ?? 0);
  return (
    <Icon
      size={size}
      className={className}
      aria-label={description}
      role="img"
      strokeWidth={1.5}
    />
  );
}
