"""Structural enforcement: the stable files (index.html, styles.css, app.js)
are byte-identical across a full generation run. An attempt to write outside
data/ raises ViolationError."""
from __future__ import annotations

import hashlib
import subprocess
import sys
from pathlib import Path

import pytest

from dashboard_build.config import REPO_ROOT, STABLE_FILES
from dashboard_build.safeguards import (
    StableFileGuard,
    ViolationError,
    assert_write_target_safe,
)


def _sha(p: Path) -> str | None:
    if not p.exists():
        return None
    return hashlib.sha256(p.read_bytes()).hexdigest()


def test_stable_files_unchanged_after_generate_data() -> None:
    """Run generate_data.py end-to-end and confirm stable files are bit-identical."""
    before = {p: _sha(p) for p in STABLE_FILES}
    res = subprocess.run(
        [sys.executable, "generate_data.py"],
        capture_output=True, text=True,
        cwd=str(REPO_ROOT), check=False,
    )
    assert res.returncode == 0, f"generate_data.py failed: {res.stderr}"
    after = {p: _sha(p) for p in STABLE_FILES}
    assert before == after, f"Stable files changed: {[p for p in STABLE_FILES if before[p] != after[p]]}"


def test_write_target_safe_rejects_stable_file() -> None:
    """Trying to write a stable file raises ViolationError."""
    with pytest.raises(ViolationError):
        assert_write_target_safe(REPO_ROOT / "index.html")
    with pytest.raises(ViolationError):
        assert_write_target_safe(REPO_ROOT / "assets" / "app.js")
    with pytest.raises(ViolationError):
        assert_write_target_safe(REPO_ROOT / "assets" / "styles.css")


def test_write_target_safe_rejects_arbitrary_path() -> None:
    """Even a path inside the repo but outside data/ is rejected."""
    with pytest.raises(ViolationError):
        assert_write_target_safe(REPO_ROOT / "BUILD_NOTES.md")
    with pytest.raises(ViolationError):
        assert_write_target_safe(REPO_ROOT / "tests" / "test_x.py")


def test_write_target_safe_accepts_data_paths() -> None:
    """Paths under data/ are fine."""
    from dashboard_build.config import EMIT_JS, EMIT_JSON
    assert_write_target_safe(EMIT_JSON)  # no raise
    assert_write_target_safe(EMIT_JS)


def test_stable_file_guard_detects_mutation(tmp_path: Path) -> None:
    """Manually mutating a stable file inside the guard raises ViolationError."""
    # Create a sentinel "stable" file and run the guard against it.
    f = tmp_path / "fake_stable.txt"
    f.write_text("original")
    with pytest.raises(ViolationError):
        with StableFileGuard(paths=(f,)):
            f.write_text("mutated")
