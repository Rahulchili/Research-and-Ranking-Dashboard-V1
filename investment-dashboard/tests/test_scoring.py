"""Composite + rank are computed deterministically; weights applied correctly;
ties broken by ticker; missing categories renormalize, not zero-fill."""
from __future__ import annotations

from dashboard_build.config import DEFAULT_WEIGHTS, PRIORITY_BUCKETS
from dashboard_build.schema import (
    CategoryScores,
    PriorityBuckets,
    ScoringModel,
    ScoringWeights,
)
from dashboard_build.scoring import composite_score, priority_bucket, rank_companies


def _model() -> ScoringModel:
    return ScoringModel(
        modelVersion="1.0.0",
        weights=ScoringWeights(**DEFAULT_WEIGHTS),
        priorityBuckets=PriorityBuckets(**PRIORITY_BUCKETS),
    )


def test_known_inputs_known_composite() -> None:
    s = CategoryScores(fundamentals=100, management=100, valuation=100, technicals=100, options=100)
    assert composite_score(s, _model()) == 100.0
    s2 = CategoryScores(fundamentals=0, management=0, valuation=0, technicals=0, options=0)
    assert composite_score(s2, _model()) == 0.0
    # 80*.25 + 70*.15 + 60*.20 + 50*.20 + 40*.20 = 20+10.5+12+10+8 = 60.5
    s3 = CategoryScores(fundamentals=80, management=70, valuation=60, technicals=50, options=40)
    assert composite_score(s3, _model()) == 60.5


def test_missing_category_is_renormalized_not_zeroed() -> None:
    """If 'options' is None, the other weights rescale to sum to 1."""
    s = CategoryScores(fundamentals=80, management=80, valuation=80, technicals=80, options=None)
    # Sum of present weights: 0.25 + 0.15 + 0.20 + 0.20 = 0.80
    # Composite = 80 * (sum_present_weights) / sum_present_weights = 80
    assert composite_score(s, _model()) == 80.0


def test_all_missing_returns_zero() -> None:
    assert composite_score(CategoryScores(), _model()) == 0.0


def test_priority_bucket_thresholds() -> None:
    m = _model()
    assert priority_bucket(85, m) == "High"
    assert priority_bucket(84.99, m) == "Medium"
    assert priority_bucket(70, m) == "Medium"
    assert priority_bucket(69.99, m) == "Low"
    assert priority_bucket(55, m) == "Low"
    assert priority_bucket(54.99, m) == "Watchlist"
    assert priority_bucket(40, m) == "Watchlist"
    assert priority_bucket(39.99, m) == "Avoid"


def test_rank_companies_orders_by_composite_desc() -> None:
    s_high = CategoryScores(fundamentals=90, management=90, valuation=90, technicals=90, options=90)
    s_mid  = CategoryScores(fundamentals=60, management=60, valuation=60, technicals=60, options=60)
    s_low  = CategoryScores(fundamentals=30, management=30, valuation=30, technicals=30, options=30)
    rows = rank_companies([("MID", s_mid), ("HIGH", s_high), ("LOW", s_low)], _model())
    assert [r.ticker for r in rows] == ["HIGH", "MID", "LOW"]
    assert [r.rank for r in rows] == [1, 2, 3]


def test_tie_break_is_alphabetical_by_ticker() -> None:
    s = CategoryScores(fundamentals=80, management=80, valuation=80, technicals=80, options=80)
    rows = rank_companies([("ZZZ", s), ("AAA", s), ("MMM", s)], _model())
    assert [r.ticker for r in rows] == ["AAA", "MMM", "ZZZ"]
    assert all(r.compositeScore == 80.0 for r in rows)


def test_weights_applied_correctly_when_only_options_present() -> None:
    s = CategoryScores(options=50)
    # Only options has weight ~0.20; renormalized to 1.0, so composite=50.
    assert composite_score(s, _model()) == 50.0
