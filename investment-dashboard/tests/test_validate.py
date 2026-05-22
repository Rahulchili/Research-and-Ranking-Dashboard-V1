"""Each validator fails on a crafted bad input and passes on a good one."""
from __future__ import annotations

from dashboard_build.validate import (
    ValidationReport,
    check_no_nan_inf,
    check_rank_matches_composite,
    check_required_sections,
    check_score_ranges,
    check_weights_sum,
    secret_scan_text,
)


def test_weights_sum_good(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    check_weights_sum(blob, rep)
    assert rep.ok


def test_weights_sum_bad(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    blob["scoringModel"]["weights"]["fundamentals"] = 0.5  # breaks sum
    check_weights_sum(blob, rep)
    assert not rep.ok


def test_score_ranges_good(good_payload) -> None:
    rep = ValidationReport()
    check_score_ranges(good_payload.model_dump(mode="python"), rep)
    assert rep.ok


def test_score_ranges_bad_composite(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    blob["companies"][0]["compositeScore"] = 150
    check_score_ranges(blob, rep)
    assert not rep.ok


def test_no_nan_inf_good(good_payload) -> None:
    rep = ValidationReport()
    check_no_nan_inf(good_payload.model_dump(mode="python"), rep)
    assert rep.ok


def test_no_nan_inf_finds_nan(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    blob["companies"][0]["compositeScore"] = float("nan")
    check_no_nan_inf(blob, rep)
    assert not rep.ok


def test_no_nan_inf_finds_inf(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    blob["companies"][0]["scores"]["fundamentals"] = float("inf")
    check_no_nan_inf(blob, rep)
    assert not rep.ok


def test_rank_matches_composite_good(good_payload) -> None:
    rep = ValidationReport()
    check_rank_matches_composite(good_payload.model_dump(mode="python"), rep)
    assert rep.ok


def test_required_sections_good(good_payload) -> None:
    rep = ValidationReport()
    check_required_sections(good_payload.model_dump(mode="python"), rep)
    assert rep.ok


def test_required_sections_missing_top_level(good_payload) -> None:
    rep = ValidationReport()
    blob = good_payload.model_dump(mode="python")
    del blob["summary"]
    check_required_sections(blob, rep)
    assert not rep.ok


def test_secret_scan_finds_pattern() -> None:
    rep = ValidationReport()
    text = 'config = { "key": "sk-1234567890abcdef1234567890abcdef" }'
    secret_scan_text(text, "fixture", rep)
    assert not rep.ok


def test_secret_scan_clean_passes() -> None:
    rep = ValidationReport()
    secret_scan_text("perfectly innocuous text", "fixture", rep)
    assert rep.ok
