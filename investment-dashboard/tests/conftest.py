"""Shared pytest fixtures."""
from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest

# Make the dashboard_build package importable when pytest runs from any dir.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


from dashboard_build.config import DEFAULT_WEIGHTS, PRIORITY_BUCKETS, SCHEMA_VERSION  # noqa: E402
from dashboard_build.schema import (  # noqa: E402
    CategoryScores,
    Company,
    Confidence,
    ConfidenceBasis,
    DashboardPayload,
    PriorityBuckets,
    ScoringModel,
    ScoringWeights,
    Summary,
    VerdictBreakdown,
)


@pytest.fixture
def good_model() -> ScoringModel:
    return ScoringModel(
        modelVersion="1.0.0",
        weights=ScoringWeights(**DEFAULT_WEIGHTS),
        priorityBuckets=PriorityBuckets(**PRIORITY_BUCKETS),
    )


@pytest.fixture
def good_company(good_model: ScoringModel) -> Company:
    return Company(
        ticker="AAPL",
        rank=1,
        compositeScore=78.42,
        priorityBucket="Medium",
        confidence=Confidence(
            score=0.75,
            basis=ConfidenceBasis(claimCount=8, quartersCovered=8, dataCompleteness=0.9),
        ),
        scores=CategoryScores(
            fundamentals=80.0, management=85.0, valuation=70.0,
            technicals=80.0, options=75.0,
        ),
        verdictBreakdown=VerdictBreakdown(beats=6, hits=2, misses=0),
    )


@pytest.fixture
def good_payload(good_model: ScoringModel, good_company: Company) -> DashboardPayload:
    return DashboardPayload(
        schemaVersion=SCHEMA_VERSION,
        generatedAt=datetime(2026, 5, 16, tzinfo=timezone.utc),
        dashboardVersion="1.0.0",
        pipelineRunId="run-123",
        universeName="Test Universe",
        universeDescription="fixture",
        scoringModel=good_model,
        summary=Summary(
            totalCompanies=1, highPriorityCount=0, mediumPriorityCount=1, lowPriorityCount=0,
            topRankedTickers=["AAPL"],
        ),
        companies=[good_company],
    )
