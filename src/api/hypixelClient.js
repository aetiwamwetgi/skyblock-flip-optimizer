const isDev = import.meta.env.DEV;
const BASE = isDev ? "/hapi" : "https://api.hypixel.net";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Richiesta fallita (${res.status}) verso ${url}`);
  }
  return res.json();
}

export async function fetchBazaar() {
  const data = await getJson(`${BASE}/v2/skyblock/bazaar`);
  if (!data.success) throw new Error("Bazaar API: risposta non valida");
  return data.products;
}

export async function fetchItems() {
  const data = await getJson(`${BASE}/resources/skyblock/items`);
  if (!data.success) throw new Error("Items API: risposta non valida");
  return data.items;
}

export function extractForgeRecipes(items) {
  return items
    .filter((item) => item.recipe && Object.keys(item.recipe).some((k) => k.startsWith("forge")))
    .map((item) => {
      const ingredients = Object.entries(item.recipe)
        .filter(([k]) => k.startsWith("forge") && k !== "forge_time")
        .map(([, value]) => {
          const [itemId, amountStr] = String(value).split(":");
          return { itemId, amount: Number(amountStr) || 1 };
        });
      return {
        resultId: item.id,
        resultName: item.name,
        forgeTimeSeconds: Number(item.recipe.forge_time) || 0,
        ingredients,
      };
    });
}

export async function fetchAuctionsPage(page = 0) {
  const data = await getJson(`${BASE}/v2/skyblock/auctions?page=${page}`);
  if (!data.success) throw new Error("Auctions API: risposta non valida");
  return data;
}
