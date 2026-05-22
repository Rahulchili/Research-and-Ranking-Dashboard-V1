const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak, TabStopType,
} = require('docx');

const NAVY="1F4E79", SLATE="3D5A80", MINT="2E7D32", RED="C62828", AMBER="B45309",
      TEXT="333333", MUTED="6B6B6B", LIGHT="EFF1F4", BORDER="C9CDD2";

const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const allBorders = { top: border, bottom: border, left: border, right: border };
const cellPad = { top: 70, bottom: 70, left: 110, right: 110 };

function tr(text, opts={}) { return new TextRun({ text, bold:!!opts.bold, italics:!!opts.italics,
  color: opts.color, size: opts.size||18, font:"Calibri" }); }
function p(text, opts={}) { return new Paragraph({ spacing:{ before: opts.before??0, after: opts.after??80, line:280 },
  alignment: opts.align||AlignmentType.LEFT, children:[tr(text, opts)] }); }
function pRich(runs, opts={}) { return new Paragraph({ spacing:{ before: opts.before??0, after: opts.after??80, line:280 },
  alignment: opts.align||AlignmentType.LEFT, children: runs.map(r=>tr(r.text, r)) }); }
function bul(text, opts={}) { return new Paragraph({ numbering:{ reference:"bul", level:0 },
  spacing:{ before:0, after:50, line:270 }, children:[tr(text, { size:18, ...opts })] }); }
function bulRich(runs) { return new Paragraph({ numbering:{ reference:"bul", level:0 },
  spacing:{ before:0, after:50, line:270 }, children: runs.map(r=>tr(r.text, { size:18, ...r })) }); }

function thCell(text, w, fill=LIGHT) {
  return new TableCell({ borders: allBorders, width:{size:w, type:WidthType.DXA},
    shading:{fill, type:ShadingType.CLEAR}, margins:cellPad,
    children:[new Paragraph({ alignment:AlignmentType.LEFT, spacing:{after:0,line:240},
      children:[tr(text,{bold:true,size:16,color:NAVY})] })] });
}
function tdCell(text, w, opts={}) {
  return new TableCell({ borders: allBorders, width:{size:w, type:WidthType.DXA}, margins:cellPad,
    shading: opts.fill?{fill:opts.fill, type:ShadingType.CLEAR}:undefined,
    children:[new Paragraph({ alignment: opts.align||AlignmentType.LEFT, spacing:{after:0,line:240},
      children:[tr(text,{bold:!!opts.bold,size:16,color:opts.color||TEXT})] })] });
}
function image(filename, w_in, h_in) {
  const fp = path.join('/sessions/compassionate-nice-johnson/mnt/outputs/ta_charts', filename);
  return new Paragraph({ spacing:{before:100, after:100}, alignment:AlignmentType.CENTER,
    children:[new ImageRun({ type:'png', data:fs.readFileSync(fp),
      transformation:{ width:w_in*96, height:h_in*96 },
      altText:{ title:filename, description:filename, name:filename } })] });
}
function caption(text) { return new Paragraph({ spacing:{before:0,after:140,line:240},
  alignment:AlignmentType.CENTER, children:[tr(text,{italics:true,color:MUTED,size:14})] }); }

function h1(text) { return new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:200,after:60},
  children:[tr(text,{bold:true,size:28,color:NAVY})] }); }
function h2(text) { return new Paragraph({ heading:HeadingLevel.HEADING_2, spacing:{before:220,after:80},
  children:[tr(text,{bold:true,size:22,color:NAVY})] }); }
function h3(text) { return new Paragraph({ heading:HeadingLevel.HEADING_3, spacing:{before:160,after:40},
  children:[tr(text,{bold:true,size:19,color:SLATE})] }); }

// =============== Build the report ===============
const children = [
  // ----- Header -----
  new Paragraph({ spacing:{after:0,line:240}, children:[tr("INSTITUTIONAL TECHNICAL ANALYSIS · COMPANY UPDATE", {bold:true,size:14,color:MUTED})] }),
  new Paragraph({ spacing:{after:60}, children:[tr("META PLATFORMS, INC. (NASDAQ: META)", {bold:true,size:36,color:NAVY})] }),
  new Paragraph({ spacing:{after:60}, children:[tr("Daily-bar Technical Study — 2 Years + 1 Quarter (Jan 2024 → Apr 30, 2026)", {bold:true,size:24,color:SLATE})] }),
  new Paragraph({ spacing:{after:200}, tabStops:[{type:TabStopType.RIGHT, position:9360}], children:[
    tr("Author: Rahul Yalamanchili · Coverage: Internet/Mega-cap Platforms", {color:MUTED,size:16}),
    tr("\tReport date: May 8, 2026", {color:MUTED,size:16}),
  ]}),

  // ----- Stance band -----
  new Table({ width:{size:9360, type:WidthType.DXA}, columnWidths:[3120,3120,3120],
    rows:[ new TableRow({ children:[
      new TableCell({ borders:allBorders, width:{size:3120, type:WidthType.DXA},
        shading:{fill:"E8F5E9",type:ShadingType.CLEAR}, margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Long-term fundamental: ",{color:MUTED,bold:true,size:13}), tr("BULLISH",{bold:true,size:18,color:MINT})] })] }),
      new TableCell({ borders:allBorders, width:{size:3120, type:WidthType.DXA},
        shading:{fill:"FFEDED",type:ShadingType.CLEAR}, margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Short-term technical: ",{color:MUTED,bold:true,size:13}), tr("BEARISH",{bold:true,size:18,color:RED})] })] }),
      new TableCell({ borders:allBorders, width:{size:3120, type:WidthType.DXA},
        shading:{fill:"FFF7ED",type:ShadingType.CLEAR}, margins:cellPad,
        children:[new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:0},
          children:[tr("Resolution: ",{color:MUTED,bold:true,size:13}), tr("Two horizons, not contradictory",{bold:true,size:14,color:AMBER})] })] }),
    ]})]
  }),
  new Paragraph({ spacing:{before:80, after:40} }),

  // ----- 1. Executive Summary -----
  h1("1. Executive Summary"),
  pRich([
    { text:"The daily technical structure on META is " },
    { text:"clearly bearish in the short term", bold:true, color:RED },
    { text:". As of the close on April 30, 2026 ($611.91), the stock is trading below all four primary moving averages (SMA 20 / 50 / 100 / 200 = $645 / $631 / $644 / $679), the bearish MA stack is fully formed (SMA 50 < SMA 100 < SMA 200), a death cross (SMA 50 cutting below SMA 200) printed on December 10, 2025, and the price is " },
    { text:"−23.15% off the August 15, 2025 52-week high of $796.25", bold:true },
    { text:" — formally a bear-market drawdown by the conventional 20% threshold." }
  ]),
  pRich([
    { text:"Megha's short-term bearish thesis is well-supported by the data. ", bold:true },
    { text:"Specifically: (1) a textbook " },
    { text:"head-and-shoulders top", bold:true, color:RED },
    { text:" formed between June and October 2025 (left shoulder $747, head $796, right shoulder $759), with the ~$700 neckline broken decisively in early December 2025 and the measured ~$604 target reached and overshot at the March 27, 2026 capitulation low of $520; (2) " },
    { text:"intermediate-trend lower highs and lower lows", bold:true },
    { text:" on every meaningful timeframe since August 2025; (3) " },
    { text:"ADX 23 with −DI 38.9 > +DI 25.0", bold:true },
    { text:" confirms a moderately-strong downtrend with bearish directional energy; (4) the recent April 30 earnings reaction was a " },
    { text:"−8.55% gap on 3.7× normal volume", bold:true },
    { text:" — institutional distribution stamping the recent recovery attempt." }
  ]),
  pRich([
    { text:"At the same time, the long-term uptrend " }, { text:"has not been broken at the multi-year level", bold:true, color:MINT },
    { text:". The SMA 200 ($679) is still above the close but is " }, { text:"only just starting to roll over", bold:true },
    { text:". OBV (cumulative volume flow) over the trailing 60 sessions is up +30.5M shares while price is down ~$57, an early bullish-divergence read suggesting accumulation at lower prices. RSI-14 at 41 is closer to neutral than oversold (and made a single-print 22.5 reading at the March low). The fundamental bull case remains intact (33% YoY revenue growth, 41% operating margin, MCS 0.96 — see prior research note). " }
  ]),
  pRich([
    { text:"Resolution: ", bold:true },
    { text:"these views are not contradictory. They address different time horizons. META can be — and on the present evidence " },
    { text:"is", bold:true, italics:true },
    { text:" — short-term technically bearish AND long-term fundamentally bullish. This is the classic technical-bear / fundamental-bull divergence that often produces a buyable correction inside a longer-term uptrend. The technical structure tells us " },
    { text:"the path", bold:true },
    { text:" — the fundamentals tell us " },
    { text:"the destination", bold:true },
    { text:". Today the path is down-sideways; the destination, if management's revenue and operating-income commitments hold, is materially higher 12–18 months out." }
  ]),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 2. Technical Dashboard -----
  h1("2. Technical Dashboard"),
  p("Single-page snapshot of every indicator computed in this study, as of the April 30, 2026 close.", { italics:true, color:MUTED, size:16 }),

  new Table({ width:{size:9360, type:WidthType.DXA}, columnWidths:[2400,1800,2200,2960],
    rows:[
      new TableRow({ children:[ thCell("Indicator",2400), thCell("Reading",1800), thCell("Status",2200), thCell("Interpretation",2960) ]}),
      new TableRow({ children:[ tdCell("Last close",2400,{bold:true}), tdCell("$611.91",1800,{bold:true}), tdCell("Apr 30, 2026",2200,{color:MUTED}), tdCell("−23.15% from 52-week high of $796.25 (Aug 15, 2025)",2960)]}),
      new TableRow({ children:[ tdCell("SMA 20",2400), tdCell("$645.34",1800), tdCell("Below",2200,{color:RED,bold:true}), tdCell("Close 5.18% below; short-term trend negative",2960)]}),
      new TableRow({ children:[ tdCell("SMA 50",2400), tdCell("$631.04",1800), tdCell("Below",2200,{color:RED,bold:true}), tdCell("Close 3.03% below; intermediate trend negative",2960)]}),
      new TableRow({ children:[ tdCell("SMA 100",2400), tdCell("$644.42",1800), tdCell("Below",2200,{color:RED,bold:true}), tdCell("Close 5.05% below",2960)]}),
      new TableRow({ children:[ tdCell("SMA 200",2400), tdCell("$678.75",1800), tdCell("Below",2200,{color:RED,bold:true}), tdCell("Close 9.85% below; long-term trend pressured but SMA 200 still positively-sloped",2960)]}),
      new TableRow({ children:[ tdCell("EMA 8 / EMA 21",2400), tdCell("$656 / $647",1800), tdCell("Below both",2200,{color:RED,bold:true}), tdCell("Faster MAs flipped down post-earnings",2960)]}),
      new TableRow({ children:[ tdCell("Death cross (50/200)",2400), tdCell("Dec 10, 2025",1800,{color:RED}), tdCell("Active",2200,{color:RED,bold:true}), tdCell("Last golden cross was Jun 16, 2025; current bearish stack: SMA50 < SMA100 < SMA200",2960)]}),
      new TableRow({ children:[ tdCell("RSI (14)",2400), tdCell("41.39",1800), tdCell("Neutral-bearish",2200,{color:AMBER,bold:true}), tdCell("Not yet oversold (<30); momentum negative not exhausted",2960)]}),
      new TableRow({ children:[ tdCell("MACD (12,26,9)",2400), tdCell("11.28 / signal 13.42",1800), tdCell("Bearish cross",2200,{color:RED,bold:true}), tdCell("Histogram flipped to −2.14 on April 30; first negative print in two months",2960)]}),
      new TableRow({ children:[ tdCell("Stochastic (14,3) %K / %D",2400), tdCell("13.0 / 50.1",1800), tdCell("Oversold short-term",2200,{color:MINT,bold:true}), tdCell("Fresh down-cross; %K oversold, but %D still elevated — early bounce risk both ways",2960)]}),
      new TableRow({ children:[ tdCell("ADX (14)",2400), tdCell("22.96",1800), tdCell("Trending",2200,{color:AMBER,bold:true}), tdCell("Above the 20 'trending' threshold; growing not exhausted",2960)]}),
      new TableRow({ children:[ tdCell("+DI / −DI (14)",2400), tdCell("24.97 / 38.88",1800), tdCell("Bearish",2200,{color:RED,bold:true}), tdCell("−DI dominance; directional energy is to the downside",2960)]}),
      new TableRow({ children:[ tdCell("ATR (14)",2400), tdCell("$21.54",1800), tdCell("Expanding",2200,{color:AMBER,bold:true}), tdCell("+16% above 1-year ATR average ($18.55); volatility regime elevated",2960)]}),
      new TableRow({ children:[ tdCell("OBV (60-day Δ)",2400), tdCell("+30.5M sh",1800), tdCell("Bullish divergence",2200,{color:MINT,bold:true}), tdCell("Cumulative volume up while price down −$57; suggests accumulation at lower prices",2960)]}),
      new TableRow({ children:[ tdCell("Distribution / Accumulation (last 25)",2400), tdCell("3 dist / 5 acc",1800), tdCell("Mixed",2200,{color:AMBER}), tdCell("Most recent distribution day: April 30 −8.55% / 3.7× volume — single largest down-day volume in dataset",2960)]}),
      new TableRow({ children:[ tdCell("52-week range",2400), tdCell("$520 — $796",1800), tdCell("Mid-band",2200,{color:AMBER}), tdCell("Currently 33% off the low / 23% off the high",2960)]}),
      new TableRow({ children:[ tdCell("Bollinger band (20, 2σ)",2400), tdCell("$569 — $721",1800), tdCell("Within band",2200,{color:AMBER}), tdCell("Width $151.83 — wide, reflecting elevated vol",2960)]}),
    ]
  }),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 3. Trend Structure Analysis -----
  h1("3. Trend Structure Analysis"),

  h3("Primary trend (200-day frame)"),
  pRich([
    { text:"Up through August 2025; turning down. ", bold:true },
    { text:"From the Jan 2024 low of ~$340 to the August 2025 high of $796, META compounded at a CAGR north of 60%. The SMA 200 inflected positively in March 2024 and remained positively-sloped through the Q3 2025 print. The post-earnings October 2025 sell-off (−15.4% over five sessions) marked the first material break of trend, and the December 10, 2025 death cross of SMA 50 below SMA 200 is the cleanest single signal that the long-term tape has lost its uptrend bias. " },
    { text:"The SMA 200 has not yet rolled over to a clearly negative slope", italics:true },
    { text:", but the price has moved decisively below it. Long-term trend reads " },
    { text:"NEUTRAL with bearish bias", bold:true, color:AMBER },
    { text:"." }
  ]),

  h3("Intermediate trend (50-day frame)"),
  pRich([
    { text:"Bearish. ", bold:true, color:RED },
    { text:"Lower swing highs since August 2025: $796 (Aug 15) → $791 (Sep 19) → $759 (Oct 29) → $744 (Jan 29, 2026) → $691 (Apr 17, 2026). Lower swing lows: $699 (Oct 14) → $581 (Nov 19) → $521 (Mar 27, 2026). The Oct 2025 break of trend was confirmed by the December death cross. SMA 50 ($631) is now below SMA 100 ($644) and SMA 200 ($679) — a textbook bearish stack." }
  ]),

  h3("Short-term trend (20-day frame)"),
  pRich([
    { text:"Repaired briefly, then broken again. ", bold:true },
    { text:"Between March 27 (the $520 low) and April 17 ($691) the price reclaimed the SMA 20 and the SMA 50, and a near-term bullish 20/50 cross printed on April 27. The April 30 −8.55% earnings gap reversed all of that in a single session, putting the price back below all four primary MAs and turning the short-term trend " },
    { text:"NEGATIVE", bold:true, color:RED },
    { text:". The April recovery now reads as a counter-trend rally that failed at the SMA 200 ($679 area) and the Fibonacci 38.2% retrace ($691)." }
  ]),

  h3("Higher-highs / lower-highs structure"),
  bul("June 2024 → June 2025: progression of higher highs and higher lows — primary uptrend intact."),
  bul("June 2025 → August 2025: parabolic finish; final HH at $796 on August 15."),
  bul("August 2025 → present: every subsequent swing high has been LOWER than the prior one ($796 → $791 → $759 → $744 → $691). This is an unambiguous lower-high sequence."),
  bul("On the lows: $699 → $581 → $521 (also a lower-low sequence). The March 27 low of $520 is the operative bear-trend pivot."),

  h3("Trend continuation vs reversal"),
  pRich([
    { text:"At the present moment the technical evidence weighs " },
    { text:"more toward continuation than reversal", bold:true, color:RED },
    { text:". The April 30 sell-off occurred from below the SMA 200 (i.e., not from an exhaustion top). For continuation to fail, the price needs to: (i) reclaim the SMA 50 ($631) on closing basis, (ii) print a higher swing high above $691, and (iii) close above the SMA 200 ($679) — the line that defines the long-term trend. " },
    { text:"None of these conditions are met today.", bold:true }
  ]),

  image('02_price_ma_2y.png', 6.6, 3.4),
  caption("Figure 1. Two-year price vs MA stack. Golden cross (Jun 16, 2025) preceded the parabolic move into August; the December 10, 2025 death cross has been the active bearish signal since."),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 4. Momentum Analysis -----
  h1("4. Momentum & Trend-Strength Analysis"),

  h3("RSI (14)"),
  pRich([
    { text:"Latest 41.39. ", bold:true },
    { text:"RSI is in the lower-half neutral zone — momentum is negative but not yet capitulatory. The most recent oversold print was 22.5 at the March 27 low (a deep washout). Since then the RSI has rallied to a peak of 73.8 on January 29, 2026 (overbought into the Q4 2025 print) and pulled back. " },
    { text:"There is no bullish divergence between price and RSI yet", bold:true },
    { text:" — both made fresh lows in March, and on the most recent decline the RSI has rolled over without reaching oversold." }
  ]),

  h3("MACD (12, 26, 9)"),
  pRich([
    { text:"Bearish cross printed on April 30. ", bold:true, color:RED },
    { text:"Heading into the print, MACD line was at 17.59 with the signal at 12.33 and a positive histogram. The −8.55% earnings gap collapsed the MACD line to 11.28 vs signal 13.42 — first negative histogram print in two months. The signal line still has positive slope; a follow-through next-week close near current levels will roll the signal line down and confirm the bearish cross." }
  ]),

  h3("Stochastic Oscillator (14, 3)"),
  pRich([
    { text:"%K crashed to 13.0 (oversold); %D still at 50.1. ", bold:true },
    { text:"Fresh oversold print without a confirming %D move. Pure mechanical reading: oversold from a one-day shock, " },
    { text:"not", italics:true },
    { text:" a multi-session bottoming process. Either of two paths from here: a 1–3 day relief bounce (if buyers step in at $580–600), or a continuation lower with %K pinned in oversold for several sessions before any meaningful rally." }
  ]),

  h3("ADX / DMI (14)"),
  pRich([
    { text:"ADX 22.96. ", bold:true },
    { text:"Above the conventional 20 threshold for a 'trending' regime, but well below the 40+ threshold of a powerful trend. " },
    { text:"−DI 38.88 vs +DI 24.97", bold:true, color:RED },
    { text:" tells us directional energy is decisively to the downside. ADX has been rising over the last week (was 18 in early April), suggesting the trend is " },
    { text:"strengthening, not exhausting", bold:true },
    { text:". This is bearish-weighted." }
  ]),

  image('01_master_dashboard.png', 6.6, 6.0),
  caption("Figure 2. Master technical dashboard — candles with SMAs and S/R levels, volume, RSI-14, MACD, ADX/DMI. The April 30 break is visible on every panel simultaneously — a 'one-day decisive break' across price, momentum, and volume."),

  h3("Bullish vs bearish divergences"),
  bul("No price-RSI divergence at the recent lows — March 27 low at $520 with RSI 22.5 vs Jan 20 low at $604 with RSI 31.6. Both price and RSI made fresh lows together; this is consistent with continuation, not reversal."),
  bul("Subtle bullish OBV divergence over the trailing 60 sessions: price down ~$57 while OBV is up +30.5M shares cumulative. This is the only meaningful bullish technical signal in the entire study, and it is a longer-frame signal — typically takes weeks of higher closes to confirm."),
  bul("No bearish RSI divergence at the August $796 high — RSI was 70+ on the print but has since collapsed in line with price."),

  h3("Momentum exhaustion signals"),
  pRich([
    { text:"Mixed. ", bold:true },
    { text:"The April 30 −8.55% drop on 3.7× normal volume is the kind of 'climactic distribution day' that sometimes marks the bottom of corrections — but it is also the kind of bar that breaks intermediate-term trends. The RSI did not reach the 22-25 territory where capitulation is more reliably called. We need to see one of two things to call exhaustion: (i) a higher-low close above $580 within 5–10 sessions, or (ii) an even-deeper RSI reading (20 or below) with positive divergence." }
  ]),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 5. Volume & Institutional Activity -----
  h1("5. Volume & Institutional Activity"),
  image('05_obv_volume.png', 6.6, 4.0),
  caption("Figure 3. Price vs On-Balance Volume (top) and daily volume distribution (bottom). OBV trend has held up better than price — early bullish divergence."),

  h3("Volume regime"),
  pRich([
    { text:"April 30, 2026 saw " },
    { text:"52.76M shares change hands — the single-largest down-day volume in the entire 2-year-plus dataset", bold:true, color:RED },
    { text:". 20-day average volume entering the print was ~14M shares, so the day was a 3.7× volume event. Earnings days are typically 2–3× volume; this is at the high end and on the down side." }
  ]),

  h3("Distribution / accumulation balance"),
  bul("Last 25 trading sessions: 3 distribution days vs 5 accumulation days — net mixed but the 3 distribution days are concentrated around earnings (April 29 / 30) and the March 27 capitulation low."),
  bul("Most consequential distribution events: October 30, 2025 (Q3 2025 print, −11.3% on 7.2× volume) and April 30, 2026 (Q1 2026 print, −8.55% on 3.7× volume). Two distribution events of this magnitude inside six months is a clear institutional-distribution signal at the multi-month level."),
  bul("Counter-evidence: the cluster of accumulation days in early April (4/8 +6.5% on 32M, 4/9 +2.6% on 19M, 4/14 +4.4% on 17.8M) shows real buying interest at the $570–680 zone — exactly the area the price is now retesting."),

  h3("OBV trend"),
  pRich([
    { text:"OBV is rising on the trailing 60-day window (+30.5M cumulative net buying) while price has fallen ~$57. " },
    { text:"This is a positive volume-flow divergence", bold:true, color:MINT },
    { text:" and — at the longer time scale — typically resolves either by price catching up to OBV (bullish) or by OBV rolling over to confirm price (bearish). Today's evidence has not yet resolved this, but the OBV reading is the single most-bullish technical line in the study." }
  ]),

  // ----- 6. Support / Resistance -----
  h1("6. Support & Resistance Analysis"),
  image('08_key_levels.png', 6.6, 3.6),
  caption("Figure 4. Last 6 months — key levels, EMAs, current position. The current $611 close is sandwiched between the $626 Fib 61.8% pivot above and the $580 Fib 78.6% support below."),

  h3("Resistance levels (above current price)"),
  bul("$625.69 — Fibonacci 61.8% retrace of the $520 → $796 swing; converges with SMA 50 ($631). Critical near-term pivot. Closing above breaks the immediate selling pressure."),
  bul("$645 — SMA 20."),
  bul("$658.25 — Fibonacci 50% retrace; aligned with the Bollinger mid-line."),
  bul("$678.75 — SMA 200. Most important resistance in the entire study. A weekly close above this level reverses the long-term trend question."),
  bul("$690.82 — Fibonacci 38.2% retrace; aligned with the April 17 lower-high pivot."),
  bul("$731.12 — Fibonacci 23.6% retrace; entry to the 'broken neckline' zone."),
  bul("$796.25 — 52-week high (August 15, 2025). Multi-year resistance."),

  h3("Support levels (below current price)"),
  bul("$579.32 — Fibonacci 78.6% retrace; lower Bollinger band ($569). First meaningful support."),
  bul("$548–558 — March 26 / 30 / 31 cluster — a potential 'bear-flag' base."),
  bul("$520.26 — 52-week low (March 27, 2026). Critical structural support — a break here opens price discovery to..."),
  bul("$479.80 — April 21, 2025 swing low; the next major reference level. A move there would be a −38% drawdown from the August high."),

  h3("Pivot levels (next session daily pivots, computed from Apr 29 OHLC)"),
  bul("R2 $689 / R1 $682 / Pivot $669 / S1 $662 / S2 $649 — useful for tactical entries on a relief bounce, not for thesis-level analysis."),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 7. Pattern Analysis -----
  h1("7. Pattern Recognition"),
  image('07_pattern_headshoulders.png', 6.6, 3.5),
  caption("Figure 5. Head-and-Shoulders top, June–October 2025. Neckline at ~$700 broken in early December; measured target ~$604 was reached and exceeded at the March 27, 2026 low of $520."),

  h3("Head and Shoulders top — formed and resolved"),
  bul("Left shoulder: $747.90 (June 30, 2025)."),
  bul("Head: $796.25 (August 15, 2025)."),
  bul("Right shoulder: $759.16 (October 29, 2025)."),
  bul("Neckline: ~$700, broken decisively in early December 2025 (concurrent with the death cross)."),
  bul("Measured target: neckline − (head − neckline) = $700 − $96 = $604. Reached and exceeded at the March 27 low of $520."),
  pRich([
    { text:"Read: ", bold:true },
    { text:"the H&S has played out fully. Pattern-based bears have already collected. The question now is whether the post-target action is forming a base (bullish) or a continuation pattern (bearish). Today's evidence — a failed counter-trend rally back to the SMA 200 followed by a fresh distribution event — favors continuation framing for now." }
  ]),

  h3("Other candidate patterns"),
  bul("Descending channel (Aug 2025 → present): the lower-highs/lower-lows sequence forms a clean descending channel; current price near the channel midpoint."),
  bul("Bear flag (April 2 → April 27): the recovery from $574 to $691 traced a typical bear-flag rally — a 50% retrace of the prior leg down on declining volume — and the April 30 break is the textbook flag-failure signal."),
  bul("No bullish reversal patterns yet (no double bottom, no bullish wedge, no inverse H&S). The March 27 → April 17 leg up was a single-leg rally, not yet a base."),

  h3("Probability assessment"),
  bul("Bearish continuation (next 4–8 weeks): ~55% — supported by MA stack, ADX/DMI, recent distribution day."),
  bul("Sideways consolidation (next 4–8 weeks): ~30% — supported by OBV divergence, oversold stochastic, and the proximity of the strong $580 / $520 support cluster."),
  bul("Bullish reversal (next 4–8 weeks): ~15% — would require a 'V-shape' bottom from current levels; possible but not the base-rate path from this technical setup."),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 8. Volatility & Risk -----
  h1("8. Volatility & Risk Analysis"),
  image('04_atr_volatility.png', 6.6, 3.0),
  caption("Figure 6. ATR-14 trajectory over 2 years. Latest reading $21.54 is +16% above the 1-year average, reflecting the post-earnings volatility expansion."),

  h3("ATR / volatility regime"),
  pRich([
    { text:"ATR-14 = $21.54", bold:true },
    { text:" — about 16% above the trailing 1-year average of $18.55. Volatility has expanded but is " },
    { text:"not yet in a fear-spike regime", bold:true },
    { text:" (March 27 saw ATR ~$25, October 30, 2025 saw ATR ~$30). Bollinger band width has expanded to $151.83. The current regime is best described as 'elevated but stabilising' — actively bearish but not panicked." }
  ]),

  h3("Earnings-day gap behavior"),
  image('03_earnings_gaps.png', 6.6, 2.8),
  caption("Figure 7. Earnings-day gaps and full-day reactions across 9 calls. Recent prints (Q3 2025, Q1 2026) show larger downside reactions even on operationally-sound quarters."),

  bul("Of the last 9 earnings prints, 4 produced gap-down opens > −5% (Q1 2024, Q3 2024, Q3 2025, Q1 2026). The asymmetry is meaningful — META's gap-down magnitude has trended slightly larger than its gap-up magnitude."),
  bul("Gap-and-fade vs gap-and-go: 6 of 9 prints saw a 'fade' from open to close (close < open on the post-print day); the recent April 30 was a continuation drop (close further below open), which is more bearish than a typical fade."),
  bul("Volume reaction: average volume on the day-after-earnings = 3.6× prior 20-day avg. The post-print 'tape verdict' is therefore high-quality information — the market has high engagement and high information density on these days."),

  h3("Are expectations priced in?"),
  pRich([
    { text:"Largely yes for the bull case. ", bold:true },
    { text:"At $611, META trades at roughly 17× FY 2026 consensus EPS (post-tax-true-up adjusted) — well below where it traded in August 2025 at $796 (~22× the same number). The April 30 reaction tells us the market is " },
    { text:"NOT yet fully discounting", italics:true, bold:true },
    { text:" the higher-end FY 2026 capex range — that downside risk is still live. Operating-margin compression of even 100 bps from current levels would compress NI roughly $2.5B annualized, materially shifting earnings expectations." }
  ]),

  h3("Technical risk read"),
  pRich([
    { text:"Increasing in the immediate term, stabilizing on a 1–2 month view. " },
    { text:"The next 5–10 sessions are the highest-risk window — a close below $580 opens $520 retest; a rally back above $658 invalidates the immediate bearish setup. After that window, we expect either (i) a base building between $580–625 (consolidation thesis) or (ii) a deeper retest into the $480–520 zone (deep-bear thesis). Both paths are 'inside' the long-term uptrend if the SMA 200 ($679) is reclaimed within 90 days." }
  ]),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- 9. Multi-timeframe interpretation -----
  h1("9. Multi-Timeframe Interpretation"),
  new Table({ width:{size:9360, type:WidthType.DXA}, columnWidths:[2200,2200,2480,2480],
    rows:[
      new TableRow({ children:[ thCell("Timeframe",2200), thCell("Read",2200), thCell("Key levels",2480), thCell("Bias",2480) ]}),
      new TableRow({ children:[ tdCell("Short-term (days–2 weeks)",2200,{bold:true}),
        tdCell("BEARISH",2200,{bold:true,color:RED}),
        tdCell("Resistance: $626 / $645 / $658\nSupport: $580 / $548 / $520",2480,{size:14}),
        tdCell("Sell rallies into resistance; cover at $580 cluster",2480,{size:14, color:RED}) ]}),
      new TableRow({ children:[ tdCell("Medium-term (1–3 months)",2200,{bold:true}),
        tdCell("BEARISH-BIAS CONSOLIDATION",2200,{bold:true,color:AMBER}),
        tdCell("Resistance: SMA 200 $679 / Fib 38.2% $691\nSupport: $520 (52w low) / $479 (April 2025 low)",2480,{size:14}),
        tdCell("Range-trade $580–680 until SMA 200 reclaimed or $520 lost",2480,{size:14, color:AMBER}) ]}),
      new TableRow({ children:[ tdCell("Long-term (6–18 months)",2200,{bold:true}),
        tdCell("BULLISH (with caveat)",2200,{bold:true,color:MINT}),
        tdCell("Resistance: $796 (52w high) / $850 measured\nSupport: SMA 200 $679 / $520 critical",2480,{size:14}),
        tdCell("Long bias intact unless $520 broken AND fundamentals deteriorate",2480,{size:14, color:MINT}) ]}),
    ]
  }),
  pRich([
    { text:"The above resolves Megha's question directly: ", bold:true },
    { text:"the short-term (days–weeks) and medium-term (1–3 months) tapes are bearish-leaning, but the long-term (6–18 months) trend has not yet broken. " },
    { text:"A bear in the short term and a bull in the long term are both correct.", bold:true, italics:true }
  ], { before: 80 }),

  // ----- 10. Final Conclusion -----
  h1("10. Final Technical Verdict"),

  h3("1. Is META technically bearish in the short term?"),
  pRich([{ text:"Yes — clearly. ", bold:true, color:RED },
    { text:"Below all four primary MAs, bearish stack, active death cross, fresh MACD bearish cross, ADX 23 with −DI dominance, post-earnings 3.7× distribution day, head-and-shoulders top fully resolved, lower-high / lower-low structure since August 2025." }]),

  h3("2. Is the longer-term uptrend still intact?"),
  pRich([{ text:"Just barely. ", bold:true, color:AMBER },
    { text:"The SMA 200 ($679) has not yet rolled over to a clearly negative slope and the 52-week low ($520) has not been broken. OBV (cumulative volume flow) is positive over the trailing 60 sessions. The fundamental thesis (bullish — see prior research note) supports an eventual return to the long-term uptrend. The window is narrowing but not yet shut." }]),

  h3("3. What technical evidence supports Megha's bearish short-term thesis?"),
  bul("Death cross of SMA 50 below SMA 200 on December 10, 2025 — still active."),
  bul("Bearish MA stack: SMA 50 ($631) < SMA 100 ($644) < SMA 200 ($679)."),
  bul("Lower-high sequence: $796 → $791 → $759 → $744 → $691 (5 declining peaks since August 2025)."),
  bul("Lower-low sequence: $699 → $581 → $521."),
  bul("Head-and-shoulders top with neckline broken in December and measured target reached at the March low."),
  bul("ADX 22.96 with −DI 38.9 > +DI 25.0 — directional energy bearish and strengthening."),
  bul("Post-earnings −8.55% on 3.7× volume — the largest down-day volume in the dataset."),
  bul("23% drawdown from 52-week high — formally a bear-market move."),

  h3("4. What would invalidate the bearish thesis?"),
  bul("Daily close above $658 (Fibonacci 50%, Bollinger mid-line) — would break the bear-flag and put the SMA 200 in play."),
  bul("Daily close above $679 (SMA 200) — primary trend signal flips back to neutral."),
  bul("Weekly close above $691 (Fibonacci 38.2% / April 17 swing high) — confirms higher-high break and resumes the longer uptrend."),
  bul("MACD bullish cross with histogram > 0 for 5+ consecutive sessions — momentum reversal confirmation."),
  bul("OBV continuing to rise and price catching up — would resolve the current divergence to the upside."),

  h3("5. What price levels are critical?"),
  new Table({ width:{size:9360, type:WidthType.DXA}, columnWidths:[2200,1800,2400,2960],
    rows:[
      new TableRow({ children:[ thCell("Level",2200), thCell("Price",1800), thCell("Type",2400), thCell("Significance",2960) ]}),
      new TableRow({ children:[ tdCell("Bull-trigger",2200,{color:MINT,bold:true}), tdCell("$679",1800,{bold:true}), tdCell("SMA 200 reclaim",2400), tdCell("Long-term trend recapture; would invalidate bear thesis",2960)]}),
      new TableRow({ children:[ tdCell("Near-term pivot",2200), tdCell("$626",1800,{bold:true}), tdCell("SMA 50 / Fib 61.8%",2400), tdCell("Closing above breaks immediate selling pressure",2960)]}),
      new TableRow({ children:[ tdCell("Current",2200), tdCell("$611.91",1800,{bold:true,color:NAVY}), tdCell("Last close",2400), tdCell("Apr 30, 2026",2960)]}),
      new TableRow({ children:[ tdCell("First support",2200,{color:AMBER}), tdCell("$579",1800,{bold:true}), tdCell("Fib 78.6% / lower BB",2400), tdCell("First buy-zone for tactical longs",2960)]}),
      new TableRow({ children:[ tdCell("Critical support",2200,{color:RED,bold:true}), tdCell("$520",1800,{bold:true,color:RED}), tdCell("52-week low",2400), tdCell("Break opens $480 retest; structural break of long-term trend",2960)]}),
      new TableRow({ children:[ tdCell("Bear extension",2200,{color:RED}), tdCell("$480",1800,{bold:true,color:RED}), tdCell("April 2025 swing low",2400), tdCell("−38% drawdown level; long-term trend confirmed broken",2960)]}),
    ]
  }),

  // ----- Bull vs Bear scenario -----
  h2("Bull vs Bear Scenario — Next 90 Days"),
  h3("Bull scenario (probability ~30%)"),
  bul("$579-580 holds as support → consolidation between $580 and $658."),
  bul("OBV divergence resolves with price catching up; MACD bullish cross within 4 weeks."),
  bul("Reclaim of SMA 50 ($631) and SMA 200 ($679) by end of June 2026."),
  bul("Target: $691 (Fib 38.2%) → $731 (Fib 23.6%) → $796 retest by Q3 2026."),

  h3("Base scenario (probability ~45%)"),
  bul("Range-trade between $548 and $658 for 4–8 weeks while the post-earnings shock is digested."),
  bul("ADX subsides toward 18–20 (loss of trend strength); RSI oscillates 35–55."),
  bul("Resolution catalyst: Q2 2026 earnings (~late July) — a beat-and-raise reignites the bull case; an in-line print continues the consolidation."),

  h3("Bear scenario (probability ~25%)"),
  bul("$580 fails on closing basis within 2 weeks → momentum acceleration to $520 retest."),
  bul("$520 breaks → $480 (April 2025 low) becomes the next reference; full give-back of the 2024 second-half rally."),
  bul("Triggers: a Q2 2026 capex re-raise (above $145B) and/or a meaningful FY 2026 OI > FY 2025 OI commitment walk-back."),

  new Paragraph({ children:[new PageBreak()] }),

  // ----- Final answer -----
  h1("Final Technical Verdict"),
  pRich([
    { text:"\"Can META remain fundamentally bullish long term while becoming technically bearish in the short term?\" — ", italics:true },
    { text:"Yes, and that is precisely the situation today.", bold:true, color:NAVY }
  ]),
  pRich([
    { text:"Stance summary by time horizon:" }
  ]),
  bulRich([{ text:"Short-term (days–2 weeks): ", bold:true }, { text:"BEARISH ", bold:true, color:RED },
    { text:"— sell rallies into $626–658 resistance; buy-zone for tactical longs at $580 with stop below $520." }]),
  bulRich([{ text:"Medium-term (1–3 months): ", bold:true }, { text:"BEARISH-LEANING CONSOLIDATION ", bold:true, color:AMBER },
    { text:"— range-trade $580–680 until SMA 200 is reclaimed or $520 is decisively broken. Q2 2026 earnings (~late July 2026) is the catalyst." }]),
  bulRich([{ text:"Long-term (6–18 months): ", bold:true }, { text:"BULLISH ", bold:true, color:MINT },
    { text:"— fundamentals are accelerating (revenue +33% YoY, operating margin >40%, MCS 0.96), management's FY 2026 OI > FY 2025 OI commitment is intact, the long-term uptrend has not broken structurally. The technical correction in progress is a path-shape inside a longer bull case." }]),
  pRich([
    { text:"Risk-managed implementation: ", bold:true },
    { text:"For position sizing, treat any tactical long inside $580 ± $20 with a hard stop below $520 (52-week low). Build core long exposure progressively only after a daily close reclaims $679 (SMA 200). Until then, the technical structure does not support adding new size — but the fundamental case remains the reason to own the name on a 12–18-month horizon." }
  ]),

  // ----- Appendix -----
  new Paragraph({ children:[new PageBreak()] }),
  h1("Appendix — Methodology & Source References"),
  h3("Data source"),
  bul("Daily OHLCV: META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx — 584 trading sessions from January 2, 2024 through April 30, 2026."),
  h3("Indicators (parameters and formulas)"),
  bul("Simple moving averages: SMA(20), SMA(50), SMA(100), SMA(200) on close."),
  bul("Exponential moving averages: EMA(8), EMA(21) on close."),
  bul("RSI(14): Wilder smoothing, ratio of average gains over average losses, scaled 0–100."),
  bul("MACD(12, 26, 9): EMA(12) − EMA(26); signal = EMA(9) of MACD; histogram = MACD − signal."),
  bul("Stochastic(14, 3): %K = 100·(close − low14) / (high14 − low14); %D = 3-period SMA of %K."),
  bul("ATR(14): Wilder-smoothed true range over 14 sessions."),
  bul("ADX(14) / DMI: directional movement index with Wilder smoothing; +DI / −DI from upward / downward movement scaled by ATR."),
  bul("OBV: cumulative sign(close-Δ) × volume."),
  bul("Bollinger Bands: SMA(20) ± 2 × rolling standard deviation."),
  bul("Pivot levels (next-session): conventional formula from prior-day OHLC."),
  h3("Fibonacci retracement reference points"),
  bul("Anchored to the 52-week swing: low $520.26 (March 27, 2026) → high $796.25 (August 15, 2025); range $275.99."),
  bul("Levels used: 23.6% ($731.12), 38.2% ($690.82), 50% ($658.25), 61.8% ($625.69), 78.6% ($579.32)."),
  h3("Pattern-detection methodology"),
  bul("Swing highs/lows identified by 5-bar fractal: bar i is a swing high if its high is the strict maximum in the [i−5, i+5] window."),
  bul("Head-and-shoulders confirmation requires a clean neckline break on closing basis with at least one follow-through close below."),
  bul("Distribution day = close down >0.2% on volume above 20-day average. Accumulation day = close up >0.2% on volume above 20-day average."),
  pRich([
    { text:"Disclaimer: ", bold:true, italics:true, color:MUTED, size:14 },
    { text:"This is a technical-analysis study of disclosed price/volume data. It is not a buy/sell recommendation or personalized investment advice. Technical indicators describe past price behaviour and provide probabilistic context for future moves; they do not guarantee outcomes. Combine with fundamental analysis and personal risk tolerance. Consult a licensed financial advisor before making investment decisions.", italics:true, color:MUTED, size:14 }
  ], { before:200 }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font:"Calibri", size:18 } } },
    paragraphStyles: [
      { id:"Heading1", name:"Heading 1", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:28, bold:true, font:"Calibri", color:NAVY },
        paragraph:{ spacing:{ before:200, after:60 }, outlineLevel:0 } },
      { id:"Heading2", name:"Heading 2", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:22, bold:true, font:"Calibri", color:NAVY },
        paragraph:{ spacing:{ before:220, after:80 }, outlineLevel:1 } },
      { id:"Heading3", name:"Heading 3", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:19, bold:true, font:"Calibri", color:SLATE },
        paragraph:{ spacing:{ before:160, after:40 }, outlineLevel:2 } },
    ]
  },
  numbering: { config: [{ reference:"bul",
    levels:[{ level:0, format:LevelFormat.BULLET, text:"•", alignment:AlignmentType.LEFT,
      style:{ paragraph:{ indent:{ left:360, hanging:220 } } } }] }] },
  sections: [{
    properties: { page: { size:{ width:12240, height:15840 },
      margin:{ top:1080, right:1080, bottom:1080, left:1080 } } },
    headers: { default: new Header({ children:[ new Paragraph({ spacing:{after:0,line:200},
      children:[ tr("META · Daily Technical Study (2y + 1Q) · Institutional Research", {bold:true,size:14,color:NAVY}) ] }) ] }) },
    footers: { default: new Footer({ children:[new Paragraph({
      tabStops:[{type:TabStopType.RIGHT, position:9360}],
      spacing:{after:0, line:200},
      children:[
        tr("Source: META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx · Indicators computed by Claude · Generated May 8, 2026", {size:13, color:MUTED}),
        tr("\tPage ", {size:13, color:MUTED}),
        new TextRun({ children:[PageNumber.CURRENT], size:13, color:MUTED, font:"Calibri" }),
      ] })] }) },
    children,
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/META_Technical_Analysis_Report.docx';
  fs.writeFileSync(out, buf);
  console.log('Wrote', out, 'size=', buf.length);
});
