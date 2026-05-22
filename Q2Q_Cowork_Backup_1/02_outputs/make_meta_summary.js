const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
} = require('docx');

const BLUE = "1F4E79";
const GREEN = "2E7D32";
const RED = "C62828";
const AMBER = "B45309";
const GREY_TEXT = "404040";
const GREY_LIGHT = "DDDDDD";

const border = { style: BorderStyle.SINGLE, size: 4, color: GREY_LIGHT };
const allBorders = { top: border, bottom: border, left: border, right: border };

const cellPad = { top: 60, bottom: 60, left: 100, right: 100 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 60, line: 260 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics,
      color: opts.color, size: opts.size || 18, font: "Arial" })]
  });
}

function pRich(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 60, line: 260 },
    alignment: opts.align || AlignmentType.LEFT,
    children: runs.map(r => new TextRun({
      text: r.text, bold: !!r.bold, italics: !!r.italics, color: r.color,
      size: r.size || 18, font: "Arial"
    }))
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { before: 0, after: 50, line: 240 },
    children: [new TextRun({ text, size: 18, font: "Arial", color: opts.color })]
  });
}

function bulletRich(runs) {
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { before: 0, after: 50, line: 240 },
    children: runs.map(r => new TextRun({
      text: r.text, bold: !!r.bold, italics: !!r.italics, color: r.color,
      size: r.size || 18, font: "Arial"
    }))
  });
}

function thCell(text, w, fill) {
  return new TableCell({
    borders: allBorders, width: { size: w, type: WidthType.DXA },
    shading: { fill: fill || "EEF2FF", type: ShadingType.CLEAR },
    margins: cellPad,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER, spacing:{after:0,line:240},
      children:[new TextRun({ text, bold:true, size:16, font:"Arial", color: BLUE })]
    })]
  });
}
function tdCell(text, w, opts = {}) {
  const align = opts.align || AlignmentType.LEFT;
  return new TableCell({
    borders: allBorders, width: { size: w, type: WidthType.DXA },
    margins: cellPad,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: align, spacing:{after:0,line:240},
      children:[new TextRun({ text, bold:!!opts.bold, size:16, font:"Arial", color: opts.color || GREY_TEXT })]
    })]
  });
}

// === Build the document ===
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 18 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 0, after: 80 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 20, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [{
      reference: "bul",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 220 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }   // 0.75" margins
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({ alignment: AlignmentType.LEFT, spacing:{after:0,line:200}, children:[
          new TextRun({ text: "META PLATFORMS, INC. (META) — EXECUTIVE SUMMARY", bold: true, size: 16, color: BLUE, font:"Arial" })
        ]}),
        new Paragraph({ alignment: AlignmentType.LEFT, spacing:{after:0,line:200}, children:[
          new TextRun({ text: "8-Quarter Analysis (Q2 2024 → Q1 2026 actuals; Q1 2026 call's Q2 2026 guide pending)", italics:true, size: 14, color: GREY_TEXT, font:"Arial" })
        ]})
      ]})
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER, spacing:{after:0,line:200},
        children: [
          new TextRun({ text: "Source: management_credibility_project · Q2Q_ER_Cowork dataset · Generated May 8, 2026 · ", size: 14, color: GREY_TEXT, font:"Arial" }),
          new TextRun({ text: "Page ", size: 14, color: GREY_TEXT, font:"Arial" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 14, color: GREY_TEXT, font:"Arial" }),
        ]
      })]})
    },
    children: [
      // Title block
      new Paragraph({ heading: HeadingLevel.HEADING_1,
        spacing: { before: 120, after: 40 },
        children: [new TextRun({ text: "META — Forward View: BULLISH", bold:true, size:32, color: GREEN, font:"Arial" })]
      }),
      pRich([
        { text: "Verdict: ", bold:true },
        { text: "BULLISH", bold:true, color: GREEN },
        { text: " on a 6–12-month horizon. The data favors continued execution, with the AI-capex ramp the principal risk to monitor — not a thesis-breaker on what we have today." }
      ], { after: 160, size: 18 }),

      // Scoreboard table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:"At-a-glance scoreboard", bold:true, size:20, color:BLUE, font:"Arial" })]}),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [2800, 2400, 2400, 2480],
        rows: [
          new TableRow({ children: [
            thCell("Metric", 2800),
            thCell("Q1 2024 baseline", 2400),
            thCell("Q1 2026 latest", 2400),
            thCell("Direction", 2480),
          ]}),
          new TableRow({ children: [
            tdCell("Revenue (next-quarter guide vs actual)", 2800),
            tdCell("$36.5–39.0B → $39.07B (+3.5%)", 2400),
            tdCell("$58–61B guide (Q2 2026 pending)", 2400),
            tdCell("Accelerating beats", 2480, { color: GREEN, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("Quarterly revenue (YoY)", 2800),
            tdCell("$36.46B (+27% YoY)", 2400),
            tdCell("$56.31B (+33.1% YoY)", 2400),
            tdCell("Growth re-accelerating", 2480, { color: GREEN, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("Net margin", 2800),
            tdCell("~33–34%", 2400),
            tdCell("47.54% (highest in dataset)", 2400),
            tdCell("Expanding", 2480, { color: GREEN, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("Diluted EPS (single-quarter)", 2800),
            tdCell("$4.71 (Q1 2025 ref)", 2400),
            tdCell("$6.43 (+36.5% YoY)", 2400),
            tdCell("Compounding", 2480, { color: GREEN, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("Management Credibility Score", 2800),
            tdCell("—", 2400),
            tdCell("0.9589 (8 beats / 0 revenue misses)", 2400),
            tdCell("Top-tier execution", 2480, { color: GREEN, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("FY capex (annual)", 2800),
            tdCell("$37.3B (2024)", 2400),
            tdCell("$125–145B (2026 guide)", 2400),
            tdCell("3.6x ramp — risk to monitor", 2480, { color: AMBER, bold:true }),
          ]}),
          new TableRow({ children: [
            tdCell("Avg post-earnings 5-day reaction", 2800),
            tdCell("Mixed (early period)", 2400),
            tdCell("−2.0% trailing two calls", 2400),
            tdCell("Market wary on capex", 2480, { color: RED, bold:true }),
          ]}),
        ]
      }),

      // Bull case
      new Paragraph({ heading: HeadingLevel.HEADING_2,
        children:[new TextRun({ text:"Why bullish — what the data shows", bold:true, size:20, color:GREEN, font:"Arial" })]}),
      bulletRich([
        { text: "Revenue growth is re-accelerating, not slowing. ", bold:true },
        { text: "YoY growth went +16.1% → +21.6% → +26.2% → +23.8% → +33.1% across the last five reported quarters. Q1 2026 is the strongest YoY print in the entire dataset." }
      ]),
      bulletRich([
        { text: "Operating leverage is intact despite the AI build. ", bold:true },
        { text: "Q1 2026 net margin 47.54%, operating margin 47.77%, ROE 43.95% — all dataset highs. Management explicitly committed on the Q4 2025 call that 2026 operating income will be above 2025; the Q1 2026 print already supports that path." }
      ]),
      bulletRich([
        { text: "Forward-guidance accuracy is exceptional. ", bold:true },
        { text: "Across 8 closed quarters, every revenue commitment beat (6) or landed in-range (2); zero misses. MCS = 0.9589. The two miss line items (FY 2025 capex initial outlook and FY 2025 tax rate) trace to a single 2024-Q4 call and have well-documented explanations — capex was raised three times during the year as the AI build accelerated, and the tax-rate miss is the OBBBA one-time legislation charge." }
      ]),
      bulletRich([
        { text: "Strategic milestones are landing. ", bold:true },
        { text: "Llama 3 / 4 cadence on schedule, Meta AI scaled past the 1B-user threshold management committed to, AI ad-creative tools deployed broadly, and server-life policy extension delivering structural opex savings." }
      ]),

      // Bear case
      new Paragraph({ heading: HeadingLevel.HEADING_2,
        children:[new TextRun({ text:"Bear-case risks worth monitoring", bold:true, size:20, color:RED, font:"Arial" })]}),
      bulletRich([
        { text: "Capex magnitude is unprecedented for META. ", bold:true },
        { text: "FY capex: $37.3B → $69.7B → $125–145B (2024 → 2025 → 2026 guide). The 2026 midpoint is roughly 3.6x the 2024 figure. ROI on AI infrastructure at this scale is the single biggest open question." }
      ]),
      bulletRich([
        { text: "Market is voicing skepticism. ", bold:true },
        { text: "5-day post-earnings reactions on the last two calls were −15.40% (Q3 2025) and 1-day −8.55% (Q1 2026, with T+5 outside the dataset). Sell-offs of this magnitude on quarters that beat revenue indicate investors are repricing the capex outlook, not the operating fundamentals." }
      ]),
      bulletRich([
        { text: "Multi-year strategic claims are unverified. ", bold:true },
        { text: "Reality Labs \"peak losses in 2025\", AI-coding-agent capability by mid-late 2026, and Threads' 1B-user trajectory all remain pending. None contradict the bull case, but they extend the credibility tail." }
      ]),

      // Neutral / what to watch
      new Paragraph({ heading: HeadingLevel.HEADING_2,
        children:[new TextRun({ text:"What would change the call", bold:true, size:20, color:BLUE, font:"Arial" })]}),
      bulletRich([
        { text: "Move to NEUTRAL if: ", bold:true, color: AMBER },
        { text: "Q2 2026 prints inside guidance but operating margin compresses below 42% on capex absorption, OR FY 2026 capex is raised again above $145B without a corresponding revenue/efficiency offset." }
      ]),
      bulletRich([
        { text: "Move to BEARISH if: ", bold:true, color: RED },
        { text: "Q2/Q3 2026 revenue growth decelerates below +20% YoY AND management cannot articulate clear AI-monetization milestones; or the 2026 operating-income > 2025 commitment is walked back." }
      ]),

      // Bottom line
      new Paragraph({ heading: HeadingLevel.HEADING_2,
        children:[new TextRun({ text:"Bottom line", bold:true, size:20, color:BLUE, font:"Arial" })]}),
      pRich([
        { text: "Across nine consecutive earnings cycles, META management has delivered on essentially every forward statement they've quantified. Revenue growth is accelerating, margins are expanding to dataset highs, and the company is funding the largest AI infrastructure build in its history out of operating cash flow without compromising profit growth. The market's recent post-earnings selling reflects valuation-and-capex anxiety more than any fundamental deterioration visible in the data. " },
        { text: "Stance: BULLISH, with capex/ROI as the explicit thing to verify each quarter.", bold:true, color: GREEN }
      ], { after: 80 }),

      pRich([
        { text: "Disclaimer: ", bold:true, italics:true, color: GREY_TEXT, size: 14 },
        { text: "This is an analytical synthesis of the disclosed data on file in this project, not a buy/sell recommendation or personalized investment advice. Forecasts are inherently uncertain. Consult a licensed financial advisor before making investment decisions.",
          italics:true, color: GREY_TEXT, size: 14 }
      ], { before: 60 }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/META_Executive_Summary.docx';
  fs.writeFileSync(out, buf);
  console.log('Wrote', out, 'size=', buf.length);
});
