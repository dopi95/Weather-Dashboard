const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Geocode a city name to lat/lon results.
 * @param {string} name - City name to search
 * @returns {Promise<Array>} Array of location results
 */
async function geocodeCity(name) {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', name);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Geocoding API error: ${res.status}`);
  }
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch current weather and 6-day forecast from Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Raw Open-Meteo response
 */
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 429 && i < retries - 1) {
      await new Promise((r) => setTimeout(r, delay * 2 ** i));
      continue;
    }
    if (!res.ok) throw new Error(`Open-Meteo Forecast API error: ${res.status}`);
    return res.json();
  }
}

async function fetchForecast(lat, lon) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m,surface_pressure'
  );
  url.searchParams.set(
    'daily',
    'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum'
  );
  url.searchParams.set('forecast_days', '6');
  url.searchParams.set('timezone', 'auto');

  return fetchWithRetry(url.toString());
}

/**
 * Reverse geocode lat/lon to a city name via Nominatim.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Nominatim address object
 */
async function reverseGeocode(lat, lon) {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'WeatherDashboard/1.0' },
  });
  if (!res.ok) {
    throw new Error(`Nominatim API error: ${res.status}`);
  }
  return res.json();
}

module.exports = { geocodeCity, fetchForecast, reverseGeocode };
