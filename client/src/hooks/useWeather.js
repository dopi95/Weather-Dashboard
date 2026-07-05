/**
 * useWeather.js
 * Fetches current weather and 5-day forecast from the Express backend.
 * Manages loading, error, and data state.
 */

'use client';

import { useState, useCallback } from 'react';
import { getWeather, getForecast } from '../services/api';

/**
 * @returns {{
 *   weather: object|null,
 *   forecast: Array,
 *   loading: boolean,
 *   error: string|null,
 *   fetchWeather: (lat: number, lon: number, city: string, country: string) => Promise<void>,
 *   clearError: () => void,
 * }}
 */
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchWeather = useCallback(async (lat, lon, city = '', country = '') => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(lat, lon, city, country),
        getForecast(lat, lon),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || 'Failed to load weather data. Please try again.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, forecast, loading, error, fetchWeather, clearError };
}
