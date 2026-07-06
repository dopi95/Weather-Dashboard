
'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * @param {string} key       - localStorage key
 * @param {*}      initial   - initial / default value (used for SSR + first render)
 * @returns {[value, setValue, removeValue]}
 */
export function useLocalStorage(key, initial) {
  // Always start with `initial` so the server render matches the first client render.
  const [storedValue, setStoredValue] = useState(initial);

  // After mount, hydrate the state from localStorage (client-only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setStoredValue(JSON.parse(raw));
      }
    } catch {
      // Ignore read errors (corrupt data, private browsing restrictions, etc.)
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
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
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initial);
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove key "${key}"`, err);
    }
  }, [key, initial]);

  return [storedValue, setValue, removeValue];
}
