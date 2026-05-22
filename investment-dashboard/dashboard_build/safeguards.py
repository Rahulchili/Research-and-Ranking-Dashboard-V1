"""Runtime guard: prove the generator can't touch the stable files.

The PRD's strongest mitigation is structural — not "tell the agent to be
careful" but "make the generator physically incapable of writing the stable
files" (PRD §5.1 + §22 risk row). This module provides:

  1. `StableFileGuard` — a context manager that hashes the stable files at
     entry, asserts they're unchanged at exit (or raises ViolationError).
  2. `assert_write_target_safe(path)` — call this from any code path that
     writes to disk; refuses any path outside `data/`.

Single responsibility: enforce the write boundary. No business logic.
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from types import TracebackType

from .config import DATA_DIR, REPO_ROOT, STABLE_FILES


class ViolationError(Exception):
    """Raised when the generator attempts to modify a stable file or write
    outside `data/`. Never silently caught."""


def _hash_file(path: Path) -> str | None:
    if not path.exists():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()


def assert_write_target_safe(target: Path) -> None:
    """Refuse any write that lands outside `data/`.

    Compares against the resolved absolute path so symlinks/`..` traversal
    can't bypass the check.
    """
    target = Path(target).resolve()
    data_root = DATA_DIR.resolve()
    try:
        target.relative_to(data_root)
    except ValueError:
        raise ViolationError(
            f"generate_data.py write target {target} is outside {data_root}. "
            f"Per PRD §5.1, the generator may only write to data/."
        ) from None


@dataclass
class StableFileGuard:
    """Snapshot stable files at __enter__; assert byte-identical at __exit__."""

    paths: tuple[Path, ...] = STABLE_FILES
    _hashes: dict[Path, str | None] = None  # type: ignore[assignment]

    def __enter__(self) -> StableFileGuard:
        self._hashes = {p: _hash_file(p) for p in self.paths}
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        for p in self.paths:
            after = _hash_file(p)
            before = self._hashes[p]
            if before != after:
                raise ViolationError(
                    f"Stable file modified by the generator: {p}\n"
                    f"  before sha256={before}\n"
                    f"  after  sha256={after}\n"
                    f"Per PRD §5.1 / build instructions §1, the generator is "
                    f"structurally forbidden from writing this file."
                )

    def report(self) -> dict[str, str | None]:
        """Return the hash snapshot — used by test_file_separation.py."""
        return {str(p): h for p, h in (self._hashes or {}).items()}


def relpath_for_log(p: Path) -> str:
    """Pretty-print a path relative to the repo root for log messages."""
    try:
        return str(Path(p).resolve().relative_to(REPO_ROOT))
    except ValueError:
        return str(p)
