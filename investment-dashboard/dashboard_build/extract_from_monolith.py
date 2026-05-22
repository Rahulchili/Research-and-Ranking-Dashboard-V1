"""Extract per-ticker DATA + narratives + TA + FactSet + charts from the
legacy monolith into structured per-ticker JSON + chart PNGs on disk.

This is the bridge that lets the refactored modular dashboard render every
ticker at the same depth as the monolith, without inlining 50MB of base64
PNGs or duplicating 96 per-ticker page functions.

Inputs:
  - 05.15.26-Dashboard-V1-V2-Integrated.html (47.97 MB monolith)

Outputs (under investment-dashboard/):
  - data/companies/{TICKER}.json (per-ticker full payload)
  - data/narratives/{TICKER}.json (bull/bear/scoreboard/quotes/etc.)
  - data/ta_levels/{TICKER}.json (technical indicator snapshot)
  - data/factset/{TICKER}.json (FactSet peer comp + target)
  - assets/charts/{TICKER}/*.png (extracted base64 charts as files)
"""
from __future__ import annotations

import base64
import json
import re
from pathlib import Path

WORKSPACE = Path("/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork")
SRC = WORKSPACE / "05.15.26-Dashboard-V1-V2-Integrated.html"
DEST = WORKSPACE / "investment-dashboard"

# Where new per-ticker artifacts land
COMPANIES_DIR = DEST / "data" / "companies"
NARRATIVES_DIR = DEST / "data" / "narratives"
TA_DIR = DEST / "data" / "ta_levels"
FS_DIR = DEST / "data" / "factset"
CHARTS_DIR = DEST / "assets" / "charts"

TICKERS = [
    "META", "AMD", "NVDA", "AVGO", "AAPL", "AMZN", "NFLX", "PLTR", "TSLA",
    "LLY", "MU", "SNOW", "ASML", "GOOG", "AMAT", "ARM",
]


# ---------------------------------------------------------------------------
# JS object literal extraction — robust enough for the patterns the monolith
# actually uses. We scan for "DATA.companies.X = {...};" and similar.
# ---------------------------------------------------------------------------

def find_balanced_object(text: str, start: int) -> str | None:
    """Given an index pointing at '{', return the matching balanced substring
    through the closing '}'. Handles strings (single, double, backtick) and
    /* */ // comments and braces inside strings/comments."""
    n = len(text)
    if start >= n or text[start] != "{":
        return None
    i = start
    depth = 0
    while i < n:
        c = text[i]
        if c == "{":
            depth += 1
            i += 1
            continue
        if c == "}":
            depth -= 1
            i += 1
            if depth == 0:
                return text[start:i]
            continue
        # Skip strings
        if c in "\"'`":
            quote = c
            i += 1
            while i < n:
                if text[i] == "\\":
                    i += 2
                    continue
                if text[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        # Skip line comment
        if c == "/" and i + 1 < n and text[i + 1] == "/":
            while i < n and text[i] != "\n":
                i += 1
            continue
        # Skip block comment
        if c == "/" and i + 1 < n and text[i + 1] == "*":
            i += 2
            while i < n - 1 and not (text[i] == "*" and text[i + 1] == "/"):
                i += 1
            i += 2
            continue
        i += 1
    return None


def parse_assignment(text: str, identifier_pattern: str) -> dict[str, str]:
    """Find assignments matching the given identifier pattern.

    identifier_pattern is a regex with one capture group for the "key".
    Returns {key: object_literal_source} for each match.
    """
    out = {}
    for m in re.finditer(identifier_pattern + r"\s*=\s*", text):
        # Find the opening '{' or '[' after the '=' sign
        idx = m.end()
        # Skip whitespace
        while idx < len(text) and text[idx] in " \t\n\r":
            idx += 1
        if idx >= len(text):
            continue
        if text[idx] == "{":
            obj = find_balanced_object(text, idx)
        elif text[idx] == "[":
            # Find balanced []
            n = len(text)
            depth = 0
            i = idx
            obj = None
            while i < n:
                ch = text[i]
                if ch == "[":
                    depth += 1
                    i += 1
                    continue
                if ch == "]":
                    depth -= 1
                    i += 1
                    if depth == 0:
                        obj = text[idx:i]
                        break
                    continue
                if ch in "\"'`":
                    quote = ch
                    i += 1
                    while i < n:
                        if text[i] == "\\":
                            i += 2
                            continue
                        if text[i] == quote:
                            i += 1
                            break
                        i += 1
                    continue
                i += 1
        else:
            continue
        if obj is not None:
            key = m.group(1)
            out[key] = obj
    return out


# Very lightweight JS-object-literal-to-JSON-ish converter. Handles:
#   - Unquoted keys → quoted
#   - Single-quoted strings → double-quoted
#   - Trailing commas before } or ]
#   - Function expressions (replaces with null sentinel)
#   - Comments
def js_to_json(src: str) -> str:
    # Remove block comments
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.DOTALL)
    # Remove line comments (simple — not perfect inside strings but works here)
    src = re.sub(r"(?<![:'\"])//[^\n]*", "", src)
    # Replace single-quoted strings with double-quoted (rough — escapes single quote)
    def _sq(m: re.Match[str]) -> str:
        s = m.group(1)
        s = s.replace("\\", "\\\\").replace('"', '\\"')
        return '"' + s + '"'
    src = re.sub(r"'((?:[^'\\]|\\.)*)'", _sq, src)
    # Quote unquoted object keys: { key: → { "key":
    src = re.sub(r'([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:', r'\1"\2":', src)
    # Strip trailing commas before } or ]
    src = re.sub(r",\s*([}\]])", r"\1", src)
    # Function expressions are rare in DATA but appear in onclick handlers —
    # neutralize: function(...) {...} → null
    src = re.sub(r"function\s*\([^)]*\)\s*\{[^{}]*\}", "null", src)
    return src


def parse_js_object(src: str) -> dict[str, object] | list[object] | None:
    """Best-effort JS object → Python value. Returns None on failure."""
    try:
        result: dict[str, object] | list[object] = json.loads(js_to_json(src))
        return result
    except json.JSONDecodeError:
        return None


# ---------------------------------------------------------------------------
# Specific extractors
# ---------------------------------------------------------------------------

def extract_data_companies(text: str) -> dict[str, object]:
    """Find every DATA.companies.{TICKER} = {...} assignment."""
    out: dict[str, object] = {}
    matches = parse_assignment(text, r"DATA\.companies\.([A-Z]+)")
    for ticker, literal in matches.items():
        if ticker not in TICKERS and ticker != "BABA":
            continue
        parsed = parse_js_object(literal)
        if parsed is None:
            print(f"  ⚠ {ticker}: could not parse DATA.companies (size={len(literal)})")
            # Keep the raw literal as fallback
            out[ticker] = {"_unparseable": True, "_raw_size": len(literal)}
        else:
            out[ticker] = parsed
            print(f"  ✓ {ticker}: parsed DATA.companies ({len(literal):,} chars)")
    return out


def extract_data_narratives(text: str) -> dict[str, object]:
    """Find DATA.narratives.{TICKER} = {...} or IIFE-style registrations."""
    out: dict[str, object] = {}
    # Direct assignment form
    matches = parse_assignment(text, r"DATA\.narratives\.([A-Z]+)")
    for ticker, literal in matches.items():
        if ticker not in TICKERS:
            continue
        parsed = parse_js_object(literal)
        if parsed is not None:
            out[ticker] = parsed
            print(f"  ✓ {ticker}: parsed DATA.narratives ({len(literal):,} chars)")
        else:
            out[ticker] = {"_unparseable": True}
            print(f"  ⚠ {ticker}: DATA.narratives unparseable")
    return out


def extract_globals(text: str, suffix: str) -> dict[str, object]:
    """Find globalThis.{TICKER}_{SUFFIX} or const {TICKER}_{SUFFIX} or
    DATA.{TICKER}_{SUFFIX}."""
    out: dict[str, object] = {}
    patterns = [
        rf"globalThis\.([A-Z]+)_{suffix}",
        rf"window\.([A-Z]+)_{suffix}",
        rf"const\s+([A-Z]+)_{suffix}",
        rf"DATA\.([A-Z]+)_{suffix}",
    ]
    for pat in patterns:
        matches = parse_assignment(text, pat)
        for ticker, literal in matches.items():
            if ticker not in TICKERS:
                continue
            if ticker in out:
                continue
            parsed = parse_js_object(literal)
            if parsed is not None:
                out[ticker] = parsed
                print(f"  ✓ {ticker}: parsed {suffix} ({len(literal):,} chars)")
            else:
                out[ticker] = {"_unparseable": True}
    return out


def extract_charts(text: str) -> dict[str, int]:
    """Find every <img src="data:image/png;base64,..."> and write to disk.

    Returns a count of charts extracted per ticker (best-effort attribution
    via nearby class names or function context — we use a sequential per-page
    naming scheme since the monolith doesn't tag charts with tickers).
    """
    pattern = re.compile(r'data:image/png;base64,([A-Za-z0-9+/=]{100,})')
    counts = {t: 0 for t in TICKERS}
    counts["_total"] = 0
    counts["_unattributed"] = 0
    for m in pattern.finditer(text):
        b64 = m.group(1)
        counts["_total"] += 1
        # Best-effort attribution: scan back ~2000 chars for the most recent
        # ticker mention (function name like metaFundamentalPage, etc.)
        ctx = text[max(0, m.start() - 4000):m.start()]
        # Look for the last function definition that contains a ticker prefix
        fn_matches = list(re.finditer(r"function\s+([a-z]+)([A-Z][a-z]+)Page\s*\(", ctx))
        attributed = False
        if fn_matches:
            last = fn_matches[-1]
            prefix = last.group(1).upper()
            if prefix in TICKERS:
                idx = counts[prefix]
                out = CHARTS_DIR / prefix / f"chart_{idx:02d}.png"
                out.parent.mkdir(parents=True, exist_ok=True)
                try:
                    out.write_bytes(base64.b64decode(b64))
                    counts[prefix] += 1
                    attributed = True
                except Exception:
                    pass
        if not attributed:
            counts["_unattributed"] += 1
    return counts


def main() -> int:
    print(f"=== Extracting from monolith {SRC.name} ({SRC.stat().st_size:,} bytes) ===\n")
    if not SRC.exists():
        print(f"FAIL: {SRC} not found")
        return 1
    text = SRC.read_text(encoding="utf-8", errors="ignore")
    print(f"Loaded {len(text):,} chars\n")

    print("[1/5] Extracting DATA.companies ...")
    companies = extract_data_companies(text)

    print("\n[2/5] Extracting DATA.narratives ...")
    narratives = extract_data_narratives(text)

    print("\n[3/5] Extracting per-ticker TA levels ...")
    ta_levels = extract_globals(text, "TA_LEVELS")

    print("\n[4/5] Extracting per-ticker FactSet ...")
    factset = extract_globals(text, "FACTSET_PEERS")

    print("\n[5/5] Extracting embedded base64 charts to PNG files ...")
    chart_counts = extract_charts(text)

    # Write outputs
    COMPANIES_DIR.mkdir(parents=True, exist_ok=True)
    NARRATIVES_DIR.mkdir(parents=True, exist_ok=True)
    TA_DIR.mkdir(parents=True, exist_ok=True)
    FS_DIR.mkdir(parents=True, exist_ok=True)

    for t in TICKERS:
        if t in companies:
            (COMPANIES_DIR / f"{t}.json").write_text(
                json.dumps(companies[t], indent=2, default=str), encoding="utf-8"
            )
        if t in narratives:
            (NARRATIVES_DIR / f"{t}.json").write_text(
                json.dumps(narratives[t], indent=2, default=str), encoding="utf-8"
            )
        if t in ta_levels:
            (TA_DIR / f"{t}.json").write_text(
                json.dumps(ta_levels[t], indent=2, default=str), encoding="utf-8"
            )
        if t in factset:
            (FS_DIR / f"{t}.json").write_text(
                json.dumps(factset[t], indent=2, default=str), encoding="utf-8"
            )

    def _ok(v: object) -> bool:
        return isinstance(v, dict) and not v.get("_unparseable")

    print("\n=== Summary ===")
    print(f"Companies parsed:  {sum(1 for v in companies.values() if _ok(v))}/{len(TICKERS)}")
    print(f"Narratives parsed: {sum(1 for v in narratives.values() if _ok(v))}/{len(TICKERS)}")
    print(f"TA levels parsed:  {sum(1 for v in ta_levels.values() if _ok(v))}/{len(TICKERS)}")
    print(f"FactSet parsed:    {sum(1 for v in factset.values() if _ok(v))}/{len(TICKERS)}")
    print(f"Charts extracted:  {chart_counts['_total']} total, {chart_counts['_unattributed']} unattributed")
    for t in TICKERS:
        if chart_counts[t] > 0:
            print(f"  {t}: {chart_counts[t]} charts → assets/charts/{t}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
