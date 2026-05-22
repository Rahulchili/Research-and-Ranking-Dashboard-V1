# Claude Code Build Instructions — Investment Dashboard Python Codebase

> Source of truth: `PRD_Dashboard_Refactor_v2_enhanced.md`. Where this file and the PRD ever disagree, the PRD wins and you must flag the conflict in `BUILD_NOTES.md` rather than guessing.

You are building the **Python codebase** that produces the modular static dashboard package described in the PRD. The browser-facing files (`index.html`, `assets/styles.css`, `assets/app.js`) are authored static assets; the Python codebase is the generator, validator, audit, and test tooling that produces and guards the data payload. Both are in scope and both are gated by the quality loop in Section 7.

---

## 1. Non-Negotiable Ground Rules

These are the PRD's hard requirements. Violating any of them is a build failure, not a style preference.

1. **`generate_data.py` is the only code path allowed to write inside `data/`.** It must be structurally incapable of writing `index.html`, `assets/styles.css`, or `assets/app.js`. This is enforced by a test (`test_file_separation.py`) that checksums the three stable files before and after a full generation run and asserts they are byte-identical.
2. **Single source of truth for composite score and rank.** The composite and rank are computed exactly once, in `dashboard_build/scoring.py`, and stored in the data file. The frontend renders the stored values and may only *recompute as a warning-only assertion*. No second computation path anywhere in Python.
3. **Data is emitted as a `JSON.parse` string, never a raw JS object literal.** `data/dashboard-data.js` must be exactly `window.DASHBOARD_DATA = JSON.parse('<properly escaped single JSON string>');`. A raw object literal is an automatic failure.
4. **The data schema is the integration contract.** It is defined once as Pydantic models in `dashboard_build/schema.py`. Every emitted file validates against it before it is written.
5. **No payload-relocation.** Separation alone does not pass. The post-build payload for 30 simulated stocks must be measurably below the Phase 0 audited baseline extrapolated to 30 stocks. Charts are rendered from numeric data; per-company base64 images are prohibited in output.
6. **No secrets, no external CDNs, no `eval`/`new Function`.** A credential/secret scan runs in the acceptance harness and must pass.
7. **Phase 0 is blocking.** No generator, schema, or frontend work begins until the root-cause audit (`baseline_audit.md`) exists and names the dominant byte contributor.
8. **Never weaken a check to make it pass.** Deleting, skipping, `xfail`-ing, loosening a threshold, or stubbing a check to turn it green is prohibited. Fixes must address the root cause.

---

## 2. Required Repository Layout

Create exactly this structure. Do not invent extra top-level files.

```text
investment-dashboard/
├── README.md
├── BUILD_NOTES.md                 # decisions, deviations, PRD conflicts you hit
├── baseline_audit.md              # Phase 0 output (blocking)
├── pyproject.toml                 # pinned deps, ruff, mypy, pytest config
├── Makefile                       # `make verify` runs the full gate
├── generate_data.py               # CLI entrypoint; ONLY writer of data/
├── index.html                     # stable shell (authored once)
├── assets/
│   ├── styles.css                 # stable
│   └── app.js                     # stable; JSON.parse load, textContent render
├── data/
│   ├── dashboard-data.js          # generated: window.DASHBOARD_DATA = JSON.parse('...')
│   └── dashboard-data.json        # generated: canonical JSON
├── dashboard_build/
│   ├── __init__.py
│   ├── config.py                  # paths, thresholds, schema version constants
│   ├── schema.py                  # Pydantic models = the integration contract
│   ├── ingest.py                  # read analysis-pipeline outputs (CSV/etc.)
│   ├── scoring.py                 # composite + rank computed HERE, once
│   ├── confidence.py              # confidence object from evidentiary basis
│   ├── audit.py                   # Phase 0 byte-decomposition tooling
│   ├── emit.py                    # write dashboard-data.js (+.json) safely
│   ├── validate.py                # weights sum, ranges, NaN, secret scan
│   ├── equivalence.py             # old-vs-new ranking diff
│   ├── safeguards.py              # runtime guard: generator cannot touch stable files
│   └── verify.py                  # orchestrates the full acceptance harness
├── fixtures/
│   ├── pipeline_outputs_sample/   # mock analysis-pipeline inputs for tests
│   └── legacy_dashboard_sample/   # extracted old data for equivalence testing
└── tests/
    ├── test_schema.py
    ├── test_scoring.py
    ├── test_confidence.py
    ├── test_emit_js.py
    ├── test_validate.py
    ├── test_equivalence.py
    ├── test_audit.py
    └── test_file_separation.py
```

---

## 3. Input Contract (Analysis Pipeline → Dashboard)

`generate_data.py` consumes the outputs of the analysis pipeline (the management-credibility project): primarily `company_scores.csv` plus per-company scorecards and summary text. The dashboard **does not compute analytics** — it ingests, shapes, ranks, validates, and emits.

- `dashboard_build/ingest.py` reads pipeline outputs from a configurable input directory.
- The build must be runnable and fully testable in isolation using `fixtures/pipeline_outputs_sample/`. Do not require the real pipeline to be present to run the test suite.
- If a required input field is missing, fail loudly with a precise message naming the file and field. Never silently fill with zeros.

---

## 4. Phase Plan (execute in order)

### Phase 0 — Root-Cause Audit (BLOCKING)
- Implement `dashboard_build/audit.py` to decompose a monolithic dashboard file into the byte table from PRD §4.0 (structural HTML, inline CSS, inline JS/libraries, company data, charts/images, other).
- Run it against `fixtures/legacy_dashboard_sample/` and write `baseline_audit.md` with the measured table, the dominant contributor, and the chosen chart strategy per PRD §4.0.1 (default: render charts client-side from numeric data).
- Do not start Phase 1 until `baseline_audit.md` exists and is committed.

### Phase 1 — Schema & Scoring (the contract)
- `schema.py`: Pydantic models for the top-level object, `scoringModel`, `summary`, and the company object including the `confidence` object (`score`, `basis`, `notes`). Reject unknown major schema versions.
- `scoring.py`: composite = weighted average of category scores; rank = stable ordering by composite (ties broken deterministically by ticker). This is the only place this math exists.
- `confidence.py`: confidence derived from evidentiary basis (claim count, quarters covered, data completeness) — not model certainty.

### Phase 2 — Ingest & Emit
- `ingest.py`: pipeline outputs → validated in-memory model instances.
- `emit.py`: serialize to canonical JSON; write `data/dashboard-data.json`; write `data/dashboard-data.js` as `window.DASHBOARD_DATA = JSON.parse('<escaped JSON string>');` with correct JS string escaping (backslash, single quote, control chars, line/paragraph separators). Round-trip test required: load the `.js`, strip the wrapper, `json.loads` it, assert deep-equal to the `.json`.

### Phase 3 — Stable Frontend
- `index.html`: minimal shell per PRD §5.2, `defer` on `app.js`, `role="main"` root.
- `assets/app.js`: read `window.DASHBOARD_DATA`; validate schema version per the compatibility policy (PRD §14.3); render header, summary, ranking table, lazy company detail; sort/filter/search; draw charts from numeric data; render every data string via `textContent`/safe DOM node creation (no HTML string-building from data); explicit error states (missing data, undefined global, unsupported schema, empty companies, partial company).
- `assets/styles.css`: extracted styling; no inline styles in the shell.

### Phase 4 — Validation & Equivalence
- `validate.py`: assert weights sum to 1.0 (within 1e-9); all scores in [0, 100]; no `NaN`/`None`/`inf` reaching output; rank order matches composite order; required sections present; secret/credential regex scan over all emitted files.
- `equivalence.py`: load legacy data and new `dashboard-data.json`; assert identical company set, identical rank order, composite and every category score equal within 0.01. Any mismatch fails the build.

### Phase 5 — Safeguards & Orchestration
- `safeguards.py`: a guard invoked by `generate_data.py` that resolves the three stable file paths, records their hashes at process start, and asserts at process end they are unchanged; the generator's write surface is restricted to `data/` (reject any write target outside it).
- `verify.py`: the single orchestrator the quality loop calls (Section 7).

---

## 5. Coding Standards

- Python 3.11+. Type-annotate all public functions; `mypy` strict on `dashboard_build/`.
- `ruff` for lint + format; zero warnings.
- Pure functions for scoring and confidence; deterministic given inputs; set any random seed explicitly (there should be none in v1).
- No network calls anywhere in the build or tests.
- Pin every dependency to an exact version in `pyproject.toml` (no ranges).
- Every module has a one-paragraph docstring stating its single responsibility.
- Errors are specific exceptions with actionable messages; never bare `except`.

---

## 6. Test Suite (must exist before the loop)

Minimum coverage, all under `tests/`:

- `test_schema.py` — valid payload passes; missing required field fails; major-version mismatch rejected.
- `test_scoring.py` — known inputs → known composite and rank; tie-break determinism; weights applied correctly.
- `test_confidence.py` — confidence reflects basis; low-evidence company is distinguishable.
- `test_emit_js.py` — `.js` is `JSON.parse` form; escaping survives quotes/newlines/unicode; `.js` and `.json` round-trip equal; raw-object-literal form is asserted absent.
- `test_validate.py` — weights-sum, range, NaN, and secret-scan checks each fail on a crafted bad input and pass on a good one.
- `test_equivalence.py` — identical inputs → pass; perturbed score → fail.
- `test_audit.py` — audit table sums to 100% of bytes; dominant contributor correctly identified on a fixture.
- `test_file_separation.py` — full `generate_data.py` run leaves the three stable files byte-identical; an attempt to write outside `data/` raises.

---

## 7. Iterative Quality Loop — Run Up To 20 Iterations

Define one command, `make verify`, which runs `python -m dashboard_build.verify`, executing **in this order** and stopping at the first hard failure:

1. `ruff check` + format check
2. `mypy --strict dashboard_build`
3. `pytest -q` (unit + integration)
4. Acceptance harness: schema validation of emitted files → weights-sum/range/NaN checks → secret scan → equivalence diff → file-separation checksum → payload-reduction gate (post-build bytes for 30 simulated stocks vs. Phase 0 baseline) → error-state smoke test (rename data file, confirm helpful message, restore).

**Loop semantics — follow exactly:**

```
iteration = 1
consecutive_green = 0

while iteration <= 20:
    result = run `make verify`
    if result == ALL PASS:
        consecutive_green += 1
        if consecutive_green == 2:        # two greens in a row guards nondeterminism
            write SUCCESS.md (summary + final payload table vs baseline)
            STOP — build complete
        # else run once more to confirm stability
    else:
        consecutive_green = 0
        diagnose the ROOT CAUSE of every failing check
        apply a real fix (code/data/asset — never the check itself)
        record the iteration, the failures, and the fix in BUILD_NOTES.md
    iteration += 1

if loop exits without two consecutive greens:
    write FAILURES.md containing:
      - every still-failing check and its exact error
      - each diagnosis attempted and why it did/didn't work
      - the smallest reproduction
      - concrete recommended next steps
    STOP — do NOT declare success, do NOT silently pass
```

Rules that bind the loop:

- A check may only turn green by fixing the underlying defect. Loosening thresholds, deleting/skipping/`xfail` tests, stubbing, or hard-coding expected values to match output is prohibited and is itself a build failure.
- Fix the cause, not the symptom: if a test is flaky, remove the nondeterminism, do not retry until it passes.
- The two-consecutive-green requirement is mandatory — a single green run is not "done."
- Every iteration appends to `BUILD_NOTES.md` so the path to convergence is auditable.
- Twenty iterations is a hard ceiling. Reaching it without convergence is a reported, honest failure with `FAILURES.md`, not a quiet pass.

---

## 8. Acceptance Checklist (the harness must verify all)

- [ ] Repo layout matches Section 2 exactly.
- [ ] `baseline_audit.md` exists, sums to 100% of bytes, names the dominant contributor.
- [ ] `data/dashboard-data.js` is `window.DASHBOARD_DATA = JSON.parse('...')`; no raw object literal anywhere.
- [ ] `.js` and `.json` round-trip to deep-equal data.
- [ ] Composite/rank computed only in `scoring.py`; no second path.
- [ ] Equivalence diff passes: same companies, same rank order, scores within 0.01.
- [ ] Running `generate_data.py` leaves `index.html`, `styles.css`, `app.js` byte-unchanged.
- [ ] Generator cannot write outside `data/` (guard raises on attempt).
- [ ] Weights sum to 1.0; all scores in [0,100]; no `NaN`/`None`/`inf`/`undefined` in output.
- [ ] Secret/credential scan finds nothing in any emitted file.
- [ ] Post-build payload for 30 simulated stocks is measurably below the Phase 0 baseline extrapolated to 30 stocks (table reproduced in `SUCCESS.md`).
- [ ] Missing data file produces a helpful message, not a blank page.
- [ ] `ruff`, `mypy --strict`, and `pytest` all clean.
- [ ] Loop converged with two consecutive green `make verify` runs, or `FAILURES.md` written.

---

## 9. Definition of Done

The build is done **only** when `make verify` passes on two consecutive runs with zero loosened checks, `SUCCESS.md` records the final payload table proving real reduction versus the Phase 0 baseline, and `BUILD_NOTES.md` documents every deviation from this file or the PRD. Anything short of that is documented in `FAILURES.md` and reported honestly — never disguised as success.

---

## 10. Anti-Patterns That Fail The Build

- Emitting a raw JS object literal "because it's simpler."
- Recomputing the composite in `app.js` and displaying that instead of the stored value.
- Inlining charts as base64 to "match the old look."
- Letting `generate_data.py` rewrite the HTML/CSS/JS shell.
- Making a failing check pass by editing the check.
- Declaring success after a single green run, or after hitting iteration 20 without convergence.
- Filling missing pipeline inputs with zeros instead of failing loudly.
