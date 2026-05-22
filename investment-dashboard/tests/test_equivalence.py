"""Equivalence diff: identical inputs pass; perturbed score fails.

Equivalence now compares the new payload's composite to what `scoring.py`
(the PRD §9.7 single source of truth) computes from the legacy category
scores — see `equivalence.py` module docstring for why.
"""
from __future__ import annotations

from dashboard_build.equivalence import (
    _build_authoritative_model,
    _category_scores_from_row,
    diff,
)
from dashboard_build.scoring import composite_score


def _legacy_rows() -> list[dict]:
    # `comp` is intentionally an arbitrary stale value — the new semantic
    # ignores it and recomputes via scoring.composite_score.
    return [
        {"t": "AAA", "comp": 99.0, "F": 90, "M": 90, "V": 90, "T": 90, "O": 90},
        {"t": "BBB", "comp": 99.0, "F": 70, "M": 80, "V": 75, "T": 75, "O": 75},
        {"t": "CCC", "comp": 99.0, "F": 50, "M": 60, "V": 55, "T": 55, "O": 55},
    ]


def _expected_comp(row: dict) -> float:
    """Authoritative composite for a legacy row."""
    return composite_score(_category_scores_from_row(row), _build_authoritative_model())


def _new_payload_matching() -> dict:
    rows = _legacy_rows()
    enriched = [(r, _expected_comp(r)) for r in rows]
    # Sort by composite desc, ticker asc — matches scoring.rank_companies.
    enriched.sort(key=lambda x: (-x[1], x[0]["t"]))
    return {
        "companies": [
            {
                "ticker": r["t"],
                "rank": i + 1,
                "compositeScore": comp,
                "priorityBucket": (
                    "High" if comp >= 85 else "Medium" if comp >= 70 else "Low"
                ),
                "scores": {
                    "fundamentals": r["F"], "management": r["M"], "valuation": r["V"],
                    "technicals": r["T"], "options": r["O"],
                },
            }
            for i, (r, comp) in enumerate(enriched)
        ]
    }


def test_identical_inputs_pass() -> None:
    rep = diff(_new_payload_matching(), _legacy_rows())
    assert rep.ok, rep.summary()


def test_perturbed_composite_fails() -> None:
    payload = _new_payload_matching()
    # Drift the top company's composite by 5pts — must exceed 0.01 tol.
    payload["companies"][0]["compositeScore"] += 5.0
    rep = diff(payload, _legacy_rows())
    assert not rep.ok
    assert any(payload["companies"][0]["ticker"] in m for m in rep.composite_mismatches)


def test_perturbed_category_score_fails() -> None:
    payload = _new_payload_matching()
    # Find the ticker whose F=70 in the legacy fixture (was BBB) and
    # perturb its `fundamentals` in the new payload.
    target = "BBB"
    for c in payload["companies"]:
        if c["ticker"] == target:
            c["scores"]["fundamentals"] = 65.0  # was 70 — drift > 0.01
            break
    rep = diff(payload, _legacy_rows())
    assert not rep.ok
    assert any(target in m for m in rep.category_mismatches)


def test_within_tolerance_passes() -> None:
    payload = _new_payload_matching()
    payload["companies"][0]["compositeScore"] += 0.005  # within 0.01 tol
    rep = diff(payload, _legacy_rows(), tol=0.01)
    assert rep.ok


def test_rank_order_change_fails() -> None:
    payload = _new_payload_matching()
    # Swap ranks of the top two companies — must trip the rank check.
    payload["companies"][0]["rank"], payload["companies"][1]["rank"] = (
        payload["companies"][1]["rank"],
        payload["companies"][0]["rank"],
    )
    rep = diff(payload, _legacy_rows())
    assert not rep.ok
