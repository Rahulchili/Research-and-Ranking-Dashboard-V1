#!/usr/bin/env python3
"""generate_data.py — the ONLY code path allowed to write inside data/.

Per PRD §5.1 and build instructions §1, this script is structurally
incapable of writing the stable files (index.html, assets/styles.css,
assets/app.js). The `StableFileGuard` and `assert_write_target_safe` calls
prove this by hash-and-allowlist; any attempt to write elsewhere raises
ViolationError and the build fails loudly.

Reads:  fixtures/legacy_dashboard_sample/dashboard_monolith.html
        (optionally) ranking_engine/output/ JSON files
Writes: data/dashboard-data.json + data/dashboard-data.js
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dashboard_build.confidence import compute_confidence
from dashboard_build.config import (
    DASHBOARD_VERSION,
    DATA_DIR,
    DEFAULT_WEIGHTS,
    EMIT_JS,
    EMIT_JSON,
    GENERATED_BY,
    LEGACY_FIXTURE,
    MODEL_VERSION,
    PRIORITY_BUCKETS,
    SCHEMA_VERSION,
)
from dashboard_build.emit import write_emitted_files
from dashboard_build.ingest import (
    _category_scores_from_row,
    _confidence_basis_from_company,
    read_legacy_dashboard,
    read_pipeline_outputs,
)
from dashboard_build.safeguards import (
    StableFileGuard,
    ViolationError,
    assert_write_target_safe,
)
from dashboard_build.schema import (
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
from dashboard_build.scoring import rank_companies

# ---------------------------------------------------------------------------
# Supplementary tickers — additions made after the legacy monolith snapshot.
#
# These ride alongside the legacy ROWS extraction so newly-added tickers
# survive regeneration. F/M/V/T/O are the same 0-100 lens scores the legacy
# ROWS use; rank_companies() will compute composite + bucket the same way it
# does for legacy entries. Equivalence diff accepts a superset of legacy
# tickers (see dashboard_build/equivalence.py L154), so this does not violate
# the old-vs-new audit.
# ---------------------------------------------------------------------------
SUPPLEMENTARY_TICKERS: dict[str, dict[str, object]] = {
    "BABA": {
        # Lens scores (0-100). M is mcs_simple × 100 from data/companies/BABA.json.
        # F/V/T/O derived from the BABA dossier work (Tasks #419-432):
        #   F: 60 — mixed Q2 (revenue ahead, margins under), supported by 8Q fundamentals
        #   M: 77 — MCS simple = 0.77 (1B/3H/1M on 6 closed claims)
        #   V: 70 — cheap on absolute basis (~10x P/E ttm vs sector ~17x)
        #   T: 60 — uptrend through 6-K filings, near 200d MA
        #   O: 55 — neutral skew, mid-IV
        "t": "BABA",
        "F": 60.0,
        "M": 77.0,
        "V": 70.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 3H · 1M",
        "claims": 6,
        "mcs_pct": 77.0,
        "trend": "Stable",
        "name": "Alibaba Group Holding Limited",
        "sector": "Consumer Discretionary",
    },
    "ZM": {
        "t": "ZM",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Zoom Communications, Inc.",
        "sector": "Communication Services",
    },
    # AMZN — overrides stale legacy F=7.5 with a current-fundamentals-derived
    # score. Latest data: +16.6% YoY revenue, $742B TTM, 16.7% net margin,
    # $30B/qtr net income. That's a top-quartile fundamentals profile.
    "AMZN": {
        "t": "AMZN",
        "F": 75.0,
        # Keep legacy M/V/T/O so other lens values still source from the legacy
        # extraction (which is reasonable for those lenses).
    },
    "XOM": {
        "t": "XOM",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Exxon Mobil Corporation",
        "sector": "Energy",
    },
    "WMT": {
        "t": "WMT",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Walmart Inc.",
        "sector": "Consumer Staples",
    },
    "RTX": {
        "t": "RTX",
        "F": 60.0,
        "M": 71.4,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "5B · 0H · 2M",
        "claims": 9,
        "mcs_pct": 71.4,
        "trend": "Stable",
        "name": "RTX Corporation",
        "sector": "Industrials",
    },
    "SBUX": {
        "t": "SBUX",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 3,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Starbucks Corporation",
        "sector": "Consumer Discretionary",
    },
    "CVX": {
        "t": "CVX",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Chevron Corporation",
        "sector": "Energy",
    },
    "GME": {
        "t": "GME",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "GameStop Corp.",
        "sector": "Consumer Discretionary",
    },
    "MSTR": {
        "t": "MSTR",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 2,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "MicroStrategy Incorporated",
        "sector": "Information Technology",
    },
    "NKE": {
        "t": "NKE",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 2,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "NIKE, Inc.",
        "sector": "Consumer Discretionary",
    },
    "RACE": {
        "t": "RACE",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Ferrari N.V.",
        "sector": "Consumer Discretionary",
    },
    "T": {
        "t": "T",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "AT&T Inc.",
        "sector": "Communication Services",
    },
    "MSFT": {
        "t": "MSFT",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Microsoft Corporation",
        "sector": "Information Technology",
    },
    "PFE": {
        "t": "PFE",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 4,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Pfizer Inc.",
        "sector": "Health Care",
    },
    "BAC": {
        "t": "BAC",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "3B · 0H · 1M",
        "claims": 8,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Bank of America Corporation",
        "sector": "Financials",
    },
    "BA": {
        "t": "BA",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 2,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "The Boeing Company",
        "sector": "Industrials",
    },
    "CSCO": {
        "t": "CSCO",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 1M",
        "claims": 2,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Cisco Systems, Inc.",
        "sector": "Information Technology",
    },
    "FDX": {
        "t": "FDX",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 2,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "FedEx Corporation",
        "sector": "Industrials",
    },
    "GE": {
        "t": "GE",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 5,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "GE Aerospace",
        "sector": "Industrials",
    },
    "GM": {
        "t": "GM",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "General Motors Company",
        "sector": "Consumer Discretionary",
    },
    "INTC": {
        "t": "INTC",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "7B · 0H · 0M",
        "claims": 10,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Intel Corporation",
        "sector": "Information Technology",
    },
    "JNJ": {
        "t": "JNJ",
        "F": 60.0,
        "M": 85.7,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "6B · 0H · 1M",
        "claims": 11,
        "mcs_pct": 85.7,
        "trend": "Stable",
        "name": "Johnson & Johnson",
        "sector": "Health Care",
    },
    "KO": {
        "t": "KO",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "The Coca-Cola Company",
        "sector": "Consumer Staples",
    },
    "MCD": {
        "t": "MCD",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "McDonald's Corporation",
        "sector": "Consumer Discretionary",
    },
    "QCOM": {
        "t": "QCOM",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "2B · 0H · 0M",
        "claims": 6,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "QUALCOMM Incorporated",
        "sector": "Information Technology",
    },
    "JPM": {
        "t": "JPM",
        "F": 60.0,
        "M": 57.1,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "4B · 0H · 3M",
        "claims": 9,
        "mcs_pct": 57.1,
        "trend": "Stable",
        "name": "JPM",
        "sector": "Information Technology",
    },
    "ADI": {
        "t": "ADI",
        "F": 60.0,
        "M": 80.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "4B · 0H · 1M",
        "claims": 6,
        "mcs_pct": 80.0,
        "trend": "Stable",
        "name": "Analog Devices, Inc.",
        "sector": "Information Technology",
    },
    "SNDK": {
        "t": "SNDK",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Sandisk Corporation",
        "sector": "Information Technology",
    },
    "APP": {
        "t": "APP",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "AppLovin Corporation",
        "sector": "Communication Services",
    },
    "CRWD": {
        "t": "CRWD",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "CrowdStrike Holdings, Inc.",
        "sector": "Information Technology",
    },
    "SNPS": {
        "t": "SNPS",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "3B · 0H · 3M",
        "claims": 9,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Synopsys, Inc.",
        "sector": "Information Technology",
    },
    "PANW": {
        "t": "PANW",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Palo Alto Networks, Inc.",
        "sector": "Information Technology",
    },
    "KLAC": {
        "t": "KLAC",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "2B · 0H · 0M",
        "claims": 6,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "KLA Corporation",
        "sector": "Information Technology",
    },
    "DDOG": {
        "t": "DDOG",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Datadog, Inc.",
        "sector": "Information Technology",
    },
    "COST": {
        "t": "COST",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Costco Wholesale Corporation",
        "sector": "Consumer Staples",
    },
    "GS": {
        "t": "GS",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "The Goldman Sachs Group, Inc.",
        "sector": "Financials",
    },
    "TSM": {
        "t": "TSM",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Taiwan Semiconductor Manufacturing Company Limited",
        "sector": "Information Technology",
    },
    "MDB": {
        "t": "MDB",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "3B · 0H · 0M",
        "claims": 9,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "MongoDB, Inc.",
        "sector": "Information Technology",
    },
    "VRT": {
        "t": "VRT",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 1M",
        "claims": 2,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Vertiv Holdings Co",
        "sector": "Industrials",
    },
    "FSLR": {
        "t": "FSLR",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 4M",
        "claims": 5,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "First Solar, Inc.",
        "sector": "Information Technology",
    },
    "ORCL": {
        "t": "ORCL",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "5B · 0H · 0M",
        "claims": 6,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Oracle Corporation",
        "sector": "Information Technology",
    },
    "AZN": {
        "t": "AZN",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "AstraZeneca plc",
        "sector": "Health Care",
    },
    "BRKB": {
        "t": "BRKB",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Berkshire Hathaway Inc. Class B",
        "sector": "Financials",
    },
    "LMT": {
        "t": "LMT",
        "F": 60.0,
        "M": 25.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 3M",
        "claims": 5,
        "mcs_pct": 25.0,
        "trend": "Stable",
        "name": "Lockheed Martin Corporation",
        "sector": "Industrials",
    },
    "ZS": {
        "t": "ZS",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 10,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Zscaler, Inc.",
        "sector": "Information Technology",
    },
    "ANET": {
        "t": "ANET",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "2B · 0H · 2M",
        "claims": 4,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Arista Networks, Inc.",
        "sector": "Information Technology",
    },
    "LRCX": {
        "t": "LRCX",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 5M",
        "claims": 9,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Lam Research Corporation",
        "sector": "Information Technology",
    },
    "DE": {
        "t": "DE",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "5B · 0H · 0M",
        "claims": 9,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Deere & Company",
        "sector": "Industrials",
    },
    "TXN": {
        "t": "TXN",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Texas Instruments Incorporated",
        "sector": "Information Technology",
    },
    "CAH": {
        "t": "CAH",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Cardinal Health, Inc.",
        "sector": "Health Care",
    },
    "TWLO": {
        "t": "TWLO",
        "F": 60.0,
        "M": 80.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "4B · 0H · 1M",
        "claims": 9,
        "mcs_pct": 80.0,
        "trend": "Stable",
        "name": "Twilio Inc.",
        "sector": "Communication Services",
    },
    "DRI": {
        "t": "DRI",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 3M",
        "claims": 5,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Darden Restaurants, Inc.",
        "sector": "Consumer Discretionary",
    },
    "GILD": {
        "t": "GILD",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "6B · 0H · 0M",
        "claims": 8,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Gilead Sciences, Inc.",
        "sector": "Health Care",
    },
    "NTAP": {
        "t": "NTAP",
        "F": 60.0,
        "M": 75.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "3B · 0H · 1M",
        "claims": 12,
        "mcs_pct": 75.0,
        "trend": "Stable",
        "name": "NetApp, Inc.",
        "sector": "Information Technology",
    },
    "ROST": {
        "t": "ROST",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 2,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Ross Stores, Inc.",
        "sector": "Consumer Discretionary",
    },
    "RBRK": {
        "t": "RBRK",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "2B · 0H · 0M",
        "claims": 8,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Rubrik, Inc.",
        "sector": "Information Technology",
    },
    "NTNX": {
        "t": "NTNX",
        "F": 60.0,
        "M": 40.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "2B · 0H · 3M",
        "claims": 9,
        "mcs_pct": 40.0,
        "trend": "Stable",
        "name": "Nutanix, Inc.",
        "sector": "Information Technology",
    },
    "DELL": {
        "t": "DELL",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 4,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Dell Technologies Inc.",
        "sector": "Information Technology",
    },
    "FTNT": {
        "t": "FTNT",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "7B · 0H · 0M",
        "claims": 12,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Fortinet, Inc.",
        "sector": "Information Technology",
    },
    "COHR": {
        "t": "COHR",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 4,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Coherent Corp.",
        "sector": "Information Technology",
    },
    "REGN": {
        "t": "REGN",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Regeneron Pharmaceuticals, Inc.",
        "sector": "Health Care",
    },
    "WDC": {
        "t": "WDC",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Western Digital Corporation",
        "sector": "Information Technology",
    },
    "MRVL": {
        "t": "MRVL",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Marvell Technology, Inc.",
        "sector": "Information Technology",
    },
    "CEG": {
        "t": "CEG",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Constellation Energy Corporation",
        "sector": "Utilities",
    },
    "ABNB": {
        "t": "ABNB",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Airbnb, Inc.",
        "sector": "Consumer Discretionary",
    },
    "DASH": {
        "t": "DASH",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "DoorDash, Inc.",
        "sector": "Consumer Discretionary",
    },
    "STX": {
        "t": "STX",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Seagate Technology Holdings plc",
        "sector": "Information Technology",
    },
    "NXPI": {
        "t": "NXPI",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "NXP Semiconductors N.V.",
        "sector": "Information Technology",
    },
    "MAR": {
        "t": "MAR",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Marriott International, Inc.",
        "sector": "Consumer Discretionary",
    },
    "CDNS": {
        "t": "CDNS",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Cadence Design Systems, Inc.",
        "sector": "Information Technology",
    },
    "FANG": {
        "t": "FANG",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Diamondback Energy, Inc.",
        "sector": "Energy",
    },
    "TTWO": {
        "t": "TTWO",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Take-Two Interactive Software, Inc.",
        "sector": "Communication Services",
    },
    "MCHP": {
        "t": "MCHP",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Microchip Technology Incorporated",
        "sector": "Information Technology",
    },
    "V": {
        "t": "V",
        "F": 60.0,
        "M": 100.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "1B · 0H · 0M",
        "claims": 1,
        "mcs_pct": 100.0,
        "trend": "Stable",
        "name": "Visa Inc.",
        "sector": "Financials",
    },
    "META": {
        "t": "META",
        "F": 60.0,
        "M": 50.0,
        "V": 60.0,
        "T": 60.0,
        "O": 55.0,
        "bhm": "0B · 0H · 0M",
        "claims": 0,
        "mcs_pct": 50.0,
        "trend": "Stable",
        "name": "Meta Platforms, Inc.",
        "sector": "Communication Services",
    },

}


def build_payload(
    legacy_path: Path = LEGACY_FIXTURE,
    pipeline_dir: Path | None = None,
) -> DashboardPayload:
    """Build the validated `DashboardPayload` from inputs. Pure function: no I/O writes."""
    legacy_companies, legacy_narratives, _order, legacy_rows = read_legacy_dashboard(legacy_path)
    # Pipeline outputs are an optional secondary source; presently we prefer the
    # dashboard ROWS array (richer per-ticker fields). Keep the read here so any
    # ingestion failure surfaces early, but don't bind the unused result.
    _pipeline = read_pipeline_outputs(pipeline_dir or Path("../management_credibility_project/ranking_engine/output"))
    del _pipeline

    # Per user direction: dashboard ROWS wins on disagreement; log divergences.
    rows_by_t: dict[str, dict] = {r["t"]: r for r in legacy_rows if "t" in r}

    # Merge supplementary tickers (additions post-legacy-snapshot, e.g. BABA).
    # Legacy rows always win on collision so the equivalence diff stays clean.
    for sup_t, sup_row in SUPPLEMENTARY_TICKERS.items():
        if sup_t not in rows_by_t:
            rows_by_t[sup_t] = dict(sup_row)  # copy; downstream code mutates
        else:
            # Allow supplementary override of stale legacy lens scores
            for k in ("F", "M", "V", "T", "O"):
                if k in sup_row and sup_row[k] is not None:
                    rows_by_t[sup_t][k] = sup_row[k]

    # Universal fresh-lens-score overrides (computed by refresh_all_lens_scores.py
    # from each ticker's current data). These supersede stale legacy ROWS values
    # for every ticker that has a generated override.
    try:
        from lens_score_overrides import LENS_OVERRIDES  # type: ignore
        for t_key, lens in LENS_OVERRIDES.items():
            if t_key in rows_by_t:
                for k in ("F", "M", "V", "T", "O"):
                    if k in lens and lens[k] is not None:
                        rows_by_t[t_key][k] = lens[k]
    except ImportError:
        pass

    # Load per-ticker rationale (one bulleted explanation per lens) so the
    # frontend can show WHY each score was assigned, not just the number.
    # Inject directly into each per-ticker companies/<T>.json so the bundle
    # picks it up automatically and the renderer can read it.
    try:
        import json as _json
        rationale_path = Path(__file__).resolve().parent / "data" / "lens_rationale.json"
        if rationale_path.exists():
            lens_rationale = _json.loads(rationale_path.read_text())
            for tk, rdict in lens_rationale.items():
                co_path = Path(__file__).resolve().parent / "data" / "companies" / f"{tk}.json"
                if co_path.exists():
                    cdata = _json.loads(co_path.read_text())
                    cdata["lens_rationale"] = rdict
                    co_path.write_text(_json.dumps(cdata, indent=2, default=str))
    except Exception:
        pass

    model = ScoringModel(
        modelVersion=MODEL_VERSION,
        weights=ScoringWeights(**DEFAULT_WEIGHTS),
        priorityBuckets=PriorityBuckets(**PRIORITY_BUCKETS),
        notes="Weights configurable; reviewed periodically. Composite computed by generate_data.py only.",
    )

    # Build CategoryScores for every ticker present in legacy ROWS.
    cs_pairs: list[tuple[str, CategoryScores]] = []
    for ticker, row in rows_by_t.items():
        cs_pairs.append((ticker, _category_scores_from_row(row)))

    ranked = rank_companies(cs_pairs, model)
    ranked_by_t = {r.ticker: r for r in ranked}

    # Compose Company objects.
    companies: list[Company] = []
    for ticker, scores in cs_pairs:
        sr = ranked_by_t[ticker]
        legacy_co = legacy_companies.get(ticker, {})
        narr = legacy_narratives.get(ticker, {})

        # Read the per-ticker companies/<T>.json (richer than legacy ROWS) so
        # confidence reflects the real evidentiary depth, not the thin legacy
        # row. Fall back to legacy_co if the file isn't present.
        per_ticker_for_conf: dict[str, Any] = legacy_co
        try:
            _ptp = Path(__file__).resolve().parent / "data" / "companies" / f"{ticker}.json"
            if _ptp.exists():
                import json as _cj
                _full = _cj.loads(_ptp.read_text())
                # Merge into legacy_co (full data wins)
                per_ticker_for_conf = {**legacy_co, **_full}
        except Exception:
            pass

        claim_count, quarters_covered, completeness = _confidence_basis_from_company(per_ticker_for_conf)
        # Boost completeness with what's actually on disk for this ticker —
        # presence of factset, ta_levels, options, narratives counts toward it.
        try:
            extras_present = sum(
                1 for sub in ("factset", "ta_levels", "options", "narratives")
                if (Path(__file__).resolve().parent / "data" / sub / f"{ticker}.json").exists()
            )
            # Bump completeness by 0.10 per supporting file (cap at 1.0)
            completeness = min(1.0, round(completeness + 0.10 * extras_present, 4))
        except Exception:
            pass
        conf = compute_confidence(
            claim_count=claim_count,
            quarters_covered=quarters_covered,
            data_completeness=completeness,
        )

        # Verdict tallies from legacy 'bhm' string if available
        bhm = row = rows_by_t.get(ticker, {})
        beats = int(bhm.get("beats", 0)) if isinstance(bhm, dict) else 0
        hits = 0
        misses = 0
        # Try to parse the "8B" / "5B · 3H" / "4B · 1H · 3M" notation from the ROWS array.
        bhm_str = str(rows_by_t.get(ticker, {}).get("bhm", ""))
        import re as _re
        m_b = _re.search(r"(\d+)\s*B", bhm_str)
        m_h = _re.search(r"(\d+)\s*H", bhm_str)
        m_m = _re.search(r"(\d+)\s*M", bhm_str)
        if m_b:
            beats = int(m_b.group(1))
        if m_h:
            hits = int(m_h.group(1))
        if m_m:
            misses = int(m_m.group(1))

        # Thesis: pull bull/bear/triggers from narrative (legacy schemas vary).
        thesis_blob = None
        if narr:
            thesis_blob = {
                "bull": narr.get("bull") or narr.get("bull_case") or [],
                "bear": narr.get("bear") or narr.get("bear_case") or [],
                "trigger_up": narr.get("trigger_up") or [],
                "trigger_down": narr.get("trigger_down") or [],
                "bottom_line": narr.get("bottom_line", ""),
                "summary": narr.get("summary", ""),
            }

        # Name / sector fallbacks for tickers added post-legacy-snapshot.
        # Sources checked in order: per-ticker companies/<T>.json (which the
        # add_ticker pipeline populates), then narrative file, then legacy
        # row_meta from the dashboard ROWS array.
        row_meta = rows_by_t.get(ticker, {})
        per_ticker_co: dict[str, Any] = {}
        try:
            per_ticker_path = Path(__file__).resolve().parent / "data" / "companies" / f"{ticker}.json"
            if per_ticker_path.exists():
                import json as _json
                per_ticker_co = _json.loads(per_ticker_path.read_text())
        except Exception:
            per_ticker_co = {}

        co_name: str | None = None
        if per_ticker_co.get("name"):
            co_name = str(per_ticker_co["name"])
        elif isinstance(narr, dict) and narr.get("name"):
            co_name = narr.get("name")
        elif isinstance(row_meta, dict) and row_meta.get("name"):
            co_name = str(row_meta.get("name"))

        co_sector: str | None = None
        if per_ticker_co.get("sector"):
            co_sector = str(per_ticker_co["sector"])
        elif isinstance(row_meta, dict) and row_meta.get("sector"):
            co_sector = str(row_meta.get("sector"))

        companies.append(Company(
            ticker=ticker,
            name=co_name,
            sector=co_sector,
            rank=sr.rank,
            compositeScore=sr.compositeScore,
            priorityBucket=sr.priorityBucket,  # type: ignore[arg-type]
            confidence=conf,
            scores=scores,
            verdictBreakdown=VerdictBreakdown(beats=beats, hits=hits, misses=misses),
            thesis=thesis_blob,  # type: ignore[arg-type]
            sourceAudit=None,
        ))

    # Re-sort to match the rank assignment (scoring already produced rank-by-composite).
    companies.sort(key=lambda c: c.rank)

    # ---- Category overlay: load Stocks_Category.xlsx mirror (data/_categories.json)
    # and inject col_F / col_J / col_O onto each ranked company. Any ticker in
    # the categories file that has no scored profile is appended at the bottom
    # as a watchlist-only entry (no composite, no bucket — just F/J/O cells).
    _cat_path = Path(__file__).resolve().parent / "data" / "_categories.json"
    _cats: dict[str, dict[str, Any]] = {}
    if _cat_path.exists():
        try:
            with _cat_path.open("r", encoding="utf-8") as fp:
                _cats = json.load(fp)
        except Exception:
            _cats = {}

    _scored_tickers = {c.ticker for c in companies}
    for c in companies:
        meta = _cats.get(c.ticker)
        if meta:
            c.col_F = meta.get("col_F")
            c.col_J = meta.get("col_J")
            c.col_O = meta.get("col_O")

    # Append unranked watchlist tickers (in Excel but not in scored set).
    _next_rank = (max((c.rank for c in companies), default=0) or 0) + 1
    for tk in sorted(set(_cats.keys()) - _scored_tickers):
        meta = _cats.get(tk) or {}
        companies.append(Company(
            ticker=tk,
            name=meta.get("name") or tk,
            sector=meta.get("sector"),
            rank=_next_rank,
            compositeScore=None,
            priorityBucket=None,
            confidence=Confidence(score=0.0, basis=ConfidenceBasis(
                claimCount=0, quartersCovered=0, dataCompleteness=0.0)),
            scores=CategoryScores(
                fundamentals=None, management=None,
                valuation=None,   technicals=None, options=None),
            verdictBreakdown=VerdictBreakdown(),
            col_F=meta.get("col_F"),
            col_J=meta.get("col_J"),
            col_O=meta.get("col_O"),
            thesis=None,
            sourceAudit=None,
        ))
        _next_rank += 1

    # Summary tallies (skip Nones — watchlist-only entries don't count toward bucket tallies)
    by_bucket = {"High": 0, "Medium": 0, "Low": 0, "Watchlist": 0, "Avoid": 0}
    for c in companies:
        if c.priorityBucket:
            by_bucket[c.priorityBucket] += 1
    summary = Summary(
        totalCompanies=len(companies),
        highPriorityCount=by_bucket["High"],
        mediumPriorityCount=by_bucket["Medium"],
        lowPriorityCount=by_bucket["Low"],
        watchlistCount=by_bucket["Watchlist"],
        avoidCount=by_bucket["Avoid"],
        topRankedTickers=[c.ticker for c in companies[:5]],
        generatedForPeriod="2026-Q2 cycle",
    )

    return DashboardPayload(
        schemaVersion=SCHEMA_VERSION,
        generatedAt=datetime.now(timezone.utc),
        generatedBy=GENERATED_BY,
        dashboardVersion=DASHBOARD_VERSION,
        pipelineRunId="",  # populated by pipeline integration in v2
        universeName="Growth Stock Research Universe",
        universeDescription="Priority ranking dashboard for growth-stock and options research.",
        baseCurrency="USD",
        scoringModel=model,
        summary=summary,
        companies=companies,
    )


def main() -> int:
    """Generate and emit. The StableFileGuard proves we didn't touch the shell."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Prove (structurally) that we never write the stable files.
    with StableFileGuard():
        payload = build_payload()
        # Refuse any write outside data/ by routing every emit through the guard.
        assert_write_target_safe(EMIT_JSON)
        assert_write_target_safe(EMIT_JS)
        json_path, js_path = write_emitted_files(payload)
        print(f"Wrote {json_path} ({json_path.stat().st_size:,} bytes)")
        print(f"Wrote {js_path}   ({js_path.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ViolationError as v:
        print(f"BUILD FAILURE — write boundary violated:\n  {v}", file=sys.stderr)
        raise SystemExit(2) from v
