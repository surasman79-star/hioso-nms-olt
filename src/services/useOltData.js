import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with auto-refresh.
 *
 * @param {Function} fetchFn  - async function that returns data
 * @param {number}   interval - refresh interval in ms (default 30 000)
 */
export function useOltData(fetchFn, interval = 30000) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [load, interval]);

  return { data, loading, error, refresh: load, lastUpdated };
}
