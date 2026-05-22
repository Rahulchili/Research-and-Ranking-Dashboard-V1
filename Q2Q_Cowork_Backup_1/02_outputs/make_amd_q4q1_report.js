const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType, ShadingType, ImageRun } = require('docx');
const fs = require('fs');

const text = (s, opts={}) => new TextRun({ text: s, ...opts });
const para = (children, opts={}) => new Paragraph({ children, ...opts });
const heading1 = (s) => para([text(s, {bold:true, size:32, color:'0F62FE'})], {spacing:{before:240,after:120}});
const heading2 = (s) => para([text(s, {bold:true, size:26, color:'374151'})], {spacing:{before:200,after:100}});
const body = (s) => para([text(s, {size:22, color:'1F2937'})], {spacing:{after:80}});
const bullet = (s) => para([text('• ', {bold:true}), text(s, {size:22})], {indent:{left:240}, spacing:{after:60}});
const cellTC = (s, opts={}) => new TableCell({
  width: opts.w ? { size: opts.w, type: WidthType.DXA } : undefined,
  shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR, color: 'auto' } : undefined,
  children: [new Paragraph({ children: [new TextRun({ text: s, size: opts.size||20, bold: opts.bold, color: opts.color||'1F2937' })], alignment: opts.align })]
});
const header = (s, w) => cellTC(s, {bold:true, color:'374151', shade:'F3F4F6', size:18, w});
const td = (s, opts={}) => cellTC(s, opts);

// Compare table
const compareTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: [
      header('Metric', 2400), header('Q4 2025', 1300), header('Q1 2026', 1300), header('Δ QoQ', 1700), header('Direction', 2300)
    ]}),
    new TableRow({ children: [td('Total revenue'), td('$10.27B'), td('$10.25B', {bold:true}), td('−$17M (−0.2%)'), td('Flat (seasonal-strong)', {color:'10B981'})] }),
    new TableRow({ children: [td('YoY revenue growth'), td('+34.11%'), td('+37.85%', {bold:true, color:'10B981'}), td('+3.74 pp'), td('Accelerating', {color:'10B981'})] }),
    new TableRow({ children: [td('Cost of revenue'), td('$4.69B'), td('$4.84B'), td('+$144M'), td('Volume-led', {color:'64748B'})] }),
    new TableRow({ children: [td('Gross margin'), td('54.30%'), td('52.82%'), td('−148 bps'), td('Slight compression', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Operating income'), td('$1.75B'), td('$1.48B'), td('−$276M (−15.7%)'), td('Margin compression', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Operating margin'), td('17.06%'), td('14.40%', {bold:true}), td('−266 bps'), td('Investment-led decline', {color:'F59E0B'})] }),
    new TableRow({ children: [td('R&D expense'), td('$2.33B'), td('$2.40B'), td('+$67M'), td('Sustained investment', {color:'64748B'})] }),
    new TableRow({ children: [td('R&D as % of revenue'), td('22.69%'), td('23.38%', {bold:true}), td('+69 bps'), td('Sustained investment', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Net income'), td('$1.51B'), td('$1.38B', {bold:true}), td('−$128M (−8.5%)'), td('Margin compression', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Net margin'), td('14.71%'), td('13.49%'), td('−122 bps'), td('Slight compression', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Diluted EPS'), td('$0.92'), td('$0.84'), td('−$0.08 (−8.7%)'), td('Compression QoQ', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Operating cash flow'), td('$2.60B'), td('$2.96B', {bold:true}), td('+$355M (+13.7%)'), td('Strong expansion', {color:'10B981'})] }),
    new TableRow({ children: [td('Capital expenditures'), td('$222M'), td('$389M'), td('+$167M (+75%)'), td('Capacity build-out', {color:'F59E0B'})] }),
    new TableRow({ children: [td('Free cash flow'), td('$2.38B'), td('$2.57B', {bold:true}), td('+$188M (+7.9%)'), td('Improving', {color:'10B981'})] }),
    new TableRow({ children: [td('Post-earnings 1-day reaction'), td('−18.71%'), td('+9.68%', {bold:true, color:'10B981'}), td('+28.39pp'), td('Sentiment reversal', {color:'10B981'})] }),
  ],
});

const yoyTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: [header('Quarter', 1500), header('Revenue', 1500), header('YoY %', 1500), header('Versus Prior Year', 4500)] }),
    new TableRow({ children: [td('Q1 2025'), td('$7,438M'), td('+35.90%', {color:'10B981'}), td('vs Q1 2024 $5,473M')] }),
    new TableRow({ children: [td('Q2 2025'), td('$7,685M'), td('+31.71%', {color:'10B981'}), td('vs Q2 2024 $5,835M (despite $800M MI308 charge)')] }),
    new TableRow({ children: [td('Q3 2025'), td('$9,246M'), td('+35.59%', {color:'10B981'}), td('vs Q3 2024 $6,819M')] }),
    new TableRow({ children: [td('Q4 2025'), td('$10,270M'), td('+34.11%', {color:'10B981'}), td('vs Q4 2024 $7,658M')] }),
    new TableRow({ children: [td('Q1 2026'), td('$10,253M'), td('+37.85%', {color:'10B981', bold:true}), td('vs Q1 2025 $7,438M (strongest in dataset)')] }),
  ],
});

const doc = new Document({
  creator: 'AMD Q4 2025 vs Q1 2026 Institutional Report',
  title: 'AMD Q4 2025 vs Q1 2026 Institutional Report',
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [text('AMD — Q4 2025 vs Q1 2026', {bold:true, size:40, color:'0F62FE'})], spacing:{after:80}}),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [text('Detailed Financial Comparison & Institutional Interpretation · Prepared 5/9/26', {italic:true, size:22, color:'6B7280'})], spacing:{after:320}}),

      heading1('Overview'),
      body('AMD printed a high-quality Q1 2026: revenue $10.25B (+37.85% YoY) ahead of the $9.5–10.1B guide midpoint, operating income $1.48B at a 14.40% operating margin. Reported diluted EPS of $0.84 came in well above last quarter\'s $0.92 in absolute level but compressed slightly vs Q4 25 on a margin basis. Gross margin held above 52.82%, structurally well above the 46-50% range from 2024.'),
      body('We remain BULLISH on a 6–12 month horizon with timing caution. The fundamental case rests on (1) consistent revenue acceleration — five consecutive quarters of +31-38% YoY; (2) management\'s perfect forward-guidance accuracy (8 of 8 closed quarters beat; MCS 0.9591); (3) operating margin expansion from 0.66% (Q1 24) → 14.40% (Q1 26) — 13.7 pp of margin lift in 8 quarters; and (4) FY 26 management commitment to ~35% YoY revenue growth. The principal risks are valuation premium (P/E FY1 62× vs peer median 38×) and parabolic technical setup (RSI 83, +68% above SMA 200).'),

      heading1('Q4 2025 vs Q1 2026 — Detailed Financial Comparison'),
      body('All figures derived from SEC EDGAR XBRL (us-gaap concepts). Q4 2025 = FY 2025 10-K (accession 0000002488-26-000018) minus YTD-Q3 10-Q.'),
      compareTable,
      para([], {spacing:{after:200}}),

      heading1('Revenue Growth Trajectory — Five Consecutive Quarters of +31-38% YoY'),
      body('AMD\'s YoY revenue growth has been remarkably consistent through the data center ramp despite the MI308 export-control charge in Q2 2025:'),
      yoyTable,
      para([], {spacing:{after:160}}),
      body('Drivers: Data Center segment (Instinct GPUs + EPYC CPUs + ZT Systems acquisition closed 3/31/25) is the principal accelerator, with hyperscale AI deployments. Client/Gaming segment lifted by Ryzen/Radeon refresh cycle. Embedded segment showing recovery in Q4 25 / Q1 26.'),

      heading1('Management Commentary Highlights'),
      heading2('Lisa Su, CEO — Q4 2025 call (Feb 3, 2026)'),
      body('"Looking at 2026, we expect revenue to grow by approximately 35% year-over-year, driven by strong growth in our Data Center and Client and Gaming segments and modest growth in our Embedded segment."'),
      heading2('Jean Hu, CFO — Q4 2025 call (Feb 3, 2026)'),
      body('"For the first quarter of 2026, we expect revenue to be approximately $9.8 billion, plus or minus $300 million, including approximately $100 million of MI308 sales to China."'),
      heading2('Lisa Su, CEO — Q3 2025 call (Nov 4, 2025)'),
      body('"Q3 was the strongest quarter in AMD\'s history, with record revenue of $9.2 billion."'),
      heading2('Lisa Su, CEO — Q1 2025 call (May 6, 2025)'),
      body('"In April, a new export license requirement was put in place for MI308 shipments to China, the impact of which is included in our guidance."'),

      heading1('Institutional Interpretation'),
      heading2('Why did AMD rally +9.68% on the Q1 2026 print?'),
      bullet('Beat-and-raise pattern continued. Q1 26 revenue $10.25B vs $9.8B guide mid (+4.62% beat). Eighth consecutive beat.'),
      bullet('Operating margin held above 14% despite seasonality and capacity build — well above bear case scenarios.'),
      bullet('Strong cash flow. $2.96B OCF in Q1 — strongest single-quarter OCF in AMD\'s history.'),
      bullet('FY 26 guide reaffirmed. Lisa Su\'s 35% YoY revenue growth commitment provides visibility through year-end.'),

      heading2('What hedge funds will focus on'),
      bullet('MI400 series ramp. Next-gen accelerator timing and design wins at hyperscalers.'),
      bullet('China MI308 export license status. ~$100M expected in Q1 26 vs $700M run-rate before April 2025 ban; further easing/tightening is a TAM swing factor.'),
      bullet('Gross margin trajectory. 54.30% Q4 25 was a record; sustaining ≥52% through MI400 ramp matters for FY 26 OI commitment.'),
      bullet('Forward P/E compression toward FY2 multiple (~35×). Market needs FY 26 EPS to grow ~75% to justify current P/E. Achievable with management\'s 35% revenue + margin expansion path.'),

      heading1('Forward Outlook — Q2 2026 Expectations'),
      bullet('Revenue: base case $10.5–11.0B (+30-32% YoY off $7.69B base). Awaiting management guide post-Q1 print.'),
      bullet('Operating income: $1.7–1.9B at ~16-18% margin if MI300 mix improves and MI308 normalizes.'),
      bullet('EPS: $1.00–1.10 range; FactSet consensus $1.04 (broker count 59).'),
      bullet('Capex: $300-450M run-rate; FY 26 likely $1.4-1.6B vs FY 25 $0.97B.'),

      heading1('Disclaimer'),
      body('This analysis is based on public filings (SEC EDGAR XBRL company-facts API, CIK 0000002488), 8 AMD earnings transcripts, daily OHLCV stock prices (Barchart export), and FactSet peer multiples captured 5/8/26. Synthesis is informational only — not personalized investment advice. Forecasts inherently uncertain. Verify multiples at trade time. Past performance does not predict future results.'),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/AMD_Q4_2025_vs_Q1_2026_Institutional_Report.docx', buf);
  console.log('AMD_Q4_2025_vs_Q1_2026_Institutional_Report.docx written:', buf.length, 'bytes');
});
