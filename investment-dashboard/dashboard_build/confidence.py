"""Compute the `Confidence` object for a company from its evidentiary basis.

Per PRD §9.7.1: confidence reflects *how much evidence* backs the scores
(claim count, quarters covered, data completeness), NOT model certainty.
A high composite paired with low confidence must be visually distinguishable
from a high composite paired with high confidence.

Single responsibility: turn (claim count, quarters covered, data completeness)
into a `Confidence(score, basis, notes)`.
"""
from __future__ import annotations

from .schema import Confidence, ConfidenceBasis

# ---------------------------------------------------------------------------
# Tunable knobs. These live in code (not config.py) because they're
# methodological choices the PRD calls out as part of the documented semantic.
# ---------------------------------------------------------------------------

# A "fully credentialed" company in v1 has ≥ this many tracked claims.
TARGET_CLAIM_COUNT: int = 8
# ... and at least this many quarters of fundamentals.
TARGET_QUARTERS: int = 8
# Three drivers weighted equally per v1 — easy to defend in a methodology doc.
_W_CLAIMS, _W_QUARTERS, _W_COMPLETENESS = 1 / 3, 1 / 3, 1 / 3


def compute_confidence(
    *,
    claim_count: int,
    quarters_covered: int,
    data_completeness: float,
) -> Confidence:
    """Derive `Confidence` from evidentiary basis.

    Args:
        claim_count: number of forward-looking management claims scored.
        quarters_covered: number of fiscal quarters of fundamentals on file.
        data_completeness: fraction in [0, 1] of expected fields actually present.

    Returns:
        Confidence(score, basis, notes). `score` is in [0, 1].
    """
    if claim_count < 0:
        raise ValueError(f"claim_count must be >= 0; got {claim_count}")
    if quarters_covered < 0:
        raise ValueError(f"quarters_covered must be >= 0; got {quarters_covered}")
    if not (0.0 <= data_completeness <= 1.0):
        raise ValueError(
            f"data_completeness must be in [0, 1]; got {data_completeness}"
        )

    claim_factor    = min(claim_count / TARGET_CLAIM_COUNT, 1.0)
    quarter_factor  = min(quarters_covered / TARGET_QUARTERS, 1.0)
    completeness    = data_completeness

    raw = (
        _W_CLAIMS * claim_factor
        + _W_QUARTERS * quarter_factor
        + _W_COMPLETENESS * completeness
    )
    # Stable round so equivalence diffs don't trip on float fuzz.
    score = round(max(0.0, min(1.0, raw)), 4)

    return Confidence(
        score=score,
        basis=ConfidenceBasis(
            claimCount=claim_count,
            quartersCovered=quarters_covered,
            dataCompleteness=round(data_completeness, 4),
        ),
        notes=(
            "Confidence reflects evidentiary depth (claim count, quarters covered, "
            "data completeness), not model certainty. A high composite paired with "
            "low confidence indicates limited evidence supporting the score."
        ),
    )
