"""Schema acceptance: valid payload passes; missing required field fails;
major-version mismatch is rejected."""
from __future__ import annotations

from datetime import timezone

import pytest
from pydantic import ValidationError

from dashboard_build.schema import (
    CategoryScores,
    Company,
    Confidence,
    ConfidenceBasis,
    DashboardPayload,
    PriorityBuckets,
    ScoringModel,
    ScoringWeights,
)

# Python 3.10 sandbox compatibility: `datetime.UTC` was added in 3.11.
UTC = timezone.utc


def test_valid_payload_passes(good_payload: DashboardPayload) -> None:
    assert good_payload.schemaVersion == "1.0.0"
    assert len(good_payload.companies) == 1
    assert good_payload.companies[0].rank == 1


def test_missing_required_field_fails() -> None:
    with pytest.raises(ValidationError):
        Company(  # type: ignore[call-arg]
            ticker="X",
            # rank missing
            compositeScore=50,
            priorityBucket="Low",
            confidence=Confidence(
                score=0.5,
                basis=ConfidenceBasis(claimCount=1, quartersCovered=1, dataCompleteness=0.5),
            ),
            scores=CategoryScores(),
        )


def test_major_version_mismatch_rejected(good_payload: DashboardPayload) -> None:
    blob = good_payload.model_dump(mode="python")
    blob["schemaVersion"] = "2.0.0"
    with pytest.raises(ValidationError):
        DashboardPayload.model_validate(blob)


def test_weights_must_sum_to_one() -> None:
    with pytest.raises(ValidationError):
        ScoringWeights(fundamentals=0.5, management=0.5, valuation=0.5, technicals=0, options=0)


def test_priority_buckets_must_be_strictly_decreasing() -> None:
    with pytest.raises(ValidationError):
        PriorityBuckets(high=70, medium=70, low=55, watchlist=40)


def test_ticker_must_be_uppercase() -> None:
    with pytest.raises(ValidationError):
        Company(
            ticker="aapl",
            rank=1,
            compositeScore=50,
            priorityBucket="Low",
            confidence=Confidence(
                score=0.5,
                basis=ConfidenceBasis(claimCount=1, quartersCovered=1, dataCompleteness=0.5),
            ),
            scores=CategoryScores(),
        )


def test_duplicate_tickers_rejected(good_model: ScoringModel) -> None:
    from datetime import datetime

    from dashboard_build.schema import Summary, VerdictBreakdown
    c = Company(
        ticker="AAPL", rank=1, compositeScore=80, priorityBucket="Medium",
        confidence=Confidence(score=0.5, basis=ConfidenceBasis(claimCount=1, quartersCovered=1, dataCompleteness=0.5)),
        scores=CategoryScores(), verdictBreakdown=VerdictBreakdown(),
    )
    c2 = c.model_copy(update={"rank": 2, "compositeScore": 70.0})
    with pytest.raises(ValidationError):
        DashboardPayload(
            schemaVersion="1.0.0", generatedAt=datetime(2026, 5, 16, tzinfo=UTC),
            dashboardVersion="1.0.0", universeName="t", universeDescription="t",
            scoringModel=good_model,
            summary=Summary(totalCompanies=2, highPriorityCount=0, mediumPriorityCount=2, lowPriorityCount=0),
            companies=[c, c2],
        )


def test_rank_order_must_match_composite(good_model: ScoringModel) -> None:
    """Rank 1 must correspond to highest composite."""
    from datetime import datetime

    from dashboard_build.schema import Summary, VerdictBreakdown
    cA = Company(
        ticker="AAA", rank=1, compositeScore=50.0, priorityBucket="Low",  # wrong: lower score got rank 1
        confidence=Confidence(score=0.5, basis=ConfidenceBasis(claimCount=1, quartersCovered=1, dataCompleteness=0.5)),
        scores=CategoryScores(), verdictBreakdown=VerdictBreakdown(),
    )
    cB = Company(
        ticker="BBB", rank=2, compositeScore=80.0, priorityBucket="Medium",
        confidence=Confidence(score=0.5, basis=ConfidenceBasis(claimCount=1, quartersCovered=1, dataCompleteness=0.5)),
        scores=CategoryScores(), verdictBreakdown=VerdictBreakdown(),
    )
    with pytest.raises(ValidationError):
        DashboardPayload(
            schemaVersion="1.0.0", generatedAt=datetime(2026, 5, 16, tzinfo=UTC),
            dashboardVersion="1.0.0", universeName="t", universeDescription="t",
            scoringModel=good_model,
            summary=Summary(totalCompanies=2, highPriorityCount=0, mediumPriorityCount=1, lowPriorityCount=1),
            companies=[cA, cB],
        )
