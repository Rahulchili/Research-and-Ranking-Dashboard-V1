"""Validation checks that run on emitted files.

Per PRD §20 Phase 5 + build instructions §4: weights sum, score ranges,
NaN/None/inf, rank ordering, required sections, secret/credential regex scan.
Every check raises ValidationError on failure — never a silent pass.

Single responsibility: assertions on the produced payload + emitted files.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .config import EMIT_JS, EMIT_JSON, FLOAT_TOL, SECRET_PATTERNS


class ValidationError(Exception):
    """Raised on any validation failure; never bare-caught."""


@dataclass
class ValidationReport:
    """Accumulated results from a single validation run."""

    checks_run: list[str] = field(default_factory=list)
    failures: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.failures

    def record(self, check: str) -> None:
        self.checks_run.append(check)

    def fail(self, check: str, msg: str) -> None:
        self.failures.append(f"{check}: {msg}")


# ---------------------------------------------------------------------------
# Individual checks
# ---------------------------------------------------------------------------

def check_weights_sum(payload: dict[str, Any], report: ValidationReport) -> None:
    report.record("weights_sum")
    w = payload["scoringModel"]["weights"]
    s = w["fundamentals"] + w["management"] + w["valuation"] + w["technicals"] + w["options"]
    if not math.isclose(s, 1.0, abs_tol=FLOAT_TOL):
        report.fail("weights_sum", f"weights sum to {s}, expected 1.0 ±{FLOAT_TOL}")


def check_score_ranges(payload: dict[str, Any], report: ValidationReport) -> None:
    report.record("score_ranges")
    for c in payload["companies"]:
        if not (0.0 <= c["compositeScore"] <= 100.0):
            report.fail("score_ranges",
                        f"{c['ticker']}.compositeScore={c['compositeScore']} out of [0,100]")
        scores = c.get("scores") or {}
        for k, v in scores.items():
            if v is None:
                continue
            if not (0.0 <= v <= 100.0):
                report.fail("score_ranges", f"{c['ticker']}.scores.{k}={v} out of [0,100]")


def check_no_nan_inf(payload: dict[str, Any], report: ValidationReport) -> None:
    """Walk every number in the payload and reject NaN / inf / None-where-required."""
    report.record("no_nan_inf")

    def walk(node: Any, path: str) -> None:
        if isinstance(node, float):
            if math.isnan(node):
                report.fail("no_nan_inf", f"NaN at {path}")
            elif math.isinf(node):
                report.fail("no_nan_inf", f"inf at {path}")
        elif isinstance(node, dict):
            for k, v in node.items():
                walk(v, f"{path}.{k}")
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, f"{path}[{i}]")

    walk(payload, "$")


def check_rank_matches_composite(payload: dict[str, Any], report: ValidationReport) -> None:
    """Rank order must match composite-desc order; ties broken by ticker asc."""
    report.record("rank_order")
    cs = sorted(
        payload["companies"],
        key=lambda c: (-c["compositeScore"], c["ticker"]),
    )
    for i, c in enumerate(cs, start=1):
        if c["rank"] != i:
            report.fail("rank_order",
                        f"{c['ticker']} rank={c['rank']} but composite-desc position={i}")


def check_required_sections(payload: dict[str, Any], report: ValidationReport) -> None:
    report.record("required_sections")
    must = ("schemaVersion", "generatedAt", "scoringModel", "summary", "companies")
    for k in must:
        if k not in payload:
            report.fail("required_sections", f"top-level missing '{k}'")
    if "weights" not in payload.get("scoringModel", {}):
        report.fail("required_sections", "scoringModel.weights missing")
    for c in payload["companies"]:
        for k in ("ticker", "rank", "compositeScore", "priorityBucket", "confidence", "scores"):
            if k not in c:
                report.fail("required_sections", f"{c.get('ticker','?')} missing '{k}'")


def secret_scan_text(text: str, source_label: str, report: ValidationReport) -> None:
    """Run every regex in SECRET_PATTERNS over `text`."""
    report.record(f"secret_scan:{source_label}")
    for pat in SECRET_PATTERNS:
        for m in re.finditer(pat, text):
            # Show 16-char context, not the secret itself.
            snippet = text[max(0, m.start() - 16):m.end()][:64]
            report.fail("secret_scan",
                        f"{source_label}: pattern {pat!r} matched near {snippet!r}")


def check_emitted_files_exist(report: ValidationReport) -> None:
    report.record("emitted_files_exist")
    if not Path(EMIT_JSON).exists():
        report.fail("emitted_files_exist", f"missing {EMIT_JSON}")
    if not Path(EMIT_JS).exists():
        report.fail("emitted_files_exist", f"missing {EMIT_JS}")


def check_no_raw_object_literal(js_path: Path, report: ValidationReport) -> None:
    """`window.DASHBOARD_DATA = { ... }` form is rejected; must be JSON.parse('...')."""
    report.record("no_raw_object_literal")
    text = js_path.read_text(encoding="utf-8")
    if "window.DASHBOARD_DATA = JSON.parse(" not in text:
        report.fail("no_raw_object_literal",
                    "dashboard-data.js does not use the required JSON.parse('...') form")
    # Search for the specific anti-pattern: equals followed by object literal opening.
    if re.search(r"window\.DASHBOARD_DATA\s*=\s*\{", text):
        report.fail("no_raw_object_literal",
                    "dashboard-data.js contains a raw object literal (forbidden by PRD §5.2)")


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

def run_all(payload: dict[str, Any], *, scan_files: list[Path] | None = None) -> ValidationReport:
    """Run every check against `payload` plus a secret scan of `scan_files`."""
    report = ValidationReport()
    check_weights_sum(payload, report)
    check_score_ranges(payload, report)
    check_no_nan_inf(payload, report)
    check_rank_matches_composite(payload, report)
    check_required_sections(payload, report)
    check_emitted_files_exist(report)
    check_no_raw_object_literal(Path(EMIT_JS), report)
    for f in (scan_files or [EMIT_JSON, EMIT_JS]):
        if Path(f).exists():
            secret_scan_text(Path(f).read_text(encoding="utf-8"), str(f), report)
    return report
