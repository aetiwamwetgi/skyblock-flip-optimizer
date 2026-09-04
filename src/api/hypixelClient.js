// API Hypixel SkyBlock Bazaar
const BAZAAR_API_URL = 'https://api.hypixel.net/skyblock/bazaar';

/**
 * Fetch dei prezzi del bazaar dall'API di Hypixel
 * Non richiede API key
 * @returns {Promise<Object>} Oggetto con i dati di tutti i prodotti del bazaar
 */
export async function fetchBazaarPrices() {
  try {
    const response = await fetch(BAZAAR_API_URL);
    
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API Hypixel ha restituito un errore');
    }
    
    return data.products;
  } catch (error) {
    console.error('Errore nel fetch dei prezzi del bazaar:', error);
    throw error;
  }
}

/**
 * Ottiene il prezzo di un singolo prodotto
 * @param {string} productId - ID del prodotto (es. "ENCHANTED_DIAMOND_BLOCK")
 * @param {Object} prices - Oggetto con tutti i prezzi dal bazaar
 * @returns {Object|null} Dati del prodotto o null se non trovato
 */
export function getProductPrice(productId, prices) {
  return prices[productId] || null;
}

/**
 * Calcola il costo totale di una lista di materiali
 * @param {Object} materials - Oggetto con { materialId: quantity }
 * @param {Object} prices - Oggetto con tutti i prezzi dal bazaar
 * @param {boolean} useInstantBuy - Se true usa instant buy, altrimenti usa instant sell
 * @returns {number} Costo totale in monete
 */
export function calculateMaterialCost(materials, prices, useInstantBuy = true) {
  let totalCost = 0;
  
  for (const [materialId, quantity] of Object.entries(materials)) {
    if (materialId === 'COINS') {
      totalCost += quantity;
      continue;
    }
    
    const product = prices[materialId];
    if (!product || !product.quick_status) {
      console.warn(`Materiale ${materialId} non trovato nel bazaar`);
      continue;
    }
    
    const price = useInstantBuy 
      ? product.quick_status.buyPrice
      : product.quick_status.sellPrice;
    
    totalCost += price * quantity;
  }
  
  return totalCost;
}

/**
 * Formatta un numero come moneta di SkyBlock
 * @param {number} coins - Numero di monete
 * @returns {string} Monete formattate
 */
export function formatCoins(coins) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(coins));
}

/**
 * Formatta le ore in formato leggibile
 * @param {number} hours - Ore (può°°° essere decimale)
 * @returns {string} Tempo formattato (es. "1h 30m")
 */
export function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}
