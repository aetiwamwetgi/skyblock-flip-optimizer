import { create } from "zustand";
import { RISK_PROFILES } from "../core/constants.js";

export const useProfileStore = create((set, get) => ({
  capital: 100000000,
  riskKey: "bilanciato",
  forgeCount: 4,
  taxTier: "default",

  setCapital: (capital) => set({ capital: Math.max(0, Number(capital) || 0) }),
  setRiskKey: (riskKey) => set({ riskKey }),
  setForgeCount: (forgeCount) =>
    set({ forgeCount: Math.min(8, Math.max(1, Number(forgeCount) || 1)) }),
  setTaxTier: (taxTier) => set({ taxTier }),

  riskProfile: () => RISK_PROFILES[get().riskKey],
  riskLabel: () => RISK_PROFILES[get().riskKey].label,
}));
