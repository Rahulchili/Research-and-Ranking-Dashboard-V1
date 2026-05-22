"""Extract every base64-encoded chart PNG from the monolith and save it as a
real file under assets/charts/{TICKER}/.

The monolith stores charts in two places:
  1. globalThis.MU_IMG_MAP = {"assets/mu/fundamental/01_revenue_trend.png": "<b64>", ...}
     — explicit path keys give clear ticker + category attribution.
  2. Inline inside ticker page functions: `<img src="data:image/png;base64,...">`
     — attribute by enclosing ticker page-function + surrounding text hints.

Filenames use a normalized scheme so the renderer can locate them:
  {category_prefix}_{NN}_{slug}.png
where prefix ∈ {fund, tech, val, opt, summary}.
"""
from __future__ import annotations

import base64
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MONOLITH = ROOT.parent / "05.15.26-Dashboard-V1-V2-Integrated.html"
CHARTS_DIR = ROOT / "assets" / "charts"

TICKERS = [
    "META", "AMD", "NVDA", "AVGO", "AAPL", "AMZN", "NFLX", "PLTR", "TSLA",
    "LLY", "MU", "SNOW", "ASML", "GOOG", "AMAT", "ARM",
]

CATEGORY_MAP = {
    "fundamental": "fund",
    "technical":   "tech",
    "valuation":   "val",
    "options":     "opt",
    "consolidated": "summary",
    "summary":     "summary",
    "earnings":    "fund",
    "guidance":    "fund",
}


def normalize_filename(category: str, original: str) -> str:
    """Map monolith path -> standardized filename:
    'fundamental/01_revenue_trend.png' -> 'fund_01_revenue_trend.png'."""
    prefix = CATEGORY_MAP.get(category, category)
    # `original` is already the filename like '01_revenue_trend.png'
    return f"{prefix}_{original}"


def find_img_map_payload(text: str, prefix: str) -> str | None:
    """Return the {...} body of `globalThis.{PREFIX}_IMG_MAP = {...}` if found."""
    m = re.search(rf"globalThis\.{re.escape(prefix)}_IMG_MAP\s*=\s*\{{", text)
    if not m:
        m = re.search(rf"\b{re.escape(prefix)}_IMG_MAP\s*=\s*\{{", text)
    if not m:
        return None
    start = m.end() - 1  # include the opening brace
    # Depth-counted match of the JSON-style object, skipping strings
    depth = 0
    i = start
    in_str: str | None = None
    while i < len(text):
        c = text[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c in "\"'`":
            in_str = c
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
        i += 1
    return None


def parse_img_map(payload: str) -> dict[str, str]:
    """Parse a JS object literal of form {"path":"b64",...} into a dict.
    We trust that the contents are well-formed: keys are simple double-quoted
    strings and values are big double-quoted base64 strings.
    """
    out: dict[str, str] = {}
    # State machine: find `"key": "value",` repeatedly
    i = 0
    n = len(payload)
    # Skip leading {
    while i < n and payload[i] != "{":
        i += 1
    i += 1
    while i < n:
        # Skip whitespace and commas
        while i < n and payload[i] in " \t\n\r,":
            i += 1
        if i >= n or payload[i] == "}":
            break
        if payload[i] != '"':
            i += 1
            continue
        # Read key
        i += 1  # skip opening quote
        k_start = i
        while i < n and payload[i] != '"':
            if payload[i] == "\\":
                i += 2
                continue
            i += 1
        key = payload[k_start:i]
        i += 1  # skip closing quote
        # Skip `: `
        while i < n and payload[i] in " \t:\n":
            i += 1
        # Read value (must start with ")
        if i >= n or payload[i] != '"':
            continue
        i += 1
        v_start = i
        while i < n and payload[i] != '"':
            if payload[i] == "\\":
                i += 2
                continue
            i += 1
        val = payload[v_start:i]
        i += 1
        out[key] = val
    return out


def main() -> int:
    print(f"Loading {MONOLITH.name}...")
    text = MONOLITH.read_text(encoding="utf-8", errors="replace")
    print(f"Loaded {len(text):,} chars")

    by_ticker: dict[str, list[tuple[str, str]]] = defaultdict(list)

    # Strategy 1: IMG_MAP globals
    for ticker in TICKERS:
        body = find_img_map_payload(text, ticker)
        if not body:
            continue
        entries = parse_img_map(body)
        for path, b64 in entries.items():
            # Path is like "assets/mu/fundamental/01_revenue_trend.png"
            # Strip the "data:image/png;base64," prefix if present
            if b64.startswith("data:image/png;base64,"):
                b64 = b64[len("data:image/png;base64,"):]
            parts = path.split("/")
            if len(parts) < 4:
                continue
            category, filename = parts[-2], parts[-1]
            out_name = normalize_filename(category, filename)
            by_ticker[ticker].append((out_name, b64))
        print(f"  {ticker}_IMG_MAP: {len(entries)} images")

    # Strategy 2: inline <img src="data:image/png;base64,..."> within ticker page functions
    # Tag each function with its SECTION based on the function NAME suffix:
    #   {t}FundamentalPage → fund
    #   {t}TechnicalPage   → tech
    #   {t}ValuationPage   → val
    #   {t}OptionsPage     → opt
    #   {t}SummaryPage/ConsolidatedPage → summary
    fn_re = re.compile(r"function\s+([a-z][a-zA-Z]+)\s*\(\s*\)\s*\{")
    fn_bounds: list[tuple[int, int, str, str]] = []  # (start, end, ticker, section)

    def section_of_fname(fname: str) -> str:
        low = fname.lower()
        if "fundamental" in low or "earnings" in low:
            return "fund"
        if "technical" in low:
            return "tech"
        if "valuation" in low or "comp" in low:
            return "val"
        if "options" in low or "option" in low:
            return "opt"
        if "summary" in low or "consolidated" in low or "exec" in low or "investment" in low:
            return "summary"
        return "summary"

    for m in fn_re.finditer(text):
        fname = m.group(1)
        start = m.end()
        depth = 1
        i = start
        while depth > 0 and i < len(text):
            c = text[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            i += 1
        for t in TICKERS:
            if fname.lower().startswith(t.lower()):
                fn_bounds.append((m.start(), i, t, section_of_fname(fname)))
                break

    inline_re = re.compile(r"data:image/png;base64,([A-Za-z0-9+/=]{200,})")
    n_inline = 0
    seen: set[tuple[str, str]] = set()
    for ticker, items in by_ticker.items():
        for _name, b64 in items:
            seen.add((ticker, b64[:60]))

    for m in inline_re.finditer(text):
        pos = m.start()
        b64 = m.group(1)
        attr_ticker: str | None = None
        cat = "summary"
        for fs, fe, t, sec in fn_bounds:
            if fs <= pos < fe:
                attr_ticker = t
                cat = sec
                break
        if not attr_ticker:
            continue
        if (attr_ticker, b64[:60]) in seen:
            continue
        seen.add((attr_ticker, b64[:60]))
        n_existing = sum(1 for n, _ in by_ticker[attr_ticker] if n.startswith(cat + "_"))
        out_name = f"{cat}_{n_existing + 1:02d}.png"
        by_ticker[attr_ticker].append((out_name, b64))
        n_inline += 1
    print(f"\nInline images attributed: {n_inline}")

    # Write to disk
    total = 0
    skip_existing = {"chart_00.png"}  # legacy placeholder; do not touch
    for ticker in TICKERS:
        items = by_ticker.get(ticker, [])
        if not items:
            print(f"  {ticker}: 0 charts")
            continue
        out_dir = CHARTS_DIR / ticker
        out_dir.mkdir(parents=True, exist_ok=True)
        # Wipe existing (except chart_00.png which is read-only)
        for f in out_dir.glob("*.png"):
            if f.name in skip_existing:
                continue
            try:
                f.unlink()
            except PermissionError:
                pass
        # Dedupe by base64 prefix so we don't write the same chart twice with
        # different names (one from IMG_MAP and one from inline scan).
        written_prefixes: set[str] = set()
        n = 0
        for name, b64 in items:
            pref = b64[:60]
            if pref in written_prefixes:
                continue
            written_prefixes.add(pref)
            try:
                clean = re.sub(r"\s+", "", b64)
                data = base64.b64decode(clean)
                if len(data) < 1000:  # skip tiny/invalid images
                    continue
                (out_dir / name).write_bytes(data)
                n += 1
                total += 1
            except Exception as e:
                print(f"    ✗ {ticker}/{name}: {e}")
        print(f"  {ticker}: {n} charts written")
    print(f"\nTotal charts written: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
