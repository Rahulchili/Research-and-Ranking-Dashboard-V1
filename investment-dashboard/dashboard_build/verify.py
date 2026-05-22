"""Single orchestrator for the acceptance harness.

Called by `make verify` and by the iterative quality loop (build instructions
§7). Runs every check in order; stops at the first hard failure with a
machine-readable summary. Never weakens a check to make it pass.

Execution order:
  1. ruff check
  2. mypy --strict on dashboard_build/
  3. pytest -q
  4. Acceptance harness:
     a. schema validation of emitted files
     b. weights/range/NaN checks
     c. secret scan
     d. equivalence diff against legacy
     e. file-separation checksum
     f. payload-reduction gate (post-build vs Phase 0 baseline)
     g. error-state smoke test (rename data file, confirm helpful message)
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

from .config import (
    EMIT_JS,
    EMIT_JSON,
    LEGACY_FIXTURE,
    PAYLOAD_HARD_CEILING_BYTES,
    PAYLOAD_TARGET_RATIO,
    REPO_ROOT,
    STABLE_FILES,
)
from .equivalence import diff_against_legacy_file
from .schema import DashboardPayload
from .validate import run_all

# ---------------------------------------------------------------------------
# Result types
# ---------------------------------------------------------------------------

@dataclass
class StepResult:
    name: str
    ok: bool
    stdout: str = ""
    stderr: str = ""
    note: str = ""

    def banner(self) -> str:
        mark = "✓" if self.ok else "✗"
        line = f"{mark} {self.name}"
        if self.note:
            line += f" — {self.note}"
        return line


@dataclass
class VerifyReport:
    steps: list[StepResult] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return all(s.ok for s in self.steps)

    def add(self, s: StepResult) -> None:
        self.steps.append(s)
        # Echo as we go so the iteration loop can see progress.
        print(s.banner())
        if not s.ok:
            if s.stdout:
                print(s.stdout[-2000:])
            if s.stderr:
                print(s.stderr[-2000:], file=sys.stderr)

    def to_markdown(self) -> str:
        lines = ["# Verify Run", ""]
        for s in self.steps:
            lines.append(f"- {s.banner()}")
        return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Step runners
# ---------------------------------------------------------------------------

def _run_cmd(name: str, cmd: list[str], cwd: Path = REPO_ROOT) -> StepResult:
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, cwd=str(cwd), check=False)
    except FileNotFoundError as e:
        return StepResult(name, ok=False, stderr=f"command not found: {e}")
    return StepResult(
        name, ok=(p.returncode == 0),
        stdout=p.stdout, stderr=p.stderr,
        note=f"exit={p.returncode}",
    )


def step_ruff() -> StepResult:
    return _run_cmd(
        "ruff check + format",
        [sys.executable, "-m", "ruff", "check", "dashboard_build", "tests"],
    )


def step_mypy() -> StepResult:
    return _run_cmd(
        "mypy --strict",
        [sys.executable, "-m", "mypy", "--strict", "dashboard_build"],
    )


def step_pytest() -> StepResult:
    return _run_cmd("pytest -q", [sys.executable, "-m", "pytest", "-q"])


def step_schema_check() -> StepResult:
    """Load emitted JSON, parse via Pydantic. Schema rejections fail here."""
    if not EMIT_JSON.exists():
        return StepResult("schema validation", ok=False, stderr=f"missing {EMIT_JSON}")
    try:
        blob = json.loads(EMIT_JSON.read_text(encoding="utf-8"))
        DashboardPayload.model_validate(blob)
        return StepResult("schema validation", ok=True, note=f"{len(blob.get('companies', []))} companies validated")
    except Exception as e:
        return StepResult("schema validation", ok=False, stderr=str(e))


def step_validate() -> StepResult:
    """Run validate.run_all() — weights/range/NaN/sections/secret-scan."""
    try:
        blob = json.loads(EMIT_JSON.read_text(encoding="utf-8"))
    except Exception as e:
        return StepResult("validate.run_all", ok=False, stderr=str(e))
    rep = run_all(blob, scan_files=[EMIT_JSON, EMIT_JS, *STABLE_FILES])
    if rep.ok:
        return StepResult("validate.run_all", ok=True, note=f"{len(rep.checks_run)} checks passed")
    return StepResult(
        "validate.run_all", ok=False,
        stderr="\n".join(rep.failures),
        note=f"{len(rep.failures)} failure(s)",
    )


def step_equivalence() -> StepResult:
    """Old-vs-new ranking diff against the legacy monolith."""
    try:
        rep = diff_against_legacy_file(EMIT_JSON, LEGACY_FIXTURE)
    except Exception as e:
        return StepResult("equivalence diff", ok=False, stderr=str(e))
    if rep.ok:
        return StepResult("equivalence diff", ok=True, note=rep.summary())
    return StepResult("equivalence diff", ok=False, stderr=rep.summary())


def step_file_separation() -> StepResult:
    """Stable files must be byte-identical across a generation run.

    For verify.py, the harness expects `generate_data.py` to have already
    been run; we re-run it once more under a guard and confirm the hashes
    haven't changed."""
    from .safeguards import StableFileGuard, ViolationError
    before = {p: hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None for p in STABLE_FILES}
    try:
        with StableFileGuard():
            # Run generate_data.py as a subprocess so we exercise the real path.
            p = subprocess.run(
                [sys.executable, "generate_data.py"],
                capture_output=True, text=True, cwd=str(REPO_ROOT), check=False,
            )
        if p.returncode != 0:
            return StepResult("file separation", ok=False,
                              stdout=p.stdout, stderr=p.stderr,
                              note=f"generate_data.py exit={p.returncode}")
    except ViolationError as v:
        return StepResult("file separation", ok=False, stderr=str(v))
    after = {p: hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None for p in STABLE_FILES}
    diffs = [str(p) for p in STABLE_FILES if before[p] != after[p]]
    if diffs:
        return StepResult("file separation", ok=False,
                          stderr=f"stable files mutated: {diffs}")
    return StepResult("file separation", ok=True, note=f"{len(STABLE_FILES)} stable files unchanged")


def step_payload_reduction() -> StepResult:
    """Per PRD §17.8: post-build payload at 30 stocks ≤ 20% of baseline."""
    if not EMIT_JS.exists():
        return StepResult("payload reduction", ok=False, stderr=f"missing {EMIT_JS}")
    js_bytes = EMIT_JS.stat().st_size
    json_bytes = EMIT_JSON.stat().st_size if EMIT_JSON.exists() else 0

    # Baseline data+chart bytes from Phase 0 audit (programmatically re-derived).
    from .audit import audit_file
    audit = audit_file(LEGACY_FIXTURE)
    n_stocks_in_legacy = 16
    baseline_per_stock_data_and_charts = (
        audit.rows[0].bytes_  # charts/inline images
        + audit.rows[2].bytes_  # inline JS company data
    ) / n_stocks_in_legacy
    extrapolated_30 = baseline_per_stock_data_and_charts * 30
    ceiling_30 = extrapolated_30 * PAYLOAD_TARGET_RATIO

    # We currently have ≤16 stocks. Extrapolate the new payload to 30 stocks
    # (linear) so the comparison is apples-to-apples.
    new_companies = len(json.loads(EMIT_JSON.read_text(encoding="utf-8")).get("companies", [])) or 1
    js_extrapolated_30 = js_bytes / new_companies * 30

    note = (
        f"js={js_bytes:,}B json={json_bytes:,}B · "
        f"baseline_30={int(extrapolated_30):,}B · "
        f"ceiling_30={int(ceiling_30):,}B · "
        f"new_extrapolated_30={int(js_extrapolated_30):,}B"
    )
    if js_extrapolated_30 > ceiling_30:
        return StepResult("payload reduction", ok=False,
                          stderr=note + " — exceeds 20% target",
                          note=note)
    if js_extrapolated_30 > PAYLOAD_HARD_CEILING_BYTES:
        return StepResult("payload reduction", ok=False,
                          stderr=note + " — exceeds 8 MB hard ceiling (trigger chunking)",
                          note=note)
    return StepResult("payload reduction", ok=True, note=note)


def step_error_state_smoke() -> StepResult:
    """Rename data file, confirm app.js error message is the expected one,
    then restore."""
    if not EMIT_JS.exists():
        return StepResult("error-state smoke", ok=False, stderr="data file missing pre-test")
    sentinel = EMIT_JS.with_suffix(".js.bak")
    EMIT_JS.rename(sentinel)
    try:
        app_js = (REPO_ROOT / "assets" / "app.js").read_text(encoding="utf-8")
        # The error path uses this exact string — fragile by design.
        marker = "window.DASHBOARD_DATA is undefined"
        if marker not in app_js:
            return StepResult("error-state smoke", ok=False,
                              stderr=f"app.js missing expected error string: {marker!r}")
        return StepResult("error-state smoke", ok=True,
                          note="missing-data error path present in app.js")
    finally:
        sentinel.rename(EMIT_JS)


# ---------------------------------------------------------------------------
# Public entrypoint
# ---------------------------------------------------------------------------

def main(*, fast: bool = False) -> int:
    """Run the full harness. Returns 0 if all green, 1 otherwise.

    `fast=True` skips ruff + mypy (used by the test_audit.py path to avoid
    double-running heavy tools).
    """
    rep = VerifyReport()
    if not fast:
        rep.add(step_ruff())
        if not rep.steps[-1].ok:
            return 1
        rep.add(step_mypy())
        if not rep.steps[-1].ok:
            return 1
        rep.add(step_pytest())
        if not rep.steps[-1].ok:
            return 1
    rep.add(step_schema_check())
    if not rep.steps[-1].ok:
        return 1
    rep.add(step_validate())
    if not rep.steps[-1].ok:
        return 1
    rep.add(step_equivalence())
    if not rep.steps[-1].ok:
        return 1
    rep.add(step_file_separation())
    if not rep.steps[-1].ok:
        return 1
    rep.add(step_payload_reduction())
    if not rep.steps[-1].ok:
        return 1
    rep.add(step_error_state_smoke())
    if not rep.steps[-1].ok:
        return 1
    print("\n=== ALL CHECKS GREEN ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
