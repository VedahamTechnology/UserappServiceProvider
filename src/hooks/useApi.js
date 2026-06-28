import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Standard "fetch + loading/error + refresh" hook.
 *
 * @param {() => Promise<T>} fetcher
 * @param {ReadonlyArray<any>} deps
 * @returns {{ data: T|null, loading: boolean, error: Error|null, refresh: () => Promise<void>, setData: (v: T|null) => void }}
 */
export const useApi = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (e) {
      if (mountedRef.current) setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  const refresh = useCallback(async () => {
    await run();
  }, [run]);

  return { data, loading, error, refresh, setData };
};