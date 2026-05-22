# Investment Dashboard build harness.
# `make verify` is the single command the iterative quality loop calls.

PY ?= python3

.PHONY: install lint typecheck test verify generate clean add-ticker add-batch

install:
	$(PY) -m pip install -e ".[dev]"

lint:
	ruff check dashboard_build tests

typecheck:
	mypy --strict dashboard_build

test:
	pytest -q

generate:
	$(PY) generate_data.py
	$(PY) build_bundle.py

verify: generate
	$(PY) -m dashboard_build.verify

clean:
	rm -f data/dashboard-data.js data/dashboard-data.json data/tickers-bundle.js

# Add a new ticker to the dashboard.
#
# SIMPLE USAGE (auto-finds the folder under the workspace):
#   make add-ticker T=NFLX
#
#   The pipeline looks for ../NFLX/{Earnings,Options,Stock Price Data,Transcripts}/
#   and reads every file in those subfolders automatically.
#
# OVERRIDE FOLDER (if your files live elsewhere):
#   make add-ticker T=NFLX DIR=/path/to/nflx_inputs
#
# The pipeline then:
#   1. Reads stock prices → computes TA (RSI, SMA, MACD, 52w, etc.)
#   2. Parses SEC filings → fundamentals quarters
#   3. Mines transcripts → forward claims (MCS rows)
#   4. Parses options chain → IV term structure + OI
#   5. Reads FactSet JSON (if present) → peer comp
#   6. Writes 5 per-ticker JSONs under data/
#   7. Registers ticker in SUPPLEMENTARY_TICKERS
#   8. Re-runs generate_data + build_bundle → dashboard sees the new ticker.
add-ticker:
	@if [ -z "$(T)" ]; then \
		echo "ERROR: Usage: make add-ticker T=NFLX  (or DIR=... to override path)"; exit 1; \
	fi
	$(PY) add_ticker.py $(T) $(DIR)
	@echo ""
	@echo "✓ $(T) added. Polish data/narratives/$(T).json (optional) then reload the browser."

# Add multiple tickers in one go.
# Usage:
#   make add-batch T="NFLX,MSFT,V,WMT,NKE,CVX"
# Each ticker's folder is auto-resolved under the workspace.
add-batch:
	@if [ -z "$(T)" ]; then \
		echo "ERROR: Usage: make add-batch T=\"NFLX,MSFT,V,WMT\""; exit 1; \
	fi
	$(PY) add_ticker.py "$(T)"
	@echo ""
	@echo "✓ Batch complete. Polish narratives if you want, then reload the browser."
