"""Pydantic models that ARE the integration contract between the analysis
pipeline and the dashboard. Every emitted file validates against this schema
before it is written.

Single responsibility: define the schema, validate inputs, refuse to emit
invalid data. No business logic, no I/O.

Field names and types are normative per PRD §10. Changes here are schema
version bumps and require coordinating with the analysis pipeline.
"""
from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from .config import FLOAT_TOL, SCHEMA_VERSION

# ---------------------------------------------------------------------------
# Sub-models
# ---------------------------------------------------------------------------

class ScoringWeights(BaseModel):
    """Weights applied to category scores when computing the composite."""

    model_config = ConfigDict(extra="forbid")

    fundamentals: float = Field(ge=0, le=1)
    management:   float = Field(ge=0, le=1)
    valuation:    float = Field(ge=0, le=1)
    technicals:   float = Field(ge=0, le=1)
    options:      float = Field(ge=0, le=1)

    @model_validator(mode="after")
    def _sum_to_one(self) -> ScoringWeights:
        s = (self.fundamentals + self.management + self.valuation
             + self.technicals + self.options)
        if not math.isclose(s, 1.0, abs_tol=FLOAT_TOL):
            raise ValueError(
                f"scoringModel.weights must sum to 1.0 (within {FLOAT_TOL}); got {s}"
            )
        return self


class PriorityBuckets(BaseModel):
    """Thresholds for High/Medium/Low/Watchlist priority buckets."""

    model_config = ConfigDict(extra="forbid")

    high:      float = Field(ge=0, le=100)
    medium:    float = Field(ge=0, le=100)
    low:       float = Field(ge=0, le=100)
    watchlist: float = Field(ge=0, le=100)

    @model_validator(mode="after")
    def _monotonic(self) -> PriorityBuckets:
        if not (self.high > self.medium > self.low > self.watchlist):
            raise ValueError(
                f"priority bucket thresholds must be strictly decreasing: "
                f"high={self.high} > medium={self.medium} > low={self.low} > "
                f"watchlist={self.watchlist}"
            )
        return self


class ScoringModel(BaseModel):
    """Embedded in the top-level payload; the *only* place ranking is configured."""

    model_config = ConfigDict(extra="forbid")

    modelVersion: str
    compositeScoreScale: Literal["0-100"] = "0-100"
    rankingMethod: Literal["weighted_average"] = "weighted_average"
    compositeComputedBy: Literal["generate_data.py"] = "generate_data.py"
    weights: ScoringWeights
    weightsSumTo: float = 1.0
    priorityBuckets: PriorityBuckets
    notes: str = ""

    @field_validator("weightsSumTo")
    @classmethod
    def _weights_sum_to_one(cls, v: float) -> float:
        if not math.isclose(v, 1.0, abs_tol=FLOAT_TOL):
            raise ValueError(f"weightsSumTo must equal 1.0; got {v}")
        return v


class ConfidenceBasis(BaseModel):
    """Why confidence is what it is — *evidentiary basis*, not model certainty."""

    model_config = ConfigDict(extra="forbid")

    claimCount:       int   = Field(ge=0)
    quartersCovered:  int   = Field(ge=0)
    dataCompleteness: float = Field(ge=0, le=1)


class Confidence(BaseModel):
    """Confidence object. Per PRD §9.7.1, score reflects evidentiary depth."""

    model_config = ConfigDict(extra="forbid")

    score: float = Field(ge=0, le=1)
    basis: ConfidenceBasis
    notes: str = ""


class CategoryScores(BaseModel):
    """Per-company category scores. Missing categories must be explicit `null`.

    A score of `None` flows through to UI as the documented missing-value
    convention (PRD §11.3). Zero is never a substitute for missing.
    """

    model_config = ConfigDict(extra="forbid")

    fundamentals: float | None = Field(default=None, ge=0, le=100)
    management:   float | None = Field(default=None, ge=0, le=100)
    valuation:    float | None = Field(default=None, ge=0, le=100)
    technicals:   float | None = Field(default=None, ge=0, le=100)
    options:      float | None = Field(default=None, ge=0, le=100)


class VerdictBreakdown(BaseModel):
    """B/H/M tallies for the per-company scoreboard."""

    model_config = ConfigDict(extra="forbid")

    beats:  int = Field(ge=0, default=0)
    hits:   int = Field(ge=0, default=0)
    misses: int = Field(ge=0, default=0)


class SourceAudit(BaseModel):
    """Provenance trail. PRD §10.2 carries-forward + pipelineRunId echo."""

    model_config = ConfigDict(extra="ignore")  # forward-compat for pipeline additions

    fundamentalsSource: str | None = None
    managementSource:   str | None = None
    valuationSource:    str | None = None
    technicalsSource:   str | None = None
    optionsSource:      str | None = None
    pipelineRunId:      str | None = None


class CompanyFundamentals(BaseModel):
    """Free-form fundamentals payload. We don't constrain inner shape v1 —
    the app renders what's here; pipeline owns the structure."""

    model_config = ConfigDict(extra="allow")


class CompanyManagement(BaseModel):
    """Management/MCS payload. Same v1 flexibility as fundamentals."""

    model_config = ConfigDict(extra="allow")


class CompanyValuation(BaseModel):
    model_config = ConfigDict(extra="allow")


class CompanyTechnicals(BaseModel):
    model_config = ConfigDict(extra="allow")


class CompanyOptions(BaseModel):
    model_config = ConfigDict(extra="allow")


class CompanyThesis(BaseModel):
    """Bull/bear/triggers narrative payload."""

    model_config = ConfigDict(extra="allow")


class Company(BaseModel):
    """One ranked company. The fields with structural meaning to the schema
    (ticker, compositeScore, rank, scores, confidence) are strictly typed;
    detail payloads are passthrough.

    Watchlist-only entries (added at the bottom of the leaderboard for tickers
    we track categorically but don't compute composite scores for) may set
    compositeScore=None, priorityBucket=None, scores=null lenses, and confidence=0.
    """

    model_config = ConfigDict(extra="forbid")

    ticker:         str = Field(min_length=1, max_length=10)
    name:           str | None = None
    sector:         str | None = None
    rank:           int = Field(ge=1)
    compositeScore: float | None = Field(default=None, ge=0, le=100)
    priorityBucket: Literal["High", "Medium", "Low", "Watchlist", "Avoid"] | None = None
    confidence:     Confidence
    scores:         CategoryScores
    verdictBreakdown: VerdictBreakdown = Field(default_factory=VerdictBreakdown)

    # Category flags (from Stocks_Category.xlsx). 'Y', 'N', or None.
    category:  str | None = None  # legacy display label (e.g. "FTMO")
    col_F:     Literal["Y", "N"] | None = None  # Fundamentals category flag
    col_J:     Literal["Y", "N"] | None = None  # J-list category flag
    col_O:     Literal["Y", "N"] | None = None  # Options category flag

    # Detail payloads — opaque to schema, owned by pipeline.
    fundamentals: CompanyFundamentals | None = None
    management:   CompanyManagement   | None = None
    valuation:    CompanyValuation    | None = None
    technicals:   CompanyTechnicals   | None = None
    options:      CompanyOptions      | None = None
    thesis:       CompanyThesis       | None = None
    sourceAudit:  SourceAudit | None  = None

    @field_validator("ticker")
    @classmethod
    def _ticker_uppercase(cls, v: str) -> str:
        if v != v.upper() or not v.isalpha():
            raise ValueError(f"ticker must be uppercase letters only; got {v!r}")
        return v


class Summary(BaseModel):
    """Header tallies derived from companies. Computed in generate_data.py."""

    model_config = ConfigDict(extra="forbid")

    totalCompanies:       int = Field(ge=0)
    highPriorityCount:    int = Field(ge=0)
    mediumPriorityCount:  int = Field(ge=0)
    lowPriorityCount:     int = Field(ge=0)
    watchlistCount:       int = Field(ge=0, default=0)
    avoidCount:           int = Field(ge=0, default=0)
    topRankedTickers:     list[str] = Field(default_factory=list)
    generatedForPeriod:   str = "Current research cycle"


# ---------------------------------------------------------------------------
# Top-level payload
# ---------------------------------------------------------------------------

class DashboardPayload(BaseModel):
    """The complete object written to `data/dashboard-data.json`.

    `schemaVersion` is the integration contract version. Major-version mismatch
    is rejected by `app.js` at load time per PRD §14.3.
    """

    model_config = ConfigDict(extra="forbid")

    schemaVersion:       str
    generatedAt:         datetime
    generatedBy:         str = "generate_data.py"
    dashboardVersion:    str
    pipelineRunId:       str = ""
    universeName:        str
    universeDescription: str
    baseCurrency:        str = "USD"

    scoringModel: ScoringModel
    summary:      Summary
    companies:    list[Company]

    @field_validator("schemaVersion")
    @classmethod
    def _major_must_match(cls, v: str) -> str:
        """Reject schema major mismatch at load time."""
        major_in = v.split(".", 1)[0]
        major_app = SCHEMA_VERSION.split(".", 1)[0]
        if major_in != major_app:
            raise ValueError(
                f"schemaVersion major {major_in} incompatible with "
                f"app major {major_app}"
            )
        return v

    @field_validator("generatedAt", mode="before")
    @classmethod
    def _parse_iso(cls, v: Any) -> datetime:
        if isinstance(v, datetime):
            return v if v.tzinfo else v.replace(tzinfo=timezone.utc)
        if isinstance(v, str):
            # Accept "Z" suffix for UTC.
            return datetime.fromisoformat(v.replace("Z", "+00:00"))
        raise TypeError(f"generatedAt must be datetime or ISO-8601 string; got {type(v)}")

    @model_validator(mode="after")
    def _rank_order_matches_composite(self) -> DashboardPayload:
        """Per PRD §9.7: rank order must match composite order (desc).
        Watchlist-only entries (compositeScore=None) are appended at the bottom
        in ticker order and are excluded from the composite-vs-rank check."""
        scored = [c for c in self.companies if c.compositeScore is not None]
        unscored = [c for c in self.companies if c.compositeScore is None]
        sorted_by_composite = sorted(
            scored, key=lambda c: (-c.compositeScore, c.ticker)  # type: ignore[operator]
        )
        for i, c in enumerate(sorted_by_composite, start=1):
            if c.rank != i:
                raise ValueError(
                    f"rank order does not match composite order: "
                    f"{c.ticker} has rank={c.rank} but composite-desc position {i}"
                )
        # Unscored entries should sit at ranks N+1..N+M in ticker order.
        n = len(scored)
        for j, c in enumerate(sorted(unscored, key=lambda c: c.ticker), start=1):
            expected = n + j
            if c.rank != expected:
                raise ValueError(
                    f"unscored ticker {c.ticker} has rank={c.rank}; "
                    f"expected {expected} (unscored entries occupy bottom ranks in ticker order)"
                )
        return self

    @model_validator(mode="after")
    def _unique_tickers(self) -> DashboardPayload:
        seen: set[str] = set()
        for c in self.companies:
            if c.ticker in seen:
                raise ValueError(f"duplicate ticker in payload: {c.ticker}")
            seen.add(c.ticker)
        return self
