/**
 * useLocalStorage.js
 * Generic hook for reading and writing a JSON-serialised value in localStorage.
 * Falls back gracefully when localStorage is unavailable (e.g. SSR).
 */

'use client';

import { useState, useCallback } from 'react';

/**
 * @param {string} key       - localStorage key
 * @param {*}      initial   - initial / default value
 * @returns {[value, setValue, removeValue]}
 */
export function useLocalStorage(key, initial) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  }, [key, initial]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      if (typeof window === 'undefined') return;
      try {
        const next = typeof value === 'function' ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        setStoredValue(next);
      } catch (err) {
        console.warn(`useLocalStorage: failed to set key "${key}"`, err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initial);
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove key "${key}"`, err);
    }
  }, [key, initial]);

  return [storedValue, setValue, removeValue];
}
