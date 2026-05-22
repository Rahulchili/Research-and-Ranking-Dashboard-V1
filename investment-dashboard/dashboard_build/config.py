"""Repo-wide configuration: paths, schema version constants, thresholds.

Single responsibility: hold every constant the build depends on so changes
are a one-file edit and there's no hidden coupling.
"""
from __future__ import annotations

from pathlib import Path

# ---------------------------------------------------------------------------
# Paths — derived from this file's location so the package is portable.
# ---------------------------------------------------------------------------
REPO_ROOT: Path = Path(__file__).resolve().parent.parent
DATA_DIR: Path = REPO_ROOT / "data"
ASSETS_DIR: Path = REPO_ROOT / "assets"
FIXTURES_DIR: Path = REPO_ROOT / "fixtures"
LEGACY_FIXTURE: Path = FIXTURES_DIR / "legacy_dashboard_sample" / "dashboard_monolith.html"

# Stable files (generator may NOT write these — enforced by safeguards.py).
STABLE_FILES: tuple[Path, ...] = (
    REPO_ROOT / "index.html",
    ASSETS_DIR / "styles.css",
    ASSETS_DIR / "app.js",
)

# Output files (generator writes only these).
EMIT_JSON: Path = DATA_DIR / "dashboard-data.json"
EMIT_JS: Path = DATA_DIR / "dashboard-data.js"

# ---------------------------------------------------------------------------
# Schema / model versions.
# ---------------------------------------------------------------------------
SCHEMA_VERSION: str = "1.0.0"
DASHBOARD_VERSION: str = "1.0.0"
MODEL_VERSION: str = "1.0.0"
GENERATED_BY: str = "generate_data.py"

# ---------------------------------------------------------------------------
# Scoring weights — composite = weighted average of category scores [0,100].
# Sum must be 1.0 within FLOAT_TOL (validated in schema.py).
# ---------------------------------------------------------------------------
DEFAULT_WEIGHTS: dict[str, float] = {
    "fundamentals": 0.35,
    "management": 0.15,
    "valuation": 0.05,
    "technicals": 0.35,
    "options": 0.10,
}

# Priority bucket thresholds — also embedded in scoringModel for runtime config.
PRIORITY_BUCKETS: dict[str, float] = {
    "high":      85.0,
    "medium":    70.0,
    "low":       55.0,
    "watchlist": 40.0,
    # below watchlist → "avoid"
}

# ---------------------------------------------------------------------------
# Tolerances.
# ---------------------------------------------------------------------------
FLOAT_TOL: float = 1e-9                 # weights-sum tolerance
EQUIVALENCE_TOL: float = 1e-2           # ≤ 0.01 per PRD §17.5
PAYLOAD_TARGET_RATIO: float = 0.20      # data ≤ 20% of audited baseline per §11.1
PAYLOAD_HARD_CEILING_BYTES: int = 8 * 1024 * 1024  # 8 MB circuit-breaker per §11.1

# ---------------------------------------------------------------------------
# Size targets (per §11.1) — informational; verify.py reports against these.
# ---------------------------------------------------------------------------
SIZE_TARGETS: dict[str, int] = {
    "index.html":         50 * 1024,
    "styles.css":        250 * 1024,
    "app.js":            500 * 1024,
}

# ---------------------------------------------------------------------------
# Secret-scan patterns — `validate.py` runs these regexes over emitted files.
# ---------------------------------------------------------------------------
SECRET_PATTERNS: tuple[str, ...] = (
    r"AKIA[0-9A-Z]{16}",                    # AWS access key
    r"sk-[A-Za-z0-9]{20,}",                 # OpenAI/Anthropic-style key
    r"xox[baprs]-[A-Za-z0-9-]{10,}",        # Slack token
    r"ghp_[A-Za-z0-9]{30,}",                # GitHub personal access token
    r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
    r"\bpassword\s*=\s*['\"][^'\"]{4,}['\"]",
)
