# Adding a New Ticker to the Dashboard

A single command turns a folder of raw research inputs into a fully-populated
ticker profile that appears in the leaderboard and all 7 section tabs.

## Quick start

```bash
make add-ticker T=NFLX DIR=/path/to/nflx_inputs/
```

Or directly:

```bash
python3 add_ticker.py NFLX /path/to/nflx_inputs/
```

## Input directory layout

Drop whatever you have into one folder. The pipeline finds files by pattern and
handles missing pieces gracefully (the corresponding section just renders blank
or with a "data pending" note).

```
nflx_inputs/
├── stock_prices.xlsx         # daily OHLCV with Date + Close columns
├── options.xlsx              # OPRA chain export (any vendor)
├── factset.json              # {"target": {...}, "peers": [...]}  (or peers as dict keyed by ticker)
├── meta.json                 # optional: {"name": "Netflix Inc", "sector": "Communication Services"}
├── transcripts/
│   ├── NFLX_ER_Q4_2025.docx
│   ├── NFLX_ER_Q1_2026.docx
│   └── ... (up to 9 most-recent earnings calls)
└── filings/
    ├── nflx_companyfacts.json   # EDGAR companyfacts JSON export
    └── ... (or per-quarter parsed JSONs with `quarters[]`)
```

| File type | What it produces | If missing |
|---|---|---|
| `stock_prices.xlsx` | TA tab (SMA20/50/100/200, RSI, MACD, ATR, 52w range, perf windows) | TA tab shows "data pending" |
| `options.xlsx` | Options tab (IV term structure, top OI strikes) | Options tab shows charts only |
| `transcripts/*.docx` | MCS tab (forward claims, said vs actual) | MCS tab shows aggregate metrics only |
| `filings/*.json` | Fundamentals tab (quarter-over-quarter revenue, margins, FCF) | Fundamentals tab shows summary only |
| `factset.json` | Valuation tab (target price, peer multiples, premium/discount) | Valuation tab shows hero only |
| `meta.json` | Name + sector display in header & leaderboard | Falls back to ticker symbol |

## What gets generated

```
investment-dashboard/data/
├── companies/{T}.json     ← fundamentals + rows[] (MCS claims) + summary
├── narratives/{T}.json    ← AUTO-DRAFTED stance + bull/bear + triggers + bottom line
├── ta_levels/{T}.json     ← technical indicator snapshot
├── factset/{T}.json       ← peer comp + target multiples (copied as-is)
└── options/{T}.json       ← IV term structure + OI strikes
```

The pipeline also:
- Adds the ticker to `SUPPLEMENTARY_TICKERS` in `generate_data.py` with default
  lens scores (M derived from MCS; F/V/T/O start at 60/60/60/55 which you can
  tune for accuracy).
- Re-runs `generate_data.py` → ranks all companies including the new one.
- Re-runs `build_bundle.py` → refreshes `data/tickers-bundle.js` so the
  browser sees the new ticker immediately on reload.

## After the pipeline runs

1. **Open the dashboard.** The ticker appears in the sidebar and on the
   leaderboard with its computed composite rank.
2. **Polish the narrative.** The auto-drafted `data/narratives/{T}.json` is
   marked as "auto-drafted — please polish". Replace:
   - `stance` (currently auto-set from YoY growth — set your real call)
   - `bull` / `bear` (3 placeholder bullets each → replace with your thesis)
   - `trigger_up` / `trigger_down` (replace stub with real catalysts)
   - `scoreboard` (add 3-4 metric → baseline → latest → verdict rows)
   - `bottom_line` (replace AUTO-DRAFT with your synthesis)
   - `quotes` (paste 2-4 verbatim CEO/CFO quotes from transcripts)
3. **Refresh the bundle:** `python3 build_bundle.py`
4. **Reload the browser** — your narrative changes are live.

## Tuning the lens scores

The auto-pipeline sets F/V/T/O lens scores to defaults (60/60/60/55). To make
the composite ranking more accurate, edit the corresponding entry in
`generate_data.py → SUPPLEMENTARY_TICKERS` with your researched values:

| Lens | What it measures | Where to look |
|---|---|---|
| F (Fundamentals) | Revenue trajectory + margin profile + FCF generation | Fundamentals tab |
| M (Management) | MCS — % of forward claims met or beaten | MCS tab (auto-set from your data) |
| V (Valuation) | P/E + EV/EBITDA vs peer median; premium/discount | Valuation tab |
| T (Technicals) | Trend regime (above 200dma + momentum) + 1y return | Technical tab |
| O (Options) | IV term structure + P/C OI ratio + skew | Options tab |

Then re-run `python3 generate_data.py && python3 build_bundle.py` to update
the rank.

## Example: adding NFLX from scratch

```bash
# 1. Collect raw inputs
mkdir nflx_inputs
cp ~/Downloads/NFLX_*.docx nflx_inputs/transcripts/
cp ~/Downloads/NFLX_stock.xlsx nflx_inputs/stock_prices.xlsx
cp ~/Downloads/NFLX_options.xlsx nflx_inputs/options.xlsx
cp ~/Downloads/NFLX_factset_export.json nflx_inputs/factset.json

# 2. Run the pipeline
make add-ticker T=NFLX DIR=./nflx_inputs/

# Output:
#   [1/8] Computing technicals from stock prices...
#     spot=85.45 sma200=42.10 rsi14=68.3
#   [2/8] Parsing fundamentals from filings...
#     8 quarters parsed
#   [3/8] Mining forward claims from transcripts...
#     8 claims extracted
#   ...
#   ✓ NFLX added — rank 16/18, composite 45.75, bucket Watchlist

# 3. Polish narrative + refresh
edit data/narratives/NFLX.json
python3 build_bundle.py

# 4. Reload dashboard, click NFLX
```

## Verification

After adding a ticker, confirm:

```bash
make verify     # all 9 checks should pass
```

This catches schema violations, broken equivalence with legacy tickers, and
file-separation guard issues.
