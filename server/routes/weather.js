const express = require('express');
const { fetchForecast } = require('../services/weatherService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lat, lon, city = 'Unknown', country = '' } = req.query;

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
    const current = data.current;

    const response = {
      city: decodeURIComponent(city),
      country: decodeURIComponent(country),
      lat: parsedLat,
      lon: parsedLon,
      datetime: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      weatherCode: current.weathercode,
      windSpeed: current.windspeed_10m,
      humidity: current.relativehumidity_2m,
      pressure: current.surface_pressure,
      visibility: current.visibility_10m,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
