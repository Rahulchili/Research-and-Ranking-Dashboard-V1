"""Phase 0 root-cause audit: decompose a monolithic dashboard HTML file into
the byte categories from PRD §4.0. The output of this module is the blocking
input to every subsequent phase.

Single responsibility: measure the byte composition of a legacy dashboard file
and emit a per-category breakdown (structural HTML, inline CSS, inline JS,
company data, charts/images, other). No transformation, no opinion — only
measurement.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class AuditCategory:
    """A single row of the audit table."""

    name: str
    bytes_: int
    disposition: str  # "shell" | "extract" | "data file" | "see 4.0.1" | "—"

    @property
    def pct(self) -> float:
        return 0.0  # filled in by AuditReport.with_percentages


@dataclass
class AuditReport:
    """Full audit output for one monolithic file."""

    source_path: str
    total_bytes: int
    rows: list[AuditCategory]

    def with_percentages(self) -> list[tuple[AuditCategory, float, float]]:
        """Return rows annotated with (row, pct_of_total, per_stock_bytes_assuming_16)."""
        n_stocks = 16  # current dashboard ticker count
        out: list[tuple[AuditCategory, float, float]] = []
        for r in self.rows:
            pct = (r.bytes_ / self.total_bytes * 100) if self.total_bytes else 0.0
            per_stock = r.bytes_ / n_stocks if n_stocks else 0.0
            out.append((r, pct, per_stock))
        return out

    @property
    def dominant_contributor(self) -> AuditCategory:
        """The biggest category by bytes."""
        return max(self.rows, key=lambda r: r.bytes_)


# ---------------------------------------------------------------------------
# Measurement primitives
# ---------------------------------------------------------------------------

_BASE64_IMG_RE = re.compile(
    r"data:image/(?:png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)"
)
_SCRIPT_TAG_RE = re.compile(r"<script\b[^>]*>(.*?)</script>", re.DOTALL | re.IGNORECASE)
_STYLE_TAG_RE = re.compile(r"<style\b[^>]*>(.*?)</style>", re.DOTALL | re.IGNORECASE)


def _bytes_of(s: str) -> int:
    """Length in UTF-8 bytes (HTML is UTF-8 in our world)."""
    return len(s.encode("utf-8"))


def _sum_matches(pattern: re.Pattern[str], text: str) -> int:
    """Sum the byte length of every match's full span (group 0)."""
    return sum(_bytes_of(m.group(0)) for m in pattern.finditer(text))


def _sum_group(pattern: re.Pattern[str], text: str, group: int = 1) -> int:
    """Sum the byte length of a specific captured group across all matches."""
    return sum(_bytes_of(m.group(group)) for m in pattern.finditer(text))


def _base64_payload_bytes(text: str) -> int:
    """Sum byte length of base64 payloads only (the encoded string, not the prefix).

    This is what dominates dashboard size when charts are inlined.
    """
    return _sum_group(_BASE64_IMG_RE, text, 1)


def _base64_image_count(text: str) -> int:
    return sum(1 for _ in _BASE64_IMG_RE.finditer(text))


def _data_url_decoded_bytes(text: str) -> int:
    """Approximate the raw image bytes after base64 decode (3/4 of payload)."""
    n = 0
    for m in _BASE64_IMG_RE.finditer(text):
        payload = m.group(1)
        # base64 expands 3 bytes → 4 chars, so decoded = len*3/4 (minus padding)
        n += len(payload) * 3 // 4
    return n


def _company_data_bytes(text: str) -> int:
    """Estimate bytes spent on company-specific data blocks.

    Heuristic: sum of (a) DATA.companies[...] = { ... } assignments,
    (b) DATA.narratives[...] / DATA.ticker_order pushes,
    (c) globalThis.*_TA_LEVELS / *_FACTSET_PEERS assignments.

    These are the per-company data nodes the refactor will move to dashboard-data.json.
    """
    n = 0

    # (a) DATA.companies['X'] = {...} statements. Walk balanced braces.
    for m in re.finditer(r"DATA\.companies\[['\"][A-Z]+['\"]\]\s*=\s*\{", text):
        start = m.start()
        i = m.end()
        depth = 1
        in_str = False
        sc: str | None = None
        while i < len(text) and depth > 0:
            c = text[i]
            if in_str:
                if c == "\\":
                    i += 2
                    continue
                if c == sc:
                    in_str = False
            else:
                if c in ('"', "'"):
                    in_str = True
                    sc = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
            i += 1
        n += _bytes_of(text[start:i])

    # (b) globalThis.X_TA_LEVELS / X_FACTSET_PEERS — sum line lengths
    for m in re.finditer(
        r"globalThis\.[A-Z]+_(?:TA_LEVELS|FACTSET_PEERS|OPTIONS_METRICS)\s*=\s*\{",
        text,
    ):
        start = m.start()
        i = m.end()
        depth = 1
        in_str = False
        sc = None
        while i < len(text) and depth > 0:
            c = text[i]
            if in_str:
                if c == "\\":
                    i += 2
                    continue
                if c == sc:
                    in_str = False
            else:
                if c in ('"', "'"):
                    in_str = True
                    sc = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
            i += 1
        n += _bytes_of(text[start:i])

    # (c) DATA.narratives.X = {...}
    for m in re.finditer(r"DATA\.narratives\.[A-Z]+\s*=\s*\{", text):
        start = m.start()
        i = m.end()
        depth = 1
        in_str = False
        sc = None
        while i < len(text) and depth > 0:
            c = text[i]
            if in_str:
                if c == "\\":
                    i += 2
                    continue
                if c == sc:
                    in_str = False
            else:
                if c in ('"', "'"):
                    in_str = True
                    sc = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
            i += 1
        n += _bytes_of(text[start:i])

    return n


# ---------------------------------------------------------------------------
# Audit driver
# ---------------------------------------------------------------------------

def audit_file(path: str | Path) -> AuditReport:
    """Decompose `path` into the PRD §4.0 byte categories."""
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    total = _bytes_of(text)

    # 1. Chart/image payload (base64 inside data: URIs)
    base64_payload = _base64_payload_bytes(text)
    _base64_image_count(text)

    # 2. Inline JS bodies (sum of every <script>...</script> body)
    inline_js = _sum_group(_SCRIPT_TAG_RE, text, 1)

    # 3. Inline CSS bodies (sum of every <style>...</style> body)
    inline_css = _sum_group(_STYLE_TAG_RE, text, 1)

    # 4. Company-specific data inside inline JS (subset of inline_js)
    company_data = _company_data_bytes(text)

    # 5. JS bytes that are NOT company data and NOT base64 charts
    # — this is the "renderer/logic" portion that's the refactor target for app.js
    js_non_data = max(0, inline_js - company_data - base64_payload)

    # 6. Structural HTML markup (everything outside script/style tags)
    js_total_span = _sum_matches(_SCRIPT_TAG_RE, text)  # includes tags themselves
    css_total_span = _sum_matches(_STYLE_TAG_RE, text)
    structural_html = max(0, total - js_total_span - css_total_span)

    # 7. Anything unaccounted for (rounding / overlap) — clamped to 0 so the table sums
    # to exactly 100% even when the script-tag span effectively equals the file size
    # (as it does for a monolithic single-script dashboard).
    accounted = structural_html + inline_css + js_non_data + company_data + base64_payload
    other = max(0, total - accounted)
    # If accounted > total (tag-span overcount), absorb the excess into 'other' as 0 and
    # rescale the dominant slice so the table still sums to total.
    if accounted > total:
        # Subtract the overcount from base64 (largest slice) so totals reconcile.
        overcount = accounted - total
        base64_payload = max(0, base64_payload - overcount)

    rows = [
        AuditCategory("Charts / inline images (base64)", base64_payload, "see 4.0.1"),
        AuditCategory("Inline JS (renderer/logic)", js_non_data, "extract → app.js"),
        AuditCategory("Inline JS (company data)", company_data, "data file"),
        AuditCategory("Inline CSS", inline_css, "extract → styles.css"),
        AuditCategory("Structural HTML markup", structural_html, "shell → index.html"),
        AuditCategory("Other / unaccounted", other, "—"),
    ]
    return AuditReport(source_path=str(p), total_bytes=total, rows=rows)


def render_markdown_report(
    report: AuditReport,
    *,
    n_stocks: int = 16,
    chart_strategy: str = "Client-side rendering from numeric data (PRD §4.0.1 option 1).",
) -> str:
    """Render the audit as `baseline_audit.md` content per PRD §4.0."""
    base64_count = _base64_image_count(Path(report.source_path).read_text(encoding="utf-8"))
    decoded_bytes = _data_url_decoded_bytes(Path(report.source_path).read_text(encoding="utf-8"))

    lines: list[str] = []
    lines.append("# Baseline Audit — Phase 0 (Root-Cause Diagnosis)")
    lines.append("")
    lines.append(
        "_Per PRD v2 §4.0, this audit is **blocking** for all subsequent refactor work. "
        "It measures the byte composition of the current monolithic dashboard so that "
        "target sizes (§11.1) and the chart strategy (§4.0.1) are derived from data, "
        "not guessed._"
    )
    lines.append("")
    lines.append("## Source")
    lines.append("")
    lines.append(f"- **File:** `{report.source_path}`")
    lines.append(f"- **Total bytes:** {report.total_bytes:,} ({report.total_bytes/1024/1024:.2f} MB)")
    lines.append(f"- **Stocks in file:** {n_stocks}")
    lines.append(f"- **Per-stock bytes:** {report.total_bytes // n_stocks:,} "
                 f"({report.total_bytes/n_stocks/1024:.0f} KB)")
    lines.append(f"- **Inline base64 images:** {base64_count}")
    lines.append(f"- **Decoded image bytes (approx):** {decoded_bytes:,} "
                 f"({decoded_bytes/1024/1024:.2f} MB)")
    lines.append("")
    lines.append("## Byte Decomposition")
    lines.append("")
    lines.append("| Component | Bytes | % of total | Per-stock | Disposition |")
    lines.append("|---|---:|---:|---:|---|")
    for row, pct, per_stock in report.with_percentages():
        lines.append(
            f"| {row.name} | {row.bytes_:,} | {pct:.1f}% | "
            f"{per_stock:,.0f} | {row.disposition} |"
        )
    lines.append(f"| **TOTAL** | **{report.total_bytes:,}** | **100.0%** | "
                 f"**{report.total_bytes//n_stocks:,}** | — |")
    lines.append("")

    dominant = report.dominant_contributor
    dom_pct = dominant.bytes_ / report.total_bytes * 100
    lines.append("## Dominant Contributor")
    lines.append("")
    lines.append(
        f"**{dominant.name}** at {dominant.bytes_:,} bytes "
        f"({dom_pct:.1f}% of the file). This is the byte category the refactor "
        f"must reduce at the source — moving these bytes to a different file does "
        f"not pass the payload-reduction acceptance gate (PRD §17.8)."
    )
    lines.append("")
    lines.append("## Chart Strategy Decision (PRD §4.0.1)")
    lines.append("")
    lines.append(f"**Selected:** {chart_strategy}")
    lines.append("")
    lines.append(
        "Rationale: per the PRD's preferred option, charts will be rendered "
        "client-side from numeric values already in the data file (ATM IV by expiry, "
        "OI by strike, max-pain per expiry, SMA/RSI/ADX/ATR, peer-comp multiples). "
        "Marginal byte cost is ~zero — charts become a function of data, not stored "
        "assets. Inlined base64 raster images per company are prohibited in the "
        "refactored package."
    )
    lines.append("")
    lines.append("## Target Sizes (derived from this baseline)")
    lines.append("")
    lines.append(
        f"Per PRD §11.1, `dashboard-data.js` for 30 stocks must be **≤ 20% of the "
        f"audited current data+chart bytes** after charts move to data-driven rendering. "
        f"Current data+chart bytes (16 stocks) = "
        f"{(report.rows[0].bytes_ + report.rows[2].bytes_):,}. "
        f"Extrapolated to 30 stocks: "
        f"~{int((report.rows[0].bytes_ + report.rows[2].bytes_) * 30 / n_stocks):,} bytes. "
        f"**Target ceiling for `dashboard-data.js` at 30 stocks: "
        f"{int((report.rows[0].bytes_ + report.rows[2].bytes_) * 30 / n_stocks * 0.20):,} bytes** "
        f"(20% of extrapolated baseline)."
    )
    lines.append("")
    lines.append(
        "Hard circuit-breaker (§11.1): if `dashboard-data.js` exceeds 8 MB at any "
        "stage, the per-ticker chunking plan (§20 Phase 3) is triggered immediately."
    )
    lines.append("")
    lines.append("## Acceptance Gate")
    lines.append("")
    lines.append(
        "Post-refactor, the equivalent of this audit table must be re-measured "
        "on the new package (§17.8). A refactor that only relocates bytes without "
        "reducing total payload fails the build."
    )
    lines.append("")
    return "\n".join(lines)
