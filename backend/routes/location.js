/**
 * routes/location.js
 * GET /api/location?q=<city>          — geocode city name → lat/lon
 * GET /api/location/reverse?lat=&lon= — reverse geocode lat/lon → city name
 */

const express = require('express');
const { geocodeCity, reverseGeocode } = require('../services/weatherService');

const router = express.Router();

// GET /api/location?q=<city>
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      const err = new Error('Query parameter "q" (city name) is required');
      err.status = 400;
      return next(err);
    }

    const results = await geocodeCity(q.trim());

    if (!results || results.length === 0) {
      const err = new Error(`No results found for "${q.trim()}"`);
      err.status = 404;
      return next(err);
    }

    // Return the top match and the full result list
    const top = results[0];
    res.json({
      city: top.name,
      country: top.country_code || top.country || '',
      lat: top.latitude,
      lon: top.longitude,
      results: results.map((r) => ({
        city: r.name,
        country: r.country_code || r.country || '',
        lat: r.latitude,
        lon: r.longitude,
        admin1: r.admin1 || '',
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/location/reverse?lat=&lon=
router.get('/reverse', async (req, res, next) => {
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

    const data = await reverseGeocode(parsedLat, parsedLon);
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      address.state ||
      'Unknown';

    const country = address.country_code
      ? address.country_code.toUpperCase()
      : address.country || '';

    res.json({
      city,
      country,
      lat: parsedLat,
      lon: parsedLon,
      displayName: data.display_name || '',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
