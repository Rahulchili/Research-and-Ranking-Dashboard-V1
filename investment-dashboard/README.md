# Investment Research Priority Dashboard

A static web application that ranks **57 stocks** across 5 analytical lenses (Fundamentals, Management Credibility, Valuation, Technicals, Options) and computes a composite priority score.

Built by **Rahul Yalamanchili** under the mentorship of **Sreeni**, using Claude Cowork.

🌐 **Live dashboard:** _(URL will appear here once GitHub Pages is enabled)_

---

## What's in here

```
investment-dashboard/
├── index.html              ← the main page (start here in a browser)
├── assets/
│   ├── app.js              ← all rendering logic
│   ├── styles.css          ← visual design
│   └── charts/             ← 1,300+ chart PNGs (one folder per ticker)
└── data/
    ├── dashboard-data.js   ← the leaderboard (composite scores, rankings)
    ├── tickers-bundle.js   ← per-ticker data bundle
    ├── companies/          ← per-ticker fundamentals + narrative
    ├── narratives/         ← per-ticker bull/bear/triggers
    ├── factset/            ← peer comparables
    ├── ta_levels/          ← technical indicators
    └── options/            ← options chain analysis
```

## What it does

For each of 57 tickers, you get:
- **Summary tab** — thesis in one sentence, bull/bear case, lens-score rationale, scoreboard
- **Fundamental tab** — 6-10 quarters of financials + short-term & long-term horizon views
- **Management tab** — Said vs. Actual forward-claim accuracy (MCS score)
- **Valuation tab** — peer comparables, forward P/E, implied upside vs. consensus target
- **Technical tab** — moving averages, RSI/MACD/ADX, support/resistance, 30/60/90/365-day returns
- **Options tab** — IV term structure, P/C ratio, max-pain, implied moves, concrete trade strategies
- **Investment View tab** — synthesis: stance + catalysts + risks + bottom-line take

Plus the **Priority Leaderboard** on the home page with composite scoring, tier badges, confidence percentages, and a one-click Excel/CSV download.

## How to run locally

Just open `index.html` in any browser. No server required, no install.

If you want a local server (slightly cleaner asset loading):
```
python3 -m http.server 8000
```
Then visit http://localhost:8000

## How to update

The Python pipeline regenerates everything from raw inputs (SEC filings, options chains, transcripts, stock prices):

```
python3 add_ticker.py NVDA              # add one
python3 add_ticker.py "NVDA,AMD,INTC"   # add several
python3 build_bundle.py                 # rebuild the data bundle
```

See `ADD_TICKER.md` for the full pipeline documentation.

## Scoring methodology

Composite score = weighted blend of 5 lenses:

| Lens | Weight | What it measures |
|---|---|---|
| Fundamentals | 35% | Sector-relative revenue growth, margin trajectory, FCF |
| Technicals | 35% | Trend, momentum, support/resistance |
| Management | 15% | 8-quarter forward-claim accuracy (Said vs. Actual) |
| Options | 10% | IV regime, P/C OI, skew, trend alignment |
| Valuation | 5% | Forward multiples vs. sector peers, with value-trap detection |

Every score is traceable back to the underlying data — see the "Why these lens scores" panel on each ticker's Summary tab.

## Project history

Built incrementally over ~3 weeks using Claude Cowork:
- **Week 1:** 1 ticker (META) — proof of concept
- **Week 1-2:** 3 → 11 tickers
- **Week 2-3:** 11 → 31 tickers (full sector coverage)
- **Week 3:** 31 → 42 tickers (BA, CSCO, FDX, GE, GM, INTC, JNJ, JPM, KO, MCD, QCOM)
- **Week 3:** 42 → 57 tickers (ADI, SNDK, APP, CRWD, SNPS, PANW, KLAC, DDOG, COST, GS, TSM, MDB, VRT, FSLR, ORCL)

See `BUILD_NOTES.md` for the full iteration log.

## Hosting plan

| Stage | Where | Status |
|---|---|---|
| 1 | Google Drive (zip file) | ✅ Live |
| 2 | GitHub Pages (this repo) | 🟡 Setting up |
| 3 | Firebase Hosting | Pending admin |

## License

This project is private and shared only with collaborators. Source code is original work. Underlying financial data comes from public sources (SEC EDGAR) and licensed terminal exports (FactSet, excluded from any public version of this repo).
