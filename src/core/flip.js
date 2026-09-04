import {
  BAZAAR_SELL_TAX_DEFAULT,
  BAZAAR_SELL_TAX_LVL25,
} from "./constants.js";

export function computeBazaarFlip(quickStatus, taxTier = "default") {
  const tax = taxTier === "lvl25" ? BAZAAR_SELL_TAX_LVL25 : BAZAAR_SELL_TAX_DEFAULT;

  const instaBuyPrice = quickStatus.buyPrice;
  const instaSellPrice = quickStatus.sellPrice;

  const grossMarginInstaInsta = instaSellPrice - instaBuyPrice;

  const askBuyPrice = instaBuyPrice * 0.999;
  const askSellPrice = instaSellPrice * 1.001;
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
