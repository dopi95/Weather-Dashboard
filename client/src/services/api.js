
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

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
 * GET /api/weather?lat=&lon=&city=&country=
 * Returns current weather object.
 */
export async function getWeather(lat, lon, city = '', country = '') {
  return apiFetch(
    `${BASE}/api/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
  );
}

/**
 * GET /api/forecast?lat=&lon=
 * Returns array of 5 daily forecast objects.
 */
export async function getForecast(lat, lon) {
  return apiFetch(`${BASE}/api/forecast?lat=${lat}&lon=${lon}`);
}
