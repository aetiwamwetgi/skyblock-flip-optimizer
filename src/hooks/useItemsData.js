import { useEffect, useState, useCallback } from "react";
import { fetchItems, extractForgeRecipes } from "../api/hypixelClient.js";

export function useItemsData() {
  const [items, setItems] = useState(null);
  const [forgeRecipes, setForgeRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchItems();
      setItems(data);
      setForgeRecipes(extractForgeRecipes(data));
      setError(null);
    } catch (err) {
      setError(err.message || "Errore nel caricamento degli item");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, forgeRecipes, error, loading, reload: load };
}
