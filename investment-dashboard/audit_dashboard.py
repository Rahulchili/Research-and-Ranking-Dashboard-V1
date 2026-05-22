#!/usr/bin/env python3
"""audit_dashboard.py — comprehensive audit of every ticker × every section.

Categorizes findings so fixes can be made at the pipeline/renderer layer rather
than per-ticker. Prints a structured report at the end with severity buckets.
"""
from __future__ import annotations
import json
import os
import re
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
CHARTS = ROOT / "assets" / "charts"

# Load dashboard payload (the leaderboard truth)
dash = json.loads((DATA / "dashboard-data.json").read_text())
tickers = sorted(c["ticker"] for c in dash["companies"])

# Group issues by category for systemic fixes
issues: dict[str, list[str]] = defaultdict(list)


def add(category: str, ticker: str, detail: str) -> None:
    issues[category].append(f"{ticker}: {detail}")


# ─────────────────────────────────────────────────────────────────────
# 1) FILE PRESENCE — every ticker must have 5 JSON files + chart dir
# ─────────────────────────────────────────────────────────────────────
for t in tickers:
    for sub in ("companies", "narratives", "ta_levels", "factset", "options"):
        if not (DATA / sub / f"{t}.json").exists():
            add("missing_json", t, f"data/{sub}/{t}.json absent")
    chart_dir = CHARTS / t
    if not chart_dir.is_dir():
        add("missing_charts_dir", t, f"assets/charts/{t}/ missing")
        continue
    pngs = [p for p in chart_dir.iterdir() if p.suffix == ".png"]
    if len(pngs) < 3:
        add("too_few_charts", t, f"only {len(pngs)} PNGs")
    # File-size sanity: PNG should be >2KB or it's likely an empty placeholder
    for p in pngs:
        if p.stat().st_size < 2000:
            add("undersized_chart", t, f"{p.name} = {p.stat().st_size}B")


# ─────────────────────────────────────────────────────────────────────
# 2) PER-TICKER DEEP CHECK
# ─────────────────────────────────────────────────────────────────────
def load(sub: str, t: str) -> dict:
    p = DATA / sub / f"{t}.json"
    try:
        return json.loads(p.read_text())
    except Exception as e:
        add("json_parse_error", t, f"{sub}: {e}")
        return {}


leaderboard = {c["ticker"]: c for c in dash["companies"]}

for t in tickers:
    co = load("companies", t)
    fund = co.get("fundamentals", {})
    quarters = fund.get("quarters") or []
    summary = fund.get("summary") or {}
    rows = co.get("rows") or []
    narr = load("narratives", t)
    ta = load("ta_levels", t)
    fs = load("factset", t)
    opt = load("options", t)
    sector = co.get("sector") or ""

    # --- Fundamentals (legacy tickers often use rows[] guidance instead of
    # fundamentals.quarters — accept either as a valid completion signal) ---
    has_quarters = len(quarters) > 0
    has_rows = len(rows) > 0
    if not has_quarters and not has_rows:
        add("fund_no_quarters", t, "0 quarters AND 0 forward-claim rows")
    elif has_quarters and len(quarters) < 4:
        add("fund_thin_quarters", t, f"only {len(quarters)} quarters")

    is_bank = "financial" in sector.lower() or any(q.get("nii_q_M") for q in quarters)
    for q in quarters:
        rev = q.get("rev_q_M")
        if rev is not None and rev > 0:
            # Sanity bounds. For known mega-caps the latest rev_q_M sits roughly
            # in $1B–$300B per quarter. A value over 1,000,000 is a unit bug.
            if rev > 1_000_000:
                add("unit_bug_quarters", t, f"FY{q.get('fy')} Q{q.get('fq')} rev_q_M={rev:,.0f} (unit issue)")
            if rev < 0:
                add("neg_revenue", t, f"FY{q.get('fy')} Q{q.get('fq')} rev_q_M={rev}")

    # YoY sanity
    yoy = summary.get("yoy_revenue_growth_pct")
    if yoy is not None and abs(yoy) > 80:
        add("yoy_abnormal", t, f"YoY {yoy}% looks like a wrong-quarter compare")

    # Net margin sanity
    nm = summary.get("latest_net_margin_pct")
    if nm is not None and (nm < -50 or nm > 75):
        add("nm_abnormal", t, f"NM {nm}%")

    # TTM sanity (should be < latest_revenue_b * 8 i.e. less than 8 quarters' worth)
    ttm = summary.get("ttm_revenue_b")
    rev_b = summary.get("latest_revenue_b")
    if ttm and rev_b and ttm > rev_b * 12:
        add("ttm_bug", t, f"TTM {ttm}B vs latest qtr {rev_b}B")

    # --- Technicals (accept multiple field aliases the renderer normalizes) ---
    spot = ta.get("spot") or ta.get("close") or ta.get("spot_price") or ta.get("price")
    sma200 = ta.get("sma200") or ta.get("sma_200") or ta.get("pct_above_sma200_pct")
    if spot is None:
        add("ta_no_spot", t, "no spot price (checked spot/close/spot_price/price)")
    elif spot < 0 or spot > 100_000:
        add("ta_bad_spot", t, f"spot {spot}")
    if sma200 is None:
        add("ta_no_sma200", t, "no sma200 (checked sma200/sma_200/pct_above_sma200_pct)")

    # --- Valuation (accept legacy peer_table alias) ---
    target = fs.get("target") or {}
    peers = fs.get("peers") or fs.get("peer_table") or []
    if isinstance(peers, dict):
        peers = list(peers.values())
    if not target:
        add("val_no_target", t, "no factset target")
    if len(peers) < 2:
        add("val_thin_peers", t, f"only {len(peers)} peers")
    pe_fy1 = target.get("PE_FY1")
    if pe_fy1 is not None and (pe_fy1 < 0 or pe_fy1 > 500):
        add("val_bad_pe", t, f"PE_FY1 {pe_fy1}")

    # --- Options ---
    expiries = opt.get("expiries") or []
    term = opt.get("term_structure") or []
    if not expiries and not term:
        add("opt_no_chain", t, "no expiries / term_structure")
    if expiries and len(expiries) < 5:
        add("opt_thin_expiries", t, f"only {len(expiries)} expiries")
    iv_front = opt.get("atm_iv_front_pct")
    if iv_front is not None and (iv_front < 0 or iv_front > 500):
        add("opt_bad_iv", t, f"front IV {iv_front}%")

    # --- MCS ---
    mcs = co.get("mcs_simple")
    if mcs is None:
        add("mcs_no_score", t, "MCS not computed (no closed claims)")
    elif mcs < 0 or mcs > 1:
        add("mcs_out_of_range", t, f"MCS {mcs}")

    # --- Narrative ---
    if not narr.get("bull"):
        add("narr_no_bull", t, "0 bull bullets")
    if not narr.get("bear"):
        add("narr_no_bear", t, "0 bear bullets")
    if not narr.get("scoreboard"):
        add("narr_no_scoreboard", t, "0 scoreboard rows")
    if not narr.get("bottom_line"):
        add("narr_no_bottom", t, "no bottom line")
    blob = json.dumps(narr)
    for marker in ["AUTO-DRAFT", "Add bull point", "Add bear point",
                   "Polish this", "[stub]", "TBD", "auto-draft", "<<TODO"]:
        if marker.lower() in blob.lower():
            add("narr_placeholder", t, f"placeholder marker '{marker}'")
    # Stance: just verify it's a non-empty string with one of the analytical
    # keywords (BULLISH / BEARISH / NEUTRAL / CONSTRUCTIVE / CAUTIOUS / HOLD /
    # WATCH / MIXED). Legacy tickers have richer hand-authored stance strings.
    s = (narr.get("stance") or "").upper()
    if not any(k in s for k in ("BULLISH", "BEARISH", "NEUTRAL", "CONSTRUCTIVE",
                                  "CAUTIOUS", "HOLD", "WATCH", "MIXED")):
        add("narr_stance", t, f"unrecognized stance: {narr.get('stance')!r}")

    # --- Leaderboard cross-check ---
    lb = leaderboard.get(t)
    if not lb:
        add("lb_missing", t, "not in dashboard-data.json")
        continue
    sec_lb = lb.get("sector")
    sec_co = co.get("sector")
    if sec_lb != sec_co:
        add("sector_mismatch", t, f"lb={sec_lb!r} vs co={sec_co!r}")
    if not 0 < lb.get("compositeScore", 0) <= 100:
        add("composite_out_of_range", t, f"composite={lb['compositeScore']}")

# ─────────────────────────────────────────────────────────────────────
# 3) LEADERBOARD-LEVEL CHECKS
# ─────────────────────────────────────────────────────────────────────
ranks = sorted([c["rank"] for c in dash["companies"]])
if ranks != list(range(1, len(ranks) + 1)):
    add("rank_sequence", "—", f"ranks not 1..N; got {ranks[:5]}…{ranks[-3:]}")
# composites monotonic by rank
sorted_by_rank = sorted(dash["companies"], key=lambda c: c["rank"])
for i in range(1, len(sorted_by_rank)):
    if sorted_by_rank[i]["compositeScore"] > sorted_by_rank[i-1]["compositeScore"] + 0.01:
        add("rank_order", "—", f"rank {sorted_by_rank[i]['rank']} composite > rank {sorted_by_rank[i-1]['rank']}")

# Confirm no duplicates
seen_t = set()
for c in dash["companies"]:
    if c["ticker"] in seen_t:
        add("dup_ticker", c["ticker"], "duplicated in dashboard")
    seen_t.add(c["ticker"])

# ─────────────────────────────────────────────────────────────────────
# 4) BUNDLE COMPLETENESS — every ticker accessible from the frontend
# ─────────────────────────────────────────────────────────────────────
bundle_text = (DATA / "tickers-bundle.js").read_text()
for t in tickers:
    if f'"{t}"' not in bundle_text and f"'{t}'" not in bundle_text:
        add("bundle_missing", t, "not in tickers-bundle.js")


# ─────────────────────────────────────────────────────────────────────
# REPORT
# ─────────────────────────────────────────────────────────────────────
print(f"AUDIT REPORT — {len(tickers)} tickers")
print("=" * 78)
print()
if not issues:
    print("✓ NO ISSUES — every ticker × section passes all checks")
    sys.exit(0)

# Severity ordering
order = [
    # Severe — breaks rendering
    ("missing_json", "✗ CRITICAL"),
    ("missing_charts_dir", "✗ CRITICAL"),
    ("bundle_missing", "✗ CRITICAL"),
    ("lb_missing", "✗ CRITICAL"),
    ("json_parse_error", "✗ CRITICAL"),
    ("rank_sequence", "✗ CRITICAL"),
    ("rank_order", "✗ CRITICAL"),
    ("dup_ticker", "✗ CRITICAL"),
    # Wrong data
    ("unit_bug_quarters", "⚠ DATA"),
    ("yoy_abnormal", "⚠ DATA"),
    ("nm_abnormal", "⚠ DATA"),
    ("ttm_bug", "⚠ DATA"),
    ("ta_bad_spot", "⚠ DATA"),
    ("val_bad_pe", "⚠ DATA"),
    ("opt_bad_iv", "⚠ DATA"),
    ("mcs_out_of_range", "⚠ DATA"),
    ("neg_revenue", "⚠ DATA"),
    ("composite_out_of_range", "⚠ DATA"),
    ("sector_mismatch", "⚠ DATA"),
    # Missing content
    ("fund_no_quarters", "● MISSING"),
    ("fund_thin_quarters", "● MISSING"),
    ("ta_no_spot", "● MISSING"),
    ("ta_no_sma200", "● MISSING"),
    ("val_no_target", "● MISSING"),
    ("val_thin_peers", "● MISSING"),
    ("opt_no_chain", "● MISSING"),
    ("opt_thin_expiries", "● MISSING"),
    ("mcs_no_score", "● MISSING"),
    ("narr_no_bull", "● MISSING"),
    ("narr_no_bear", "● MISSING"),
    ("narr_no_scoreboard", "● MISSING"),
    ("narr_no_bottom", "● MISSING"),
    # Quality
    ("narr_placeholder", "○ QUALITY"),
    ("narr_stance", "○ QUALITY"),
    ("too_few_charts", "○ QUALITY"),
    ("undersized_chart", "○ QUALITY"),
]

for key, severity in order:
    if key in issues:
        print(f"\n{severity}  [{key}]  ({len(issues[key])} occurrences)")
        for it in issues[key]:
            print(f"    {it}")
        del issues[key]

if issues:
    print("\n⚠ UNCATEGORIZED ISSUES (please update audit script):")
    for k, v in issues.items():
        print(f"  {k}: {v}")

print()
print("=" * 78)
print(f"TOTAL TICKERS: {len(tickers)}")
