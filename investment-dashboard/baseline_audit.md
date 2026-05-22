# Baseline Audit — Phase 0 (Root-Cause Diagnosis)

_Per PRD v2 §4.0, this audit is **blocking** for all subsequent refactor work. It measures the byte composition of the current monolithic dashboard so that target sizes (§11.1) and the chart strategy (§4.0.1) are derived from data, not guessed._

## Source

- **File:** `fixtures/legacy_dashboard_sample/dashboard_monolith.html`
- **Total bytes:** 47,977,082 (45.75 MB)
- **Stocks in file:** 16
- **Per-stock bytes:** 2,998,567 (2928 KB)
- **Inline base64 images:** 386
- **Decoded image bytes (approx):** 33,895,701 (32.33 MB)

## Byte Decomposition

| Component | Bytes | % of total | Per-stock | Disposition |
|---|---:|---:|---:|---|
| Charts / inline images (base64) | 45,193,458 | 94.2% | 2,824,591 | see 4.0.1 |
| Inline JS (renderer/logic) | 2,577,125 | 5.4% | 161,070 | extract → app.js |
| Inline JS (company data) | 183,911 | 0.4% | 11,494 | data file |
| Inline CSS | 22,588 | 0.0% | 1,412 | extract → styles.css |
| Structural HTML markup | 0 | 0.0% | 0 | shell → index.html |
| Other / unaccounted | 0 | 0.0% | 0 | — |
| **TOTAL** | **47,977,082** | **100.0%** | **2,998,567** | — |

## Dominant Contributor

**Charts / inline images (base64)** at 45,193,458 bytes (94.2% of the file). This is the byte category the refactor must reduce at the source — moving these bytes to a different file does not pass the payload-reduction acceptance gate (PRD §17.8).

## Chart Strategy Decision (PRD §4.0.1)

**Selected:** Client-side rendering from numeric data (PRD §4.0.1 option 1).

Rationale: per the PRD's preferred option, charts will be rendered client-side from numeric values already in the data file (ATM IV by expiry, OI by strike, max-pain per expiry, SMA/RSI/ADX/ATR, peer-comp multiples). Marginal byte cost is ~zero — charts become a function of data, not stored assets. Inlined base64 raster images per company are prohibited in the refactored package.

## Target Sizes (derived from this baseline)

Per PRD §11.1, `dashboard-data.js` for 30 stocks must be **≤ 20% of the audited current data+chart bytes** after charts move to data-driven rendering. Current data+chart bytes (16 stocks) = 45,377,369. Extrapolated to 30 stocks: ~85,082,566 bytes. **Target ceiling for `dashboard-data.js` at 30 stocks: 17,016,513 bytes** (20% of extrapolated baseline).

Hard circuit-breaker (§11.1): if `dashboard-data.js` exceeds 8 MB at any stage, the per-ticker chunking plan (§20 Phase 3) is triggered immediately.

## Acceptance Gate

Post-refactor, the equivalent of this audit table must be re-measured on the new package (§17.8). A refactor that only relocates bytes without reducing total payload fails the build.
