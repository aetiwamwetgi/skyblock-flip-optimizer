export const BAZAAR_SELL_TAX_DEFAULT = 0.0125;
export const BAZAAR_SELL_TAX_LVL25 = 0.011;
export const DEFAULT_EXECUTION_WINDOW_SECONDS = 3600;

export const RISK_PROFILES = {
  conservativo: {
    label: "Conservativo",
    minHourlyVolume: 20000,
    minMarginPercent: 2,
    maxCapitalShare: 0.15,
  },
  bilanciato: {
    label: "Bilanciato",
    minHourlyVolume: 5000,
    minMarginPercent: 4,
    maxCapitalShare: 0.3,
  },
  aggressivo: {
    label: "Aggressivo",
    minHourlyVolume: 500,
    minMarginPercent: 6,
    maxCapitalShare: 0.6,
  },
};

export const FORGE_SLOTS_MIN = 1;
export const FORGE_SLOTS_MAX = 8;
