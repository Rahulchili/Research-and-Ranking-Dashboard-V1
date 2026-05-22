#!/usr/bin/env python3
"""fix_legacy_options.py — parse OPRA chains for every legacy ticker that
currently has no options data in the bundle. Writes data/options/<T>.json
using the new parser, then leaves the regeneration of dashboard-data /
tickers-bundle to the standard build pipeline."""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_ticker import parse_options  # type: ignore

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
WORKSPACE = ROOT.parent  # /Users/.../Q2Q_ER_Cowork

# Legacy tickers without data/options/<T>.json today
LEGACY = [
    "AAPL", "AMAT", "AMD", "AMZN", "ARM", "ASML", "AVGO",
    "BABA", "BAC", "GOOG", "LLY", "MU", "NFLX", "NVDA",
    "PLTR", "SNOW", "TSLA",
]


def latest_spot_for(ticker: str) -> float | None:
    """Try (in order): bundle data, factset target, then None."""
    fs_path = DATA / "factset" / f"{ticker}.json"
    if fs_path.exists():
        try:
            fs = json.loads(fs_path.read_text())
            t = fs.get("target") or {}
            for key in ("price", "live_price_during_capture", "as_of_close"):
                v = t.get(key)
                if isinstance(v, (int, float)) and v > 0:
                    return float(v)
        except Exception:
            pass
    # Try bundle as fallback
    bundle_text = (DATA / "tickers-bundle.js").read_text()
    m = re.search(r"JSON\.parse\('(.*)'\);", bundle_text, re.DOTALL)
    if m:
        try:
            js = m.group(1).replace("\\'", "'").replace("\\\\", "\\")
            data = json.loads(js)
            td = data.get(ticker, {})
            ta = td.get("ta_levels") or {}
            fs = td.get("factset") or {}
            t = fs.get("target") or {}
            for src in (ta, t):
                for key in ("spot", "spot_price", "price", "close",
                            "live_price_during_capture", "as_of_close"):
                    v = src.get(key) if isinstance(src, dict) else None
                    if isinstance(v, (int, float)) and v > 0:
                        return float(v)
        except Exception:
            pass
    return None


def find_options_file(ticker: str) -> Path | None:
    """Locate the options xlsx in the workspace folder."""
    cand = WORKSPACE / ticker / "Options"
    if not cand.is_dir():
        return None
    files = sorted(cand.glob("*.xlsx"))
    return files[0] if files else None


def main() -> None:
    print(f"Generating OPRA options JSON for {len(LEGACY)} legacy tickers")
    print("-" * 64)
    success = 0
    for t in LEGACY:
        f = find_options_file(t)
        if not f:
            print(f"  {t:6} ✗ no xlsx in {WORKSPACE}/{t}/Options/")
            continue
        spot = latest_spot_for(t)
        try:
            out = parse_options(f, spot or 100.0)
        except Exception as e:
            print(f"  {t:6} ✗ parser raised: {e}")
            continue
        if not out or not out.get("expiries"):
            print(f"  {t:6} ✗ parser returned no expiries")
            continue
        # Write the JSON
        dst = DATA / "options" / f"{t}.json"
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(json.dumps(out, indent=2))
        print(f"  {t:6} ✓ {len(out.get('expiries', []))} expiries, "
              f"front IV {out.get('atm_iv_front_pct', 0):.1f}%, "
              f"P/C OI {out.get('pcr_oi', 0):.2f}, "
              f"spot ${spot or '?'}")
        success += 1
    print()
    print(f"  → {success}/{len(LEGACY)} options files generated")


if __name__ == "__main__":
    main()
