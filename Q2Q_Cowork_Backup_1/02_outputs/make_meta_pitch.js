const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.3 x 7.5
pres.author = "Rahul Yalamanchili";
pres.title = "META — A Four-Lens Investment Thesis";

// ============= PALETTE =============
const NAVY    = "1F4E79";
const NAVY_DK = "12325A";
const MINT    = "2E7D32";
const MINT_DK = "1B5E20";
const CRIMSON = "C62828";
const AMBER   = "B45309";
const SLATE   = "3D5A80";
const CHAR    = "1C1F26";
const TEXT    = "2A2D34";
const MUTED   = "6B7280";
const LIGHT   = "F8F9FB";
const SOFT    = "EFF1F4";
const BORDER  = "D8DCE3";
const WHITE   = "FFFFFF";

// Helper for fresh shadow objects
const shadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.10 });

// =====================================================================
// SLIDE 1 · COVER
// =====================================================================
let s = pres.addSlide();
s.background = { color: NAVY_DK };

// Subtle layered hero panel
s.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.3, h: 7.5, fill: { color: NAVY_DK }, line: { color: NAVY_DK },
});
// Mint accent block top-left (a brand mark, not a header bar)
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 0.8, w: 0.18, h: 0.55, fill: { color: MINT }, line: { color: MINT },
});
s.addText("INSTITUTIONAL EQUITY RESEARCH", {
  x: 1.0, y: 0.82, w: 8, h: 0.5, fontSize: 12, bold: true, color: "9FB7CF",
  fontFace: "Calibri", charSpacing: 6, valign: "middle", margin: 0,
});
s.addText("Prepared by Rahul Yalamanchili", {
  x: 1.0, y: 1.18, w: 8, h: 0.3, fontSize: 11, color: "6F8AA8", fontFace: "Calibri", margin: 0,
});

// Big META wordmark
s.addText("META", {
  x: 0.7, y: 2.05, w: 7, h: 1.6, fontSize: 130, bold: true, color: WHITE,
  fontFace: "Georgia", charSpacing: -2, margin: 0,
});

s.addText("A Four-Lens Investment Thesis", {
  x: 0.75, y: 3.85, w: 11, h: 0.7, fontSize: 30, color: "BFD4EA",
  fontFace: "Georgia", italic: true, margin: 0,
});

// Three big stat callouts in a row
const stats = [
  { v: "BULLISH", l: "6–12 month forward view", c: MINT },
  { v: "+34.5%",  l: "Sell-side target $820 (vs $609.63)", c: MINT },
  { v: "3 : 1",   l: "Reward / risk on laddered entry", c: MINT },
];
stats.forEach((stat, i) => {
  const x = 0.7 + i * 4.2;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 5.05, w: 3.8, h: 1.55, fill: { color: NAVY }, line: { color: "2A5C8E" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 5.05, w: 0.08, h: 1.55, fill: { color: stat.c }, line: { color: stat.c },
  });
  s.addText(stat.v, {
    x: x+0.3, y: 5.18, w: 3.4, h: 0.8, fontSize: 32, bold: true, color: stat.c,
    fontFace: "Georgia", margin: 0, valign: "middle",
  });
  s.addText(stat.l, {
    x: x+0.3, y: 6.0, w: 3.4, h: 0.55, fontSize: 11, color: "BFD4EA",
    fontFace: "Calibri", margin: 0, valign: "top",
  });
});

s.addText("Data: SEC EDGAR · Yahoo Finance · Options chain · FactSet (live, 5/8/26)", {
  x: 0.7, y: 6.85, w: 12, h: 0.35, fontSize: 10, color: "6F8AA8",
  fontFace: "Calibri", italic: true, margin: 0,
});

// =====================================================================
// SLIDE 2 · THE HEADLINE THESIS
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };

s.addText("The thesis in one breath", {
  x: 0.7, y: 0.55, w: 12, h: 0.55, fontSize: 32, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});

s.addText([
  { text: "META is the ", options: { color: TEXT } },
  { text: "cheapest profitable mega-cap AI/ad peer", options: { bold: true, color: NAVY } },
  { text: " on every TTM and forward multiple. Three of four independent analytical lenses say bullish; the fourth (technicals) is timing the correction. The technical correction is the buying opportunity.", options: { color: TEXT } },
], { x: 0.7, y: 1.2, w: 12, h: 1.4, fontSize: 19, fontFace: "Georgia", italic: true, margin: 0, valign: "top" });

// Three KPI cards highlighting the headline numbers
const kpis = [
  { big: "−30%",   small: "P/E TTM vs peer median",    note: "22.16× vs 31.58×",     col: MINT },
  { big: "+33.1%", small: "Q1 2026 revenue YoY",       note: "Strongest in dataset", col: MINT },
  { big: "0.9589", small: "Mgmt Credibility Score",    note: "8 of 8 quarters delivered", col: MINT },
];
kpis.forEach((k, i) => {
  const x = 0.7 + i * 4.2;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 3.0, w: 3.85, h: 1.85, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
    shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 3.0, w: 0.08, h: 1.85, fill: { color: k.col }, line: { color: k.col },
  });
  s.addText(k.big, {
    x: x+0.3, y: 3.15, w: 3.4, h: 0.85, fontSize: 44, bold: true, color: k.col,
    fontFace: "Georgia", margin: 0, valign: "middle",
  });
  s.addText(k.small, {
    x: x+0.3, y: 4.05, w: 3.4, h: 0.4, fontSize: 13, bold: true, color: TEXT,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
  s.addText(k.note, {
    x: x+0.3, y: 4.45, w: 3.4, h: 0.3, fontSize: 11, color: MUTED,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
});

// Bottom callout strip
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 5.4, w: 11.9, h: 1.55, fill: { color: NAVY }, line: { color: NAVY },
});
s.addText("Three of four lenses agree: BULLISH.", {
  x: 1.0, y: 5.55, w: 11.4, h: 0.55, fontSize: 22, bold: true, color: WHITE,
  fontFace: "Georgia", margin: 0, valign: "middle",
});
s.addText("The fourth (technical) is short-term bearish — that's the entry, not the thesis.", {
  x: 1.0, y: 6.10, w: 11.4, h: 0.5, fontSize: 14, italic: true, color: "BFD4EA",
  fontFace: "Calibri", margin: 0, valign: "middle",
});
s.addText("Recommended action:  laddered entry $520 – $600  ·  hard stop $479  ·  12–18 month target $796 (52w high)", {
  x: 1.0, y: 6.55, w: 11.4, h: 0.4, fontSize: 12, color: WHITE,
  fontFace: "Calibri", margin: 0, valign: "middle",
});

// =====================================================================
// SLIDE 3 · DATA SOURCES (build credibility before findings)
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };

s.addText("Built on four independent authoritative sources", {
  x: 0.7, y: 0.55, w: 12, h: 0.55, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Every number traces back to a primary source. No approximations, no model outputs.", {
  x: 0.7, y: 1.15, w: 12, h: 0.4, fontSize: 14, color: MUTED,
  fontFace: "Calibri", italic: true, margin: 0,
});

// 2x2 source grid
const sources = [
  { name: "SEC EDGAR XBRL",    role: "FUNDAMENTALS",
    desc: "Authoritative TTM revenue, operating income, net income, EPS for META and the 7-peer comp set. Pulled directly from us-gaap company-facts API.", c: NAVY },
  { name: "Daily OHLCV",       role: "TECHNICALS",
    desc: "584 trading sessions of META daily bars (Jan 2024 – Apr 30, 2026). User-supplied xlsx; indicators (SMA/RSI/MACD/ADX/OBV/ATR) computed from the source data.", c: SLATE },
  { name: "Options chain",     role: "POSITIONING",
    desc: "3,800 contracts across 25 expiries (May 26 – Dec 28). User-supplied OPRA-format snapshot; skew, vol surface, max-pain computed.", c: AMBER },
  { name: "FactSet",           role: "VALUATION",
    desc: "Live peer multiples (P/E TTM/FY1/FY2, EV/EBITDA, P/S), consensus targets, ratings, broker counts. Captured 5/8/26 via Claude-in-Chrome.", c: MINT },
];
sources.forEach((src, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.7 + col * 6.2, y = 1.85 + row * 2.65;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 5.9, h: 2.4, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
    shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.08, h: 2.4, fill: { color: src.c }, line: { color: src.c },
  });
  s.addText(src.role, {
    x: x+0.32, y: y+0.18, w: 5.4, h: 0.32, fontSize: 10, bold: true, color: src.c,
    fontFace: "Calibri", charSpacing: 6, margin: 0,
  });
  s.addText(src.name, {
    x: x+0.32, y: y+0.5, w: 5.4, h: 0.55, fontSize: 22, bold: true, color: TEXT,
    fontFace: "Georgia", margin: 0,
  });
  s.addText(src.desc, {
    x: x+0.32, y: y+1.10, w: 5.4, h: 1.20, fontSize: 12, color: TEXT,
    fontFace: "Calibri", margin: 0, valign: "top", lineSpacing: 18,
  });
});

// =====================================================================
// SLIDE 4 · FOUR-LENS FRAMEWORK
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };

s.addText("The four-lens framework", {
  x: 0.7, y: 0.55, w: 12, h: 0.55, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Each lens answers a different question. Verdicts converge on a single direction.", {
  x: 0.7, y: 1.15, w: 12, h: 0.4, fontSize: 14, color: MUTED,
  fontFace: "Calibri", italic: true, margin: 0,
});

const lenses = [
  { num: "01", lens: "FUNDAMENTAL",   q: "Is the business growing?",         v: "BULLISH",  vc: MINT },
  { num: "02", lens: "TECHNICAL",     q: "What does the chart say now?",     v: "BEARISH (short-term)", vc: CRIMSON },
  { num: "03", lens: "OPTIONS",       q: "Where is the money positioned?",   v: "BULLISH",  vc: MINT },
  { num: "04", lens: "VALUATION",     q: "What price are we paying?",        v: "BULLISH",  vc: MINT },
];
lenses.forEach((L, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.7 + col * 6.2, y = 1.85 + row * 2.55;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 5.9, h: 2.3, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
    shadow: shadow(),
  });
  // big number watermark
  s.addText(L.num, {
    x: x+5.0, y: y+0.05, w: 0.85, h: 0.85, fontSize: 60, color: SOFT,
    fontFace: "Georgia", bold: true, align: "right", margin: 0,
  });
  s.addText(L.lens, {
    x: x+0.4, y: y+0.3, w: 4.5, h: 0.4, fontSize: 12, bold: true, color: NAVY,
    fontFace: "Calibri", charSpacing: 6, margin: 0,
  });
  s.addText(L.q, {
    x: x+0.4, y: y+0.7, w: 5.0, h: 0.55, fontSize: 18, color: TEXT,
    fontFace: "Georgia", italic: true, margin: 0,
  });
  // verdict pill
  const pillW = (L.v.length > 8) ? 2.6 : 1.8;
  s.addShape(pres.shapes.RECTANGLE, {
    x: x+0.4, y: y+1.5, w: pillW, h: 0.55,
    fill: { color: L.vc }, line: { color: L.vc },
  });
  s.addText(L.v, {
    x: x+0.4, y: y+1.5, w: pillW, h: 0.55, fontSize: 13, bold: true, color: WHITE,
    fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
  });
});

// Footer note
s.addText("Three lenses bullish · one lens timing the correction · synthesis: BULLISH for long capital, defer for new tactical longs", {
  x: 0.7, y: 6.95, w: 12, h: 0.4, fontSize: 12, italic: true, color: MUTED,
  fontFace: "Calibri", align: "center", margin: 0,
});

// =====================================================================
// SLIDE 5 · LENS 1 · FUNDAMENTALS
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
// Top eyebrow
s.addText("LENS 01  ·  FUNDAMENTALS", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Revenue accelerating into the AI build", {
  x: 0.7, y: 0.85, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Verdict:  BULLISH  —  6 beats / 2 in-line / 0 misses across 8 closed quarters", {
  x: 0.7, y: 1.55, w: 12, h: 0.4, fontSize: 13, color: MINT,
  fontFace: "Calibri", italic: true, bold: true, margin: 0,
});

// Left: YoY growth chart
s.addChart(pres.charts.BAR, [
  { name: "YoY revenue growth", labels: ["Q1 25","Q2 25","Q3 25","Q4 25","Q1 26"], values: [16.1,21.6,26.2,23.8,33.1] }
], {
  x: 0.7, y: 2.05, w: 6.5, h: 4.6, barDir: "col",
  chartColors: [MINT],
  chartArea: { fill: { color: WHITE } },
  catAxisLabelColor: "64748B", valAxisLabelColor: "64748B",
  valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: TEXT,
  dataLabelFormatCode: "0.0\"%\"",
  showLegend: false, showTitle: true, title: "META quarterly revenue YoY (%)",
  titleColor: NAVY, titleFontSize: 14, titleFontFace: "Calibri",
  valAxisMaxVal: 40,
});

// Right: punchy stats stack
const fundStats = [
  { big: "$56.31B",  l: "Q1 2026 revenue",        sub: "+33% YoY · vs $42.31B Q1 2025" },
  { big: "47.77%",   l: "Q1 2026 operating margin", sub: "Highest in dataset" },
  { big: "$10.44",   l: "Q1 2026 diluted EPS",    sub: "+36.5% YoY (reported)" },
  { big: "8 / 8",    l: "Quarterly revenue commitments delivered", sub: "MCS = 0.9589" },
];
fundStats.forEach((st, i) => {
  const x = 7.4, y = 2.05 + i * 1.18;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 5.2, h: 1.05, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h: 1.05, fill: { color: MINT }, line: { color: MINT },
  });
  s.addText(st.big, {
    x: x+0.2, y: y+0.1, w: 2.0, h: 0.85, fontSize: 26, bold: true, color: MINT,
    fontFace: "Georgia", margin: 0, valign: "middle",
  });
  s.addText(st.l, {
    x: x+2.25, y: y+0.12, w: 2.85, h: 0.4, fontSize: 12, bold: true, color: TEXT,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
  s.addText(st.sub, {
    x: x+2.25, y: y+0.5, w: 2.85, h: 0.5, fontSize: 11, color: MUTED,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
});

s.addText("Source: SEC EDGAR XBRL · META 10-Q / 10-K filings", {
  x: 0.7, y: 6.95, w: 12, h: 0.3, fontSize: 9, italic: true, color: MUTED,
  fontFace: "Calibri", margin: 0,
});

// =====================================================================
// SLIDE 6 · LENS 2 · TECHNICALS
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("LENS 02  ·  TECHNICALS", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: CRIMSON,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Short-term breakdown inside a longer uptrend", {
  x: 0.7, y: 0.85, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Verdict:  BEARISH (days–weeks)  —  long-term uptrend NOT yet structurally broken", {
  x: 0.7, y: 1.55, w: 12, h: 0.4, fontSize: 13, color: CRIMSON,
  fontFace: "Calibri", italic: true, bold: true, margin: 0,
});

// Left: signals as red icons + text
const techSignals = [
  { sig: "−23.15%",   t: "drawdown from 52w high $796 (Aug 15, 2025)" },
  { sig: "Death cross", t: "SMA 50 below SMA 200 since Dec 10, 2025 — still active" },
  { sig: "Below all 4 MAs", t: "Close $611.91 vs SMA 20/50/100/200 = $645/$631/$644/$679" },
  { sig: "H&S top resolved", t: "Left $747 → head $796 → right $759; neckline broken; target hit" },
  { sig: "ADX 23 / −DI > +DI", t: "Bearish directional energy strengthening, not exhausting" },
  { sig: "−8.55% post-earn drop", t: "April 30 print on 3.7× volume — single largest down-day in dataset" },
];
techSignals.forEach((sg, i) => {
  const x = 0.7, y = 2.1 + i * 0.78;
  s.addShape(pres.shapes.OVAL, {
    x, y: y+0.1, w: 0.32, h: 0.32, fill: { color: CRIMSON }, line: { color: CRIMSON },
  });
  s.addText("✕", {
    x, y: y+0.1, w: 0.32, h: 0.32, fontSize: 13, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0, fontFace: "Calibri",
  });
  s.addText(sg.sig, {
    x: x+0.5, y, w: 6.2, h: 0.32, fontSize: 14, bold: true, color: TEXT,
    fontFace: "Calibri", margin: 0,
  });
  s.addText(sg.t, {
    x: x+0.5, y: y+0.32, w: 6.2, h: 0.4, fontSize: 11, color: MUTED,
    fontFace: "Calibri", margin: 0,
  });
});

// Right: counter-evidence card (the hopeful part)
s.addShape(pres.shapes.RECTANGLE, {
  x: 7.4, y: 2.1, w: 5.2, h: 4.55, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
  shadow: shadow(),
});
s.addShape(pres.shapes.RECTANGLE, {
  x: 7.4, y: 2.1, w: 0.08, h: 4.55, fill: { color: MINT }, line: { color: MINT },
});
s.addText("LONG-TERM TREND NOT YET BROKEN", {
  x: 7.6, y: 2.25, w: 4.9, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 5, margin: 0,
});
s.addText("Counter-evidence", {
  x: 7.6, y: 2.6, w: 4.9, h: 0.45, fontSize: 18, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText([
  { text: "SMA 200 ", options: { bold: true, color: NAVY } },
  { text: "($679) is still above current — only just rolling over.", options: { color: TEXT, breakLine: true } },
  { text: " ", options: { breakLine: true, fontSize: 6 } },
  { text: "OBV ", options: { bold: true, color: NAVY } },
  { text: "trend up +30.5M shares over trailing 60 sessions while price down ~$57 — accumulation at lower prices.", options: { color: TEXT, breakLine: true } },
  { text: " ", options: { breakLine: true, fontSize: 6 } },
  { text: "52w low $520 ", options: { bold: true, color: NAVY } },
  { text: "(Mar 27, 2026) NOT broken. Long uptrend invalidates only on a weekly close below $479.", options: { color: TEXT, breakLine: true } },
  { text: " ", options: { breakLine: true, fontSize: 6 } },
  { text: "Stochastic %K oversold ", options: { bold: true, color: NAVY } },
  { text: "(13.0) — capitulation-style print suggests the move is late stage.", options: { color: TEXT } },
], { x: 7.6, y: 3.1, w: 4.9, h: 3.5, fontSize: 12, fontFace: "Calibri", margin: 0, valign: "top", lineSpacing: 17 });

s.addText("Source: META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx · 584 sessions", {
  x: 0.7, y: 6.95, w: 12, h: 0.3, fontSize: 9, italic: true, color: MUTED,
  fontFace: "Calibri", margin: 0,
});

// =====================================================================
// SLIDE 7 · LENS 3 · OPTIONS
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("LENS 03  ·  OPTIONS POSITIONING", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: AMBER,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Smart money positioned for the bounce", {
  x: 0.7, y: 0.85, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Verdict:  BULLISH  —  upside-call demand dominates; no panic in the term structure", {
  x: 0.7, y: 1.55, w: 12, h: 0.4, fontSize: 13, color: AMBER,
  fontFace: "Calibri", italic: true, bold: true, margin: 0,
});

// Left: 4 stat callouts in 2x2
const optStats = [
  { v: "0.46",      l: "P/C ratio (open interest)",  s: "Aggressive-bullish band (sub-0.5)" },
  { v: "275k",      l: "OI at $750 strike",          s: "Largest concentration in chain" },
  { v: "−0.6 vp",   l: "Front-month 25Δ skew",       s: "Call IV > put IV (buy-the-dip)" },
  { v: "≈ flat",    l: "Net dealer gamma",           s: "News-flow driven, no amplification" },
];
optStats.forEach((st, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.7 + col * 3.05, y = 2.15 + row * 2.10;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.85, h: 1.85, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
    shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.85, h: 0.08, fill: { color: AMBER }, line: { color: AMBER },
  });
  s.addText(st.v, {
    x: x+0.2, y: y+0.15, w: 2.45, h: 0.85, fontSize: 28, bold: true, color: AMBER,
    fontFace: "Georgia", margin: 0, valign: "middle",
  });
  s.addText(st.l, {
    x: x+0.2, y: y+1.0, w: 2.45, h: 0.4, fontSize: 11, bold: true, color: TEXT,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
  s.addText(st.s, {
    x: x+0.2, y: y+1.36, w: 2.45, h: 0.4, fontSize: 10, color: MUTED,
    fontFace: "Calibri", margin: 0, valign: "top",
  });
});

// Right: term-structure quick chart
s.addChart(pres.charts.LINE, [
  { name: "ATM IV", labels: ["2D","13D","27D","69D","132D","251D","404D","951D"], values: [22.95,30.33,30.07,31.35,35.73,36.65,37.68,39.38] }
], {
  x: 7.0, y: 2.15, w: 5.6, h: 4.4, lineSize: 3, lineSmooth: true,
  chartColors: [AMBER],
  chartArea: { fill: { color: WHITE } },
  catAxisLabelColor: "64748B", valAxisLabelColor: "64748B",
  valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
  showLegend: false, showTitle: true, title: "ATM IV term structure (% by DTE)",
  titleColor: NAVY, titleFontSize: 14, titleFontFace: "Calibri",
  valAxisMinVal: 18, valAxisMaxVal: 45,
  showValue: true, dataLabelColor: TEXT, dataLabelFormatCode: "0.0",
  dataLabelPosition: "t", dataLabelFontSize: 9,
});
s.addText("Normal contango — no near-term event-vol crowding. Front-week IV (22.9%) sits well below LEAPS (39%).", {
  x: 7.0, y: 6.6, w: 5.6, h: 0.4, fontSize: 10, italic: true, color: MUTED,
  fontFace: "Calibri", margin: 0,
});
s.addText("Source: meta05082026.xlsx · 3,800 contracts across 25 expiries", {
  x: 0.7, y: 6.95, w: 12, h: 0.3, fontSize: 9, italic: true, color: MUTED,
  fontFace: "Calibri", margin: 0,
});

// =====================================================================
// SLIDE 8 · LENS 4 · VALUATION
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("LENS 04  ·  VALUATION", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Cheapest in the comp set on every multiple", {
  x: 0.7, y: 0.85, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("Verdict:  BULLISH  —  discount holds and widens going forward (P/E TTM −30% → P/E FY2 −35%)", {
  x: 0.7, y: 1.55, w: 12, h: 0.4, fontSize: 13, color: MINT,
  fontFace: "Calibri", italic: true, bold: true, margin: 0,
});

// Discount-vs-peer-median chart (horizontal bars)
s.addChart(pres.charts.BAR, [
  { name: "META vs peer median", labels: ["P/E TTM","P/E FY1","P/E FY2","P/S TTM","EV/Sales","EV/EBITDA"], values: [-30,-30,-35,-9,-6,-35] }
], {
  x: 0.7, y: 2.05, w: 7.0, h: 4.7, barDir: "bar",
  chartColors: [MINT],
  chartArea: { fill: { color: WHITE } },
  catAxisLabelColor: TEXT, catAxisLabelFontSize: 12,
  valAxisLabelColor: "64748B",
  valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: MINT, dataLabelFontBold: true,
  dataLabelFormatCode: "0\"%\"",
  showLegend: false, showTitle: true, title: "META discount vs 7-peer median (FactSet, 5/8/26)",
  titleColor: NAVY, titleFontSize: 14, titleFontFace: "Calibri",
  valAxisMinVal: -45, valAxisMaxVal: 5,
});

// Right side: target & rating callout
s.addShape(pres.shapes.RECTANGLE, {
  x: 7.95, y: 2.05, w: 4.65, h: 4.7, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
  shadow: shadow(),
});
s.addShape(pres.shapes.RECTANGLE, {
  x: 7.95, y: 2.05, w: 0.08, h: 4.7, fill: { color: MINT }, line: { color: MINT },
});
s.addText("CONSENSUS SIGNAL", {
  x: 8.15, y: 2.2, w: 4.4, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 5, margin: 0,
});
s.addText("$820", {
  x: 8.15, y: 2.55, w: 4.4, h: 1.2, fontSize: 76, bold: true, color: MINT,
  fontFace: "Georgia", margin: 0, valign: "middle",
});
s.addText("FactSet sell-side consensus target", {
  x: 8.15, y: 3.85, w: 4.4, h: 0.4, fontSize: 12, color: TEXT,
  fontFace: "Calibri", margin: 0,
});
s.addText("+34.5% upside", {
  x: 8.15, y: 4.3, w: 4.4, h: 0.5, fontSize: 22, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});
s.addText("from 5/8/26 close $609.63", {
  x: 8.15, y: 4.85, w: 4.4, h: 0.35, fontSize: 11, color: MUTED, italic: true,
  fontFace: "Calibri", margin: 0,
});

// Two mini-stats inside the card
s.addShape(pres.shapes.RECTANGLE, {
  x: 8.15, y: 5.4, w: 2.05, h: 1.2, fill: { color: SOFT }, line: { color: SOFT },
});
s.addText("Buy 1.15", {
  x: 8.15, y: 5.45, w: 2.05, h: 0.55, fontSize: 22, bold: true, color: TEXT,
  fontFace: "Georgia", align: "center", margin: 0, valign: "middle",
});
s.addText("avg analyst rating\n(most bullish in comp)", {
  x: 8.15, y: 5.95, w: 2.05, h: 0.6, fontSize: 10, color: MUTED, align: "center",
  fontFace: "Calibri", margin: 0,
});

s.addShape(pres.shapes.RECTANGLE, {
  x: 10.4, y: 5.4, w: 2.15, h: 1.2, fill: { color: SOFT }, line: { color: SOFT },
});
s.addText("73", {
  x: 10.4, y: 5.45, w: 2.15, h: 0.55, fontSize: 30, bold: true, color: TEXT,
  fontFace: "Georgia", align: "center", margin: 0, valign: "middle",
});
s.addText("brokers covering\n(deepest in comp)", {
  x: 10.4, y: 6.0, w: 2.15, h: 0.55, fontSize: 10, color: MUTED, align: "center",
  fontFace: "Calibri", margin: 0,
});

s.addText("Source: FactSet Workstation Web · Snapshot + Comps Analysis · captured 5/8/26", {
  x: 0.7, y: 6.95, w: 12, h: 0.3, fontSize: 9, italic: true, color: MUTED,
  fontFace: "Calibri", margin: 0,
});

// =====================================================================
// SLIDE 9 · SYNTHESIS
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("SYNTHESIS", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: NAVY,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Three of four lenses bullish. The fourth is timing the entry.", {
  x: 0.7, y: 0.85, w: 12, h: 0.85, fontSize: 28, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});

// Verdict matrix
const horizons = [
  { h: "Short term (days–2 weeks)", f: "Capex digesting", t: "BEARISH", o: "Buy-the-dip skew", v: "Cheap", c: "Defer", cc: AMBER, action: "Don't chase rallies into $626–658" },
  { h: "Medium term (1–3 months)",   f: "Q2 26 likely beat", t: "Consolidation $580–680", o: "$750 call OI dom.", v: "Cheap", c: "Accumulate", cc: NAVY, action: "Build position in tranches at $520–600" },
  { h: "Long term (6–18 months)",     f: "BULLISH", t: "Long uptrend intact", o: "LEAPS at $1k+ strikes", v: "BULLISH", c: "Hold / add at support", cc: MINT, action: "Target $796+ (52w high) → upside extension" },
];
const headers = ["HORIZON","FUNDAMENTAL","TECHNICAL","OPTIONS","VALUATION","COMBINED CALL","ACTION"];

// Table
const tbl = [
  headers.map(h => ({ text: h, options: { bold: true, fontSize: 9, color: WHITE, fill: { color: NAVY }, align: "left", margin: [4,4,4,8] } })),
  ...horizons.map(r => [
    { text: r.h,      options: { bold: true, fontSize: 11, color: TEXT, valign: "middle" } },
    { text: r.f,      options: { fontSize: 10, color: TEXT, valign: "middle" } },
    { text: r.t,      options: { fontSize: 10, color: TEXT, valign: "middle" } },
    { text: r.o,      options: { fontSize: 10, color: TEXT, valign: "middle" } },
    { text: r.v,      options: { fontSize: 10, color: TEXT, valign: "middle" } },
    { text: r.c,      options: { fontSize: 11, color: r.cc, bold: true, valign: "middle" } },
    { text: r.action, options: { fontSize: 10, color: MUTED, italic: true, valign: "middle" } },
  ])
];
s.addTable(tbl, {
  x: 0.7, y: 2.0, w: 11.9, h: 2.8,
  colW: [1.95, 1.45, 1.55, 1.55, 1.05, 1.6, 2.75],
  border: { type: "solid", pt: 0.5, color: BORDER },
  autoPage: false,
});

// Key callout
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 5.05, w: 11.9, h: 1.95, fill: { color: NAVY }, line: { color: NAVY },
});
s.addText("Path > destination", {
  x: 1.0, y: 5.20, w: 11.4, h: 0.4, fontSize: 12, bold: true, color: "BFD4EA",
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Fundamentals tell us where META is going. Technicals tell us how it gets there.", {
  x: 1.0, y: 5.55, w: 11.4, h: 0.6, fontSize: 22, bold: true, color: WHITE,
  fontFace: "Georgia", margin: 0,
});
s.addText("Today the path is down-and-sideways; the destination — if mgmt's commitments hold — is materially higher 12–18 months out.", {
  x: 1.0, y: 6.20, w: 11.4, h: 0.7, fontSize: 13, italic: true, color: "BFD4EA",
  fontFace: "Calibri", margin: 0, valign: "top",
});

// =====================================================================
// SLIDE 10 · TRADE PLAN
// =====================================================================
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("THE PLAY", {
  x: 0.7, y: 0.45, w: 12, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 6, margin: 0,
});
s.addText("Laddered entry · 3 : 1 reward / risk", {
  x: 0.7, y: 0.85, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY,
  fontFace: "Georgia", margin: 0,
});

// Three tranche cards
const tranches = [
  { num: "T1", price: "$580 – $600", pct: "30%", why: "First major support · Fib 78.6% retrace · ~17× FY 26 normalized EPS", c: MINT },
  { num: "T2", price: "$548 – $568", pct: "30%", why: "March cluster lows · OBV accumulation zone · ~16× FY 26 EPS", c: NAVY },
  { num: "T3", price: "$520 – $535", pct: "40%", why: "52w low retest · deep value · ~15× FY 26 EPS (vs hist 18–28×)", c: SLATE },
];
tranches.forEach((tr, i) => {
  const x = 0.7 + i * 4.2;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.85, w: 3.85, h: 2.5, fill: { color: WHITE }, line: { color: BORDER, width: 1 },
    shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.85, w: 3.85, h: 0.55, fill: { color: tr.c }, line: { color: tr.c },
  });
  s.addText(`Tranche ${tr.num}`, {
    x: x+0.25, y: 1.85, w: 2.0, h: 0.55, fontSize: 14, bold: true, color: WHITE,
    fontFace: "Calibri", charSpacing: 4, margin: 0, valign: "middle",
  });
  s.addText(tr.pct, {
    x: x+1.5, y: 1.85, w: 2.2, h: 0.55, fontSize: 18, bold: true, color: WHITE,
    fontFace: "Georgia", align: "right", margin: 0, valign: "middle",
  });
  s.addText(tr.price, {
    x: x+0.25, y: 2.6, w: 3.45, h: 0.7, fontSize: 28, bold: true, color: TEXT,
    fontFace: "Georgia", margin: 0, valign: "middle",
  });
  s.addText(tr.why, {
    x: x+0.25, y: 3.35, w: 3.45, h: 0.95, fontSize: 11, color: MUTED,
    fontFace: "Calibri", margin: 0, valign: "top", lineSpacing: 16,
  });
});

// Bottom risk row
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 4.65, w: 5.85, h: 2.0, fill: { color: WHITE }, line: { color: CRIMSON, width: 1.5 },
});
s.addText("HARD STOP", {
  x: 0.95, y: 4.8, w: 5.4, h: 0.32, fontSize: 11, bold: true, color: CRIMSON,
  fontFace: "Calibri", charSpacing: 5, margin: 0,
});
s.addText("$479", {
  x: 0.95, y: 5.10, w: 2.5, h: 1.15, fontSize: 60, bold: true, color: CRIMSON,
  fontFace: "Georgia", margin: 0, valign: "middle",
});
s.addText("Weekly close below the April 2025 swing low — structural failure of the long-term uptrend; thesis breaker.", {
  x: 3.5, y: 5.20, w: 2.95, h: 1.4, fontSize: 11, color: TEXT,
  fontFace: "Calibri", margin: 0, valign: "middle", lineSpacing: 16,
});

s.addShape(pres.shapes.RECTANGLE, {
  x: 6.75, y: 4.65, w: 5.85, h: 2.0, fill: { color: WHITE }, line: { color: MINT, width: 1.5 },
});
s.addText("12–18 MONTH TARGET", {
  x: 7.0, y: 4.8, w: 5.4, h: 0.32, fontSize: 11, bold: true, color: MINT,
  fontFace: "Calibri", charSpacing: 5, margin: 0,
});
s.addText("$796", {
  x: 7.0, y: 5.10, w: 2.5, h: 1.15, fontSize: 60, bold: true, color: MINT,
  fontFace: "Georgia", margin: 0, valign: "middle",
});
s.addText("52-week high (Aug 15, 2025). FactSet consensus target $820 (+34.5%) sits above this level.", {
  x: 9.55, y: 5.20, w: 2.95, h: 1.4, fontSize: 11, color: TEXT,
  fontFace: "Calibri", margin: 0, valign: "middle", lineSpacing: 16,
});

s.addText("Avg buy at $555 → $796 target = +43% upside vs $479 stop = −14% downside  ·  ~3 : 1 reward / risk", {
  x: 0.7, y: 6.85, w: 12, h: 0.4, fontSize: 12, italic: true, bold: true, color: NAVY,
  fontFace: "Calibri", align: "center", margin: 0,
});

// =====================================================================
// SLIDE 11 · DISCLAIMER / CLOSING
// =====================================================================
s = pres.addSlide();
s.background = { color: NAVY_DK };

s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 1.4, w: 0.18, h: 0.55, fill: { color: MINT }, line: { color: MINT },
});
s.addText("CLOSING", {
  x: 1.0, y: 1.42, w: 8, h: 0.5, fontSize: 12, bold: true, color: "9FB7CF",
  fontFace: "Calibri", charSpacing: 6, valign: "middle", margin: 0,
});

s.addText("META is the long-term", {
  x: 0.7, y: 2.3, w: 12, h: 0.95, fontSize: 44, color: WHITE, fontFace: "Georgia", margin: 0,
});
s.addText("you buy on the short-term break.", {
  x: 0.7, y: 3.25, w: 12, h: 0.95, fontSize: 44, bold: true, color: MINT, fontFace: "Georgia", margin: 0,
});

s.addText("Three lenses say bullish.  One says wait.  The setup is to do both — accumulate at support while sentiment is bad.", {
  x: 0.7, y: 4.45, w: 12, h: 0.7, fontSize: 16, italic: true, color: "BFD4EA", fontFace: "Calibri", margin: 0,
});

// Disclaimer
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 5.7, w: 11.9, h: 1.2, fill: { color: "0F2745" }, line: { color: "0F2745" },
});
s.addText("DISCLAIMER", {
  x: 0.95, y: 5.85, w: 11.4, h: 0.3, fontSize: 9, bold: true, color: "9FB7CF",
  fontFace: "Calibri", charSpacing: 5, margin: 0,
});
s.addText("Analytical synthesis of disclosed data on file in the management_credibility_project workspace. Not personalized investment advice. Forecasts inherently uncertain. Verify peer multiples at trade time. Consult a licensed financial advisor before any trading decision.", {
  x: 0.95, y: 6.15, w: 11.4, h: 0.7, fontSize: 10, color: "BFD4EA", italic: true,
  fontFace: "Calibri", margin: 0, lineSpacing: 14,
});

// =====================================================================
// SAVE
// =====================================================================
const outPath = "/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/META_Pitch_Deck.pptx";
pres.writeFile({ fileName: outPath }).then(p => {
  console.log("Wrote", p);
});
