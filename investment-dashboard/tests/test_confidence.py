"""Confidence reflects evidentiary basis (claim count × quarters × completeness),
not model certainty. Low-evidence companies are distinguishable from high-evidence."""
from __future__ import annotations

import pytest

from dashboard_build.confidence import compute_confidence


def test_full_evidence_gives_score_one() -> None:
    c = compute_confidence(claim_count=8, quarters_covered=8, data_completeness=1.0)
    assert c.score == 1.0


def test_zero_evidence_gives_score_zero() -> None:
    c = compute_confidence(claim_count=0, quarters_covered=0, data_completeness=0.0)
    assert c.score == 0.0


def test_half_evidence_gives_score_half() -> None:
    c = compute_confidence(claim_count=4, quarters_covered=4, data_completeness=0.5)
    # claim_factor = 0.5, quarter_factor = 0.5, completeness = 0.5
    assert c.score == 0.5


def test_low_evidence_is_distinguishable_from_high() -> None:
    low = compute_confidence(claim_count=1, quarters_covered=2, data_completeness=0.2)
    high = compute_confidence(claim_count=8, quarters_covered=8, data_completeness=0.95)
    assert low.score < high.score
    assert low.score < 0.5
    assert high.score > 0.75


def test_basis_is_carried_through() -> None:
    c = compute_confidence(claim_count=5, quarters_covered=6, data_completeness=0.8)
    assert c.basis.claimCount == 5
    assert c.basis.quartersCovered == 6
    assert c.basis.dataCompleteness == 0.8


def test_score_capped_at_one_when_inputs_overshoot() -> None:
    c = compute_confidence(claim_count=100, quarters_covered=100, data_completeness=1.0)
    assert 0.0 <= c.score <= 1.0


def test_invalid_inputs_raise() -> None:
    with pytest.raises(ValueError):
        compute_confidence(claim_count=-1, quarters_covered=0, data_completeness=0.5)
    with pytest.raises(ValueError):
        compute_confidence(claim_count=0, quarters_covered=-1, data_completeness=0.5)
    with pytest.raises(ValueError):
        compute_confidence(claim_count=0, quarters_covered=0, data_completeness=1.5)
