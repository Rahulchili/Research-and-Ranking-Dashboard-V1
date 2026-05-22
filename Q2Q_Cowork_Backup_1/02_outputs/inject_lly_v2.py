import json, base64, re, os, sys

DASH = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/Dashboard.html'

ta = json.load(open('/tmp/lly_ta.json'))
fs = json.load(open('/tmp/lly_factset.json'))
narr = json.load(open('/tmp/lly_narrative.json'))
company = json.load(open('/tmp/lly_company.json'))
options_data = json.load(open('/tmp/lly_options.json'))

def img64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

assets_root = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/assets'
CHARTS_LLY = {}
CHARTS_NVDA = {}
for sub in ['technical','fundamental','valuation']:
    d = os.path.join(assets_root, 'lly', sub)
    if os.path.isdir(d):
        for fn in os.listdir(d):
            if fn.endswith('.png'):
                CHARTS_LLY[f'{sub}/{fn}'] = 'data:image/png;base64,' + img64(os.path.join(d, fn))
    dN = os.path.join(assets_root, 'nvda', sub)
    if os.path.isdir(dN):
        for fn in os.listdir(dN):
            if fn.endswith('.png'):
                CHARTS_NVDA[f'{sub}/{fn}'] = 'data:image/png;base64,' + img64(os.path.join(dN, fn))

html = open(DASH).read()
print(f'Original file: {len(html)} chars')

# === STEP 1: Add LLY_TA_LEVELS / LLY_FACTSET_PEERS constants ===
ta_js = '\nconst LLY_TA_LEVELS = ' + json.dumps(ta) + ';'
fs_js = '\nconst LLY_FACTSET_PEERS = ' + json.dumps(fs) + ';'
# Insert after NVDA_FACTSET_PEERS = ...;
marker = 'const NVDA_FACTSET_PEERS = '
idx = html.find(marker)
assert idx > 0
# Find end ';' that closes the const  
brace_depth = 0
i = idx
while i < len(html):
    c = html[i]
    if c == '{': brace_depth += 1
    elif c == '}': brace_depth -= 1
    if brace_depth == 0 and c == ';' and html[i-1] == '}':
        end_idx = i + 1
        break
    i += 1
html = html[:end_idx] + ta_js + fs_js + html[end_idx:]
print('Step 1: inserted LLY_TA_LEVELS / LLY_FACTSET_PEERS')

# === STEP 2: globalThis hookups ===
hookup_marker = "if (typeof NVDA_TA_LEVELS !== 'undefined') globalThis.NVDA_TA_LEVELS = NVDA_TA_LEVELS;"
hookups = "\nif (typeof LLY_FACTSET_PEERS !== 'undefined') globalThis.LLY_FACTSET_PEERS = LLY_FACTSET_PEERS;\nif (typeof LLY_TA_LEVELS !== 'undefined') globalThis.LLY_TA_LEVELS = LLY_TA_LEVELS;"
html = html.replace(hookup_marker, hookup_marker + hookups)
print('Step 2: inserted globalThis hookups')

# === STEP 3: DATA.companies.LLY + DATA.narratives.LLY via post-assignment ===
# Find ;\n after const DATA = {...}
data_start = html.find('const DATA =')
# Find matching closing brace for the DATA object
brace_depth = 0
i = html.find('{', data_start)
end_idx = -1
while i < len(html):
    c = html[i]
    if c == '{': brace_depth += 1
    elif c == '}': brace_depth -= 1
    if brace_depth == 0:
        end_idx = i + 1
        break
    i += 1
# Find ; after the object close
data_end = html.find(';', end_idx) + 1
# Build LLY assignment block
lly_assign = f"""
DATA.companies['LLY'] = {json.dumps(company)};
DATA.narratives['LLY'] = {json.dumps(narr)};
if (!DATA.ticker_order.includes('LLY')) DATA.ticker_order.push('LLY');
"""
html = html[:data_end] + lly_assign + html[data_end:]
print('Step 3: inserted DATA.companies.LLY + DATA.narratives.LLY')

# === STEP 4: sidebar entries — find NVDA in tickerSubpages and add LLY block ===
ts_marker = "'NVDA': ["
ts_idx = html.find(ts_marker)
assert ts_idx > 0, 'NVDA in tickerSubpages not found'
# Find closing ] for NVDA array
bracket_depth = 0
i = ts_idx
nvda_end = -1
while i < len(html):
    c = html[i]
    if c == '[': bracket_depth += 1
    elif c == ']':
        bracket_depth -= 1
        if bracket_depth == 0:
            nvda_end = i + 1
            break
    i += 1
lly_sidebar = """,
    'LLY': [
      { id:'lly-fundamental',             label:'Fundamentals',             emoji:'📊', sub:'FY24 Q1 → FY26 Q1 · 9Q charts · GLP-1 ramp' },
      { id:'ticker:LLY',                  label:'Management & MCS',         emoji:'🧪', sub:'7 FY guides · MCS 0.71 · 5 beats 2 misses' },
      { id:'lly-valuation',               label:'Valuation & Comparables',  emoji:'💰', sub:'P/E · EV/EBITDA · pharma peer set' },
      { id:'lly-technical',               label:'Technical Analysis',       emoji:'📈', sub:'Daily bars · 2y + 1Q' },
      { id:'lly-options',                 label:'Options Analysis',         emoji:'📐', sub:'Skew · vol surface · positioning' },
      { id:'ticker:LLY?section=investment-view', label:'Investment View',   emoji:'🎯', sub:'Bull/bear · triggers · bottom line' },
      { id:'lly-summary',                 label:'Executive Summary',        emoji:'📋', sub:'One-page forward view' }
    ]"""
html = html[:nvda_end] + lly_sidebar + html[nvda_end:]
print('Step 4: inserted LLY sidebar entries')

# === STEP 5: route handlers ===
route_marker = "else if (activePage === 'nvda-valuation') html = nvdaValuationPage();"
lly_routes = """
  else if (activePage === 'lly-summary') html = llySummaryPage();
  else if (activePage === 'lly-fundamental') html = llyFundamentalPage();
  else if (activePage === 'lly-technical') html = llyTechnicalPage();
  else if (activePage === 'lly-consolidated') html = llyConsolidatedPage();
  else if (activePage === 'lly-options') html = llyOptionsPage();
  else if (activePage === 'lly-valuation') html = llyValuationPage();"""
html = html.replace(route_marker, route_marker + lly_routes)
print('Step 5: inserted LLY route handlers')

# === STEP 6: activeTicker detection ===
old_at = """: activePage.startsWith('nvda-') ? 'NVDA'
                     : null;"""
new_at = """: activePage.startsWith('nvda-') ? 'NVDA'
                     : activePage.startsWith('lly-')  ? 'LLY'
                     : null;"""
html = html.replace(old_at, new_at)
print('Step 6: inserted LLY activeTicker mapping')

# === STEP 7: reportLabels ===
labels_marker = "'nvda-valuation':'NVDA · Valuation & Comparables',"
lly_labels = """
    'lly-summary':'LLY · Executive Summary',
    'lly-fundamental':'LLY · Fundamentals (FY24-FY26 Q1)',
    'lly-technical':'LLY · Technical Analysis',
    'lly-consolidated':'LLY · Consolidated View',
    'lly-options':'LLY · Options Analysis',
    'lly-valuation':'LLY · Valuation & Comparables',"""
html = html.replace(labels_marker, labels_marker + lly_labels)
print('Step 7: inserted LLY reportLabels')

# === STEP 8: build LLY page functions by template replacement of NVDA functions ===
# Extract NVDA functions block: from `function nvdaSummaryPage()` to end of `function nvdaValuationPage()`
nvda_func_start = html.find('function nvdaSummaryPage()')
# Find end of nvdaValuationPage with brace matching
def_idx = html.find('function nvdaValuationPage()', nvda_func_start)
brace_idx = html.find('{', def_idx)
depth = 0; j = brace_idx
nvda_func_end = -1
while j < len(html):
    if html[j] == '{': depth += 1
    elif html[j] == '}': depth -= 1
    if depth == 0:
        nvda_func_end = j + 1
        break
    j += 1
nvda_block = html[nvda_func_start:nvda_func_end]
print(f'NVDA functions block: {len(nvda_block)} chars')

# Token-replace to make LLY version
lly_block = nvda_block
replacements = [
    ('nvdaSummaryPage', 'llySummaryPage'),
    ('nvdaFundamentalPage', 'llyFundamentalPage'),
    ('nvdaTechnicalPage', 'llyTechnicalPage'),
    ('nvdaConsolidatedPage', 'llyConsolidatedPage'),
    ('nvdaOptionsPage', 'llyOptionsPage'),
    ('nvdaValuationPage', 'llyValuationPage'),
    ('NVDA_TA_LEVELS', 'LLY_TA_LEVELS'),
    ('NVDA_FACTSET_PEERS', 'LLY_FACTSET_PEERS'),
    ("DATA.companies['NVDA']", "DATA.companies['LLY']"),
    ("DATA.narratives['NVDA']", "DATA.narratives['LLY']"),
    ("'NVDA'", "'LLY'"),
    ('"NVDA"', '"LLY"'),
    ('assets/nvda/', 'assets/lly/'),
    ('Semiconductors peer set', 'Pharmaceuticals: Major peer set'),
    ('NVIDIA', 'Eli Lilly'),
    ('AI infrastructure', 'GLP-1 / pipeline'),
    ('Blackwell', 'orforglipron'),
    ('Jensen Huang', 'David Ricks'),
    ('Colette Kress', 'Lucas Montarce'),
    ('Data Center', 'GLP-1'),
]
for a, b in replacements:
    lly_block = lly_block.replace(a, b)

# Replace NVDA chart base64 with LLY chart base64 (key-matched)
for key, nvda_b64 in CHARTS_NVDA.items():
    lly_b64 = CHARTS_LLY.get(key)
    if lly_b64:
        lly_block = lly_block.replace(nvda_b64, lly_b64)

# Insert LLY block right after NVDA functions
html = html[:nvda_func_end] + '\n\n' + lly_block + html[nvda_func_end:]
print(f'Step 8: inserted LLY page functions ({len(lly_block)} chars)')

# === STEP 9: Optional - add LLY to Key Developments block in tickerPage ===
# Find NVDA Key Developments guard
kd_marker = "if (ticker === 'NVDA') {"
if kd_marker in html:
    kd_idx = html.find(kd_marker)
    # Find matching closing brace
    brace_idx = html.find('{', kd_idx)
    depth = 0; j = brace_idx
    while j < len(html):
        if html[j] == '{': depth += 1
        elif html[j] == '}': depth -= 1
        if depth == 0:
            kd_end = j + 1
            break
        j += 1
    nvda_kd_block = html[kd_idx:kd_end]
    # Build LLY Key Developments
    lly_kd = """if (ticker === 'LLY') {
    const developments = [
      { date: 'Apr 30, 2026', label: 'Q1 FY26 ER', detail: 'Q1 rev $19.8B (+55.6% YoY); FY26 guide raised $2B to $82-85B. Mounjaro+Suven combined revenue $12.8B (+$6.7B YoY).' },
      { date: 'Feb 4, 2026',  label: 'Q4 FY25 ER', detail: 'FY25 rev $65.2B (+44.7% YoY) beats $63-63.5B guide. Initial FY26 guide $80-83B. $55B+ committed to manufacturing since 2020.' },
      { date: 'Oct 30, 2025', label: 'Q3 FY25 ER', detail: 'FY25 guide raised to $63-63.5B (from $60-62B). Orforglipron Phase III ACHIEVE-1 and ACHIEVE-3 positive results.' },
      { date: 'Aug 7, 2025',  label: 'Q2 FY25 ER', detail: 'FY25 guide narrowed to $60-62B (from $58-61B). ATTAIN-1 orforglipron Phase III obesity trial positive (12.4% weight loss).' },
      { date: 'May 1, 2025',  label: 'Q1 FY25 ER', detail: 'Q1 rev $12.7B (+45%). Key products grew $4B; Zepbound $2.3B in Q1 (+$1.8B YoY).' },
      { date: 'Feb 6, 2025',  label: 'Q4 FY24 ER', detail: 'FY24 rev $45.0B (-1.4% vs $45.7 guide mid). New products $5.6B in Q4. $15B buyback authorized; 7th consecutive 15% dividend increase.' },
      { date: 'Oct 30, 2024', label: 'Q3 FY24 ER', detail: 'FY24 guide updated to $45.4-46.0B. Lilly Medicine Foundry announced ($4.5B investment).' },
      { date: 'Aug 8, 2024',  label: 'Q2 FY24 ER', detail: 'FY24 guide raised $3B to $45.4-46.6B. Mounjaro $3.1B globally. Stock +5.5% on print.' },
      { date: 'Apr 30, 2024', label: 'Q1 FY24 ER', detail: 'FY24 guide raised $2B to $42.4-43.6B. Mounjaro $1.8B globally, $1.5B US.' }
    ];
    const devHtml = developments.map(d => `<div class="dev-row" style="display:grid;grid-template-columns:120px 100px 1fr;gap:14px;padding:10px 14px;border-bottom:1px solid var(--line);align-items:start;">
      <div style="color:var(--subtle);font-size:.8rem;font-variant-numeric:tabular-nums;">${d.date}</div>
      <div style="color:var(--accent);font-weight:600;font-size:.85rem;">${d.label}</div>
      <div style="font-size:.92rem;line-height:1.45;">${d.detail}</div>
    </div>`).join('');
    html += `<section class="report-section" style="margin-top:18px;">
      <div class="report-section-header" style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <span style="font-size:1.5rem;">🗓️</span>
        <h2 style="margin:0;font-size:1.15rem;letter-spacing:.02em;">Key Developments — Last 9 Quarters</h2>
      </div>
      <div style="background:var(--surface);border:1px solid var(--line);border-radius:10px;overflow:hidden;">${devHtml}</div>
    </section>`;
  }"""
    # Insert after NVDA KD block
    html = html[:kd_end] + ' else ' + lly_kd + html[kd_end:]
    print('Step 9: inserted LLY Key Developments')

# === Write out ===
open(DASH, 'w').write(html)
print(f'\nDashboard.html written: {len(html)} chars / {len(html)/1048576:.2f} MB')
