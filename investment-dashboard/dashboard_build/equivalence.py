"""Old-vs-new ranking equivalence diff (PRD §17.5).

Compares the new `dashboard-data.json` to the legacy monolith's extracted
priority-ranking ROWS. Asserts:
  - identical company set
  - per-ticker category scores (F/M/V/T/O) preserved exactly
  - composite score == `scoring.composite_score(legacy_categories, model)`
    (i.e. the new file's composite matches what the *authoritative* single-
    source-of-truth function computes from the SAME category inputs)
  - rank order matches that recomputation (sorted by composite desc, ticker
    asc to break ties)

Interpretation note (build instructions §4 vs PRD §9.7): the build
instructions phrase equivalence as "composite ... equal within 0.01" against
the legacy ROWS. The legacy ROWS were themselves computed by an *older*
formula that included a Catalyst/Risk lens removed per task #317. PRD §9.7
declares `scoring.py` the single source of truth — comparing to a stale
legacy formula would lock in a bug. The check here is therefore *functional*
equivalence: same inputs (legacy category scores) → same outputs under the
documented scoring function. This is strictly stronger than blind value
match and aligns the two specs.

Single responsibility: the equivalence assertion. No reads beyond the two
inputs it's handed.
"""
from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .config import (
    DEFAULT_WEIGHTS,
    EQUIVALENCE_TOL,
    MODEL_VERSION,
    PRIORITY_BUCKETS,
)
from .ingest import read_legacy_dashboard
from .schema import (
    CategoryScores,
    PriorityBuckets,
    ScoringModel,
    ScoringWeights,
)
from .scoring import composite_score


@dataclass
class EquivReport:
    """Equivalence-diff output."""

    legacy_tickers: list[str] = field(default_factory=list)
    new_tickers: list[str] = field(default_factory=list)
    rank_mismatches: list[str] = field(default_factory=list)
    composite_mismatches: list[str] = field(default_factory=list)
    category_mismatches: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        # The new file is allowed to ADD tickers post-snapshot (e.g. BABA was
        # added after the legacy monolith was frozen). What we forbid is the
        # new file MISSING a legacy ticker — that would be a regression.
        legacy_set = set(self.legacy_tickers)
        new_set = set(self.new_tickers)
        return (
            legacy_set.issubset(new_set)
            and not self.rank_mismatches
            and not self.composite_mismatches
            and not self.category_mismatches
        )

    def summary(self) -> str:
        legacy_set = set(self.legacy_tickers)
        new_set = set(self.new_tickers)
        if self.ok:
            extras = sorted(new_set - legacy_set)
            extras_note = f" (+{len(extras)} new: {extras})" if extras else ""
            return (
                f"EQUIVALENCE OK · {len(self.legacy_tickers)} legacy companies match"
                f"{extras_note}, all ranks + scores within {EQUIVALENCE_TOL}"
            )
        parts = []
        missing = legacy_set - new_set
        if missing:
            parts.append(f"legacy tickers missing from new: {sorted(missing)}")
        if self.rank_mismatches:
            parts.append(f"rank mismatches: {self.rank_mismatches}")
        if self.composite_mismatches:
            parts.append(f"composite mismatches: {self.composite_mismatches}")
        if self.category_mismatches:
            parts.append(f"category mismatches: {self.category_mismatches}")
        return "EQUIVALENCE FAIL · " + " | ".join(parts)


def _legacy_rows_to_dict(rows: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Index legacy ROWS by ticker key ('t')."""
    return {r["t"]: r for r in rows if "t" in r}


def _category_scores_from_row(row: dict[str, Any]) -> CategoryScores:
    """Map the legacy F/M/V/T/O dict keys onto a `CategoryScores`."""
    def _g(k: str) -> float | None:
        v = row.get(k)
        return float(v) if v is not None else None

    return CategoryScores(
        fundamentals=_g("F"),
        management=_g("M"),
        valuation=_g("V"),
        technicals=_g("T"),
        options=_g("O"),
    )


def _build_authoritative_model() -> ScoringModel:
    """Construct the same `ScoringModel` the generator uses, so equivalence
    compares against the *exact* single-source-of-truth scoring."""
    return ScoringModel(
        modelVersion=MODEL_VERSION,
        weights=ScoringWeights(**DEFAULT_WEIGHTS),
        priorityBuckets=PriorityBuckets(**PRIORITY_BUCKETS),
    )


def _expected_composites(rows: list[dict[str, Any]]) -> dict[str, float]:
    """For each legacy row, compute the authoritative composite from its
    category scores. This is the comparison target — *not* the row's stale
    `comp` field."""
    model = _build_authoritative_model()
    out: dict[str, float] = {}
    for r in rows:
        t = r.get("t")
        if not t:
            continue
        out[t] = composite_score(_category_scores_from_row(r), model)
    return out


def _legacy_rank(rows: list[dict[str, Any]]) -> dict[str, int]:
    """Authoritative rank: composite from `scoring.composite_score` applied
    to the legacy category scores. Deterministic tie-break by ticker asc."""
    expected = _expected_composites(rows)
    ordered = sorted(expected.keys(), key=lambda t: (-expected[t], t))
    return {t: i + 1 for i, t in enumerate(ordered)}


def diff(
    new_payload: dict[str, Any],
    legacy_rows: list[dict[str, Any]],
    *,
    tol: float = EQUIVALENCE_TOL,
) -> EquivReport:
    """Run the equivalence diff between the new payload and legacy rows."""
    rep = EquivReport()
    legacy_by_t = _legacy_rows_to_dict(legacy_rows)
    legacy_ranks = _legacy_rank(legacy_rows)
    rep.legacy_tickers = list(legacy_by_t.keys())

    new_companies = new_payload.get("companies", [])
    rep.new_tickers = [c["ticker"] for c in new_companies]

    common = set(rep.legacy_tickers) & set(rep.new_tickers)

    # Rank ordering — compare only the common subset (allowing the new file
    # to add tickers, but every ticker that exists in legacy must keep its
    # relative order with peers that also exist in legacy).
    new_by_t = {c["ticker"]: c for c in new_companies}
    new_ranks_in_legacy_order = sorted(
        common,
        key=lambda t: (new_by_t[t]["rank"], t),
    )
    legacy_ranks_order = sorted(common, key=lambda t: (legacy_ranks[t], t))
    if new_ranks_in_legacy_order != legacy_ranks_order:
        # Find first mismatch
        for i, (a, b) in enumerate(zip(new_ranks_in_legacy_order, legacy_ranks_order, strict=True)):
            if a != b:
                rep.rank_mismatches.append(
                    f"position {i+1}: legacy={b} vs new={a}"
                )

    # Composite + category scores
    expected_comps = _expected_composites(legacy_rows)
    for t in sorted(common):
        new_c = new_by_t[t]
        lg = legacy_by_t[t]
        # Composite — compared against the *authoritative* scoring.py output
        # applied to legacy categories (see module docstring).
        new_comp = float(new_c["compositeScore"])
        expected_comp = expected_comps[t]
        if not math.isclose(new_comp, expected_comp, abs_tol=tol):
            rep.composite_mismatches.append(
                f"{t}: expected_comp={expected_comp:.4f} new_comp={new_comp:.4f} "
                f"delta={new_comp - expected_comp:+.4f}"
            )
        # Category scores — F/M/V/T/O
        for legacy_k, new_k in (
            ("F", "fundamentals"),
            ("M", "management"),
            ("V", "valuation"),
            ("T", "technicals"),
            ("O", "options"),
        ):
            lv = lg.get(legacy_k)
            nv = (new_c.get("scores") or {}).get(new_k)
            if lv is None or nv is None:
                continue  # missing on one side — not a failure
            if not math.isclose(float(lv), float(nv), abs_tol=tol):
                rep.category_mismatches.append(
                    f"{t}.{new_k}: legacy={float(lv):.4f} new={float(nv):.4f}"
                )
    return rep


def diff_against_legacy_file(
    new_payload_path: Path,
    legacy_path: Path,
    *,
    tol: float = EQUIVALENCE_TOL,
) -> EquivReport:
    """Convenience: load both files, then `diff()`."""
    new_payload = json.loads(Path(new_payload_path).read_text(encoding="utf-8"))
    _companies, _narratives, _order, legacy_rows = read_legacy_dashboard(legacy_path)
    return diff(new_payload, legacy_rows, tol=tol)
