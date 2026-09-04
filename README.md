# SkyBlock Flip Optimizer

Applicazione web per individuare e ottimizzare **Bazaar flips** e **Forge flips** su Hypixel SkyBlock, tenendo conto di capitale disponibile, tolleranza al rischio, volumi di scambio reali e strategia di acquisto/vendita (Insta vs Ask/Bid).

## Perché questo progetto

I flipping tracker esistenti (tipo SkyHelper, Sky-Economy, Coflnet flipper) mostrano margine teorico per singolo item, ma spesso ignorano:

- se il volume del bazaar è sufficiente a smaltire l'ordine senza far crollare il prezzo;
- come cambia il profitto in base al capitale disponibile e al numero di forge (1-8) posseduti;
- il confronto diretto tra strategia "Insta/Insta", "Ask/Ask" o mista, per capire quale rende di più a parità di tempo di attesa.

Questo progetto risolve tutti questi punti in un'unica dashboard.

## Funzionalità

### 1. Bazaar Flip Scanner
- Legge in tempo reale buyPrice, sellPrice, buyVolume, sellVolume di ogni prodotto Bazaar.
- Calcola margine per unità, margine %, e capacità reale di flip = quante unità puoi effettivamente comprare/vendere nella finestra di tempo scelta, in base al volume orario storico.
- Applica la tassa Bazaar (1.10% flip tax, 1.25% se non hai Mercante Livello 25 max) alle vendite ask.
- Filtra risultati per capitale massimo investibile e per profilo di rischio.

### 2. Forge Flip Calculator
- Recupera le ricette Forge (materiali richiesti + tempo di lavorazione) e il prezzo di vendita dell'oggetto risultante.
- Calcola il costo dei materiali in base alla strategia scelta per l'acquisto (Insta buy oppure Ask buy).
- Calcola il ricavo in base alla strategia di vendita scelta (Insta sell oppure Ask sell).
- Permette di specificare il numero di forge disponibili (1-8): stima il guadagno orario totale = (margine per craft / tempo di forgiatura) x numero di forge.
- Confronta automaticamente le 4 combinazioni di strategia (Insta/Insta, Insta/Ask, Ask/Insta, Ask/Ask) e segnala quale massimizza il guadagno/ora.

### 3. Profilo di investimento personalizzato
- Campo capitale disponibile (coins).
- Selettore di rischio (conservativo / bilanciato / aggressivo) che pesa volume minimo richiesto e margine minimo accettabile.
- Ordina i flip per rendimento orario atteso, non solo per margine assoluto.

## Architettura

```
src/
  api/       client per Hypixel API (bazaar, items, forge recipes, auctions)
  core/      logica di calcolo pura (flip.js, forge.js, constants.js)
  components/ componenti React riusabili
  pages/     Dashboard, BazaarFlips, ForgeFlips, Settings
  hooks/     hook di polling dati e stato globale (zustand)
```

## Fonti dati

- Bazaar: https://api.hypixel.net/v2/skyblock/bazaar (pubblica, nessuna API key richiesta)
- Item e ricette Forge: https://api.hypixel.net/resources/skyblock/items (pubblica)
- Auction House: https://api.hypixel.net/v2/skyblock/auctions

## Avvio locale

```bash
npm install
npm run dev
```

L'app parte su http://localhost:5173.

## Build e pubblicazione

```bash
npm run build
```

Il workflow incluso in `.github/workflows/deploy.yml` pubblica automaticamente la cartella `dist/` su GitHub Pages a ogni push sul branch main.

Nelle impostazioni del repository, sezione Pages, imposta la source su "GitHub Actions". Il sito sarà disponibile su `https://<tuo-utente>.github.io/skyblock-flip-optimizer/`.

## Roadmap

- Storico prezzi Bazaar (grafico 24h/7g) per stimare volatilità reale.
- Integrazione Auction House per flip di item non-Bazaar.
- Salvataggio profili di rischio/capitale in localStorage.
- Notifiche quando un flip supera una soglia di guadagno/ora.
- Confronto guadagno/ora forge flip vs bazaar flip a parità di capitale.

## Licenza

MIT. Questo progetto non è affiliato a Hypixel o Mojang; usa dati pubblici esposti dall'API ufficiale di Hypixel.
