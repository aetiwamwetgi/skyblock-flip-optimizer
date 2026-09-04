# SkyBlock Flip Optimizer

Dashboard per **Bazaar flipping** e **Forge flipping** su Hypixel SkyBlock, con calcolo di capacità di volume, profili di rischio e guadagno orario forge (1-8 forge).

## Features

### Bazaar Flips
- Scansione in tempo reale dei prezzi dal bazaar
- Calcolo automatico del profitto per flip
- Filtri per capitale minimo/massimo
- Ordinamento per profitto, ROI, volume
- Strategie di acquisto/vendita (Insta Buy/Ask, Insta Sell/Ask)

### Forge Flips
- **114 ricette della forge** supportate
- Calcolo automatico del costo dei materiali dall'API Hypixel
- Profitto per ora e profitto per forge
- Supporto per 1-8 forge simultanee
- Strategie di acquisto/vendita personalizzabili
- Ordinamento per profitto/ora, profitto totale, tempo di craft

## Installazione

```bash
# Clona il repository
git clone https://github.com/aetiwamwetgi/skyblock-flip-optimizer.git
cd skyblock-flip-optimizer

# Installa le dipendenze
npm install

# Avvia in sviluppo
npm run dev

# Build per produzione
npm run build
```

## Utilizzo

1. Apri il sito nel browser (di solito `http://localhost:5173` in sviluppo)
2. I prezzi vengono fetchati automaticamente dall'API di Hypixel ogni 60 secondi
3. Usa i controlli per:
   - Cambiare numero di forge (1-8)
   - Selezionare strategia di acquisto/vendita
   - Ordinare i risultati per diverse metriche

## API

Il progetto usa l'API pubblica di Hypixel SkyBlock:
- **Bazaar Prices**: `https://api.hypixel.net/skyblock/bazaar`
- Non richiede API key
- Rate limit: 2 richieste/secondo

## Struttura del Progetto

```
skyblock-flip-optimizer/
├── src/
│   ├── api/
│   │   └── hypixelClient.js    # Client per API Hypixel
│   ├── pages/
│   │   ├── BazaarFlips.jsx     # Pagina Bazaar Flips
│   │   ├── ForgeFlips.jsx      # Pagina Forge Flips (114 ricette)
│   │   ├── Dashboard.jsx       # Dashboard principale
│   │   └── Settings.jsx        # Impostazioni
│   ├── hooks/                  # Custom React hooks
│   │   └── useBazaarPrices.js  # Hook per fetch prezzi
│   ├── core/                   # Logica core
│   ├── styles/                 # Fogli di stile
│   ├── App.jsx                 # Componente principale
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Strategie di Trading

### Bazaar Flipping
- **Insta Buy / Insta Sell**: Compri e vendi immediatamente, profitto sicuro ma minore
- **Insta Buy / Ask Sell**: Compri subito, metti in vendita a prezzo ask, profitto maggiore ma più lento
- **Ask Buy / Insta Sell**: Metti ordine di acquisto a prezzo ask, vendi subito
- **Ask Buy / Ask Sell**: Massimizza il profitto ma richiede più tempo

### Forge Flips
- Scegli il numero di forge disponibili (1-8)
- Il sistema calcola automaticamente quale item craftare per massimizzare il profitto/ora
- Considera il tempo di craft e il prezzo corrente dei materiali

## License

MIT License - vedi file [LICENSE](LICENSE) per dettagli.

## Contributing

1. Fork il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Disclaimer

Questo tool è solo a scopo informativo. Hypixel SkyBlock è un gioco di proprietà di Hypixel Inc. Questo progetto non è affiliato con Hypixel Inc.
