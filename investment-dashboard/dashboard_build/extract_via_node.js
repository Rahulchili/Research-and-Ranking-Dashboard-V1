/**
 * Extract per-ticker DATA + narratives + TA + FactSet + charts from the
 * monolith by actually running its JavaScript in a sandbox and reading
 * the resulting DATA / globalThis variables.
 *
 * This is the reliable way to get the monolith's data — regex-based JS
 * parsing breaks on nested function calls and template literals. The
 * monolith's JS is well-formed and runs cleanly in Node; we just don't
 * have a DOM, so we stub out document/window minimally.
 *
 * Usage: node extract_via_node.js <monolith.html> <output_dir>
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = process.argv[2];
const DEST = process.argv[3];
if (!SRC || !DEST) {
  console.error('Usage: node extract_via_node.js <monolith.html> <output_dir>');
  process.exit(2);
}

const TICKERS = [
  'META', 'AMD', 'NVDA', 'AVGO', 'AAPL', 'AMZN', 'NFLX', 'PLTR', 'TSLA',
  'LLY', 'MU', 'SNOW', 'ASML', 'GOOG', 'AMAT', 'ARM',
];

console.log(`Loading ${SRC}...`);
const html = fs.readFileSync(SRC, 'utf-8');
console.log(`Loaded ${html.length.toLocaleString()} chars`);

// Extract every <script>...</script> block (excluding src=... external)
const scriptBlocks = [];
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  scriptBlocks.push(m[1]);
}
console.log(`Found ${scriptBlocks.length} inline <script> blocks`);

// Build a permissive DOM stub: every property access returns a magic
// proxy that swallows method calls and returns more proxies. This lets
// the monolith's top-level DOM bindings execute without crashing.
function makeMagicProxy() {
  const target = function () { return makeMagicProxy(); };
  return new Proxy(target, {
    get(_, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'toString') return () => '';
      if (prop === 'valueOf') return () => '';
      if (prop === Symbol.iterator) return function* () {};
      if (prop === 'length') return 0;
      if (prop === 'innerHTML' || prop === 'textContent' || prop === 'value' || prop === 'href') return '';
      if (prop === 'dataset' || prop === 'style' || prop === 'classList' || prop === 'attributes') return makeMagicProxy();
      if (prop === 'children' || prop === 'childNodes') return [];
      if (prop === 'parentNode' || prop === 'parentElement') return null;
      if (prop === 'documentElement' || prop === 'body' || prop === 'head') return makeMagicProxy();
      return makeMagicProxy();
    },
    set() { return true; },
    apply() { return makeMagicProxy(); },
    construct() { return makeMagicProxy(); },
    has() { return true; },
  });
}

const sandbox = {
  console,
  setTimeout: () => 0,
  clearTimeout: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => {},
  Math, Date, JSON, Array, Object, String, Number, Boolean,
  RegExp, Map, Set, Promise, Error, parseInt, parseFloat,
  isNaN, isFinite, encodeURIComponent, decodeURIComponent,
  document: makeMagicProxy(),
  window: null,
  navigator: { userAgent: 'node-extract' },
  location: { href: '', hash: '', pathname: '/' },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
  },
  sessionStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
  },
  matchMedia: () => ({ matches: false, addEventListener: () => {}, addListener: () => {}, removeEventListener: () => {}, removeListener: () => {} }),
  performance: { now: () => 0 },
  fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
  alert: () => {},
  confirm: () => false,
  prompt: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

vm.createContext(sandbox);

// Transform `const NAME = ` and `let NAME = ` for the identifiers we need to
// extract so they land on globalThis instead of the eval-scoped binding.
// The monolith's main script starts with `const DATA = {...};` etc.
function expose(code) {
  const idents = ['DATA', 'TICKER_REGISTRY', 'SECTION_ORDER', 'STANCE_COLOR'];
  for (const id of idents) {
    code = code.replace(new RegExp(`\\b(const|let)\\s+${id}\\b\\s*=`, 'g'),
                       `globalThis.${id} =`);
  }
  // Hoist `const {ALL_CAPS_WITH_UNDERSCORE} = ` patterns onto globalThis so
  // we can pull ticker-suffixed payloads like {T}_OPTIONS_METRICS,
  // {T}_TA_LEVELS, {T}_FACTSET_PEERS, etc.
  code = code.replace(/\b(const|let)\s+([A-Z][A-Z0-9]*_[A-Z0-9_]+)\s*=/g,
                      'globalThis.$2 =');
  return code;
}

// Run each script block. Many will fail at top-level — that's OK, we wrap
// each in try/catch and continue.
let success = 0, failed = 0;
for (let i = 0; i < scriptBlocks.length; i++) {
  const code = expose(scriptBlocks[i]);
  try {
    vm.runInContext(code, sandbox, {
      filename: `monolith_script_${i}.js`,
      timeout: 30000,
    });
    success++;
  } catch (e) {
    failed++;
    if (failed === 1) {
      console.log(`First failure (script ${i}): ${e.message.substring(0, 300)}`);
      if (e.stack) console.log(e.stack.split('\n').slice(0, 4).join('\n'));
    }
  }
}
console.log(`Scripts: ${success} ok, ${failed} failed (expected — DOM stubs are minimal)`);

// Pull DATA + globals out of the sandbox
const DATA = sandbox.DATA;
if (!DATA) {
  console.error('FAIL: DATA not defined after running scripts');
  process.exit(1);
}
console.log(`DATA.companies has ${Object.keys(DATA.companies || {}).length} tickers`);
console.log(`DATA.narratives has ${Object.keys(DATA.narratives || {}).length} tickers`);
console.log(`DATA.ticker_order has ${(DATA.ticker_order || []).length} tickers`);

// Helper to safely JSON-stringify (replacing functions with null, dropping cycles)
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') return null;
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return undefined;
      seen.add(value);
    }
    return value;
  }, 2);
}

function writeJson(dir, name, obj) {
  const p = path.join(DEST, dir);
  fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, name + '.json'), safeStringify(obj));
}

// Extract per-ticker payloads
let written = 0;
for (const ticker of TICKERS) {
  if (DATA.companies && DATA.companies[ticker]) {
    writeJson('data/companies', ticker, DATA.companies[ticker]);
    written++;
  }
  if (DATA.narratives && DATA.narratives[ticker]) {
    writeJson('data/narratives', ticker, DATA.narratives[ticker]);
  }
  const ta = sandbox[ticker + '_TA_LEVELS'];
  if (ta) writeJson('data/ta_levels', ticker, ta);
  const fs_peers = sandbox[ticker + '_FACTSET_PEERS'];
  if (fs_peers) writeJson('data/factset', ticker, fs_peers);
  const opts = sandbox[ticker + '_OPTIONS_METRICS'];
  if (opts) writeJson('data/options', ticker, opts);
}
console.log(`Wrote ${written} ticker company files`);

// Also write the global DATA framework (ticker_order, summary, scoringModel)
writeJson('data', '_meta', {
  ticker_order: DATA.ticker_order || [],
  summary: DATA.summary || {},
  scoringModel: DATA.scoringModel || {},
});

// Also write TICKER_REGISTRY if present (for ticker → pageFns mapping)
if (sandbox.TICKER_REGISTRY) {
  writeJson('data', '_registry', sandbox.TICKER_REGISTRY);
}

console.log('Done.');
