import {
  BAZAAR_SELL_TAX_DEFAULT,
  BAZAAR_SELL_TAX_LVL25,
} from "./constants.js";

/**
 * Dato lo stato quick_status di un prodotto Bazaar, calcola le due strategie
 * di acquisto/vendita disponibili e il relativo margine.
 *
 * Semantica ufficiale Hypixel (v2/skyblock/bazaar):
 * - quick_status.buyPrice  = prezzo per un INSTANT BUY: quanto paghi comprando
 *   istantaneamente dalle sell offer piu basse esistenti sul mercato.
 * - quick_status.sellPrice = prezzo per un INSTANT SELL: quanto ottieni
 *   vendendo istantaneamente alle buy order piu alte esistenti sul mercato.
 *
 * Nel bazaar, buyPrice e' quasi sempre PIU ALTO di sellPrice (lo spread
 * bid-ask e' a sfavore di chi fa insta/insta). Il margine reale del
 * flipping si ottiene SOLO piazzando ordini (ask), non con insta/insta:
 *
 * - Per COMPRARE a buon prezzo: piazzi una BUY ORDER vicino a sellPrice
 *   (il prezzo piu basso) e aspetti che qualcuno te la riempia.
 * - Per VENDERE a buon prezzo: piazzi una SELL OFFER vicino a buyPrice
 *   (il prezzo piu alto) e aspetti che qualcuno te la compri.
 *
 * @param {object} quickStatus - campo quick_status della risposta Bazaar API
 * @param {"lvl25"|"default"} taxTier
 */
export function computeBazaarFlip(quickStatus, taxTier = "default") {
  const tax = taxTier === "lvl25" ? BAZAAR_SELL_TAX_LVL25 : BAZAAR_SELL_TAX_DEFAULT;

  const instaBuyPrice = quickStatus.buyPrice; // prezzo per comprare subito
  const instaSellPrice = quickStatus.sellPrice; // prezzo per vendere subito

  // Margine "insta/insta": compri al prezzo di mercato (buyPrice, il piu
  // alto) e rivendi istantaneamente (sellPrice, il piu basso). Quasi sempre
  // negativo, dato lo spread naturale del bazaar. Lo teniamo come riferimento
  // per mostrare all'utente perche' NON e' una strategia valida.
  const grossMarginInstaInsta = instaSellPrice - instaBuyPrice;

  // Strategia "ask/ask" CORRETTA: piazzi una buy order leggermente sopra
  // sellPrice (per essere in cima alla coda dei venditori) e una sell offer
  // leggermente sotto buyPrice (per essere in cima alla coda dei compratori).
  const askBuyPrice = instaSellPrice * 1.001;
  const askSellPrice = instaBuyPrice * 0.999;
  const grossMarginAskAsk = askSellPrice - askBuyPrice;

  const netSellInstaInsta = instaSellPrice * (1 - tax) - instaBuyPrice;
  const netSellAskAsk = askSellPrice * (1 - tax) - askBuyPrice;

  return {
    instaBuyPrice,
    instaSellPrice,
    askBuyPrice,
    askSellPrice,
    grossMarginInstaInsta,
    grossMarginAskAsk,
    netMarginInstaInsta: netSellInstaInsta,
    netMarginAskAsk: netSellAskAsk,
    marginPercentInstaInsta: (netSellInstaInsta / instaBuyPrice) * 100,
    marginPercentAskAsk: (netSellAskAsk / askBuyPrice) * 100,
  };
}

/**
 * Stima la capacità di flip reale in base al volume orario di buy/sell.
 * Il volume limitante e il minimo tra quanto puoi comprare e quanto puoi
 * vendere nella finestra di tempo, e viene ulteriormente capato dal capitale
 * disponibile diviso per il prezzo di acquisto.
 */
export function estimateFlipCapacity({
  buyMovingWeek,
  sellMovingWeek,
  buyPrice,
  capital,
  maxCapitalShare = 1,
}) {
  const hourlyBuyVolume = buyMovingWeek / (7 * 24);
  const hourlySellVolume = sellMovingWeek / (7 * 24);
  const volumeLimitedUnits = Math.min(hourlyBuyVolume, hourlySellVolume);

  const capitalForThisFlip = capital * maxCapitalShare;
  const capitalLimitedUnits = buyPrice > 0 ? capitalForThisFlip / buyPrice : 0;

  const executableUnitsPerHour = Math.max(
    0,
    Math.min(volumeLimitedUnits, capitalLimitedUnits)
  );

  return {
    hourlyBuyVolume,
    hourlySellVolume,
    volumeLimitedUnits,
    capitalLimitedUnits,
    executableUnitsPerHour,
  };
}

/**
 * Combina margine e capacita per stimare il profitto/ora di un flip Bazaar,
 * per entrambe le strategie (insta/insta e ask/ask).
 */
export function computeBazaarFlipOpportunity({
  productId,
  quickStatus,
  capital,
  riskProfile,
  taxTier = "default",
}) {
  const margins = computeBazaarFlip(quickStatus, taxTier);
  const capacity = estimateFlipCapacity({
    buyMovingWeek: quickStatus.buyMovingWeek,
    sellMovingWeek: quickStatus.sellMovingWeek,
    buyPrice: quickStatus.buyPrice,
    capital,
    maxCapitalShare: riskProfile.maxCapitalShare,
  });

  const profitPerHourInstaInsta = margins.netMarginInstaInsta * capacity.executableUnitsPerHour;
  const profitPerHourAskAsk = margins.netMarginAskAsk * capacity.executableUnitsPerHour;

  const bestStrategy =
    profitPerHourAskAsk >= profitPerHourInstaInsta ? "ask_ask" : "insta_insta";

  const bestProfitPerHour = Math.max(profitPerHourInstaInsta, profitPerHourAskAsk);
  const bestMarginPercent =
    bestStrategy === "ask_ask" ? margins.marginPercentAskAsk : margins.marginPercentInstaInsta;

  const passesRisk =
    capacity.hourlyBuyVolume >= riskProfile.minHourlyVolume &&
    capacity.hourlySellVolume >= riskProfile.minHourlyVolume &&
    bestMarginPercent >= riskProfile.minMarginPercent;

  return {
    productId,
    ...margins,
    ...capacity,
    profitPerHourInstaInsta,
    profitPerHourAskAsk,
    bestStrategy,
    bestProfitPerHour,
    bestMarginPercent,
    passesRisk,
  };
}
