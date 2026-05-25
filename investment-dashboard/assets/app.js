// =============================================================================
// Investment Research Priority Dashboard — modular app
// =============================================================================
// Reads per-ticker payloads from data/companies/{T}.json, data/narratives/{T}.json,
// data/ta_levels/{T}.json, data/factset/{T}.json (loaded lazily on demand).
// Charts are external PNG files at assets/charts/{T}/.
// Composite/rank are STORED values from data/dashboard-data.json (single source
// of truth per PRD §9.7).
//
// Hard rules:
//   - Schema-version major mismatch is a blocking error (PRD §14.3).
//   - All data-derived strings reach the DOM via textContent or .innerHTML of
//     trusted template strings — no concatenated user input.
//   - Lazy ticker loading: only fetch a ticker's full payload when the user
//     navigates to it. Keeps initial load fast.
// =============================================================================

(function () {
  "use strict";

  // ===== Constants =====
  const APP_VERSION = "2.0.0";
  const SCHEMA_MAJOR = "1";
  const SECTION_ORDER = [
    { key: "fundamental",     label: "Fundamentals",            emoji: "📊", sub: "9-quarter analysis · ratios · balance sheet" },
    { key: "mcs",             label: "Management & MCS",        emoji: "🎯", sub: "Said vs Actual · Interp · Implication" },
    { key: "valuation",       label: "Valuation & Comparables", emoji: "💰", sub: "Multiples · peer comp · premium/discount" },
    { key: "technical",       label: "Technical Analysis",      emoji: "📈", sub: "Daily bars · SMA · RSI · MACD · ADX" },
    { key: "options",         label: "Options Analysis",        emoji: "📐", sub: "IV term · skew · positioning" },
    { key: "investment-view", label: "Investment View",         emoji: "🎯", sub: "Bull/Bear · triggers · bottom line" },
    { key: "summary",         label: "Executive Summary",       emoji: "📋", sub: "One-page forward view" },
  ];

  const STANCE_COLORS = {
    mint: "var(--mint)", amber: "var(--amber)", crimson: "var(--crimson)",
    neutral: "var(--subtle)", slate: "var(--subtle)",
  };

  // ===== State =====
  const TICKER_DATA = {};   // { T: { company, narrative, ta, factset } }
  let DATA = null;          // top-level (leaderboard, ticker_order, summary)
  let activePage = "home";

  // ===== Boot =====
  function boot() {
    if (typeof window.DASHBOARD_DATA === "undefined") {
      renderError("window.DASHBOARD_DATA is undefined — data file failed to load.");
      return;
    }
    DATA = window.DASHBOARD_DATA;
    const dataMajor = (DATA.schemaVersion || "").split(".")[0];
    if (dataMajor !== SCHEMA_MAJOR) {
      renderError(`Schema major ${dataMajor} incompatible with app major ${SCHEMA_MAJOR}.`);
      return;
    }
    buildLayout();
    renderRoute();
    window.addEventListener("hashchange", renderRoute);
  }

  function renderError(msg) {
    document.getElementById("dashboard-root").innerHTML =
      `<div style="padding:32px;max-width:720px;margin:60px auto;background:#fff;border-radius:8px;border:1px solid #fee;color:#900;font-family:-apple-system,system-ui,sans-serif;">
         <h2 style="margin:0 0 8px;">Dashboard failed to load</h2>
         <p style="margin:0;line-height:1.55;">${escapeHtml(msg)}</p>
       </div>`;
  }

  // ===== Layout (top-level chrome) =====
  function buildLayout() {
    const root = document.getElementById("dashboard-root");
    root.innerHTML = `
      <div class="layout">
        <aside class="sidebar" id="sidebar">${buildSidebarHtml()}</aside>
        <main class="content-wrap">
          <header class="topbar">
            <div class="topbar-left">
              <span class="brand">Investment Research</span>
              <span class="brand-sub">Priority Dashboard · v${APP_VERSION}</span>
            </div>
            <div class="topbar-right">
              <button id="themeToggle" class="theme-toggle">🌓 Theme</button>
            </div>
          </header>
          <div id="content" class="content"></div>
        </main>
      </div>`;
    document.getElementById("sidebar").addEventListener("click", onSidebarClick);
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  }

  function buildSidebarHtml() {
    // DATA.companies is sorted by rank (composite desc) — keep that order
    // for the sidebar so the leaderboard ranking is visually reinforced.
    const order = (DATA.companies || [])
      .slice()
      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
      .map(c => c.ticker);
    const tickerNav = order.map(t => {
      const expanded = activePage.startsWith(t + ":");
      const subs = expanded ? SECTION_ORDER.map(s => `
        <button class="nav-btn nav-sub ${activePage === t + ':' + s.key ? 'active' : ''}" data-route="${t}:${s.key}">
          <span class="sub-emoji">${s.emoji}</span>
          <span class="sub-label">
            <span class="sub-title">${s.label}</span>
            <span class="sub-hint">${s.sub}</span>
          </span>
        </button>`).join("") : "";
      return `
        <button class="nav-btn ticker-head ${expanded ? 'expanded' : ''}" data-route="${t}:summary" data-ticker-head="${t}">
          <span class="ticker-sym">${t}</span>
          <span class="ticker-chevron">${expanded ? '▾' : '▸'}</span>
        </button>${subs}`;
    }).join("");
    return `
      <div class="brand-block">
        <div class="brand-title">Priority Dashboard</div>
        <div class="brand-sub">${(DATA.companies || []).length} tickers · MCS-ranked</div>
      </div>
      <nav class="nav-section">
        <div class="nav-head">Overview</div>
        <button class="nav-btn ${activePage === 'home' ? 'active' : ''}" data-route="home">📋 Leaderboard</button>
        <button class="nav-btn ${activePage === 'companies' ? 'active' : ''}" data-route="companies">🏢 Companies</button>
      </nav>
      <nav class="nav-section">
        <div class="nav-head">Research by ticker</div>
        ${tickerNav}
      </nav>`;
  }

  function onSidebarClick(e) {
    const btn = e.target.closest(".nav-btn");
    if (!btn || !btn.dataset.route) return;
    location.hash = btn.dataset.route;
  }

  function toggleTheme() {
    const cur = document.documentElement.dataset.theme || "light";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("dash.theme", next); } catch (e) {}
  }
  try {
    const saved = localStorage.getItem("dash.theme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}

  // ===== Routing =====
  function renderRoute() {
    const hash = location.hash.replace(/^#/, "") || "home";
    activePage = hash;
    document.getElementById("sidebar").innerHTML = buildSidebarHtml();
    if (hash === "home") return renderHome();
    if (hash === "companies") return renderCompanies();
    const m = hash.match(/^([A-Z]+):([\w-]+)$/);
    if (m) return renderTickerSection(m[1], m[2]);
    setContent(`<div class="card"><div class="card-pad">Unknown route: ${escapeHtml(hash)}</div></div>`);
  }

  function setContent(html) {
    const el = document.getElementById("content");
    el.innerHTML = html;
    el.scrollTop = 0;
  }

  // ===== Home (leaderboard) =====
  function renderHome() {
    const companies = DATA.companies || [];
    const summary = DATA.summary || {};
    // Color helper for lens scores (0-100 → green/amber/red)
    const lensColor = v => {
      if (v == null) return 'var(--muted)';
      if (v >= 75) return 'var(--mint)';
      if (v >= 55) return 'var(--accent)';
      if (v >= 40) return 'var(--amber)';
      return 'var(--crimson)';
    };
    const cell = (v, suffix='') => v == null
      ? `<td style="text-align:right;padding:7px 8px;color:var(--muted);">—</td>`
      : `<td style="text-align:right;padding:7px 8px;color:${lensColor(v)};font-weight:600;font-variant-numeric:tabular-nums;">${v.toFixed(1)}${suffix}</td>`;

    // Cell helper (consistent padding, alignment, truncation)
    const tdNum = (v, color='var(--text)', weight='700') => `<td style="padding:8px 6px;text-align:right;color:${color};font-weight:${weight};font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border);">${v}</td>`;
    const cellLens = v => v == null
      ? tdNum('—', 'var(--muted)', '500')
      : tdNum(v.toFixed(1), lensColor(v), '600');

    const rows = companies.slice().sort((a, b) => a.rank - b.rank).map(c => {
      const stance = priorityClass(c.priorityBucket);
      const s = c.scores || {};
      return `
        <tr class="lb-row-v2" data-ticker="${c.ticker}" style="cursor:pointer;">
          <td style="padding:8px 8px;color:var(--muted);font-weight:600;text-align:right;font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border);">${c.rank}</td>
          <td style="padding:8px 8px;border-bottom:1px solid var(--border);"><strong style="color:var(--text);">${c.ticker}</strong></td>
          <td style="padding:8px 8px;color:var(--muted);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-bottom:1px solid var(--border);" title="${escapeHtml(c.name || '')}">${escapeHtml(c.name || '—')}</td>
          <td style="padding:8px 8px;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-bottom:1px solid var(--border);" title="${escapeHtml(c.sector || '')}">${escapeHtml(c.sector || '—')}</td>
          ${tdNum((c.compositeScore || 0).toFixed(1), 'var(--text)', '700')}
          ${cellLens(s.fundamentals)}
          ${cellLens(s.management)}
          ${cellLens(s.valuation)}
          ${cellLens(s.technicals)}
          ${cellLens(s.options)}
          <td style="padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);"><span class="bucket bucket-${stance}" style="font-size:9.5px;padding:2px 6px;">${c.priorityBucket}</span></td>
          ${tdNum(((c.confidence?.score || 0) * 100).toFixed(0) + '%', 'var(--muted)', '500')}
          <td style="padding:8px 6px;text-align:center;border-bottom:1px solid var(--border);"><span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--accent);background:rgba(99,102,241,.10);border:1px solid rgba(99,102,241,.35);padding:2px 8px;border-radius:4px;">${escapeHtml(c.category || 'FTMO')}</span></td>
          <td style="padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;">${escapeHtml(c.col_F || '')}</td>
          <td style="padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;">${escapeHtml(c.col_J || '')}</td>
          <td style="padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;">${escapeHtml(c.col_O || '')}</td>
        </tr>`;
    }).join("");
    // Re-define `cell` to maintain compatibility (unused now, but referenced earlier in scope)
    void cell;

    // Tier-count chips
    const buckets = ['High','Medium','Low','Watchlist','Avoid'];
    const counts = {High:0,Medium:0,Low:0,Watchlist:0,Avoid:0};
    companies.forEach(c => { counts[c.priorityBucket] = (counts[c.priorityBucket] || 0) + 1; });
    const chips = buckets.filter(b => counts[b]).map(b =>
      `<span class="bucket bucket-${priorityClass(b)}" style="font-size:11px;padding:3px 10px;">${b} · ${counts[b]}</span>`).join(' ');

    setContent(`
      <header class="page-head" style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <h1>Priority Leaderboard</h1>
          <p class="page-sub">${summary.totalCompanies || companies.length} tickers ranked by composite priority score</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">${chips}</div>
        </div>
        <button id="lb-download-csv" type="button"
          style="cursor:pointer;background:var(--accent);color:#fff;border:none;border-radius:6px;padding:9px 16px;font-size:12px;font-weight:600;letter-spacing:.04em;display:inline-flex;align-items:center;gap:8px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.18);transition:opacity .15s;"
          onmouseover="this.style.opacity='0.88';" onmouseout="this.style.opacity='1';"
          title="Download the leaderboard as a CSV file — opens in Excel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Excel
        </button>
      </header>
      <section class="card" style="overflow-x:auto;padding:0;">
        <table class="leaderboard-v2" style="width:100%;min-width:1180px;border-collapse:collapse;table-layout:fixed;font-size:12.5px;">
          <colgroup>
            <col style="width:36px;">
            <col style="width:64px;">
            <col style="width:auto;">
            <col style="width:130px;">
            <col style="width:80px;">
            <col style="width:48px;"><col style="width:48px;"><col style="width:48px;"><col style="width:48px;"><col style="width:48px;">
            <col style="width:88px;">
            <col style="width:56px;">
            <col style="width:80px;">
            <col style="width:40px;"><col style="width:40px;"><col style="width:40px;">
          </colgroup>
          <thead>
            <tr style="background:var(--bg);">
              <th style="text-align:right;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">#</th>
              <th style="text-align:left;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Ticker</th>
              <th style="text-align:left;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Name</th>
              <th style="text-align:left;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Sector</th>
              <th style="text-align:right;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Composite</th>
              <th style="text-align:right;padding:10px 6px;font-size:10px;color:var(--mint);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);" title="Fundamentals">F</th>
              <th style="text-align:right;padding:10px 6px;font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);" title="Management (MCS)">M</th>
              <th style="text-align:right;padding:10px 6px;font-size:10px;color:var(--amber);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);" title="Valuation">V</th>
              <th style="text-align:right;padding:10px 6px;font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);" title="Technicals">T</th>
              <th style="text-align:right;padding:10px 6px;font-size:10px;color:var(--mint);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);" title="Options">O</th>
              <th style="text-align:center;padding:10px 6px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Tier</th>
              <th style="text-align:right;padding:10px 8px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Conf</th>
              <th style="text-align:center;padding:10px 6px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">Category</th>
              <th style="text-align:center;padding:10px 4px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">F</th>
              <th style="text-align:center;padding:10px 4px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">J</th>
              <th style="text-align:center;padding:10px 4px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);">O</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
      <section class="card card-pad">
        <h3 style="margin:0 0 8px;">How the rankings are built</h3>
        <p style="font-size:13px;line-height:1.6;color:var(--muted);margin:0;">
          ${(() => {
            const w = (DATA && DATA.scoringModel && DATA.scoringModel.weights) || {};
            const f = ((w.fundamentals || 0) * 100).toFixed(1).replace(/\.0$/, '');
            const m = ((w.management   || 0) * 100).toFixed(1).replace(/\.0$/, '');
            const v = ((w.valuation    || 0) * 100).toFixed(1).replace(/\.0$/, '');
            const t = ((w.technicals   || 0) * 100).toFixed(1).replace(/\.0$/, '');
            const o = ((w.options      || 0) * 100).toFixed(1).replace(/\.0$/, '');
            return `Composite score (0–100) is a weighted blend of 5 lenses: Fundamentals (${f}%), Management Credibility / MCS (${m}%), Valuation (${v}%), Technicals (${t}%), Options (${o}%). Each lens scored 0–100 based on the underlying data.`;
          })()}
          Composite and rank are computed once by <code>scoring.py</code> (PRD §9.7 single source of truth).
        </p>
      </section>`);

    document.querySelectorAll(".lb-row").forEach(r => {
      r.addEventListener("click", () => { location.hash = r.dataset.ticker + ":summary"; });
    });

    // Excel download — build a CSV from the live leaderboard data. CSV opens
    // natively in Excel as a worksheet, with no external library needed
    // (works equally well in the modular dashboard and the offline standalone).
    const dlBtn = document.getElementById("lb-download-csv");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        const w = (DATA && DATA.scoringModel && DATA.scoringModel.weights) || {};
        const wFmt = k => (((w[k] || 0) * 100).toFixed(1).replace(/\.0$/, '') + '%');
        // CSV escape: wrap in quotes, double-up internal quotes
        const esc = v => {
          if (v == null) return '';
          const s = String(v);
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        };
        const headers = [
          "Rank", "Ticker", "Name", "Sector",
          "Composite",
          `Fundamentals (${wFmt('fundamentals')})`,
          `Management (${wFmt('management')})`,
          `Valuation (${wFmt('valuation')})`,
          `Technicals (${wFmt('technicals')})`,
          `Options (${wFmt('options')})`,
          "Tier", "Confidence", "Category",
          "F", "J", "O",
        ];
        const rowsOut = companies.slice().sort((a, b) => a.rank - b.rank).map(c => {
          const s = c.scores || {};
          const conf = ((c.confidence?.score || 0) * 100).toFixed(0) + '%';
          const fmtLens = v => v == null ? "" : Number(v).toFixed(1);
          return [
            c.rank, c.ticker, c.name || "", c.sector || "",
            (c.compositeScore == null ? "" : Number(c.compositeScore).toFixed(1)),
            fmtLens(s.fundamentals), fmtLens(s.management), fmtLens(s.valuation),
            fmtLens(s.technicals),   fmtLens(s.options),
            c.priorityBucket || "", conf, c.category || "FTMO",
            c.col_F || "", c.col_J || "", c.col_O || "",
          ];
        });
        const csv = [headers, ...rowsOut].map(r => r.map(esc).join(",")).join("\r\n");
        // Prepend UTF-8 BOM so Excel detects encoding correctly
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const ts = new Date().toISOString().slice(0, 10);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Priority-Leaderboard-${ts}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
  }

  function renderCompanies() {
    const companies = DATA.companies || [];
    const rows = companies.map(c => `
      <tr style="cursor:pointer;" onclick="location.hash='${c.ticker}:summary'">
        <td><strong>${c.ticker}</strong></td>
        <td>${escapeHtml(c.name || '')}</td>
        <td>${escapeHtml(c.sector || '')}</td>
        <td>${escapeHtml(c.industry || '')}</td>
      </tr>`).join("");
    setContent(`
      <header class="page-head"><h1>Companies</h1></header>
      <section class="card">
        <table class="leaderboard">
          <thead><tr><th>Ticker</th><th>Name</th><th>Sector</th><th>Industry</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`);
  }

  // ===== Ticker section dispatcher =====
  async function renderTickerSection(ticker, section) {
    setContent(`<div class="card card-pad" style="text-align:center;color:var(--muted);">Loading ${ticker}…</div>`);
    const td = await loadTicker(ticker);
    if (!td || !td.company) {
      setContent(`<div class="card card-pad"><h2>${ticker}</h2><p style="color:var(--muted);">No data available for this ticker.</p></div>`);
      return;
    }
    const html = sectionRenderer(section)(ticker, td);
    setContent(buildTickerHeader(ticker, td) + html);
  }

  async function loadTicker(ticker) {
    if (TICKER_DATA[ticker]) return TICKER_DATA[ticker];

    // Prefer the inlined bundle (works on file:// with no CORS issues).
    // The bundle is keyed by ticker → { companies, narratives, ta_levels, factset, options }
    // (each value is the parsed JSON for that dir).
    const bundle = (window.TICKER_DATA_BUNDLE && window.TICKER_DATA_BUNDLE[ticker]) || null;

    const fetchJson = async (path) => {
      try { const r = await fetch(path); if (!r.ok) return null; return await r.json(); }
      catch (e) { return null; }
    };
    // If bundle has the ticker, skip network. Otherwise fall back to fetch.
    let company, narrative, ta, factset, options;
    if (bundle) {
      company  = bundle.companies  || null;
      narrative = bundle.narratives || null;
      ta       = bundle.ta_levels  || null;
      factset  = bundle.factset    || null;
      options  = bundle.options    || null;
    } else {
      [company, narrative, ta, factset, options] = await Promise.all([
        fetchJson(`./data/companies/${ticker}.json`),
        fetchJson(`./data/narratives/${ticker}.json`),
        fetchJson(`./data/ta_levels/${ticker}.json`),
        fetchJson(`./data/factset/${ticker}.json`),
        fetchJson(`./data/options/${ticker}.json`),
      ]);
    }
    // Fallback: if no per-ticker dossier exists yet, synthesize a minimal
    // company record from the leaderboard so the header still renders and
    // the page shows "data not yet populated" instead of crashing.
    const leaderboardEntry = (DATA.companies || []).find(c => c.ticker === ticker);
    const companyOrStub = company || (leaderboardEntry ? {
      ticker,
      name: leaderboardEntry.name || ticker,
      sector: leaderboardEntry.sector || null,
      mcs_simple: (leaderboardEntry.scores && leaderboardEntry.scores.management != null)
        ? leaderboardEntry.scores.management / 100 : null,
      _stub: true,
      _stub_reason: 'No per-ticker dossier in data/companies/' + ticker + '.json. Showing leaderboard data only.',
    } : null);
    TICKER_DATA[ticker] = { company: companyOrStub, narrative, ta, factset, options };
    return TICKER_DATA[ticker];
  }

  function buildTickerHeader(ticker, td) {
    const c = td.company || {};
    const n = td.narrative || {};
    const lb = (DATA.companies || []).find(x => x.ticker === ticker) || {};
    const name = c.name || n.name || lb.name || '';
    const sector = c.sector || lb.sector || '';
    const color = STANCE_COLORS[n.color] || "var(--text)";
    return `
      <header class="ticker-head-bar">
        <div class="ticker-head-left">
          <h1 class="ticker-symbol">${ticker}</h1>
          <span class="ticker-name">${escapeHtml(name)}${sector ? ` · ${escapeHtml(sector)}` : ''}</span>
          ${n.stance ? `<span class="ticker-stance" style="color:${color};">· ${escapeHtml(n.stance)}</span>` : ''}
        </div>
        <nav class="ticker-tabs">
          ${SECTION_ORDER.map(s => `<a href="#${ticker}:${s.key}" class="ticker-tab ${activePage === ticker + ':' + s.key ? 'active' : ''}">${s.emoji} ${s.label}</a>`).join('')}
        </nav>
      </header>`;
  }

  function sectionRenderer(key) {
    return ({
      summary: renderSummary,
      fundamental: renderFundamental,
      technical: renderTechnical,
      options: renderOptions,
      valuation: renderValuation,
      mcs: renderMcs,
      "investment-view": renderInvestmentView,
    }[key]) || renderSummary;
  }

  // ===== Helpers used by renderers (defined first so they're in scope) =====
  // Compute hits = closed_b/h/m from the company row, since `hits` is rarely
  // stored directly but can be derived from rows[].verdict.
  function computeHits(c) {
    if (c.hits != null) return c.hits;
    const rows = c.rows || [];
    let h = 0;
    for (const r of rows) {
      const v = (r.verdict || '').toLowerCase();
      if (v.startsWith('hit') || v.includes('in-line') || v.includes('in line')) h++;
    }
    return h;
  }
  function impliedUpsidePct(t) {
    if (t.implied_upside_pct != null) return t.implied_upside_pct;
    if (t.price && t.target_price) return ((t.target_price / t.price) - 1) * 100;
    return null;
  }
  function fy_q_label(q) {
    if (q.fy_quarter) return q.fy_quarter;
    if (q.fy != null && q.fq != null) return `FY${q.fy} Q${q.fq}`;
    return '—';
  }
  function pct(v, dp) { if (v == null) return '—'; return v.toFixed(dp != null ? dp : 1) + '%'; }
  function money(v) {
    if (v == null) return '—';
    const n = Math.abs(v);
    if (n >= 1000) return '$' + (v / 1000).toFixed(2) + 'B';
    return '$' + v.toFixed(0) + 'M';
  }
  function dollar(v, dp) {
    if (v == null) return '—';
    return '$' + v.toFixed(dp != null ? dp : 2);
  }

  // ===== Analyst commentary synthesizer =====
  // Produces plain-English interpretation paragraphs for each section.
  // Researchers use this to anchor their own thesis: "what's happening, why
  // it matters, what to watch next." All commentary is derived from the
  // ticker's actual data values — no template prose.
  function analystCommentaryFundamentals(ticker, c) {
    const fund = c.fundamentals || {};
    const qs = (fund.quarters || []).slice();
    const summary = fund.summary || c.summary || {};
    if (qs.length < 2) return '';
    const latest = qs[qs.length - 1];
    const prev = qs[qs.length - 2];
    const yearAgo = qs.length >= 5 ? qs[qs.length - 5] : null;
    const bullets = [];

    // Revenue trajectory
    if (latest.rev_q_M != null && prev.rev_q_M != null) {
      const qoq = ((latest.rev_q_M / prev.rev_q_M) - 1) * 100;
      const dir = qoq >= 0 ? 'expanded' : 'contracted';
      bullets.push(`<strong>Revenue ${dir} ${Math.abs(qoq).toFixed(1)}%</strong> sequentially in the latest quarter (${fy_q_label(latest)}), reaching $${(latest.rev_q_M/1000).toFixed(2)}B vs $${(prev.rev_q_M/1000).toFixed(2)}B prior. ${yearAgo && yearAgo.rev_q_M ? `Year-over-year change ${(((latest.rev_q_M / yearAgo.rev_q_M) - 1) * 100).toFixed(1)}%.` : ''}`);
    }

    // Margin trajectory
    if (latest.operating_margin_pct != null && prev.operating_margin_pct != null) {
      const dom = latest.operating_margin_pct - prev.operating_margin_pct;
      bullets.push(`<strong>Operating margin ${dom >= 0 ? 'expanded' : 'compressed'} ${Math.abs(dom).toFixed(1)}pp</strong> QoQ to ${latest.operating_margin_pct.toFixed(1)}%${yearAgo && yearAgo.operating_margin_pct != null ? ` (vs ${yearAgo.operating_margin_pct.toFixed(1)}% a year ago, a ${(latest.operating_margin_pct - yearAgo.operating_margin_pct >= 0 ? '+' : '')}${(latest.operating_margin_pct - yearAgo.operating_margin_pct).toFixed(1)}pp shift)` : ''}. ${dom >= 2 ? 'Sharp margin expansion typically signals operating leverage from revenue scale outpacing OpEx — a high-quality print.' : dom <= -2 ? 'Material margin compression deserves scrutiny: is it a one-time investment cycle, or a structural cost-base issue?' : 'Margin profile is stable, which makes near-term earnings easier to forecast.'}`);
    }

    // FCF / cash generation
    if (latest.fcf_q_M != null) {
      const fcfb = latest.fcf_q_M / 1000;
      bullets.push(`<strong>Free cash flow generated ${fcfb >= 0 ? '$' + fcfb.toFixed(2) + 'B' : 'NEGATIVE $' + Math.abs(fcfb).toFixed(2) + 'B'} in the quarter</strong>${latest.capex_q_M != null ? ` against $${(latest.capex_q_M/1000).toFixed(2)}B of capex` : ''}. ${fcfb < 0 ? 'Negative FCF for a single quarter is acceptable during heavy investment cycles, but multi-quarter negative FCF erodes the balance sheet and limits buyback/dividend optionality.' : 'Positive FCF gives management discretion on capital allocation (buybacks, dividends, acquisitions, debt paydown) — a key thesis pillar.'}`);
    }

    // YoY trend if summary has it
    if (summary.yoy_revenue_growth_pct != null) {
      const yoy = summary.yoy_revenue_growth_pct;
      bullets.push(`<strong>Reported YoY revenue growth: ${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}%.</strong> ${yoy > 20 ? 'High-growth regime — consensus expects continued double-digit prints; any deceleration is the bear-case trigger.' : yoy > 5 ? 'Mid-teens to low-single-digit growth typical of mature franchises; thesis depends on margin expansion + capital returns, not revenue acceleration.' : yoy >= 0 ? 'Low single-digit growth signals a mature/late-cycle business; valuation should reflect the slower trajectory.' : 'Negative YoY revenue is a serious flag — confirm whether it\'s a cycle bottom (buy signal) or secular decline (avoid).'}`);
    }

    if (!bullets.length) return '';
    return section('Analyst read — what the numbers say', `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
        ${bullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
      </ul>
      <p style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:11.5px;color:var(--muted);font-style:italic;">Commentary is generated from the per-quarter line items above. Researchers should sanity-check against the original 10-Q/10-K filings and call transcripts before incorporating into a thesis.</p>
    `);
  }

  function analystCommentaryTechnical(ticker, ta) {
    if (!ta || ta.spot == null) return '';
    const bullets = [];
    // Trend regime
    if (ta.sma200 != null && ta.sma50 != null) {
      const above200 = ta.spot > ta.sma200;
      const above50 = ta.spot > ta.sma50;
      const golden = ta.sma50 > ta.sma200;
      bullets.push(`<strong>Trend regime: ${golden && above200 ? 'BULLISH (golden-cross + spot above 200dma)' : !golden && !above200 ? 'BEARISH (death-cross + spot below 200dma)' : 'MIXED (regime is in transition)'}.</strong> Spot ${ta.pct_above_sma200_pct != null ? (ta.pct_above_sma200_pct >= 0 ? '+' : '') + ta.pct_above_sma200_pct.toFixed(1) + '% from the 200-DMA' : 'is ' + (above200 ? 'above' : 'below') + ' the 200-DMA'}. ${ta.pct_above_sma200_pct > 30 ? 'Extreme extension above the 200-DMA — historically associated with mean reversion or consolidation periods.' : ta.pct_above_sma200_pct < -20 ? 'Significant discount to the 200-DMA — either oversold buying opportunity or trend-breakdown warning.' : 'Spot is within a normal band of the long-term moving average — trend is intact.'}`);
    }
    // Momentum
    if (ta.rsi14 != null) {
      bullets.push(`<strong>RSI(14) at ${ta.rsi14.toFixed(0)}</strong> — ${ta.rsi14 > 70 ? 'overbought territory; momentum is strong but the probability of a near-term pullback is elevated' : ta.rsi14 < 30 ? 'oversold; conviction long entries historically have a positive expected value from these levels, but confirm with volume + price action' : 'neutral momentum, no extreme reading either way'}. ${ta.macd != null && ta.macd_signal != null ? `MACD ${ta.macd > ta.macd_signal ? 'above' : 'below'} signal line, ${ta.macd > 0 ? 'positive' : 'negative'} on zero-line — ${ta.macd > ta.macd_signal && ta.macd > 0 ? 'momentum is accelerating to the upside' : ta.macd < ta.macd_signal && ta.macd < 0 ? 'momentum is accelerating to the downside' : 'momentum is transitioning'}.` : ''}`);
    }
    // Volatility / range
    if (ta.atr14 != null && ta.spot) {
      const atrPct = (ta.atr14 / ta.spot) * 100;
      bullets.push(`<strong>Average True Range (14d): $${ta.atr14.toFixed(2)} (${atrPct.toFixed(1)}% of spot)</strong>. This is the typical daily volatility band — use it to size stops (1.5–2× ATR is standard) and forecast realistic 30-day price ranges (${ta.spot != null ? '~' + ((ta.atr14 * Math.sqrt(20)) / ta.spot * 100).toFixed(0) + '% one-month expected move at current vol' : ''}).`);
    }
    // Performance windows
    if (ta.price_1y_change_pct != null || ta.price_90d_change_pct != null) {
      const y = ta.price_1y_change_pct, q = ta.price_90d_change_pct;
      bullets.push(`<strong>Price returns:</strong> ${y != null ? '1-year ' + (y >= 0 ? '+' : '') + y.toFixed(0) + '%' : ''}${y != null && q != null ? ', ' : ''}${q != null ? '90-day ' + (q >= 0 ? '+' : '') + q.toFixed(1) + '%' : ''}. ${y > 50 ? 'Strong 1-year outperformance has compressed the margin of safety — be selective on adds.' : y < -20 ? 'Significant 1-year underperformance has likely already priced in many bear catalysts; check whether the consensus expectations have reset.' : 'Performance is in a normal band.'}`);
    }
    // 52w range positioning
    if (ta.high_52w != null && ta.low_52w != null && ta.spot != null) {
      const pos = ((ta.spot - ta.low_52w) / (ta.high_52w - ta.low_52w)) * 100;
      bullets.push(`<strong>52-week range positioning: ${pos.toFixed(0)}%</strong> (spot ${dollar(ta.spot)} between low ${dollar(ta.low_52w)} and high ${dollar(ta.high_52w)}). ${pos > 90 ? 'Near 52-week highs — buyers in control, but tail-risk of momentum exhaustion rises.' : pos < 20 ? 'Near 52-week lows — sellers in control, watch for capitulation volume + reversal candles before stepping in.' : 'Mid-range — no edge from positioning alone, defer to fundamentals/valuation.'}`);
    }

    if (!bullets.length) return '';
    return section('Analyst read — what the charts say', `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
        ${bullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
      </ul>`);
  }

  function analystCommentaryValuation(ticker, fs) {
    const t = fs.target || {};
    const bullets = [];
    // Multiple positioning
    if (t.PE_FY1 != null) {
      const pe = t.PE_FY1;
      const peerMedian = (fs.peer_aggregates?.median?.PE_FY1) ?? (fs.medians?.pe_fy1);
      const prem = peerMedian ? ((pe / peerMedian) - 1) * 100 : null;
      bullets.push(`<strong>Forward P/E: ${pe.toFixed(1)}x</strong>${prem != null ? `, a ${prem >= 0 ? '+' : ''}${prem.toFixed(0)}% ${prem >= 0 ? 'premium' : 'discount'} to peer median (${peerMedian.toFixed(1)}x)` : ''}. ${pe > 40 ? 'A multiple above 40x demands either >25% earnings growth or a structural-moat narrative; without one, mean reversion is the base case.' : pe < 15 ? 'A multiple below 15x is rare for growth names — either the market is mispricing the franchise (alpha opportunity) or there is a hidden cyclical/secular issue.' : 'Multiple is in a defensible range — focus on whether earnings revisions trend up or down from here.'}`);
    }
    // EV/EBITDA
    if (t.EV_EBITDA_FY1 != null) {
      bullets.push(`<strong>EV/EBITDA FY1: ${t.EV_EBITDA_FY1.toFixed(1)}x</strong> — this is the cleaner cross-sector valuation metric (capital-structure neutral). ${t.EV_EBITDA_FY1 > 25 ? 'Premium EBITDA multiple usually requires above-peer margin expansion or revenue growth to sustain.' : t.EV_EBITDA_FY1 < 10 ? 'Discount EBITDA multiple often signals either a value trap or a mispricing — confirm by walking through 8-quarter EBITDA trajectory.' : 'Multiple is in a normal range for the peer set.'}`);
    }
    // Upside vs target
    const upside = impliedUpsidePct(t);
    if (upside != null) {
      bullets.push(`<strong>Sell-side consensus target: ${dollar(t.target_price, 0)} ⇒ ${(upside >= 0 ? '+' : '') + upside.toFixed(1) + '%'} implied return</strong>${t.broker_contributors ? ` (${t.broker_contributors} brokers contributing)` : ''}. ${upside > 25 ? 'Large implied upside — verify the consensus assumptions; if too rosy, your idea is already crowded.' : upside < 0 ? 'Negative implied return signals sell-side bearishness — useful if you have a differentiated view that the consensus is mis-modeling.' : 'Modest upside means the market roughly agrees with you on fair value; differentiated entry/exit timing matters more than thesis.'}`);
    }
    // FCF yield
    if (t.FCF_Yield_pct != null && t.FCF_Yield_pct > 0) {
      bullets.push(`<strong>FCF yield: ${t.FCF_Yield_pct.toFixed(1)}%</strong> ${t.FCF_Yield_pct > 5 ? '— above the 10-year Treasury, gives a cash-on-cash return floor and high optionality on buybacks/dividends.' : t.FCF_Yield_pct > 2 ? '— modest but acceptable; thesis must rely on growth, not yield.' : '— low FCF yield means thesis is purely on growth or multiple expansion; no defensive cushion.'}`);
    }
    if (fs.interpretation) {
      bullets.push(`<strong>FactSet read:</strong> ${escapeHtml(fs.interpretation)}`);
    }
    if (!bullets.length) return '';
    return section('Analyst read — what the multiples imply', `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
        ${bullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
      </ul>`);
  }

  function analystCommentaryOptions(ticker, om, t) {
    const bullets = [];
    if (om && om.term_structure && om.term_structure.length > 1) {
      const front = om.term_structure[0];
      const back = om.term_structure[om.term_structure.length - 1];
      const slope = back.atm_iv - front.atm_iv;
      bullets.push(`<strong>IV term structure: ${front.atm_iv.toFixed(0)}% (${front.dte}d) → ${back.atm_iv.toFixed(0)}% (${back.dte}d)</strong>, a ${slope >= 0 ? 'positive (contango)' : 'inverted (backwardation)'} slope. ${slope < -3 ? 'Inverted term structure signals near-term event risk being priced — typical pre-earnings or pre-catalyst pattern.' : slope > 5 ? 'Strong contango — front-month is cheap relative to LEAPS, favoring short-dated buyers of optionality.' : 'Normal term structure — no obvious near-term event premium.'}`);
    }
    if (om && om.pcr_oi != null) {
      bullets.push(`<strong>Put/Call open-interest ratio: ${om.pcr_oi.toFixed(2)}</strong>. ${om.pcr_oi > 1.2 ? 'Heavy put open interest — contrarian indicator (often marks a near-term floor) OR confirms defensive positioning if combined with declining price.' : om.pcr_oi < 0.7 ? 'Heavy call open interest — bullish positioning or hedge-fund speculation; risk of crowded trade unwinding.' : 'Balanced positioning — no edge from positioning alone.'}`);
    }
    if (om && om.skew_25d_per_expiry && om.skew_25d_per_expiry[0]) {
      const skew = om.skew_25d_per_expiry[0].skew;
      bullets.push(`<strong>25Δ skew (front-month): ${skew >= 0 ? '+' : ''}${skew.toFixed(1)} vol pts</strong>. ${skew < -5 ? 'Strong put-skew — market is paying up for downside protection; reflects fear or active hedging.' : skew > 5 ? 'Call-skew — market is paying up for upside calls (rare); often pre-takeover or pre-positive-catalyst pattern.' : 'Mild skew — no significant directional bias priced into options.'}`);
    }
    if (om && om.top_oi_strikes && om.top_oi_strikes[0]) {
      const ks = om.top_oi_strikes.slice(0, 3);
      bullets.push(`<strong>Largest open-interest strikes: ${ks.map(s => '$' + s.strike).join(', ')}</strong> — these are price magnets / dealer-hedging pivots. Watch for pinning behavior near expiry as gamma exposure concentrates here.`);
    }
    if (t && t.next_earnings_date) {
      bullets.push(`<strong>Next earnings: ${t.next_earnings_date}</strong>. Earnings move is usually 1.5–2× the front-month implied move; size positions or hedges accordingly.`);
    }
    if (!bullets.length) {
      // Fall back to a generic but useful blurb for tickers without options JSON
      bullets.push(`Per-expiry options metrics not extracted as structured data for ${ticker}, but the chart images below show the same underlying analysis: IV term structure (chart 01), vol skew (02), vol smile (03), surface (04), OI by strike (05), put/call by expiry (06), and max-pain/gamma (07). Read them together to gauge how options flow is positioning around upcoming catalysts.`);
    }
    return section('Analyst read — what options flow is saying', `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
        ${bullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
      </ul>`);
  }

  function analystCommentaryMcs(ticker, c) {
    const bullets = [];
    const hits = computeHits(c);
    const total = (c.beats || 0) + hits + (c.misses || 0);
    if (total > 0) {
      const beatRate = ((c.beats || 0) / total) * 100;
      bullets.push(`<strong>Management track record: ${beatRate.toFixed(0)}% strict-beat rate</strong> over ${total} measurable forward claims (${c.beats || 0} beats, ${hits} hits, ${c.misses || 0} misses). ${beatRate > 75 ? 'A high beat-rate signals management routinely under-promises and over-delivers — high credibility on guidance, your next-quarter model can lean slightly above the midpoint.' : beatRate > 50 ? 'Mixed track record — model the midpoint of guidance ranges, not the high end.' : 'Low beat-rate — management has historically over-promised; consider modeling below the midpoint as your base case.'}`);
    }
    if (c.skill_over_baseline != null) {
      const s = c.skill_over_baseline;
      bullets.push(`<strong>Skill vs random baseline: ${s >= 0 ? '+' : ''}${s.toFixed(2)}</strong>. ${s > 0.2 ? 'Significantly better than guessing — management has genuine forecasting skill.' : s > 0 ? 'Marginally better than random — read guidance with some skepticism.' : 'Worse than a coin flip — historical guidance has been a poor predictor of outcomes; rely on independent forecasts.'}`);
    }
    if (c.subscores && Object.keys(c.subscores).length) {
      const ss = c.subscores;
      const top = Object.entries(ss).filter(([_, v]) => typeof v === 'number').sort((a,b) => b[1]-a[1])[0];
      const bot = Object.entries(ss).filter(([_, v]) => typeof v === 'number').sort((a,b) => a[1]-b[1])[0];
      if (top && bot && top[0] !== bot[0]) {
        bullets.push(`<strong>Strongest forecasting category: ${top[0]} (${(top[1]).toFixed(2)}).</strong> Weakest: ${bot[0]} (${(bot[1]).toFixed(2)}). Use this asymmetry: trust management's ${top[0]} commentary more than their ${bot[0]} commentary.`);
      }
    }
    if (!bullets.length) return '';
    return section('Analyst read — what management credibility tells you', `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
        ${bullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
      </ul>`);
  }

  // Renders the dual short-term (0-30d) and long-term (90+d) views written into
  // companies/{T}.json by generate_horizon_views.py. Used by the Fundamentals,
  // Technicals, and Options tabs. The "key" arg picks which block to render
  // (fundamentals | technicals | options). For options the closing field is
  // "strategy" (a concrete trade idea); for the others it is "takeaway".
  function horizonViewsSection(c, key) {
    const hv = (c && c.horizon_views && c.horizon_views[key]) || null;
    if (!hv) return '';
    const st = hv.short_term || {};
    const lt = hv.long_term  || {};
    const closingKey = (key === 'options') ? 'strategy' : 'takeaway';
    const closingLabel = (key === 'options') ? 'Trade idea' : 'Takeaway';
    const closingColor = (key === 'options') ? 'var(--accent)' : 'var(--mint)';
    const buildCard = (block, accent, badge) => {
      if (!block || (!block.bullets && !block[closingKey])) return '';
      const bullets = Array.isArray(block.bullets) ? block.bullets : [];
      const close = block[closingKey] || '';
      const liHtml = bullets.map(b => `<li style="display:flex;gap:8px;align-items:flex-start;"><span style="color:${accent};flex-shrink:0;font-weight:700;line-height:1.6;">▸</span><span style="line-height:1.55;">${b}</span></li>`).join('');
      return `<div style="background:var(--bg);border:1px solid var(--border);border-left:3px solid ${accent};border-radius:8px;padding:14px 16px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
          <h4 style="margin:0;font-size:13px;color:${accent};font-weight:700;letter-spacing:.02em;">${escapeHtml(block.title || badge)}</h4>
          <span style="font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);background:var(--card);padding:3px 7px;border-radius:4px;border:1px solid var(--border);">${escapeHtml(badge)}</span>
        </div>
        ${liHtml ? `<ul style="list-style:none;padding:0;margin:0 0 ${close ? '12px' : '0'} 0;display:flex;flex-direction:column;gap:8px;font-size:12.5px;line-height:1.55;">${liHtml}</ul>` : ''}
        ${close ? `<div style="margin-top:${liHtml ? '10px' : '0'};padding-top:${liHtml ? '10px' : '0'};${liHtml ? 'border-top:1px dashed var(--border);' : ''}font-size:12px;line-height:1.6;">
          <span style="display:inline-block;font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${closingColor};margin-right:6px;">${closingLabel}:</span>
          <span>${close}</span>
        </div>` : ''}
      </div>`;
    };
    const cards = [
      buildCard(st, 'var(--accent)', 'Short term · 0–30 days'),
      buildCard(lt, 'var(--mint)',   'Long term · 90+ days'),
    ].filter(Boolean).join('');
    if (!cards) return '';
    const sectionTitle = key === 'options'
      ? 'Horizon views — short-term vs long-term trade construction'
      : (key === 'technicals'
        ? 'Horizon views — short-term tape vs long-term trend'
        : 'Horizon views — next-quarter cycle vs multi-year trajectory');
    return section(sectionTitle, `
      <p style="font-size:11.5px;color:var(--muted);margin:0 0 12px 0;line-height:1.55;">Two distinct lookouts: <strong>short term</strong> targets the next 30 days (next print, near-term tape, front-month options), <strong>long term</strong> covers 90+ days (annual trajectory, structural trend, deferred expiries).</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;">${cards}</div>`);
  }

  // ===== Section renderers =====
  function renderSummary(ticker, td) {
    const n = td.narrative || {};
    const c = td.company || {};
    const ta = td.ta || {};
    const fs = (td.factset && td.factset.target) || {};
    const hits = computeHits(c);
    const upside = impliedUpsidePct(fs);
    const charts = chartsFor(ticker, ['summary']);
    // Build a one-liner thesis statement
    const thesisLine = n.stance && n.summary ? `The forward view is ${escapeHtml((n.stance || '').toUpperCase())}. ${escapeHtml((n.summary || '').split('.')[0])}.` : '';
    return `
      ${heroBlock({
        kicker: 'EXECUTIVE SUMMARY',
        title: `${ticker} — One-page forward view`,
        subtitle: n.summary || '',
        badges: [
          { label: 'Forward view', value: (n.stance || 'WATCHLIST').toUpperCase(), color: STANCE_COLORS[n.color] || 'var(--accent)' },
          { label: 'MCS (info-adj)', value: (c.mcs_information_adjusted != null ? c.mcs_information_adjusted.toFixed(4) : '—'),
            color: 'var(--mint)', sub: `${c.beats || 0}B · ${hits}H · ${c.misses || 0}M` },
          { label: 'Spot', value: dollar(ta.spot), color: 'var(--mint)', sub: ta.spot_date || '' },
          { label: 'Target', value: fs.target_price ? '$' + Math.round(fs.target_price) : '—',
            color: 'var(--mint)', sub: upside != null ? (upside >= 0 ? '+' : '') + upside.toFixed(1) + '%' : '' },
        ],
      })}
      ${thesisLine ? section('Thesis in one sentence', `<p style="font-size:14px;line-height:1.65;margin:0;font-weight:500;color:var(--text);">${thesisLine}</p>`) : ''}
      ${lensRationaleSection(c, td)}
      ${listSection('Bull case', n.bull, 'mint', '+')}
      ${listSection('Bear case', n.bear, 'crimson', '−')}
      ${triggerSection(n)}
      ${scoreboardSection(n.scoreboard)}
      ${charts.length ? section('Summary charts', charts.join('')) : ''}
      ${quoteSection(n.quotes, ticker)}
      ${bottomLine(n)}`;
  }

  function renderFundamental(ticker, td) {
    const c = td.company || {};
    const fund = c.fundamentals || {};
    const qs = fund.quarters || [];
    const summary = fund.summary || c.summary || {};
    const rowsBased = c.rows || [];
    // Some tickers (TSLA, NFLX) have empty fundamentals but rich rows[] data.
    // Synthesize a "guidance vs actual" fundamentals view from rows[] in that case.
    if (!qs.length && rowsBased.length) {
      const chartImgs = chartsFor(ticker, ['fund_01','fund_02','fund_03','fund_04','fund_05','fund_06','fund_07','fund_08','fund_09']);
      return `
        ${heroBlock({
          kicker:'FUNDAMENTAL ANALYSIS',
          title:`${ticker} — Forward-claim fundamentals (8-quarter MCS basis)`,
          subtitle:`Per-quarter detailed line items not captured in the legacy fixture for ${ticker}. Displayed: tracked forward claims, their guided range, actual outcome, and verdict.`,
          badges:[
            { label:'Tracked claims', value: rowsBased.length + '', color:'var(--accent)' },
            { label:'Beats', value: (c.beats || 0) + '', color:'var(--mint)' },
            { label:'Hits', value: computeHits(c) + '' },
            { label:'Misses', value: (c.misses || 0) + '', color: (c.misses || 0) > 0 ? 'var(--crimson)' : 'var(--muted)' },
          ],
        })}
        ${section('Forward-looking claims (rows[])',
          `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead><tr style="background:var(--bg);">${['Claim','Made in','Target qtr','Metric','Guided','Actual','Δ %','Verdict'].map(h=>`<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
            <tbody>${rowsBased.map(r => {
              const v = (r.verdict || '');
              const color = v.toLowerCase().startsWith('beat') ? 'var(--mint)' : v.toLowerCase().includes('miss') ? 'var(--crimson)' : 'var(--accent)';
              return `<tr>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:600;">${escapeHtml(r.claim_id || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(r.quarter_made || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(r.target_quarter || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;">${escapeHtml(r.metric || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(r.guided || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(r.actual || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:${r.pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${r.pct != null ? (r.pct >= 0 ? '+' : '') + (typeof r.pct === 'number' ? r.pct.toFixed(2) : r.pct) + '%' : '—'}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:${color};font-weight:600;">${escapeHtml(v)}</td>
              </tr>`;
            }).join('')}</tbody></table></div>`)}
        ${horizonViewsSection(c, 'fundamentals')}
        ${chartImgs.length ? section('Charts', chartImgs.join('')) : ''}
      `;
    }
    if (!qs.length) {
      return emptyState(`Fundamental data not yet available for ${ticker}.`);
    }
    // Bank detection: if Net Interest Income is reported, use a bank-style
    // column layout (NII, Non-Int Income, Efficiency Ratio, ROE, ROTCE, CET1).
    // Financials sector alone isn't sufficient — payment networks (V, MA) and
    // diversified holdings (BRKB) report standard income-statement metrics
    // rather than bank-style NII/CET1, so we require at least one bank-specific
    // field to be populated before switching layouts.
    const isBank = qs.some(q => q.nii_q_M != null || q.cet1_ratio_pct != null || q.efficiency_ratio_pct != null);
    // Build a table using the actual column names. Period = FY/FQ label.
    const colSpec = isBank ? [
      { key: '_label', header: 'Period', align: 'left', fmt: (q) => fy_q_label(q) },
      { key: 'rev_q_M', header: 'Total Rev ($M)', align: 'right', fmt: (q) => q.rev_q_M != null ? q.rev_q_M.toLocaleString() : '—' },
      { key: 'nii_q_M', header: 'NII ($M)', align: 'right', fmt: (q) => q.nii_q_M != null ? q.nii_q_M.toLocaleString() : '—' },
      { key: 'non_interest_income_q_M', header: 'Non-Int Inc', align: 'right', fmt: (q) => q.non_interest_income_q_M != null ? q.non_interest_income_q_M.toLocaleString() : '—' },
      { key: 'provision_q_M', header: 'Provision', align: 'right', fmt: (q) => q.provision_q_M != null ? q.provision_q_M.toLocaleString() : '—' },
      { key: 'ni_q_M', header: 'Net Income', align: 'right', fmt: (q) => q.ni_q_M != null ? q.ni_q_M.toLocaleString() : '—' },
      { key: 'efficiency_ratio_pct', header: 'Efficiency', align: 'right', fmt: (q) => q.efficiency_ratio_pct != null ? q.efficiency_ratio_pct.toFixed(1) + '%' : '—' },
      { key: 'roe_pct', header: 'ROE', align: 'right', fmt: (q) => q.roe_pct != null ? q.roe_pct.toFixed(2) + '%' : '—' },
      { key: 'rotce_pct', header: 'ROTCE', align: 'right', fmt: (q) => q.rotce_pct != null ? q.rotce_pct.toFixed(2) + '%' : '—' },
      { key: 'cet1_ratio_pct', header: 'CET1', align: 'right', fmt: (q) => q.cet1_ratio_pct != null ? q.cet1_ratio_pct.toFixed(2) + '%' : '—' },
      { key: 'eps', header: 'EPS', align: 'right', fmt: (q) => q.eps != null ? '$' + q.eps.toFixed(2) : '—' },
    ] : [
      { key: '_label', header: 'Period', align: 'left', fmt: (q) => fy_q_label(q) },
      { key: 'rev_q_M', header: 'Rev ($M)', align: 'right', fmt: (q) => q.rev_q_M != null ? q.rev_q_M.toLocaleString() : '—' },
      { key: 'gross_margin_pct', header: 'GM %', align: 'right', fmt: (q) => q.gross_margin_pct != null ? q.gross_margin_pct.toFixed(2) + '%' : '—' },
      { key: 'operating_margin_pct', header: 'OM %', align: 'right', fmt: (q) => q.operating_margin_pct != null ? q.operating_margin_pct.toFixed(2) + '%' : '—' },
      { key: 'net_margin_pct', header: 'NM %', align: 'right', fmt: (q) => q.net_margin_pct != null ? q.net_margin_pct.toFixed(2) + '%' : '—' },
      { key: 'eps', header: 'EPS', align: 'right', fmt: (q) => q.eps != null ? '$' + q.eps.toFixed(2) : '—' },
      { key: 'ocf_q_M', header: 'OCF ($M)', align: 'right', fmt: (q) => q.ocf_q_M != null ? q.ocf_q_M.toLocaleString() : '—' },
      { key: 'capex_q_M', header: 'Capex ($M)', align: 'right', fmt: (q) => q.capex_q_M != null ? q.capex_q_M.toLocaleString() : '—' },
      { key: 'fcf_q_M', header: 'FCF ($M)', align: 'right', fmt: (q) => q.fcf_q_M != null ? q.fcf_q_M.toLocaleString() : '—' },
      { key: 'equity_M', header: 'Equity ($M)', align: 'right', fmt: (q) => q.equity_M != null ? q.equity_M.toLocaleString() : '—' },
    ];
    // Suppress columns that are null across every quarter so the table doesn't
    // show all-em-dash columns to the user. The Period column (key '_label') is
    // always kept; otherwise drop any column whose key returns null on every q.
    const visibleCols = colSpec.filter(col => col.key === '_label' ||
      qs.some(q => q[col.key] != null));
    const headers = visibleCols.map(c => `<th style="text-align:${c.align};padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.05em;">${c.header}</th>`).join('');
    const tableRows = qs.map(q => '<tr>' + visibleCols.map(col => `<td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:${col.align};">${col.fmt(q)}</td>`).join('') + '</tr>').join('');
    const q_latest = qs[qs.length - 1] || {};
    const chartImgs = chartsFor(ticker, ['fund_01','fund_02','fund_03','fund_04','fund_05','fund_06','fund_07','fund_08','fund_09']);
    // Risk factors section (if present)
    const rf = fund.risk_factors;
    const rfHtml = rf && Object.keys(rf).length ? Object.keys(rf).map(cat => `
      <div style="margin-bottom:14px;">
        <h4 style="margin:0 0 8px 0;font-size:13px;color:var(--accent);">${escapeHtml(cat)}</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.55;">
          ${(rf[cat] || []).map(r => `<li style="display:flex;gap:8px;"><span style="color:var(--crimson);flex-shrink:0;">⚠</span><span>${escapeHtml(r)}</span></li>`).join('')}
        </ul>
      </div>`).join('') : '';
    return `
      ${heroBlock({
        kicker:'FUNDAMENTAL ANALYSIS',
        title:`${ticker} — Quarter-to-Quarter Comparative Analysis`,
        subtitle: isBank
          ? `Multi-quarter bank income statement with NII, fee income, efficiency, ROTCE, and capital ratios.`
          : `Multi-quarter financial trend with margin profile, cash flow generation, and balance-sheet snapshot.`,
        badges: isBank ? [
          { label:'Latest revenue', value: summary.latest_revenue_b != null ? '$' + summary.latest_revenue_b + 'B' : (q_latest.rev_q_M ? '$' + (q_latest.rev_q_M/1000).toFixed(2) + 'B' : '—'),
            color:'var(--mint)', sub: summary.latest_quarter || fy_q_label(q_latest) },
          { label:'Efficiency', value: pct(summary.latest_efficiency_ratio_pct ?? q_latest.efficiency_ratio_pct, 1), color:'var(--mint)' },
          { label:'ROE', value: pct(summary.latest_roe_pct ?? q_latest.roe_pct, 2), color:'var(--mint)' },
          { label:'ROTCE', value: pct(summary.latest_rotce_pct ?? q_latest.rotce_pct, 2), color:'var(--mint)' },
        ] : [
          { label:'Latest revenue', value: summary.latest_revenue_b != null ? '$' + summary.latest_revenue_b + 'B' : (q_latest.rev_q_M ? '$' + (q_latest.rev_q_M/1000).toFixed(2) + 'B' : '—'),
            color:'var(--mint)', sub: summary.latest_quarter || fy_q_label(q_latest) },
          { label:'GM (latest)', value: pct(summary.latest_gross_margin_pct || q_latest.gross_margin_pct, 2), color:'var(--mint)' },
          { label:'OM (latest)', value: pct(summary.latest_operating_margin_pct || q_latest.operating_margin_pct, 2) },
          { label:'NM (latest)', value: pct(summary.latest_net_margin_pct || q_latest.net_margin_pct, 2) },
        ],
      })}
      ${analystCommentaryFundamentals(ticker, c)}
      ${horizonViewsSection(c, 'fundamentals')}
      ${summary.yoy_revenue_growth_pct != null || summary.ttm_revenue_b != null ? section('Key trends', `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
          ${summary.yoy_revenue_growth_pct != null ? `<div class="mini-card"><div class="mini-card-label">Revenue YoY</div><div class="mini-card-value" style="color:${summary.yoy_revenue_growth_pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${summary.yoy_revenue_growth_pct >= 0 ? '+' : ''}${summary.yoy_revenue_growth_pct.toFixed(1)}%</div></div>` : ''}
          ${summary.ttm_revenue_b != null ? `<div class="mini-card"><div class="mini-card-label">TTM Revenue</div><div class="mini-card-value">$${summary.ttm_revenue_b}B</div></div>` : ''}
          ${summary.ttm_revenue_yoy_pct != null ? `<div class="mini-card"><div class="mini-card-label">TTM YoY</div><div class="mini-card-value" style="color:${summary.ttm_revenue_yoy_pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${summary.ttm_revenue_yoy_pct >= 0 ? '+' : ''}${summary.ttm_revenue_yoy_pct.toFixed(1)}%</div></div>` : ''}
          ${summary.latest_eps != null ? `<div class="mini-card"><div class="mini-card-label">Latest EPS</div><div class="mini-card-value">$${summary.latest_eps.toFixed(2)}</div></div>` : ''}
          ${isBank && q_latest.nii_q_M != null ? `<div class="mini-card"><div class="mini-card-label">Latest NII</div><div class="mini-card-value">$${(q_latest.nii_q_M/1000).toFixed(2)}B</div></div>` : ''}
          ${isBank && (summary.latest_roe_pct ?? q_latest.roe_pct) != null ? `<div class="mini-card"><div class="mini-card-label">Latest ROE</div><div class="mini-card-value">${(summary.latest_roe_pct ?? q_latest.roe_pct).toFixed(2)}%</div></div>` : ''}
          ${isBank && (summary.latest_rotce_pct ?? q_latest.rotce_pct) != null ? `<div class="mini-card"><div class="mini-card-label">Latest ROTCE</div><div class="mini-card-value">${(summary.latest_rotce_pct ?? q_latest.rotce_pct).toFixed(2)}%</div></div>` : ''}
          ${isBank && (summary.latest_efficiency_ratio_pct ?? q_latest.efficiency_ratio_pct) != null ? `<div class="mini-card"><div class="mini-card-label">Efficiency Ratio</div><div class="mini-card-value">${(summary.latest_efficiency_ratio_pct ?? q_latest.efficiency_ratio_pct).toFixed(1)}%</div></div>` : ''}
          ${isBank && q_latest.cet1_ratio_pct != null ? `<div class="mini-card"><div class="mini-card-label">CET1 Capital</div><div class="mini-card-value">${q_latest.cet1_ratio_pct.toFixed(2)}%</div></div>` : ''}
          ${isBank && q_latest.tangible_book_value_per_share != null ? `<div class="mini-card"><div class="mini-card-label">Tangible BV/sh</div><div class="mini-card-value">$${q_latest.tangible_book_value_per_share.toFixed(2)}</div></div>` : ''}
          ${!isBank && summary.latest_ocf_b != null ? `<div class="mini-card"><div class="mini-card-label">OCF (latest Q)</div><div class="mini-card-value">$${summary.latest_ocf_b}B</div></div>` : ''}
          ${!isBank && summary.latest_fcf_b != null ? `<div class="mini-card"><div class="mini-card-label">FCF (latest Q)</div><div class="mini-card-value">$${summary.latest_fcf_b}B</div></div>` : ''}
        </div>`) : ''}
      ${section('Per-quarter line items', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">${headers}</tr></thead>
        <tbody>${tableRows}</tbody></table></div>`)}
      ${chartImgs.length ? section('Charts', chartImgs.join('')) : ''}
      ${rfHtml ? section('Risk factors (per 10-K Item 1A)', rfHtml) : ''}
    `;
  }

  function renderTechnical(ticker, td) {
    const taRaw = td.ta || {};
    // Normalize: different tickers use different field names (close/spot, sma_50/sma50).
    // Map every variant to a canonical form.
    const ta = Object.assign({}, taRaw, {
      spot: taRaw.spot ?? taRaw.close ?? taRaw.spot_price,
      spot_date: taRaw.spot_date ?? taRaw.as_of,
      sma20: taRaw.sma20 ?? taRaw.sma_20,
      sma50: taRaw.sma50 ?? taRaw.sma_50,
      sma100: taRaw.sma100 ?? taRaw.sma_100,
      sma200: taRaw.sma200 ?? taRaw.sma_200,
      rsi14: taRaw.rsi14 ?? taRaw.rsi_14,
      adx14: taRaw.adx14 ?? taRaw.adx_14,
      atr14: taRaw.atr14 ?? taRaw.atr_14,
      high_52w: taRaw.high_52w ?? taRaw.week52_high,
      low_52w: taRaw.low_52w ?? taRaw.week52_low,
      pct_above_sma200_pct: taRaw.pct_above_sma200_pct ?? taRaw.price_vs_sma_200,
      pct_above_sma50_pct: taRaw.pct_above_sma50_pct ?? taRaw.price_vs_sma_50,
    });
    if (ta.spot == null) return emptyState(`Technical data not available for ${ticker}.`);
    const charts = chartsFor(ticker, ['tech_01','tech_02','tech_03','tech_04','tech_05']);
    const dd = ta.drawdown_from_52w_high_pct != null ? (ta.drawdown_from_52w_high_pct * 100).toFixed(1) : '0.0';
    const rsi = ta.rsi14;
    const rsiRead = rsi == null ? '—' : (rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral');
    return `
      ${heroBlock({
        kicker:'TECHNICAL ANALYSIS',
        title:`${ticker} — Trend, momentum, support/resistance`,
        subtitle: ta.spot_date ? `As of ${ta.spot_date}` : '',
        badges:[
          { label:'Last', value: dollar(ta.spot), color:'var(--mint)', sub: ta.spot_date || '' },
          { label:'52w range', value: '$' + (ta.low_52w || 0).toFixed(0) + ' – $' + (ta.high_52w || 0).toFixed(0), sub:'DD ' + dd + '%' },
          { label:'200-DMA', value: dollar(ta.sma200), color: ta.spot > ta.sma200 ? 'var(--mint)' : 'var(--crimson)',
            sub: (ta.spot > ta.sma200 ? 'Above ' : 'Below ') + (ta.pct_above_sma200_pct != null ? ta.pct_above_sma200_pct.toFixed(1) + '%' : '') },
          { label:'RSI(14)', value: rsi != null ? rsi.toFixed(0) : '—', color: rsi > 70 ? 'var(--crimson)' : rsi < 30 ? 'var(--mint)' : 'var(--accent)', sub: rsiRead },
        ],
      })}
      ${analystCommentaryTechnical(ticker, ta)}
      ${horizonViewsSection(td.company || {}, 'technicals')}
      ${section('Indicator dashboard', `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">${['Indicator','Value','Read'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${ta.sma20 != null ? taRow('20-DMA', dollar(ta.sma20), 'Spot ' + (ta.spot >= ta.sma20 ? 'above' : 'below')) : ''}
          ${ta.sma50 != null ? taRow('50-DMA', dollar(ta.sma50), 'Spot ' + (ta.pct_above_sma50_pct != null ? (ta.pct_above_sma50_pct >= 0 ? '+' : '') + ta.pct_above_sma50_pct.toFixed(1) + '% vs SMA50' : '—')) : ''}
          ${ta.sma100 != null ? taRow('100-DMA', dollar(ta.sma100), 'Long-term anchor') : ''}
          ${ta.sma200 != null ? taRow('200-DMA', dollar(ta.sma200), 'Spot ' + (ta.pct_above_sma200_pct != null ? (ta.pct_above_sma200_pct >= 0 ? '+' : '') + ta.pct_above_sma200_pct.toFixed(1) + '% vs SMA200' : '—')) : ''}
          ${rsi != null ? taRow('RSI(14)', rsi.toFixed(2), rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral') : ''}
          ${ta.macd != null ? taRow('MACD', ta.macd.toFixed(4) + (ta.macd_signal != null ? ' (sig ' + ta.macd_signal.toFixed(4) + ')' : ''), ta.macd > (ta.macd_signal || 0) ? 'Above signal — bullish' : 'Below signal — bearish') : ''}
          ${ta.adx14 != null ? taRow('ADX(14)', ta.adx14.toFixed(2), ta.adx14 > 25 ? 'Trending (' + (ta.plus_di > ta.minus_di ? 'up' : 'down') + ')' : 'Range-bound') : ''}
          ${ta.atr14 != null ? taRow('ATR(14)', ta.atr14.toFixed(2), 'Daily volatility band') : ''}
          ${ta.stoch_k != null ? taRow('Stochastic %K', ta.stoch_k.toFixed(2), ta.stoch_k > 80 ? 'Overbought' : ta.stoch_k < 20 ? 'Oversold' : 'Neutral') : ''}
          ${ta.bb_up != null && ta.bb_lo != null ? taRow('Bollinger bands', dollar(ta.bb_lo) + ' – ' + dollar(ta.bb_up), ta.spot >= ta.bb_up ? 'Touching upper' : ta.spot <= ta.bb_lo ? 'Touching lower' : 'Within bands') : ''}
          ${ta.obv_60d_pct_change_pct != null ? taRow('OBV 60d Δ', (ta.obv_60d_pct_change_pct >= 0 ? '+' : '') + ta.obv_60d_pct_change_pct.toFixed(2) + '%', ta.obv_60d_pct_change_pct >= 0 ? 'Accumulation' : 'Distribution') : ''}
          ${ta.last_cross_date ? taRow('SMA50/SMA200', ta.sma50_above_sma200 ? 'Golden cross' : 'Death cross', 'Last cross ' + ta.last_cross_date) : ''}
        </tbody></table>`)}
      ${section('Price performance', `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <thead><tr style="background:var(--bg);">${['Window','Return','Read'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${ta.price_30d_change_pct != null ? taRow('30 days', (ta.price_30d_change_pct >= 0 ? '+' : '') + ta.price_30d_change_pct.toFixed(2) + '%', ta.price_30d_change_pct >= 0 ? 'Up' : 'Down') : ''}
          ${ta.price_60d_change_pct != null ? taRow('60 days', (ta.price_60d_change_pct >= 0 ? '+' : '') + ta.price_60d_change_pct.toFixed(2) + '%', ta.price_60d_change_pct >= 0 ? 'Up' : 'Down') : ''}
          ${ta.price_90d_change_pct != null ? taRow('90 days', (ta.price_90d_change_pct >= 0 ? '+' : '') + ta.price_90d_change_pct.toFixed(2) + '%', ta.price_90d_change_pct >= 0 ? 'Up' : 'Down') : ''}
          ${ta.price_1y_change_pct != null ? taRow('1 year',  (ta.price_1y_change_pct >= 0 ? '+' : '') + ta.price_1y_change_pct.toFixed(2) + '%',  ta.price_1y_change_pct >= 0 ? 'Up' : 'Down') : ''}
        </tbody></table>`)}
      ${charts.length ? section('Charts', charts.join('')) : ''}
    `;
  }

  function renderOptions(ticker, td) {
    const om = td.options || {};
    const t = (td.factset && td.factset.target) || {};
    const charts = chartsFor(ticker, ['opt_01','opt_02','opt_03','opt_04','opt_05','opt_06','opt_07']);
    // If no JSON options data, still render hero (using factset spot/target) + charts.
    if (om.spot == null) {
      return `
        ${heroBlock({
          kicker:'OPTIONS ANALYSIS',
          title:`${ticker} — Options positioning · skew · implied moves`,
          subtitle: t.price ? `Spot $${t.price.toFixed(2)} · next earnings ${t.next_earnings_date || 'TBD'} · charts derived from OPRA chain.` : 'Options charts derived from extracted OPRA chain.',
          badges:[
            { label:'Spot', value: t.price ? '$' + t.price.toFixed(2) : '—', color:'var(--mint)' },
            { label:'Target', value: t.target_price ? '$' + Math.round(t.target_price) : '—' },
            { label:'Next earnings', value: t.next_earnings_date || '—', sub:'consensus' },
            { label:'Beta 3Y', value: t.Beta_3Y != null ? t.Beta_3Y.toFixed(2) : '—' },
          ],
        })}
        ${analystCommentaryOptions(ticker, om, t)}
        ${horizonViewsSection(td.company || {}, 'options')}
        ${charts.length ? section('Options charts', charts.join('')) : ''}
      `;
    }
    const term = om.term_structure || [];
    const front = term[0] || {};
    const topOi = (om.top_oi_strikes || []).slice(0, 8);
    return `
      ${heroBlock({
        kicker:'OPTIONS ANALYSIS',
        title:`${ticker} — IV term · skew · OI positioning · implied moves`,
        subtitle: `Spot $${om.spot} · ${om.expiries_count ? om.expiries_count + ' expiries' : term.length + ' expiries parsed'} · ${om.total_contracts ? om.total_contracts.toLocaleString() + ' total contracts' : ''}`,
        badges:[
          { label:'ATM IV (front)', value: front.atm_iv != null ? front.atm_iv.toFixed(1) + '%' : '—', color:'var(--amber)', sub: front.expiry ? front.expiry + (front.dte != null ? ' (' + front.dte + 'd)' : '') : '' },
          { label:'P/C OI', value: om.pcr_oi != null ? om.pcr_oi.toFixed(3) : '—', color: om.pcr_oi > 1 ? 'var(--crimson)' : 'var(--mint)', sub: om.pcr_oi > 1 ? 'Put-heavy' : 'Call-heavy' },
          { label:'P/C Vol', value: om.pcr_vol != null ? om.pcr_vol.toFixed(3) : '—' },
          { label:'25Δ skew (front)', value: (om.skew_25d_per_expiry && om.skew_25d_per_expiry[0]) ? om.skew_25d_per_expiry[0].skew + ' pts' : (om.skew_25d_pp != null ? om.skew_25d_pp.toFixed(2) + ' pts' : '—'),
            sub: ((om.skew_25d_per_expiry && om.skew_25d_per_expiry[0] && om.skew_25d_per_expiry[0].skew < 0) || om.skew_25d_pp < 0) ? 'Put-skew (bearish)' : 'Call-skew (bullish)' },
        ],
      })}
      ${analystCommentaryOptions(ticker, om, t)}
      ${horizonViewsSection(td.company || {}, 'options')}
      ${charts.length ? section('Charts', charts.join('')) : ''}
      ${term.length ? section('ATM IV term structure', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:var(--bg);">${['Expiry','DTE','ATM strike','ATM IV','Call IV','Put IV'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>${term.slice(0, 12).map(e => `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(e.expiry || '')}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${e.dte != null ? e.dte + 'd' : '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">$${e.atm_strike != null ? e.atm_strike : '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">${e.atm_iv != null ? e.atm_iv.toFixed(1) + '%' : '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--mint);">${e.call_iv != null ? e.call_iv.toFixed(1) + '%' : '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--crimson);">${e.put_iv != null ? e.put_iv.toFixed(1) + '%' : '—'}</td>
        </tr>`).join('')}</tbody></table></div>`) : ''}
      ${topOi.length ? section('Open interest concentration (top strikes)', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:var(--bg);">${['Strike','Call OI','Put OI','Total OI','% from spot'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>${topOi.map(s => `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:600;">$${s.strike}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--mint);">${(s.call_oi || 0).toLocaleString()}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--crimson);">${(s.put_oi || 0).toLocaleString()}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">${(s.total || 0).toLocaleString()}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--muted);">${(((s.strike/om.spot)-1)*100).toFixed(1)}%</td>
        </tr>`).join('')}</tbody></table></div>`) : ''}
      ${om.max_pain_by_exp && om.max_pain_by_exp.length ? section('Max-pain by expiry', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:var(--bg);">${['Expiry','DTE','Max-pain','% from spot'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>${om.max_pain_by_exp.slice(0, 12).map(e => `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(e.expiry || '')}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${e.dte != null ? e.dte + 'd' : '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">$${e.max_pain}</td>
          <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:${e.max_pain < om.spot ? 'var(--crimson)' : 'var(--mint)'};">${(((e.max_pain/om.spot)-1)*100).toFixed(1)}%</td>
        </tr>`).join('')}</tbody></table></div>`) : ''}
      ${om.implied_moves && om.implied_moves.length ? section('Implied moves by expiry', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:var(--bg);">${['Expiry','DTE','ATM IV','±Move (%)','±Move ($)','Upper bound','Lower bound'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>${om.implied_moves.slice(0, 18).map(e => {
          const move = e.implied_move_abs;
          const up = (om.spot != null && move != null) ? om.spot + move : null;
          const dn = (om.spot != null && move != null) ? om.spot - move : null;
          return `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(e.expiry || '')}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${e.dte != null ? e.dte + 'd' : '—'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${e.atm_iv_pct != null ? e.atm_iv_pct.toFixed(1) + '%' : '—'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;color:var(--accent);">${e.implied_move_pct != null ? '±' + e.implied_move_pct.toFixed(2) + '%' : '—'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${e.implied_move_abs != null ? '±$' + e.implied_move_abs.toFixed(2) : '—'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--mint);">${up != null ? '$' + up.toFixed(2) : '—'}</td>
            <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--crimson);">${dn != null ? '$' + dn.toFixed(2) : '—'}</td>
          </tr>`;
        }).join('')}</tbody></table></div>`) : ''}
    `;
  }

  function renderValuation(ticker, td) {
    const fs = td.factset || {};
    const tRaw = fs.target || {};
    // Normalize target to canonical fields. Some tickers (BABA) use
    // legacy lowercase + market_cap_b/ev_b instead of mkt_cap_B/ev_B.
    const t = Object.assign({}, tRaw, {
      mkt_cap_B: tRaw.mkt_cap_B ?? tRaw.market_cap_b ?? tRaw.market_cap_B
        ?? (tRaw.mkt_cap_M != null ? tRaw.mkt_cap_M / 1000 : null)
        ?? (tRaw.market_cap_m != null ? tRaw.market_cap_m / 1000 : null),
      ev_B: tRaw.ev_B ?? tRaw.ev_b
        ?? (tRaw.ev_M != null ? tRaw.ev_M / 1000 : null)
        ?? (tRaw.enterprise_value_m != null ? tRaw.enterprise_value_m / 1000 : null),
    });
    // Normalize peers: factsets vary widely. Handle every field-name variant
    // we've seen: uppercase/lowercase, _LTM/_FY1, market_cap_m vs mkt_cap_B,
    // price vs price_local, etc. Always emit the same canonical shape.
    // Also handle dict-keyed peers (AMAT uses `{LRCX: {...}, KLAC: {...}}`).
    let rawPeers = fs.peers || fs.peer_table || [];
    if (rawPeers && !Array.isArray(rawPeers) && typeof rawPeers === 'object') {
      rawPeers = Object.entries(rawPeers).map(([k, v]) => ({ ticker: k, ...v }));
    }
    if (!Array.isArray(rawPeers)) rawPeers = [];
    const peers = rawPeers.map(p => {
      // mkt_cap can be in M (millions) or B (billions)
      const mktCap = p.mkt_cap_B ?? p.market_cap_B
        ?? (p.market_cap_m != null ? p.market_cap_m / 1000 : null)
        ?? (p.mkt_cap_M != null ? p.mkt_cap_M / 1000 : null);
      const ev = p.ev_B ?? p.enterprise_value_B
        ?? (p.enterprise_value_m != null ? p.enterprise_value_m / 1000 : null)
        ?? (p.ev_M != null ? p.ev_M / 1000 : null);
      return {
        ticker: p.ticker || '',
        name: p.name || '',
        fiscal_period: p.fiscal_period || p.fy_end || '',
        price: p.price ?? p.price_local ?? null,
        target_price: p.target_price ?? p.price_target_local ?? null,
        mkt_cap_B: mktCap,
        ev_B: ev,
        PE_FY1: p.PE_FY1 ?? p.pe_fy1 ?? null,
        PE_FY2: p.PE_FY2 ?? p.pe_fy2 ?? null,
        PE_LTM: p.PE_LTM ?? p.pe_ltm ?? null,
        EV_EBITDA_FY1: p.EV_EBITDA_FY1 ?? p.ev_ebitda_fy1 ?? p.EV_EBITDA ?? null,
        EV_EBITDA_FY2: p.EV_EBITDA_FY2 ?? p.ev_ebitda_fy2 ?? null,
        EV_Sales_LTM: p.EV_Sales_LTM ?? p.ev_sales_ltm ?? p.EV_Sales_FY1 ?? p.ev_sales_fy1 ?? p.PS_LTM ?? null,
        rating: p.rating || '',
      };
    });
    const agg = fs.peer_aggregates || {};
    // BABA uses `averages` with lowercase keys; CapIQ uses peer_aggregates.{median,mean}.
    const median = agg.median || {
      PE_FY1: (fs.medians && fs.medians.pe_fy1) ?? null,
      PE_FY2: (fs.medians && fs.medians.pe_fy2) ?? null,
      EV_EBITDA_FY1: (fs.medians && fs.medians.ev_ebitda_fy1) ?? null,
      EV_Sales_LTM: (fs.medians && fs.medians.ev_sales_fy1) ?? null,
    };
    const mean = agg.mean || {
      PE_FY1: (fs.averages && fs.averages.pe_fy1) ?? null,
      PE_FY2: (fs.averages && fs.averages.pe_fy2) ?? null,
      EV_EBITDA_FY1: (fs.averages && fs.averages.ev_ebitda_fy1) ?? null,
      EV_Sales_LTM: (fs.averages && fs.averages.ev_sales_fy1) ?? null,
    };
    const pd = fs.premium_discount_vs_peer_median || {};
    // Prefer val_ charts; if none exist (the monolith stored them via IMG_MAP
    // only for some tickers), fall back to fundamentals charts which always
    // exist and contain comparable margin/multiple visualizations.
    let charts = chartsFor(ticker, ['val_01','val_02','val_03','val_04','val_05']);
    if (charts.length === 0) {
      charts = chartsFor(ticker, ['fund_01','fund_02','fund_03']);
    }
    const upside = impliedUpsidePct(t);

    // pd values may be numeric OR a pre-formatted string like "+44% premium (...)"
    // Coerce uniformly: if number → format ourselves; if string → trim to first 30 chars.
    const pdFmt = (k) => {
      const v = pd[k];
      if (v == null) return '';
      if (typeof v === 'number') return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
      const s = String(v);
      // Try to extract a leading "+N%" / "-N%" pattern from the string
      const m = s.match(/^[+-]?\d+(?:\.\d+)?%/);
      return m ? m[0] : s.slice(0, 22);
    };

    const peerRow = (p, isTarget) => `<tr ${isTarget ? 'style="background:rgba(99,102,241,.10);font-weight:600;"' : ''}>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(p.name || p.ticker || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-size:10.5px;">${escapeHtml(p.ticker || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(p.fiscal_period || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.price != null ? p.price.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:${isTarget ? 'var(--mint)' : 'var(--muted)'};">${p.target_price != null ? p.target_price.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.mkt_cap_B != null ? p.mkt_cap_B.toFixed(1) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.PE_FY1 != null ? p.PE_FY1.toFixed(2) + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.PE_FY2 != null ? p.PE_FY2.toFixed(2) + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.EV_EBITDA_FY1 != null && p.EV_EBITDA_FY1 >= 0 ? p.EV_EBITDA_FY1.toFixed(2) + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.EV_Sales_LTM != null ? p.EV_Sales_LTM.toFixed(2) + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--muted);">${escapeHtml(p.rating || '')}</td>
    </tr>`;

    return `
      ${heroBlock({
        kicker:'VALUATION & COMPARABLES',
        title:`${ticker} — Where it trades vs the peer set`,
        subtitle: t.mkt_cap_B != null ? `MktCap $${t.mkt_cap_B}B · EV $${t.ev_B}B · ${fs.captured ? 'FactSet ' + fs.captured.substring(0, 19) : ''}` : '',
        badges:[
          { label:'P/E FY1', value: t.PE_FY1 != null ? t.PE_FY1.toFixed(2) + 'x' : '—', color: t.PE_FY1 < (median.PE_FY1 || 999) ? 'var(--mint)' : 'var(--crimson)',
            sub: 'median ' + (median.PE_FY1 != null ? median.PE_FY1.toFixed(2) + 'x' : '—') + (pd.PE_FY1 != null ? ' · ' + pdFmt('PE_FY1') : '') },
          { label:'EV/EBITDA FY1', value: t.EV_EBITDA_FY1 != null ? t.EV_EBITDA_FY1.toFixed(2) + 'x' : '—',
            sub: 'median ' + (median.EV_EBITDA_FY1 != null ? median.EV_EBITDA_FY1.toFixed(2) + 'x' : '—') + (pd.EV_EBITDA_FY1 != null ? ' · ' + pdFmt('EV_EBITDA_FY1') : '') },
          { label:'EV/Sales LTM', value: t.EV_Sales_LTM != null ? t.EV_Sales_LTM.toFixed(2) + 'x' : '—',
            sub: 'median ' + (median.EV_Sales_LTM != null ? median.EV_Sales_LTM.toFixed(2) + 'x' : '—') },
          { label:'Target', value: t.target_price ? '$' + Math.round(t.target_price) : '—', color:'var(--mint)',
            sub: upside != null ? (upside >= 0 ? '+' : '') + upside.toFixed(1) + '%' + ' upside' : '' },
        ],
      })}
      ${analystCommentaryValuation(ticker, fs)}
      ${charts.length ? section('Charts', charts.join('')) : ''}
      ${peers.length ? section('Peer comp table (FactSet)', `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11.5px;">
        <thead><tr style="background:var(--bg);">${['Company','Ticker','FY end','Price','Target','MktCap ($B)','P/E FY1','P/E FY2','EV/EBITDA FY1','EV/Sales LTM','Rating'].map(h=>`<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${peerRow(t, true)}
          ${peers.map(p => peerRow(p, false)).join('')}
          <tr style="background:var(--bg);font-weight:600;">
            <td colspan="6" style="padding:7px 10px;border-top:2px solid var(--border);">Peer MEDIAN</td>
            <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;">${median.PE_FY1 != null ? median.PE_FY1.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;">${median.PE_FY2 != null ? median.PE_FY2.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;">${median.EV_EBITDA_FY1 != null ? median.EV_EBITDA_FY1.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;">${median.EV_Sales_LTM != null ? median.EV_Sales_LTM.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;border-top:2px solid var(--border);"></td>
          </tr>
          <tr style="background:var(--bg);font-weight:500;color:var(--muted);">
            <td colspan="6" style="padding:7px 10px;">Peer MEAN</td>
            <td style="padding:7px 10px;text-align:right;">${mean.PE_FY1 != null ? mean.PE_FY1.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;text-align:right;">${mean.PE_FY2 != null ? mean.PE_FY2.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;text-align:right;">${mean.EV_EBITDA_FY1 != null ? mean.EV_EBITDA_FY1.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;text-align:right;">${mean.EV_Sales_LTM != null ? mean.EV_Sales_LTM.toFixed(2) + 'x' : '—'}</td>
            <td style="padding:7px 10px;"></td>
          </tr>
        </tbody></table></div>`) : ''}
      ${section('Target multiples & consensus', `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
        ${t.PE_LTM != null ? `<div class="mini-card"><div class="mini-card-label">P/E LTM</div><div class="mini-card-value">${t.PE_LTM.toFixed(2)}x</div></div>` : ''}
        ${t.EV_EBITDA_LTM != null ? `<div class="mini-card"><div class="mini-card-label">EV/EBITDA LTM</div><div class="mini-card-value">${t.EV_EBITDA_LTM.toFixed(2)}x</div></div>` : ''}
        ${t.PS_LTM != null ? `<div class="mini-card"><div class="mini-card-label">P/S LTM</div><div class="mini-card-value">${t.PS_LTM.toFixed(2)}x</div></div>` : ''}
        ${t.FCF_Yield_pct != null ? `<div class="mini-card"><div class="mini-card-label">FCF yield</div><div class="mini-card-value">${t.FCF_Yield_pct.toFixed(2)}%</div></div>` : ''}
        ${t.Div_Yield_pct != null ? `<div class="mini-card"><div class="mini-card-label">Div yield</div><div class="mini-card-value">${t.Div_Yield_pct.toFixed(2)}%</div></div>` : ''}
        ${t.WACC_pct != null ? `<div class="mini-card"><div class="mini-card-label">WACC</div><div class="mini-card-value">${t.WACC_pct.toFixed(2)}%</div></div>` : ''}
        ${t.Beta_3Y != null ? `<div class="mini-card"><div class="mini-card-label">Beta 3Y</div><div class="mini-card-value">${t.Beta_3Y.toFixed(2)}</div></div>` : ''}
        ${t.broker_contributors != null ? `<div class="mini-card"><div class="mini-card-label">Broker count</div><div class="mini-card-value">${t.broker_contributors}</div></div>` : ''}
        ${t.next_earnings_date ? `<div class="mini-card"><div class="mini-card-label">Next earnings</div><div class="mini-card-value" style="font-size:14px;">${t.next_earnings_date}</div></div>` : ''}
      </div>`)}
    `;
  }

  function renderMcs(ticker, td) {
    const c = td.company || {};
    const qa = c.q2q_analysis || {};
    const pairs = qa.q_to_q_pairs || [];
    const hits = computeHits(c);
    return `
      ${heroBlock({
        kicker:'MANAGEMENT COMMENTARY & CREDIBILITY (MCS)',
        title:`${ticker} — Said → Actual → Verdict`,
        subtitle:'Each forward commitment from the earnings call paired with the next quarter actual + analyst verdict.',
        badges:[
          { label:'MCS simple', value: c.mcs_simple != null ? c.mcs_simple.toFixed(4) : '—', color:'var(--accent)', sub: `${c.beats||0}B · ${hits}H · ${c.misses||0}M` },
          { label:'MCS info-adj', value: c.mcs_information_adjusted != null ? c.mcs_information_adjusted.toFixed(4) : '—' },
          { label:'MCS diff-w', value: c.mcs_difficulty_weighted != null ? c.mcs_difficulty_weighted.toFixed(4) : '—' },
          { label:'Tracked claims', value: (c.n_claims || pairs.length || 0) + '' },
        ],
      })}
      ${analystCommentaryMcs(ticker, c)}
      ${section('Aggregate metrics', mcsAggregate(c))}
      ${pairs.length ? pairs.map(p => mcsPairCard(p, ticker)).join('') :
        ((c.rows && c.rows.length) ? section('Forward claims (rows[])',
          `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead><tr style="background:var(--bg);">${['Claim','Quarter made','Target qtr','Guided','Actual','Δ %','Verdict'].map(h=>`<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('')}</tr></thead>
            <tbody>${c.rows.map(r => {
              const v = (r.verdict || '');
              const color = v.toLowerCase().startsWith('beat') ? 'var(--mint)' : v.toLowerCase().includes('miss') ? 'var(--crimson)' : 'var(--accent)';
              return `<tr>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:600;">${escapeHtml(r.claim_id || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(r.quarter_made || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(r.target_quarter || '')}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${escapeHtml(r.guided || (r.guide_mid_b != null ? '$' + r.guide_mid_b + 'B' : ''))}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(r.actual || (r.actual_b != null ? '$' + r.actual_b + 'B' : ''))}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:${r.pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${r.pct != null ? (r.pct >= 0 ? '+' : '') + r.pct.toFixed(2) + '%' : '—'}</td>
                <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:${color};font-weight:600;">${escapeHtml(v)}</td>
              </tr>`;
            }).join('')}</tbody></table></div>`) :
          emptyState(`Quarter-to-quarter pairs not available for ${ticker}.`))}
    `;
  }

  function renderInvestmentView(ticker, td) {
    const n = td.narrative || {};
    const c = td.company || {};
    const fs = td.factset || {};
    const t = fs.target || {};
    const upside = impliedUpsidePct(t);
    // Charts removed — Investment View is now a pure synthesis tab:
    // it tells the analyst WHAT the rest of the dashboard means for market
    // outlook, without re-showing pictures already present in Summary/F/T/O.
    // Build a synthesized thesis-construction guide
    const synthesisBullets = [];
    if (n.stance) {
      synthesisBullets.push(`<strong>Current view:</strong> ${escapeHtml(n.stance)}. ${escapeHtml((n.summary || '').split('.').slice(0, 2).join('.') + '.')}`);
    }
    const hits = computeHits(c);
    if (c.mcs_simple != null) {
      synthesisBullets.push(`<strong>Management credibility weight:</strong> MCS simple = ${c.mcs_simple.toFixed(3)} (${c.beats || 0}B/${hits}H/${c.misses || 0}M on ${c.n_claims || (c.beats||0)+hits+(c.misses||0)} forward claims). ${c.mcs_simple > 0.85 ? 'High — trust management\'s next-quarter guide near midpoint; you can size based on guidance with high confidence.' : c.mcs_simple > 0.7 ? 'Above-average — guidance is useful but discount the high-end of ranges modestly.' : 'Below-average — model independently from management\'s claims; weight your own analysis higher.'}`);
    }
    if (t.PE_FY1 != null) {
      const peerMed = fs.peer_aggregates?.median?.PE_FY1 ?? fs.medians?.pe_fy1;
      const prem = peerMed ? ((t.PE_FY1 / peerMed) - 1) * 100 : null;
      synthesisBullets.push(`<strong>Valuation lens:</strong> ${t.PE_FY1.toFixed(1)}x forward P/E${prem != null ? ` (${prem >= 0 ? '+' : ''}${prem.toFixed(0)}% vs peer median)` : ''}. ${prem != null && prem > 40 ? 'Significant premium — the thesis must explain why this name deserves multiple expansion or why peers are mispriced.' : prem != null && prem < -20 ? 'Discount to peers creates margin of safety; check that the discount isn\'t justified by structural issues.' : 'Valuation is broadly in line with peers — alpha must come from idiosyncratic earnings drivers.'}`);
    }
    if (upside != null) {
      synthesisBullets.push(`<strong>Sell-side anchor:</strong> ${(upside >= 0 ? '+' : '') + upside.toFixed(1) + '%'} to ${dollar(t.target_price, 0)} consensus target. ${upside > 25 ? 'Wide upside — your edge needs to either (a) confirm the consensus or (b) explain a specific catalyst the street is mispricing.' : upside < 0 ? 'Negative implied return signals consensus bearishness; differentiated bull case needs strong evidence.' : 'Modest upside — focus your work on whether forward revisions trend up (catalyst-rich) or down.'}`);
    }
    return `
      ${heroBlock({
        kicker:'INVESTMENT VIEW',
        title:`${ticker} — Stance & Catalysts`,
        subtitle:'Synthesis: stance, catalysts, risks, valuation summary.',
        badges:[
          { label:'Stance', value: (n.stance || '—').toUpperCase(), color: STANCE_COLORS[n.color] || 'var(--accent)' },
          { label:'MCS simple', value: c.mcs_simple != null ? c.mcs_simple.toFixed(4) : '—' },
          { label:'Spot', value: t.price ? dollar(t.price) : '—' },
          { label:'Target', value: t.target_price ? '$' + Math.round(t.target_price) : '—', sub: upside != null ? (upside >= 0 ? '+' : '') + upside.toFixed(1) + '%' : '' },
        ],
      })}
      ${synthesisBullets.length ? section('How to build your thesis from this data', `
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;font-size:13.5px;line-height:1.65;">
          ${synthesisBullets.map(b => `<li style="display:flex;gap:10px;"><span style="color:var(--accent);flex-shrink:0;font-weight:700;">▸</span><span>${b}</span></li>`).join('')}
        </ul>
        <p style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:11.5px;color:var(--muted);font-style:italic;">Three pillars: (1) management credibility weights how heavily you can trust the guide, (2) valuation tells you whether the price embeds your view, (3) the sell-side anchor tells you how crowded your trade is. Use all three together.</p>`) : ''}
      ${n.summary ? section('Why the stance exists', `<p style="font-size:13.5px;line-height:1.65;margin:0;">${escapeHtml(n.summary)}</p>`) : ''}
      ${listSection('Catalysts — what could lift the call', n.trigger_up, 'mint', '▲')}
      ${listSection('Risks — what could break the thesis', n.trigger_down, 'crimson', '▼')}
      ${quoteSection(n.quotes, ticker)}
      ${valuationSummaryCard(t)}
      ${bottomLine(n)}`;
  }

  // ===== Building blocks =====

  function heroBlock({ kicker, title, subtitle, badges = [] }) {
    return `
      <section class="hero card">
        <div class="hero-pad">
          <div class="hero-kicker">${escapeHtml(kicker || '')}</div>
          <h2 class="hero-title">${escapeHtml(title || '')}</h2>
          ${subtitle ? `<p class="hero-sub">${escapeHtml(subtitle)}</p>` : ''}
          ${badges.length ? `<div class="hero-badges">${badges.map(b => `
            <div class="hero-badge">
              <div class="hero-badge-label">${escapeHtml(b.label || '')}</div>
              <div class="hero-badge-value" style="${b.color ? 'color:' + b.color + ';' : ''}">${escapeHtml(b.value || '')}</div>
              ${b.sub ? `<div class="hero-badge-sub">${escapeHtml(b.sub)}</div>` : ''}
            </div>`).join('')}</div>` : ''}
        </div>
      </section>`;
  }

  function section(title, body, opts = {}) {
    return `<section class="card" style="${opts.style || ''}">
      <div class="card-pad">
        <h3 class="section-title" style="${opts.titleStyle || ''}">${escapeHtml(title)}</h3>
        ${body}
      </div>
    </section>`;
  }

  // Coerce a narrative field to an array — some tickers store these as strings
  // (e.g. META's trigger_up is a single sentence). Wrap singletons in an array.
  function asList(x) {
    if (x == null) return [];
    if (Array.isArray(x)) return x;
    if (typeof x === 'string') return x.trim() ? [x] : [];
    return [];
  }

  function listSection(title, items, colorKey, marker) {
    const arr = asList(items);
    if (!arr.length) return '';
    const color = STANCE_COLORS[colorKey] || 'var(--text)';
    const li = arr.map(x => `<li style="display:flex;gap:8px;"><span style="color:${color};font-weight:700;flex-shrink:0;">${marker}</span><span>${escapeHtml(x)}</span></li>`).join('');
    return section(title, `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:0;">${li}</ul>`,
      { titleStyle: 'color:' + color + ';' });
  }

  function triggerSection(n) {
    if (!n) return '';
    const up = asList(n.trigger_up);
    const dn = asList(n.trigger_down);
    if (!up.length && !dn.length) return '';
    const upHtml = up.length ? `<h4 style="margin:0 0 8px 0;color:var(--mint);font-size:13px;">Upgrade triggers</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">${up.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);">▲</span><span>${escapeHtml(t)}</span></li>`).join('')}</ul>` : '';
    const dnHtml = dn.length ? `<h4 style="margin:0 0 8px 0;color:var(--crimson);font-size:13px;">Downgrade triggers</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">${dn.map(t=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);">▼</span><span>${escapeHtml(t)}</span></li>`).join('')}</ul>` : '';
    return section('What would change the call', upHtml + dnHtml);
  }

  function lensRationaleSection(c, td) {
    // Show WHY each lens score was assigned — every input + rule applied.
    // Lets an analyst defend or challenge the leaderboard rank without
    // reading the underlying charts/data themselves.
    const rat = c.lens_rationale;
    const dash = (window.DASHBOARD_DATA && window.DASHBOARD_DATA.companies) || [];
    const lb = dash.find(x => x.ticker === c.ticker);
    const scores = (lb && lb.scores) || {};
    if (!rat) return '';
    const lenses = [
      { key: 'fundamentals', label: 'F · Fundamentals',  score: scores.fundamentals, color: 'var(--mint)' },
      { key: 'management',   label: 'M · Management',    score: scores.management,   color: 'var(--accent)' },
      { key: 'valuation',    label: 'V · Valuation',     score: scores.valuation,    color: 'var(--amber)' },
      { key: 'technicals',   label: 'T · Technicals',    score: scores.technicals,   color: 'var(--accent)' },
      { key: 'options',      label: 'O · Options',       score: scores.options,      color: 'var(--mint)' },
    ];
    const cards = lenses.map(L => {
      const bullets = rat[L.key] || [];
      if (!bullets.length) return '';
      return `<div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;">
          <strong style="font-size:13px;color:${L.color};">${L.label}</strong>
          <span style="font-size:18px;font-weight:700;color:${L.color};">${L.score != null ? L.score.toFixed(1) : '—'}</span>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px;font-size:11.5px;line-height:1.5;color:var(--muted);">
          ${bullets.map(b => `<li style="display:flex;gap:6px;"><span style="color:var(--muted);flex-shrink:0;">·</span><span>${escapeHtml(b)}</span></li>`).join('')}
        </ul>
      </div>`;
    }).join('');
    return section('Why these lens scores — auto-derived from current data', `
      <p style="font-size:12px;color:var(--muted);margin:0 0 12px 0;">Every line below traces directly to a number in the underlying data files. No hand-calibration. If a rank looks wrong, the reason is here.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">${cards}</div>`);
  }

  function scoreboardSection(sb) {
    if (!sb || !sb.length) return '';
    const rows = sb.map(r => {
      const color = STANCE_COLORS[r.verdict_color] || 'var(--text)';
      return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);">${escapeHtml(r.metric || '')}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(r.baseline || '')}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:600;">${escapeHtml(r.latest || '')}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:${color};font-weight:600;">${escapeHtml(r.verdict || '—')}</td>
      </tr>`;
    }).join('');
    return section('Scoreboard', `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">
      <thead><tr style="background:var(--bg);">${['Metric','Baseline','Latest','Verdict'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody></table>`);
  }

  function quoteSection(quotes, ticker) {
    if (!quotes || !quotes.length) return '';
    const blocks = quotes.slice(0, 8).map(q => {
      // Quotes can be: [attr, source, text]  or  [attr, source, text, why_it_matters]
      // or object {speaker, quarter, text, source, note}
      let attr, source, text, note;
      if (Array.isArray(q)) {
        attr = q[0] || ''; source = q[1] || ''; text = q[2] || ''; note = q[3] || '';
      } else {
        attr = (q.speaker || '') + (q.quarter ? ' · ' + q.quarter : '');
        source = q.source || ''; text = q.text || ''; note = q.note || '';
      }
      return `<div style="background:var(--bg);padding:12px 14px;border-radius:8px;margin-bottom:12px;border-left:3px solid var(--accent);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;margin-bottom:6px;">${escapeHtml(attr)}${source ? ' · <code style="font-size:10px;">' + escapeHtml(source) + '</code>' : ''}</div>
        <div style="font-size:13px;font-style:italic;line-height:1.6;margin-bottom:${note ? '8px' : '0'};">"${escapeHtml(text)}"</div>
        ${note ? `<div style="font-size:11.5px;color:var(--mint);line-height:1.55;padding-top:6px;border-top:1px dashed var(--border);"><strong>${escapeHtml(note.split('—')[0].trim())}</strong>${note.includes('—') ? ' — ' + escapeHtml(note.split('—').slice(1).join('—').trim()) : ''}</div>` : ''}
      </div>`;
    }).join('');
    return section(`Key forward-looking quotes (${ticker})`, blocks);
  }

  function bottomLine(n) {
    if (!n.bottom_line) return '';
    return section('Bottom line', `
      <p style="font-size:13.5px;line-height:1.65;margin:0;">${escapeHtml(n.bottom_line)}</p>
      ${n.disclaimer ? `<p style="margin-top:10px;font-size:11.5px;color:var(--muted);font-style:italic;"><b>Disclaimer:</b> ${escapeHtml(n.disclaimer)}</p>` : ''}`,
      { style: 'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);' });
  }

  function growthTable(g) {
    const rows = Object.keys(g).map(k => `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(k)}</td>
      <td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:right;color:${g[k] >= 0 ? 'var(--mint)' : 'var(--crimson)'};font-weight:600;">${g[k] >= 0 ? '+' : ''}${g[k]}%</td>
    </tr>`).join('');
    return `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">${rows}</table>`;
  }

  function taRow(label, value, read) {
    return `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(label)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">${escapeHtml(value)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(read)}</td>
    </tr>`;
  }

  function srBlock(ta) {
    const r = (ta.resistance || []).slice(0, 6);
    const s = (ta.support || []).slice(0, 6);
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
      <div><h4 style="margin:0 0 8px 0;font-size:12.5px;color:var(--crimson);">Resistance</h4>
        <table style="width:100%;border-collapse:collapse;font-size:12.5px;">${r.map(x => `<tr><td style="padding:5px 10px;border-bottom:1px solid var(--border);">$${x.toFixed(2)}</td><td style="padding:5px 10px;text-align:right;color:var(--crimson);">${(((x/ta.close)-1)*100).toFixed(1)}%</td></tr>`).join('')}</table></div>
      <div><h4 style="margin:0 0 8px 0;font-size:12.5px;color:var(--mint);">Support</h4>
        <table style="width:100%;border-collapse:collapse;font-size:12.5px;">${s.map(x => `<tr><td style="padding:5px 10px;border-bottom:1px solid var(--border);">$${x.toFixed(2)}</td><td style="padding:5px 10px;text-align:right;color:var(--mint);">${(((x/ta.close)-1)*100).toFixed(1)}%</td></tr>`).join('')}</table></div>
    </div>`;
  }

  function oiBlock(o) {
    const calls = (o.largest_call_oi || []).slice(0, 5);
    const puts = (o.largest_put_oi || []).slice(0, 5);
    const tbl = (arr, color, label) => `<div>
      <h4 style="margin:0 0 8px 0;font-size:12.5px;color:${color};text-transform:uppercase;letter-spacing:.06em;">${label}</h4>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">${arr.map(x => `<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-weight:600;">$${x.strike}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;">${(x.open_interest || 0).toLocaleString()}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--muted);">${(((x.strike/o.spot)-1)*100).toFixed(1)}% from spot</td>
      </tr>`).join('')}</table></div>`;
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">${tbl(calls, 'var(--mint)', 'Largest call OI')}${tbl(puts, 'var(--crimson)', 'Largest put OI')}</div>`;
  }

  function perExpiryTable(per) {
    const rows = per.map(e => `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(e.expiry || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${e.dte != null ? e.dte + 'd' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">$${e.atm_strike ? e.atm_strike.toFixed(0) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:500;">${e.atm_iv ? (e.atm_iv*100).toFixed(0) + '%' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${e.implied_move_dollars ? '$' + e.implied_move_dollars.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--mint);font-weight:500;">${e.implied_move_pct ? e.implied_move_pct.toFixed(2) + '%' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${e.max_pain ? '$' + e.max_pain.toFixed(0) : '—'}</td>
    </tr>`).join('');
    return `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">
      <thead><tr style="background:var(--bg);">${['Expiry','DTE','ATM strike','ATM IV','Straddle $','Implied %','Max-pain'].map(h => `<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;">${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody></table>`;
  }

  function takeawaysBlock(o) {
    const cols = [
      { label: 'Bullish', color: 'var(--mint)', items: o.bullish_takeaways, marker: '▲' },
      { label: 'Bearish', color: 'var(--crimson)', items: o.bearish_takeaways, marker: '▼' },
      { label: 'Neutral', color: 'var(--amber)', items: o.neutral_takeaways, marker: '●' },
    ].filter(c => c.items && c.items.length);
    if (!cols.length) return '';
    return section('Options-implied takeaways', `<div style="display:grid;grid-template-columns:repeat(${cols.length},1fr);gap:14px;">${cols.map(c => `
      <div><h4 style="margin:0 0 8px 0;font-size:12.5px;color:${c.color};text-transform:uppercase;letter-spacing:.06em;">${c.label}</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.55;">${c.items.map(x => `<li style="display:flex;gap:6px;"><span style="color:${c.color};">${c.marker}</span><span>${escapeHtml(x)}</span></li>`).join('')}</ul></div>`).join('')}</div>`);
  }

  function peerTable(ticker, t, m, peers, avg) {
    const headerCells = ['Company','Ticker','FY end','Price','Target','MktCap ($B)','EV ($B)','EV/Sales','EV/EBITDA','P/E FY1'];
    const headerRow = headerCells.map(h => `<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;">${h}</th>`).join('');
    const tickerRow = `<tr style="background:rgba(99,102,241,.06);">
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:700;">${ticker}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);">${ticker}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">—</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${t.price ? '$' + t.price.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--mint);font-weight:600;">${t.target_price ? '$' + t.target_price.toFixed(0) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">${t.market_cap_b || '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${t.ev_b || '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${(m.ev_sales_fy1 || t.EV_SALES_FY1 || '—') + 'x'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${(m.ev_ebitda_fy1 || t.EV_EBITDA_FY1 || '—') + 'x'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600;">${(m.pe_fy1 || t.PE_FY1 || '—') + 'x'}</td>
    </tr>`;
    const peerRows = peers.map(p => `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);font-weight:500;">${escapeHtml(p.name || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-size:10.5px;">${escapeHtml(p.ticker || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);color:var(--muted);">${escapeHtml(p.fiscal_period || '')}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.price_local != null ? p.price_local.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--muted);">${p.price_target_local != null ? p.price_target_local.toFixed(2) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.market_cap_m ? (p.market_cap_m/1000).toFixed(1) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;color:var(--muted);">${p.enterprise_value_m ? (p.enterprise_value_m/1000).toFixed(1) : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.ev_sales_fy1 != null ? p.ev_sales_fy1 + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.ev_ebitda_fy1 != null && p.ev_ebitda_fy1 >= 0 ? p.ev_ebitda_fy1 + 'x' : '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid var(--border);text-align:right;">${p.pe_fy1 != null ? p.pe_fy1 + 'x' : '—'}</td>
    </tr>`).join('');
    const avgRow = `<tr style="background:var(--bg);">
      <td colspan="7" style="padding:7px 10px;border-top:2px solid var(--border);font-weight:600;">Peer AVG</td>
      <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;font-weight:600;">${avg.ev_sales_fy1 || '—'}x</td>
      <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;font-weight:600;">${avg.ev_ebitda_fy1 || '—'}x</td>
      <td style="padding:7px 10px;border-top:2px solid var(--border);text-align:right;font-weight:600;">${avg.pe_fy1 || '—'}x</td>
    </tr>`;
    return `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:11.5px;">
      <thead><tr style="background:var(--bg);">${headerRow}</tr></thead>
      <tbody>${tickerRow}${peerRows}${avgRow}</tbody></table></div>`;
  }

  function mcsAggregate(c) {
    const hits = computeHits(c);
    const subscores = c.subscores || {};
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px;">
      <div class="mini-card"><div class="mini-card-label">MCS simple</div><div class="mini-card-value">${c.mcs_simple != null ? c.mcs_simple.toFixed(4) : '—'}</div></div>
      <div class="mini-card"><div class="mini-card-label">MCS info-adj</div><div class="mini-card-value">${c.mcs_information_adjusted != null ? c.mcs_information_adjusted.toFixed(4) : '—'}</div></div>
      <div class="mini-card"><div class="mini-card-label">MCS diff-w</div><div class="mini-card-value">${c.mcs_difficulty_weighted != null ? c.mcs_difficulty_weighted.toFixed(4) : '—'}</div></div>
      <div class="mini-card"><div class="mini-card-label">Beats</div><div class="mini-card-value" style="color:var(--mint);">${c.beats || 0}</div></div>
      <div class="mini-card"><div class="mini-card-label">Hits</div><div class="mini-card-value">${hits}</div></div>
      <div class="mini-card"><div class="mini-card-label">Misses</div><div class="mini-card-value" style="color:${(c.misses||0)>0?'var(--crimson)':'var(--muted)'};">${c.misses || 0}</div></div>
      ${c.baseline_random != null ? `<div class="mini-card"><div class="mini-card-label">Baseline (random)</div><div class="mini-card-value">${c.baseline_random.toFixed(2)}</div></div>` : ''}
      ${c.skill_over_baseline != null ? `<div class="mini-card"><div class="mini-card-label">Skill vs baseline</div><div class="mini-card-value" style="color:${c.skill_over_baseline >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${signNum(c.skill_over_baseline)}</div></div>` : ''}
    </div>
    ${Object.keys(subscores).length ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;">
      ${Object.keys(subscores).map(k => `<div class="mini-card"><div class="mini-card-label">${escapeHtml(k)}</div><div class="mini-card-value" style="font-size:15px;">${typeof subscores[k] === 'number' ? subscores[k].toFixed(2) : escapeHtml(String(subscores[k]))}</div></div>`).join('')}
    </div>` : ''}
    `;
  }

  function mcsPairCard(p, ticker) {
    const revLi = (p.line_items || []).find(li => li.metric_kind === 'revenue') || (p.line_items || [])[0] || {};
    const sm = p.summary_metrics || {};
    const sr = p.stock_reaction || {};
    const verdict = revLi.verdict || 'Pending';
    const color = verdict.startsWith('Beat') ? 'var(--mint)' : verdict.startsWith('Miss') ? 'var(--crimson)' : 'var(--accent)';
    const accuracy = sm.mcs_pair_accuracy != null ? sm.mcs_pair_accuracy.toFixed(4) : (revLi.accuracy != null ? revLi.accuracy : '—');
    return `<section class="card" style="margin-bottom:14px;border-left:4px solid ${color};">
      <div class="card-pad">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
          <div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;">Pair</div>
            <div style="font-size:16px;font-weight:600;">${escapeHtml(p.made_in || '')} → ${escapeHtml(p.targets || '')}<span style="color:var(--muted);font-size:12px;font-weight:400;"> · call ${escapeHtml(p.call_date || '—')}</span></div>
          </div>
          <div style="text-align:right;"><div style="font-size:10px;color:var(--muted);">Accuracy</div><div style="font-size:14px;font-weight:600;">${accuracy}</div></div>
        </div>
        <div style="background:var(--bg);padding:11px 14px;border-radius:8px;margin-bottom:10px;border-left:3px solid var(--subtle);">
          <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-weight:700;margin-bottom:4px;">▸ What Management Said</div>
          <div style="font-size:13px;font-style:italic;line-height:1.55;">"${escapeHtml(revLi.guide_quote || 'No verbatim guidance recorded.')}"</div>
          ${revLi.guide_source_file ? `<div style="margin-top:6px;font-size:10px;color:var(--muted);">Source: <code>${escapeHtml(revLi.guide_source_file)}</code></div>` : ''}
        </div>
        <div style="background:var(--bg);padding:11px 14px;border-radius:8px;margin-bottom:10px;border-left:3px solid var(--amber);">
          <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:var(--amber);font-weight:700;margin-bottom:4px;">▸ What Actually Happened</div>
          <table style="width:100%;font-size:12.5px;">
            ${revLi.guide_low_b != null ? `<tr><td style="padding:3px 0;color:var(--muted);">Guide range:</td><td style="padding:3px 0;text-align:right;">$${revLi.guide_low_b}–${revLi.guide_high_b}B (mid $${revLi.guide_mid_b}B)</td></tr>` : ''}
            ${revLi.actual_b != null ? `<tr><td style="padding:3px 0;color:var(--muted);">Actual:</td><td style="padding:3px 0;text-align:right;font-weight:600;">$${revLi.actual_b.toFixed(2)}B</td></tr>` : ''}
            ${sm.revenue_delta_pct != null ? `<tr><td style="padding:3px 0;color:var(--muted);">Δ vs mid:</td><td style="padding:3px 0;text-align:right;color:${sm.revenue_delta_pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${sm.revenue_delta_pct >= 0 ? '+' : ''}${sm.revenue_delta_pct.toFixed(2)}%</td></tr>` : ''}
            <tr><td style="padding:3px 0;color:var(--muted);">Verdict:</td><td style="padding:3px 0;text-align:right;font-weight:600;color:${color};">${escapeHtml(verdict)}</td></tr>
            ${sr.reaction_1d_pct != null ? `<tr><td style="padding:3px 0;color:var(--muted);">Stock T+1:</td><td style="padding:3px 0;text-align:right;color:${sr.reaction_1d_pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${sr.reaction_1d_pct >= 0 ? '+' : ''}${sr.reaction_1d_pct.toFixed(2)}%</td></tr>` : ''}
            ${sr.reaction_5d_pct != null ? `<tr><td style="padding:3px 0;color:var(--muted);">Stock 5-day:</td><td style="padding:3px 0;text-align:right;color:${sr.reaction_5d_pct >= 0 ? 'var(--mint)' : 'var(--crimson)'};">${sr.reaction_5d_pct >= 0 ? '+' : ''}${sr.reaction_5d_pct.toFixed(2)}%</td></tr>` : ''}
          </table>
        </div>
      </div></section>`;
  }

  function valuationSummaryCard(t) {
    if (!t.target_price) return '';
    const upside = (t.implied_upside_pct != null) ? t.implied_upside_pct :
      (t.price && t.target_price ? ((t.target_price / t.price) - 1) * 100 : null);
    return section('Valuation summary (consensus)', `<table style="width:100%;font-size:13px;">
      <tr><td style="padding:5px 0;color:var(--muted);">Spot:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.price ? '$' + t.price.toFixed(2) : '—'}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Consensus target:</td><td style="padding:5px 0;text-align:right;font-weight:600;">$${t.target_price.toFixed(2)}</td></tr>
      <tr><td style="padding:5px 0;color:var(--muted);">Implied upside:</td><td style="padding:5px 0;text-align:right;font-weight:600;color:${upside > 0 ? 'var(--mint)' : 'var(--crimson)'};">${upside != null ? (upside > 0 ? '+' : '') + upside.toFixed(1) + '%' : '—'}</td></tr>
      ${t.rating ? `<tr><td style="padding:5px 0;color:var(--muted);">Rating:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${escapeHtml(t.rating)}</td></tr>` : ''}
      ${t.PE_FY1 ? `<tr><td style="padding:5px 0;color:var(--muted);">P/E FY1:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.PE_FY1}x</td></tr>` : ''}
      ${t.EV_EBITDA_FY1 ? `<tr><td style="padding:5px 0;color:var(--muted);">EV/EBITDA FY1:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${t.EV_EBITDA_FY1}x</td></tr>` : ''}
      ${t.next_earnings_date ? `<tr><td style="padding:5px 0;color:var(--muted);">Next earnings:</td><td style="padding:5px 0;text-align:right;font-weight:600;">${escapeHtml(t.next_earnings_date)}</td></tr>` : ''}
    </table>`);
  }

  function chartsFor(ticker, prefixes) {
    // Look up the bundle's per-ticker chart manifest if available.
    const manifest = (window.TICKER_DATA_BUNDLE && window.TICKER_DATA_BUNDLE[ticker] && window.TICKER_DATA_BUNDLE[ticker].charts) || [];
    if (manifest.length === 0) {
      // No manifest — fall back to optimistic positional lookups.
      return prefixes.map(prefix => `<img loading="lazy" src="./assets/charts/${ticker}/${prefix}.png" alt="${prefix}" style="max-width:100%;border:1px solid var(--border);border-radius:6px;margin:8px 0;" onerror="this.style.display='none';">`);
    }
    // For each prefix, find every chart file that starts with that prefix.
    const out = [];
    for (const prefix of prefixes) {
      const matches = manifest.filter(name => name.startsWith(prefix + '_') || name === prefix + '.png');
      for (const filename of matches) {
        const label = filename.replace(/\.png$/, '').replace(/_/g, ' ');
        out.push(`<figure style="margin:18px 0;text-align:center;page-break-inside:avoid;">
          <img loading="lazy" src="./assets/charts/${ticker}/${filename}" alt="${label}"
               style="max-width:100%;height:auto;border:1px solid var(--border);border-radius:6px;background:#fff;padding:8px;display:block;margin:0 auto;"
               onerror="this.style.display='none';this.nextElementSibling.style.display='none';">
          <figcaption style="font-size:11.5px;color:var(--muted);margin-top:8px;text-transform:capitalize;letter-spacing:.02em;">${escapeHtml(label)}</figcaption>
        </figure>`);
      }
    }
    return out;
  }

  function priorityClass(p) {
    return (p || '').toLowerCase().replace(/[^a-z]/g, '') || 'neutral';
  }

  function emptyState(msg) {
    return `<section class="card card-pad"><p style="color:var(--muted);text-align:center;margin:0;font-size:13px;">${escapeHtml(msg)}</p></section>`;
  }

  // ===== Helpers =====
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtMoney(v, suffix) {
    if (v == null) return '—';
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + 'B' + (suffix === 'M' ? '' : '');
    return v.toFixed(1) + (suffix || 'M');
  }
  function formatCell(v) {
    if (v == null) return '—';
    if (typeof v === 'number') return v.toLocaleString();
    return escapeHtml(v);
  }
  function signNum(n) {
    return (n > 0 ? '+' : '') + n.toFixed(4);
  }
  function signPct(n) {
    if (n == null) return '—';
    return (n >= 0 ? '+' : '') + n + '%';
  }

  // Boot when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
