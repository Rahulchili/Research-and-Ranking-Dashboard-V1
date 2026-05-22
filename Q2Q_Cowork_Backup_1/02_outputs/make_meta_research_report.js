const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require('docx');

const NAVY = "1F4E79";
const SLATE = "3D5A80";
const MINT = "2E7D32";
const RED = "C62828";
const AMBER = "B45309";
const TEXT = "333333";
const MUTED = "6B6B6B";
const LIGHT = "EFF1F4";
const BORDER = "C9CDD2";

// Helpers
const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const allBorders = { top: border, bottom: border, left: border, right: border };
const cellPad = { top: 70, bottom: 70, left: 110, right: 110 };

function tr(text, opts = {}) {
  return new TextRun({
    text, bold: !!opts.bold, italics: !!opts.italics,
    color: opts.color, size: opts.size || 18, font: "Calibri",
    underline: opts.underline ? {} : undefined,
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 80, line: 280 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [tr(text, opts)],
  });
}
function pRich(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 80, line: 280 },
    alignment: opts.align || AlignmentType.LEFT,
    children: runs.map(r => tr(r.text, r)),
  });
}
function bul(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { before: 0, after: 50, line: 270 },
    children: [tr(text, { size: 18, ...opts })],
  });
}
function bulRich(runs) {
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { before: 0, after: 50, line: 270 },
    children: runs.map(r => tr(r.text, { size: 18, ...r })),
  });
}
function quote(text, attr) {
  return [
    new Paragraph({
      spacing: { before: 60, after: 40, line: 280 },
      indent: { left: 280 },
      children: [tr('"' + text + '"', { italics: true, color: TEXT, size: 18 })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 100 },
      indent: { left: 280 },
      children: [tr('— ' + attr, { color: MUTED, size: 14 })],
    }),
  ];
}

function thCell(text, w, fill = LIGHT) {
  return new TableCell({
    borders: allBorders, width: { size: w, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR }, margins: cellPad,
    children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing:{after:0,line:240},
      children:[tr(text, { bold: true, size: 16, color: NAVY })]
    })],
  });
}
function tdCell(text, w, opts = {}) {
  return new TableCell({
    borders: allBorders, width: { size: w, type: WidthType.DXA }, margins: cellPad,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT, spacing:{after:0,line:240},
      children:[tr(text, { bold: !!opts.bold, size: 16, color: opts.color || TEXT })],
    })],
  });
}

function image(filename, w_in, h_in) {
  const fullpath = path.join('/sessions/compassionate-nice-johnson/mnt/outputs/charts', filename);
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      type: 'png',
      data: fs.readFileSync(fullpath),
      transformation: { width: w_in * 96, height: h_in * 96 },
      altText: { title: filename, description: filename, name: filename },
    })],
  });
}

function caption(text) {
  return new Paragraph({
    spacing: { before: 0, after: 120, line: 240 },
    alignment: AlignmentType.CENTER,
    children: [tr(text, { italics: true, color: MUTED, size: 14 })],
  });
}

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing:{ before: 200, after: 60 },
  children: [tr(text, { bold:true, size: 28, color: NAVY })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing:{ before: 220, after: 80 },
  children: [tr(text, { bold:true, size: 22, color: NAVY })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing:{ before: 160, after: 40 },
  children: [tr(text, { bold:true, size: 19, color: SLATE })] }); }

// ================= THE REPORT =================
const children = [
  // ---------- Header block ----------
  new Paragraph({
    spacing: { before: 0, after: 0, line: 240 }, alignment: AlignmentType.LEFT,
    children: [tr("INSTITUTIONAL EQUITY RESEARCH · COMPANY UPDATE", { bold:true, size: 14, color: MUTED })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 60 }, alignment: AlignmentType.LEFT,
    children: [tr("META PLATFORMS, INC. (NASDAQ: META)", { bold:true, size: 36, color: NAVY })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 60 }, alignment: AlignmentType.LEFT,
    children: [tr("Q4 2025 vs Q1 2026 — Quarter-to-Quarter Comparative Analysis", { bold:true, size: 24, color: SLATE })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 200 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
    children: [
      tr("Author: Rahul Yalamanchili · Coverage: Internet/Mega-cap Platforms", { color: MUTED, size: 16 }),
      tr("\tReport date: May 8, 2026", { color: MUTED, size: 16 }),
    ]
  }),
  // Top-bar verdict
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [3120, 3120, 3120],
    rows: [new TableRow({ children: [
      new TableCell({ borders: { top:border, bottom:border, left:border, right:border }, width:{size:3120,type:WidthType.DXA},
        shading:{fill:"E8F5E9", type:ShadingType.CLEAR}, margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Stance: ", { color:MUTED, bold:true, size:14 }), tr("BULLISH", { bold:true, size:18, color:MINT })] })] }),
      new TableCell({ borders: { top:border, bottom:border, left:border, right:border }, width:{size:3120,type:WidthType.DXA},
        margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Q1 2026 verdict: ", { color:MUTED, bold:true, size:14 }), tr("Beat & Raise", { bold:true, size:18, color:NAVY })] })] }),
      new TableCell({ borders: { top:border, bottom:border, left:border, right:border }, width:{size:3120,type:WidthType.DXA},
        shading:{fill:"FFF7ED", type:ShadingType.CLEAR}, margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Risk to monitor: ", { color:MUTED, bold:true, size:14 }), tr("$125–145B 2026 capex", { bold:true, size:18, color:AMBER })] })] }),
    ]})]
  }),
  new Paragraph({ spacing: { before: 80, after: 40 } }),

  // ---------- 1. Executive Summary ----------
  h1("1. Executive Summary"),
  pRich([
    { text: "META printed a high-quality Q1 2026: revenue of $56.31B (+33.1% YoY) ahead of the $53.5–56.5B guide midpoint, operating income of $22.87B at a 40.6% operating margin, and an 8-of-8 record of meeting or beating quarterly revenue commitments since Q2 2024 (MCS = 0.9589). Reported diluted EPS of $10.44 came in well ahead of last quarter's $8.87, but " },
    { text: "approximately $1.95 of that EPS print is attributable to a $5.0B tax benefit", bold:true },
    { text: " (effective tax rate of −23.1% versus management's normalized 13–16% range), which represents the partial reversal of the Q3 2025 OBBBA one-time charge. Normalized for taxes, Q1 2026 EPS is closer to $8.50 — essentially flat to Q4 2025 — and underlying net margin compresses from 38.0% (Q4 2025) to roughly 33% (Q1 2026 normalized). Operating margin is the cleanest signal and is essentially flat at ~41%." }
  ]),
  pRich([
    { text: "We are " }, { text: "BULLISH", bold:true, color: MINT },
    { text: " on a 6–12-month horizon. The case rests on four observations: (1) advertising fundamentals are " },
    { text: "accelerating, not slowing", bold:true },
    { text: " — Q1 ad impressions +19% YoY and price-per-ad +12% YoY (vs +18% / +6% in Q4 2025); (2) management's forward-guidance accuracy remains exceptional with 0 revenue misses across 8 closed quarters; (3) operating margin is holding above 40% despite the largest infrastructure ramp in the company's history; and (4) management explicitly committed on the Q4 2025 call — and reaffirmed at Q1 2026 — that 2026 operating income will exceed 2025 operating income, an unusually concrete forward-profit promise." }
  ]),
  pRich([
    { text: "The principal risk to monitor is the FY 2026 capex range, which was " },
    { text: "raised at the Q1 2026 call from $115–135B to $125–145B", bold:true },
    { text: " — roughly 3.6× the FY 2024 figure of $37.3B. The market response was clear: META traded −8.6% on the day after the print despite the revenue beat. We read this as valuation-and-capex-ROI anxiety rather than fundamental deterioration, but it requires monitoring at every print." }
  ]),

  // Page break to keep table & comparison tight
  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 2. Tabular Comparison ----------
  h1("2. Q4 2025 vs Q1 2026 — Detailed Financial Comparison"),
  p("All figures derived directly from SEC EDGAR XBRL filings. Q4 2025 is computed as FY 2025 10-K minus YTD-Q3 10-Q (the standard institutional method since META does not file a Q4 10-Q).", { color: MUTED, size: 16, italics: true, after: 120 }),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 1900, 1900, 1480, 1080],
    rows: [
      new TableRow({ children: [thCell("Metric", 3000), thCell("Q4 2025", 1900, "EEF2FF"),
        thCell("Q1 2026", 1900, "E8F5E9"), thCell("Δ QoQ", 1480), thCell("Direction", 1080)]}),

      // Revenue
      new TableRow({ children: [tdCell("Total revenue", 3000, { bold:true }),
        tdCell("$59.89B", 1900), tdCell("$56.31B", 1900, { bold:true }),
        tdCell("−$3.58B (−6.0%)", 1480, { color: AMBER }), tdCell("Seasonal", 1080, { color: AMBER, bold:true })]}),
      // YoY rev growth
      new TableRow({ children: [tdCell("YoY revenue growth", 3000),
        tdCell("+23.78%", 1900), tdCell("+33.08%", 1900, { bold:true, color: MINT }),
        tdCell("+9.30 pp", 1480, { color: MINT }), tdCell("Accelerating", 1080, { color: MINT, bold:true })]}),
      // QoQ rev growth
      new TableRow({ children: [tdCell("QoQ revenue growth", 3000),
        tdCell("+16.88%", 1900), tdCell("−5.98%", 1900),
        tdCell("Q1 always seasonally lower than Q4", 1480, { color: MUTED, size: 14 }), tdCell("Normal", 1080, { color: MUTED })]}),
      // Cost of revenue
      new TableRow({ children: [tdCell("Cost of revenue", 3000),
        tdCell("$10.91B", 1900), tdCell("$10.22B", 1900),
        tdCell("−$0.69B", 1480), tdCell("Improving", 1080, { color: MINT })]}),
      // Gross margin
      new TableRow({ children: [tdCell("Gross margin", 3000),
        tdCell("81.79%", 1900), tdCell("81.85%", 1900, { bold:true }),
        tdCell("+6 bps", 1480, { color: MINT }), tdCell("Stable", 1080, { color: MINT })]}),
      // Operating income
      new TableRow({ children: [tdCell("Operating income", 3000, { bold: true }),
        tdCell("$24.75B", 1900), tdCell("$22.87B", 1900, { bold:true }),
        tdCell("−$1.87B (−7.6%)", 1480, { color: AMBER }), tdCell("Seasonal", 1080, { color: AMBER })]}),
      // Op margin
      new TableRow({ children: [tdCell("Operating margin", 3000, { bold: true }),
        tdCell("41.31%", 1900), tdCell("40.62%", 1900, { bold: true }),
        tdCell("−69 bps", 1480, { color: AMBER }), tdCell("Slight compression", 1080, { color: AMBER })]}),
      // R&D
      new TableRow({ children: [tdCell("R&D expense", 3000),
        tdCell("$17.14B", 1900), tdCell("$17.70B", 1900),
        tdCell("+$0.56B", 1480), tdCell("Investment-led", 1080, { color: SLATE })]}),
      // R&D / rev
      new TableRow({ children: [tdCell("R&D as % of revenue", 3000),
        tdCell("28.61%", 1900), tdCell("31.43%", 1900, { bold:true }),
        tdCell("+283 bps", 1480, { color: AMBER }), tdCell("AI build", 1080, { color: AMBER })]}),
      // Effective tax rate
      new TableRow({ children: [tdCell("Effective tax rate", 3000),
        tdCell("10.20%", 1900), tdCell("−23.08%", 1900, { bold:true, color: AMBER }),
        tdCell("$5.0B tax benefit", 1480, { color: AMBER }), tdCell("One-time event", 1080, { color: AMBER, bold: true })]}),
      // Net income
      new TableRow({ children: [tdCell("Net income (reported)", 3000),
        tdCell("$22.77B", 1900), tdCell("$26.77B", 1900, { bold:true, color: MINT }),
        tdCell("+$4.01B (+17.6%)", 1480, { color: MINT }), tdCell("Inflated by tax benefit", 1080, { color: AMBER })]}),
      // Net margin
      new TableRow({ children: [tdCell("Net margin (reported)", 3000),
        tdCell("38.01%", 1900), tdCell("47.54%", 1900, { bold:true, color: MINT }),
        tdCell("+953 bps", 1480, { color: MINT }), tdCell("Tax-distorted", 1080, { color: AMBER, bold: true })]}),
      // Net margin normalized
      new TableRow({ children: [tdCell("Net margin (normalized, 13.5% tax)", 3000, { italics: true, color: SLATE }),
        tdCell("~38.0%", 1900, { italics: true }), tdCell("~33.4%", 1900, { italics: true, color: AMBER }),
        tdCell("−460 bps", 1480, { color: AMBER, italics: true }), tdCell("Underlying compression", 1080, { color: AMBER, italics: true })]}),
      // EPS reported
      new TableRow({ children: [tdCell("Diluted EPS (reported)", 3000, { bold: true }),
        tdCell("$8.87", 1900), tdCell("$10.44", 1900, { bold: true, color: MINT }),
        tdCell("+$1.57 (+17.7%)", 1480, { color: MINT }), tdCell("Reported beat", 1080, { color: MINT })]}),
      // EPS normalized
      new TableRow({ children: [tdCell("Diluted EPS (normalized, 13.5% tax)", 3000, { italics: true, color: SLATE }),
        tdCell("~$8.87", 1900, { italics: true }), tdCell("~$8.50", 1900, { italics: true, color: AMBER }),
        tdCell("−$0.37 (−4.2%)", 1480, { color: AMBER, italics: true }), tdCell("Flat-to-down ex tax", 1080, { color: AMBER, italics: true })]}),
      // Diluted shares
      new TableRow({ children: [tdCell("Diluted shares outstanding", 3000),
        tdCell("~2,569M", 1900), tdCell("2,564M", 1900),
        tdCell("−5M (buybacks)", 1480, { color: MINT }), tdCell("Modest reduction", 1080, { color: MINT })]}),
      // Operating Cash Flow (Q1 2026 only directly available; Q4 derived)
      new TableRow({ children: [tdCell("Operating cash flow", 3000),
        tdCell("~$30.4B (FY−9M derive)", 1900, { color: MUTED }), tdCell("$32.23B", 1900, { bold:true }),
        tdCell("+$1.84B", 1480, { color: MINT }), tdCell("Strong", 1080, { color: MINT, bold: true })]}),
      // Capex
      new TableRow({ children: [tdCell("Capital expenditures", 3000),
        tdCell("~$22.2B (FY−9M derive)", 1900, { color: MUTED }), tdCell("$19.00B", 1900, { bold: true }),
        tdCell("−$3.20B QoQ", 1480), tdCell("Front-loaded full-year ramp", 1080, { color: SLATE })]}),
      // FCF
      new TableRow({ children: [tdCell("Free cash flow", 3000, { bold: true }),
        tdCell("~$8.2B", 1900, { color: MUTED }), tdCell("$13.23B", 1900, { bold: true, color: MINT }),
        tdCell("+$5.0B", 1480, { color: MINT }), tdCell("Improving", 1080, { color: MINT, bold:true })]}),
      // Headcount
      new TableRow({ children: [tdCell("Period-end headcount", 3000),
        tdCell("78,800", 1900), tdCell("77,900", 1900),
        tdCell("−900 (−1%)", 1480), tdCell("Optimization in non-priority", 1080, { color: SLATE })]}),
      // Guidance — next Q
      new TableRow({ children: [tdCell("Next-quarter revenue guide", 3000, { bold:true }),
        tdCell("Q1 2026: $53.5–56.5B (mid $55.0B)", 1900),
        tdCell("Q2 2026: $58.0–61.0B (mid $59.5B)", 1900, { bold: true, color: MINT }),
        tdCell("+$4.5B mid; FX assumed +2% tailwind", 1480, { color: MINT }),
        tdCell("Raised", 1080, { color: MINT, bold:true })]}),
      // Guidance — FY capex
      new TableRow({ children: [tdCell("FY 2026 capex guide", 3000, { bold:true }),
        tdCell("$115–135B (Q4 2025 call)", 1900),
        tdCell("$125–145B (Q1 2026 call)", 1900, { bold:true, color: AMBER }),
        tdCell("+$10B at the midpoint", 1480, { color: AMBER }),
        tdCell("Raised", 1080, { color: AMBER, bold:true })]}),
      // Guidance — FY expense
      new TableRow({ children: [tdCell("FY 2026 total expense guide", 3000),
        tdCell("$162–169B (Q4 2025 call)", 1900),
        tdCell("$162–169B (Q1 2026 call)", 1900),
        tdCell("Unchanged", 1480), tdCell("Reaffirmed", 1080, { color: SLATE })]}),
      // Segment color
      new TableRow({ children: [tdCell("Family of Apps ad revenue (≈98% of total)", 3000),
        tdCell("$58.1B (+24% YoY)", 1900), tdCell("$55.0B (+33% YoY)", 1900, { bold:true, color: MINT }),
        tdCell("YoY growth +9pp", 1480, { color: MINT }), tdCell("Accelerating", 1080, { color: MINT, bold:true })]}),
      // Ad volume vs price
      new TableRow({ children: [tdCell("Ad impressions YoY / price-per-ad YoY", 3000),
        tdCell("+18% / +6%", 1900), tdCell("+19% / +12%", 1900, { bold:true, color: MINT }),
        tdCell("Pricing +6pp; volume flat", 1480, { color: MINT }),
        tdCell("Pricing-led acceleration", 1080, { color: MINT, bold:true })]}),
      // Reality Labs
      new TableRow({ children: [tdCell("Reality Labs operating loss outlook", 3000),
        tdCell("'Similar to 2024 levels in 2025; peak losses'", 1900, { size: 14, color: MUTED }),
        tdCell("Reaffirmed; 2026 RL loss similar to 2025", 1900, { size: 14, color: MUTED }),
        tdCell("In-line with multi-year frame", 1480, { color: SLATE, size: 14 }),
        tdCell("Stable", 1080, { color: SLATE })]}),
      // Stock reaction
      new TableRow({ children: [tdCell("Post-earnings 5-day reaction", 3000),
        tdCell("+0.04%", 1900), tdCell("−8.55% (1-day; T+5 outside data window)", 1900, { color: RED }),
        tdCell("Risk-off on capex raise", 1480, { color: RED }),
        tdCell("Negative", 1080, { color: RED, bold: true })]}),
    ]
  }),
  p("Highlights — positive acceleration: ad pricing growth (+6pp QoQ), revenue YoY growth (+9.3pp QoQ), FCF (+$5B QoQ). Deceleration / risk: net margin distorted by the $5.0B tax benefit (the Q3 2025 OBBBA charge reversal); operating margin compressed 69 bps QoQ; R&D / revenue rose 283 bps reflecting AI talent / infra spend. One-time items: the tax benefit is the principal one-time item; Q4 2025 also included $0.5B of legal accrual reversals lapping prior-year charges (per CFO commentary).", { before: 100, after: 0, italics: false }),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 3. Revenue Growth Validation ----------
  h1("3. Revenue Growth Validation"),
  pRich([
    { text: "Megha's question: ", bold: true },
    { text: "validate the YoY revenue trend that 'moved from approximately 16.1% to 21.6%.' We confirm the figures below directly from SEC EDGAR XBRL (concept us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax)." }
  ]),
  h3("Validation: which quarter transition is this?"),
  bulRich([{ text: "Q1 2025: ", bold: true }, { text: "Revenue $42,314M ÷ Q1 2024 $36,455M − 1 = " },
    { text: "+16.07% YoY", bold: true, color: MINT }, { text: " (rounds to 16.1%)" }]),
  bulRich([{ text: "Q2 2025: ", bold: true }, { text: "Revenue $47,516M ÷ Q2 2024 $39,071M − 1 = " },
    { text: "+21.61% YoY", bold: true, color: MINT }, { text: " (rounds to 21.6%)" }]),
  pRich([
    { text: "The 16.1% → 21.6% transition is therefore the " },
    { text: "Q1 2025 → Q2 2025", bold: true },
    { text: " sequence — confirmed exactly. (For the Q4 2025 → Q1 2026 sequence specifically, the corresponding YoY trajectory is +23.78% → +33.08%, a +9.3 pp acceleration.)" }
  ]),

  h3("What drove the Q1 2025 → Q2 2025 acceleration?"),
  bulRich([{ text: "Pricing-led, AI-attributable. ", bold: true },
    { text: "Q2 2025 ad price-per-ad accelerated reflecting improvements to META's ad-ranking and creative-generation models (Andromeda, GEM, Advantage+ portfolio). Volume (impressions) was steadier — meaning the higher YoY growth came from monetization-per-impression, not ad-load expansion. This is the highest-quality kind of revenue acceleration — it doesn't degrade user experience." }]),
  bulRich([{ text: "Easier comparison base in Q2. ", bold: true },
    { text: "Q1 2024 had been an unusually strong comp due to Chinese-cross-border advertiser strength (Temu / Shein) cited by META and Snap; Q2 2024 saw that comp normalize, leaving more room for Q2 2025 to expand on a weaker base." }]),
  bulRich([{ text: "Macro tailwind beginning to build. ", bold: true },
    { text: "By Q2 2025 advertiser sentiment was strengthening (corroborated by Snap and Pinterest reads); FX moved from a modest headwind in Q1 to neutral in Q2." }]),
  bulRich([{ text: "Not acquisition-driven, not pricing-gimmick driven. ", bold: true },
    { text: "META made no material acquisitions in the period; the price-per-ad lift reflects ranking-model performance not list-price increases (CFO commentary explicitly attributes the lift to 'ad performance improvements'). " }]),

  h3("Q4 2025 → Q1 2026 acceleration (parallel framing)"),
  pRich([{ text: "Same pricing-led pattern, even more pronounced: " },
    { text: "Q4 2025 ad volume +18% / price +6%", bold: true },
    { text: " gave way to " },
    { text: "Q1 2026 ad volume +19% / price +12%", bold: true },
    { text: ". The ~6 percentage-point lift in price-per-ad explains essentially the entire +9.3 pp YoY revenue acceleration. CFO Susan Li attributed the price lift to 'ad performance improvements, better macro conditions versus Q1 of last year, and currency tailwinds in international regions' — i.e., AI-driven targeting plus FX (~2pp tailwind)." }
  ]),
  pRich([{ text: "Bottom line on the question: " },
    { text: "the acceleration is organic and AI-driven, with a modest FX tailwind in 2026. It is not acquisition-driven, not pricing-gimmick driven, and not cyclical in any narrow sense — though it does coincide with broadly improving advertiser conditions.", bold: true }
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 4. Charts ----------
  h1("4. Charts & Visualizations"),
  h3("Revenue trend"),
  image('01_revenue_trend.png', 6.6, 3.0),
  caption("Figure 1. META quarterly revenue. Q1 2026 (mint) is the seasonal step-down from Q4 2025 (slate) but is the strongest YoY print in the dataset."),
  image('02_yoy_growth.png', 6.6, 3.0),
  caption("Figure 2. YoY revenue growth. Megha's 16.1% → 21.6% transition (Q1 → Q2 2025) is highlighted; the underlying trajectory has continued to accelerate to +33.1% in Q1 2026."),
  image('03_qoq_growth.png', 6.6, 3.0),
  caption("Figure 3. QoQ growth. Q1 is always seasonally weaker than Q4 because of the holiday ad cycle; Q1 2026's −6.0% QoQ is the smallest Q1 sequential decline in the dataset, indicating underlying strength."),

  h3("Profitability"),
  image('04_margin_trend.png', 6.6, 3.0),
  caption("Figure 4. Margin trend. Operating margin is the cleanest profit signal — held above 40% throughout the AI build. Net margin is distorted by tax events (Q3 2025 OBBBA charge; Q1 2026 partial reversal)."),
  image('05_eps_trend.png', 6.6, 3.0),
  caption("Figure 5. Diluted EPS. Reported $10.44 in Q1 2026 includes a one-time tax benefit; normalized to a 13.5% rate, EPS is closer to $8.50 — flat-to-down vs. Q4 2025's $8.87."),

  h3("Cash flow & investment"),
  image('06_cashflow_q1.png', 6.6, 3.0),
  caption("Figure 6. Q1 cash-flow comparison. OCF is growing strongly (+34% YoY), but capex is growing faster (+47% YoY). FCF still expanding QoQ but no longer doubling."),
  image('07_capex_trajectory.png', 6.6, 3.0),
  caption("Figure 7. FY capex trajectory. The 2026 guide midpoint of $135B is roughly 3.6× FY 2024. The Q1 2026 call raised the range from $115–135B to $125–145B."),

  h3("Forward guidance & investment intensity"),
  image('08_guidance_vs_actual.png', 6.6, 3.0),
  caption("Figure 8. Forward revenue guide vs actual. 8 of 8 closed quarters beat or landed in-range. Q2 2026 guide midpoint $59.5B."),
  image('09_rd_intensity.png', 6.6, 3.0),
  caption("Figure 9. R&D intensity climbing — from ~27% of revenue in early 2024 to 31.4% in Q1 2026, reflecting AI-talent and Meta Superintelligence Labs investment."),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 5. Earnings call & management commentary ----------
  h1("5. Earnings Call & Management Commentary"),
  pRich([{ text: "Tone summary: " }, { text: "Bullish.", bold: true, color: MINT },
    { text: " Both calls use confident, forward-leaning language ('major AI acceleration,' 'strong quarter,' 'industry-leading'). On the Q1 2026 call, the willingness to raise the FY 2026 capex range ten weeks after the Q4 2025 print signals very high conviction in AI-related demand visibility — but it is also the single line item that drove the post-print sell-off." }
  ]),

  h3("AI / ML — where management is leading"),
  ...quote("We are now seeing a major AI acceleration. … In '25, we rebuilt the foundations of our AI program. We're starting to see the promise of AI that understands our personal context, including our history, our interests, our content and our relationships.",
    "Mark Zuckerberg, CEO — Q4 2025 call (January 28, 2026)"),
  ...quote("Our biggest milestone so far this year has been the release of our Muse family of models and our first model MuSpark along with a significantly upgraded new version of Meta AI. … Spark has already made Meta AI a world-class assistant that leads in several areas related to our vision of personal super intelligence.",
    "Mark Zuckerberg, CEO — Q1 2026 call (April 29, 2026)"),

  h3("Demand & ad-spend commentary"),
  ...quote("Q4 Family of Apps ad revenue was $58.1 billion, up 24%. The total number of ad impressions served across our services increased 18%. The average price per ad increased 6% year-over-year, benefiting from increased advertiser demand, largely driven by improved ad performance.",
    "Susan Li, CFO — Q4 2025 call"),
  ...quote("The global average price per ad increased 12% year-over-year in Q1, with broad-based growth as we benefited from ad performance improvements, better macro conditions versus Q1 of last year, and currency tailwinds in international regions.",
    "Susan Li, CFO — Q1 2026 call"),

  h3("Margin outlook & infrastructure commentary"),
  ...quote("First quarter operating income was $22.9 billion, representing a 41% operating margin. … We continue to expect to deliver operating income this year that is above 2025 operating income.",
    "Susan Li, CFO — Q1 2026 call (reaffirming the Q4 2025 commitment)"),
  ...quote("On that note, we are increasing our infrastructure CapEx forecast for this year. … Capital expenditures, including principal payments on finance leases were $19.8 billion, driven by investments in servers, data centers and network infrastructure.",
    "Susan Li, CFO — Q1 2026 call"),

  h3("Hiring trends & competitive positioning"),
  ...quote("We ended Q1 with over 77,900 employees, down 1% from Q4 as the impact of headcount optimization efforts in certain functions was partially offset by hiring in priority areas of monetization and infrastructure. … Since the beginning of 2025, we've seen a 30% increase in output per engineer with the majority of that growth coming from the adoption of agentic coding.",
    "Susan Li, CFO — Q1 2026 / Q4 2025 calls"),
  pRich([{ text: "Read: ", bold: true },
    { text: "META is running a barbell — aggressive hiring in priority technical roles (AI infra, monetization, Superintelligence Labs) while flat-to-down on overall headcount. Output-per-engineer claim of +30% (Q4 2025) is a notable productivity signal." }
  ]),

  h3("Reality Labs / wearables"),
  ...quote("Sales of our glasses more than tripled last year, and we think that they're some of the fastest-growing consumer electronics in history. … I expect Reality Labs losses this year to be similar to last year, and this will likely be the peak as we start to gradually reduce our losses going forward.",
    "Mark Zuckerberg, CEO — Q4 2025 call"),

  h3("Macro commentary"),
  pRich([{ text: "Tone on macro is " },
    { text: "constructive but unboastful", bold: true },
    { text: ". Q4 2025: 'set against a healthy macro backdrop.' Q1 2026: 'better macro conditions versus Q1 of last year.' FX called out as a tailwind in both quarters (4pp Q4 2025; 2pp Q1 2026). No mention of recession risk or pull-forward concerns from advertisers." }
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 6. Institutional interpretation ----------
  h1("6. Institutional Interpretation"),

  h3("Why did the stock react the way it did?"),
  pRich([{ text: "Q1 2026 print: stock −8.55% on day after print (T+1). " },
    { text: "On the surface this looks irrational against a +33% YoY revenue beat with operating income at $22.9B. The market focused on three things: " }
  ]),
  bulRich([{ text: "Capex raise. ", bold: true }, { text: "FY 2026 capex range moved from $115–135B to $125–145B — the third capex raise since the original FY 2025 range was set in early 2025. Bears argue this is a 'visibility deterioration' signal; bulls argue it is high-conviction demand visibility. The market priced bears initially." }]),
  bulRich([{ text: "Reported EPS quality. ", bold: true }, { text: "$10.44 looks great on a screen, but sophisticated investors quickly discounted ~$1.95 of tax-benefit-driven EPS, leaving 'clean' EPS closer to $8.50 — below sell-side consensus models that had not adjusted for the OBBBA reversal." }]),
  bulRich([{ text: "Operating margin compression. ", bold: true }, { text: "The 69 bps QoQ slip (41.31% → 40.62%) reinforced the read that the AI build is starting to weigh on near-term operating leverage, even if revenue continues to accelerate." }]),

  h3("What metrics mattered most?"),
  bulRich([{ text: "Price-per-ad. ", bold: true }, { text: "+12% YoY in Q1 2026 vs +6% in Q4 2025. This single data point validates the AI-monetization thesis." }]),
  bulRich([{ text: "Capex range. ", bold: true }, { text: "Each $5B raise in FY capex translates to ~$1B+ of incremental annual depreciation — a real near-term margin headwind." }]),
  bulRich([{ text: "FY 2026 OI > FY 2025 OI. ", bold: true }, { text: "This explicit forward-profit commitment is what makes the bull case mathematically defensible. If management walks it back, the thesis breaks." }]),
  bulRich([{ text: "Ad impressions vs price-per-ad mix. ", bold: true }, { text: "Pricing-led growth is higher-quality than volume-led growth. META's mix has been shifting in the right direction." }]),

  h3("What hedge funds will likely focus on"),
  bulRich([{ text: "Capex / OCF ratio.", bold: true }, { text: " Q1 2026: $19.0B capex on $32.2B OCF = 59% reinvestment rate. Sustainable above 70%? Below 50% by FY 2027? This is the single most-debated forward question." }]),
  bulRich([{ text: "Revenue per employee.", bold: true }, { text: " Q1 2026: $56.3B / ~78k employees, annualized ≈ $2.9M per employee — a record. AI productivity is becoming a measurable financial line." }]),
  bulRich([{ text: "Reality Labs operating-loss trajectory.", bold: true }, { text: " Management's 'peak in 2025' commitment is the single most-tracked multi-year claim. A persistent 2026 RL loss above $18B would be a meaningful disappointment." }]),
  bulRich([{ text: "DAP / FoA monetization pivot.", bold: true }, { text: " Threads, WhatsApp business, and Reels monetization remain longer-tail catalysts the market hasn't yet priced." }]),

  h3("Was the quarter beat-and-raise, in-line, or disappointing?"),
  pRich([{ text: "Beat-and-raise on revenue (Q2 2026 mid $59.5B vs prior implied trajectory ~$57B); ", bold: true },
    { text: "raised on capex (signal-dependent — bullish or bearish depending on framing); " },
    { text: "reaffirmed on FY expense and FY operating-income > 2025. Net read: ", italics: false },
    { text: "operationally beat-and-raise; capex raise drove the negative day-after reaction.", bold: true }
  ]),

  h3("Did guidance improve materially?"),
  bulRich([{ text: "Yes on revenue. ", bold: true }, { text: "Q2 2026 mid of $59.5B implies +21% YoY growth at the midpoint vs. prior consensus modeling for ~+15%." }]),
  bulRich([{ text: "Yes on FY 2026 OI commitment.", bold: true }, { text: " Reaffirmed against a higher capex base — implicitly a tighter operating-leverage commitment." }]),
  bulRich([{ text: "Capex range went up — interpretation depends on how investors frame it.", bold: true }, { text: " For demand-visibility bulls, this is positive; for ROI bears, this is the trigger." }]),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 7. Forward outlook ----------
  h1("7. Forward Outlook"),

  h3("Q2 2026 — what we expect"),
  bulRich([{ text: "Revenue: ", bold: true }, { text: "Management guides $58–61B (mid $59.5B). Our base case is the high end given (a) Q1 2026 ad pricing inflection of +6 pp QoQ, and (b) continued FX tailwind through the quarter. Likely print: ~$60B (+22% YoY)." }]),
  bulRich([{ text: "Operating income: ", bold: true }, { text: "Likely $24–25B at ~40–41% margin, modestly above Q1 2026 absolutely with margin holding flat." }]),
  bulRich([{ text: "EPS: ", bold: true }, { text: "Normalized $9.0–9.50 range; reported could be moved by tax-true-up but base case is no further OBBBA-related reversals." }]),
  bulRich([{ text: "Capex: ", bold: true }, { text: "$22–24B run-rate (annualizes to ~$93B if held flat — but we expect H2 acceleration to bring FY into the $135–142B range)." }]),

  h3("Bull case (12-month)"),
  bulRich([{ text: "AI ROI begins to show in ad pricing. ", bold: true }, { text: "If price-per-ad sustains +10% YoY through H2 2026, FY 2026 revenue could exceed $245B vs. our base of $237–240B." }]),
  bulRich([{ text: "Operating margin holds 40%+. ", bold: true }, { text: "FY 2026 OI > $90B (vs FY 2025 $83B) — directly delivers on management's commitment." }]),
  bulRich([{ text: "Reality Labs losses peak as guided. ", bold: true }, { text: "Glasses momentum (3× sales YoY) provides a second consumer-product revenue line by 2027." }]),
  bulRich([{ text: "Capex / OCF normalizes to ~50% by FY 2027. ", bold: true }, { text: "Implies a meaningful FCF inflection." }]),

  h3("Bear case (12-month)"),
  bulRich([{ text: "Capex over-run. ", bold: true }, { text: "Range raised to $145–165B for FY 2026 mid-year, signaling further visibility deterioration; depreciation step-up compresses operating margin to high-30s; the FY 2026 OI > FY 2025 commitment is at risk." }]),
  bulRich([{ text: "Ad-pricing decelerates. ", bold: true }, { text: "Q3 2026 price-per-ad cools from +12% to +6–8% — comp normalization plus AI-targeting saturation. YoY revenue growth slips to ~+15%." }]),
  bulRich([{ text: "Reality Labs losses stay flat-to-up. ", bold: true }, { text: "Glasses ramp underwhelms vs. consumer-electronics comparisons." }]),
  bulRich([{ text: "AI competitive moat narrows. ", bold: true }, { text: "OpenAI / Google / xAI release competitive consumer assistants; Meta AI MAUs stall; pricing power slips." }]),

  h3("AI opportunity impact"),
  pRich([{ text: "AI is not an option for META — it is the entire business. The Q1 2026 commentary makes clear that ad-ranking models, content recommendation models, and creative-generation models all run on the same infrastructure stack the company is funding the $125–145B capex against. The ROI question is therefore not 'will AI generate revenue' (it already is — see the +12% price-per-ad print), but " },
    { text: "'will AI-driven monetization grow faster than the depreciation step-up from infrastructure?'", bold: true },
    { text: " Our base case says yes through FY 2026; the bear case says no by FY 2027 if capex keeps escalating without pricing follow-through." }
  ]),

  h3("Valuation re-rating potential"),
  pRich([{ text: "META trades at a forward P/E in the high-teens / low-20s historically — well below mega-cap-AI peer NVIDIA (mid-40s) or Microsoft (low-30s) on consensus. If FY 2026 reported EPS lands in the $35–38 range and the market gains conviction in (a) FY 2026 OI > FY 2025 OI, and (b) capex stabilizing at $135–145B for FY 2027 (i.e., growth rate on the capex line decelerating to single digits), a re-rating to a low-20s P/E is plausible — implying high-single-digit-percent multiple expansion on top of mid-teens earnings growth. " },
    { text: "Re-rating risk is to the downside if capex keeps escalating; the binary becomes more visible after the Q3 2026 print where management typically anchors the next year's capex range.", bold: true }
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 8. Appendix ----------
  h1("8. Appendix — Source References"),
  h3("Primary financial filings (SEC EDGAR)"),
  bul("META FY 2024 Annual Report on Form 10-K (filed Jan 30, 2025; CIK 0001326801) — accession 0001326801-25-000017"),
  bul("META FY 2025 Annual Report on Form 10-K (filed Jan 29, 2026; CIK 0001628280) — accession 0001628280-26-003942"),
  bul("META Q1 2026 10-Q — accession 0001628280-26-028526"),
  bul("META Q1–Q3 quarterly 10-Q filings 2024 / 2025 (used for YTD-derivation of Q4 standalone values)"),
  h3("XBRL concepts queried"),
  bul("us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax (revenue)"),
  bul("us-gaap:CostOfRevenue, us-gaap:CostsAndExpenses, us-gaap:ResearchAndDevelopmentExpense"),
  bul("us-gaap:OperatingIncomeLoss, us-gaap:NetIncomeLoss"),
  bul("us-gaap:IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest, us-gaap:IncomeTaxExpenseBenefit"),
  bul("us-gaap:EarningsPerShareDiluted, us-gaap:WeightedAverageNumberOfDilutedSharesOutstanding"),
  bul("us-gaap:NetCashProvidedByUsedInOperatingActivities, us-gaap:PaymentsToAcquirePropertyPlantAndEquipment"),
  h3("Earnings call transcripts"),
  bul("META_ER_Q4_2025_28-JAN-2026.docx — Q4 2025 earnings call transcript (filed in META_inbox/Transcripts/)"),
  bul("META_ER_Q1_2026_29-APR-2026.docx — Q1 2026 earnings call transcript (filed in META_inbox/Transcripts/)"),
  h3("Stock-price data"),
  bul("META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx — daily OHLCV, Jan 1 2024 – Apr 30 2026"),
  h3("Methodology notes"),
  bul("Q4 standalone values (revenue, expenses, NI, EPS) derived as FY 10-K minus YTD-Q3 10-Q. Q4 effective tax rate = Q4 tax expense / Q4 pretax income; Q4 2024 = 11.52%, Q4 2025 = 10.20%."),
  bul("Normalized EPS uses a 13.5% effective tax rate (midpoint of management's stated 12–15% normalized range, reaffirmed at Q4 2025 call) applied to GAAP pretax income."),
  bul("Stock 5-day reaction = (close at T+5 − close at T) / close at T, where T is the call date and prices are regular-session daily closes. META reports after-market-close; T close is therefore pre-print."),
  bul("Management Credibility Score (MCS) = revenue-guide accuracy aggregated across closed quarters; 1 − |actual − guide_mid| / actual."),
  pRich([{ text: "Disclaimer: ", bold:true, italics:true, color: MUTED, size: 14 },
    { text: "This report is an analytical synthesis of disclosed data on file in the management_credibility_project workspace. It is not a buy/sell recommendation or personalized investment advice. Forecasts are inherently uncertain. Consult a licensed financial advisor before making investment decisions.",
      italics:true, color: MUTED, size: 14 }
  ], { before: 200 }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 18 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 19, bold: true, font: "Calibri", color: SLATE },
        paragraph: { spacing: { before: 160, after: 40 }, outlineLevel: 2 } },
    ]
  },
  numbering: { config: [{ reference: "bul",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 220 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
      margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: { default: new Header({ children: [
      new Paragraph({ spacing:{after:0,line:200},
        children:[ tr("META · Q4 2025 vs Q1 2026 — Comparative Analysis · Institutional Equity Research",
          { bold:true, size: 14, color: NAVY }) ] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      spacing:{after:0, line:200},
      children: [
        tr("Source: SEC EDGAR XBRL · META transcripts · Q2Q_ER_Cowork dataset · Generated May 8, 2026", { size: 13, color: MUTED }),
        tr("\tPage ", { size: 13, color: MUTED }),
        new TextRun({ children: [PageNumber.CURRENT], size: 13, color: MUTED, font:"Calibri" }),
      ]
    })] }) },
    children,
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/META_Q4_2025_vs_Q1_2026_Institutional_Report.docx';
  fs.writeFileSync(out, buf);
  console.log('Wrote', out, 'size=', buf.length);
});
