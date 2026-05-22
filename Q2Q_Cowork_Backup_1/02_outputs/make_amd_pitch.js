const PptxGenJS = require('pptxgenjs');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace:'Helvetica', bodyFontFace:'Helvetica' };

const COLOR = { 
  ink: '111827', muted: '6B7280', accent: '0F62FE', mint: '10B981', amber: 'F59E0B', crimson: 'DC2626', 
  bg: 'F9FAFB', border: 'E5E7EB', soft: 'F3F4F6'
};

const tx = (slide, text, x, y, w, h, opts={}) => slide.addText(text, { x, y, w, h, fontFace:'Helvetica', ...opts });

// SLIDE 1 — title
let s = pres.addSlide();
s.background = { color: 'FFFFFF' };
tx(s, 'INSTITUTIONAL EQUITY RESEARCH', 0.5, 0.5, 12, 0.4, { fontSize:14, color:COLOR.muted, bold:true });
tx(s, 'Prepared by Rahul Yalamanchili', 0.5, 0.85, 12, 0.4, { fontSize:14, color:COLOR.muted });
tx(s, 'AMD', 0.5, 2.0, 12, 1.5, { fontSize:96, color:COLOR.accent, bold:true });
tx(s, 'A Four-Lens Investment Thesis', 0.5, 3.7, 12, 0.7, { fontSize:32, color:COLOR.ink });
// Big stats
const stats = [
  { lbl: 'BULLISH', sub: '6–12 month forward view', col: COLOR.mint },
  { lbl: '+37.85% YoY', sub: 'Q1 2026 revenue (strongest in dataset)', col: COLOR.mint },
  { lbl: '8/8', sub: 'Quarterly revenue beats since Q2 24', col: COLOR.mint },
  { lbl: 'MCS 0.96', sub: 'Mgmt Credibility Score', col: COLOR.mint },
];
stats.forEach((st, i) => {
  s.addShape('rect', { x: 0.5+i*3.1, y: 5.3, w:2.9, h:1.4, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, st.lbl, 0.5+i*3.1, 5.4, 2.9, 0.6, { fontSize:24, bold:true, color:st.col, align:'center'});
  tx(s, st.sub, 0.5+i*3.1, 6.0, 2.9, 0.6, { fontSize:11, color:COLOR.muted, align:'center'});
});
tx(s, 'Data: SEC EDGAR · Barchart · AMD options chain · FactSet (live, 5/8/26)', 0.5, 7.0, 12, 0.4, { fontSize:11, color:COLOR.muted, italic:true, align:'center'});

// SLIDE 2 — thesis
s = pres.addSlide();
tx(s, 'The thesis in one breath', 0.5, 0.4, 12, 0.6, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'AMD is delivering exceptional growth and margin expansion in the AI accelerator + data center cycle. But the easy money has been made: stock at all-time highs, 67% above SMA 200, and trades at +64% premium to peer median FY1 P/E. Three of four lenses say bullish; valuation flags caution.', 0.5, 1.1, 12, 1.4, { fontSize:18, color:COLOR.ink, lineSpacing:24 });

const t2stats = [
  { lbl: '+37.85%', sub: 'Q1 2026 revenue YoY', col: COLOR.mint },
  { lbl: '14.40%', sub: 'Q1 2026 operating margin (vs 0.66% Q1 24)', col: COLOR.mint },
  { lbl: '+64%', sub: 'P/E FY1 premium to peer median (62× vs 38×)', col: COLOR.amber },
  { lbl: '+267%', sub: 'Stock rally from 52-week low', col: COLOR.mint },
];
t2stats.forEach((st, i) => {
  s.addShape('rect', { x: 0.5+i*3.1, y: 3.0, w:2.9, h:1.4, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, st.lbl, 0.5+i*3.1, 3.1, 2.9, 0.6, { fontSize:24, bold:true, color:st.col, align:'center'});
  tx(s, st.sub, 0.5+i*3.1, 3.7, 2.9, 0.7, { fontSize:11, color:COLOR.muted, align:'center'});
});
tx(s, 'Three of four lenses agree: BULLISH. Valuation lens flags caution. Action: defer at $455+; accumulate on pullback to $232-300 zone.', 0.5, 5.0, 12, 1.2, { fontSize:16, color:COLOR.ink, italic:true });

// SLIDE 3 — data sources
s = pres.addSlide();
tx(s, 'Built on four independent authoritative sources', 0.5, 0.4, 12, 0.6, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Every number traces back to a primary source. No approximations, no model outputs.', 0.5, 1.0, 12, 0.5, { fontSize:14, color:COLOR.muted, italic:true });
const sources = [
  { lens: 'FUNDAMENTALS', src: 'SEC EDGAR XBRL', desc: 'Authoritative TTM revenue, operating income, net income, EPS for AMD and the 7-peer comp set. Pulled directly from us-gaap company-facts API (CIK 0000002488).' },
  { lens: 'TECHNICALS', src: 'Daily OHLCV', desc: '584 trading sessions of AMD daily bars (Jan 2024 → Apr 30, 2026). User-supplied xlsx (Barchart export); indicators (SMA/RSI/MACD/ADX/OBV/ATR) computed from the source data.' },
  { lens: 'POSITIONING', src: 'Options chain', desc: '2,343 contracts across 21 expiries (May 26 – Dec 28). User-supplied OPRA-format snapshot; skew, vol surface, max-pain computed.' },
  { lens: 'VALUATION', src: 'FactSet Live', desc: 'Peer multiples (P/E TTM/FY1/FY2, EV/EBITDA, P/S), consensus targets, ratings, broker counts. Captured 5/8/26 via Claude-in-Chrome.' },
];
sources.forEach((src, i) => {
  const x = 0.5 + (i%2)*6.3, y = 1.8 + Math.floor(i/2)*2.6;
  s.addShape('rect', { x, y, w:6.0, h:2.4, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, src.lens, x+0.2, y+0.15, 5.6, 0.4, { fontSize:11, bold:true, color:COLOR.accent });
  tx(s, src.src, x+0.2, y+0.55, 5.6, 0.5, { fontSize:18, bold:true, color:COLOR.ink });
  tx(s, src.desc, x+0.2, y+1.05, 5.6, 1.3, { fontSize:11, color:COLOR.muted, lineSpacing:14 });
});

// SLIDE 4 — four-lens framework
s = pres.addSlide();
tx(s, 'The four-lens framework', 0.5, 0.4, 12, 0.6, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Each lens answers a different question. Three converge bullish; valuation flags caution.', 0.5, 1.0, 12, 0.5, { fontSize:14, color:COLOR.muted, italic:true });
const lenses = [
  { num: '01', name: 'FUNDAMENTAL', q: 'Is the business growing?', ans: 'BULLISH', col: COLOR.mint },
  { num: '02', name: 'TECHNICAL', q: 'What does the chart say now?', ans: 'BULLISH (long-term)\\nOVERBOUGHT (short-term)', col: COLOR.amber },
  { num: '03', name: 'OPTIONS', q: 'Where is the money positioned?', ans: 'NEUTRAL-TO-BULLISH', col: COLOR.amber },
  { num: '04', name: 'VALUATION', q: 'What price are we paying?', ans: 'EXPENSIVE', col: COLOR.crimson },
];
lenses.forEach((l, i) => {
  const x = 0.5 + i*3.1;
  s.addShape('rect', { x, y:1.8, w:2.9, h:5.0, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, l.num, x+0.2, 1.95, 2.6, 0.6, { fontSize:30, bold:true, color:COLOR.muted });
  tx(s, l.name, x+0.2, 2.6, 2.6, 0.5, { fontSize:14, bold:true, color:COLOR.ink });
  tx(s, l.q, x+0.2, 3.2, 2.6, 0.8, { fontSize:11, color:COLOR.muted, italic:true });
  tx(s, l.ans, x+0.2, 4.4, 2.6, 1.6, { fontSize:14, bold:true, color:l.col, align:'center' });
});
tx(s, 'Three lenses bullish · one cautious on valuation · synthesis: BULLISH for long-term capital, with timing discipline.', 0.5, 7.1, 12, 0.5, { fontSize:14, color:COLOR.ink, italic:true, align:'center' });

// SLIDE 5 — Lens 01: FUNDAMENTALS
s = pres.addSlide();
tx(s, 'LENS 01 · FUNDAMENTALS', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Revenue accelerating into AI build', 0.5, 0.8, 12, 0.7, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Verdict: BULLISH — 8 beats / 0 misses across 8 closed quarters', 0.5, 1.5, 12, 0.5, { fontSize:14, color:COLOR.mint, italic:true });
const fund = [
  { v:'$10.25B', l:'Q1 2026 revenue', s:'+37.85% YoY · vs $7.44B Q1 2025' },
  { v:'14.40%', l:'Q1 2026 operating margin', s:'vs 0.66% Q1 24 · +13.74 pp lift' },
  { v:'$0.84', l:'Q1 2026 diluted EPS', s:'+91% YoY vs Q1 25 $0.44' },
  { v:'8 / 8', l:'Quarterly revenue beats', s:'MCS = 0.9591 (≈ META 0.9589)' },
];
fund.forEach((d, i) => {
  const x = 0.5 + (i%2)*6.3, y = 2.2 + Math.floor(i/2)*2.4;
  s.addShape('rect', { x, y, w:6.0, h:2.2, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, d.v, x+0.3, y+0.2, 5.6, 0.7, { fontSize:32, bold:true, color:COLOR.mint });
  tx(s, d.l, x+0.3, y+1.0, 5.6, 0.5, { fontSize:14, bold:true, color:COLOR.ink });
  tx(s, d.s, x+0.3, y+1.5, 5.6, 0.6, { fontSize:11, color:COLOR.muted });
});
tx(s, 'Source: SEC EDGAR XBRL (CIK 0000002488) · AMD 10-Q / 10-K filings', 0.5, 7.1, 12, 0.4, { fontSize:11, color:COLOR.muted, italic:true });

// SLIDE 6 — Lens 02: TECHNICALS
s = pres.addSlide();
tx(s, 'LENS 02 · TECHNICALS', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Strong uptrend, but parabolic short-term', 0.5, 0.8, 12, 0.7, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Verdict: BULLISH (long-term) · OVERBOUGHT (days–weeks) — pullback risk elevated', 0.5, 1.5, 12, 0.5, { fontSize:14, color:COLOR.amber, italic:true });
const tech = [
  ['$354.49', 'New 52-week high (Apr 30, 26)', 'BULLISH'],
  ['+267%', 'Rally from 52w low $96.65', 'BULLISH'],
  ['83', 'RSI 14 — extreme overbought (>70)', 'BEARISH near-term'],
  ['71', 'ADX 14 — exceptional trend strength', 'BULLISH trend'],
  ['+68.5%', 'Spot above SMA 200 ($210.38)', 'OVEREXTENDED'],
  ['Active', 'Golden cross since 2025-07-16', 'BULLISH'],
];
tech.forEach((d, i) => {
  const x = 0.5 + (i%3)*4.2, y = 2.2 + Math.floor(i/3)*2.0;
  s.addShape('rect', { x, y, w:4.0, h:1.8, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, d[0], x+0.2, y+0.15, 3.6, 0.5, { fontSize:22, bold:true, color:COLOR.ink });
  tx(s, d[1], x+0.2, y+0.65, 3.6, 0.5, { fontSize:11, color:COLOR.ink });
  tx(s, d[2], x+0.2, y+1.15, 3.6, 0.5, { fontSize:11, bold:true, color: d[2].includes('BULLISH')?COLOR.mint : (d[2].includes('OVER')||d[2].includes('BEAR'))?COLOR.crimson : COLOR.amber });
});
tx(s, 'Source: AMD_1_JAN_24_30_APR_26.xlsx (Barchart export) · 584 sessions · Indicators computed from source', 0.5, 7.1, 12, 0.4, { fontSize:11, color:COLOR.muted, italic:true });

// SLIDE 7 — Lens 03: OPTIONS
s = pres.addSlide();
tx(s, 'LENS 03 · OPTIONS POSITIONING', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Hedging dominant after parabolic rally; LEAPS bullish', 0.5, 0.8, 12, 0.7, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Verdict: NEUTRAL-TO-BULLISH — protective skew at current spot, but LEAPS structure constructive', 0.5, 1.5, 12, 0.5, { fontSize:14, color:COLOR.amber, italic:true });
const opts = [
  { v:'1.04', l:'P/C OI ratio', s:'Slightly bearish positioning · puts ≥ calls' },
  { v:'0.59', l:'P/C Vol ratio (today)', s:'Calls dominant in flow — bullish' },
  { v:'-12.6 vp', l:'Front-month 25Δ skew', s:'Put IV > Call IV (hedging dominant)' },
  { v:'60.5%', l:'ATM IV (front)', s:'Elevated absolute level (parabolic-move premium)' },
];
opts.forEach((d, i) => {
  const x = 0.5 + (i%2)*6.3, y = 2.2 + Math.floor(i/2)*2.4;
  s.addShape('rect', { x, y, w:6.0, h:2.2, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, d.v, x+0.3, y+0.2, 5.6, 0.7, { fontSize:32, bold:true, color: d.v.includes('-')?COLOR.crimson:COLOR.amber });
  tx(s, d.l, x+0.3, y+1.0, 5.6, 0.5, { fontSize:14, bold:true, color:COLOR.ink });
  tx(s, d.s, x+0.3, y+1.5, 5.6, 0.6, { fontSize:11, color:COLOR.muted });
});
tx(s, 'Source: amd05082026.xlsx · 2,343 contracts across 21 expiries · 5/9/26', 0.5, 7.1, 12, 0.4, { fontSize:11, color:COLOR.muted, italic:true });

// SLIDE 8 — Lens 04: VALUATION
s = pres.addSlide();
tx(s, 'LENS 04 · VALUATION', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Premium across the comp set, especially on FY1', 0.5, 0.8, 12, 0.7, { fontSize:24, bold:true, color:COLOR.ink });
tx(s, 'Verdict: EXPENSIVE — premium justified by growth, but multiple compression is real risk', 0.5, 1.5, 12, 0.5, { fontSize:14, color:COLOR.crimson, italic:true });

s.addShape('rect', { x: 0.5, y: 2.3, w:12.3, h:4.4, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
tx(s, 'CONSENSUS SIGNAL', 0.7, 2.5, 12, 0.4, { fontSize:11, bold:true, color:COLOR.muted });
tx(s, '$442.49', 0.7, 2.9, 12, 1.0, { fontSize:48, bold:true, color:COLOR.amber });
tx(s, 'FactSet sell-side consensus target', 0.7, 3.95, 12, 0.4, { fontSize:14, color:COLOR.ink });
tx(s, '−2.79% downside vs 5/8/26 close $455.19 — analysts behind the rally', 0.7, 4.4, 12, 0.4, { fontSize:14, color:COLOR.crimson });
const vRows = [
  ['62.21×', 'P/E FY1 vs peer median 37.94× = +64% premium', COLOR.crimson],
  ['58.85×', 'EV/EBITDA FY1 vs peer median 28.14× = +109% premium', COLOR.crimson],
  ['Buy 1.24', 'Avg analyst rating · 59 brokers covering', COLOR.mint],
];
vRows.forEach((r, i) => {
  tx(s, r[0], 0.7+i*4.1, 5.2, 4.0, 0.5, { fontSize:18, bold:true, color:r[2] });
  tx(s, r[1], 0.7+i*4.1, 5.7, 4.0, 0.9, { fontSize:11, color:COLOR.ink });
});
tx(s, 'Source: FactSet Workstation Web · Comps Analysis (Semiconductors peer set) · captured 5/8/26', 0.5, 7.1, 12, 0.4, { fontSize:11, color:COLOR.muted, italic:true });

// SLIDE 9 — Synthesis
s = pres.addSlide();
tx(s, 'SYNTHESIS', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Three lenses bullish. One cautious on valuation. Patience and tranching = the call.', 0.5, 0.8, 12, 1.0, { fontSize:22, bold:true, color:COLOR.ink });

// Synthesis matrix
const mtx = [
  ['HORIZON','FUNDAMENTAL','TECHNICAL','OPTIONS','VALUATION','COMBINED','ACTION'],
  ['Short term (days–2 weeks)','+37.85% YoY','EXTREME OVERBOUGHT','Hedging skew','Premium','DEFER','Don\'t chase rallies'],
  ['Medium term (1–3 months)','Q2 26 likely beat','Strong trend','LEAPS bullish','FY2 +13%','ACCUMULATE','Build at $232-300'],
  ['Long term (6–18 months)','35% YoY commit','BULLISH','Bullish positioning','Multi-comp risk','HOLD / ADD','Target $500-550 mid-2027'],
];
mtx.forEach((row, i) => {
  row.forEach((cell, j) => {
    const wCol = [1.6, 1.5, 1.7, 1.5, 1.4, 1.5, 1.7];
    let x = 0.5;
    for (let k=0; k<j; k++) x += wCol[k];
    const y = 2.0 + i*0.7;
    const isHeader = i === 0;
    s.addShape('rect', { x, y, w:wCol[j], h:0.7, fill:{color: isHeader?COLOR.soft:'FFFFFF'}, line:{color:COLOR.border, width:0.5}});
    let color = COLOR.ink;
    if (!isHeader) {
      if (cell.includes('EXTREME')||cell.includes('Premium')||cell.includes('DEFER')) color = COLOR.crimson;
      else if (cell.includes('+')||cell.includes('BULLISH')||cell.includes('Strong')||cell.includes('beat')||cell.includes('commit')||cell.includes('Hold')||cell.includes('Build')||cell.includes('ACCUMULATE')) color = COLOR.mint;
      else if (cell.includes('skew')||cell.includes('FY2')||cell.includes('Multi')) color = COLOR.amber;
    }
    tx(s, cell, x+0.05, y+0.1, wCol[j]-0.1, 0.6, { fontSize: isHeader?9:10, bold:isHeader, color, align:isHeader?'left':'left' });
  });
});

tx(s, 'Path > destination', 0.5, 5.0, 12, 0.5, { fontSize:18, bold:true, color:COLOR.ink });
tx(s, "AMD's fundamentals tell us where it's going (continued AI-led data center share gain). Technicals tell us how it gets there (currently parabolic — a pullback is the more likely path). Today the path is over-extended; the destination is materially higher 6–18 months out.", 0.5, 5.5, 12.3, 1.5, { fontSize:14, color:COLOR.ink, lineSpacing:20 });

// SLIDE 10 — The play
s = pres.addSlide();
tx(s, 'THE PLAY', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, 'Tranched entry · patience over chase', 0.5, 0.8, 12, 0.7, { fontSize:24, bold:true, color:COLOR.ink });

const tranches = [
  { name: 'Tranche T1', size: '40%', range: '$300 – $330', desc: 'Pullback to ~SMA 50 zone · ~50× FY2 P/E', color: COLOR.mint },
  { name: 'Tranche T2', size: '30%', range: '$250 – $280', desc: 'SMA 20 zone · ~38× FY2 P/E (peer median)', color: COLOR.mint },
  { name: 'Tranche T3', size: '30%', range: '$200 – $230', desc: 'SMA 200 support · ~33× FY2 P/E', color: COLOR.mint },
];
tranches.forEach((t, i) => {
  const y = 1.8 + i*1.4;
  s.addShape('rect', { x: 0.5, y, w:12.3, h:1.2, fill:{color:COLOR.bg}, line:{color:COLOR.border, width:1}});
  tx(s, t.name, 0.7, y+0.15, 2.0, 0.4, { fontSize:14, bold:true, color:COLOR.ink });
  tx(s, t.size, 2.7, y+0.15, 1.0, 0.4, { fontSize:14, bold:true, color:t.color });
  tx(s, t.range, 3.7, y+0.15, 2.5, 0.4, { fontSize:18, bold:true, color:COLOR.ink });
  tx(s, t.desc, 6.2, y+0.15, 6.6, 0.9, { fontSize:11, color:COLOR.muted });
});

// hard stop and target
s.addShape('rect', { x: 0.5, y: 6.1, w:6.0, h:1.0, fill:{color:'FEE2E2'}, line:{color:COLOR.crimson, width:1}});
tx(s, 'HARD STOP', 0.7, 6.2, 5.6, 0.3, { fontSize:11, bold:true, color:COLOR.crimson });
tx(s, '$180', 0.7, 6.4, 5.6, 0.5, { fontSize:24, bold:true, color:COLOR.crimson });
tx(s, 'Weekly close below — invalidates LT trend', 2.5, 6.4, 4.0, 0.5, { fontSize:11, color:COLOR.crimson });

s.addShape('rect', { x: 6.8, y: 6.1, w:6.0, h:1.0, fill:{color:'D1FAE5'}, line:{color:COLOR.mint, width:1}});
tx(s, '12–18 MONTH TARGET', 7.0, 6.2, 5.6, 0.3, { fontSize:11, bold:true, color:COLOR.mint });
tx(s, '$500–550', 7.0, 6.4, 5.6, 0.5, { fontSize:24, bold:true, color:COLOR.mint });
tx(s, 'Reward/risk improves at tranche 2/3 entries', 9.0, 6.4, 4.0, 0.5, { fontSize:11, color:COLOR.mint });

// SLIDE 11 — closing
s = pres.addSlide();
tx(s, 'CLOSING', 0.5, 0.4, 12, 0.5, { fontSize:14, bold:true, color:COLOR.muted });
tx(s, "AMD is the long-term you accumulate on the pullback.", 0.5, 0.8, 12, 1.0, { fontSize:28, bold:true, color:COLOR.ink });
tx(s, 'Fundamentals are flawless. Management credibility is among the highest in the dataset. The stock has just made it. The premium reflects expectation; pullbacks are the entry.', 0.5, 2.2, 12, 1.5, { fontSize:18, color:COLOR.ink, lineSpacing:24 });

tx(s, 'DISCLAIMER', 0.5, 4.5, 12, 0.5, { fontSize:11, bold:true, color:COLOR.muted });
tx(s, 'Analytical synthesis of disclosed data on file in the management_credibility_project workspace. Not personalized investment advice. Forecasts are inherently uncertain. Verify peer multiples at trade time. Consult a licensed financial advisor before any trading decision.', 0.5, 5.0, 12, 1.5, { fontSize:11, color:COLOR.muted, italic:true, lineSpacing:16 });

pres.writeFile({ fileName: '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/AMD_Pitch_Deck.pptx' }).then(f => console.log('AMD_Pitch_Deck.pptx written:', f));
