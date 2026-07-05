/**
 * routes/forecast.js
 * GET /api/forecast?lat=<lat>&lon=<lon>
 *
 * Returns a 5-day daily forecast (days 1–5 from Open-Meteo; day 0 is today).
 */

const express = require('express');
const { fetchForecast } = require('../services/weatherService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      const err = new Error('Query parameters "lat" and "lon" are required');
      err.status = 400;
      return next(err);
    }

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      const err = new Error('"lat" and "lon" must be valid numbers');
      err.status = 400;
      return next(err);
    }

    const data = await fetchForecast(parsedLat, parsedLon);
    const daily = data.daily;

    // Slice indices 1–5: skip today (index 0), return the next 5 days
    const forecast = daily.time.slice(1, 6).map((date, i) => ({
      date,
      weatherCode: daily.weathercode[i + 1],
      tempMin: daily.temperature_2m_min[i + 1],
      tempMax: daily.temperature_2m_max[i + 1],
      precipitation: daily.precipitation_sum[i + 1],
    }));

    res.json(forecast);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
