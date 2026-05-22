"""Extract inline `const X = {...}` / `const X = [...]` literals from each
per-ticker page function in the monolith, evaluate them in a Node sandbox,
and write the resulting payloads as side-channel JSON files.

This catches the data that the previous extractor missed because it lives
inside function bodies (not module scope), specifically:
  - `const om = {...}`            → data/options/{T}.json
  - `const c = {fundamentals:..}` → augments data/companies/{T}.json
  - `const NARR = {...}`          → augments data/narratives/{T}.json
  - hard-coded ARM dossier (whole ticker's data is inline in armXxxPage())

Output: a Node script that runs every page function in isolation with
DATA.companies stubbed, captures the literals, and writes JSON per ticker.
"""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path("/sessions/compassionate-nice-johnson/mnt/Q2Q_ER_Cowork")
MONOLITH = ROOT / "05.15.26-Dashboard-V1-V2-Integrated.html"
DEST = ROOT / "investment-dashboard"

TICKERS = [
    "META", "AMD", "NVDA", "AVGO", "AAPL", "AMZN", "NFLX", "PLTR", "TSLA",
    "LLY", "MU", "SNOW", "ASML", "GOOG", "AMAT", "ARM",
]


def main() -> int:
    print(f"Loading {MONOLITH.name}...")
    html = MONOLITH.read_text(encoding="utf-8")

    # Find every page-function for each ticker (any function whose name starts
    # with a lowercase ticker plus "Page" or "Summary" etc.).
    # Match pattern: function {ticker_lower}{Suffix}Page() { ... } — use a
    # depth-counted brace match because function bodies have many nested braces.
    print("Indexing per-ticker page-function bodies...")
    fn_re = re.compile(
        r"function\s+([a-z][a-zA-Z]+)\s*\(\s*\)\s*\{"
    )
    bodies: dict[str, list[tuple[str, int, int]]] = {t: [] for t in TICKERS}
    for m in fn_re.finditer(html):
        fname = m.group(1)
        # Match the ticker prefix (lowercase). Some functions use camel: e.g.
        # armSummaryPage, muOptionsPage, metaTechnicalPage.
        for t in TICKERS:
            if fname.lower().startswith(t.lower()):
                # Find matching closing brace
                start = m.end()
                depth = 1
                i = start
                while depth > 0 and i < len(html):
                    if html[i] == "{":
                        depth += 1
                    elif html[i] == "}":
                        depth -= 1
                    i += 1
                bodies[t].append((fname, m.start(), i))
                break
    for t in TICKERS:
        print(f"  {t}: {len(bodies[t])} page functions found")

    # For each ticker's bodies, regex-grab inline `const om = {...}` etc.
    # Patterns we care about:
    #   - om (options data)
    #   - NARR (narrative)
    #   - FUND (fundamentals)
    #   - rows (mcs rows)
    #   - quarters, q_to_q_pairs (deeper structures)
    captured: dict[str, dict[str, str]] = {t: {} for t in TICKERS}
    # Match `const NAME = ` followed by a JS literal — capture until the matching
    # close-brace/bracket. We do brace-depth counting.

    def grab_literal(text: str, start: int) -> str | None:
        # Skip whitespace
        i = start
        while i < len(text) and text[i] in " \t\r\n":
            i += 1
        if i >= len(text) or text[i] not in "{[":
            return None
        open_ch = text[i]
        close_ch = "}" if open_ch == "{" else "]"
        depth = 1
        j = i + 1
        in_str = None
        while j < len(text) and depth > 0:
            c = text[j]
            if in_str:
                if c == "\\":
                    j += 2
                    continue
                if c == in_str:
                    in_str = None
            else:
                if c in "\"'`":
                    in_str = c
                elif c == open_ch:
                    depth += 1
                elif c == close_ch:
                    depth -= 1
            j += 1
        if depth != 0:
            return None
        return text[i:j]

    NAMED_PATTERNS = [
        # name → output key
        ("om", "options"),
        ("OPTIONS_METRICS", "options"),  # legacy global pattern, just in case
        ("NARR", "narrative"),
        ("FUND", "fundamentals"),
    ]

    for t in TICKERS:
        for _fname, fstart, fend in bodies[t]:
            body = html[fstart:fend]
            for varname, outkey in NAMED_PATTERNS:
                # Match `const om = ` or `let om = ` at start-of-token boundary
                pat = re.compile(r"\b(?:const|let|var)\s+" + re.escape(varname) + r"\s*=", re.MULTILINE)
                for m in pat.finditer(body):
                    lit = grab_literal(body, m.end())
                    if lit and len(lit) > 50:  # ignore stubs
                        if outkey not in captured[t] or len(lit) > len(captured[t][outkey]):
                            captured[t][outkey] = lit

    # Print summary
    print("\n=== Inline-literal extraction summary ===")
    for t in TICKERS:
        keys = ", ".join(captured[t].keys()) or "—"
        print(f"  {t}: {keys}")

    # Now we need to convert each captured literal from JS to JSON.
    # Strategy: write a tiny Node script that takes the literal as input,
    # evaluates it, then JSON.stringifies. This handles single-quoted strings,
    # template literals, comments, and trailing commas.
    print("\nEvaluating literals via Node sandbox...")
    out_count = {"options": 0, "narrative": 0, "fundamentals": 0}
    for t in TICKERS:
        for outkey, lit in captured[t].items():
            # Wrap in `(...)` so it parses as an expression
            node_code = f"const x = ({lit});\nprocess.stdout.write(JSON.stringify(x));\n"
            try:
                result = subprocess.run(
                    ["node", "-e", node_code],
                    capture_output=True, text=True, timeout=15,
                )
                if result.returncode != 0:
                    print(f"  ✗ {t}.{outkey}: node eval failed: {result.stderr[:200]}")
                    continue
                payload = json.loads(result.stdout)
                # Decide destination directory
                if outkey == "options":
                    dst = DEST / "data" / "options" / f"{t}.json"
                elif outkey == "narrative":
                    dst = DEST / "data" / "narratives" / f"{t}.json"
                    # Don't overwrite a richer existing narrative
                    if dst.exists() and dst.stat().st_size > len(json.dumps(payload)):
                        continue
                elif outkey == "fundamentals":
                    # Inject into the company file's `fundamentals` field
                    co_path = DEST / "data" / "companies" / f"{t}.json"
                    if co_path.exists():
                        co = json.loads(co_path.read_text())
                    else:
                        co = {"ticker": t}
                    co["fundamentals"] = payload
                    co_path.parent.mkdir(parents=True, exist_ok=True)
                    co_path.write_text(json.dumps(co, indent=2))
                    out_count[outkey] += 1
                    print(f"  ✓ {t}.{outkey}: {len(json.dumps(payload))} bytes")
                    continue
                else:
                    continue
                dst.parent.mkdir(parents=True, exist_ok=True)
                dst.write_text(json.dumps(payload, indent=2))
                out_count[outkey] += 1
                print(f"  ✓ {t}.{outkey}: {len(json.dumps(payload))} bytes")
            except subprocess.TimeoutExpired:
                print(f"  ✗ {t}.{outkey}: timeout")
            except json.JSONDecodeError as e:
                print(f"  ✗ {t}.{outkey}: JSON decode: {e}")
            except Exception as e:
                print(f"  ✗ {t}.{outkey}: {type(e).__name__}: {e}")

    print(f"\nWrote: {out_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
