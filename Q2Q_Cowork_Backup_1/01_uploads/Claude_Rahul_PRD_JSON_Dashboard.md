# PRD: Refactor Monolithic Investment Dashboard into Modular Static Dashboard Package (Version 2)

*Enhanced revision. Substantive changes from the original are flagged inline with `[REVISED]` and `[NEW]`, matching the house convention used in the Rahul Earnings Analysis PRD. The single most important change is the addition of a root-cause diagnosis step (Section 4.0) — without it, the refactor can ship and still feel broken.*

---

## 1. Product Name

**Investment Research Priority Dashboard — Modular Static Package Refactor**

---

## 2. Purpose

The current dashboard is generated as one large monolithic HTML file containing structure, styling, JavaScript logic, company-level data, scoring output, executive summaries, fundamentals, management scores, valuation, technicals, and options analysis.

The file is approximately **45–50 MB for 15 stocks** and is projected to approach **100 MB for 30 stocks**.

`[REVISED]` **The purpose of this PRD is to make the dashboard small, fast, maintainable, and cheap to regenerate.** The original framed the purpose as *separating files*. Separation is necessary but not sufficient: a 45 MB payload split into four files is still a 45 MB payload. The refactor must achieve **both**:

1. **Architectural separation** — stable shell vs. frequently regenerated data.
2. **Payload reduction** — the total bytes the browser must download, parse, and hold in memory must drop materially, not just move between files.

Separation without reduction relocates the problem. Both are in scope and both are acceptance-gated.

---

## 3. Key Business Objective

Create a scalable, maintainable, low-friction internal research dashboard that helps the team prioritize which companies deserve deeper investment research and thesis development, ranking companies by a composite score derived from fundamentals, management quality, valuation, technicals, options, and qualitative synthesis.

`[NEW]` **Integration objective.** This dashboard is the presentation layer for the analytical pipeline described in the Rahul Earnings Analysis PRD (management credibility scoring, `company_scores.csv`, `report_generator.py`, etc.). The dashboard data schema (Section 10) **is the integration contract** between that pipeline and this UI. The dashboard does not compute analytics; it renders the pipeline's output. This separation must be explicit so the analysis team and the dashboard can evolve independently against a versioned contract.

---

## 4. Current Problem

### 4.0 `[NEW]` Root-Cause Diagnosis (Step Zero — blocking)

Before any refactor work begins, run a **byte-decomposition audit** of the current monolithic file. 45–50 MB for 15 stocks is roughly **3 MB per stock** of what should be numeric scores and short text. That magnitude is not explained by "everything is in one HTML file." It points to one or more of:

- **Inline base64 images or charts** (technical-analysis and options charts encoded as data URIs) — by far the most likely primary cause.
- **Duplicated CSS/JS** repeated per company section instead of shared once.
- **Verbose generated markup** (deeply nested wrapper divs, repeated inline styles per cell).
- **Embedded chart-library bundles** inlined per render.
- **Raw transcript / long-form text** dumped verbatim into the page rather than summarized.

**Required deliverable for Step Zero:** `baseline_audit.md` containing a measured table:

| Component | Bytes | % of total | Per-stock | Disposition |
|---|---|---|---|---|
| HTML markup (structural) | | | | shell |
| Inline CSS | | | | extract |
| Inline JS / libraries | | | | extract |
| Company scores + text data | | | | data file |
| Charts / images (base64) | | | | **see 4.0.1** |
| Other | | | | |

**Acceptance gate:** The refactor's target sizes (Section 11) must be derived from this measured baseline. A refactor that does not reduce total payload versus this baseline does not pass, regardless of how cleanly the files are separated.

#### 4.0.1 `[NEW]` Chart and image strategy (the likely root cause)

If the audit shows charts/images are the dominant contributor, the refactor **must** change how charts are produced. Acceptable strategies, in order of preference:

1. **Render charts client-side from numeric data** (e.g., lightweight SVG or canvas drawn by `app.js` from the support/resistance/RSI/IV values already in the data file). Marginal byte cost ≈ zero; charts become a function of data, not stored assets.
2. **Single shared lightweight charting routine** in `app.js`, no per-company library copies.
3. **External SVG files** referenced by path (works under `file://`), generated once per refresh, only for charts that cannot be drawn from data.

Inlined base64 raster images per company are **prohibited** in the refactored package. This single decision is likely worth more than the entire file-separation effort.

### 4.1 Current Architecture

One large HTML file containing layout, CSS, JS, company data, scores, summaries, tables, charts, possibly inline images, and all rendered sections for every company.

### 4.2 Problems With Current Approach

The original PRD's enumeration is retained and correct:

1. File size growing too fast (15 → ~50 MB, 30 → ~100 MB).
2. Browser load/parse/render/memory degradation — *note this is a **payload** problem, addressed by 4.0, not solved by separation alone.*
3. Every small data update regenerates the whole file (time, compute, tokens, review).
4. Styling and data are coupled.
5. Google Drive does not render HTML as a hosted webpage.
6. Plain JSON `fetch()` fails under the `file://` protocol on double-click.

`[NEW]` Problem 7: **No single source of truth for the composite score and rank.** It is currently undefined whether the composite is computed by the generator and baked into the output, or computed in the browser from category scores and weights. If both code paths exist, they will disagree. This ambiguity makes "ranking must match the old dashboard" untestable. Resolved in Section 9.7.

---

## 5. Proposed Solution

Refactor into a modular static dashboard package **and** reduce payload per Section 4.0.

### 5.1 Recommended Immediate File Structure

```text
investment-dashboard/
├── index.html
├── README.md
├── baseline_audit.md          [NEW] root-cause measurement, kept for reference
├── generate_data.py           [NEW] the ONLY script that writes data files
├── assets/
│   ├── styles.css
│   └── app.js
└── data/
    ├── dashboard-data.js       primary local-compatible runtime file
    └── dashboard-data.json     canonical JSON, for validation + future hosting
```

`[NEW]` **`generate_data.py` is a first-class deliverable.** It consumes the analysis pipeline's outputs (e.g., `company_scores.csv`, scorecards, summaries) and emits **only** `data/dashboard-data.js` and `data/dashboard-data.json`. It must be physically incapable of touching `index.html`, `styles.css`, or `app.js`. This makes "only the data file regenerates" a **structural guarantee**, not a behavioral instruction to an agent that will not remember it next session (see Section 22 / original Risk 7).

### 5.2 Role of Each File

#### `index.html`
Small, stable shell: page skeleton, CSS link, data + app script tags, root container. No inline data, no large inline CSS/JS.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Investment Research Priority Dashboard</title>
  <link rel="stylesheet" href="./assets/styles.css" />
</head>
<body>
  <div id="dashboard-root" role="main"></div>

  <script src="./data/dashboard-data.js"></script>
  <script src="./assets/app.js" defer></script>
</body>
</html>
```

#### `assets/styles.css`
Stable styling: layout, typography, scorecards, tables, tabs, filters, badges, responsive, print. Not regenerated on data refresh.

#### `assets/app.js`
Stable rendering/interaction logic. Reads `window.DASHBOARD_DATA`, validates schema (including version compatibility — Section 14.3), renders, sorts/filters/searches, draws charts from data (4.0.1), and renders explicit error states. Not regenerated on data refresh.

#### `data/dashboard-data.js`
`[REVISED]` Primary local-compatible data file. **The data must be a JSON string parsed at load, not a raw object literal:**

```javascript
window.DASHBOARD_DATA = JSON.parse(
  '{"schemaVersion":"1.0.0","generatedAt":"2026-05-16T07:00:00Z", ... }'
);
```

Rationale: a multi-megabyte raw JS object literal is parsed by the JavaScript engine's full expression parser and is the slowest possible load path; `JSON.parse` of a string literal is markedly faster at scale and is the documented fast path for large embedded data. It is also safer — a raw object literal in a `<script>` is executable code, so a malformed or injected value can execute; a JSON string passed to `JSON.parse` cannot. The generator must JSON-encode the payload and emit it as a single properly escaped string literal.

#### `data/dashboard-data.json`
Canonical JSON. Used by the automated validator (Section 17/20) every refresh — not optional for validation — and by future hosted deployments.

---

## 6. Immediate Product Goal

Preserve the current dashboard experience and analytical content while changing the architecture **and reducing payload**. Not a redesign. Separate presentation shell, styling, rendering logic, and generated data, and eliminate the byte bloat identified in Section 4.0.

---

## 7. Target Users

Internal investment research team (Rahul, Megha, Sreeni, other analysts/collaborators). Users read investment dashboards comfortably but should not need web-development knowledge. Workflow: download folder/zip → open `index.html` → review ranked companies → decide research focus.

---

## 8. User Workflow

### 8.1 Current Short-Term Workflow (no hosting)
Generate package → package contains `index.html`, `assets/`, `data/` → upload zip to Google Drive → team downloads locally → opens `index.html` → renders locally.

### 8.2 Google Drive Note
Drive is a file-sharing mechanism, not a web host. Clicking HTML in Drive shows raw HTML/preview; downloading and opening `index.html` renders the dashboard.

### 8.3 Future Hosted Workflow
Same folder later deployed to a static host (Firebase, GitHub Pages, Netlify, Vercel, GCS static site, internal server); then `fetch('./data/dashboard-data.json')` becomes practical and the `.js` wrapper can be retired.

`[NEW]` ### 8.4 Dual-publish / rollback during migration
For the **first refreshed cycle after the refactor ships**, publish both the old monolithic dashboard and the new package side by side. The team validates equivalence (Section 17.5) against the live old version before the old version is retired. This is the rollback path if the new package fails ranking equivalence in production.

---

## 9. Core Product Requirements

### 9.1 Dashboard Data Separation

**Requirement.** All company-specific data moves out of HTML into the generated data file. Primary runtime file `data/dashboard-data.js` (JSON-string form per 5.2); canonical `data/dashboard-data.json`.

**Acceptance Criteria.**
- `index.html` contains no company-level data blocks.
- Routine refresh changes only `dashboard-data.js` / `.json` (structurally guaranteed by `generate_data.py`).
- CSS unchanged on data refresh.
- `app.js` unchanged on data refresh unless UI logic changes.
- Ranking output is byte-identical to the old monolithic version for the same input data (verified by automated diff — Section 17.5).

### 9.2 CSS Separation
Move all styling into `assets/styles.css`. `index.html` carries only a CSS link; no large inline blocks; styling matches or improves current; not regenerated on data refresh.

### 9.3 JavaScript Logic Separation
Move reusable rendering/interaction logic into `assets/app.js`. `index.html` carries minimal script tags; no logic duplicated in generated output; app reads `window.DASHBOARD_DATA`; renders any schema-supported number of companies; handles missing/malformed/partial data gracefully.

### 9.4 Local Browser Compatibility
Works on double-click `index.html` in current Chrome, Edge, Safari (where feasible). No local server required. Does not rely on `fetch('./data/dashboard-data.json')` as the only loading mechanism; uses the `dashboard-data.js` JSON-string wrapper for local-safe loading.

### 9.5 Data Refresh Efficiency
Routine refresh regenerates only `data/dashboard-data.js` (+ `.json`), never `index.html`, `styles.css`, `app.js`, unless layout/functionality changes. Enforced structurally by `generate_data.py` (5.1). Adding stocks 15 → 30 must not regenerate the shell. Compute/token usage materially reduced versus regenerating the monolithic HTML.

### 9.6 Preserve Existing Dashboard Content
Preserve all sections: executive summary, composite ranking, company overview, fundamentals, management score, valuation, technicals, options, score breakdown, priority ranking, risk notes, thesis notes, data/source notes. Every company and every major score category remains; composite ranking matches; no analytical section lost; users can still see *why* each company scored as it did.

### 9.7 `[REVISED]` Ranking and Scoring Transparency — and Single Source of Truth

**Requirement.** The composite score and rank are computed **once, by `generate_data.py`**, and stored in the data file as the authoritative values. `app.js` **must not recompute** the composite for display; it renders the stored `compositeScore` and `rank`. `app.js` **may** recompute as a *validation assertion* (recompute from category scores × weights, compare to stored value within a tolerance, and surface a visible warning if they disagree) but never as the displayed source.

This resolves Problem 7: there is exactly one place ranking is computed, the contract is explicit, and "ranking must match the old dashboard" becomes a precise, testable claim.

The dashboard must display: category scores, category weights, composite score, rank, priority bucket, confidence score (and what it means — see 9.7.1), key positive drivers, key negative drivers.

**Acceptance Criteria.** Each company shows a breakdown such as:

```text
Composite Score: 84.2   (stored; recompute-check OK)
Rank: #3
Priority Bucket: High Priority
Confidence: 0.74  (n = 32 claims, 8 quarters — see methodology)

Score Breakdown:
- Fundamentals: 82 / 100, weight 25%
- Management:   78 / 100, weight 15%
- Valuation:    71 / 100, weight 20%
- Technicals:   88 / 100, weight 20%
- Options:      91 / 100, weight 20%
```

#### 9.7.1 `[NEW]` Confidence score semantics
`confidenceScore` is currently undefined in the original. It must have a documented meaning. Per the Rahul PRD's sample-size-honesty principle, confidence should reflect the evidentiary basis (e.g., number of management claims, number of quarters, data completeness), not model certainty. The data file must carry the inputs behind the score (e.g., `claimCount`, `quartersCovered`, `dataCompleteness`) so the UI can show *why* confidence is what it is. A high composite with low confidence must be visually distinguishable from a high composite with high confidence.

### 9.8 Filtering, Sorting, and Search
Sort by composite/ticker/sector; filter by priority bucket and rating; search ticker/company; open detail view; collapse/expand sections. Fast for ≥30 companies; acceptable for 100 in a later phase.

### 9.9 Error Handling
Explicit states for: data file missing; data failed to load; `window.DASHBOARD_DATA` undefined; unsupported schema version; empty companies array; required score fields missing; partial per-company data. Never a blank page. Example messages preserved from original.

`[NEW]` Error rendering must itself be safe: error templates use `textContent`, never string-built HTML, so a malformed data file cannot turn an error screen into an injection vector.

---

## 10. Recommended Data Schema

`[REVISED]` The schema is the integration contract with the analysis pipeline (Section 3). It is explicit, versioned, and stable. Field names and types are normative.

### 10.1 Top-Level Schema

```jsonc
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2026-05-16T07:00:00Z",   // UTC ISO-8601; UI localizes for display
  "generatedBy": "generate_data.py",
  "dashboardVersion": "1.0.0",
  "pipelineRunId": "",                       // [NEW] ties back to analysis pipeline run
  "universeName": "Growth Stock Research Universe",
  "universeDescription": "Priority ranking dashboard for growth-stock and options research.",
  "baseCurrency": "USD",

  "scoringModel": {
    "modelVersion": "1.0.0",
    "compositeScoreScale": "0-100",
    "rankingMethod": "weighted_average",
    "compositeComputedBy": "generate_data.py",   // [NEW] single source of truth
    "weights": {
      "fundamentals": 0.25,
      "management": 0.15,
      "valuation": 0.20,
      "technicals": 0.20,
      "options": 0.20
    },
    "weightsSumTo": 1.0,                          // [NEW] asserted by validator
    "notes": "Weights are configurable and reviewed periodically."
  },

  "summary": {
    "totalCompanies": 0,
    "highPriorityCount": 0,
    "mediumPriorityCount": 0,
    "lowPriorityCount": 0,
    "topRankedTickers": [],
    "generatedForPeriod": "Current research cycle"
  },

  "companies": []
}
```

### 10.2 Company Object Schema

Retained from the original with these additions/changes:

- `compositeScore` and `rank` are **authoritative stored values** (9.7).
- `confidence` becomes an object, not a bare float:

```jsonc
"confidence": {
  "score": 0.74,
  "basis": { "claimCount": 32, "quartersCovered": 8, "dataCompleteness": 0.91 },
  "notes": "Confidence reflects evidentiary depth, not model certainty."
}
```

- Every `null`-able metric has a defined display convention (Section 11.3 `[NEW]`).
- `sourceAudit` retained; add `pipelineRunId` echo so a company row can be traced to the exact analysis run that produced it.

The remaining structure (`scores`, `fundamentals`, `management`, `valuation`, `technicals`, `options`, `thesis`, `sourceAudit`) is preserved as written in the original.

---

## 11. Performance Requirements

### 11.1 `[REVISED]` Size Targets — derived from the measured baseline

Targets are **relative to the Section 4.0 audit**, not absolute guesses:

| File | Target |
|---|---|
| `index.html` | < 50 KB |
| `styles.css` | < 250 KB |
| `app.js` | < 500 KB (chart routine included; no per-company libraries) |
| `dashboard-data.js` (30 stocks) | **≤ 20% of the audited current data+chart bytes**, after charts move to data-driven rendering (4.0.1) |

**Hard circuit-breaker `[NEW]`:** if `dashboard-data.js` exceeds **8 MB**, the per-ticker chunking plan (Section 20 Phase 3) is triggered immediately rather than deferred. This prevents silently rebuilding the original problem at ~50 stocks.

### 11.2 Rendering Strategy
Initial render: header, summary stats, ranking table, filter controls only. Company detail rendered on selection. Detailed sub-sections rendered on expand. Keeps initial DOM small.

`[NEW]` Note the boundary: lazy rendering controls **DOM size and render time**. It does **not** reduce the parse/memory cost of the data file itself — that is controlled only by Section 4.0/4.0.1. Both mechanisms are required.

### 11.3 `[NEW]` Null / missing-value display convention
Single documented convention for absent metrics (recommended: render `—` and tag the field so it is filterable as "missing data"). The same convention everywhere; never blank cells that look like zeros, never `null`/`undefined`/`NaN` reaching the DOM.

---

## 12. Local File Loading Requirement

Use the script-tag + `window.DASHBOARD_DATA = JSON.parse('…')` pattern (5.2) for the immediate local workflow. Do not depend solely on `fetch('./data/dashboard-data.json')` for the first implementation (fails under `file://`). The JSON file is still produced every refresh for validation and future hosting.

---

## 13. Security Requirements

`[REVISED]` Strengthened from "prefer" to "must":

- No `eval()`, no `new Function()`.
- Data is loaded via `JSON.parse` of a string, never as a raw object literal (5.2) — this is both a performance and a security requirement.
- **All** text from the data file is inserted with `textContent` / safe DOM node creation. Building HTML strings from data values is prohibited, not discouraged.
- A single shared `escape()`/safe-render utility; no ad-hoc string concatenation into `innerHTML` anywhere.
- No external scripts/CDNs; everything is local and version-controlled.
- No secrets, API keys, credentials, or non-public-approved data in any file (validator-enforced — Section 20 Phase 5).

`[NEW]` Rationale tie-in: executive summaries and `notableQuotes` are LLM- and transcript-derived per the analysis pipeline. They are exactly the content most likely to contain characters that break naive HTML rendering. Treat all data-file strings as untrusted for rendering purposes.

**Acceptance Criteria.** Summaries cannot break layout; special characters render safely; no credentials in any generated file (automated check).

---

## 14. Maintainability Requirements

### 14.1 Stable Files
`index.html`, `assets/styles.css`, `assets/app.js` — change only on a product/UI change. Stability is **structurally enforced** because `generate_data.py` cannot write them (5.1).

### 14.2 Generated Files
`data/dashboard-data.js`, `data/dashboard-data.json` — regenerated every refresh.

### 14.3 `[REVISED]` Versioning and compatibility policy
Data carries `schemaVersion`, `dashboardVersion`, `generatedAt`, `modelVersion`. `app.js` implements an explicit policy, not just a hard fail:

- **Same major, app ≥ data minor:** render normally.
- **Same major, data minor > app minor:** render with a non-blocking banner ("data uses newer minor schema; some fields may not display").
- **Major mismatch:** block with the clear message from 9.9.

The compatibility matrix lives in `README.md` and a comment block at the top of `app.js`.

### 14.4 README
Includes: how to open locally, required folder structure, which file regenerates, troubleshooting, Google Drive limitation, future hosting note, `[NEW]` schema compatibility matrix.

---

## 15. README Requirements

Retained from original, plus the schema compatibility matrix and a one-line note that `generate_data.py` is the only script that may write `data/`.

---

## 16. Migration Plan

`[REVISED]` Phase 0 added; later phases renumbered.

- **Phase 0 — Root-cause audit (blocking).** Produce `baseline_audit.md` (4.0). Decide chart strategy (4.0.1). No other work starts until this is done and the byte breakdown is understood.
- **Phase 1 — Extract & decompose.** Inspect monolith; identify inline CSS/JS, data blocks, ranking logic, rendering logic, static layout, dynamic sections, and **chart/image payload**.
- **Phase 2 — Static shell** (`index.html`).
- **Phase 3 — Extract CSS** → `assets/styles.css`.
- **Phase 4 — Extract JS rendering** → `assets/app.js`, including the data-driven chart routine.
- **Phase 5 — Build `generate_data.py`** and emit `data/dashboard-data.js` (JSON-string form) + `data/dashboard-data.json`.
- **Phase 6 — Equivalence validation.** Automated old-vs-new diff of companies, ranks, composite scores, category scores (Section 17.5). Visual spot-check is secondary, not the gate.
- **Phase 7 — Performance test.** 15 / 30 / simulated 50 / simulated 100. Record file sizes (vs. Phase 0 baseline), time to first render, responsiveness, memory, sort/filter speed.

---

## 17. Acceptance Criteria

`[REVISED]` Each criterion is now measurable.

### 17.1 File structure
Package contains `index.html`, `assets/styles.css`, `assets/app.js`, `data/dashboard-data.js`, `data/dashboard-data.json`, `README.md`, `generate_data.py`, `baseline_audit.md`.

### 17.2 Local opening
Download full folder, double-click `index.html`, dashboard renders, in Chrome and Edge (Safari where feasible).

### 17.3 No hosting required
No Google Sites/Firebase/local server/Python or Node server needed for v1.

### 17.4 Data-only refresh
Updating metrics changes only `data/`; verified by checksum/timestamp of the three stable files being unchanged across a refresh.

### 17.5 `[REVISED]` Ranking preservation — automated
A script loads the old monolith's data and the new `dashboard-data.json` and asserts: identical company set, identical `rank` ordering, `compositeScore` equal within ≤ 0.01, every category score equal within ≤ 0.01. The build fails on any mismatch. "Looks similar" is not acceptance.

### 17.6 `[REVISED]` Visual preservation — defined
Every section listed in 9.6 is present for a sampled set of 5 companies; layout reviewed against the old version. This is a checklist with named sections, not a subjective "substantially similar."

### 17.7 Error handling
Missing `dashboard-data.js` → helpful message, not blank page (automated by renaming the file in a test).

### 17.8 Payload reduction `[NEW]`
Total downloaded+parsed bytes for 30 simulated stocks is **measurably lower** than the Phase 0 baseline extrapolated to 30 stocks, with the audit table reproduced post-refactor for comparison. A refactor that only relocates bytes fails this criterion.

### 17.9 Google Drive limitation documented
README states Drive is for sharing, not rendering.

---

## 18. Detailed Functional Requirements

`[RETAINED]` Sections 18.1–18.6 from the original (header, summary cards, ranking table, company detail view, score explanation, priority buckets with configurable thresholds) are carried forward unchanged, with two additions:

- `[NEW]` Ranking table and detail views render via the safe DOM utility (Section 13), never string-built HTML.
- `[NEW]` Score explanation text is stored in the data file (generated by the pipeline), not synthesized in the browser, preserving the single-source-of-truth principle.

Priority bucket thresholds (High ≥ 85, Medium 70–84, Low 55–69, Watchlist 40–54, Avoid < 40) live in `scoringModel` in the data file so they are configurable without touching `app.js`.

---

## 19. Non-Goals for First Version

Unchanged: full cloud hosting, auth, real-time refresh, live browser API calls, multi-user editing, database backend, login protection, charting-library migration beyond the data-driven routine, full mobile redesign, portfolio construction, trade execution, broker integration, automated order generation.

---

## 20. Future Phase Recommendations

`[RETAINED + REVISED]`

- **Phase 2 — Static hosting.** Deploy the same folder; `fetch('./data/dashboard-data.json')` becomes practical and the `.js` wrapper is retired.
- **Phase 3 — Per-ticker chunks.** `data/manifest.json` + `data/tickers/<TICKER>.json`; initial load reads only the manifest. `[REVISED]` Triggered automatically by the 8 MB circuit-breaker (11.1), not only at 100+ stocks.
- **Phase 4 — Compression & cache busting.** gzip/Brotli, versioned filenames.
- **Phase 5 — Automated validation (promoted to Phase 1 scope for the equivalence and credential checks).** Every company has ticker + composite; scores in [0,100]; weights sum to 1.0; rank order matches composite order; required sections present; no `NaN`/`undefined`; no credentials. The credential scan and the ranking-equivalence diff are **not deferred** — they run in Phase 6 of the migration and on every refresh thereafter.

---

## 21. Risks and Mitigations

`[REVISED]` — additions in bold.

| Risk | Mitigation |
|---|---|
| Plain JSON fails on local `file://` | `dashboard-data.js` with `JSON.parse` string wrapper |
| Team downloads only `index.html` | Ship a zip; README; helpful error; clear folder name `investment-dashboard-YYYY-MM-DD.zip` |
| Data file still too large | **Section 4.0 root-cause fix + 8 MB circuit-breaker → Phase 3 chunking** |
| Generated summaries contain unsafe characters | Mandatory single safe-render utility; `textContent` only |
| Schema drift | `schemaVersion` + explicit compatibility policy (14.3) |
| Styling breaks when data changes | Data/style separation; defensive rendering for missing fields (11.3) |
| Agent regenerates everything anyway | **Structural: `generate_data.py` physically cannot write the stable files (5.1). This replaces the original's "instruct the agent" mitigation, which is unreliable across sessions.** |
| **Composite/rank computed in two places and desync** | **Single source of truth: generator computes, app renders, app-side recompute is a warning-only assertion (9.7)** |
| **Charts are the real bloat and remain inlined** | **Data-driven chart rendering mandated (4.0.1); base64-per-company prohibited** |
| **Refactor relocates bytes without reducing them** | **Payload-reduction acceptance gate (17.8) measured against Phase 0 baseline** |
| **No way to fall back if new package fails in production** | **Dual-publish for one cycle; old monolith retained until equivalence verified live (8.4)** |

---

## 22. Cloud Code / Claude Code Implementation Instructions

`[REVISED]` The product is **Claude Code**. The original's reliance on instructing the agent "do not regenerate stable files" is replaced by structural enforcement; the instruction below reflects that.

### Objective
Refactor the monolithic dashboard into the modular static package in Section 5.1. Do not change scoring logic or ranking output except for bug fixes. Preserve content and visual structure. **Reduce payload per Section 4.0 — separation alone is insufficient.**

### Order of work (must follow)
1. **Phase 0 first.** Produce `baseline_audit.md` with the measured byte decomposition. State the dominant contributor. Do not proceed until this is reported.
2. Decide and document the chart strategy (4.0.1). Default to client-side rendering from numeric data.
3. Build the static shell, CSS, and `app.js`.
4. Build `generate_data.py` as the **only** writer of `data/`. It must not contain any code path that writes `index.html`, `styles.css`, or `app.js`.
5. Emit `dashboard-data.js` using `window.DASHBOARD_DATA = JSON.parse('<escaped JSON string>')` — **not** a raw object literal.
6. Run the equivalence diff and the credential/`NaN` scan. Report results.

### Hard requirements
- `JSON.parse`-string data form (5.2). Raw object literal is rejected.
- Single source of truth for composite/rank (9.7). App renders stored values; app-side recompute is a warning-only check.
- All data strings rendered via `textContent` / safe DOM construction; no HTML string-building from data (13).
- No external scripts/CDNs; no secrets in any file.
- Charts rendered from data, not inlined as per-company base64 (4.0.1).

### Acceptance tests (must all pass)
1. `index.html` opens locally and renders.
2. Equivalence diff passes (17.5): identical company set, identical rank order, composite/category scores equal within 0.01.
3. CSS from `assets/styles.css`; data from `data/dashboard-data.js`; logic from `assets/app.js`.
4. Missing data file → helpful error, not blank page.
5. Three stable files are byte-unchanged across a simulated data refresh.
6. Post-refactor audit table shows total payload measurably below the Phase 0 baseline extrapolated to 30 stocks (17.8).
7. No major dashboard section lost (17.6 checklist).
8. Credential / `NaN` / weights-sum scan passes.

---

## 23. Recommended First Implementation Decision

For the current internal workflow:

```text
index.html
assets/styles.css
assets/app.js
data/dashboard-data.js   (JSON.parse string form — primary, local-safe)
data/dashboard-data.json (canonical — validation now, hosting later)
generate_data.py         (only writer of data/)
baseline_audit.md         (Phase 0 root-cause record)
```

`[REVISED]` Pure JSON + `fetch()` is correct for hosted sites; the `JSON.parse`-string `dashboard-data.js` is correct for double-click local use **and** is the fast, safe load path even at scale. The structure is not "two files" or "JSON + CSS" — it is a stable app (HTML + CSS + JS + generator) plus a regenerated data payload, where the payload has been **reduced at the source**, not merely moved.

---

## 24. Strategic Rationale

The modular direction is right. The decisive correction in this revision is that **modularity and payload reduction are two different problems, and the original PRD only solved the first.** Splitting a 45 MB monolith into four files yields four files totaling ~45 MB and a browser that still chokes on parse and memory. The wins the team actually wants — faster regeneration, lower Claude Code credit usage, easier review, smaller load, better browser performance, a clean hosting path, and scaling from 15 to 100+ stocks — depend on:

1. Diagnosing where the bytes actually are (Section 4.0).
2. Removing them at the source, almost certainly by rendering charts from data instead of storing them (4.0.1).
3. Enforcing the stable/generated split **structurally** via `generate_data.py`, not by hoping an agent remembers an instruction.
4. Fixing the single-source-of-truth ambiguity so "ranking matches" is a testable claim.
5. Treating the data schema as the **versioned integration contract** with the analysis pipeline, so the two projects can evolve independently.

That is the modular structure worth building.
