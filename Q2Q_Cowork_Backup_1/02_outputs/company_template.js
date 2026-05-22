// ============================================================================
// CREDIBILITY DASHBOARD — INSTITUTIONAL RESEARCH TEMPLATE
// Four-section framework: Overview → Fundamentals → MCS → Investment View
// ============================================================================

// ----- Reusable components --------------------------------------------------

/** SourceBadge: small inline citation tag */
function sourceBadge(label, opts={}) {
  const style = opts.style || 'background:var(--bg);border:1px solid var(--border);color:var(--muted);';
  return `<span class="source-badge" style="display:inline-block;${style}font-size:10px;padding:2px 8px;border-radius:10px;font-weight:500;margin:2px 3px 2px 0;letter-spacing:.02em;">${label}</span>`;
}

/** SourceList: comma-separated stack of source badges */
function sourceList(sources, opts={}) {
  if (!sources || !sources.length) return '';
  return `<div class="source-list" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border);">
    <span style="font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--subtle);font-weight:600;margin-right:6px;">Sources</span>
    ${sources.map(s=>sourceBadge(s)).join('')}
  </div>`;
}

/** AnalystNote: distinct visual block for analyst interpretation. */
function analystNote(text, opts={}) {
  const flavor = opts.flavor || 'interp'; // 'interp' | 'implication'
  const label = opts.label || (flavor==='implication' ? 'Implication for Thesis' : 'Analyst Interpretation');
  const color = flavor==='implication' ? 'var(--mint)' : 'var(--accent)';
  const bg = flavor==='implication' ? 'rgba(16,185,129,.06)' : 'rgba(99,102,241,.06)';
  return `<div class="analyst-note" style="margin:10px 0;padding:11px 14px;background:${bg};border-left:3px solid ${color};border-radius:0 8px 8px 0;">
    <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:${color};font-weight:700;margin-bottom:4px;">▸ ${label}</div>
    <div style="font-size:13px;line-height:1.6;color:var(--text);">${text}</div>
  </div>`;
}

/** Empty-state block — used when a subsection has no data for the ticker */
function emptyState(msg) {
  return `<div style="padding:18px 16px;background:var(--bg);border:1px dashed var(--border);border-radius:8px;text-align:center;">
    <div style="font-size:12.5px;color:var(--muted);font-style:italic;">${msg||'Data not yet available for this company.'}</div>
  </div>`;
}

/** Analytical card: wraps content with title, source badges, optional analyst note */
function analyticalCard(opts) {
  // opts: { title, body, sources, interp, implication, id, style }
  return `<div class="card card-pad anim" ${opts.id?`id="${opts.id}"`:''} style="margin-bottom:14px;${opts.style||''}">
    ${opts.title?`<div class="section-title" style="font-size:13px;margin-bottom:10px;">${opts.title}</div>`:''}
    ${opts.body||''}
    ${opts.interp ? analystNote(opts.interp, {flavor:'interp'}) : ''}
    ${opts.implication ? analystNote(opts.implication, {flavor:'implication'}) : ''}
    ${opts.sources ? sourceList(opts.sources) : ''}
  </div>`;
}

// ----- Helper: per-quarter MCS interpretations -------------------------------

/**
 * For each q_to_q pair, derive an analyst interpretation + implication.
 * If the data has pair.analyst_interp / pair.implication set, use those.
 * Otherwise auto-generate from delta vs guide.
 */
function deriveMCSInterp(pair, ticker) {
  if (pair.analyst_interp && pair.implication) {
    return { interp: pair.analyst_interp, implication: pair.implication };
  }
  
  const sm = pair.summary_metrics || {};
  const li = (pair.line_items||[]).find(x => x.metric_kind==='revenue') || {};
  const delta = sm.revenue_delta_pct;
  const verdict = (li.verdict||'').toLowerCase();
  const actual = sm.revenue_actual_b;
  const guide = sm.revenue_guide_mid_b;
  const r1d = sm.stock_reaction_1d_pct;
  const r5d = sm.stock_reaction_5d_pct;
  
  // Derive interpretation by ticker context and verdict type
  let interp = '';
  let implication = '';
  
  if (verdict.startsWith('beat')) {
    if (delta > 15) {
      interp = `The +${delta.toFixed(1)}% beat versus management's guide midpoint of $${guide}B is a magnitude that signals demand was running far ahead of the company's own internal models. Management forecasts memory or compute cycles based on bookings and bit-shipment lead times; a 15%+ above-range print implies the bookings book inflected mid-quarter — a leading indicator of structural demand pull, not channel fill.`;
      implication = `Translate to thesis: end-market traction is accelerating faster than guidance frameworks can capture. Watch for (1) next-quarter guide raise that materially exceeds sell-side consensus, (2) gross-margin trajectory confirming pricing power, (3) hyperscaler / customer concentration commentary in the next call. Risk: such beats often precede consensus chase-buying that compresses near-term reward/risk.`;
    } else if (delta > 5) {
      interp = `The +${delta.toFixed(1)}% beat clears the high end of the guide range, indicating management was conservative on either bit-supply, pricing, or customer ramp pace. A beat of this magnitude is generally reflective of better-than-modelled execution rather than a structural inflection.`;
      implication = `Implication: management is sandbagging modestly, which preserves credibility but caps the upside surprise on next-quarter consensus. Re-rating typically requires sustained 3+ quarter pattern. Monitor whether guidance widens or narrows next quarter.`;
    } else {
      interp = `The +${delta.toFixed(1)}% beat is within the typical "managed beat" range, where management consistently delivers slightly above midpoint to maintain credibility. This signals execution discipline without forward-demand acceleration.`;
      implication = `Implication: status quo on thesis — credibility intact, no incremental data points to revise the model. Multiple expansion requires inflection in the underlying operating drivers (gross margin, end-market mix), not just topline beats.`;
    }
  } else if (verdict.startsWith('in-line')) {
    interp = `Revenue landed inside the guide range at +${delta?delta.toFixed(2):'0'}% from midpoint. This is the management-credibility default outcome: the forecast was accurate and execution followed the plan. The market reads this as neutral on incremental thesis.`;
    implication = `Implication: no change to the underlying narrative. For a stock priced for acceleration, in-line prints can disappoint; for a stock priced for cycle compression, in-line prints offer optionality. Read in context of the multiple paid.`;
  } else if (verdict.startsWith('miss')) {
    interp = `Revenue missed the guide range by ${delta?delta.toFixed(2):'?'}%. Misses are rare in a properly-guiding company and signal one of: (1) end-market demand deceleration, (2) supply-chain disruption, (3) one-time event the company couldn't model. Material risk if the explanation maps to (1).`;
    implication = `Implication: investigate the explanation. If demand-driven, the thesis is impaired and consensus needs to come down. If supply / one-time, the next-quarter print determines whether the miss is signal or noise.`;
  } else {
    interp = `Outcome ${verdict||'pending review'} — requires deeper analysis of guidance composition, segment-level mix, and one-time items.`;
    implication = `Implication: collect additional data points before adjusting thesis.`;
  }
  
  // Augment with stock-reaction interpretation
  if (r1d != null) {
    const reactSign = r1d > 0 ? 'positive' : r1d < 0 ? 'negative' : 'flat';
    const magnitude = Math.abs(r1d);
    if (magnitude > 10) {
      interp += `<br><br><b>Market reaction:</b> ${r1d.toFixed(1)}% on day-after — a ${magnitude>15?'severe':'pronounced'} ${reactSign} response that ${r1d<0?'rejects the print quality or flags forward-guidance concerns':'embraces the upside as durable'}.`;
    } else if (magnitude > 3) {
      interp += `<br><br><b>Market reaction:</b> ${r1d.toFixed(2)}% on day-after — moderate ${reactSign} response. Typical of an in-line-to-modest-beat dynamic where the print itself is digested without major repricing.`;
    } else {
      interp += `<br><br><b>Market reaction:</b> ${r1d.toFixed(2)}% on day-after — muted response, consistent with a print that was already priced in.`;
    }
  }
  
  return { interp, implication };
}

// ============================================================================
// SECTION 1 — COMPANY OVERVIEW
// ============================================================================

function overviewSection(ticker, c, n) {
  if (!c) return analyticalCard({ title:'Company Overview', body: emptyState() });
  const f = c.fundamentals || {};
  const s = f.summary || {};
  const stance = (n && n.stance) || '—';
  const stanceColor = n && STANCE_COLOR[n.color] || 'var(--accent)';
  
  // Compose key facts from FactSet snapshot data if available  
  const fs = (typeof window!=='undefined' && window[`${ticker}_FACTSET_SNAPSHOT`]) || null;
  const muFs = ticker==='MU' && typeof MU_FACTSET_PEERS!=='undefined' ? MU_FACTSET_PEERS.target : null;
  const amdFs = ticker==='AMD' && typeof AMD_FACTSET_PEERS!=='undefined' ? AMD_FACTSET_PEERS.target : null;
  
  // Basic stats from fundamentals.summary
  const stats = [];
  if (s.latest_revenue_b != null) stats.push({label:'Latest Q revenue', value:`$${s.latest_revenue_b}B`, sub:s.latest_quarter||''});
  if (s.ttm_revenue_b != null) stats.push({label:'TTM revenue', value:`$${s.ttm_revenue_b}B`, sub:`${s.ttm_revenue_yoy_pct?'+':''}${s.ttm_revenue_yoy_pct||0}% YoY`});
  if (s.latest_operating_margin_pct != null) stats.push({label:'Operating margin (Q)', value:`${s.latest_operating_margin_pct}%`, sub:s.latest_quarter||''});
  if (s.latest_eps != null) stats.push({label:'Diluted EPS (Q)', value:`$${s.latest_eps}`, sub:`${s.yoy_revenue_growth_pct?'rev +':''}${s.yoy_revenue_growth_pct||''}${s.yoy_revenue_growth_pct?'% YoY':''}`});
  
  return `
    ${reportHero({
      kicker:'COMPANY OVERVIEW',
      title:`${ticker} — Institutional Research Profile`,
      subtitle:(n && n.summary) || 'Profile data pending.',
      barColor: stanceColor,
      badges: stats.map(st=>({label:st.label, value:st.value, sub:st.sub, color: stanceColor})),
      dataSource:`10-K business description · latest 10-Q · stock-price dataset`
    })}
    ${analyticalCard({
      title:'Business summary',
      body: (n && n.summary) ? `<p style="font-size:13.5px;line-height:1.6;color:var(--text);margin:0;">${n.summary}</p>` : emptyState(),
      sources: ['10-K (Item 1: Business)', '10-Q (latest)', 'Earnings transcripts'],
    })}
    ${s.latest_quarter ? analyticalCard({
      title:'Key statistics (latest quarter)',
      body:`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
        ${[
          ['Latest quarter', s.latest_quarter || '—'],
          ['Revenue', s.latest_revenue_b!=null?`$${s.latest_revenue_b}B`:'—'],
          ['Net income', s.latest_net_income_b!=null?`$${s.latest_net_income_b}B`:'—'],
          ['Diluted EPS', s.latest_eps!=null?`$${s.latest_eps}`:'—'],
          ['Gross margin', s.latest_gross_margin_pct!=null?`${s.latest_gross_margin_pct}%`:'—'],
          ['Operating margin', s.latest_operating_margin_pct!=null?`${s.latest_operating_margin_pct}%`:'—'],
          ['Net margin', s.latest_net_margin_pct!=null?`${s.latest_net_margin_pct}%`:'—'],
          ['OCF (Q)', s.latest_ocf_b!=null?`$${s.latest_ocf_b}B`:'—'],
          ['Capex (Q)', s.latest_capex_b!=null?`$${s.latest_capex_b}B`:'—'],
          ['FCF (Q)', s.latest_fcf_b!=null?`$${s.latest_fcf_b}B`:'—'],
          ['Current ratio', s.latest_current_ratio!=null?s.latest_current_ratio:'—'],
          ['LT debt/equity', s.latest_long_debt_to_equity!=null?s.latest_long_debt_to_equity:'—'],
          ['ROE (Q ann.)', s.latest_roe_q_annualized_pct!=null?`${s.latest_roe_q_annualized_pct}%`:'—'],
          ['DSO (days)', s.latest_dso_days!=null?s.latest_dso_days:'—'],
        ].map(([k,v])=>`<div class="mini-card" style="margin:0;"><div class="mini-card-label">${k}</div><div class="mini-card-value tabular" style="font-size:14px;">${v}</div></div>`).join('')}
      </div>`,
      sources:['SEC EDGAR XBRL company-facts API', '10-Q / 10-K (Item 1A, Item 7)', 'XBRL extraction'],
    }) : ''}
    ${f.market_cap_note ? analyticalCard({
      title:'Market capitalization context',
      body:`<p style="font-size:13px;line-height:1.6;color:var(--text);margin:0;">${f.market_cap_note}</p>`,
      sources:['FactSet Snapshot', 'Stock-price dataset', 'Diluted-share count from latest 10-Q'],
    }) : ''}
  `;
}

// ============================================================================
// SECTION 2 — FUNDAMENTALS (quant-only: 8Q, balance sheet, valuation, bull/bear)
// ============================================================================

function fundamentalsSection(ticker, c, n) {
  if (!c || !c.fundamentals) {
    return analyticalCard({ title:'Fundamentals', body: emptyState() });
  }
  const f = c.fundamentals;
  const s = f.summary || {};
  const qs = f.quarters || [];
  
  // Find chart assets for this ticker
  const chartBase = ticker==='META' ? 'assets' : `assets/${ticker.toLowerCase()}`;
  
  // 8Q financial trend table
  const trendTable = qs.length ? `
    <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">${qs.length} quarters of XBRL-derived data. Q4 derived from FY 10-K minus YTD-Q3 10-Q where applicable.</p>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;min-width:880px;">
      <thead><tr style="background:var(--bg);">
        ${['Period','Revenue ($B)','OI ($B)','NI ($B)','Diluted EPS','GM %','OM %','NM %','OCF ($B)','Capex ($B)','FCF ($B)'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;">${h}</th>`).join('')}
      </tr></thead><tbody>
      ${qs.map(q=>`<tr>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11.5px;">FY${q.fy} Q${q.fq}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.rev_q_M!=null?(q.rev_q_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.oi_q_M<0?'var(--crimson)':'var(--text)'};">${q.oi_q_M!=null?(q.oi_q_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.ni_q_M<0?'var(--crimson)':'var(--text)'};">${q.ni_q_M!=null?(q.ni_q_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.eps<0?'var(--crimson)':'var(--text)'};">$${q.eps!=null?q.eps:'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.gross_margin_pct!=null?q.gross_margin_pct.toFixed(1):'—'}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.operating_margin_pct<0?'var(--crimson)':'var(--text)'};">${q.operating_margin_pct!=null?q.operating_margin_pct.toFixed(1):'—'}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.net_margin_pct!=null?q.net_margin_pct.toFixed(1):'—'}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.ocf_q_M!=null?(q.ocf_q_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.capex_q_M!=null?(q.capex_q_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.fcf_q_M<0?'var(--crimson)':'var(--text)'};">${q.fcf_q_M!=null?(q.fcf_q_M/1000).toFixed(2):'—'}</td>
      </tr>`).join('')}
      </tbody></table></div>` : emptyState();

  // Balance-sheet table
  const balanceTable = qs.length && qs[0].equity_M!=null ? `
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;min-width:780px;">
      <thead><tr style="background:var(--bg);">
        ${['Period','Equity ($B)','Current ratio','LT debt/equity','ROE (ann)','DSO (days)','Inventory ($B)'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;">${h}</th>`).join('')}
      </tr></thead><tbody>
      ${qs.map(q=>`<tr>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11.5px;">FY${q.fy} Q${q.fq}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.equity_M!=null?(q.equity_M/1000).toFixed(2):'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.current_ratio!=null?q.current_ratio:'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.long_debt_to_equity!=null?q.long_debt_to_equity:'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${q.roe_q_annualized_pct<0?'var(--crimson)':'var(--text)'};">${q.roe_q_annualized_pct!=null?q.roe_q_annualized_pct.toFixed(2):'—'}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.dso_days!=null?q.dso_days:'—'}</td>
        <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${q.inventory_M!=null?(q.inventory_M/1000).toFixed(2):'—'}</td>
      </tr>`).join('')}
      </tbody></table></div>` : '';

  // Charts
  const chartList = [
    ['01_revenue_trend','Revenue trend'],
    ['02_yoy_growth','YoY revenue growth'],
    ['03_qoq_growth','QoQ revenue growth'],
    ['04_margin_trend','Margin trend (GM / OM / NM)'],
    ['05_eps_trend','Diluted EPS trend'],
    ['06_cashflow' ,'Cash flow comparison'],
    ['07_capex' ,'Capex trajectory'],
    ['08_guidance_vs_actual','Guidance vs actual'],
    ['09_rd_intensity','R&D intensity'],
  ];
  const chartsSection = chartList.map(([slug, lbl]) => {
    const candidates = [`${chartBase}/fundamental/${slug}.png`,`${chartBase}/fundamental/${slug.replace('06_cashflow','06_cashflow_q1')}.png`,`${chartBase}/fundamental/${slug.replace('07_capex','07_capex_trajectory')}.png`];
    // Just use the first slug; if it doesn't exist the browser will show alt text
    return reportImage(candidates[0], lbl);
  }).join('');

  // Bull case (migrated from narrative)
  const bullBody = n && n.bull && n.bull.length ? `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:0;">
    ${n.bull.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);font-weight:700;flex-shrink:0;">+</span><span>${b}</span></li>`).join('')}
  </ul>` : emptyState();

  const bearBody = n && n.bear && n.bear.length ? `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:0;">
    ${n.bear.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);font-weight:700;flex-shrink:0;">−</span><span>${b}</span></li>`).join('')}
  </ul>` : emptyState();

  // Valuation: pull from ticker-specific factset peers if available
  const fpVar = `${ticker}_FACTSET_PEERS`;
  let valuationBody = emptyState('Valuation peer-comp data not yet available for this company.');
  let valuationSources = ['SEC EDGAR XBRL'];
  if (typeof globalThis !== 'undefined' && globalThis[fpVar]) {
    const fp = globalThis[fpVar];
    const t = fp.target||{};
    const agg = fp.peer_aggregates||{};
    const med = agg.median||{};
    valuationBody = `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;min-width:780px;">
      <thead><tr style="background:var(--bg);">
        ${['Metric',`${ticker} value`,'Peer median','vs median','Notes'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;">${h}</th>`).join('')}
      </tr></thead><tbody>
        ${[
          ['P/E FY1', t.PE_FY1, med.PE_FY1, 'Forward earnings multiple'],
          ['P/E FY2', t.PE_FY2, med.PE_FY2, 'Second-year forward'],
          ['EV/EBITDA FY1', t.EV_EBITDA_FY1, med.EV_EBITDA_FY1, 'Capital-structure-neutral'],
          ['EV/EBITDA FY2', t.EV_EBITDA_FY2, med.EV_EBITDA_FY2, ''],
          ['P/Sales LTM', t.PS_LTM, med.PS_LTM, ''],
          ['EV/Sales LTM', t.EV_Sales_LTM, med.EV_Sales_LTM, ''],
        ].map(r => {
          if (r[1]==null || r[2]==null) return '';
          const prem = ((r[1]/r[2])-1)*100;
          const sign = prem>=0?'+':'';
          const color = prem>15?'var(--crimson)':(prem<-15?'var(--mint)':'var(--amber)');
          return `<tr>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[1].toFixed(2)}×</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${r[2].toFixed(2)}×</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${color};font-weight:600;">${sign}${prem.toFixed(1)}%</td>
            <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted);">${r[4]}</td>
          </tr>`;
        }).join('')}
      </tbody></table></div>`;
    valuationSources = ['FactSet Workstation Web — Comps Analysis', 'Captured 5/8/26', 'Peer set as defined by FactSet Peer Groups'];
  }

  // Trend interpretation — analyst note on the data
  let trendInterp = '';
  if (qs.length >= 4) {
    const recent = qs[qs.length-1];
    const yearAgo = qs[Math.max(0, qs.length-5)];
    const revGrowth = yearAgo.rev_q_M ? ((recent.rev_q_M/yearAgo.rev_q_M)-1)*100 : null;
    const omChange = (recent.operating_margin_pct||0) - (qs[0].operating_margin_pct||0);
    const epsChange = qs[0].eps ? (((recent.eps||0)/(qs[0].eps||1))-1)*100 : null;
    
    trendInterp = `Revenue ${revGrowth!=null?(revGrowth>0?'expanded':'compressed')+' by '+Math.abs(revGrowth).toFixed(1)+'% YoY in the latest reported quarter':'trend data limited'}. Operating margin has ${omChange>0?'expanded':'compressed'} by ${Math.abs(omChange).toFixed(1)} pp over the ${qs.length}-quarter window, ${omChange>10?'a structural inflection that typically reflects operating leverage on a top-line ramp':omChange>0?'consistent with execution discipline':'reflecting cyclical or competitive pressure'}. ${epsChange!=null && epsChange>100?'Earnings have more than doubled from the trough, signalling the inflection has translated through to bottom-line returns to shareholders.':''}`;
  }

  return `
    ${reportHero({
      kicker:'FUNDAMENTALS — quantitative analysis',
      title:`${ticker} — Eight-Quarter Financial & Operational Analysis`,
      subtitle:'Pure quantitative review: revenue, margin, EPS, balance-sheet, and capital-allocation trends, with bull/bear thesis and valuation context. Transcript interpretation lives in the next section.',
      barColor:'var(--accent)',
      dataSource:'SEC EDGAR XBRL · 10-K / 10-Q filings · Earnings presentations · Stock-price dataset'
    })}
    ${analyticalCard({
      title:'Eight-quarter financial trends',
      body: trendTable,
      interp: trendInterp,
      sources:['SEC EDGAR XBRL company-facts API','10-Q / 10-K filings','XBRL extraction'],
    })}
    ${balanceTable ? analyticalCard({
      title:'Balance-sheet analysis',
      body: balanceTable,
      sources:['SEC EDGAR XBRL (StockholdersEquity / AssetsCurrent / LiabilitiesCurrent / AccountsReceivable / LongTermDebt instant tags)','10-Q / 10-K filings'],
    }) : ''}
    ${analyticalCard({
      title:'Quantitative charts',
      body: chartsSection,
      sources:['SEC EDGAR XBRL','10-K / 10-Q filings'],
    })}
    ${analyticalCard({
      title:'Bull case (quantitative thesis)',
      body: bullBody,
      sources:['SEC EDGAR XBRL','10-K / 10-Q filings','Earnings presentations'],
      style:'border-left:3px solid var(--mint);',
    })}
    ${analyticalCard({
      title:'Bear case (quantitative thesis)',
      body: bearBody,
      sources:['SEC EDGAR XBRL','10-K / 10-Q filings','Earnings presentations','FactSet (consensus targets)'],
      style:'border-left:3px solid var(--crimson);',
    })}
    ${analyticalCard({
      title:'Valuation discussion',
      body: valuationBody,
      sources: valuationSources,
    })}
  `;
}

// ============================================================================
// SECTION 3 — MANAGEMENT COMMENTARY & MCS
// Rebuilt around: What Said → Actual → Analyst Interpretation → Implication
// ============================================================================

function mcsSection(ticker, c, n) {
  if (!c) return analyticalCard({ title:'Management Commentary & Credibility', body: emptyState() });
  const qa = c.q2q_analysis || {};
  const pairs = qa.q_to_q_pairs || [];
  
  // MCS aggregate metrics
  const aggMetrics = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">MCS (simple)</div><div class="mini-card-value tabular" style="font-size:16px;">${c.mcs_simple!=null?c.mcs_simple.toFixed(4):'—'}</div></div>
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">MCS (info-adj)</div><div class="mini-card-value tabular" style="font-size:16px;">${c.mcs_information_adjusted!=null?c.mcs_information_adjusted.toFixed(4):'—'}</div></div>
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">MCS (diff-w)</div><div class="mini-card-value tabular" style="font-size:16px;">${c.mcs_difficulty_weighted!=null?c.mcs_difficulty_weighted.toFixed(4):'—'}</div></div>
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">Beats</div><div class="mini-card-value tabular" style="font-size:16px;color:var(--mint);">${c.beats||0}</div></div>
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">Misses</div><div class="mini-card-value tabular" style="font-size:16px;color:${(c.misses||0)>0?'var(--crimson)':'var(--muted)'};">${c.misses||0}</div></div>
      <div class="mini-card" style="margin:0;"><div class="mini-card-label">Tracked guides</div><div class="mini-card-value tabular" style="font-size:16px;">${c.n_claims||0}</div></div>
    </div>`;
  
  // Build a per-quarter card with the Said → Actual → Interpretation → Implication structure
  const quarterCards = pairs.length ? pairs.map(p => {
    const revLi = (p.line_items||[]).find(li=>li.metric_kind==='revenue') || {};
    const sm = p.summary_metrics || {};
    const sr = p.stock_reaction || {};
    
    // SAID block — verbatim from press release / transcript
    const saidBlock = `
      <div style="background:var(--bg);padding:11px 14px;border-radius:8px;margin-bottom:10px;border-left:3px solid var(--slate);">
        <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-weight:700;margin-bottom:4px;">▸ What Management Said</div>
        <div style="font-size:13px;font-style:italic;line-height:1.55;color:var(--text);">"${revLi.guide_quote||'No verbatim guidance recorded.'}"</div>
        ${revLi.guide_source_file?`<div style="margin-top:6px;font-size:10px;color:var(--subtle);">Source: ${revLi.guide_source_file}</div>`:''}
      </div>`;
    
    // ACTUAL block — XBRL-derived
    const actualBlock = `
      <div style="background:var(--bg);padding:11px 14px;border-radius:8px;margin-bottom:10px;border-left:3px solid var(--amber);">
        <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:var(--amber);font-weight:700;margin-bottom:4px;">▸ What Actually Happened</div>
        <div style="font-size:13px;line-height:1.6;color:var(--text);">
          <table style="width:100%;font-size:12.5px;font-variant-numeric:tabular-nums;">
            <tr><td style="padding:3px 0;color:var(--muted);">Guide range:</td><td style="padding:3px 0;text-align:right;">$${sm.revenue_guide_low_b||revLi.guide_low_b||'?'}–${sm.revenue_guide_high_b||revLi.guide_high_b||'?'}B (mid $${sm.revenue_guide_mid_b||revLi.guide_mid_b||'?'}B)</td></tr>
            <tr><td style="padding:3px 0;color:var(--muted);">Actual:</td><td style="padding:3px 0;text-align:right;font-weight:600;">$${sm.revenue_actual_b||revLi.actual_b||'?'}B</td></tr>
            <tr><td style="padding:3px 0;color:var(--muted);">Δ vs mid:</td><td style="padding:3px 0;text-align:right;font-weight:600;color:${(sm.revenue_delta_pct||0)>0?'var(--mint)':(sm.revenue_delta_pct||0)<0?'var(--crimson)':'var(--muted)'};">${(sm.revenue_delta_pct||0)>=0?'+':''}${sm.revenue_delta_pct!=null?sm.revenue_delta_pct.toFixed(2):'?'}%</td></tr>
            <tr><td style="padding:3px 0;color:var(--muted);">Verdict:</td><td style="padding:3px 0;text-align:right;font-weight:600;">${revLi.verdict||'pending'}</td></tr>
            <tr><td style="padding:3px 0;color:var(--muted);">Stock reaction (T+1):</td><td style="padding:3px 0;text-align:right;font-weight:600;color:${(sr.reaction_1d_pct||0)>0?'var(--mint)':'var(--crimson)'};">${(sr.reaction_1d_pct||0)>=0?'+':''}${sr.reaction_1d_pct!=null?sr.reaction_1d_pct.toFixed(2):'?'}%</td></tr>
            ${sr.reaction_5d_pct!=null?`<tr><td style="padding:3px 0;color:var(--muted);">Stock reaction (5-day):</td><td style="padding:3px 0;text-align:right;font-weight:600;color:${sr.reaction_5d_pct>0?'var(--mint)':'var(--crimson)'};">${sr.reaction_5d_pct>=0?'+':''}${sr.reaction_5d_pct.toFixed(2)}%</td></tr>`:''}
            <tr><td style="padding:3px 0;color:var(--muted);">Pair accuracy:</td><td style="padding:3px 0;text-align:right;font-weight:600;">${sm.mcs_pair_accuracy!=null?sm.mcs_pair_accuracy.toFixed(4):'—'}</td></tr>
          </table>
        </div>
        ${revLi.actual_source_filing?`<div style="margin-top:6px;font-size:10px;color:var(--subtle);">Source: ${revLi.actual_source_filing}</div>`:''}
      </div>`;
    
    // INTERPRETATION + IMPLICATION
    const { interp, implication } = deriveMCSInterp(p, ticker);
    
    return `<div class="card card-pad anim" style="margin-bottom:18px;border-left:4px solid ${(revLi.verdict||'').startsWith('Beat')?'var(--mint)':(revLi.verdict||'').startsWith('Miss')?'var(--crimson)':'var(--accent)'};">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;">Pair</div>
          <div style="font-size:16px;font-weight:600;">${p.made_in} → ${p.targets} <span style="color:var(--muted);font-size:12px;font-weight:400;">· call ${p.call_date||'—'}</span></div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;color:var(--muted);">Difficulty</div>
          <div style="font-size:14px;font-weight:600;">${(c.rows||[]).find(r=>r.target_quarter===p.targets || r.quarter_made===p.made_in)?.difficulty||0}/3</div>
        </div>
      </div>
      ${saidBlock}
      ${actualBlock}
      ${analystNote(interp, {flavor:'interp', label:'Analyst Interpretation'})}
      ${analystNote(implication, {flavor:'implication', label:'Implication for Investment Thesis'})}
      ${sourceList([
        revLi.guide_source_file || 'Earnings call / press release',
        revLi.actual_source_filing || '10-Q / 10-K',
        '8-K Item 2.02 (formal guidance)',
        'Stock-price dataset (T-1/T/T+1)',
      ])}
    </div>`;
  }).join('') : emptyState('Quarter-to-quarter guidance data not yet available for this company.');
  
  return `
    ${reportHero({
      kicker:'MANAGEMENT COMMENTARY & CREDIBILITY (MCS)',
      title:`${ticker} — Said → Actual → Interpretation`,
      subtitle:'Quarter-by-quarter tracking of what management committed to versus what materialized, with analyst interpretation of every gap. The credibility lens.',
      barColor:'var(--accent)',
      badges:[
        {label:'MCS (info-adj)', value: c.mcs_information_adjusted!=null?c.mcs_information_adjusted.toFixed(4):'—', color:'var(--accent)', sub:`${c.beats||0} beats / ${c.misses||0} misses / ${c.n_claims||0} guides`},
      ],
      dataSource:'Earnings call transcripts · Earnings presentations · 8-K Item 2.02 press releases · Prior-quarter guidance'
    })}
    ${analyticalCard({
      title:'MCS aggregate metrics',
      body: aggMetrics,
      sources:['Per-pair accuracy (1 − |actual − guide_mid| / guide_mid)','8-K press releases','SEC EDGAR XBRL (actuals)','MCS methodology document'],
    })}
    ${reportSection('Per-quarter Said → Actual → Interpretation', quarterCards)}
  `;
}

// ============================================================================
// SECTION 4 — INVESTMENT VIEW
// Stance, why, catalysts, risks, what would change, valuation view summary
// ============================================================================

function investmentViewSection(ticker, c, n) {
  if (!n) return analyticalCard({ title:'Investment View', body: emptyState() });
  const stance = n.stance || 'Neutral';
  const stanceColor = STANCE_COLOR[n.color] || 'var(--accent)';
  
  // Stance block
  const stanceBlock = `<div style="padding:16px 20px;border-radius:10px;background:${n.color==='mint'?'rgba(16,185,129,.08)':n.color==='crimson'?'rgba(239,68,68,.08)':'rgba(245,158,11,.08)'};border-left:4px solid ${stanceColor};margin-bottom:14px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;">Current stance</div>
    <div style="font-size:24px;font-weight:700;color:${stanceColor};margin-top:4px;">${stance.toUpperCase()}</div>
  </div>`;
  
  // Why-the-stance
  const whyBody = n.summary ? `<p style="font-size:13.5px;line-height:1.65;color:var(--text);margin:0;">${n.summary}</p>` : emptyState();
  
  // Catalysts (synthesise from trigger_up + transcripts)
  const catalystsBody = n.trigger_up && n.trigger_up.length ? `
    <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
      ${n.trigger_up.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);font-weight:600;flex-shrink:0;">▲</span><span>${t}</span></li>`).join('')}
    </ul>` : emptyState();
  
  // Risks
  const risksBody = n.trigger_down && n.trigger_down.length ? `
    <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
      ${n.trigger_down.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);font-weight:600;flex-shrink:0;">▼</span><span>${t}</span></li>`).join('')}
    </ul>` : emptyState();
  
  // Forward-looking quotes — reorganized as supporting evidence for stance
  const quotesBody = n.quotes && n.quotes.length ? `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${n.quotes.slice(0,6).map(q => `<div style="padding:10px 14px;background:rgba(99,102,241,.06);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;">
        <div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-bottom:4px;">${q[0]||'Management'} · ${q[1]||''}</div>
        <div style="font-size:13px;font-style:italic;line-height:1.6;color:var(--text);">"${q[2]||q}"</div>
      </div>`).join('')}
    </div>` : emptyState();
  
  // Bottom line
  const bottomLine = n.bottom_line ? `<p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0;">${n.bottom_line}</p>` : emptyState();
  
  // Valuation view summary — from FactSet target if available
  const fpVar = `${ticker}_FACTSET_PEERS`;
  let valSummary = emptyState('Valuation summary pending — see Fundamentals section for FactSet peer comp.');
  let valInterp = '';
  if (typeof globalThis !== 'undefined' && globalThis[fpVar]) {
    const fp = globalThis[fpVar];
    const t = fp.target||{};
    const med = (fp.peer_aggregates||{}).median||{};
    const pricePct = t.target_price && t.price ? ((t.target_price/t.price)-1)*100 : null;
    valSummary = `<table style="width:100%;font-size:13px;font-variant-numeric:tabular-nums;">
      <tr><td style="padding:5px 0;color:var(--muted);">Spot price:</td><td style="padding:5px 0;text-align:right;font-weight:600;">$${t.price?t.price.toFixed(2):'—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Sell-side consensus target:</td><td style="padding:5px 0;text-align:right;font-weight:600;">$${t.target_price?t.target_price.toFixed(2):'—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Implied upside/downside:</td><td style="padding:5px 0;text-align:right;font-weight:600;color:${pricePct>0?'var(--mint)':'var(--crimson)'};">${pricePct!=null?(pricePct>0?'+':'')+pricePct.toFixed(1)+'%':'—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Rating:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.rating||'—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Broker count:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.broker_contributors||'—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">P/E FY1 vs peer median:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.PE_FY1?t.PE_FY1.toFixed(2):'—'}× vs ${med.PE_FY1?med.PE_FY1.toFixed(2):'—'}× (${t.PE_FY1&&med.PE_FY1?(((t.PE_FY1/med.PE_FY1)-1)*100).toFixed(0)+'%':'—'})</td></tr>
    </table>`;
    if (pricePct!=null) {
      valInterp = pricePct > 5 ? 'Sell-side targets sit above spot; consensus believes there is room to run.'
                : pricePct < -5 ? 'Sell-side targets sit below spot, signalling that consensus has not caught up to the recent rally — either revisions are coming or the market has overshot.'
                : 'Sell-side targets and spot are aligned; consensus believes the stock is fairly valued.';
    }
  }
  
  return `
    ${reportHero({
      kicker:'INVESTMENT VIEW — stance synthesis',
      title:`${ticker} — Investment Stance & Catalysts`,
      subtitle:'Synthesis: where the stance comes from, what catalysts could move it, what risks could break it, and how valuation maps to the position.',
      barColor: stanceColor,
      badges:[
        {label:'Current stance', value: stance, color: stanceColor},
        {label:'MCS (info-adj)', value: c.mcs_information_adjusted!=null?c.mcs_information_adjusted.toFixed(4):'—'},
      ],
      dataSource:'All four lenses: fundamental + management commentary + technical + valuation'
    })}
    ${analyticalCard({
      title:'Current stance',
      body: stanceBlock,
      sources:['Synthesis from Fundamentals + MCS + Valuation','Technical-setup analysis'],
    })}
    ${analyticalCard({
      title:'Why the stance exists',
      body: whyBody,
      sources:['Eight-quarter financial trends (XBRL)','Management commentary (transcripts)','FactSet consensus','Peer comp positioning'],
    })}
    ${analyticalCard({
      title:'Catalysts — what could lift the call',
      body: catalystsBody,
      sources:['Forward-looking management commitments','Industry/cycle drivers','Sell-side estimate revisions'],
      style:'border-left:3px solid var(--mint);',
    })}
    ${analyticalCard({
      title:'Risks — what could break the thesis',
      body: risksBody,
      sources:['Risk factors (10-K Item 1A)','Macro / cycle exposure','Competitive dynamics','Regulatory'],
      style:'border-left:3px solid var(--crimson);',
    })}
    ${quotesBody!==emptyState()?analyticalCard({
      title:'Key forward-looking quotes (supporting evidence)',
      body: quotesBody,
      sources:['Earnings call transcripts (verbatim)'],
    }):''}
    ${analyticalCard({
      title:'Valuation view summary',
      body: valSummary,
      interp: valInterp,
      sources:['FactSet Workstation Web (consensus targets, ratings, P/E)','SEC EDGAR (TTM fundamentals)'],
    })}
    ${analyticalCard({
      title:'Bottom line',
      body: bottomLine,
      sources:['Synthesis from all underlying lenses'],
      style:'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);',
    })}
    ${n.disclaimer?analyticalCard({
      title:'Disclaimer',
      body:`<p style="font-size:11.5px;font-style:italic;line-height:1.55;color:var(--muted);margin:0;">${n.disclaimer}</p>`,
    }):''}
  `;
}

// ============================================================================
// MAIN: companyPage(ticker) — renders all 4 sections in order
// ============================================================================

function companyPage(ticker, sectionId) {
  const c = DATA.companies[ticker];
  const n = DATA.narratives[ticker];
  if (!c) {
    return `<h1>${ticker}</h1>${emptyState('No data available for this ticker.')}`;
  }
  
  // Section anchors
  const sections = [
    { id:'sec-overview', label:'1. Company Overview' },
    { id:'sec-fundamentals', label:'2. Fundamentals' },
    { id:'sec-mcs', label:'3. Management Commentary & MCS' },
    { id:'sec-investment-view', label:'4. Investment View' },
  ];
  
  // If sectionId is provided, render only that section
  if (sectionId === 'overview') return overviewSection(ticker, c, n);
  if (sectionId === 'fundamentals') return fundamentalsSection(ticker, c, n);
  if (sectionId === 'mcs') return mcsSection(ticker, c, n);
  if (sectionId === 'investment-view') return investmentViewSection(ticker, c, n);
  
  // Otherwise render the full four-section research report
  return `
    <div class="research-toc-sticky" style="position:sticky;top:0;z-index:5;background:var(--bg);padding:12px 0;margin-bottom:8px;border-bottom:1px solid var(--border);">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${sections.map(s=>`<a href="#${s.id}" style="font-size:12px;padding:6px 12px;background:var(--card);border:1px solid var(--border);border-radius:14px;text-decoration:none;color:var(--text);font-weight:500;">${s.label}</a>`).join('')}
      </div>
    </div>
    <div id="sec-overview" style="scroll-margin-top:60px;">${overviewSection(ticker, c, n)}</div>
    <div id="sec-fundamentals" style="scroll-margin-top:60px;">${fundamentalsSection(ticker, c, n)}</div>
    <div id="sec-mcs" style="scroll-margin-top:60px;">${mcsSection(ticker, c, n)}</div>
    <div id="sec-investment-view" style="scroll-margin-top:60px;">${investmentViewSection(ticker, c, n)}</div>
  `;
}

// END COMPANY TEMPLATE
