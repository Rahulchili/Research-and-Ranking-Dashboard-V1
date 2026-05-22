"""Read pipeline outputs (and the legacy dashboard, for reconciliation) and
shape them into validated `DashboardPayload` ready for emission.

Per user direction on the build kickoff prompt: read BOTH `ranking_engine/`
outputs AND the current dashboard's DATA blocks, reconcile, prefer the
dashboard values where they disagree, and log every divergence to
`BUILD_NOTES.md`.

Single responsibility: I/O + reconciliation, no scoring math, no I/O writes.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .config import LEGACY_FIXTURE
from .schema import (
    CategoryScores,
)

# ---------------------------------------------------------------------------
# Reconciliation log — kept in memory until generate_data.py persists it.
# ---------------------------------------------------------------------------

@dataclass
class IngestReport:
    """Accumulates everything the user needs to see after an ingest run."""

    legacy_path: str
    legacy_tickers: list[str] = field(default_factory=list)
    pipeline_tickers: list[str] = field(default_factory=list)
    reconciliation_notes: list[str] = field(default_factory=list)
    divergences: list[str] = field(default_factory=list)

    def note(self, msg: str) -> None:
        self.reconciliation_notes.append(msg)

    def diverge(self, ticker: str, field_name: str, legacy: Any, pipeline: Any) -> None:
        self.divergences.append(
            f"{ticker}: {field_name} legacy={legacy!r} pipeline={pipeline!r} → kept legacy (dashboard wins)"
        )


# ---------------------------------------------------------------------------
# Legacy dashboard parser (the 47.97 MB monolith)
# ---------------------------------------------------------------------------

# Find `DATA.companies['X'] = {...};` blocks via balanced-brace walk.
_COMPANY_RE = re.compile(r"DATA\.companies\[['\"]([A-Z]+)['\"]\]\s*=\s*\{")
_NARRATIVE_RE = re.compile(r"DATA\.narratives\.([A-Z]+)\s*=\s*\{")
_TICKER_ORDER_RE = re.compile(r'"ticker_order"\s*:\s*\[([^\]]+)\]')
_V2_PAYLOAD_RE = re.compile(r"const V2_RANKED_PAYLOAD\s*=\s*\[")


def _walk_balanced(text: str, start: int, open_ch: str, close_ch: str) -> int:
    """Walk text starting at `start` (which should be the opening bracket
    position+1) until matching `close_ch` is found at the same depth.
    Returns the index AFTER the closing bracket.
    """
    i = start
    depth = 1
    in_str = False
    sc: str | None = None
    while i < len(text) and depth > 0:
        c = text[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == sc:
                in_str = False
        else:
            if c in ("\"", "'"):
                in_str = True
                sc = c
            elif c == open_ch:
                depth += 1
            elif c == close_ch:
                depth -= 1
        i += 1
    return i


def _extract_json_object(text: str, brace_pos: int) -> dict[str, Any]:
    """Parse the JS object literal starting at `text[brace_pos] == '{'`.
    The legacy dashboard emits everything via `json.dumps`, so this is
    valid JSON in practice."""
    end = _walk_balanced(text, brace_pos + 1, "{", "}")
    blob = text[brace_pos:end]
    parsed: dict[str, Any] = json.loads(blob)
    return parsed


def _extract_companies(text: str) -> dict[str, dict[str, Any]]:
    """Pull every `DATA.companies['X'] = {...}` block from the monolith."""
    out: dict[str, dict[str, Any]] = {}
    for m in _COMPANY_RE.finditer(text):
        ticker = m.group(1)
        brace_pos = text.find("{", m.end() - 1)
        if brace_pos < 0:
            continue
        try:
            out[ticker] = _extract_json_object(text, brace_pos)
        except json.JSONDecodeError:
            # Skip silently — legacy may have non-JSON object literals; the
            # dashboard fixture is all JSON, so this is a safety net only.
            continue
    return out


def _extract_narratives(text: str) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for m in _NARRATIVE_RE.finditer(text):
        ticker = m.group(1)
        brace_pos = text.find("{", m.end() - 1)
        if brace_pos < 0:
            continue
        try:
            out[ticker] = _extract_json_object(text, brace_pos)
        except json.JSONDecodeError:
            continue
    # Also pick up DATA.narratives from the initial JSON blob at the top of the
    # file (narratives that aren't re-assigned later).
    blob = _extract_initial_data_blob(text)
    if blob and "narratives" in blob:
        for k, v in blob["narratives"].items():
            out.setdefault(k, v)
    return out


def _extract_initial_data_blob(text: str) -> dict[str, Any] | None:
    """Pull the first `const DATA = {...}` or `DATA = {...}` assignment."""
    for pat in (r"const DATA\s*=\s*\{", r"\bDATA\s*=\s*\{"):
        m = re.search(pat, text)
        if not m:
            continue
        brace_pos = text.find("{", m.end() - 1)
        try:
            return _extract_json_object(text, brace_pos)
        except json.JSONDecodeError:
            return None
    return None


def _extract_v2_ranked_payload(text: str) -> list[dict[str, Any]]:
    """Pull `const V2_RANKED_PAYLOAD = [...];` — the leaderboard data."""
    m = _V2_PAYLOAD_RE.search(text)
    if not m:
        return []
    bracket_pos = text.find("[", m.end() - 1)
    end = _walk_balanced(text, bracket_pos + 1, "[", "]")
    blob = text[bracket_pos:end]
    try:
        parsed: list[dict[str, Any]] = json.loads(blob)
        return parsed
    except json.JSONDecodeError:
        return []


def _extract_v2_rows_inside_function(text: str) -> list[dict[str, Any]]:
    """Pull the `const ROWS = [...]` array inside priorityRankingV2Page()."""
    m = re.search(r"function priorityRankingV2Page\(\)\s*\{[\s\S]*?const ROWS\s*=\s*\[", text)
    if not m:
        return []
    bracket_pos = m.end() - 1
    end = _walk_balanced(text, bracket_pos + 1, "[", "]")
    blob = text[bracket_pos:end]
    try:
        parsed: list[dict[str, Any]] = json.loads(blob)
        return parsed
    except json.JSONDecodeError:
        return []


def _extract_ticker_order(text: str) -> list[str]:
    """Find the `"ticker_order": [...]` array in the initial DATA blob."""
    blob = _extract_initial_data_blob(text)
    if not blob:
        return []
    order = list(blob.get("ticker_order", []))
    # Pick up any dynamic pushes — `if (!DATA.ticker_order.includes('X')) ... push('X')`.
    pushes = re.findall(r"DATA\.ticker_order\.push\(['\"]([A-Z]+)['\"]\)", text)
    for t in pushes:
        if t not in order:
            order.append(t)
    return order


# ---------------------------------------------------------------------------
# Public reader
# ---------------------------------------------------------------------------

def read_legacy_dashboard(path: str | Path | None = None) -> tuple[
    dict[str, dict[str, Any]],     # companies (DATA.companies[X])
    dict[str, dict[str, Any]],     # narratives (DATA.narratives.X)
    list[str],                     # ticker_order
    list[dict[str, Any]],          # v2 ranking rows (preferred source)
]:
    """Parse every interesting block out of the monolithic dashboard."""
    p = Path(path) if path else LEGACY_FIXTURE
    text = p.read_text(encoding="utf-8")
    companies = _extract_companies(text)
    narratives = _extract_narratives(text)
    order = _extract_ticker_order(text)
    # V2 ranking rows live in TWO places. Prefer the priorityRankingV2Page ROWS
    # array (the user-visible source) over V2_RANKED_PAYLOAD (a parallel global).
    rows = _extract_v2_rows_inside_function(text)
    if not rows:
        rows = _extract_v2_ranked_payload(text)
    return companies, narratives, order, rows


# ---------------------------------------------------------------------------
# Reconciliation: dashboard ROWS → CategoryScores
# ---------------------------------------------------------------------------

def _category_scores_from_row(row: dict[str, Any]) -> CategoryScores:
    """The dashboard's ROWS array uses F/M/V/T/O letter keys."""
    def f(key: str) -> float | None:
        v = row.get(key)
        if v is None:
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    return CategoryScores(
        fundamentals=f("F"),
        management=f("M"),
        valuation=f("V"),
        technicals=f("T"),
        options=f("O"),
    )


def _confidence_basis_from_company(c: dict[str, Any]) -> tuple[int, int, float]:
    """Derive (claim_count, quarters_covered, data_completeness) for a company.

    We use whatever the dashboard already carries; fall back to conservative
    estimates rather than fail.
    """
    claim_count = int(c.get("n_claims") or len(c.get("rows") or []) or 0)
    quarters = c.get("q2q_analysis", {})
    pairs = quarters.get("q_to_q_pairs") or []
    quarters_covered = len(pairs)
    if not quarters_covered:
        fund = c.get("fundamentals") or {}
        quarters_covered = len(fund.get("quarters") or [])
    # Data completeness heuristic: fraction of expected detail keys present.
    expected_keys = ("fundamentals", "technical", "options_metrics", "narrative")
    present = sum(1 for k in expected_keys if c.get(k))
    completeness = round(present / len(expected_keys), 4)
    return claim_count, quarters_covered, completeness


# ---------------------------------------------------------------------------
# Pipeline reader (the management_credibility_project/ranking_engine outputs)
# ---------------------------------------------------------------------------

def read_pipeline_outputs(pipeline_dir: Path) -> dict[str, dict[str, Any]]:
    """Read pipeline scores keyed by ticker. Tolerates missing dir / missing
    files (the legacy dashboard is the authoritative source in v1)."""
    out: dict[str, dict[str, Any]] = {}
    if not pipeline_dir.exists():
        return out
    # Look for ranking_engine/output/*.json or company_scores.csv
    for f in pipeline_dir.glob("**/*.json"):
        try:
            blob = json.loads(f.read_text(encoding="utf-8"))
            if isinstance(blob, dict) and "ticker" in blob:
                out[blob["ticker"]] = blob
            elif isinstance(blob, list):
                for entry in blob:
                    if isinstance(entry, dict) and "ticker" in entry:
                        out.setdefault(entry["ticker"], entry)
        except (json.JSONDecodeError, OSError):
            continue
    return out
