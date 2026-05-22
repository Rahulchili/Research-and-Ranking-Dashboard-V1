import json, base64, re, os

DASH = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/Dashboard.html'

# Load all data
ta = json.load(open('/tmp/lly_ta.json'))
fs = json.load(open('/tmp/lly_factset.json'))
narr = json.load(open('/tmp/lly_narrative.json'))
company = json.load(open('/tmp/lly_company.json'))
options = json.load(open('/tmp/lly_options.json'))

# Inline chart helpers
def img64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

assets_dir = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/assets/lly'
CHARTS = {}
for sub in ['technical','fundamental','valuation']:
    d = os.path.join(assets_dir, sub)
    for fn in os.listdir(d):
        if fn.endswith('.png'):
            CHARTS[f'{sub}/{fn}'] = 'data:image/png;base64,' + img64(os.path.join(d, fn))

# Read Dashboard
html = open(DASH).read()

# === 1. Add LLY_TA_LEVELS and LLY_FACTSET_PEERS constants ===
ta_js = 'const LLY_TA_LEVELS = ' + json.dumps(ta) + ';\n'
fs_js = 'const LLY_FACTSET_PEERS = ' + json.dumps(fs) + ';\n'

# Insert after NVDA_FACTSET_PEERS const
marker_ta = 'const NVDA_FACTSET_PEERS = '
idx = html.find(marker_ta)
end_idx = html.find('};\n', idx) + 3
html = html[:end_idx] + '\n' + ta_js + fs_js + html[end_idx:]
print('Inserted LLY_TA_LEVELS / LLY_FACTSET_PEERS')

# === 2. Add globalThis hookups ===
hookup_marker = "if (typeof NVDA_TA_LEVELS !== 'undefined') globalThis.NVDA_TA_LEVELS = NVDA_TA_LEVELS;"
hookups = "\nif (typeof LLY_FACTSET_PEERS !== 'undefined') globalThis.LLY_FACTSET_PEERS = LLY_FACTSET_PEERS;\nif (typeof LLY_TA_LEVELS !== 'undefined') globalThis.LLY_TA_LEVELS = LLY_TA_LEVELS;"
html = html.replace(hookup_marker, hookup_marker + hookups)
print('Inserted globalThis hookups')

# === 3. Add DATA.companies.LLY + DATA.narratives.LLY ===
# Find the closing of DATA.companies.NVDA
nvda_obj_str = json.dumps(company, indent=2)
lly_obj_marker = "DATA.companies.NVDA"
# Find where NVDA gets assigned, insert LLY right after
nvda_assign = "DATA.companies.NVDA = "
idx = html.find(nvda_assign)
assert idx > 0, 'Did not find NVDA assignment'
# Find end of that assignment statement
end_brace = idx
depth = 0
i = html.find('{', idx)
while i < len(html):
    c = html[i]
    if c == '{': depth += 1
    elif c == '}': depth -= 1
    if depth == 0 and c == '}':
        end_brace = i+1
        break
    i += 1
# Insert after the closing `;` after the NVDA company object
end_brace = html.find(';', end_brace) + 1
lly_company_assign = f'\nDATA.companies.LLY = {nvda_obj_str};\nif (!DATA.ticker_order.includes("LLY")) DATA.ticker_order.push("LLY");\n'
html = html[:end_brace] + lly_company_assign + html[end_brace:]
print('Inserted DATA.companies.LLY')

# Similarly for narratives
nvda_nar_assign = 'DATA.narratives.NVDA = '
idx2 = html.find(nvda_nar_assign)
end_brace2 = idx2
depth = 0
i = html.find('{', idx2)
while i < len(html):
    c = html[i]
    if c == '{': depth += 1
    elif c == '}': depth -= 1
    if depth == 0 and c == '}':
        end_brace2 = i+1
        break
    i += 1
end_brace2 = html.find(';', end_brace2) + 1
lly_nar_assign = f'\nDATA.narratives.LLY = {json.dumps(narr, indent=2)};\n'
html = html[:end_brace2] + lly_nar_assign + html[end_brace2:]
print('Inserted DATA.narratives.LLY')

# === 4. Sidebar entries for LLY ===
nvda_sidebar_marker = "{ id:'nvda-summary',"
nvda_sidebar_end_idx = html.find(']', html.find('tickerSubpages.NVDA')) + 1
# Insert LLY sidebar after NVDA's
lly_sidebar = """,
    'LLY': [
      { id:'lly-fundamental',             label:'Fundamentals',             emoji:'📊', sub:'FY24 Q1 → FY26 Q1 · 9Q charts · GLP-1 ramp' },
      { id:'ticker:LLY',                  label:'Management & MCS',          emoji:'🧪', sub:'7 FY guides · MCS 0.71 · 5 beats 2 misses' },
      { id:'lly-valuation',               label:'Valuation & Comparables',  emoji:'💰', sub:'P/E · EV/EBITDA · pharma peer set' },
      { id:'lly-technical',               label:'Technical Analysis',       emoji:'📈', sub:'Daily bars · 2y + 1Q' },
      { id:'lly-options',                 label:'Options Analysis',         emoji:'📐', sub:'Skew · vol surface · positioning' },
      { id:'ticker:LLY?section=investment-view', label:'Investment View',  emoji:'🎯', sub:'Bull/bear · triggers · bottom line' },
      { id:'lly-summary',                 label:'Executive Summary',        emoji:'📋', sub:'One-page forward view' }
    ]"""
# Find tickerSubpages object and inject LLY entry
ts_marker = "tickerSubpages = {"
ts_idx = html.find(ts_marker)
ts_end_idx = html.rfind(']', ts_idx, html.find('};\n', ts_idx)) + 1
# Insert LLY entry after the NVDA closing ]
html = html[:ts_end_idx] + lly_sidebar + html[ts_end_idx:]
print('Inserted LLY sidebar entries')

# === 5. Add LLY routes ===
nvda_route_marker = "else if (activePage === 'nvda-valuation') html = nvdaValuationPage();"
lly_routes = """
  else if (activePage === 'lly-summary') html = llySummaryPage();
  else if (activePage === 'lly-fundamental') html = llyFundamentalPage();
  else if (activePage === 'lly-technical') html = llyTechnicalPage();
  else if (activePage === 'lly-consolidated') html = llyConsolidatedPage();
  else if (activePage === 'lly-options') html = llyOptionsPage();
  else if (activePage === 'lly-valuation') html = llyValuationPage();"""
html = html.replace(nvda_route_marker, nvda_route_marker + lly_routes)
print('Inserted LLY route handlers')

# === 6. Add LLY to activeTicker detection ===
old_at = """: activePage.startsWith('avgo-') ? 'AVGO'
                     : activePage.startsWith('nvda-') ? 'NVDA'"""
new_at = """: activePage.startsWith('avgo-') ? 'AVGO'
                     : activePage.startsWith('nvda-') ? 'NVDA'
                     : activePage.startsWith('lly-')  ? 'LLY'"""
html = html.replace(old_at, new_at)
print('Inserted LLY activeTicker mapping')

# === 7. Add LLY reportLabels ===
labels_marker = "'nvda-valuation':'NVDA · Valuation & Comparables',"
lly_labels = """
    'lly-summary':'LLY · Executive Summary',
    'lly-fundamental':'LLY · Fundamentals (FY24-FY26 Q1)',
    'lly-technical':'LLY · Technical Analysis',
    'lly-consolidated':'LLY · Consolidated View',
    'lly-options':'LLY · Options Analysis',
    'lly-valuation':'LLY · Valuation & Comparables',"""
html = html.replace(labels_marker, labels_marker + lly_labels)
print('Inserted LLY reportLabels')

# === 8. Build LLY page functions ===
# Read NVDA page functions as template and replace nvda->lly
nvda_func_start = html.find('function nvdaSummaryPage()')
# Find end of all NVDA pages — locate the function nvdaValuationPage and find its closing }
# We need all 6 functions. They end before "// Route" or before next non-NVDA function.
# Let's find the marker just before route handler
nvda_func_end_marker = "function attachClickHandlers"  # next standalone function probably
# Actually let's find the end of nvdaValuationPage by brace matching
i = html.find('function nvdaValuationPage()')
brace_idx = html.find('{', i)
depth = 0; j = brace_idx
while j < len(html):
    if html[j] == '{': depth += 1
    elif html[j] == '}': depth -= 1
    if depth == 0:
        nvda_func_end = j + 1
        break
    j += 1
# Extract NVDA functions block
nvda_block = html[nvda_func_start:nvda_func_end]
print(f'NVDA functions block: {len(nvda_block)} chars')

# Create LLY block by token replacement
# Replace function names: nvdaSummary → llySummary, nvdaFundamental → llyFundamental, etc.
# Replace NVDA constants: NVDA_TA_LEVELS → LLY_TA_LEVELS, NVDA_FACTSET_PEERS → LLY_FACTSET_PEERS
# Replace DATA.companies.NVDA → DATA.companies.LLY
# Replace DATA.narratives.NVDA → DATA.narratives.LLY
# Replace 'NVDA' string → 'LLY'
# Replace asset paths: assets/nvda/ → assets/lly/

lly_block = nvda_block
lly_block = lly_block.replace('nvdaSummaryPage', 'llySummaryPage')
lly_block = lly_block.replace('nvdaFundamentalPage', 'llyFundamentalPage')
lly_block = lly_block.replace('nvdaTechnicalPage', 'llyTechnicalPage')
lly_block = lly_block.replace('nvdaConsolidatedPage', 'llyConsolidatedPage')
lly_block = lly_block.replace('nvdaOptionsPage', 'llyOptionsPage')
lly_block = lly_block.replace('nvdaValuationPage', 'llyValuationPage')
lly_block = lly_block.replace('NVDA_TA_LEVELS', 'LLY_TA_LEVELS')
lly_block = lly_block.replace('NVDA_FACTSET_PEERS', 'LLY_FACTSET_PEERS')
lly_block = lly_block.replace("DATA.companies.NVDA", "DATA.companies.LLY")
lly_block = lly_block.replace("DATA.narratives.NVDA", "DATA.narratives.LLY")
lly_block = lly_block.replace("DATA.companies['NVDA']", "DATA.companies['LLY']")
lly_block = lly_block.replace("DATA.narratives['NVDA']", "DATA.narratives['LLY']")
lly_block = lly_block.replace("'NVDA'", "'LLY'")
lly_block = lly_block.replace('"NVDA"', '"LLY"')
lly_block = lly_block.replace('assets/nvda/', 'assets/lly/')

# Replace company/sector-specific text references
lly_block = lly_block.replace('Semiconductors peer set', 'Pharmaceuticals: Major peer set')
lly_block = lly_block.replace('NVIDIA', 'Eli Lilly')
lly_block = lly_block.replace('AI infrastructure', 'GLP-1 / pipeline')
lly_block = lly_block.replace('Blackwell', 'orforglipron')
lly_block = lly_block.replace('Jensen Huang', 'David Ricks')
lly_block = lly_block.replace('Colette Kress', 'Lucas Montarce')
lly_block = lly_block.replace('Data Center', 'GLP-1')

# Replace inline chart src= with base64 — find any IMG that references assets/lly/
# Actually let's first place LLY block after NVDA block in HTML, then process chart srcs
new_funcs = nvda_block + '\n\n' + lly_block

# Replace inline base64 chart references: src="assets/lly/..." → src="data:image/png;base64,..."
def replace_chart_src(text):
    pattern = re.compile(r'src="(?:\./)?assets/lly/([^"]+)"')
    def repl(m):
        rel = m.group(1)
        b64 = CHARTS.get(rel)
        if b64: return f'src="{b64}"'
        return m.group(0)
    return pattern.sub(repl, text)

new_funcs = replace_chart_src(new_funcs)

# Replace base64 NVDA chart srcs in the LLY block — find any data:image/png in the LLY portion and replace with LLY chart base64s
# Walk through the LLY chart references — replace NVDA chart paths in LLY block
# Actually since NVDA's inline base64 are now inside lly_block, replace them with LLY equivalents in sequence
nvda_chart_pattern = re.compile(r'src="data:image/png;base64,[A-Za-z0-9+/=]+"')

# Get NVDA chart sequence
nvda_charts_seq = re.findall(nvda_chart_pattern, nvda_block)
# Define LLY equivalent sequence based on order: technical 01,02,03,04,05; fundamental 01-09; valuation 01,02,03
# Actually we need to know what order NVDA charts appear in nvda_block and produce parallel LLY charts
# Simpler: just replace by chart key matching (since NVDA blocks use specific filenames)
# Let me search for NVDA chart file references in the lly_block — wait we already converted nvda->lly path
# So src="data:image/png;base64,..." in lly_block still points to NVDA chart contents

# I need to keep track of NVDA charts in original nvda_block and substitute with LLY charts
# Build NVDA chart map from /sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/assets/nvda/
NVDA_CHARTS = {}
nvda_assets = '/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork/management_credibility_project/assets/nvda'
for sub in ['technical','fundamental','valuation']:
    d = os.path.join(nvda_assets, sub)
    if os.path.exists(d):
        for fn in os.listdir(d):
            if fn.endswith('.png'):
                NVDA_CHARTS[f'{sub}/{fn}'] = 'data:image/png;base64,' + img64(os.path.join(d, fn))

# Build lookup: nvda b64 → key → lly b64
def replace_nvda_b64_with_lly(text):
    for key, nvda_b64 in NVDA_CHARTS.items():
        lly_b64 = CHARTS.get(key)
        if lly_b64:
            text = text.replace(nvda_b64, lly_b64)
    return text

# Apply to lly_block portion only
new_lly_block = replace_nvda_b64_with_lly(lly_block)
lly_charts_changed = sum(1 for k in CHARTS if CHARTS[k] in new_lly_block)
print(f'LLY charts replaced in block: {lly_charts_changed}/{len(CHARTS)}')

# Now insert LLY block right after NVDA functions in HTML
html = html[:nvda_func_end] + '\n\n' + new_lly_block + html[nvda_func_end:]
print('Inserted LLY page functions')

# Validate JS by quick balance check
script_start = html.find('<script>')
script_end = html.rfind('</script>')
js = html[script_start+8:script_end]
print(f'Total JS size: {len(js)} chars')

# Write out
with open(DASH, 'w') as f:
    f.write(html)
print(f'\nDashboard.html written: {len(html)} chars / {len(html)/1048576:.2f} MB')
