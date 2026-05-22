const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const text = (s, opts = {}) => new TextRun({ text: s, ...opts });
const para = (children, opts = {}) => new Paragraph({ children, ...opts });
const heading = (s, level=HeadingLevel.HEADING_1) => para([text(s, {bold:true, size:32, color:'111827'})], {spacing:{before:240,after:120}});
const sub = (s) => para([text(s, {bold:true, size:24, color:'374151'})], {spacing:{before:200,after:100}});
const body = (s) => para([text(s, {size:22, color:'1F2937'})], {spacing:{after:80}});
const bul = (s, color='1F2937') => para([text('• ', {bold:true, color}), text(s, {size:22, color:'1F2937'})], {indent:{left:240}, spacing:{after:60}});
const bullet = (s) => bul(s);

const cellText = (s, opts={}) => new TableCell({
  width: opts.w ? { size: opts.w, type: WidthType.DXA } : undefined,
  shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR, color: 'auto' } : undefined,
  children: [new Paragraph({ children: [new TextRun({ text: s, size: opts.size||20, bold: opts.bold, color: opts.color||'1F2937' })], alignment: opts.align })]
});

const header = (s, w) => cellText(s, {bold:true, color:'374151', shade:'F3F4F6', size:18, w});
const td = (s, opts={}) => cellText(s, opts);

// Build tables ----
const scoreboardTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: ['Metric','Baseline','Latest','Change'].map((h,i)=> header(h, [2400,2400,2400,1800][i])) }),
    new TableRow({ children: [td('Revenue (TTM)'), td('$22.7B (FY 23)'), td('$37.45B', {bold:true}), td('+65.1%', {color:'10B981', bold:true})] }),
    new TableRow({ children: [td('Operating margin (Q-q)'), td('0.66% (Q1 24)'), td('14.40% (Q1 26)', {bold:true}), td('+13.74 pp', {color:'10B981', bold:true})] }),
    new TableRow({ children: [td('Diluted EPS (Q)'), td('$0.07 (Q1 24)'), td('$0.84 (Q1 26)', {bold:true}), td('+1100%', {color:'10B981', bold:true})] }),
    new TableRow({ children: [td('Operating cash flow (Q)'), td('$521M (Q1 24)'), td('$2,955M (Q1 26)', {bold:true}), td('+467%', {color:'10B981', bold:true})] }),
    new TableRow({ children: [td('Forward-guidance accuracy (MCS)'), td('—'), td('0.9591', {bold:true}), td('8 beats / 0 misses across 8 guides', {color:'10B981', bold:true})] }),
  ],
});

const doc = new Document({
  creator: 'AMD Investment Profile · 5/9/26',
  title: 'AMD — Executive Summary',
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } },
    },
    children: [
      // Banner
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [text('AMD — INVESTMENT PROFILE', { bold: true, size: 40, color: '0F62FE' })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [text('Eight-Quarter Comprehensive Analysis (Q1 2024 → Q1 2026) · Prepared 5/9/26', { italic: true, size: 22, color: '6B7280' })],
        spacing: { after: 320 },
      }),

      heading('FORWARD VIEW: BULLISH (with timing caution)', HeadingLevel.HEADING_1),
      body("AMD has delivered 8 of 8 quarterly revenue beats since Q2 2024 (MCS = 0.9591), with revenue YoY growth remarkably consistent at +31-38% across the last five quarters. Operating margin has expanded from 0.66% (Q1 2024) to 14.40% (Q1 2026) — a 13.7 pp lift over 8 quarters despite the $800M MI308 export-control charge in Q2 2025. Q1 2026 revenue was $10.25B (+37.85% YoY) — among the strongest growth in the dataset."),
      body("The fundamental case is exceptionally strong; the timing case is not. AMD has rallied 267% from the 52-week low of $96.65 to a fresh all-time high of $354.49 (Apr 30, 2026). RSI 14 is at 83 (extreme overbought), the stock trades 67.5% above its SMA 200, and FactSet peer comps show AMD at +64% premium to median FY1 P/E (62.21× vs 37.94×) and +109% premium on FY1 EV/EBITDA. Sell-side consensus target is $442.49 — below current."),

      heading('BULL CASE', HeadingLevel.HEADING_1),
      bullet('Revenue growth re-accelerating. YoY growth went +35.9% → +31.7% → +35.6% → +34.1% → +37.85% across the last five quarters. Q1 2026 is the strongest YoY print in the dataset.'),
      bullet('Operating margin expanding. Q1 2026 OM 14.40% (vs 0.66% Q1 2024). Q4 2025 hit 17.06% — the all-time high in the dataset. Trend line is up and right.'),
      bullet('Forward-guidance accuracy is exceptional. 8 of 8 closed quarters beat the guide midpoint; MCS = 0.9591 — comparable to META 0.9589.'),
      bullet('Cash flow inflection. OCF Q1 26 $2.96B (vs $521M Q1 24, +467%); FCF $2.57B vs $379M Q1 24 (+577%). Light-asset model.'),
      bullet('Capex ~$300-400M/quarter — compares favorably to META\'s $19B/quarter (1/40th the capex burden); leverages TSMC for fab manufacturing.'),
      bullet('Lisa Su committed to ~35% YoY revenue growth in FY 2026 driven by Data Center and Client/Gaming segments.'),

      heading('BEAR CASE', HeadingLevel.HEADING_1),
      bullet('Premium valuation. AMD trades at P/E FY1 62.21× vs semi peer median 37.94× (+64% premium). EV/EBITDA FY1 58.85× vs median 28.14× (+109%). Multiple compression is a real risk if growth misses.'),
      bullet('Sell-side target ($442.49) is BELOW current price ($455.19 per FactSet snapshot 5/8/26). Market has run ahead of analyst models.'),
      bullet('Technical setup is parabolic. RSI 14 = 83 (deeply overbought), price +68% above SMA 200, ADX 71 (extreme trend strength). Mean-reversion risk is elevated.'),
      bullet('China export controls remain binding. MI308 only ~$100M of Q1 26 revenue (vs $700M run-rate before April 2025 ban). Q2 25 took an $800M charge.'),
      bullet('Q4 2025 earnings reaction was -18.71% — the largest drop in the 9-quarter dataset. Market has shown willingness to punish on guidance even when results beat.'),

      heading('SCOREBOARD: BASELINE → LATEST', HeadingLevel.HEADING_1),
      scoreboardTable,
      para([], { spacing: { after: 200 } }),

      heading('UPGRADE / DOWNGRADE TRIGGERS', HeadingLevel.HEADING_1),
      sub('Upgrade triggers (BULLISH catalyst)'),
      bullet('FY 2026 revenue growth ≥35% (management commitment) and gross margin ≥54% (Q4 25 level held).'),
      bullet('MI308 export licenses approved → unlock ~$600M of stranded China demand.'),
      bullet('Sell-side target revisions catch up to spot ($442 → $500+).'),
      bullet('Successful MI400 series ramp and design wins at hyperscalers.'),
      sub('Downgrade triggers (BEARISH catalyst)'),
      bullet('Revenue growth deceleration to <30% YoY in any 2026 quarter.'),
      bullet('Gross margin compression below 50% (was 54.30% in Q4 25 peak).'),
      bullet('Daily close below SMA 200 (~$210) — major trend break.'),
      bullet('RSI 14 falls below 50 with broken trendline (currently 83).'),

      heading('BOTTOM LINE', HeadingLevel.HEADING_1),
      body("BULLISH for long-term capital with timing discipline. AMD is delivering everything bulls want: revenue growth at 35%+, operating margin expansion, world-class management credibility (MCS 0.96), and free cash flow inflecting. But the easy money has been made: stock at all-time highs, 67% above SMA 200, and trades at 62× FY1 P/E vs 38× peer median. Add on pullbacks toward $232-300 (SMA 50 zone), not chase at $455."),
      para([text('Recommended action: ', {bold:true}), text('Defer new tactical longs. Build LT position via tranching at SMA 20 ($278) → SMA 50 ($232) → SMA 200 ($210) zones. Hard stop on weekly close below $180.', {})], {spacing:{after:200}}),

      heading('DISCLAIMER', HeadingLevel.HEADING_1),
      body('This analysis is based on public filings (SEC EDGAR XBRL company-facts API), 8 AMD earnings transcripts, daily OHLCV stock prices (Barchart export), and FactSet peer multiples captured 5/8/26 via Claude-in-Chrome. Synthesis is informational only — not personalized investment advice. Forecasts are inherently uncertain. Verify peer multiples at trade time. Past performance does not predict future results.'),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/AMD_Executive_Summary.docx', buf);
  console.log('AMD_Executive_Summary.docx written:', buf.length, 'bytes');
});
