
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';
const CURRENT_PARAMS = 'temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m,surface_pressure';
const DAILY_PARAMS = 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum';

/**
 * Shared fetch helper — throws a descriptive Error on non-2xx responses.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function apiFetch(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Network error — could not reach the server. Check your connection.');
  }

  if (!res.ok) {
    let message = `Server error (${res.status})`;
    try {
      const body = await res.json();
      message = body?.error?.message || body?.message || message;
    } catch {
      // ignore JSON parse errors for error responses
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/**
 * GET /api/location?q=<city>
 * Returns { city, country, lat, lon, results[] }
 */
export async function geocodeCity(city) {
  return apiFetch(`${BASE}/api/location?q=${encodeURIComponent(city)}`);
}

/**
 * GET /api/location/reverse?lat=&lon=
 * Returns { city, country, lat, lon, displayName }
 */
export async function reverseGeocode(lat, lon) {
  return apiFetch(`${BASE}/api/location/reverse?lat=${lat}&lon=${lon}`);
}

/**
 * Fetch current weather directly from Open-Meteo (bypasses backend).
 */
export async function getWeather(lat, lon, city = '', country = '') {
  const url = new URL(OPEN_METEO);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', CURRENT_PARAMS);
  url.searchParams.set('daily', DAILY_PARAMS);
  url.searchParams.set('forecast_days', '6');
  url.searchParams.set('timezone', 'auto');

  const data = await apiFetch(url.toString());
  const c = data.current;
  return {
    city: decodeURIComponent(city),
    country: decodeURIComponent(country),
    lat, lon,
    datetime: c.time,
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    weatherCode: c.weathercode,
    windSpeed: c.windspeed_10m,
    humidity: c.relativehumidity_2m,
    pressure: c.surface_pressure,
  };
}

/**
 * Fetch 5-day forecast directly from Open-Meteo (bypasses backend).
 */
export async function getForecast(lat, lon) {
  const url = new URL(OPEN_METEO);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', CURRENT_PARAMS);
  url.searchParams.set('daily', DAILY_PARAMS);
  url.searchParams.set('forecast_days', '6');
  url.searchParams.set('timezone', 'auto');

  const data = await apiFetch(url.toString());
  const daily = data.daily;
  return daily.time.slice(1, 6).map((date, i) => ({
    date,
    weatherCode: daily.weathercode[i + 1],
    tempMin: daily.temperature_2m_min[i + 1],
    tempMax: daily.temperature_2m_max[i + 1],
    precipitation: daily.precipitation_sum[i + 1],
  }));
}
