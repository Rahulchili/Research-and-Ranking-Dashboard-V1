
// ========================================================================
// AMD Page Rendering Functions (added in AMD build pass)
// ========================================================================

function amdSummaryPage() {
  const n = DATA.narratives['AMD'];
  const c = DATA.companies['AMD'];
  return `
    ${reportHero({
      kicker:'EXECUTIVE SUMMARY',
      title:'AMD — One-page forward view',
      subtitle: n.summary,
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      download:'../AMD_Executive_Summary.docx',
      badges: [
        { label:'Forward view', value:'BULLISH', color:'var(--mint)', sub:'6–12 month horizon (with timing caution)' },
        { label:'MCS (info-adj)', value: fmtN(c.mcs_information_adjusted), sub:'8 of 8 quarterly revenue beats since Q2 24' },
        { label:'Latest revenue YoY', value:'+37.85%', color:'var(--mint)', sub:'Q1 2026 print — strongest in dataset' },
        { label:'Risk to monitor', value:'62× FY1 P/E', color:'var(--amber)', sub:'+64% premium to semi peer median' },
      ],
      dataSource:'SEC EDGAR XBRL · 8 AMD transcripts · Barchart daily OHLCV · FactSet peer multiples (5/8/26)'
    })}
    ${reportSection('Bull case', `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
      ${n.bull.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);font-weight:700;">+</span><span>${b}</span></li>`).join('')}
    </ul>`, { titleStyle:'color:var(--mint);' })}
    ${reportSection('Bear case', `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
      ${n.bear.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);font-weight:700;">−</span><span>${b}</span></li>`).join('')}
    </ul>`, { titleStyle:'color:var(--crimson);' })}
    ${reportSection('What would change the call', `
      <h4 style="margin:0 0 8px 0;color:var(--mint);font-size:13px;">Upgrade triggers</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">
        ${n.trigger_up.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);">▲</span><span>${t}</span></li>`).join('')}
      </ul>
      <h4 style="margin:0 0 8px 0;color:var(--crimson);font-size:13px;">Downgrade triggers</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        ${n.trigger_down.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);">▼</span><span>${t}</span></li>`).join('')}
      </ul>`)}
    ${reportSection('Scoreboard', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Baseline','Latest','Change'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${n.scoreboard.map(r=>`<tr>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);">${r.metric}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${r.baseline}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:600;">${r.latest}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">${r.change}</td>
          </tr>`).join('')}
        </tbody>
      </table>`)}
    ${reportSection('Bottom line', `
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0 0 10px 0;">${n.bottom_line||''}</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0;"><b>Stance: <span style="color:${STANCE_COLOR[n.color]||'var(--text)'};">${(n.stance||'').toUpperCase()}</span></b>, with valuation premium and parabolic technical setup as the explicit risks to verify.</p>
      ${n.disclaimer ? `<div style="margin-top:14px;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);"><span style="font-size:11px;color:var(--muted);font-style:italic;line-height:1.55;"><b>Disclaimer:</b> ${n.disclaimer}</span></div>` : ''}
    `, { style:'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);' })}`;
}

function amdFundamentalPage() {
  const c = DATA.companies['AMD'];
  const toc = [
    { id:'amd-fa-overview', label:'Overview' },
    { id:'amd-fa-comparison', label:'Comparison table' },
    { id:'amd-fa-validation', label:'Revenue growth trajectory' },
    { id:'amd-fa-charts', label:'Charts' },
    { id:'amd-fa-commentary', label:'Mgmt commentary' },
    { id:'amd-fa-interpretation', label:'Institutional interpretation' },
    { id:'amd-fa-outlook', label:'Forward outlook' },
  ];
  return `
    ${reportHero({
      kicker:'FUNDAMENTAL — Q4 2025 vs Q1 2026',
      title:'AMD — Quarter-to-Quarter Comparative Analysis',
      subtitle:'Detailed financial comparison, revenue-growth trajectory, management-commentary review, institutional interpretation, and forward outlook.',
      barColor:'var(--accent)',
      download:'../AMD_Q4_2025_vs_Q1_2026_Institutional_Report.docx',
      badges: [
        { label:'Q1 2026 verdict', value:'Beat & Raise', color:'var(--accent)', sub:'Revenue +37.85% YoY · +4.62% vs guide mid' },
        { label:'Operating margin', value:'14.40%', color:'var(--mint)', sub:'Q1 2026 (vs 17.06% Q4 25 record)' },
        { label:'EPS reported', value:'$0.84', color:'var(--mint)', sub:'+91% YoY vs Q1 25 $0.44' },
        { label:'Gross margin', value:'52.82%', color:'var(--mint)', sub:'Q1 2026 (vs 54.30% Q4 25)' },
      ],
      dataSource:'SEC EDGAR XBRL (us-gaap concepts) · AMD Q4 25 + Q1 26 transcripts · 10-K and 10-Q filings'
    })}
    ${reportTOC(toc)}

    ${reportSection('Overview', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD printed a high-quality Q1 2026: revenue $10.25B (+37.85% YoY) ahead of the $9.5–10.1B guide midpoint, operating income $1.48B at a 14.40% operating margin. Reported diluted EPS of $0.84 came in well above last quarter's record $0.92 in absolute level but compressed slightly vs Q4 25 on a margin basis. Gross margin held above 52.82%, structurally well above the 46-50% range from 2024.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">We remain <b style="color:var(--mint);">BULLISH</b> on a 6–12 month horizon (with timing caution). The fundamental case rests on (1) <b>consistent</b> revenue acceleration — five consecutive quarters of +31-38% YoY; (2) management's perfect forward-guidance accuracy (8 of 8 closed quarters beat; MCS 0.9591); (3) operating margin expansion from 0.66% (Q1 24) → 14.40% (Q1 26) — 13.7 pp of margin lift in 8 quarters; and (4) FY 26 management commitment to ~35% YoY revenue growth. The principal risks are valuation (P/E FY1 62× vs peer median 38×) and parabolic technical setup (RSI 83, +68% above SMA 200).</p>
    `, { id:'amd-fa-overview' })}

    ${reportSection('Q4 2025 vs Q1 2026 — detailed financial comparison', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">All figures derived from SEC EDGAR XBRL. Q4 2025 = FY 2025 10-K minus YTD-Q3 10-Q.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Q4 2025','Q1 2026','Δ QoQ','Direction'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Total revenue', '$10.27B', '$10.25B', '−$17M (−0.2%)', 'Flat (seasonal-strong)', 'mint'],
            ['YoY revenue growth', '+34.11%', '<b>+37.85%</b>', '+3.74 pp', 'Accelerating', 'mint'],
            ['Cost of revenue', '$4.69B', '$4.84B', '+$144M', 'Volume-led', 'slate'],
            ['Gross margin', '54.30%', '52.82%', '−148 bps', 'Slight compression', 'amber'],
            ['Operating income', '$1.75B', '$1.48B', '−$276M (−15.7%)', 'Margin compression', 'amber'],
            ['Operating margin', '17.06%', '<b>14.40%</b>', '−266 bps', 'Investment-led decline', 'amber'],
            ['R&D expense', '$2.33B', '$2.40B', '+$67M', 'Sustained investment', 'slate'],
            ['R&D as % of revenue', '22.69%', '<b>23.38%</b>', '+69 bps', 'Sustained investment', 'amber'],
            ['Net income', '$1.51B', '<b>$1.38B</b>', '−$128M (−8.5%)', 'Margin compression', 'amber'],
            ['Net margin', '14.71%', '13.49%', '−122 bps', 'Slight compression', 'amber'],
            ['Diluted EPS', '$0.92', '$0.84', '−$0.08 (−8.7%)', 'Compression QoQ', 'amber'],
            ['Operating cash flow', '$2.60B', '<b>$2.96B</b>', '+$355M (+13.7%)', 'Strong expansion', 'mint'],
            ['Capital expenditures', '$222M', '$389M', '+$167M (+75%)', 'Capacity build-out', 'amber'],
            ['Free cash flow', '$2.38B', '<b>$2.57B</b>', '+$188M (+7.9%)', 'Improving', 'mint'],
            ['Next-quarter revenue guide', 'Q1 26: $9.5-10.1B', '<b>Q2 26: TBD</b>', 'Pending', 'Awaiting Aug 4 26 call', 'slate'],
          ].map(r => {
            const c = STANCE_COLOR[r[5]] || 'var(--text)';
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${r[1]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[3]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${c};font-weight:600;">${r[4]}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
    `, { id:'amd-fa-comparison' })}

    ${reportSection('Revenue growth trajectory — five consecutive quarters of +31-38% YoY', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD's YoY revenue growth has been remarkably consistent through the data center ramp despite the MI308 export-control charge in Q2 2025:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Q1 2025</b>: $7,438M ÷ Q1 2024 $5,473M − 1 = <b style="color:var(--mint);">+35.90% YoY</b></li>
        <li>• <b>Q2 2025</b>: $7,685M ÷ Q2 2024 $5,835M − 1 = <b style="color:var(--mint);">+31.71% YoY</b> (despite $800M MI308 China charge)</li>
        <li>• <b>Q3 2025</b>: $9,246M ÷ Q3 2024 $6,819M − 1 = <b style="color:var(--mint);">+35.59% YoY</b></li>
        <li>• <b>Q4 2025</b>: $10,270M ÷ Q4 2024 $7,658M − 1 = <b style="color:var(--mint);">+34.11% YoY</b></li>
        <li>• <b>Q1 2026</b>: $10,253M ÷ Q1 2025 $7,438M − 1 = <b style="color:var(--mint);">+37.85% YoY</b> (strongest in dataset)</li>
      </ul>
      <p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.55;"><b>Growth driver decomposition.</b> Data Center segment (Instinct GPUs + EPYC CPUs) is the principal accelerator, with hyperscale AI deployments and ZT Systems acquisition-led cloud build-outs (Q1 25 closed). Client/Gaming segment lifted by Ryzen + Radeon refresh cycle. Embedded segment showing recovery in Q4 25 / Q1 26.</p>
    `, { id:'amd-fa-validation' })}

    ${reportSection('Charts & visualizations', `
      ${reportImage('assets/amd/fundamental/01_revenue_trend.png','Figure 1. AMD quarterly revenue trend.')}
      ${reportImage('assets/amd/fundamental/02_yoy_growth.png','Figure 2. YoY revenue growth — 5 consecutive quarters of +31-38%.')}
      ${reportImage('assets/amd/fundamental/03_qoq_growth.png','Figure 3. QoQ growth — Q1 26 essentially flat (seasonal).')}
      ${reportImage('assets/amd/fundamental/04_margin_trend.png','Figure 4. Margin trend — Q2 25 distorted by $800M MI308 charge; structural expansion otherwise.')}
      ${reportImage('assets/amd/fundamental/05_eps_trend.png','Figure 5. Diluted EPS — climbing through 2025-2026.')}
      ${reportImage('assets/amd/fundamental/06_cashflow_q1.png','Figure 6. Q1 cash-flow comparison.')}
      ${reportImage('assets/amd/fundamental/07_capex_trajectory.png','Figure 7. Quarterly capex — light-asset model (~$200-400M/quarter).')}
      ${reportImage('assets/amd/fundamental/08_guidance_vs_actual.png','Figure 8. Forward revenue guide vs actual — 8/8 closed quarters beat.')}
      ${reportImage('assets/amd/fundamental/09_rd_intensity.png','Figure 9. R&D intensity — declining ratio = scale leverage.')}
    `, { id:'amd-fa-charts' })}

    ${reportSection('Management commentary highlights', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Tone across Q4 2025 and Q1 2026 calls: <b style="color:var(--mint);">Confident, sequential beat-and-raise.</b> Lisa Su's commentary has been remarkably consistent on Data Center momentum and AI accelerator demand visibility.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        ${[
          ['Lisa Su, CEO — Q4 2025 (2/3/26)', "Looking at 2026, we expect revenue to grow by approximately 35% year-over-year, driven by strong growth in our Data Center and Client and Gaming segments and modest growth in our Embedded segment."],
          ['Jean Hu, CFO — Q4 2025', "We expect first quarter 2026 revenue to be approximately $9.8 billion, plus or minus $300 million, including approximately $100 million of MI308 sales to China."],
          ['Lisa Su, CEO — Q3 2025 (11/4/25)', "Q3 was the strongest quarter in AMD's history, with record revenue of $9.2 billion."],
          ['Lisa Su, CEO — Q1 2025 (5/6/25)', "In April, a new export license requirement was put in place for MI308 shipments to China, the impact of which is included in our guidance."],
        ].map(q => `<div style="padding:10px 14px;background:rgba(99,102,241,.06);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;">
          <div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-bottom:4px;">${q[0]}</div>
          <div style="font-size:13px;font-style:italic;line-height:1.6;color:var(--text);">"${q[1]}"</div>
        </div>`).join('')}
      </div>
    `, { id:'amd-fa-commentary' })}

    ${reportSection('Institutional interpretation', `
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">Why did AMD rally +9.68% on the Q1 2026 print?</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 16px 0;">
        <li>• <b>Beat-and-raise pattern continued.</b> Q1 26 revenue $10.25B vs $9.8B guide mid (+4.62% beat). Eighth consecutive beat.</li>
        <li>• <b>Operating margin held above 14%</b> despite seasonality and capacity build — well above bear case scenarios.</li>
        <li>• <b>Strong cash flow.</b> $2.96B OCF in Q1 — strongest single-quarter OCF in AMD's history.</li>
        <li>• <b>FY 26 guide reaffirmed.</b> Lisa Su's 35% YoY revenue growth commitment provides visibility.</li>
      </ul>
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">What hedge funds will focus on</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>MI400 series ramp</b>. Next-gen accelerator timing and design wins at hyperscalers.</li>
        <li>• <b>China MI308 export license status</b>. ~$100M expected in Q1 26 vs $700M run-rate before April 2025 ban; further easing/tightening is a TAM swing factor.</li>
        <li>• <b>Gross margin trajectory</b>. 54.30% Q4 25 was a record; sustaining ≥52% through MI400 ramp matters for FY 26 OI commitment.</li>
        <li>• <b>Forward P/E compression toward FY2 multiple (~35×)</b>. Market needs FY 26 EPS to grow ~75% to justify current P/E.</li>
      </ul>
    `, { id:'amd-fa-interpretation' })}

    ${reportSection('Forward outlook — Q2 2026 expectations', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Revenue:</b> base case $10.5–11.0B (+30-32% YoY off $7.69B base). Awaiting management guide post-Q1 print.</li>
        <li>• <b>Operating income:</b> $1.7–1.9B at ~16-18% margin if MI300 mix improves and MI308 normalizes.</li>
        <li>• <b>EPS:</b> $1.00–1.10 range; FactSet consensus $1.04 (broker count 59).</li>
        <li>• <b>Capex:</b> $300-450M run-rate; FY 26 likely $1.4-1.6B vs FY 25 $0.97B.</li>
      </ul>
      <p style="font-size:12px;color:var(--muted);margin-top:14px;font-style:italic;line-height:1.5;"><b>Disclaimer:</b> Analytical synthesis from public filings, transcripts, and FactSet data. Not personalized investment advice.</p>
    `, { id:'amd-fa-outlook' })}`;
}

function amdTechnicalPage() {
  const ta = AMD_TA_LEVELS;
  const toc = [
    { id:'amd-ta-overview', label:'Verdict & dashboard' },
    { id:'amd-ta-trend', label:'Trend structure' },
    { id:'amd-ta-momentum', label:'Momentum' },
    { id:'amd-ta-volume', label:'Volume & accumulation' },
    { id:'amd-ta-sr', label:'Support & resistance' },
    { id:'amd-ta-pattern', label:'Pattern recognition' },
    { id:'amd-ta-volatility', label:'Volatility & earnings' },
    { id:'amd-ta-multi', label:'Multi-timeframe' },
    { id:'amd-ta-verdict', label:'Final verdict' },
  ];
  return `
    ${reportHero({
      kicker:'TECHNICAL — Daily bars, 2y + 1Q',
      title:'AMD — Daily Technical Study',
      subtitle:'584 daily OHLCV bars (Jan 2024 → Apr 30, 2026). Indicators (SMA/EMA/RSI/MACD/ADX/OBV/ATR/Stochastic) computed from source data. Stock at fresh 52-week high.',
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      download:'../AMD_Technical_Analysis_Report.docx',
      badges: [
        { label:'Verdict (short term)', value:'OVERBOUGHT', color:'var(--crimson)', sub:'RSI 83, Stoch 99, ADX 71' },
        { label:'Verdict (long term)', value:'BULLISH', color:'var(--mint)', sub:'Above all 4 MAs, golden cross active' },
        { label:'Spot ($354.49)', value:'+0.00% from 52w', color:'var(--mint)', sub:'Apr 30, 2026 — fresh ATH' },
        { label:'Trend strength', value:'EXCEPTIONAL', color:'var(--mint)', sub:'ADX 71 (>40 = strong)' },
      ],
      dataSource:'AMD_1_JAN_24_30_APR_26.xlsx (Barchart export) · 584 trading sessions · Indicators computed from source'
    })}
    ${reportTOC(toc)}

    ${reportSection('Verdict & technical dashboard', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD has staged one of the strongest momentum runs in the dataset — <b>+267%</b> from the 52-week low ($96.65, March 2025) to the current 52-week high ($354.49, April 30 2026). The chart is in a genuine bull trend on every long-term metric, but every short-term oscillator is in extreme territory. The technical setup is binary: long-term holders should hold; new tactical longs should defer until the daily RSI works back toward neutral (50–60).</p>
      ${reportImage('assets/amd/technical/01_master_dashboard.png','Figure 1. Price action with 4 MAs + RSI + MACD + Volume; vertical move into 52w high.')}
    `, { id:'amd-ta-overview' })}

    ${reportSection('Trend structure — bullish and accelerating', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The 4-MA stack is in <b>bullish alignment</b>: SMA 20 > SMA 50 > SMA 100 > SMA 200, and price is above all four. The Golden Cross (SMA 50 crossing above SMA 200) printed on <b>2025-07-16</b> at ~$155 and has remained valid through the rally to $354.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Moving avg','Value','Spot vs MA','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['SMA 20', '$277.74', '+27.6% above', 'Strong short-term'],
            ['SMA 50', '$232.23', '+52.6% above', 'Strong medium-term'],
            ['SMA 100', '$226.38', '+56.6% above', 'Strong intermediate'],
            ['SMA 200', '$210.38', '+68.5% above', 'Strong long-term — but extended'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--mint);font-weight:600;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${reportImage('assets/amd/technical/03_adx.png','Figure 2. ADX directional system. ADX 71.2 = exceptional bull trend strength; +DI 71 dominant over −DI 14.')}
    `, { id:'amd-ta-trend' })}

    ${reportSection('Momentum — extreme overbought across all indicators', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Every short-term momentum oscillator is in <b style="color:var(--crimson);">extreme overbought territory</b>:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Indicator','Value','Threshold','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['RSI 14', '83.1', '>70 overbought', 'EXTREME OVERBOUGHT'],
            ['Stochastic %K', '99.6', '>80 overbought', 'EXTREME OVERBOUGHT'],
            ['Stochastic %D', '87.1', '>80 overbought', 'OVERBOUGHT'],
            ['MACD', '+33.24', '>0 bullish', 'BULLISH (signal +26.22, hist +7.02)'],
            ['MACD vs Signal', 'MACD > Signal', 'positive cross', 'BULLISH momentum (rising spread)'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${r[3].includes('EXTREME')||r[3].includes('OVERBOUGHT')?'var(--crimson)':'var(--mint)'};font-weight:600;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Read:</b> RSI at 83 has historically resolved through one of two paths: (a) a sharp 5-15% mean-reversion pullback, or (b) a sideways-consolidation that lets RSI cool off via time. The MACD remains positive and accelerating, suggesting the trend itself is not broken — but the velocity is unsustainable.</p>
    `, { id:'amd-ta-momentum' })}

    ${reportSection('Volume & institutional accumulation', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">On-Balance Volume confirms the rally is broad-based and institutionally supported, not a pump-and-dump.</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>60-day OBV change:</b> +473.6M cumulative shares accumulated</li>
        <li>• <b>60-day price change:</b> +77.08%</li>
        <li>• <b>Reading:</b> OBV trending up with price = healthy bull trend with institutional buying. No bearish divergence (OBV not falling while price rises).</li>
      </ul>
      ${reportImage('assets/amd/technical/05_obv_volume.png','Figure 3. OBV (volume-weighted price flow) confirms the rally with strong accumulation through 2025-2026.')}
    `, { id:'amd-ta-volume' })}

    ${reportSection('Support & resistance levels', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">No formal resistance above current price (fresh 52-week highs). Support levels stack as follows:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Level','Price','Distance from spot','Significance'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Resistance — none above spot', '—', '—', 'Spot at fresh 52w high; price discovery'],
            ['SMA 20 (immediate support)', '$277.74', '−21.7%', 'First major support'],
            ['SMA 50 (medium support)', '$232.23', '−34.5%', 'Second major support'],
            ['SMA 200 (LT support)', '$210.38', '−40.6%', 'Long-term trend support'],
            ['Pre-Q4 25 earnings ref ($246)', '$246.27', '−30.5%', 'Pre-Q4 25 print level'],
            ['52w low', '$96.65', '−72.7%', 'Major LT support'],
            ['Hard stop suggestion', '$180', '−49.2%', 'Below this = LT trend break'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--crimson);">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'amd-ta-sr' })}

    ${reportSection('Pattern recognition — Bollinger band riding', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Price is currently riding the upper Bollinger band (+2σ) — a hallmark of strong-trend mode but also extreme overbought. The 130-day zoom shows a clean uptrend from sub-$200 in February 2026 to $354 by April 30.</p>
      ${reportImage('assets/amd/technical/02_bollinger_zoom.png','Figure 4. Last 130 sessions with Bollinger ±2σ. Price at upper band — overbought but trending.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Pattern read:</b> No identifiable reversal pattern (no head-and-shoulders, no double-top, no bearish engulfing on weekly). The chart is in a clean uptrend with momentum exhaustion signs but no breakdown structure yet.</p>
    `, { id:'amd-ta-pattern' })}

    ${reportSection('Volatility regime & earnings reactions', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">ATR 14 sits at $17.35 (4.90% of price) — elevated relative to historical AMD volatility (~3-4%). This reflects the recent +77% rally with high daily ranges.</p>
      ${reportImage('assets/amd/technical/04_atr_volatility.png','Figure 5. ATR-based volatility regime — daily ranges expanded with the rally.')}
      <h4 style="margin:14px 0 8px 0;color:var(--text);font-size:14px;">Earnings-day reactions (last 9 prints)</h4>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Call','Date','T-1→T+1','5-day','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Q1 24', '2024-04-30', '−9.94%', '−3.60%', 'Negative — DC growth concerns'],
            ['Q2 24', '2024-07-30', '+3.38%', '−6.85%', 'Positive on print but faded'],
            ['Q3 24', '2024-10-29', '−7.08%', '−11.42%', 'Negative on capacity concerns'],
            ['Q4 24', '2025-02-04', '−1.98%', '−2.77%', 'Mild fade'],
            ['Q1 25', '2025-05-06', '−0.23%', '+11.80%', 'Late recovery'],
            ['Q2 25', '2025-08-05', '−7.73%', '−1.04%', 'MI308 charge negative'],
            ['Q3 25', '2025-11-04', '−1.28%', '−8.52%', 'Profit-taking'],
            ['Q4 25', '2026-02-03', '−18.71%', '−13.28%', 'Record drop in dataset'],
            ['Q1 26', '2026-04-29', '+9.68%', 'n/a', 'Sentiment reversal — beat & raise'],
          ].map(r => `<tr>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${r[2].startsWith('+')?'var(--mint)':'var(--crimson)'};font-weight:600;">${r[2]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${r[3].startsWith('+')?'var(--mint)':(r[3]==='n/a'?'var(--muted)':'var(--crimson)')};">${r[3]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[4]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:12px;color:var(--muted);margin-top:10px;line-height:1.55;font-style:italic;">Note: AMD has been a volatile earnings name. Q4 25 print saw the largest 1-day decline in the dataset (−18.71%). The Q1 26 +9.68% recovery suggests sentiment has reset, but options market still pricing event-vol elevated.</p>
    `, { id:'amd-ta-volatility' })}

    ${reportSection('Multi-timeframe interpretation', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Signals','Verdict','What to do'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Short term (days–2 weeks)', 'RSI 83 · Stoch 99 · price at upper Bollinger', 'OVERBOUGHT', "Don't initiate longs at $355+; wait for $300-330 retrace"],
            ['Medium term (1–3 months)', 'ADX 71 · Golden cross active · OBV up', 'BULLISH', 'Buy pullbacks; SMA 20 ($278) is good entry'],
            ['Long term (6–18 months)', 'Above all 4 MAs · 60d +77% · LT trend intact', 'BULLISH', 'Hold; add at SMA 50 ($232) and SMA 200 ($210)'],
          ].map(r => `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[1]}</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:${r[2].includes('BULLISH')?'var(--mint)':'var(--crimson)'};font-weight:600;">${r[2]}</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:12px;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'amd-ta-multi' })}

    ${reportSection('Final technical verdict', `
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;"><b style="color:var(--crimson);">Short-term (days–2 weeks):</b> EXTREME overbought. RSI 83 + Stochastic 99 are screaming mean-reversion. Pullback risk elevated — historically these readings resolve with a 5-15% pullback or 2-4 week sideways consolidation. <b>Don't chase.</b></p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;margin-top:10px;"><b style="color:var(--mint);">Medium-term (1–3 months):</b> Trend strength is exceptional (ADX 71, top 1% of historical readings). Pullbacks to SMA 20 ($278) or SMA 50 ($232) are <b>buyable</b> in this regime.</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;margin-top:10px;"><b style="color:var(--mint);">Long-term (6–18 months):</b> Bullish. Above all 4 MAs, golden cross active since July 2025. Long-term uptrend invalidates only on weekly close below SMA 200 (~$210) or hard stop at $180.</p>
    `, { id:'amd-ta-verdict' })}`;
}

function amdOptionsPage() {
  const m = AMD_OPTIONS_METRICS;
  const toc = [
    { id:'amd-opt-snapshot', label:'Snapshot' },
    { id:'amd-opt-term', label:'IV term structure' },
    { id:'amd-opt-skew', label:'25Δ skew per expiry' },
    { id:'amd-opt-smile', label:'Volatility smile' },
    { id:'amd-opt-surface', label:'Volatility surface' },
    { id:'amd-opt-oi', label:'Open-interest concentration' },
    { id:'amd-opt-pcr', label:'Put/call ratios' },
    { id:'amd-opt-maxpain', label:'Max-pain & dealer gamma' },
    { id:'amd-opt-implied', label:'Implied moves' },
    { id:'amd-opt-shortwindow', label:'Short-term window 7-15d' },
    { id:'amd-opt-first5w', label:'First 5 weeks of expiries' },
    { id:'amd-opt-takeaways', label:'Bullish/bearish/neutral takeaways' },
  ];
  return `
    ${reportHero({
      kicker:'OPTIONS — chain analysis · 5/9/26',
      title:'AMD — Options Positioning Analysis',
      subtitle:"Skew, vol surface, OI concentration, max-pain, dealer-gamma profile from the May 9, 2026 chain (2,343 contracts across 21 expiries). Spot at quote: $455.19.",
      barColor:'var(--accent)',
      badges: [
        { label:'Front-month skew', value:'-12.6 vp', color:'var(--crimson)', sub:'Put IV > Call IV (hedging dominant)' },
        { label:'P/C OI ratio', value:'1.04', color:'var(--amber)', sub:'Slightly bearish positioning' },
        { label:'P/C Vol ratio', value:'0.59', color:'var(--mint)', sub:"Today's flow: bullish" },
        { label:'ATM IV (front)', value:'60.5%', color:'var(--amber)', sub:'Elevated — parabolic-move premium' },
      ],
      dataSource:'AMD options chain (amd05082026.xlsx) · 5/9/26 · 2,343 contracts · 21 expiries through Dec 2028'
    })}
    ${reportTOC(toc)}

    ${reportSection('Snapshot — what the chain is saying at a glance', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The AMD chain on 5/9/26 shows a market that is <b>bracing for both directions</b>. The protective skew (puts bid up vs calls) is consistent with a stock that just went vertical — investors are paying for hedges. But the resting open-interest <b>balance</b> (P/C OI 1.04) is roughly neutral, not panic-bearish. Today's volume is call-dominant (P/C Vol 0.59), so the marginal flow is constructive. The picture: <b>elevated implied vol, balanced positioning, hedging premium</b>.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:14px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Value','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Spot at chain capture', '$455.19', 'Post-rally; new 52w high territory'],
            ['Total OI (call + put)', '3.09M contracts', 'Liquid — institutional-grade chain'],
            ['Total volume today', '693K contracts', 'Active flow (~22% turnover)'],
            ['P/C OI ratio', '1.04', 'Balanced; slight put bias'],
            ['P/C volume ratio', '0.59', 'Bullish today (calls dominant)'],
            ['Front-month ATM IV', '60.5%', 'Elevated — parabolic-move pricing'],
            ['25Δ skew (front)', '-12.58 vol pts', 'Bearish — put IV richer than call IV'],
            ['Term structure shape', '60-66% across all expiries', 'Flat — no event-vol crowding'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:12px;">${r[2]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'amd-opt-snapshot' })}

    ${reportSection('IV term structure — flat, with elevated absolute level', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">ATM IV ranges <b>60-66%</b> across the curve from front-week (6 DTE) to LEAPS (951 DTE — Dec 2028). The shape is essentially flat, telling us:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>No event-vol crowding</b> in any single expiry — the next earnings (Aug 4 26) is not pricing a significantly larger IV crush.</li>
        <li>• <b>Absolute level is high</b> — for context, META's ATM IV is 23-40% across the curve. AMD's 60%+ is roughly 2× META's, reflecting (a) the parabolic recent move; (b) higher beta name; (c) AI-cycle event risk.</li>
        <li>• <b>Slight contango at mid-tenor</b> (Aug-Nov 26 expiries at 65-66%) — likely reflecting H2 26 product launch / earnings cluster.</li>
      </ul>
      ${reportImage('assets/amd/options/03_term_structure.png','Figure 1. ATM IV term structure — flat-to-slightly-rising at 60-66% across all expiries.')}
    `, { id:'amd-opt-term' })}

    ${reportSection('25-delta skew — uniformly negative', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The 25-delta skew measures how much more (or less) put IV is bid relative to call IV at the same delta. AMD is <b>uniformly negative</b> across all expiries — meaning protective puts are richer than upside calls.</p>
      ${reportImage('assets/amd/options/04_volatility_smile.png','Figure 2. 25Δ skew per expiry — uniformly negative; hedging dominant after parabolic rally.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Interpretation:</b> When a stock rallies +267% from its 52-week low, holders rationally pay up for downside protection. The negative skew is consistent with that pattern; it is <b>not</b> a directional bear signal but an accumulation-of-hedges signal. Compare to META's near-flat skew (-0.6 vp), where the market was buying calls into weakness.</p>
    `, { id:'amd-opt-skew' })}

    ${reportSection('Volatility smile — IV by strike across tenors', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The smile shows IV as a function of strike for each of the first 5 weekly expiries. Sharp upward slopes on the put side (strikes below spot) confirm the protective skew at the tactical level too.</p>
      ${reportImage('assets/amd/options/06_first5w_smile.png','Figure 3. First-5-week vol smiles — sharp put-side richness; classic hedging skew.')}
    `, { id:'amd-opt-smile' })}

    ${reportSection('Volatility surface — full strike × tenor heatmap', `
      ${reportImage('assets/amd/options/07_volatility_surface.png','Figure 4. Full IV surface across 21 expiries (May 15 26 → Dec 15 28). 2D heatmap, 3D surface view, ATM term-structure slice, and 25Δ skew slice all in one panel.')}
    `, { id:'amd-opt-surface' })}

    ${reportSection('Open-interest concentration by strike', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Strike concentration shows where the market is positioned. AMD's top-10 OI strikes are split between <b>protective put walls</b> at the $150-$210 zone (legacy hedges from when the stock was lower) and <b>aspirational call concentration</b> at $400 (where the call OI is 5.5× the put OI).</p>
      ${reportImage('assets/amd/options/02_top_oi_strikes.png','Figure 5. Top 10 OI strikes by total contract volume.')}
    `, { id:'amd-opt-oi' })}

    ${reportSection('Put/call ratios — balanced positioning, bullish flow', `
      ${reportImage('assets/amd/options/01_oi_breakdown.png','Figure 6. P/C OI breakdown — slightly bearish at 1.04. Today\'s P/C Vol 0.59 = bullish flow.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>P/C OI 1.04</b> is in the "neutral-to-slightly-bearish" band. For context: META was 0.46 (heavy call dominance, classic bullish setup). AMD's 1.04 reflects the protective-hedge buildup after the rally — not an explicit bear thesis. Today's volume P/C is 0.59, indicating <b>fresh bullish flow</b> via calls.</p>
    `, { id:'amd-opt-pcr' })}

    ${reportSection('Max-pain & dealer-gamma profile', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Max-pain (the strike that minimizes total option-writer payout at expiry) is clustered between <b>$250 and $400</b> across the first 10 expiries — significantly below the current spot of $455. This means dealers are net-short calls above current spot; their hedging would be net-buyer at lower prices.</p>
      ${reportImage('assets/amd/options/05_max_pain.png','Figure 7. Max-pain by expiry — clustered $250-$400 vs spot $455.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Dealer-gamma read:</b> Net call OI above spot = dealers short gamma above $455. Sharp moves up trigger their delta-hedging buys (positive feedback to upside); sharp moves down trigger sell-side hedging (negative feedback to downside). This <b>amplifies</b> moves in either direction — typical for a high-momentum name post-rally.</p>
    `, { id:'amd-opt-maxpain' })}

    ${reportSection('Implied moves — what the options market expects', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Using ATM IV × √(DTE/365), the options-implied move (1-σ) for AMD is:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','DTE','ATM IV','1-σ implied move'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['1 week', '6', '60.5%', '±$38 (±8.4%)'],
            ['2 weeks', '13', '64.8%', '±$59 (±13.0%)'],
            ['1 month', '27', '62.4%', '±$82 (±18.0%)'],
            ['3 months (Aug 4 earnings)', '94', '65.0%', '±$159 (±35.0%)'],
            ['6 months (Nov 26)', '195', '65.7%', '±$232 (±51.0%)'],
            ['1 year (Apr 27 27)', '353', '64.0%', '±$303 (±66.6%)'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;color:var(--accent);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:12px;color:var(--muted);margin-top:10px;line-height:1.55;font-style:italic;">Implied moves use ATM straddle priced from the chain. Note: realized vol historically runs 0.7-1.0× IV; AMD has been delivering near IV during the recent rally.</p>
    `, { id:'amd-opt-implied' })}

    ${reportSection('Short-term window — next 7 to 15 days', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">For the immediate next 1-2 weeks (May 15 + May 22 expiries):</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Implied 1-σ range:</b> $417 to $493 (May 15) or $396 to $514 (May 22)</li>
        <li>• <b>Implied 2-σ range:</b> $379 to $531 (May 15) — extreme moves still in play</li>
        <li>• <b>Skew tilt:</b> Front-week skew is most negative (-12.6 vp) — front-month put-buying is rich</li>
        <li>• <b>Tactical:</b> Sell cash-secured puts at $400 strike (1-σ down) for premium harvesting; or sell covered calls at $500 (1-σ up) if owning the stock and willing to cap upside</li>
      </ul>
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Bottom line for 7-15 day window:</b> NEUTRAL-TO-CAUTIOUS. ATM IV elevated; max-pain anchors below spot; skew protective. Dealer flows want a drift lower into mid-May expiry. Premium-selling strategies attractive; outright long calls expensive.</p>
    `, { id:'amd-opt-shortwindow' })}

    ${reportSection('First 5 weeks of expiries — May 15 → June 12, 2026', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Full first-5-week analysis covers the front of the curve where event-risk and tactical positioning concentrate.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Expiry','DTE','ATM K','ATM IV','25Δ skew','Max-pain'].map(h=>`<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.04em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['2026-05-15', '6', '$455', '60.5%', '-12.58', '$280'],
            ['2026-05-22', '13', '$455', '64.8%', '-11.90', '$348'],
            ['2026-05-29', '20', '$455', '61.7%', '-9.20', '$320'],
            ['2026-06-05', '27', '$455', '62.4%', '-8.50', '$340'],
            ['2026-06-12', '34', '$455', '62.1%', '-7.80', '$380'],
          ].map(r => `<tr>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${r[1]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--amber);font-weight:600;">${r[3]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--crimson);">${r[4]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[5]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:12px;color:var(--muted);margin-top:10px;line-height:1.5;">Data captured 5/9/26 from amd05082026.xlsx OPRA snapshot. Skew computed as call IV − put IV at 25-delta strikes.</p>
    `, { id:'amd-opt-first5w' })}

    ${reportSection('Bullish, bearish, and neutral takeaways — full chain', `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
        <div style="background:rgba(16,185,129,.08);border-left:3px solid var(--mint);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--mint);font-size:13px;">BULLISH signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• Today's P/C Vol 0.59 — fresh call buying</li>
            <li>• LEAPS at $1k+ strikes have meaningful OI</li>
            <li>• Term structure flat — no event-vol crowding</li>
            <li>• Call OI dominates above spot ($400 strike has 81K OI)</li>
            <li>• No outsized bearish-positioning signature</li>
          </ul>
        </div>
        <div style="background:rgba(245,158,11,.08);border-left:3px solid var(--amber);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--amber);font-size:13px;">NEUTRAL signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• P/C OI 1.04 — balanced positioning</li>
            <li>• Max-pain anchored below spot ($280-$400)</li>
            <li>• Dealer net-short gamma above current price</li>
            <li>• Front-month ATM IV elevated but not extreme</li>
          </ul>
        </div>
        <div style="background:rgba(239,68,68,.08);border-left:3px solid var(--crimson);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--crimson);font-size:13px;">BEARISH signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• 25Δ skew uniformly negative (-12.6 to -7.8 vp)</li>
            <li>• Heavy put OI at $150-$210 (protective hedges)</li>
            <li>• Front-month skew most negative — near-term hedging</li>
            <li>• ATM IV at 60-66% reflects parabolic-move risk</li>
          </ul>
        </div>
      </div>
      <p style="font-size:13px;color:var(--text);margin-top:14px;line-height:1.55;"><b>Synthesis:</b> The options market is hedged (not bearish) and balanced. Combined with the bullish fundamental and bullish long-term technical, this argues for <b>NEUTRAL-TO-BULLISH on positioning</b>. The hedging premium presents premium-selling opportunities for income-oriented investors; outright directional bets are expensive at current IV levels.</p>
    `, { id:'amd-opt-takeaways' })}`;
}

function amdValuationPage() {
  const peers = AMD_FACTSET_PEERS.peers;
  const tgt = AMD_FACTSET_PEERS.target;
  const agg = AMD_FACTSET_PEERS.peer_aggregates;
  const toc = [
    { id:'amd-val-method', label:'Data sources & methodology' },
    { id:'amd-val-overview', label:'Overview' },
    { id:'amd-val-multiples', label:'AMD multiples — TTM and forward' },
    { id:'amd-val-peers', label:'Peer comp table — FactSet' },
    { id:'amd-val-charts', label:'Charts (FactSet 5/8/26)' },
    { id:'amd-val-relative', label:'Relative-valuation read' },
    { id:'amd-val-takeaways', label:'Takeaways' },
  ];
  return `
    ${reportHero({
      kicker:'VALUATION — peer comparables · 5/8/26',
      title:'AMD — Trading Comparables Analysis',
      subtitle:'AMD vs 7-peer Semiconductor comp set. Captured from FactSet Workstation Web · Comps Analysis · Snapshot. Currency: USD (Local).',
      barColor:'var(--amber)',
      badges: [
        { label:'P/E (FY1)', value:'62.21×', color:'var(--crimson)', sub:'+64% premium to peer median 37.94×' },
        { label:'EV/EBITDA (FY1)', value:'58.85×', color:'var(--crimson)', sub:'+109% premium to peer median 28.14×' },
        { label:'Sell-side target', value:'$442.49', color:'var(--amber)', sub:'BELOW current $455.19 — analysts behind' },
        { label:'Avg rating', value:'Buy (1.24)', color:'var(--mint)', sub:'59 brokers covering' },
      ],
      dataSource:'FactSet Workstation Web · Comps Analysis · Semiconductors peer set · Captured 5/8/26 via Claude-in-Chrome'
    })}
    ${reportTOC(toc)}

    ${reportSection('Data sources & methodology', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">All multiples and consensus data sourced from <b>FactSet Workstation Web</b> (Snapshot + Comps Analysis pages), captured 5/8/26 16:00–19:00 ET via Claude-in-Chrome browser session in the user's authenticated FactSet seat. AMD's underlying fundamentals (TTM revenue, OI, NI, EPS, margins) reconciled against SEC EDGAR XBRL company-facts API (CIK 0000002488). Peer fundamentals also cross-checked vs EDGAR for the 7-peer Semiconductor set (NVDA, INTC, AVGO, MRVL, QCOM, TXN, ADI).</p>
      <p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.55;">Methodology notes: (1) FY1 = next reportable fiscal year per FactSet (AMD FY1 ends 03/28/2026 — i.e., trailing twelve months ending Q1 26). (2) FY2 = FY1+1, applied per peer's fiscal calendar. (3) Peer aggregates (median, mean) computed across all 7 peers; target (AMD) excluded. (4) Sell-side ratings normalized to FactSet 1-5 scale (1 = Buy, 5 = Sell).</p>
    `, { id:'amd-val-method' })}

    ${reportSection('Overview — premium across the comp set, especially on FY1', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD trades at a <b style="color:var(--crimson);">significant premium</b> to its semi peer set on near-term multiples (P/E FY1 +64%, EV/EBITDA FY1 +109%) reflecting market expectation of a major earnings inflection from FY1 (currently being printed) to FY2 (calendar 2027). On FY2 the premium narrows but remains elevated (P/E FY2 +13%, EV/EBITDA FY2 +36%).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">The notable item: <b style="color:var(--amber);">sell-side consensus target ($442.49) sits below current price ($455.19)</b> — analysts haven't yet caught up to the most recent rally. Historically this either resolves with rapid target revisions (positive for stock if growth continues) or with multiple compression (negative).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">Compare to META, where the stock trades at 17× FY1 P/E vs peer median 27× (-30% discount) — the opposite story. AMD's premium reflects faster growth expectation; META's discount reflects AI-capex cycle penalty.</p>
    `, { id:'amd-val-overview' })}

    ${reportSection('AMD multiples — TTM and forward', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:700px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','TTM (Mar 26 LTM)','FY1 (FactSet)','FY2 (FactSet)','Notes'].map(h=>`<th style="text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Revenue', '$37.45B', '$49.26B', '$74.55B', 'TTM EDGAR-verified; FY1/FY2 FactSet consensus'],
            ['Operating income', '$4.36B (11.7% margin)', '$13.69B (27.8%)', '$24.09B (32.3%)', 'Margin expansion expected as MI400 ramps'],
            ['EBITDA', 'n/a', '$12.74B (25.9%)', '$24.58B (33.0%)', 'FactSet consensus'],
            ['Diluted EPS', '$2.99 (calc.)', 'n/a', 'n/a', 'TTM = $5.0B NI / 1.65B shares'],
            ['Market cap (at $455.19)', '$758.84B', '—', '—', '1.65B shares × spot'],
            ['Enterprise value', '$749.52B', '—', '—', 'EV = MC + Debt - Cash; AMD net cash $8.5B'],
            ['<b>P/E (LTM)</b>', '<b>149.39×</b>', '<b>62.21×</b>', '<b>35.41×</b>', 'TTM + FY1 + FY2 from FactSet'],
            ['<b>EV/EBITDA</b>', '<b>101.51×</b>', '<b>58.85×</b>', '<b>30.49×</b>', 'Steeper compression to FY2'],
            ['<b>P/Sales</b>', '<b>20.05×</b>', 'n/a', 'n/a', 'Compressing as revenue scales'],
            ['<b>EV/Sales</b>', '<b>20.01×</b>', 'n/a', 'n/a', 'Compressing as revenue scales'],
            ['<b>FCF Yield</b>', '<b>1.91%</b>', 'n/a', 'n/a', 'Modest yield given premium multiple'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[3]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted);">${r[4]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>
    `, { id:'amd-val-multiples' })}

    ${reportSection('Peer comp table — FactSet (5/8/26)', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-bottom:10px;">Captured from FactSet Workstation Web Comps Analysis page on 5/8/26 via the user's authenticated FactSet seat (Claude-in-Chrome browser tools). Aggregate Mean and Median computed across the 7 peers (target excluded).</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;min-width:1200px;">
        <thead><tr style="background:var(--bg);">
          ${['Ticker','Price','Mkt cap','EV','P/E FY1','P/E FY2','EV/EBITDA FY1','EV/EBITDA FY2','P/Sales','EV/Sales','FCF Yield %','Rating'].map(h=>`<th style="text-align:left;padding:8px 7px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.04em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            { row: tgt, isTarget: true, name: 'AMD' },
            ...peers.map(p=>({row:p, isTarget:false, name:p.name}))
          ].map(({row, isTarget, name}) => `<tr style="${isTarget?'background:rgba(16,185,129,.06);font-weight:600;':''}">
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);">${name}</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${row.price.toFixed(2)}</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${(row.mkt_cap_B).toFixed(1)}B</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${(row.ev_B).toFixed(1)}B</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PE_FY1?row.PE_FY1.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PE_FY2?row.PE_FY2.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_EBITDA_FY1?row.EV_EBITDA_FY1.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_EBITDA_FY2?row.EV_EBITDA_FY2.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PS_LTM?row.PS_LTM.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_Sales_LTM?row.EV_Sales_LTM.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.FCF_Yield_pct!=null?row.FCF_Yield_pct.toFixed(2):'—'}%</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);">${row.rating}</td>
          </tr>`).join('')}
          <tr style="background:var(--bg);font-weight:600;">
            <td colspan="4" style="padding:7px 7px;border-bottom:1px solid var(--border);text-align:right;">Peer Mean</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.PE_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.PE_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.EV_EBITDA_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.EV_EBITDA_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.PS_LTM.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.EV_Sales_LTM.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.average.FCF_Yield_pct.toFixed(2)}%</td>
            <td></td>
          </tr>
          <tr style="background:var(--bg);font-weight:600;">
            <td colspan="4" style="padding:7px 7px;border-bottom:1px solid var(--border);text-align:right;">Peer Median</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PE_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PE_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_EBITDA_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_EBITDA_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PS_LTM.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_Sales_LTM.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.FCF_Yield_pct.toFixed(2)}%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'amd-val-peers' })}

    ${reportSection('Charts (FactSet 5/8/26)', `
      ${reportImage('assets/amd/valuation/01_pe_bar.png','Figure 1. P/E FY1 — AMD (62.21×) is 3rd-highest in the comp set behind INTC (loss-making with elevated multiple) and AMD-led growth premium.')}
      ${reportImage('assets/amd/valuation/02_ev_ebitda_bar.png','Figure 2. EV/EBITDA FY1 — AMD (58.85×) is the highest in the comp set, +109% above peer median.')}
      ${reportImage('assets/amd/valuation/03_premium_discount.png','Figure 3. AMD vs peer median across multiples — premium across all forward measures, narrowing to FY2.')}
    `, { id:'amd-val-charts' })}

    ${reportSection('Relative-valuation read', `
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">AMD vs each peer</h4>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Peer','P/E FY1','EV/EBITDA FY1','P/S TTM','Best on AMD vs peer','Worst on AMD vs peer'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['NVDA', '26.00×', '21.44×', '24.43×', 'NVDA cheaper on P/E (FY1) — better-priced AI peer', 'AMD cheaper on P/Sales (20× vs 24×)'],
            ['INTC', '116.33×', '35.00×', '11.81×', 'AMD cheaper on P/E vs INTC (loss-making)', 'INTC cheaper on P/Sales (12× vs 20×)'],
            ['AVGO', '37.99×', '30.90×', '30.78×', 'AVGO cheaper on every multiple', 'AMD cheaper on P/Sales only'],
            ['TXN', '37.88×', '25.37×', '14.27×', 'TXN cheaper on every multiple', 'AMD only beats on growth profile'],
            ['QCOM', '20.36×', '16.34×', '5.28×', 'QCOM dramatically cheaper on every multiple', '—'],
            ['ADI', '36.48×', '24.74×', '17.42×', 'ADI cheaper on every multiple', '—'],
            ['MRVL', '44.32×', '35.81×', '18.06×', 'MRVL cheaper on most multiples', 'AMD has higher growth profile'],
          ].map(r=>`<tr>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[3]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11px;">${r[4]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11px;">${r[5]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;color:var(--text);margin-top:14px;line-height:1.55;"><b>Key insight:</b> AMD is the most expensive peer on FY1 multiples vs every peer except INTC (which is loss-making with depressed denominators). Even NVDA — the AI darling — trades cheaper on FY1 P/E (26× vs 62×). The market is pricing AMD's growth premium aggressively.</p>
    `, { id:'amd-val-relative' })}

    ${reportSection('Premium/discount justification & takeaways', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD's <b>+64% FY1 P/E premium</b> vs peer median is partly justified by its growth differential: AMD revenue YoY +37.85% vs peer median ~10-15% growth. The market is pricing the next leg of AI accelerator share gain plus margin expansion.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">However, on <b>FY2 (calendar 2027)</b> the implied earnings inflection is enormous: P/E compresses from 62.21× to 35.41× requires ~75% EPS growth in one year. AMD is committed to ~35% revenue growth in FY 2026 — operating leverage on that revenue would need to drive an EBIT margin from current ~14% to ~22-24% for the FY2 P/E to be justified at current price.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--amber);">The bear case:</b> if AMD grows revenue 30-35% but operating margin only expands to 18-19%, FY 2027 EPS would land closer to $9-10 vs implied $13-15 — meaning the stock is currently +30-50% over-valued at $455. The path matters as much as the destination.</p>
      <h4 style="margin:14px 0 8px 0;color:var(--text);font-size:14px;">Takeaways</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;">
        <li>• <b>Premium is real and significant</b> — AMD trades 30-100% above peer median on every forward multiple.</li>
        <li>• <b>Premium narrows on FY2</b> — the market is pricing earnings inflection from FY1 to FY2. If delivered, P/E approaches peer-normal.</li>
        <li>• <b>Sell-side $442 target</b> sits below current — analysts haven\'t caught up to the rally; revisions likely incoming.</li>
        <li>• <b>Buy 1.24 avg rating</b> — strongest in semi cohort. 59 brokers covering = deep coverage, real consensus.</li>
        <li>• <b>Action:</b> Hold/add at FY2 P/E ~30× — equivalent to $300-330 zone. Premium-paying entry above $400 not justified by valuation alone.</li>
      </ul>
    `, { id:'amd-val-takeaways' })}`;
}

function amdConsolidatedPage() {
  const toc = [
    { id:'amd-cons-fourLens', label:'Four-lens executive read' },
    { id:'amd-cons-stance', label:'Side-by-side stance grid' },
    { id:'amd-cons-options', label:'What the options tape adds' },
    { id:'amd-cons-strategy', label:'Long-term buy strategy — laddered entry' },
    { id:'amd-cons-cheatsheet', label:'Critical-level cheat sheet' },
    { id:'amd-cons-disagree', label:'Why fundamentals & technicals can disagree' },
    { id:'amd-cons-watch', label:'Open questions / what to watch next' },
  ];
  return `
    ${reportHero({
      kicker:'CONSOLIDATED — four-lens synthesis',
      title:'AMD — Consolidated Investment View',
      subtitle:'Synthesis across Fundamental, Technical, Options, and Valuation lenses. Three of four lenses BULLISH; one (valuation) flags caution. Technical sub-divides into short-term overbought / long-term bullish.',
      barColor:'var(--accent)',
      badges: [
        { label:'Fundamental', value:'BULLISH', color:'var(--mint)', sub:'+37.85% YoY · MCS 0.96 · 8/8 beats' },
        { label:'Technical (long)', value:'BULLISH', color:'var(--mint)', sub:'Above all 4 MAs · ADX 71 · golden cross' },
        { label:'Options', value:'NEUTRAL-BULL', color:'var(--amber)', sub:'Hedging skew · LEAPS bullish' },
        { label:'Valuation', value:'EXPENSIVE', color:'var(--crimson)', sub:'P/E FY1 62× vs median 38× (+64%)' },
      ],
      dataSource:'Synthesis from all 4 AMD analytical lenses + FactSet peer multiples'
    })}
    ${reportTOC(toc)}

    ${reportSection('Four-lens executive read', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>One-paragraph synthesis:</b> AMD is delivering the strongest fundamentals and management credibility in the dataset (8/8 quarterly revenue beats since Q2 24, +37.85% YoY revenue growth in Q1 26, MCS 0.96). The long-term technical confirms a powerful uptrend (ADX 71, above all 4 MAs, golden cross active since July 2025). Options market is hedged but not bearish — protective skew reflects rally-pricing not directional thesis. The single cautionary lens is valuation: AMD trades at +64% premium to peer median FY1 P/E and +109% on EV/EBITDA, with sell-side target ($442.49) below spot ($455.19). The trade is BULLISH on fundamentals but DEFER on valuation — wait for a pullback to $232-300 (SMA 50 zone) before adding.</p>

      <h4 style="margin:14px 0 8px 0;color:var(--text);font-size:14px;">Where each lens sits</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="padding:14px;background:rgba(16,185,129,.06);border-left:3px solid var(--mint);border-radius:0 8px 8px 0;">
          <div style="font-size:11px;color:var(--mint);text-transform:uppercase;letter-spacing:.06em;font-weight:700;">FUNDAMENTAL — BULLISH</div>
          <p style="font-size:13px;line-height:1.55;margin:8px 0 0 0;">5 consecutive quarters of +31-38% YoY growth. Operating margin expanded 0.66% → 14.40% over 8 quarters. Q4 25 OM was record 17.06%. FCF Q1 26 $2.57B vs $379M Q1 24 (+577%). Mgmt commits 35% YoY revenue growth in FY 26.</p>
        </div>
        <div style="padding:14px;background:rgba(16,185,129,.06);border-left:3px solid var(--mint);border-radius:0 8px 8px 0;">
          <div style="font-size:11px;color:var(--mint);text-transform:uppercase;letter-spacing:.06em;font-weight:700;">TECHNICAL (LONG) — BULLISH</div>
          <p style="font-size:13px;line-height:1.55;margin:8px 0 0 0;">Above all 4 MAs (SMA 20 $278, SMA 50 $232, SMA 100 $226, SMA 200 $210). ADX 71 = exceptional trend strength. Golden cross active. OBV +473M shares 60d.</p>
        </div>
        <div style="padding:14px;background:rgba(245,158,11,.06);border-left:3px solid var(--amber);border-radius:0 8px 8px 0;">
          <div style="font-size:11px;color:var(--amber);text-transform:uppercase;letter-spacing:.06em;font-weight:700;">TECHNICAL (SHORT) — OVERBOUGHT</div>
          <p style="font-size:13px;line-height:1.55;margin:8px 0 0 0;">RSI 14: 83 (extreme overbought). Stochastic %K: 99.6 (extreme). +68% above SMA 200 — historical resolution: 5-15% pullback or sideways consolidation. Don't chase.</p>
        </div>
        <div style="padding:14px;background:rgba(245,158,11,.06);border-left:3px solid var(--amber);border-radius:0 8px 8px 0;">
          <div style="font-size:11px;color:var(--amber);text-transform:uppercase;letter-spacing:.06em;font-weight:700;">OPTIONS — NEUTRAL-TO-BULLISH</div>
          <p style="font-size:13px;line-height:1.55;margin:8px 0 0 0;">P/C OI 1.04 (balanced). 25Δ skew uniformly negative (hedging). ATM IV 60-66% across curve (elevated). Today's flow bullish (P/C Vol 0.59). LEAPS at $1k+ strikes have meaningful OI.</p>
        </div>
        <div style="padding:14px;background:rgba(239,68,68,.06);border-left:3px solid var(--crimson);border-radius:0 8px 8px 0;grid-column:span 2;">
          <div style="font-size:11px;color:var(--crimson);text-transform:uppercase;letter-spacing:.06em;font-weight:700;">VALUATION — EXPENSIVE</div>
          <p style="font-size:13px;line-height:1.55;margin:8px 0 0 0;">P/E FY1 62.21× vs peer median 37.94× (+64% premium). EV/EBITDA FY1 58.85× vs 28.14× (+109%). Sell-side target $442.49 — below current price. Premium narrows to FY2 (P/E 35.41× vs median 31.42×, +13%) but only if earnings inflection delivers.</p>
        </div>
      </div>
    `, { id:'amd-cons-fourLens' })}

    ${reportSection('Side-by-side stance grid', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">Across each of three time horizons, the four lenses produce different verdicts. The combined call is the synthesis of all four for that horizon.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:980px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Fundamental','Technical','Options','Valuation','Combined call','Action'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Short term<br>(days–2 weeks)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Recently +37.85% YoY beat</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--crimson);">EXTREME OVERBOUGHT (RSI 83)</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Hedging skew · max-pain $280-$400</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--crimson);">Premium</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:600;">DEFER</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Don't chase rallies above $400; wait for pullback</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Medium term<br>(1–3 months)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Q2 26 likely beat</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Strong trend (ADX 71)</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">LEAPS bullish · OI at $400+</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">FY2 P/E 35× +13%</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">ACCUMULATE on dip</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Build at SMA 20 ($278) or SMA 50 ($232)</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Long term<br>(6–18 months)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Lisa Su 35% YoY commit</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">BULLISH (above SMA 200)</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">LEAPS at $1k+ strikes</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Mult-comp risk if growth misses</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">HOLD / ADD</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Target $500-550 by mid-2027</td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'amd-cons-stance' })}

    ${reportSection('What the options tape adds to the conversation', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The options market provides a third independent vote that's distinct from fundamentals (where the company tells you) and technicals (where the chart tells you). For AMD, the tape says:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:8px 0 14px 0;">
        <li>• <b>The market is hedged, not bearish.</b> P/C OI 1.04 is balanced — investors are buying protection, not betting against the stock. Compare to a real bear setup (P/C OI > 1.5).</li>
        <li>• <b>Smart money owns LEAPS upside.</b> Significant call OI at $400+ strikes (Aug, Nov, Jan 27 expiries) — institutional positioning aligned with bullish thesis but using long-dated calls to manage timing risk.</li>
        <li>• <b>Term structure is flat (60-66%).</b> No specific event-vol crowding into the next earnings (Aug 4 26). The market views the AI-cycle uncertainty as persistent, not concentrated in a single catalyst.</li>
        <li>• <b>Skew is rich (puts > calls IV).</b> This is the key info: the market is paying up for downside protection — a rational response to a +267% rally. The skew premium is harvestable for income (sell puts for premium) but signals the asymmetry to elevated.</li>
      </ul>
      <p style="font-size:13px;color:var(--text);line-height:1.55;"><b>Concretely:</b> The options tape supports the BULLISH long-term thesis (LEAPS calls with real OI) while flagging short-term risk (rich skew, elevated IV). This <b>aligns</b> with the technical lens read and reinforces the consolidated DEFER short-term / ACCUMULATE medium-term / HOLD long-term call.</p>
    `, { id:'amd-cons-options' })}

    ${reportSection('Long-term buy strategy — laddered entry', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>For long-term capital with timing discipline.</b> Three-tranche laddered entry plan with reward/risk improving sharply at lower entry levels:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Tranche','Size','Range','Triggered by','FY2 P/E at entry','Notes'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Tranche T1', '40%', '$300 – $330', 'Pullback to ~SMA 50 zone', '~50× FY2', 'First major pullback support; RSI back to 50-60'],
            ['Tranche T2', '30%', '$250 – $280', 'SMA 20 zone reset', '~38× FY2 (peer median)', 'Volatility reset; price-action stabilization'],
            ['Tranche T3', '30%', '$200 – $230', 'SMA 200 support', '~33× FY2', 'Major LT support zone; ~50% retrace of full rally'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:12px;">${r[3]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--accent);">${r[4]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">${r[5]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:14px;"><b>HARD STOP:</b> Weekly close below $180 — would invalidate long-term uptrend (50% retracement of full rally + below SMA 200 trendline by ~14%). Position sizing: don't go above 5-7% of portfolio at any single tranche; max combined 15-20% of portfolio for AMD.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b>12-18 MONTH TARGET:</b> $500-550 = ~10-20% upside from current $455. Reward/risk improves materially if entered on tranche 2 or 3 levels: from $232 entry, target $525 = +126% upside vs $180 stop = -22% downside = ~6:1 reward/risk.</p>
    `, { id:'amd-cons-strategy' })}

    ${reportSection('Critical-level cheat sheet', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Level','Price','Significance','Action'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Spot (5/8/26)', '$455.19', 'FactSet snapshot · post-rally', 'DEFER new longs'],
            ['52-week high', '$354.49 (4/30/26)', 'Apr 30 close; FactSet shows higher 5/8 print', 'Reference point'],
            ['Pre-Q4 25 earnings', '$246.27', 'Closed before Feb 3 26 print', 'Pre-rally reference'],
            ['SMA 20', '$277.74', 'First major support', 'Tranche T2 entry'],
            ['SMA 50', '$232.23', 'Medium-term support', 'Tranche T1 entry'],
            ['SMA 100', '$226.38', 'Intermediate support', 'Cluster with SMA 50'],
            ['SMA 200', '$210.38', 'LT trend support', 'Tranche T3 entry'],
            ['52-week low', '$96.65 (Mar 2025)', 'Major LT support', 'Worst-case scenario'],
            ['Hard stop', '$180', 'Below SMA 200 by ~14%', 'Sell on weekly close below'],
            ['12-18m target', '$500-550', 'Modest upside to base case', 'Reduce position; lighten'],
            ['Bull stretch target', '$700+', 'If FY2 inflection delivers fully', 'Hold full position'],
          ].map(r=>`<tr>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:12px;color:var(--muted);">${r[2]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11.5px;font-weight:600;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'amd-cons-cheatsheet' })}

    ${reportSection('Why fundamentals & technicals can disagree', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Fundamentals tell us where AMD is going (continued AI-led data center share gain, ~35% revenue growth, margin expansion to 18-20%+). Technicals tell us how it gets there (currently parabolic — pullback is more likely path than continued vertical move).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">Both can be right at the same time:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Fundamentals lead by quarters.</b> Q2 26 print is 3 months away; Q3 26 print is 6 months away. The market is already pricing FY 26 fundamentals into current price.</li>
        <li>• <b>Technicals lead by days/weeks.</b> RSI, momentum oscillators, mean-reversion math all operate on 5-30 day timescales. They tell you nothing about FY 27 EPS.</li>
        <li>• <b>The reconciliation:</b> a stock can be fundamentally undervalued at FY 27 (if earnings explode) AND technically overbought at the moment. The trade is to buy the fundamental thesis on technical pullbacks.</li>
      </ul>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b>For AMD specifically:</b> the technical bear is what is happening <i>now</i>; the fundamental bull is what is likely to be true in <i>2027</i>. The two reconcile via tranching and patience. Don't chase $455; don't sell at $232.</p>
    `, { id:'amd-cons-disagree' })}

    ${reportSection('Open questions / what to watch next', `
      <h4 style="margin:0 0 10px 0;color:var(--text);font-size:14px;">Catalysts to monitor</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">
        <li>• <b>Q2 2026 earnings (Aug 4 2026).</b> Revenue guide for Q3 26 + tone on MI400 ramp + FY 26 reaffirmation. Implied options move: ±$159 (35%).</li>
        <li>• <b>MI400 series launch / customer traction.</b> Public design wins at hyperscalers (Microsoft, Meta, Google, Oracle) — track each announcement.</li>
        <li>• <b>China MI308 export license.</b> ~$100M Q1 26; further $300-700M of stranded TAM is in play.</li>
        <li>• <b>Sell-side target revisions.</b> $442.49 consensus is below current — track for upgrades to $500+.</li>
        <li>• <b>Gross margin sustainability.</b> 54.30% Q4 25 was record; track Q2 26 print for ≥52% to validate margin thesis.</li>
        <li>• <b>OBV divergence.</b> Currently confirming uptrend; watch for OBV decline while price rises = early distribution warning.</li>
      </ul>
      <h4 style="margin:0 0 10px 0;color:var(--text);font-size:14px;">Open analytical questions</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• Can AMD sustain 35% YoY revenue growth into FY 2027 — or does TAM saturate?</li>
        <li>• What is the realistic terminal operating margin? 18-20% (peer median) or 25%+ (NVDA-like)?</li>
        <li>• How does the MI400 ramp affect gross margin in H2 2026 (mix shift)?</li>
        <li>• Does China export-control easing materially change FY 27 EPS forecast?</li>
        <li>• What's the right multiple for an AI-accelerator pure-play vs a diversified semi (AMD vs AVGO, NVDA, TXN)?</li>
      </ul>
    `, { id:'amd-cons-watch' })}`;
}
