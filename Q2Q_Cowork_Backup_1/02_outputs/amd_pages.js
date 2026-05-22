
// ========================================================================
// AMD Page Rendering Functions (added in AMD build pass)
// ========================================================================

function amdSummaryPage() {
  const n = DATA.narratives['AMD'];
  const c = DATA.companies['AMD'];
  const fund = c.fundamentals;
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
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD printed a high-quality Q1 2026: revenue $10.25B (+37.85% YoY) ahead of the $9.5–10.1B guide midpoint, operating income $1.48B at a 14.40% operating margin. Reported diluted EPS of $0.84 came in well above last quarter's record $0.92 in absolute dollars but compressed slightly vs Q4 25 on a margin basis. Gross margin held above 52.82%, structurally well above the 46-50% range from 2024.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">We remain <b style="color:var(--mint);">BULLISH</b> on a 6–12 month horizon (with timing caution). The fundamental case rests on (1) <b>consistent</b> revenue acceleration — five consecutive quarters of +31-38% YoY; (2) management's perfect forward-guidance accuracy (8 of 8 closed quarters beat; MCS 0.96); (3) operating margin expansion from 0.66% (Q1 24) → 14.40% (Q1 26) — 13.7 pp of margin lift in 8 quarters; and (4) FY 26 management commitment to ~35% YoY revenue growth. The principal risks are valuation (P/E FY1 62× vs peer median 38×) and parabolic technical setup (RSI 83, +68% above SMA 200).</p>
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
            ['R&D expense', '$2.33B', '$2.40B', '+$67M', 'Investment-led', 'slate'],
            ['R&D as % of revenue', '22.69%', '<b>23.38%</b>', '+69 bps', 'Sustained investment', 'amber'],
            ['Net income', '$1.51B', '<b>$1.38B</b>', '−$128M (−8.5%)', 'Margin compression', 'amber'],
            ['Net margin', '14.71%', '13.49%', '−122 bps', 'Slight compression', 'amber'],
            ['Diluted EPS', '$0.92', '$0.84', '−$0.08 (−8.7%)', 'Compression QoQ', 'amber'],
            ['Operating cash flow', '$2.60B', '<b>$2.96B</b>', '+$355M (+13.7%)', 'Strong expansion', 'mint'],
            ['Capital expenditures', '$222M', '$389M', '+$167M (+75%)', 'Capacity build-out', 'amber'],
            ['Free cash flow', '$2.38B', '<b>$2.57B</b>', '+$188M (+7.9%)', 'Improving', 'mint'],
            ['Next-quarter revenue guide', 'Q1 26: $9.5-10.1B', '<b>Q2 26: ~$8.7-9.5B mid TBD</b>', 'TBD', 'Pending', 'slate'],
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
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD's YoY revenue growth has been remarkably consistent through the data center ramp:</p>
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
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">Why did AMD rally +9.68% on Q1 2026 print?</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 16px 0;">
        <li>• <b>Beat-and-raise pattern continued.</b> Q1 26 revenue $10.25B vs $9.8B guide mid (+4.62% beat). Eighth consecutive beat.</li>
        <li>• <b>Operating margin held above 14%</b> despite seasonality and capacity build — well above bear case scenarios.</li>
        <li>• <b>Strong cash flow.</b> $2.96B OCF in Q1 — the strongest single-quarter OCF in AMD's history.</li>
        <li>• <b>FY 26 guide reaffirmed.</b> Lisa Su's 35% YoY revenue growth commitment provides visibility.</li>
      </ul>
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">What hedge funds will focus on</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>MI400 series ramp</b>. Next-gen accelerator timing and design wins at hyperscalers.</li>
        <li>• <b>China MI308 export license status</b>. ~$100M expected in Q1 26 vs $700M run-rate before April 2025 ban; further easing/tightening is a TAM swing factor.</li>
        <li>• <b>Gross margin trajectory</b>. 54.30% Q4 25 was a record; sustaining ≥52% through MI400 ramp matters for FY 26 OI commitment.</li>
        <li>• <b>Forward P/E compression toward FY2 multiple (~35×)</b>. Market needs FY 26 EPS to grow ~75% to justify current P/E. Achievable with mgmt's 35% revenue + margin expansion path.</li>
      </ul>
    `, { id:'amd-fa-interpretation' })}

    ${reportSection('Forward outlook — Q2 2026 expectations', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Revenue:</b> base case $10.5–11.0B (+30-32% YoY off $7.69B base, sequential up modest from $10.25B). Awaiting management guide post-Q1 print.</li>
        <li>• <b>Operating income:</b> $1.7–1.9B at ~16-18% margin if MI300 mix improves and MI308 normalizes.</li>
        <li>• <b>EPS:</b> $1.00–1.10 range; FactSet consensus $1.04.</li>
        <li>• <b>Capex:</b> $300-450M run-rate; FY 26 likely $1.4-1.6B vs FY 25 $0.97B.</li>
      </ul>
      <p style="font-size:12px;color:var(--muted);margin-top:14px;font-style:italic;line-height:1.5;"><b>Disclaimer:</b> Analytical synthesis from public filings, transcripts, and FactSet data. Not personalized investment advice.</p>
    `, { id:'amd-fa-outlook' })}`;
}

function amdTechnicalPage() {
  return `
    ${reportHero({
      kicker:'TECHNICAL — Daily bars, 2y + 1Q',
      title:'AMD — Daily Technical Study',
      subtitle:'584 daily OHLCV bars (Jan 2024 → Apr 30, 2026). Indicators (SMA/RSI/MACD/ADX/OBV/ATR) computed from source data. Stock at fresh 52-week high.',
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      download:'../AMD_Technical_Analysis_Report.docx',
      badges: [
        { label:'Verdict (short term)', value:'OVERBOUGHT', color:'var(--crimson)', sub:'RSI 83, Stoch 99, ADX 71' },
        { label:'Verdict (long term)',  value:'BULLISH',    color:'var(--mint)',    sub:'Above all 4 MAs, golden cross active' },
        { label:'Spot ($354.49)', value:'+0.00% from 52w', color:'var(--mint)', sub:'Apr 30, 2026 — fresh ATH' },
        { label:'Trend strength', value:'EXCEPTIONAL', color:'var(--mint)', sub:'ADX 71 (>40 = strong)' },
      ],
      dataSource:'AMD_1_JAN_24_30_APR_26.xlsx (Barchart export) · 584 trading sessions · Indicators computed from source'
    })}
    ${reportSection('Master technical dashboard', `
      ${reportImage('assets/amd/technical/01_master_dashboard.png','Figure 1. Price action with 4 MAs + RSI + MACD + Volume; vertical move into 52w high.')}
    `)}
    ${reportSection('Key technical levels', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Indicator','Value','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Spot (Apr 30, 2026 close)', '$354.49', 'New 52-week high'],
            ['52-week high', '$354.49 (Apr 30, 2026)', 'Just made today'],
            ['52-week low', '$96.65', '+267% rally from low'],
            ['SMA 20', '$277.74', 'Spot +27.6% above'],
            ['SMA 50', '$232.23', 'Spot +52.6% above'],
            ['SMA 100', '$226.38', 'Spot +56.6% above'],
            ['SMA 200', '$210.38', 'Spot +68.5% above'],
            ['RSI 14', '83.1', 'EXTREME OVERBOUGHT (>70)'],
            ['MACD', '+33.24 (signal +26.22; hist +7.02)', 'Bullish, expanding'],
            ['ATR 14', '$17.35 (4.90% of price)', 'Elevated volatility'],
            ['ADX 14', '71.2 (+DI 71 vs −DI 14)', 'EXCEPTIONAL trend strength'],
            ['Stoch %K', '99.6 (%D 87.1)', 'EXTREME OVERBOUGHT'],
            ['SMA 50 vs SMA 200', 'SMA 50 > SMA 200', 'Golden cross active since 2025-07-16'],
            ['60-day price change', '+77.08%', 'Parabolic move'],
            ['60-day OBV change', '+473.6M shares', 'Strong accumulation'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);">${r[2]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `)}
    ${reportSection('Bollinger band — last 130 sessions zoom', `
      ${reportImage('assets/amd/technical/02_bollinger_zoom.png','Figure 2. Last 130 sessions with Bollinger ±2σ. Price riding upper band — overbought.')}
    `)}
    ${reportSection('ADX directional system', `
      ${reportImage('assets/amd/technical/03_adx.png','Figure 3. ADX 71 = exceptional bull trend. +DI 71 dominant.')}
    `)}
    ${reportSection('ATR & volatility regime', `
      ${reportImage('assets/amd/technical/04_atr_volatility.png','Figure 4. ATR-based volatility regime. AMD trading at 4.90% daily ATR.')}
    `)}
    ${reportSection('OBV — volume-weighted accumulation', `
      ${reportImage('assets/amd/technical/05_obv_volume.png','Figure 5. OBV trending up with price = healthy accumulation.')}
    `)}
    ${reportSection('Final technical verdict', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);"><b style="color:var(--crimson);">Short-term (days–2 weeks):</b> EXTREME overbought conditions (RSI 83, Stoch %K 99.6). Mean-reversion risk is high. Avoid chasing rallies into the $400+ zone.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--mint);">Medium-term (1–3 months):</b> Trend strength is exceptional (ADX 71). Pullbacks to SMA 20 ($278) or SMA 50 ($232) are buyable in this regime.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--mint);">Long-term (6–18 months):</b> Bullish. Above all 4 MAs, golden cross active. Long-term uptrend invalidates only on weekly close below SMA 200 (~$210).</p>
    `)}`;
}

function amdOptionsPage() {
  return `
    ${reportHero({
      kicker:'OPTIONS — chain analysis · 5/9/26',
      title:'AMD — Options Positioning Analysis',
      subtitle:'Skew, vol surface, OI concentration, max-pain, dealer-gamma profile from the May 9, 2026 chain (2,343 contracts across 21 expiries). Spot at quote: $455.19 (per FactSet quote).',
      barColor:'var(--accent)',
      badges: [
        { label:'Front-month skew', value:'-12.6 vp', color:'var(--crimson)', sub:'Put IV > Call IV (hedging dominant)' },
        { label:'P/C OI ratio',     value:'1.04',     color:'var(--amber)',   sub:'Slightly bearish positioning' },
        { label:'P/C Vol ratio',    value:'0.59',     color:'var(--mint)',    sub:'Today's flow: bullish' },
        { label:'ATM IV (front)',   value:'60.5%',    color:'var(--amber)',   sub:'Elevated — parabolic-move premium' },
      ],
      dataSource:'AMD options chain (amd05082026.xlsx) · 5/9/26 · 2,343 contracts · 21 expiries through Dec 2028'
    })}
    ${reportSection('Options OI breakdown', `
      ${reportImage('assets/amd/options/01_oi_breakdown.png','Figure 1. Total open interest split — slightly more puts than calls.')}
    `)}
    ${reportSection('Top 10 OI strikes', `
      ${reportImage('assets/amd/options/02_top_oi_strikes.png','Figure 2. Strike concentration — protective put walls at $150-$210, call concentration at $400.')}
    `)}
    ${reportSection('ATM IV term structure', `
      ${reportImage('assets/amd/options/03_term_structure.png','Figure 3. Term structure — flat/slightly-rising 60-66% across all expiries.')}
    `)}
    ${reportSection('25Δ skew per expiry', `
      ${reportImage('assets/amd/options/04_volatility_smile.png','Figure 4. 25Δ skew uniformly negative — hedging dominant after the parabolic rally.')}
    `)}
    ${reportSection('Full implied vol surface (21 expiries)', `
      ${reportImage('assets/amd/options/07_volatility_surface.png','Figure 5. Full IV surface — strike × tenor × IV with 3D view, ATM term structure, and skew slices.')}
    `)}
    ${reportSection('Max-pain by expiry', `
      ${reportImage('assets/amd/options/05_max_pain.png','Figure 6. Max-pain anchored well below spot — dealer-positioning skewed toward lower print.')}
    `)}
    ${reportSection('First 5 weeks IV smile', `
      ${reportImage('assets/amd/options/06_first5w_smile.png','Figure 7. First-5-week vol smiles — sharp put-side richness; classic hedging skew.')}
    `)}
    ${reportSection('Final positioning verdict', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);"><b style="color:var(--amber);">Short term (7-15 days):</b> NEUTRAL-TO-CAUTIOUS. ATM IV 60.5% is elevated; skew negative; max-pain ($280-$340) is significantly below spot. Dealer flows want price to drift lower into expiry. Volatility-selling strategies (e.g. covered calls or cash-secured puts at $400) compelling here.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--mint);">Medium term (1-3 months):</b> NEUTRAL-TO-BULLISH. Term structure flat (no event-vol crowding). Implied move to year-end is ~28% in either direction.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--mint);">Long term (6-18 months):</b> BULLISH. LEAPS pricing structure shows consistent expectation of large moves; the put-side richness reflects hedging demand at extreme spot levels, not long-term bearish view.</p>
    `)}`;
}

function amdValuationPage() {
  const peers = AMD_FACTSET_PEERS.peers;
  const tgt = AMD_FACTSET_PEERS.target;
  const agg = AMD_FACTSET_PEERS.peer_aggregates;
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
    ${reportSection('Overview — premium across the comp set, especially on FY1', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">AMD trades at a <b style="color:var(--crimson);">significant premium</b> to its semi peer set on near-term multiples (P/E FY1 +64%, EV/EBITDA FY1 +109%) reflecting market expectation of a major earnings inflection from FY1 (currently being printed) to FY2 (calendar 2026 → 2027). On FY2 the premium narrows but remains elevated (P/E FY2 +13%, EV/EBITDA FY2 +36%).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">The notable item: <b style="color:var(--amber);">sell-side consensus target ($442.49) sits below current price ($455.19)</b> — analysts haven't yet caught up to the most recent rally. Historically this either resolves with rapid target revisions (positive for stock if growth continues) or with multiple compression (negative).</p>
    `)}
    ${reportSection('Forward P/E (FY1) — peer comparison', `
      ${reportImage('assets/amd/valuation/01_pe_bar.png','Figure 1. P/E FY1 bar — AMD highlighted; median and mean lines.')}
    `)}
    ${reportSection('EV/EBITDA (FY1) — peer comparison', `
      ${reportImage('assets/amd/valuation/02_ev_ebitda_bar.png','Figure 2. EV/EBITDA FY1 bar — AMD significantly above median.')}
    `)}
    ${reportSection('Premium/discount summary vs peer median', `
      ${reportImage('assets/amd/valuation/03_premium_discount.png','Figure 3. AMD vs peer median across multiples.')}
    `)}
    ${reportSection('Peer comp table — FactSet (5/8/26)', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">Captured from FactSet Workstation Web Comps Analysis page on 5/8/26 via the user's authenticated FactSet seat (Claude-in-Chrome browser tools).</p>
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
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.FCF_Yield_pct?row.FCF_Yield_pct.toFixed(2):'—'}%</td>
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
    `)}
    ${reportSection('Premium/discount justification', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">AMD's <b>+64% FY1 P/E premium</b> vs peer median is partly justified by its growth differential: AMD revenue YoY +37.85% vs peer median ~10-15% growth. The market is pricing the next leg of AI accelerator share gain plus margin expansion.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;">However, on <b>FY2 (calendar 2027)</b> the implied earnings inflection is enormous: P/E compresses from 62.21× to 35.41× requires ~75% EPS growth in one year. AMD is committed to ~35% revenue growth in FY 2026 — operating leverage on that revenue would need to drive an EBIT margin from current ~14% to ~22-24% for the FY2 P/E to be justified at current price.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b style="color:var(--amber);">The bear case:</b> if AMD grows revenue 30-35% but operating margin only expands to 18-19%, FY 2027 EPS would land closer to $9-10 vs implied $13-15 — meaning the stock is currently +30-50% over-valued at $455. The path matters as much as the destination.</p>
    `)}`;
}

function amdConsolidatedPage() {
  return `
    ${reportHero({
      kicker:'CONSOLIDATED — four-lens synthesis',
      title:'AMD — Consolidated Investment View',
      subtitle:'Synthesis across Fundamental, Technical, Options, and Valuation lenses. Three of four lenses BULLISH; one (valuation) cautious; technical sub-divides into short-term overbought / long-term bullish.',
      barColor:'var(--accent)',
      badges: [
        { label:'Fundamental', value:'BULLISH', color:'var(--mint)', sub:'+37.85% YoY · MCS 0.96 · 8/8 beats' },
        { label:'Technical (long)', value:'BULLISH', color:'var(--mint)', sub:'Above all 4 MAs · ADX 71 · golden cross' },
        { label:'Technical (short)', value:'OVERBOUGHT', color:'var(--crimson)', sub:'RSI 83 · Stoch 99' },
        { label:'Valuation', value:'EXPENSIVE', color:'var(--crimson)', sub:'P/E FY1 62× vs median 38× (+64%)' },
      ],
      dataSource:'Synthesis from all 4 AMD analytical lenses + FactSet peer multiples'
    })}
    ${reportSection('Synthesis matrix — by horizon', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Fundamental','Technical','Options','Valuation','Combined call','Action'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Short term (days–2 weeks)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">+37.85% YoY beat</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--crimson);">EXTREME OVERBOUGHT</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);">Hedging skew</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--crimson);">Premium</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:600;">DEFER</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">Don't chase rallies into $450+</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Medium term (1–3 months)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">Q2 26 likely beat</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">Strong trend</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">LEAPS at $1k+ strikes</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);">FY2 P/E +13%</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">ACCUMULATE on dip</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">Build at SMA 20 ($278) or SMA 50 ($232)</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Long term (6–18 months)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">35% YoY commit</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">BULLISH</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">Bullish positioning</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);">Multiple compression risk</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">HOLD / ADD</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">Target $500-550 by mid-2027</td>
          </tr>
        </tbody>
      </table>
      </div>
    `)}
    ${reportSection('The trade plan', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>For long-term capital with timing discipline:</b></p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:8px 0 14px 0;">
        <li>• <b>Tranche 1 (40%):</b> $300-330 zone — back to SMA 50 ($232) zone is a -27% pullback. Equivalent to 50× FY2 P/E (vs current 35×).</li>
        <li>• <b>Tranche 2 (30%):</b> $250-280 zone — back to SMA 20 ($278) range. Equivalent to FY2 P/E ~38× (in line with peer median).</li>
        <li>• <b>Tranche 3 (30%):</b> $200-230 zone — back near SMA 200 ($210). Major support zone; below 50% retracement of recent rally. Equivalent to FY2 P/E ~33×.</li>
      </ul>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>Hard stop:</b> Weekly close below $180 — would invalidate long-term uptrend (50% retracement of full rally + below SMA 200 trendline by ~14%).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Long-term target:</b> $500-550 by mid-2027 = ~10-20% upside from current. Reward/risk improves materially if entered on tranche 2 or 3 levels.</p>
    `)}
    ${reportSection('Path > destination', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">AMD's fundamentals tell us where it's going (continued AI-led data center share gain). Technicals tell us how it gets there (currently parabolic — a pullback is the more likely path). Valuation tells us what the market is willing to pay (premium pricing assumes the inflection lands).</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;">Today the path is over-extended; the destination — if Lisa Su's commitments hold — is materially higher. <b>Patience and tranching</b> are the two-word summary of the institutional view.</p>
    `)}`;
}
