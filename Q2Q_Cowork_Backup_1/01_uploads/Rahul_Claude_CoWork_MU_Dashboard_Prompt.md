# Rahul Handoff: Claude CoWork Prompt to Replicate META Dashboard for Micron / MU

**Prepared for:** Rahul  
**Project:** Management Credibility / Stock Research Dashboard  
**Reference file:** `META_Dashboard_Standalone.html`  
**Target ticker:** Micron Technology, Inc. (`MU`)  
**Goal:** Replicate the completed META dashboard structure, data model, UI/UX, and research completeness for MU.

---

## 1. Rahul: What This Prompt Is For

Use this prompt in Claude CoWork when asking it to build the **Micron / MU dashboard** using the completed **META dashboard** as the reference implementation.

The key issue is that the existing META dashboard is **not fully generic**. It has reusable UI structure, but many routes, page IDs, functions, sidebar tabs, labels, and report sections are hardcoded to META. The uploaded dashboard also contains AMD transcript/filing entries, but AMD was not added as a complete first-class dashboard ticker in the same way META was.

That is likely why the AMD version did not populate with the same completeness as META.

This prompt forces Claude CoWork to update:

- Data layer
- Routing layer
- Sidebar navigation
- Report tabs
- Page functions
- Company narrative object
- MCS table
- Quarter-to-quarter analysis
- Fundamental analysis
- Technical analysis
- Options analysis
- Valuation comparables
- Consolidated view
- Executive summary
- QA checklist

The goal is not to simply replace the text “META” with “MU.” The goal is to create a full MU dashboard with the same institutional research depth as META.

---

## 2. Copy-Paste Prompt for Claude CoWork

```text
You are Claude CoWork acting as a senior full-stack financial dashboard engineer, institutional equity research analyst, and QA reviewer.

I am giving you an existing standalone HTML dashboard file named:

META_Dashboard_Standalone.html

Your task is to use this META dashboard as the exact reference implementation and create the same full dashboard experience for Micron Technology, ticker MU.

DO NOT create a simplified version.
DO NOT create only a partial dashboard.
DO NOT only change the ticker label.
DO NOT skip sections because data is harder to populate.
DO NOT leave generic placeholder content unless a data item is genuinely unavailable.
DO NOT remove existing UI structure, styling, JavaScript interactions, tabs, cards, accordions, modals, charts, tables, or report sections.

The goal is:

Replicate the META dashboard structure, UX, report sections, data model, and institutional research completeness for MU.

The final MU dashboard must have the same level of completeness as META.

==================================================
REFERENCE DASHBOARD STRUCTURE
==================================================

The META dashboard currently includes:

1. Dashboard overview
2. Sidebar navigation
3. Research by ticker
4. Company-level ticker page
5. Fundamental Analysis tab
6. Technical Analysis tab
7. MCS Score & Credibility tab
8. Options Analysis tab
9. Valuation & Comparables tab
10. Consolidated View tab
11. Executive Summary tab
12. Data pages:
   - Companies
   - Transcripts
   - SEC Filings

For META, the report tabs are:

- Fundamental Analysis
- Technical Analysis
- MCS Score & Credibility
- Options Analysis
- Valuation & Comparables
- Consolidated View
- Executive Summary

For MU, create the exact same tab structure:

- MU Fundamental Analysis
- MU Technical Analysis
- MU MCS Score & Credibility
- MU Options Analysis
- MU Valuation & Comparables
- MU Consolidated View
- MU Executive Summary

==================================================
IMPORTANT HARD-CODING ISSUE TO FIX
==================================================

The existing META dashboard hardcodes several META-specific elements, including:

- meta-summary
- meta-fundamental
- meta-technical
- meta-options
- meta-valuation
- meta-consolidated
- ticker:META
- metaSummaryPage()
- metaFundamentalPage()
- metaTechnicalPage()
- metaOptionsPage()
- metaValuationPage()
- metaConsolidatedPage()

For MU, do not leave these hardcoded as META-only.

You may either:

Option A:
Create MU-specific equivalents:

- mu-summary
- mu-fundamental
- mu-technical
- mu-options
- mu-valuation
- mu-consolidated
- ticker:MU
- muSummaryPage()
- muFundamentalPage()
- muTechnicalPage()
- muOptionsPage()
- muValuationPage()
- muConsolidatedPage()

OR, preferably:

Option B:
Refactor the dashboard into a reusable ticker-driven report system where the same functions accept a ticker parameter and render the correct data for META, MU, AMD, NVDA, etc.

Preferred architecture:

renderSummaryPage(ticker)
renderFundamentalPage(ticker)
renderTechnicalPage(ticker)
renderMCSPage(ticker)
renderOptionsPage(ticker)
renderValuationPage(ticker)
renderConsolidatedPage(ticker)

If refactoring is too risky, use Option A for MU now, but do not break META.

==================================================
REQUIRED DATA OBJECT STRUCTURE
==================================================

Add MU as a first-class company in the DATA object.

DATA.companies must include:

DATA.companies.MU = {
  ticker,
  n_claims,
  mcs_simple,
  mcs_information_adjusted,
  mcs_difficulty_weighted,
  subscores,
  baseline_random,
  baseline_always_up,
  skill_over_baseline,
  beats,
  misses,
  rows,
  fundamentals,
  q2q_analysis
}

DATA.narratives must include:

DATA.narratives.MU = {
  stance,
  color,
  summary,
  quotes,
  bull,
  bear,
  trigger_up,
  trigger_down,
  scoreboard,
  bottom_line,
  disclaimer
}

DATA.ticker_order must include MU.

The sidebar must show MU under “Research by ticker.”

MU must not appear only in transcripts or filings.
MU must be a complete dashboard ticker like META.

==================================================
REQUIRED MU DASHBOARD SECTIONS
==================================================

Build every section below.

==================================================
1. MU EXECUTIVE SUMMARY
==================================================

Create a one-page institutional summary for MU.

Required fields:

- Forward view:
  - BULLISH / BEARISH / NEUTRAL / WATCHLIST
- 6–12 month stance
- MCS score summary
- Latest revenue trend
- Latest margin trend
- Memory-cycle trend
- AI / HBM / DRAM / NAND thesis
- Capex risk
- Inventory cycle risk
- Pricing cycle risk
- China / export-control risk if relevant
- Competitive positioning
- Bottom line
- Disclaimer

Required sections:

- Bull case
- Bear case
- What would upgrade the call
- What would downgrade the call
- Bottom line
- Key forward-looking quotes from management

The tone should match the META executive summary:
institutional, concise, evidence-driven, and investment-oriented.

==================================================
2. MU FUNDAMENTAL ANALYSIS
==================================================

Replicate the META Fundamental Analysis tab for MU.

Use MU’s most recent quarter and prior quarter, preferably:

Latest reported quarter vs immediately prior quarter.

If the latest available quarters are different, use the latest two reported quarters available in the data.

Required sections:

- Overview
- Detailed financial comparison table
- Revenue growth validation
- Charts and visualizations
- Management commentary highlights
- Institutional interpretation
- Forward outlook

Required financial metrics:

Income statement:
- Revenue
- YoY revenue growth
- QoQ revenue growth
- Gross profit
- Gross margin
- Operating income
- Operating margin
- Net income
- Net margin
- Diluted EPS
- Normalized EPS if one-time items exist

Cash flow:
- Operating cash flow
- Capex
- Free cash flow
- FCF margin

Balance sheet:
- Cash and equivalents
- Debt
- Current assets
- Current liabilities
- Current ratio
- Inventory
- Inventory days / inventory trend if available
- Shareholders’ equity

Semiconductor-specific MU metrics:
- DRAM revenue
- NAND revenue
- HBM revenue or HBM commentary, if disclosed
- Data center revenue or AI-related revenue, if disclosed
- Bit shipment growth, if disclosed
- ASP trends, if disclosed
- Cost-per-bit commentary, if disclosed
- Inventory write-downs or reversals, if disclosed
- Capex intensity
- Supply discipline commentary
- Pricing-cycle commentary

Important:
For MU, the fundamental analysis must be semiconductor-specific.
Do not reuse META ad-impressions, Meta AI, Family of Apps, Reality Labs, or social-media metrics.

Replace those with:
- DRAM pricing
- NAND pricing
- HBM demand
- AI data center demand
- Memory supply discipline
- Inventory normalization
- Gross margin recovery
- Capex cycle
- End-market exposure:
  - Data center
  - PC
  - Smartphone
  - Automotive
  - Industrial
  - Consumer

==================================================
3. MU TECHNICAL ANALYSIS
==================================================

Replicate the META Technical Analysis tab for MU.

Required sections:

- Verdict and technical dashboard
- Trend structure
- Momentum analysis
- Volume and institutional activity
- Support and resistance
- Pattern recognition
- Volatility and earnings reaction
- Multi-timeframe interpretation
- Final technical verdict

Required technical indicators:

- Last close
- 52-week high
- 52-week low
- Drawdown from 52-week high
- 20-day moving average
- 50-day moving average
- 100-day moving average
- 200-day moving average
- Price relative to each moving average
- RSI
- MACD
- MACD histogram
- ADX if available
- OBV if available
- Volume trend
- Support levels
- Resistance levels
- Gap zones
- Earnings reaction history
- Multi-timeframe view:
  - Short-term
  - Intermediate-term
  - Long-term

Technical stance can disagree with fundamentals.
If it disagrees, explain why.

Example:
Fundamental view may be bullish due to memory-cycle recovery, but technical view may be bearish if price is below key moving averages.

==================================================
4. MU MCS SCORE & CREDIBILITY
==================================================

Replicate the META MCS Score & Credibility tab.

This is the most important research section.

Use the same quarter-to-quarter methodology:

Quarter N management guidance
vs.
Quarter N+1 or later actual results.

Required MCS fields:

- n_claims
- mcs_simple
- mcs_information_adjusted
- mcs_difficulty_weighted
- subscores:
  - revenue
  - margin
  - EPS
  - FCF
  - strategic
- baseline_random
- baseline_always_up
- skill_over_baseline
- beats
- misses
- pending claims
- rows table

Each claim row must include:

- claim_id
- quarter_made
- target_quarter
- guided
- actual
- pct
- accuracy
- bms
- difficulty
- pending flag if applicable
- source_quote

For MU, extract guidance from earnings-call transcripts.

Management claims should include:
- Revenue guidance
- Gross margin guidance
- EPS guidance
- Capex guidance
- HBM demand commentary
- AI/data center demand commentary
- DRAM pricing commentary
- NAND pricing commentary
- Inventory normalization commentary
- Supply discipline commentary
- Customer demand commentary
- Long-term strategic commitments

For each quarter pair, create q2q_analysis with:

metadata:
- ticker
- generated date
- method
- actuals_source
- guidance_source
- stock_price_source

fy_actuals:
- full-year revenue
- total cost
- operating income
- pretax income
- tax expense
- effective tax rate
- net income
- capex
- source filing

quarterly_revenue_actuals:
- revenue per quarter
- source filing

q_to_q_pairs:
For each call:
- made_in
- targets
- target_q_key
- transcript_source
- call_date
- next_call_date
- line_items
- narrative
- key_events
- stock_reaction
- summary_metrics

Each q_to_q line item must include:
- metric
- metric_kind
- guide_low / guide_high / guide_mid if numeric
- actual
- delta_vs_mid_pct or delta_vs_mid_pp
- verdict:
  - Beat
  - In-line
  - Miss
  - Pending
  - Delivered
  - On track
  - Partially achieved
- guide_quote
- guide_source_file
- actual_source_filing
- horizon
- scope_note if needed
- outcome_summary for strategic items
- outcome_quote if available
- outcome_source if available

Required q_to_q categories for MU:

Financial commitments:
- Revenue guide
- Gross margin guide
- EPS guide
- Operating expense guide
- Capex guide
- Tax-rate guide if available
- FCF guide if available

Strategic commitments:
- HBM ramp
- AI/data center memory demand
- DRAM supply/demand balance
- NAND recovery
- Inventory normalization
- Customer qualification
- Product node transition
- Cost reduction
- Bit growth
- Pricing recovery

Every claim must include a source quote.

Rule:
No evidence quote = no claim.

==================================================
5. MU OPTIONS ANALYSIS
==================================================

Replicate the META Options Analysis tab.

Required sections:

- Snapshot
- IV term structure
- Volatility skew
- Volatility smile by tenor
- Full volatility surface
- Open interest by strike
- Put/call ratios
- Max-pain and gamma
- Implied moves
- 7–15 day window
- First 5 weeks of expiries
- Bullish, bearish, and neutral takeaways

Required options metrics:

- Spot price
- Option-chain date
- Expirations analyzed
- ATM IV
- Front-week IV
- 30-day IV
- 60-day IV
- IV rank or IV percentile if available
- Put/call ratio by open interest
- Put/call ratio by volume
- Largest call OI strikes
- Largest put OI strikes
- Max pain
- Estimated dealer gamma profile if possible
- Implied move by expiry
- Skew:
  - 25-delta call IV
  - 25-delta put IV
  - put skew
  - call skew
- Expected earnings move if upcoming earnings exists

If options data is not available:
- Do not invent it.
- Create the full section.
- Clearly flag missing fields.
- Provide a “data needed” box listing the exact options-chain file required.
- Still include structural placeholders so the dashboard remains complete.

==================================================
6. MU VALUATION & COMPARABLES
==================================================

Replicate the META Valuation & Comparables tab.

Required sections:

- Data sources and methodology
- Overview
- MU multiples:
  - TTM
  - forward
- Peer comp table
- Charts
- Relative valuation read
- Takeaways

Required MU valuation metrics:

- Market cap
- Enterprise value
- Revenue TTM
- EBITDA TTM
- Net income TTM
- EPS TTM
- P/E TTM
- Forward P/E
- P/S TTM
- Forward P/S
- EV/Sales
- EV/EBITDA
- Price/book
- FCF yield if available
- Analyst target price if available
- Implied upside/downside if available

Recommended peer set for MU:

- Samsung Electronics, if data available
- SK Hynix, if data available
- Western Digital
- Seagate
- NVIDIA
- AMD
- Broadcom
- Intel
- Marvell
- Qualcomm
- Texas Instruments
- Lam Research
- Applied Materials

If some peers are unavailable, use the best available US-listed peer set and explicitly state limitations.

Important:
For MU, valuation must reflect cyclicality.
Do not compare MU mechanically to META.
Explain that memory companies can look optically expensive at cycle troughs and cheap at cycle peaks.
Include cycle-aware interpretation.

==================================================
7. MU CONSOLIDATED VIEW
==================================================

Replicate the META Consolidated View tab.

Required sections:

- Four-lens executive read
- Side-by-side stance grid
- What options tape adds
- Long-term buy/sell/hold strategy
- Critical-level cheat sheet
- Why fundamentals and technicals can disagree
- Open questions / what to watch next

The four lenses are:

1. Fundamental
2. Technical
3. Options
4. Valuation

Each lens must have:
- Stance
- Evidence
- Bull argument
- Bear argument
- Risk level
- What would change the stance

Create a final synthesis:

- Overall stance:
  - Bullish
  - Bearish
  - Neutral
  - Watchlist
- Time horizon:
  - 1–5 days
  - 1–4 weeks
  - 3–6 months
  - 6–12 months
- Suggested research action:
  - Monitor
  - Long watchlist
  - Avoid
  - Short candidate
  - Options candidate
  - Wait for pullback
  - Wait for confirmation

Do not provide personalized financial advice.
This is institutional research support only.

==================================================
8. DATA PAGES
==================================================

The dashboard must still include:

Companies page:
- MU must appear as a scored company if all required data exists.
- If partial, show partial status but still make MU clickable.

Transcripts page:
- Show MU transcripts with:
  - ticker
  - FY
  - FQ
  - call date
  - word count

Filings page:
- Show MU filings with:
  - ticker
  - form
  - FY
  - FQ
  - period end
  - filed date
  - accession number

==================================================
9. UI / UX REQUIREMENTS
==================================================

Preserve the META dashboard’s UI style:

- Left sidebar
- Dark/light theme toggle
- Sticky topbar
- Search box
- Cards
- Pills
- Mini cards
- Tables
- Accordions
- Quarter-to-quarter detail rows
- Modal popups
- Summary tiles
- Responsive layout
- Same CSS design language

MU should feel like the same product, not a separate rough prototype.

==================================================
10. QUALITY-CONTROL CHECKLIST
==================================================

Before finishing, verify:

[ ] MU appears in DATA.companies.
[ ] MU appears in DATA.narratives.
[ ] MU appears in DATA.ticker_order.
[ ] MU appears in the sidebar under Research by ticker.
[ ] MU has all seven research tabs.
[ ] MU Fundamental Analysis tab is populated.
[ ] MU Technical Analysis tab is populated.
[ ] MU MCS Score & Credibility tab is populated.
[ ] MU Options Analysis tab is populated or clearly flags missing data.
[ ] MU Valuation & Comparables tab is populated or clearly flags missing data.
[ ] MU Consolidated View tab is populated.
[ ] MU Executive Summary tab is populated.
[ ] MU transcripts appear on the Transcripts page.
[ ] MU SEC filings appear on the Filings page.
[ ] All hardcoded META text has been replaced or parameterized.
[ ] No META-specific metrics remain in MU unless used only as peer comparison.
[ ] No Meta AI / Family of Apps / Reality Labs / ad impressions language appears in MU sections.
[ ] MU-specific semiconductor metrics are included.
[ ] Each MCS claim has an evidence quote.
[ ] Pending claims are marked pending, not scored as delivered.
[ ] Missing data is flagged clearly.
[ ] Dashboard renders without JavaScript errors.
[ ] Sidebar navigation works.
[ ] Search works.
[ ] Dark/light theme still works.
[ ] Accordions work.
[ ] Modals work.
[ ] Tables render correctly.
[ ] Charts render correctly.
[ ] No broken download links are shown unless the files exist.

==================================================
11. OUTPUT REQUIREMENTS
==================================================

When finished, provide:

1. A standalone MU dashboard HTML file.
2. A short summary of what was populated.
3. A list of any missing data.
4. A QA checklist showing pass/fail for each dashboard section.
5. A list of code changes made:
   - DATA object updates
   - ticker_order updates
   - navigation updates
   - page function updates
   - report section updates
6. A warning list of any remaining hardcoded META dependencies, if any.

==================================================
12. IMPORTANT IMPLEMENTATION WARNING
==================================================

The original META dashboard contains hardcoded META-specific functions and page IDs.

Do not assume replacing “META” with “MU” in text is enough.

You must inspect and update:

- tickerSubpages
- sidebar rendering
- activePage routing
- reportLabels
- goPage()
- render()
- reportHero calls
- META-specific page functions
- dashboard quick-access tiles
- DATA.companies
- DATA.narratives
- DATA.transcripts
- DATA.filings
- DATA.summary
- company scorecards
- q2q_analysis
- MCS rows
- report download links

The final result must be a complete MU dashboard, not only a raw data import.

Start by reading the META dashboard file and mapping every META-specific route, function, and data dependency.
Then build MU with the same completeness.
```

---

## 3. Short Version Rahul Can Say Before Running the Prompt

Rahul can give Claude CoWork this short context before pasting the full prompt:

```text
We already built a complete META dashboard with multiple iterations. AMD did not replicate correctly because the META dashboard has many hardcoded META-specific routes, functions, and data dependencies. I now want to build MU correctly from the beginning. Please use the full prompt below and make MU a complete first-class dashboard ticker, not a partial data-only ticker.
```

---

## 4. Rahul’s Final QA Before Sending Back

Rahul should verify the MU file manually before sending it back:

| Check | Pass/Fail |
|---|---|
| MU appears in left sidebar under Research by ticker |  |
| MU has Fundamental Analysis tab |  |
| MU has Technical Analysis tab |  |
| MU has MCS Score & Credibility tab |  |
| MU has Options Analysis tab |  |
| MU has Valuation & Comparables tab |  |
| MU has Consolidated View tab |  |
| MU has Executive Summary tab |  |
| MU appears in Companies page |  |
| MU transcripts appear in Transcripts page |  |
| MU filings appear in SEC Filings page |  |
| No META-specific social-media metrics appear in MU analysis |  |
| MU semiconductor metrics are included |  |
| MCS claims include source quotes |  |
| Missing data is clearly flagged, not invented |  |
| Dashboard opens without JavaScript errors |  |
| Dark/light mode works |  |
| Search works |  |
| Accordions and modals work |  |
| Charts render correctly |  |

---

## 5. Mentor Note to Rahul

The important lesson is this:

A dashboard that works for one ticker is not automatically scalable.

For scale, the code must separate:

1. **Generic UI components**  
2. **Ticker-specific data**  
3. **Ticker-specific research narratives**  
4. **Routing and tab logic**  
5. **Data quality / missing-data flags**  

For MU, do not accept a superficial output. The correct output should feel like META: complete, structured, research-grade, and useful for an analyst building an investment thesis.
