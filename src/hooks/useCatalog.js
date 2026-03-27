import { useState, useEffect } from 'react';
import { fetchSheetsCatalog } from '../utils/sheetsCatalog.js';
import fallbackCatalog from '../data/hijabCatalog.js';
import config from '../config.js';

/**
 * Load hijab catalog.
 * Priority: Google Sheets CSV → hardcoded fallback.
 *
 * Returns { catalog, loading, source, error }
 *   source: 'sheets' | 'fallback'
 */
export function useCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (config.sheetsCsvUrl) {
        try {
          const data = await fetchSheetsCatalog(config.sheetsCsvUrl);
          if (!cancelled) {
            setCatalog(data);
            setSource('sheets');
          }
        } catch (err) {
          console.warn('[useCatalog] Google Sheets gagal, pakai fallback:', err.message);
          if (!cancelled) {
            setCatalog(fallbackCatalog);
            setSource('fallback');
            setError(err.message);
          }
        }
      } else {
        if (!cancelled) {
          setCatalog(fallbackCatalog);
          setSource('fallback');
        }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { catalog, loading, source, error };
}
