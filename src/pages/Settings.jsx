import React from "react";
import { useProfileStore } from "../hooks/useProfileStore.js";
import { RISK_PROFILES } from "../core/constants.js";

export default function Settings() {
  const {
    capital, setCapital,
    riskKey, setRiskKey,
    forgeCount, setForgeCount,
    taxTier, setTaxTier,
  } = useProfileStore();

  return (
    <section className="panel">
      <h2>Profilo di investimento</h2>
      <p className="muted">
        Questi parametri vengono applicati sia al Bazaar Flip Scanner sia al Forge Flip Calculator.
      </p>

      <div className="form-grid">
        <label>
          Capitale disponibile (coins)
          <input
            type="number"
            min="0"
            step="1000000"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
        </label>

        <label>
          Profilo di rischio
          <select value={riskKey} onChange={(e) => setRiskKey(e.target.value)}>
            {Object.entries(RISK_PROFILES).map(([key, p]) => (
              <option key={key} value={key}>{p.label}</option>
            ))}
          </select>
        </label>

        <label>
          Forge disponibili (1-8)
          <input
            type="number"
            min="1"
            max="8"
            value={forgeCount}
            onChange={(e) => setForgeCount(e.target.value)}
          />
        </label>

        <label>
          Tassa Bazaar sulle vendite
          <select value={taxTier} onChange={(e) => setTaxTier(e.target.value)}>
            <option value="default">1.25% (standard)</option>
            <option value="lvl25">1.10% (Mercante Lv.25)</option>
          </select>
        </label>
      </div>

      <div className="risk-explainer">
        <h3>Cosa cambia in base al rischio</h3>
        <table>
          <thead>
            <tr>
              <th>Profilo</th>
              <th>Volume orario minimo</th>
              <th>Margine minimo</th>
              <th>Quota massima capitale per flip</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(RISK_PROFILES).map(([key, p]) => (
              <tr key={key} className={key === riskKey ? "highlight" : ""}>
                <td>{p.label}</td>
                <td>{p.minHourlyVolume.toLocaleString("it-IT")}</td>
                <td>{p.minMarginPercent}%</td>
                <td>{Math.round(p.maxCapitalShare * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
