import React, { useMemo } from "react";
import { useBazaarData } from "../hooks/useBazaarData.js";
import { useItemsData } from "../hooks/useItemsData.js";
import { useProfileStore } from "../hooks/useProfileStore.js";
import { computeBazaarFlipOpportunity } from "../core/flip.js";

export default function Dashboard() {
  const { products, loading: bazaarLoading, error: bazaarError, lastUpdated } = useBazaarData();
  const { forgeRecipes, loading: itemsLoading } = useItemsData();
  const profile = useProfileStore();

  const topFlips = useMemo(() => {
    if (!products) return [];
    const riskProfile = profile.riskProfile();
    const opportunities = Object.entries(products)
      .map(([productId, data]) =>
        computeBazaarFlipOpportunity({
          productId,
          quickStatus: data.quick_status,
          capital: profile.capital,
          riskProfile,
          taxTier: profile.taxTier,
        })
      )
      .filter((o) => o.passesRisk && o.bestProfitPerHour > 0)
      .sort((a, b) => b.bestProfitPerHour - a.bestProfitPerHour)
      .slice(0, 5);
    return opportunities;
  }, [products, profile]);

  return (
    <section className="panel">
      <h2>Panoramica rapida</h2>
      <p className="muted">
        Basata sul profilo attuale: {profile.capital.toLocaleString("it-IT")} coins,
        rischio {profile.riskLabel()}, {profile.forgeCount} forge disponibili.
      </p>

      {bazaarLoading && <p>Caricamento dati Bazaar...</p>}
      {bazaarError && <p className="error">{bazaarError}</p>}

      {!bazaarLoading && !bazaarError && (
        <>
          <h3>Top 5 Bazaar flip per guadagno/ora stimato</h3>
          <table>
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Strategia migliore</th>
                <th>Margine %</th>
                <th>Unita/ora eseguibili</th>
                <th>Guadagno/ora stimato</th>
              </tr>
            </thead>
            <tbody>
              {topFlips.map((f) => (
                <tr key={f.productId}>
                  <td>{f.productId}</td>
                  <td>{f.bestStrategy === "ask_ask" ? "Ask buy / Ask sell" : "Insta buy / Insta sell"}</td>
                  <td>{f.bestMarginPercent.toFixed(2)}%</td>
                  <td>{f.executableUnitsPerHour.toFixed(0)}</td>
                  <td>{f.bestProfitPerHour.toLocaleString("it-IT", { maximumFractionDigits: 0 })} coins</td>
                </tr>
              ))}
              {topFlips.length === 0 && (
                <tr><td colSpan={5}>Nessun flip supera le soglie del profilo di rischio attuale.</td></tr>
              )}
            </tbody>
          </table>
          {lastUpdated && (
            <p className="muted small">Ultimo aggiornamento Bazaar: {lastUpdated.toLocaleTimeString("it-IT")}</p>
          )}
        </>
      )}

      <h3>Ricette Forge disponibili</h3>
      {itemsLoading && <p>Caricamento catalogo item...</p>}
      {!itemsLoading && (
        <p className="muted">
          {forgeRecipes ? forgeRecipes.length : 0} ricette Forge trovate nel catalogo item.
          Vai alla sezione "Forge Flips" per il calcolo dettagliato del guadagno orario.
        </p>
      )}
    </section>
  );
}
