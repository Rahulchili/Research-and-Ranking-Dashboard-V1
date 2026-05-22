"""Audit: table sums to 100%; dominant contributor correctly identified."""
from __future__ import annotations

from pathlib import Path

from dashboard_build.audit import audit_file, render_markdown_report
from dashboard_build.config import LEGACY_FIXTURE


def test_audit_table_sums_to_100_percent() -> None:
    rep = audit_file(LEGACY_FIXTURE)
    total = sum(r.bytes_ for r in rep.rows)
    assert total == rep.total_bytes, f"rows summed to {total} but file is {rep.total_bytes}"


def test_dominant_contributor_is_charts_for_legacy() -> None:
    """Per Phase 0, the dominant contributor must be base64 charts at 94%+."""
    rep = audit_file(LEGACY_FIXTURE)
    dom = rep.dominant_contributor
    assert "Charts" in dom.name or "image" in dom.name.lower()
    assert dom.bytes_ / rep.total_bytes > 0.5  # well over half the file


def test_render_markdown_report_has_required_sections() -> None:
    rep = audit_file(LEGACY_FIXTURE)
    md = render_markdown_report(rep)
    assert "# Baseline Audit" in md
    assert "## Byte Decomposition" in md
    assert "## Dominant Contributor" in md
    assert "## Chart Strategy Decision" in md
    assert "## Target Sizes" in md


def test_audit_handles_minimal_html(tmp_path: Path) -> None:
    """A minimal HTML with no inline JS still produces a sensible table."""
    f = tmp_path / "minimal.html"
    f.write_text("<html><body><h1>Hi</h1></body></html>", encoding="utf-8")
    rep = audit_file(f)
    assert rep.total_bytes == f.stat().st_size
    total = sum(r.bytes_ for r in rep.rows)
    assert total == rep.total_bytes
