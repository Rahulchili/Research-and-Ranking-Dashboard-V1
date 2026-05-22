"""Emit safety: dashboard-data.js is `JSON.parse('...')` form, escape survives
quotes/newlines/unicode/separators, and `.js` ↔ `.json` round-trip is deep-equal.
Raw object literal form is asserted absent."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from dashboard_build.emit import (
    js_escape_for_string_literal,
    payload_to_canonical_json,
    payload_to_js_wrapper,
    round_trip_check,
    write_emitted_files,
)


def test_js_wrapper_uses_json_parse(good_payload) -> None:
    js = payload_to_js_wrapper(good_payload)
    assert "window.DASHBOARD_DATA = JSON.parse('" in js
    assert ");\n" in js  # closes properly


def test_no_raw_object_literal_present(good_payload) -> None:
    js = payload_to_js_wrapper(good_payload)
    # The forbidden form is `= {` immediately after the global assignment.
    forbidden = "window.DASHBOARD_DATA = {"
    assert forbidden not in js


def test_escape_handles_single_quote() -> None:
    raw = "He said 'hello'"
    esc = js_escape_for_string_literal(raw)
    assert "\\'" in esc
    # And the unescape (reverse loop in round_trip_check) recovers the original.
    f"window.DASHBOARD_DATA = JSON.parse('{esc.replace(chr(34), chr(34))}')\n"
    # Build a minimal JSON to round-trip the escape itself.
    payload_text = json.dumps({"x": raw}, ensure_ascii=False)
    esc_payload = js_escape_for_string_literal(payload_text)
    js2 = f"window.DASHBOARD_DATA = JSON.parse('{esc_payload}');\n"
    obj = round_trip_check(js2)
    assert obj == {"x": raw}


def test_escape_handles_newline_tab_backslash() -> None:
    raw = "line1\nline2\twith\\backslash"
    text = json.dumps({"x": raw}, ensure_ascii=False)
    esc = js_escape_for_string_literal(text)
    js = f"window.DASHBOARD_DATA = JSON.parse('{esc}');\n"
    obj = round_trip_check(js)
    assert obj == {"x": raw}


def test_escape_handles_u2028_u2029() -> None:
    """Critical: these chars are valid in JSON but break JS string literals."""
    raw = "line sep para"
    text = json.dumps({"x": raw}, ensure_ascii=False)
    esc = js_escape_for_string_literal(text)
    # The two separators must not appear literally in the escaped form.
    assert " " not in esc
    assert " " not in esc
    js = f"window.DASHBOARD_DATA = JSON.parse('{esc}');\n"
    obj = round_trip_check(js)
    assert obj == {"x": raw}


def test_canonical_json_is_deterministic(good_payload) -> None:
    a = payload_to_canonical_json(good_payload)
    b = payload_to_canonical_json(good_payload)
    assert a == b
    # And it parses back to the same Python object.
    assert json.loads(a) == json.loads(b)


def test_roundtrip_js_to_dict(good_payload) -> None:
    js = payload_to_js_wrapper(good_payload)
    obj = round_trip_check(js)
    canonical = json.loads(payload_to_canonical_json(good_payload))
    assert obj == canonical


def test_round_trip_check_rejects_raw_literal() -> None:
    bad = "window.DASHBOARD_DATA = {schemaVersion: '1.0.0'};\n"
    with pytest.raises(ValueError):
        round_trip_check(bad)


def test_write_emitted_files_writes_both(tmp_path: Path, good_payload) -> None:
    json_p = tmp_path / "data" / "dashboard-data.json"
    js_p = tmp_path / "data" / "dashboard-data.js"
    write_emitted_files(good_payload, json_path=json_p, js_path=js_p)
    assert json_p.exists() and js_p.exists()
    # .json is pretty-printed; deep-equal to round-tripped .js
    json_obj = json.loads(json_p.read_text(encoding="utf-8"))
    js_obj = round_trip_check(js_p.read_text(encoding="utf-8"))
    assert json_obj == js_obj
