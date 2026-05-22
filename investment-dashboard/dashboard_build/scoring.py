"""The ONLY place composite score and rank are computed.

Per PRD §9.7 (single source of truth): `app.js` may recompute as a warning
assertion but never as the displayed source. Any second computation path in
Python is a build failure.

Single responsibility: given per-company category scores and a `ScoringModel`,
return the composite scores, ranks, and priority buckets.
"""
from __future__ import annotations

from dataclasses import dataclass

from .schema import CategoryScores, ScoringModel


@dataclass(frozen=True)
class ScoredRow:
    """Output of a single composite computation."""

    ticker: str
    compositeScore: float
    rank: int
    priorityBucket: str  # High / Medium / Low / Watchlist / Avoid


def composite_score(scores: CategoryScores, model: ScoringModel) -> float:
    """Weighted average over present categories.

    Missing categories (score=None) are renormalized out so a stock with
    insufficient evidence in one lens doesn't get penalized as if it scored
    zero. The weights of the remaining categories are rescaled so they
    still sum to 1.0.

    Returns a float in [0, 100], rounded to 4 decimal places for stable
    equivalence diffs.
    """
    w = model.weights
    pairs: list[tuple[float, float]] = []  # (score, weight) for present categories
    if scores.fundamentals is not None:
        pairs.append((scores.fundamentals, w.fundamentals))
    if scores.management is not None:
        pairs.append((scores.management, w.management))
    if scores.valuation is not None:
        pairs.append((scores.valuation, w.valuation))
    if scores.technicals is not None:
        pairs.append((scores.technicals, w.technicals))
    if scores.options is not None:
        pairs.append((scores.options, w.options))

    if not pairs:
        return 0.0  # no evidence — composite is 0; UI will surface low confidence

    total_w = sum(weight for _, weight in pairs)
    if total_w == 0:
        return 0.0
    weighted = sum(score * weight for score, weight in pairs) / total_w
    # Clamp to [0, 100] defensively (input is schema-validated but be safe).
    weighted = max(0.0, min(100.0, weighted))
    return round(weighted, 4)


def priority_bucket(composite: float, model: ScoringModel) -> str:
    """Map composite ∈ [0, 100] to a priority bucket using model thresholds."""
    pb = model.priorityBuckets
    if composite >= pb.high:
        return "High"
    if composite >= pb.medium:
        return "Medium"
    if composite >= pb.low:
        return "Low"
    if composite >= pb.watchlist:
        return "Watchlist"
    return "Avoid"


def rank_companies(
    companies: list[tuple[str, CategoryScores]],
    model: ScoringModel,
) -> list[ScoredRow]:
    """Compute composite, rank, and bucket for every company in one pass.

    Ranking is stable: ties on composite are broken alphabetically by ticker
    (deterministic for equivalence-diff reproducibility).
    """
    scored = [
        (ticker, composite_score(s, model))
        for ticker, s in companies
    ]
    # Stable ordering: composite desc, then ticker asc
    scored.sort(key=lambda x: (-x[1], x[0]))
    rows = [
        ScoredRow(
            ticker=ticker,
            compositeScore=comp,
            rank=i,
            priorityBucket=priority_bucket(comp, model),
        )
        for i, (ticker, comp) in enumerate(scored, start=1)
    ]
    return rows
