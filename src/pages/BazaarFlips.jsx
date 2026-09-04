import React, { useMemo, useState } from "react";
import { useBazaarData } from "../hooks/useBazaarData.js";
import { useProfileStore } from "../hooks/useProfileStore.js";
import { computeBazaarFlipOpportunity } from "../core/flip.js";

export default function BazaarFlips() {
  const { products, loading, error, lastUpdated, reload } = useBazaarData();
  const profile = useProfileStore();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("bestProfitPerHour");

  const opportunities = useMemo(() => {
    if (!products) return [];
    const riskProfile = profile.riskProfile();
    let list = Object.entries(products).map(([productId, data]) =>
      computeBazaarFlipOpportunity({
        productId,
        quickStatus: data.quick_status,
        capital: profile.capital,
        riskProfile,
        taxTier: profile.taxTier,
      })
    );

    if (search.trim()) {
      const q = search.trim().toUpperCase();
      list = list.filter((o) => o.productId.toUpperCase().includes(q));
    }

    list.sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0));
    return list;
  }, [products, profile, search, sortKey]);

  return (
    <section className="panel">
      <h2>Bazaar Flip Scanner</h2>
      <p className="muted">
        Margine e capacita di flip calcolati in tempo reale dal Bazaar, filtrati per il tuo profilo di
        rischio ({profile.riskLabel()}) e capitale ({profile.capital.toLocaleString("it-IT")} coins).
      </p>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Filtra per nome prodotto (es. ENCHANTED_...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="bestProfitPerHour">Ordina per guadagno/ora</option>
          <option value="bestMarginPercent">Ordina per margine %</option>
          <option value="executableUnitsPerHour">Ordina per volume eseguibile</option>
        </select>
        <button onClick={reload}>Aggiorna ora</button>
      </div>

      {loading && <p>Caricamento...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Insta buy</th>
              <th>Insta sell</th>
              <th>Margine Insta/Insta</th>
              <th>Margine Ask/Ask</th>
              <th>Vol. orario buy</th>
              <th>Vol. orario sell</th>
              <th>Unita/ora eseguibili</th>
              <th>Strategia migliore</th>
              <th>Guadagno/ora</th>
              <th>Nel profilo di rischio?</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.slice(0, 100).map((o) => (
              <tr key={o.productId} className={o.passesRisk ? "" : "muted-row"}>
                <td>{o.productId}</td>
                <td>{o.instaBuyPrice.toFixed(1)}</td>
                <td>{o.instaSellPrice.toFixed(1)}</td>
                <td>{o.marginPercentInstaInsta.toFixed(2)}%</td>
                <td>{o.marginPercentAskAsk.toFixed(2)}%</td>
                <td>{o.hourlyBuyVolume.toFixed(0)}</td>
                <td>{o.hourlySellVolume.toFixed(0)}</td>
                <td>{o.executableUnitsPerHour.toFixed(0)}</td>
                <td>{o.bestStrategy === "ask_ask" ? "Ask/Ask" : "Insta/Insta"}</td>
                <td>{o.bestProfitPerHour.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</td>
                <td>{o.passesRisk ? "Si" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {lastUpdated && (
        <p className="muted small">Ultimo aggiornamento: {lastUpdated.toLocaleTimeString("it-IT")}</p>
      )}
    </section>
  );
}
