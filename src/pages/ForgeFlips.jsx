import React, { useMemo, useState } from "react";
import { useBazaarData } from "../hooks/useBazaarData.js";
import { useItemsData } from "../hooks/useItemsData.js";
import { useProfileStore } from "../hooks/useProfileStore.js";
import { computeForgeFlip } from "../core/forge.js";

function buildPriceMap(products) {
  const map = {};
  if (!products) return map;
  for (const [productId, data] of Object.entries(products)) {
    const qs = data.quick_status;
    map[productId] = {
      instaBuyPrice: qs.buyPrice,
      askBuyPrice: qs.buyPrice * 0.999,
      instaSellPrice: qs.sellPrice,
      askSellPrice: qs.sellPrice * 1.001,
    };
  }
  return map;
}

export default function ForgeFlips() {
  const { products, loading: bazaarLoading, error: bazaarError } = useBazaarData();
  const { forgeRecipes, loading: itemsLoading, error: itemsError } = useItemsData();
  const profile = useProfileStore();
  const [refillOverhead, setRefillOverhead] = useState(0);
  const [onlyComplete, setOnlyComplete] = useState(true);

  const priceMap = useMemo(() => buildPriceMap(products), [products]);

  const results = useMemo(() => {
    if (!forgeRecipes || !products) return [];

    const computed = forgeRecipes
      .filter((r) => r.forgeTimeSeconds > 0 && r.ingredients.length > 0)
      .map((recipe) => {
        const resultPrices = priceMap[recipe.resultId];
        const sellsOnBazaar = Boolean(resultPrices);

        const resultInstaSellPrice = resultPrices ? resultPrices.instaSellPrice : null;
        const resultAskSellPrice = resultPrices ? resultPrices.askSellPrice : null;

        if (!sellsOnBazaar) {
          return {
            resultId: recipe.resultId,
            resultName: recipe.resultName,
            forgeTimeSeconds: recipe.forgeTimeSeconds,
            forgeCount: profile.forgeCount,
            notSellableOnBazaar: true,
            strategies: [],
            best: null,
          };
        }

        return computeForgeFlip({
          recipe,
          materialsPriceMap: priceMap,
          resultInstaSellPrice,
          resultAskSellPrice,
          sellsOnBazaar: true,
          forgeCount: profile.forgeCount,
          taxTier: profile.taxTier,
          refillOverheadSeconds: Number(refillOverhead) || 0,
        });
      });

    let filtered = computed;
    if (onlyComplete) {
      filtered = filtered.filter(
        (r) => r.best && !r.best.missingPrice && r.best.totalProfitPerHour !== 0
      );
    }

    filtered.sort((a, b) => {
      const av = a.best ? a.best.totalProfitPerHour : -Infinity;
      const bv = b.best ? b.best.totalProfitPerHour : -Infinity;
      return bv - av;
    });

    return filtered;
  }, [forgeRecipes, products, priceMap, profile, refillOverhead, onlyComplete]);

  const loading = bazaarLoading || itemsLoading;
  const error = bazaarError || itemsError;

  return (
    <section className="panel">
      <h2>Forge Flip Calculator</h2>
      <p className="muted">
        Confronta il costo dei materiali (Insta buy o Ask buy) con il ricavo di vendita dell'oggetto
        forgiato (Insta sell o Ask sell), moltiplicato per {profile.forgeCount} forge disponibili.
      </p>

      <div className="toolbar">
        <label>
          Overhead per refill materiali (secondi)
          <input
            type="number"
            min="0"
            value={refillOverhead}
            onChange={(e) => setRefillOverhead(e.target.value)}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyComplete}
            onChange={(e) => setOnlyComplete(e.target.checked)}
          />
          Mostra solo ricette con prezzi completi (materiali + risultato su Bazaar)
        </label>
      </div>

      {loading && <p>Caricamento ricette e prezzi...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Oggetto forgiato</th>
              <th>Tempo forgiatura</th>
              <th>Strategia migliore</th>
              <th>Costo materiali</th>
              <th>Ricavo netto</th>
              <th>Profitto/craft</th>
              <th>Craft/ora per forge</th>
              <th>Guadagno/ora ({profile.forgeCount} forge)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.resultId}>
                <td>{r.resultName || r.resultId}</td>
                <td>{r.forgeTimeSeconds}s</td>
                <td>{r.best ? r.best.strategyLabel : r.notSellableOnBazaar ? "Non vendibile su Bazaar" : "N/D"}</td>
                <td>{r.best ? r.best.totalCost.toLocaleString("it-IT", { maximumFractionDigits: 0 }) : "-"}</td>
                <td>{r.best ? r.best.netPrice.toLocaleString("it-IT", { maximumFractionDigits: 0 }) : "-"}</td>
                <td>{r.best ? r.best.profitPerCraft.toLocaleString("it-IT", { maximumFractionDigits: 0 }) : "-"}</td>
                <td>{r.best ? r.best.craftsPerHourPerForge.toFixed(2) : "-"}</td>
                <td className={r.best && r.best.totalProfitPerHour > 0 ? "positive" : "negative"}>
                  {r.best ? r.best.totalProfitPerHour.toLocaleString("it-IT", { maximumFractionDigits: 0 }) : "-"}
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={8}>Nessuna ricetta forge con dati di prezzo completi trovata.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <p className="muted small">
        Nota: le ricette Forge esposte dall'API Hypixel non sempre includono tutti gli item risultanti
        (alcuni, come gli hotel armature o item leggendari, potrebbero richiedere dati aggiuntivi da
        aggregatori come SkyBlock.wiki o NEU repo). Il campo "Non vendibile su Bazaar" segnala item da
        valutare via Auction House invece che Bazaar.
      </p>
    </section>
  );
}
