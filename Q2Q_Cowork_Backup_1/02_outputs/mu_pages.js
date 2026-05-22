// ========================================================================
// MU Page Rendering Functions (added in MU build pass)
// ========================================================================

function muSummaryPage() {
  const n = DATA.narratives['MU'];
  const c = DATA.companies['MU'];
  return `
    ${reportHero({
      kicker:'EXECUTIVE SUMMARY',
      title:'MU — One-page forward view',
      subtitle: n.summary,
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      download:'',
      badges: [
        { label:'Forward view', value:'BULLISH', color:'var(--mint)', sub:'Long-term, with cycle-discipline' },
        { label:'MCS (info-adj)', value: fmtN(c.mcs_information_adjusted, 4), sub:'5 above-range / 3 in-range / 0 misses' },
        { label:'Latest revenue YoY', value:'+196%', color:'var(--mint)', sub:'Q2 FY26 — HBM/AI super-cycle' },
        { label:'Risk to monitor', value:'Cycle peak', color:'var(--amber)', sub:'P/E FY1 13× looks cheap on peak earnings' },
      ],
      dataSource:'SEC EDGAR XBRL · 9 MU 8-K press releases · 9 MU/Earnings 10-Q/10-K · 9 transcripts (post-call Q&A) · Barchart OHLCV · MU/Options · FactSet'
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
          ${['Metric','Baseline','Latest','Verdict'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${n.scoreboard.map(r=>`<tr>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);">${r.metric}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${r.baseline}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:600;">${r.latest}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:${STANCE_COLOR[r.verdict_color]||'var(--mint)'};font-weight:600;">${r.verdict||r.change||'—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`)}
    ${reportSection('Bottom line', `
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0 0 10px 0;">${n.bottom_line||''}</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0;"><b>Stance: <span style="color:${STANCE_COLOR[n.color]||'var(--text)'};">${(n.stance||'').toUpperCase()}</span></b>.</p>
      ${n.disclaimer ? `<div style="margin-top:14px;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);"><span style="font-size:11px;color:var(--muted);font-style:italic;line-height:1.55;"><b>Disclaimer:</b> ${n.disclaimer}</span></div>` : ''}
    `, { style:'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);' })}`;
}

function muFundamentalPage() {
  const c = DATA.companies['MU'];
  const toc = [
    { id:'mu-fa-overview', label:'Overview' },
    { id:'mu-fa-comparison', label:'Comparison table' },
    { id:'mu-fa-validation', label:'Revenue growth trajectory' },
    { id:'mu-fa-charts', label:'Charts' },
    { id:'mu-fa-commentary', label:'Mgmt commentary' },
    { id:'mu-fa-interpretation', label:'Institutional interpretation' },
    { id:'mu-fa-outlook', label:'Forward outlook' },
  ];
  return `
    ${reportHero({
      kicker:'FUNDAMENTAL — Q1 FY26 vs Q2 FY26 (HBM super-cycle peak)',
      title:'MU — Quarter-to-Quarter Comparative Analysis',
      subtitle:'Detailed financial comparison through the AI/HBM super-cycle. MUs Q2 FY26 was a record print — $23.86B revenue (+196% YoY), 74.4% gross margin, 67.6% operating margin, $12.07 diluted EPS.',
      barColor:'var(--accent)',
      badges: [
        { label:'Q2 FY26 verdict', value:'Beat & Raise', color:'var(--accent)', sub:'Revenue $23.86B vs $18.70B guide (+27.6%)' },
        { label:'Operating margin', value:'67.62%', color:'var(--mint)', sub:'Q2 FY26 (vs 44.98% Q1 FY26)' },
        { label:'EPS reported', value:'$12.07', color:'var(--mint)', sub:'+162% YoY vs $1.41 Q2 FY25' },
        { label:'Gross margin', value:'74.41%', color:'var(--mint)', sub:'Q2 FY26 (vs 56.04% Q1 FY26)' },
      ],
      dataSource:'SEC EDGAR XBRL · MU/Earnings/MU_FY2026Q2_*.htm 10-Q + MU 8-K press release ex99.1'
    })}
    ${reportTOC(toc)}

    ${reportSection('Overview', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Micron printed a blowout Q2 FY26: revenue $23.86B (+196% YoY) crushed the $18.30-19.10B guide range (+27.6% above mid). This is the most significant quarter in MUs history — operating margin reached 67.6%, gross margin 74.4%, and diluted EPS $12.07 (vs $1.41 in Q2 FY25). The sequential leap from $13.64B (Q1 FY26) to $23.86B was driven by AI accelerator demand for HBM3E/HBM4 from NVIDIAs Blackwell platform and AMDs MI400 ramp, alongside continued data-center DRAM strength.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">We are <b style="color:var(--mint);">BULLISH long-term, DEFER short-term</b>. The fundamental case is intact: MU is the only US-listed pure-play memory company at the heart of the AI super-cycle. But the rally has been parabolic (+770% over 12 months), the stock is 99.95% of the 52-week high, and FactSet sell-side consensus target ($588.59) sits 21% below current spot ($746.81). Memory cycles can compress margins 50-80% — accumulate at SMA 50 ($423) zone, not at $746+.</p>
    `, { id:'mu-fa-overview' })}

    ${reportSection('Q1 FY26 vs Q2 FY26 — detailed financial comparison', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">All figures from MU/Earnings/MU_FY2026Q2_0000723125-26-000006.htm (10-Q) cross-checked against SEC EDGAR XBRL.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Q1 FY26','Q2 FY26','Δ QoQ','Direction'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Total revenue', '$13.64B', '<b>$23.86B</b>', '+$10.22B (+74.9%)', 'HBM ramp blowout', 'mint'],
            ['YoY revenue growth', '+56.65%', '<b>+196.29%</b>', '+139.6 pp', 'HBM super-cycle', 'mint'],
            ['Cost of goods sold', '$6.00B', '$6.10B', '+$0.10B (+1.8%)', 'Modest cost growth', 'mint'],
            ['Gross profit', '$7.65B', '<b>$17.76B</b>', '+$10.11B (+132%)', 'HBM ASP/cost lift', 'mint'],
            ['Gross margin', '56.04%', '<b>74.41%</b>', '+1837 bps', 'Mix-driven expansion', 'mint'],
            ['Operating income', '$6.14B', '<b>$16.14B</b>', '+$10.00B (+163%)', 'Operating leverage', 'mint'],
            ['Operating margin', '44.98%', '<b>67.62%</b>', '+2264 bps', 'Cycle-peak margins', 'mint'],
            ['R&D expense', '$1.16B', '$1.25B', '+$94M (+8%)', 'Sustained investment', 'slate'],
            ['Net income', '$5.24B', '<b>$13.79B</b>', '+$8.54B (+163%)', 'Cycle-peak earnings', 'mint'],
            ['Net margin', '38.41%', '57.78%', '+1937 bps', 'Cycle-peak NM', 'mint'],
            ['Diluted EPS', '$4.60', '<b>$12.07</b>', '+$7.47 (+162%)', 'Earnings explosion', 'mint'],
            ['Operating cash flow', '$8.41B', '<b>$11.90B</b>', '+$3.49B (+41.5%)', 'OCF inflecting', 'mint'],
            ['Capital expenditures', '$5.39B', '$6.39B', '+$1.00B (+18.6%)', 'HBM capacity build', 'amber'],
            ['Free cash flow', '$3.02B', '<b>$5.52B</b>', '+$2.49B (+82.6%)', 'FCF strong', 'mint'],
            ['Inventory', '$8,205M', '$8,267M', '+$62M', 'Stable (HBM demand consuming bits)', 'mint'],
            ['Stockholders equity', '$33.80B', '<b>$47.59B</b>', '+$13.79B', 'Retained earnings', 'mint'],
            ['Q3 FY26 revenue guide', '$12.50B mid', '<b>$33.50B mid</b>', '+$21B (+168%)', 'Forecast acceleration', 'mint'],
            ['Q3 FY26 GM guide', '51.5% mid', '<b>~81% mid</b>', '+~3000 bps', 'GM peak forecast', 'mint'],
            ['Q3 FY26 EPS guide', '$3.75 mid', '<b>$19.15 mid</b>', '+$15.40 (+411%)', 'EPS guide explosion', 'mint'],
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
    `, { id:'mu-fa-comparison' })}

    ${reportSection('Revenue growth trajectory — through the memory cycle', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">MU's revenue trajectory is the textbook memory cycle, with a magnificent twist: the AI/HBM super-cycle has overlaid the regular industry cycle, producing a multi-quarter accelerating growth pattern:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>FY24 Q1</b>: $4.73B (cycle trough) — operating margin -23.87%, EPS -$1.12</li>
        <li>• <b>FY25 Q1</b>: $8.71B = +84.3% YoY (initial HBM ramp)</li>
        <li>• <b>FY25 Q2</b>: $8.05B = +38.3% YoY (consumer-end weakness, but HBM strong)</li>
        <li>• <b>FY25 Q3</b>: $9.30B = +36.6% YoY</li>
        <li>• <b>FY25 Q4</b>: $11.32B = +46.0% YoY (acceleration begins)</li>
        <li>• <b>FY26 Q1</b>: $13.64B = +56.7% YoY (HBM share gains accelerate)</li>
        <li>• <b>FY26 Q2</b>: <b style="color:var(--mint);">$23.86B = +196.3% YoY</b> (HBM3E/HBM4 super-cycle peak)</li>
      </ul>
      <p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.55;"><b>What's driving the growth.</b> NVIDIA Blackwell shipments + AMD MI400 ramp + hyperscaler AI server build-outs created HBM demand exceeding industry supply. MU's 1-gamma DRAM and G9 NAND nodes plus existing footprint efficiencies enable +20% bit shipment growth in FY26. HBM share has been climbing toward parity with MU's overall DRAM share (Sumit Sadana commentary across multiple calls).</p>
    `, { id:'mu-fa-validation' })}

    ${reportSection('Charts & visualizations', `
      ${reportImage('assets/mu/fundamental/01_revenue_trend.png','Figure 1. MU quarterly revenue trend — HBM super-cycle.')}
      ${reportImage('assets/mu/fundamental/02_yoy_growth.png','Figure 2. YoY revenue growth — accelerating into AI super-cycle.')}
      ${reportImage('assets/mu/fundamental/03_qoq_growth.png','Figure 3. QoQ growth — fiscal seasonality plus HBM acceleration.')}
      ${reportImage('assets/mu/fundamental/04_margin_trend.png','Figure 4. Margin trend — recovery from -23% (FY24 Q1 trough) to +67% (FY26 Q2 peak).')}
      ${reportImage('assets/mu/fundamental/05_eps_trend.png','Figure 5. Diluted EPS — through cycle from -$1.12 to $12.07 (10×).')}
      ${reportImage('assets/mu/fundamental/06_cashflow.png','Figure 6. Cash flow — OCF expansion + capex ramp; FCF inflection.')}
      ${reportImage('assets/mu/fundamental/07_capex.png','Figure 7. Capex trajectory — ramping into HBM capacity expansion.')}
      ${reportImage('assets/mu/fundamental/08_guidance_vs_actual.png','Figure 8. Forward revenue guide vs actual — 8/8 hit or beat the range.')}
      ${reportImage('assets/mu/fundamental/09_rd_intensity.png','Figure 9. R&D intensity declining as revenue scales.')}
    `, { id:'mu-fa-charts' })}

    ${reportSection('Management commentary highlights', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Tone across MUs Q1 FY26 and Q2 FY26 post-earnings analyst calls: <b style="color:var(--mint);">Confident on demand, capacity-constrained on supply.</b> Management consistently emphasizes structural HBM demand from AI accelerators outstripping supply.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        ${[
          ['Mark Murphy, CFO — Q2 FY26 (3/18/26)', "this FY '26, we increased our outlook on CapEx to over $25 billion, which was up from the $20 billion we did on the last earnings call."],
          ['Mark Murphy, CFO — Q1 FY26 (12/17/25)', "we are doing all we can to increase bit supply now. And we were able to provide additional bits to do 20% bit shipment growth in our fiscal '26."],
          ['Sumit Sadana, CBO — Q2 FY26 (3/18/26)', "we see very robust demand for NAND driven by growth in the data center. AI servers are using huge amounts of SSDs, high-capacity SSDs as well as high-performance and this is working really well in our favor because our portfolio is doing exceptionally well."],
          ['Sumit Sadana, CBO — Q3 FY25 (6/25/25)', "The strength in our view of the AI business, i.e., the data center growth, continues to be pretty robust."],
        ].map(q => `<div style="padding:10px 14px;background:rgba(99,102,241,.06);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;">
          <div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-bottom:4px;">${q[0]}</div>
          <div style="font-size:13px;font-style:italic;line-height:1.6;color:var(--text);">"${q[1]}"</div>
        </div>`).join('')}
      </div>
    `, { id:'mu-fa-commentary' })}

    ${reportSection('Institutional interpretation — cycle-aware', `
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">Why did MU sell off -3.77% on Q2 FY26 print despite the blowout?</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 16px 0;">
        <li>• <b>Stock had already priced in much of the cycle.</b> +770% over 12 months means a lot of upside was discounted.</li>
        <li>• <b>Q3 FY26 guide of $33.5B was actually a sequential acceleration but at "only" 11.0× the trough quarter.</b> Buy-the-rumor-sell-the-fact dynamics.</li>
        <li>• <b>Cycle-peak fears.</b> Memory historically peaks → corrects 50-80% over 4-6 quarters as bit-supply catches demand. Investors taking profit.</li>
        <li>• <b>Hyperscaler capex digestion.</b> Comments around 2027 capex moderation from cloud providers triggered concern.</li>
      </ul>
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">What hedge funds will focus on</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>HBM4 ramp execution.</b> 12-high HBM3E ramp + customer qualification cycles; ASP differential vs HBM3.</li>
        <li>• <b>FY27 EPS forecast.</b> Sell-side consensus implies ~$60-75 FY27 EPS; bear case $25-35 if margins normalize to 50%.</li>
        <li>• <b>Bit supply discipline.</b> All three majors (Samsung, SK Hynix, MU) discussing capex restraint to avoid commoditization.</li>
        <li>• <b>NAND supply repair.</b> Data-center SSD demand tightness offset by consumer NAND inventory build through 2025.</li>
        <li>• <b>FactSet target ($588.59) revisions.</b> Watch for $700-800 sell-side targets if Q3 FY26 print delivers.</li>
      </ul>
    `, { id:'mu-fa-interpretation' })}

    ${reportSection('Forward outlook — Q3 FY26 (3-month period ending May 28, 2026)', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Revenue:</b> Management guide $33.5B ± $750M (+30% QoQ). FactSet consensus also $33.86B. Market expects "in-range" beat.</li>
        <li>• <b>Operating income:</b> Management guide ~$31B (~92% margin if achieved). Margin sustainability is a key debate.</li>
        <li>• <b>EPS:</b> Management guide $19.15 ± $0.40; FactSet consensus $19.01. Both expect a 60%+ sequential EPS jump.</li>
        <li>• <b>Capex:</b> $7.0-8.0B run-rate; FY26 likely $25B+ (raised from $20B at Q1 FY26 print).</li>
      </ul>
      <p style="font-size:12px;color:var(--muted);margin-top:14px;font-style:italic;line-height:1.5;"><b>Disclaimer:</b> Memory companies are highly cyclical. The +91 percentage-point operating-margin recovery from FY24 Q1 trough to FY26 Q2 peak in just 6 quarters is unprecedented and not sustainable indefinitely. Cycle-peak earnings can compress 60-80% in a downturn.</p>
    `, { id:'mu-fa-outlook' })}`;
}

function muTechnicalPage() {
  const ta = MU_TA_LEVELS;
  const toc = [
    { id:'mu-ta-overview', label:'Verdict & dashboard' },
    { id:'mu-ta-trend', label:'Trend structure' },
    { id:'mu-ta-momentum', label:'Momentum' },
    { id:'mu-ta-volume', label:'Volume & accumulation' },
    { id:'mu-ta-sr', label:'Support & resistance' },
    { id:'mu-ta-pattern', label:'Pattern recognition' },
    { id:'mu-ta-volatility', label:'Volatility & earnings' },
    { id:'mu-ta-multi', label:'Multi-timeframe' },
    { id:'mu-ta-verdict', label:'Final verdict' },
  ];
  return `
    ${reportHero({
      kicker:'TECHNICAL — Daily bars · Jan 2024 → Apr 30, 2026',
      title:'MU — Daily Technical Study',
      subtitle:'584 daily OHLCV bars from Barchart export. MU stock has rallied +770% over the trailing 12 months, with a Golden Cross active since June 2025. Technical pattern is parabolic — bullish trend but extreme overbought conditions.',
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      badges: [
        { label:'Verdict (short term)', value:'OVERBOUGHT', color:'var(--crimson)', sub:'RSI 76, +88% above SMA 200' },
        { label:'Verdict (long term)', value:'BULLISH', color:'var(--mint)', sub:'Above all 4 MAs, golden cross active' },
        { label:'Spot ($517.16)', value:'-1.41% from 52w', color:'var(--mint)', sub:'Apr 30, 2026 — near ATH' },
        { label:'Trend strength', value:'STRONG', color:'var(--mint)', sub:'ADX 50 (>40 = strong)' },
      ],
      dataSource:'MU/Stock Price Data/MU_1_JAN_24_30_APR_26.xlsx (Barchart export) · 584 trading sessions'
    })}
    ${reportTOC(toc)}

    ${reportSection('Verdict & technical dashboard', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">MU has staged the most explosive rally in the entire dataset — <b>+772% from the 52-week low ($76.95, March 2025) to the recent 52-week high ($524.56)</b>. The chart is in a confirmed bull trend on every long-term metric, but every short-term oscillator screams "extended". The technical setup is clear: long-term holders should hold; new tactical longs should defer until the daily RSI works back toward neutral (50-60).</p>
      ${reportImage('assets/mu/technical/01_master_dashboard.png','Figure 1. Price action with 4 MAs + RSI + MACD + Volume; 6.7× rally over 12 months.')}
    `, { id:'mu-ta-overview' })}

    ${reportSection('Trend structure — bullish across all 4 moving averages', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The 4-MA stack is in <b>bullish alignment</b>: SMA 20 > SMA 50 > SMA 100 > SMA 200, and price is above all four. The Golden Cross (SMA 50 crossing above SMA 200) printed on <b>2025-06-27</b> at ~$120 and has remained valid through the rally to $517.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Moving avg','Value','Spot vs MA','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['SMA 20', '$452.97', '+14.2% above', 'Strong short-term'],
            ['SMA 50', '$423.17', '+22.2% above', 'Strong medium-term'],
            ['SMA 100', '$380.29', '+36.0% above', 'Strong intermediate'],
            ['SMA 200', '$274.89', '+88.1% above', 'Strong long-term — but extended'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--mint);font-weight:600;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${reportImage('assets/mu/technical/03_adx.png','Figure 2. ADX directional system. ADX 49.7 = strong bull trend; +DI 30 dominant over -DI 12.')}
    `, { id:'mu-ta-trend' })}

    ${reportSection('Momentum — overbought across major oscillators', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Short-term momentum oscillators are in <b style="color:var(--crimson);">overbought territory</b>:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Indicator','Value','Threshold','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['RSI 14', '75.7', '>70 overbought', 'OVERBOUGHT'],
            ['Stochastic %K', '85.6', '>80 overbought', 'OVERBOUGHT'],
            ['Stochastic %D', '84.9', '>80 overbought', 'OVERBOUGHT'],
            ['MACD', '+30.41', '>0 bullish', 'BULLISH (signal +23.21, hist +7.20)'],
            ['MACD vs Signal', 'MACD > Signal', 'positive cross', 'BULLISH momentum'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${r[3].includes('OVERBOUGHT')?'var(--crimson)':'var(--mint)'};font-weight:600;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Read:</b> RSI at 76 is overbought but not as extreme as AMD at 83. MUs setup permits more upside before mean-reversion triggers. MACD remains positive and accelerating.</p>
    `, { id:'mu-ta-momentum' })}

    ${reportSection('Volume & institutional accumulation', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">OBV confirms the rally is broad-based and institutionally supported.</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>60-day OBV change:</b> +${ta.obv_60d_change_M.toFixed(0)}M cumulative shares accumulated</li>
        <li>• <b>60-day price change:</b> ${ta.price_60d_change_pct >= 0 ? '+' : ''}${ta.price_60d_change_pct.toFixed(2)}%</li>
        <li>• <b>Reading:</b> OBV trending up with price = healthy bull trend with institutional buying.</li>
      </ul>
      ${reportImage('assets/mu/technical/05_obv_volume.png','Figure 3. OBV confirms the HBM-cycle rally with strong accumulation.')}
    `, { id:'mu-ta-volume' })}

    ${reportSection('Support & resistance levels', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">No formal resistance above current price (near 52-week high). Support stacks below:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Level','Price','Distance from spot','Significance'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Resistance — none above spot', '—', '—', 'Spot near 52w high; price discovery'],
            ['SMA 20 (immediate support)', '$452.97', '-12.4%', 'First major support'],
            ['SMA 50 (medium support)', '$423.17', '-18.2%', 'Second major support'],
            ['SMA 200 (LT support)', '$274.89', '-46.8%', 'Long-term trend support'],
            ['52w low', '$76.95', '-85.1%', 'Major LT support; cycle trough'],
            ['Hard stop suggestion', '$220', '-57.5%', 'Below SMA 200 = LT trend break'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--crimson);">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'mu-ta-sr' })}

    ${reportSection('Pattern recognition — vertical move into ATH', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Price has been riding the upper Bollinger band (+2σ) — a hallmark of strong-trend mode but also extreme overbought.</p>
      ${reportImage('assets/mu/technical/02_bollinger_zoom.png','Figure 4. Last 130 sessions with Bollinger ±2σ.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>Pattern read:</b> Clean uptrend with no reversal pattern (no head-and-shoulders, no double-top, no bearish engulfing on weekly). Momentum exhaustion signs but no breakdown structure yet.</p>
    `, { id:'mu-ta-pattern' })}

    ${reportSection('Volatility regime & earnings reactions', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">ATR 14 sits at $27.70 (5.36% of price) — elevated relative to historical MU volatility (~3-4%).</p>
      ${reportImage('assets/mu/technical/04_atr_volatility.png','Figure 5. ATR-based volatility regime.')}
      <h4 style="margin:14px 0 8px 0;color:var(--text);font-size:14px;">Earnings-day reactions (last 9 prints)</h4>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Call','Date','T-1→T+1','5-day','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Q2 FY24', '2024-03-20', '+16.86%', '+26.86%', 'Memory recovery cheered'],
            ['Q3 FY24', '2024-06-26', '−6.30%', '−3.05%', 'Some moderation'],
            ['Q4 FY24', '2024-09-25', '+16.89%', '+6.22%', 'HBM ramp confirmed'],
            ['Q1 FY25', '2024-12-18', '−19.81%', '−17.29%', 'Consumer DRAM weakness'],
            ['Q2 FY25', '2025-03-20', '−7.19%', '−10.68%', 'NAND oversupply concerns'],
            ['Q3 FY25', '2025-06-25', '−1.49%', '−4.82%', 'Mild fade'],
            ['Q4 FY25', '2025-09-23', '−1.77%', '+1.64%', 'Quick recovery'],
            ['Q1 FY26', '2025-12-17', '+6.90%', '+23.30%', 'HBM TAM raise (sentiment shift)'],
            ['Q2 FY26', '2026-03-18', '−3.77%', '−17.24%', 'Buy-rumor-sell-fact'],
          ].map(r => `<tr>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${r[2].startsWith('+')?'var(--mint)':'var(--crimson)'};font-weight:600;">${r[2]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${r[3].startsWith('+')?'var(--mint)':'var(--crimson)'};">${r[3]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[4]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p style="font-size:12px;color:var(--muted);margin-top:10px;line-height:1.55;font-style:italic;">Note: MUs Q2 FY26 print was a record (+196% YoY) but stock sold off −17.24% over 5 days as cycle-peak fears took hold. The Q1 FY26 print was the sentiment inflection (+23.30% 5-day) when the HBM TAM raise drove a re-rating.</p>
    `, { id:'mu-ta-volatility' })}

    ${reportSection('Multi-timeframe interpretation', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Signals','Verdict','What to do'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Short term (days–2 weeks)', 'RSI 76 · Stoch 86 · price near 52w high', 'OVERBOUGHT', "Don't chase $517+; wait for $450-470 retrace"],
            ['Medium term (1–3 months)', 'ADX 50 · golden cross active · OBV up', 'BULLISH', 'Buy pullbacks; SMA 20 ($453) is good entry'],
            ['Long term (6–18 months)', 'Above all 4 MAs · 60d +77% · LT trend intact', 'BULLISH', 'Hold; add at SMA 50 ($423) and SMA 100 ($380)'],
          ].map(r => `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[1]}</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:${r[2].includes('BULLISH')?'var(--mint)':'var(--crimson)'};font-weight:600;">${r[2]}</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:12px;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'mu-ta-multi' })}

    ${reportSection('Final technical verdict', `
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;"><b style="color:var(--crimson);">Short-term (days–2 weeks):</b> Overbought. RSI 76, Stochastic 86 — pullback risk elevated. Don't chase $517+.</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;margin-top:10px;"><b style="color:var(--mint);">Medium-term (1–3 months):</b> Trend strength is strong (ADX 50). Pullbacks to SMA 20 ($453) or SMA 50 ($423) are <b>buyable</b> in this regime.</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.6;margin-top:10px;"><b style="color:var(--mint);">Long-term (6–18 months):</b> Bullish. Above all 4 MAs, golden cross active since June 2025. LT uptrend invalidates only on weekly close below SMA 200 (~$275) or hard stop at $220.</p>
    `, { id:'mu-ta-verdict' })}`;
}

function muOptionsPage() {
  const m = MU_OPTIONS_METRICS;
  const toc = [
    { id:'mu-opt-snapshot', label:'Snapshot' },
    { id:'mu-opt-term', label:'IV term structure' },
    { id:'mu-opt-skew', label:'25Δ skew per expiry' },
    { id:'mu-opt-smile', label:'Volatility smile' },
    { id:'mu-opt-surface', label:'Volatility surface' },
    { id:'mu-opt-oi', label:'Open-interest concentration' },
    { id:'mu-opt-pcr', label:'Put/call ratios' },
    { id:'mu-opt-maxpain', label:'Max-pain & dealer gamma' },
    { id:'mu-opt-implied', label:'Implied moves' },
    { id:'mu-opt-shortwindow', label:'Short-term window 7-15d' },
    { id:'mu-opt-takeaways', label:'Bullish/bearish/neutral takeaways' },
  ];
  return `
    ${reportHero({
      kicker:'OPTIONS — chain analysis · 5/9/26',
      title:'MU — Options Positioning Analysis',
      subtitle:`Skew, vol surface, OI concentration, max-pain, term structure from the May 9, 2026 chain (3,421 contracts across 21 expiries). Spot at quote: $${m.spot}.`,
      barColor:'var(--accent)',
      badges: [
        { label:'Front-month skew', value:'-12.3 vp', color:'var(--crimson)', sub:'Put IV > Call IV (hedging dominant)' },
        { label:'P/C OI ratio', value:`${m.pcr_oi}`, color:'var(--amber)', sub:'Slightly bearish positioning' },
        { label:'P/C Vol ratio', value:`${m.pcr_vol}`, color:'var(--mint)', sub:'Today flow: bullish' },
        { label:'ATM IV (front)', value:`${m.term_structure[0].atm_iv}%`, color:'var(--amber)', sub:'Elevated — peak-cycle premium' },
      ],
      dataSource:'MU options chain (mu05082026.xlsx) · 5/9/26 · 3,421 contracts · 21 expiries through Dec 2028'
    })}
    ${reportTOC(toc)}

    ${reportSection('Snapshot — what the chain is saying', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The MU chain on 5/9/26 shows a market that is <b>hedged at peak-cycle pricing</b>. Protective skew (puts bid > calls) is uniformly negative across all expiries. P/C OI of ${m.pcr_oi} is slightly bearish but not panic. Today's volume is more balanced (P/C Vol ${m.pcr_vol}). ATM IV of 60-80% is elevated absolute level reflecting the parabolic move and cycle volatility.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:14px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Value','Reading'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Spot (chain capture)', `$${m.spot}`, 'Post-rally; near ATH'],
            ['Total OI (call + put)', `${((m.total_call_oi+m.total_put_oi)/1e3).toFixed(0)}K contracts`, 'Liquid'],
            ['Total volume today', `${((m.total_call_vol+m.total_put_vol)/1e3).toFixed(0)}K contracts`, 'Active'],
            ['P/C OI ratio', `${m.pcr_oi}`, 'Slight put bias'],
            ['P/C volume ratio', `${m.pcr_vol}`, 'Slightly bullish today'],
            ['Front-month ATM IV', `${m.term_structure[0].atm_iv}%`, 'Elevated cycle vol'],
            ['Front-month 25Δ skew', `${m.skew_25d_per_expiry[0].skew} vol pts`, 'Bearish (put IV > call IV)'],
          ].map(r => `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:12px;">${r[2]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'mu-opt-snapshot' })}

    ${reportSection('IV term structure — elevated', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">ATM IV is elevated 60-80% across the curve. Memory cycle volatility + AI demand uncertainty pricing in larger moves.</p>
      ${reportImage('assets/mu/options/03_term_structure.png','Figure 1. ATM IV term structure.')}
    `, { id:'mu-opt-term' })}

    ${reportSection('25Δ skew — uniformly negative across all expiries', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The 25-delta skew measures how much more put IV is bid relative to call IV. MU is uniformly negative, similar to AMD — protective hedging dominant after the rally.</p>
      ${reportImage('assets/mu/options/04_volatility_smile.png','Figure 2. 25Δ skew per expiry.')}
    `, { id:'mu-opt-skew' })}

    ${reportSection('Volatility smile — first 5 weeks', `
      ${reportImage('assets/mu/options/06_first5w_smile.png','Figure 3. First-5-week vol smiles — sharp put-side richness.')}
    `, { id:'mu-opt-smile' })}

    ${reportSection('Volatility surface — full strike × tenor heatmap', `
      ${reportImage('assets/mu/options/07_volatility_surface.png','Figure 4. Full IV surface across 21 expiries.')}
    `, { id:'mu-opt-surface' })}

    ${reportSection('Open-interest concentration', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Top OI strikes: $400, $300, $500 are the most heavily traded. Protective put walls at $200-$400, call concentration at $500-$700.</p>
      ${reportImage('assets/mu/options/02_top_oi_strikes.png','Figure 5. Top 10 OI strikes.')}
    `, { id:'mu-opt-oi' })}

    ${reportSection('Put/call ratios', `
      ${reportImage('assets/mu/options/01_oi_breakdown.png','Figure 6. P/C OI breakdown.')}
      <p style="font-size:13px;color:var(--text);margin-top:10px;line-height:1.55;"><b>P/C OI ${m.pcr_oi}</b> is slightly bearish — protective hedges from the rally. Today's flow P/C Vol ${m.pcr_vol} is closer to balanced.</p>
    `, { id:'mu-opt-pcr' })}

    ${reportSection('Max-pain & dealer-gamma', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Max-pain clusters between $300-$500 across the first 10 expiries — well below current spot. Dealers want price to drift back toward those levels.</p>
      ${reportImage('assets/mu/options/05_max_pain.png','Figure 7. Max-pain by expiry.')}
    `, { id:'mu-opt-maxpain' })}

    ${reportSection('Implied moves', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Using ATM IV × √(DTE/365), implied moves for MU:</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','DTE','ATM IV','1-σ implied move'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tbody>
        ${m.term_structure.slice(0,7).map(t => {
          const move = t.atm_iv/100 * Math.sqrt(t.dte/365) * MU_TA_LEVELS.spot;
          const pct = move/MU_TA_LEVELS.spot * 100;
          return `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${t.expiry} (${t.dte}d)</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${t.dte}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${t.atm_iv}%</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;color:var(--accent);">±$${move.toFixed(0)} (±${pct.toFixed(1)}%)</td>
          </tr>`;
        }).join('')}
      </table>
    `, { id:'mu-opt-implied' })}

    ${reportSection('Short-term window — next 7 to 15 days', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Bottom line for 7-15 day window: NEUTRAL-TO-CAUTIOUS. ATM IV elevated; max-pain anchors below spot; skew protective. Premium-selling strategies attractive.</p>
    `, { id:'mu-opt-shortwindow' })}

    ${reportSection('Bullish, bearish, and neutral takeaways', `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
        <div style="background:rgba(16,185,129,.08);border-left:3px solid var(--mint);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--mint);font-size:13px;">BULLISH signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• P/C Vol ${m.pcr_vol} — relatively balanced flow today</li>
            <li>• LEAPS calls at $700+ have meaningful OI</li>
            <li>• No outsized panic-bear positioning signature</li>
            <li>• Term structure pricing ~80% IV at long end (HBM cycle)</li>
          </ul>
        </div>
        <div style="background:rgba(245,158,11,.08);border-left:3px solid var(--amber);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--amber);font-size:13px;">NEUTRAL signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• P/C OI ${m.pcr_oi} — balanced positioning</li>
            <li>• Max-pain clustered $300-$500 (below spot)</li>
            <li>• ATM IV elevated but not extreme for memory</li>
          </ul>
        </div>
        <div style="background:rgba(239,68,68,.08);border-left:3px solid var(--crimson);padding:14px;border-radius:0 8px 8px 0;">
          <h4 style="margin:0 0 8px 0;color:var(--crimson);font-size:13px;">BEARISH signals</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px;line-height:1.55;">
            <li>• 25Δ skew uniformly negative</li>
            <li>• Heavy put OI at $200-$400 (downside hedges)</li>
            <li>• Protective puts at $300 strike: 58K contracts</li>
            <li>• Cycle-peak risk pricing at $200-$300 strikes</li>
          </ul>
        </div>
      </div>
    `, { id:'mu-opt-takeaways' })}`;
}

function muValuationPage() {
  const peers = MU_FACTSET_PEERS.peers;
  const tgt = MU_FACTSET_PEERS.target;
  const agg = MU_FACTSET_PEERS.peer_aggregates;
  const toc = [
    { id:'mu-val-method', label:'Data sources & methodology' },
    { id:'mu-val-overview', label:'Overview (cycle-aware)' },
    { id:'mu-val-multiples', label:'MU multiples' },
    { id:'mu-val-peers', label:'Peer comp table' },
    { id:'mu-val-charts', label:'Charts (FactSet 5/8/26)' },
    { id:'mu-val-relative', label:'Relative-valuation read' },
    { id:'mu-val-takeaways', label:'Takeaways — cycle interpretation' },
  ];
  return `
    ${reportHero({
      kicker:'VALUATION — peer comparables · 5/8/26',
      title:'MU — Trading Comparables Analysis (Cycle-Aware)',
      subtitle:'MU vs FactSet Semiconductor Memory peer set (SK Hynix, Nanya, etc.). Currency: USD (Local) for MU. Memory cyclicality means optical cheapness at peak should not be interpreted mechanically.',
      barColor:'var(--amber)',
      badges: [
        { label:'P/E (FY1)', value:'13.07×', color:'var(--amber)', sub:'Cycle-peak earnings make P/E look optically cheap' },
        { label:'EV/EBITDA (FY1)', value:'10.20×', color:'var(--amber)', sub:'-42% discount to peer median 17.62×' },
        { label:'Sell-side target', value:'$588.59', color:'var(--crimson)', sub:'21% BELOW current $746.81' },
        { label:'Avg rating', value:'Buy (1.19)', color:'var(--mint)', sub:'53 brokers covering' },
      ],
      dataSource:'FactSet Workstation Web · Comps Analysis (Semiconductor Memory peer set) · Captured 5/8/26 via Claude-in-Chrome'
    })}
    ${reportTOC(toc)}

    ${reportSection('Data sources & methodology', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">All multiples and consensus from <b>FactSet Workstation Web</b> (Snapshot + Comps Analysis pages), captured 5/8/26 via the user's authenticated FactSet seat (Claude-in-Chrome). MU underlying fundamentals reconciled vs SEC EDGAR XBRL company-facts API (CIK 0000723125) and 9 user-supplied 10-Q/10-K files in MU/Earnings/.</p>
      <p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.55;">FactSet's "Semiconductor Memory" peer set is heavily Asian (SK Hynix, Nanya, Winbond, Giga Device, Shenzhen Longsys, Biwin) — that's the natural memory peer set globally. For US-listed memory comparison, Western Digital (WDC) and Seagate (STX) would also be relevant but are NOT in the FactSet memory peer set.</p>
    `, { id:'mu-val-method' })}

    ${reportSection('Overview — cycle-peak valuation pattern', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">MU trades at a <b style="color:var(--amber);">discount</b> to its memory peer set on forward earnings (-30% P/E FY1, -42% EV/EBITDA FY1) and a <b>premium on P/Sales</b> (+83%). This is the <b>classic memory-cycle-peak signature</b>: when the cycle peaks, near-term earnings have spiked dramatically and the market rationally discounts them with a low multiple, anticipating cyclical compression. The 7.79× FY2 P/E is "late-cycle" pricing.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">Sell-side consensus target $588.59 sits 21% BELOW current spot $746.81. Analysts haven't fully captured the recent rally — OR they're already pricing in normalization.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Cycle-aware framing:</b> Memory companies historically experience 50-80% margin compression from peak to trough. MU's 67% operating margin in Q2 FY26 vs the ~15-25% historical mean suggests current earnings are at multi-cycle highs. A simple revert-to-mean haircut of 50% would bring FY27 EPS down to $30-50 vs the implied $96+ at current P/E — a meaningful gap if the cycle compresses.</p>
    `, { id:'mu-val-overview' })}

    ${reportSection('MU multiples — TTM and forward', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:700px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','TTM (FY26 H1)','FY1 (FactSet)','FY2 (FactSet)','Notes'].map(h=>`<th style="text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Revenue', '$58.16B', '$107.36B', '$172.99B', 'TTM EDGAR-verified; FY1/FY2 FactSet consensus'],
            ['Operating income', 'n/a', '$77.44B (72.1%)', '$135.57B (78.4%)', 'Cycle-peak margins forecasted'],
            ['EBITDA', 'n/a', '$83.81B (78.1%)', '$138.74B (80.2%)', 'FactSet consensus'],
            ['Diluted EPS', '$24.51 (calc.)', 'n/a', 'n/a', 'TTM = $27.7B NI / 1.13B shares'],
            ['Market cap (at $746.81)', '$861.38B', '—', '—', '1.153B fully-diluted shares × spot'],
            ['Enterprise value', '$854.87B', '—', '—', 'EV = MC + Debt - Cash; net cash $3.82B'],
            ['<b>P/E (LTM)</b>', '<b>35.26×</b>', '<b>13.07×</b>', '<b>7.79×</b>', 'TTM + FY1 + FY2 from FactSet'],
            ['<b>EV/EBITDA</b>', '<b>23.09×</b>', '<b>10.20×</b>', '<b>6.16×</b>', 'Cycle-peak forecast'],
            ['<b>P/Sales</b>', '<b>14.67×</b>', 'n/a', 'n/a', 'Premium reflects HBM moat'],
            ['<b>EV/Sales</b>', '<b>14.71×</b>', 'n/a', 'n/a', 'Same as P/S given net cash'],
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
    `, { id:'mu-val-multiples' })}

    ${reportSection('Peer comp table — FactSet (5/8/26)', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-bottom:10px;">Captured from FactSet Workstation Web Comps Analysis on 5/8/26. Mostly Asian memory peers; MU is the sole US-listed memory pure-play in this set.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;min-width:1200px;">
        <thead><tr style="background:var(--bg);">
          ${['Ticker','Price','Mkt cap','EV','P/E FY1','P/E FY2','EV/EBITDA FY1','EV/EBITDA FY2','P/Sales','EV/Sales','Rating'].map(h=>`<th style="text-align:left;padding:8px 7px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.04em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            { row: tgt, isTarget: true, name: 'MU' },
            ...peers.map(p=>({row:p, isTarget:false, name:p.name}))
          ].map(({row, isTarget, name}) => `<tr style="${isTarget?'background:rgba(16,185,129,.06);font-weight:600;':''}">
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);">${name}</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${row.price?row.price.toFixed(2):'—'}</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${(row.mkt_cap_B).toFixed(1)}B</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">$${(row.ev_B).toFixed(1)}B</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PE_FY1?row.PE_FY1.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PE_FY2?row.PE_FY2.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_EBITDA_FY1?row.EV_EBITDA_FY1.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_EBITDA_FY2?row.EV_EBITDA_FY2.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.PS_LTM?row.PS_LTM.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${row.EV_Sales_LTM?row.EV_Sales_LTM.toFixed(2):'—'}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);">${row.rating}</td>
          </tr>`).join('')}
          <tr style="background:var(--bg);font-weight:600;">
            <td colspan="4" style="padding:7px 7px;border-bottom:1px solid var(--border);text-align:right;">Peer Median</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PE_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PE_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_EBITDA_FY1.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_EBITDA_FY2.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.PS_LTM.toFixed(2)}×</td>
            <td style="padding:7px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${agg.median.EV_Sales_LTM.toFixed(2)}×</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'mu-val-peers' })}

    ${reportSection('Charts (FactSet 5/8/26)', `
      ${reportImage('assets/mu/valuation/01_pe_bar.png','Figure 1. P/E FY1 — MU is the cheapest in the comp set on forward earnings (cycle-peak signal).')}
      ${reportImage('assets/mu/valuation/02_ev_ebitda_bar.png','Figure 2. EV/EBITDA FY1 — MU at -42% discount to peer median.')}
      ${reportImage('assets/mu/valuation/03_premium_discount.png','Figure 3. MU vs peer median — discount on P/E + EV/EBITDA, premium on P/Sales.')}
    `, { id:'mu-val-charts' })}

    ${reportSection('Relative-valuation read', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">MU vs key peers:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>vs SK Hynix (000660-KR):</b> SK Hynix trades at 6.2× FY1 P/E vs MU 13.1×. Hynix is similarly cycle-peak earnings, but listed in KRW. Both pure-plays will track the cycle together.</li>
        <li>• <b>vs Nanya Technology (2408-TW):</b> 6.4× FY1 P/E. Pure-play DRAM, similar cycle-peak.</li>
        <li>• <b>vs broader Asian peers (Giga Device, Shenzhen Longsys, Biwin):</b> 18-115× P/E — wide range due to specialty/niche positioning.</li>
        <li>• <b>For US-listed memory comparison:</b> Western Digital (WDC) is HDD-focused with NAND exposure; Seagate (STX) is HDD pure-play. Both trade at lower multiples reflecting commoditized positioning.</li>
      </ul>
      <p style="font-size:13px;color:var(--text);margin-top:8px;line-height:1.55;"><b>Key insight:</b> MU is the highest-multiple US-listed memory peer because of HBM moat (vs commoditized DRAM). The premium is real but is compounded by cycle-peak earnings — proceed with cycle awareness.</p>
    `, { id:'mu-val-relative' })}

    ${reportSection('Takeaways — cycle interpretation', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;">
        <li>• <b>13× FY1 P/E is NOT cheap</b> — applies to peak-cycle FY26 earnings ($60+ EPS). If FY27 earnings normalize 50-70%, the implied FY27 P/E rises to 25-40×.</li>
        <li>• <b>FactSet target $588.59</b> implies analysts haven't caught up to the recent rally OR are already pricing in normalization. Watch for revisions to $700+.</li>
        <li>• <b>P/Sales 14.67× is the right pure-cycle metric</b> — this normalizes through the cycle and reflects HBM moat. Comparable to Asian memory peers' 8-12× P/S.</li>
        <li>• <b>Action:</b> Hold/add at $400-450 zone (FY1 P/E ~7-8× peak). Premium-paying entry above $700 not justified by cycle valuation — only by belief that HBM is permanently a 70%+ margin business.</li>
      </ul>
    `, { id:'mu-val-takeaways' })}`;
}

function muConsolidatedPage() {
  const toc = [
    { id:'mu-cons-fourLens', label:'Four-lens executive read' },
    { id:'mu-cons-stance', label:'Side-by-side stance grid' },
    { id:'mu-cons-options', label:'What the options tape adds' },
    { id:'mu-cons-strategy', label:'Long-term buy strategy — laddered entry' },
    { id:'mu-cons-cheatsheet', label:'Critical-level cheat sheet' },
    { id:'mu-cons-disagree', label:'Why fundamentals & technicals can disagree' },
    { id:'mu-cons-watch', label:'Open questions / what to watch next' },
  ];
  return `
    ${reportHero({
      kicker:'CONSOLIDATED — four-lens synthesis',
      title:'MU — Consolidated Investment View',
      subtitle:'Synthesis across Fundamental, Technical, Options, and Valuation lenses for the only US-listed pure-play memory company at AI/HBM super-cycle peak.',
      barColor:'var(--accent)',
      badges: [
        { label:'Fundamental', value:'BULLISH', color:'var(--mint)', sub:'+196% YoY · MCS 0.93 · 8/8 hits' },
        { label:'Technical (long)', value:'BULLISH', color:'var(--mint)', sub:'Above all 4 MAs · ADX 50 · golden cross' },
        { label:'Options', value:'NEUTRAL-BULL', color:'var(--amber)', sub:'Hedging skew · LEAPS calls' },
        { label:'Valuation', value:'CYCLE-PEAK', color:'var(--amber)', sub:'13× FY1 P/E on peak earnings' },
      ],
      dataSource:'Synthesis from all 4 MU analytical lenses + FactSet peer multiples'
    })}
    ${reportTOC(toc)}

    ${reportSection('Four-lens executive read', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>One-paragraph synthesis:</b> Micron is the only US-listed pure-play memory company at the heart of the AI/HBM super-cycle. Q2 FY26 was a record print — $23.86B revenue (+196% YoY), 67.6% operating margin, $12.07 diluted EPS. Stock has rallied +770% over 12 months. The fundamental case is intact (HBM4 demand exceeds supply through FY27); the long-term technical confirms a powerful uptrend; options market is hedged but not bearish. The valuation lens flags the cycle-peak signature: 13× FY1 P/E looks "cheap" until you realize earnings have spiked 11× from FY24 trough. Sell-side target $588.59 sits 21% below spot. Trade: BULLISH on long-term moat, DEFER short-term — wait for SMA 50 ($423) zone before adding.</p>
    `, { id:'mu-cons-fourLens' })}

    ${reportSection('Side-by-side stance grid', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:980px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Fundamental','Technical','Options','Valuation','Combined','Action'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Short term<br>(days–2 weeks)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">+196% YoY beat</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--crimson);">OVERBOUGHT (RSI 76)</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Hedging skew</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Cycle peak</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:600;">DEFER</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Don't chase $746+; wait for pullback</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Medium term<br>(1–3 months)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Q3 FY26 likely beat</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Strong trend</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">LEAPS at $700+</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Cycle-peak risk</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">ACCUMULATE</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Build at SMA 20 ($453) or SMA 50 ($423)</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid var(--border);"><b>Long term<br>(6–18 months)</b></td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">HBM moat real</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">BULLISH</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);">Bullish positioning</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--amber);">Cycle compression risk</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">HOLD</td>
            <td style="padding:10px;border-bottom:1px solid var(--border);font-size:11.5px;">Target $700-900 by mid-2027 if HBM moat persists</td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'mu-cons-stance' })}

    ${reportSection('What the options tape adds', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The options market provides a third independent vote that's distinct from fundamentals and technicals. For MU:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>The market is hedged at peak.</b> P/C OI 1.13 — investors paying for protection at extremes, not betting against the stock.</li>
        <li>• <b>LEAPS calls at $700+ have meaningful OI.</b> Institutional positioning aligned with bullish thesis through 2028.</li>
        <li>• <b>Term structure 60-80% IV.</b> Reflects memory cycle volatility + AI demand uncertainty pricing.</li>
        <li>• <b>Skew uniformly negative.</b> Cycle-peak hedging premium harvestable for income.</li>
      </ul>
    `, { id:'mu-cons-options' })}

    ${reportSection('Long-term buy strategy — laddered entry (cycle-aware)', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>For long-term capital with cycle discipline:</b> Three-tranche laddered entry with reward/risk improving sharply at lower entry levels.</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;">
        <thead><tr style="background:var(--bg);">
          ${['Tranche','Size','Range','Triggered by','FY1 P/E at entry','Notes'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Tranche T1', '40%', '$450 – $500', 'Pullback to ~SMA 20 zone', '~8× FY1 (peak)', 'First major support; RSI back to 50-60'],
            ['Tranche T2', '30%', '$380 – $430', 'SMA 100 zone reset', '~7× FY1 (peak)', 'Volatility reset; price stabilization'],
            ['Tranche T3', '30%', '$275 – $325', 'SMA 200 support', '~5× FY1 (peak)', 'Major LT support; ~50% retrace of 2025 rally'],
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
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:14px;"><b>HARD STOP:</b> Weekly close below $220 — would invalidate long-term uptrend (50% retracement of full rally + below SMA 200 by ~20%).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;"><b>12-18 MONTH TARGET:</b> $700-900 if HBM moat persists. Reward/risk improves materially if entered at tranche 2 or 3 levels.</p>
    `, { id:'mu-cons-strategy' })}

    ${reportSection('Critical-level cheat sheet', `
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">
          ${['Level','Price','Significance','Action'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Spot (5/8/26 FactSet)', '$746.81', 'Post-rally; near ATH', 'DEFER new longs'],
            ['52-week high', '$524.56 (4/2026)', 'Apr 2026 close', 'Reference point'],
            ['Pre-Q2 FY26 earnings', '$461.69', 'Closed before Mar 18 print', 'Pre-rally reference'],
            ['SMA 20', '$452.97', 'First major support', 'Tranche T1 entry'],
            ['SMA 50', '$423.17', 'Medium-term support', 'Tranche T1 entry'],
            ['SMA 100', '$380.29', 'Intermediate support', 'Tranche T2 entry'],
            ['SMA 200', '$274.89', 'LT trend support', 'Tranche T3 entry'],
            ['52-week low', '$76.95 (Mar 2025)', 'Cycle trough', 'Worst-case scenario'],
            ['Hard stop', '$220', 'Below SMA 200 by ~20%', 'Sell on weekly close below'],
            ['12-18m target (HBM moat persists)', '$700-900', '$45-60 FY27 EPS × 15-18× P/E', 'Reduce position'],
            ['Bear case target', '$300-400', 'Cycle compression scenario', 'Add aggressively'],
          ].map(r=>`<tr>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:12px;color:var(--muted);">${r[2]}</td>
            <td style="padding:7px 12px;border-bottom:1px solid var(--border);font-size:11.5px;font-weight:600;">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `, { id:'mu-cons-cheatsheet' })}

    ${reportSection('Why fundamentals & technicals can disagree (cycle-aware)', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">For MU specifically, the disconnect is structural to memory companies:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Fundamentals at cycle peak look amazing.</b> 67% operating margin, $12 EPS in a single quarter — these are unprecedented numbers but represent a moment in time.</li>
        <li>• <b>Technicals reflect that the market knows this is a cycle.</b> Selling pressure on Q2 FY26 print despite the blowout reflects investor instinct to take profits before the cycle compresses.</li>
        <li>• <b>The reconciliation:</b> MU could trade sideways for 2-4 quarters as earnings stabilize at high levels, then de-rate to mid-cycle multiples on any sign of moderation. Or the HBM moat could prove permanent and valuations re-rate higher.</li>
      </ul>
    `, { id:'mu-cons-disagree' })}

    ${reportSection('Open questions / what to watch next', `
      <h4 style="margin:0 0 10px 0;color:var(--text);font-size:14px;">Catalysts to monitor</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">
        <li>• <b>Q3 FY26 earnings (July 1, 2026).</b> $33.5B mid revenue guide; $19.15 EPS guide. Implied options move: ±$220 (30%).</li>
        <li>• <b>HBM4 ramp / customer qualifications.</b> NVIDIA, AMD, BRCM design wins.</li>
        <li>• <b>Supply discipline at Samsung, SK Hynix.</b> If competitors expand aggressively, cycle peak shortens.</li>
        <li>• <b>Sell-side target revisions.</b> $588.59 consensus is below current — track for upgrades to $700+.</li>
        <li>• <b>NAND oversupply.</b> Consumer NAND inventory build vs DRAM tightness.</li>
      </ul>
      <h4 style="margin:0 0 10px 0;color:var(--text);font-size:14px;">Open analytical questions</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• Is HBM moat permanent or commoditizing? Samsung HBM3E shipping; HBM4 still 1-2 years out.</li>
        <li>• What's "normalized" gross margin? 50% (mid-cycle) vs 30% (commodity DRAM) vs 65%+ (HBM mix-shifted)?</li>
        <li>• How does AI capex digestion in 2027 affect HBM TAM growth?</li>
        <li>• Will MU's greenfield NAND fab strategy (Boise + Singapore R&D) deliver meaningful FCF returns?</li>
      </ul>
    `, { id:'mu-cons-watch' })}`;
}
