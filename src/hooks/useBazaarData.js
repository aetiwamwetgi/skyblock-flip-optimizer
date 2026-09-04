import { useEffect, useState, useCallback } from "react";
import { fetchBazaar } from "../api/hypixelClient.js";

const POLL_INTERVAL_MS = 60000;

export function useBazaarData() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBazaar();
      setProducts(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Errore nel caricamento del Bazaar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { products, error, loading, lastUpdated, reload: load };
}
