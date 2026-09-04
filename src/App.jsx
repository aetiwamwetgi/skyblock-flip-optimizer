import React, { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import BazaarFlips from "./pages/BazaarFlips.jsx";
import ForgeFlips from "./pages/ForgeFlips.jsx";
import Settings from "./pages/Settings.jsx";
import { useProfileStore } from "./hooks/useProfileStore.js";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "bazaar", label: "Bazaar Flips" },
  { id: "forge", label: "Forge Flips" },
  { id: "settings", label: "Profilo & Rischio" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const profile = useProfileStore();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>SkyBlock Flip Optimizer</h1>
        <div className="profile-summary">
          <span>Capitale: {profile.capital.toLocaleString("it-IT")} coins</span>
          <span>Rischio: {profile.riskLabel()}</span>
          <span>Forge: {profile.forgeCount}/8</span>
        </div>
      </header>
      <nav className="app-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main className="app-main">
        {tab === "dashboard" && <Dashboard />}
        {tab === "bazaar" && <BazaarFlips />}
        {tab === "forge" && <ForgeFlips />}
        {tab === "settings" && <Settings />}
      </main>
      <footer className="app-footer">
        <small>
          Dati da Hypixel Public API. Progetto non affiliato a Hypixel/Mojang.
        </small>
      </footer>
    </div>
  );
}
