import { BAZAAR_SELL_TAX_DEFAULT, BAZAAR_SELL_TAX_LVL25 } from "./constants.js";

export function computeMaterialsCost(ingredients, priceMap, buyStrategy = "insta") {
  let totalCost = 0;
  const breakdown = [];
  let missingPrice = false;

  for (const ing of ingredients) {
    const prices = priceMap[ing.itemId];
    if (!prices) {
      missingPrice = true;
      breakdown.push({ ...ing, unitPrice: null, lineCost: null });
      continue;
    }
    const unitPrice = buyStrategy === "ask" ? prices.askBuyPrice : prices.instaBuyPrice;
    const lineCost = unitPrice * ing.amount;
    totalCost += lineCost;
    breakdown.push({ ...ing, unitPrice, lineCost });
  }

  return { totalCost, breakdown, missingPrice };
}

export function computeSaleRevenue({
  instaSellPrice,
  askSellPrice,
  sellStrategy = "insta",
  taxTier = "default",
  sellsOnBazaar = true,
}) {
  const tax = taxTier === "lvl25" ? BAZAAR_SELL_TAX_LVL25 : BAZAAR_SELL_TAX_DEFAULT;
  const grossPrice = sellStrategy === "ask" ? askSellPrice : instaSellPrice;
  const netPrice = sellsOnBazaar ? grossPrice * (1 - tax) : grossPrice;
  return { grossPrice, netPrice };
}

export function computeForgeFlip({
  recipe,
  materialsPriceMap,
  resultInstaSellPrice,
  resultAskSellPrice,
  sellsOnBazaar = true,
  forgeCount = 1,
  taxTier = "default",
  refillOverheadSeconds = 0,
}) {
  const clampedForgeCount = Math.min(8, Math.max(1, Math.round(forgeCount)));
  const strategies = ["insta", "ask"];
  const results = [];

  for (const buyStrategy of strategies) {
    const { totalCost, breakdown, missingPrice } = computeMaterialsCost(
      recipe.ingredients,
      materialsPriceMap,
      buyStrategy
    );

    for (const sellStrategy of strategies) {
      const { grossPrice, netPrice } = computeSaleRevenue({
        instaSellPrice: resultInstaSellPrice,
        askSellPrice: resultAskSellPrice,
        sellStrategy,
        taxTier,
        sellsOnBazaar,
      });

      const profitPerCraft = netPrice - totalCost;
      const cycleTimeSeconds = recipe.forgeTimeSeconds + refillOverheadSeconds;
      const craftsPerHourPerForge = cycleTimeSeconds > 0 ? 3600 / cycleTimeSeconds : 0;
      const profitPerHourPerForge = profitPerCraft * craftsPerHourPerForge;
      const totalProfitPerHour = profitPerHourPerForge * clampedForgeCount;
      const marginPercent = totalCost > 0 ? (profitPerCraft / totalCost) * 100 : null;

      results.push({
        buyStrategy,
        sellStrategy,
        strategyLabel: `${buyStrategy === "insta" ? "Insta buy" : "Ask buy"} / ${
          sellStrategy === "insta" ? "Insta sell" : "Ask sell"
        }`,
        totalCost,
        breakdown,
        missingPrice,
        grossPrice,
        netPrice,
        profitPerCraft,
        cycleTimeSeconds,
        craftsPerHourPerForge,
        profitPerHourPerForge,
        totalProfitPerHour,
        marginPercent,
      });
    }
  }

  results.sort((a, b) => b.totalProfitPerHour - a.totalProfitPerHour);

  return {
    resultId: recipe.resultId,
    resultName: recipe.resultName,
    forgeTimeSeconds: recipe.forgeTimeSeconds,
    forgeCount: clampedForgeCount,
    strategies: results,
    best: results[0],
  };
}
