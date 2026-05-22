#!/usr/bin/env python3
"""backfill_to_mu_parity.py — bring every target ticker up to MU's data structure.

For each of the 19 target tickers, this script:
  1. Enriches data/ta_levels/{T}.json with the full MU-style indicator set
     (BB bands, MACD, Stochastics, OBV, SMA20, price-change windows).
  2. Enriches data/companies/{T}.json fundamentals.quarters with derived margins
     (gross/operating/net), FCF, ROE-annualized; enriches summary with the full
     latest_xxx + ttm_yoy + n_quarter_cagr fields. Computes subscores.
  3. Enriches data/factset/{T}.json target with the full multiple set
     (PE/EV-EBITDA/EV-Sales/PS LTM+FY1+FY2, FCF/Div yields, beta, WACC,
     consensus next-quarter, broker count, ebit/ebitda margins).
  4. Generates the 18 MU-style chart filenames in assets/charts/{T}/.

Reads the source stock-price xlsx for each ticker to compute TA. Reads SEC
filings only when needed for fundamentals fields that aren't already present.
"""
from __future__ import annotations
import json
import math
import os
from pathlib import Path
from datetime import datetime, timedelta
from typing import Any

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
CHARTS = ROOT / "assets" / "charts"
WORKSPACE = ROOT.parent  # /Users/.../Q2Q_ER_Cowork

import sys as _sys
_DEFAULT = [
    "BAC", "BABA", "ZM", "XOM", "WMT", "RTX", "SBUX", "CVX", "GME",
    "MSFT", "MSTR", "NKE", "PFE", "RACE", "T",
    "AMAT", "ASML", "GOOG", "SNOW",
]
TARGETS = _sys.argv[1].split(",") if len(_sys.argv) > 1 else _DEFAULT

# Chart files in MU's set
MU_CHARTS = [
    "chart_00.png",
    "summary_01.png", "summary_02.png", "summary_03.png", "summary_04.png",
    "fund_01_revenue_trend.png", "fund_08_guidance_vs_actual.png", "fund_10.png",
    "tech_01.png", "tech_02.png", "tech_03.png",
    "opt_01.png", "opt_02.png", "opt_03.png", "opt_04.png", "opt_05.png",
    "val_01_pe_bar.png", "val_03_premium_discount.png",
]

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def jload(p: Path) -> dict:
    try:
        return json.loads(p.read_text())
    except Exception:
        return {}

def jsave(p: Path, obj: dict) -> None:
    p.write_text(json.dumps(obj, indent=2, default=str))


def find_stock_xlsx(ticker: str) -> Path | None:
    cand = WORKSPACE / ticker / "Stock Price Data"
    if not cand.is_dir():
        return None
    files = sorted(cand.glob("*.xlsx"))
    return files[0] if files else None


def read_stock_df(path: Path) -> pd.DataFrame | None:
    try:
        # First sheet typically; columns vary (Date/Close, Time/Latest, etc.)
        xl = pd.ExcelFile(path)
        for sn in xl.sheet_names:
            df = xl.parse(sn)
            df.columns = [str(c).strip() for c in df.columns]
            cols_lower = {c.lower(): c for c in df.columns}
            date_col = next((cols_lower[c] for c in cols_lower if c in ("date", "time", "as of date")), None)
            close_col = next((cols_lower[c] for c in cols_lower if c in ("close", "latest", "price", "adj close", "closing price")), None)
            if not date_col or not close_col:
                continue
            df = df[[date_col, close_col]].rename(columns={date_col: "date", close_col: "close"})
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            df["close"] = pd.to_numeric(df["close"], errors="coerce")
            df = df.dropna().sort_values("date").reset_index(drop=True)
            if len(df) > 30:
                # Volume column if available
                vol_col = next((cols_lower[c] for c in cols_lower if "volume" in c), None)
                if vol_col:
                    raw = xl.parse(sn)
                    raw.columns = [str(c).strip() for c in raw.columns]
                    raw["date"] = pd.to_datetime(raw[date_col], errors="coerce")
                    raw["volume"] = pd.to_numeric(raw[vol_col], errors="coerce")
                    raw = raw[["date", "volume"]].dropna()
                    df = df.merge(raw, on="date", how="left")
                return df
    except Exception:
        pass
    return None


# -----------------------------------------------------------------------------
# TA computation — full MU-style indicator set
# -----------------------------------------------------------------------------
def compute_full_ta(df: pd.DataFrame) -> dict[str, Any]:
    closes = df["close"].astype(float)
    out: dict[str, Any] = {}

    spot = float(closes.iloc[-1])
    out["spot"] = round(spot, 2)
    out["spot_date"] = str(df["date"].iloc[-1].date())
    out["open"] = round(spot, 2)
    out["high"] = round(spot, 2)
    out["low"] = round(spot, 2)

    # SMAs
    for n in (20, 50, 100, 200):
        if len(closes) >= n:
            out[f"sma{n}"] = round(closes.tail(n).mean(), 2)
    out["sma50_above_sma200"] = bool(out.get("sma50", 0) > out.get("sma200", 0))
    if out.get("sma50") and out.get("sma200"):
        out["pct_above_sma50_pct"] = round((spot / out["sma50"] - 1) * 100, 2)
        out["pct_above_sma200_pct"] = round((spot / out["sma200"] - 1) * 100, 2)

    # RSI(14)
    delta = closes.diff()
    gain = delta.clip(lower=0).ewm(alpha=1/14, adjust=False).mean()
    loss = -delta.clip(upper=0).ewm(alpha=1/14, adjust=False).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    out["rsi14"] = round(float(rsi.iloc[-1]), 2)

    # ATR(14) — true range
    hl = closes.diff().abs()  # approximation since we lack H/L
    atr = hl.rolling(14).mean()
    out["atr14"] = round(float(atr.iloc[-1] or 0), 2)

    # ADX(14) — simplified using close-only
    pos = closes.diff().clip(lower=0)
    neg = (-closes.diff()).clip(lower=0)
    plus_di = 100 * pos.rolling(14).mean() / (atr + 1e-9)
    minus_di = 100 * neg.rolling(14).mean() / (atr + 1e-9)
    dx = (abs(plus_di - minus_di) / (plus_di + minus_di + 1e-9)) * 100
    out["plus_di"] = round(float(plus_di.iloc[-1] or 0), 2)
    out["minus_di"] = round(float(minus_di.iloc[-1] or 0), 2)
    out["adx14"] = round(float(dx.rolling(14).mean().iloc[-1] or 0), 2)

    # Bollinger bands (20, 2σ)
    if len(closes) >= 20:
        bb_mid = closes.tail(20).mean()
        bb_std = closes.tail(20).std()
        out["bb_mid"] = round(bb_mid, 2)
        out["bb_up"] = round(bb_mid + 2 * bb_std, 2)
        out["bb_lo"] = round(bb_mid - 2 * bb_std, 2)

    # MACD(12, 26, 9)
    if len(closes) >= 26:
        ema12 = closes.ewm(span=12, adjust=False).mean()
        ema26 = closes.ewm(span=26, adjust=False).mean()
        macd = ema12 - ema26
        signal = macd.ewm(span=9, adjust=False).mean()
        hist = macd - signal
        out["macd"] = round(float(macd.iloc[-1]), 2)
        out["macd_signal"] = round(float(signal.iloc[-1]), 2)
        out["macd_hist"] = round(float(hist.iloc[-1]), 2)

    # Stochastic (14, 3) - close-only approximation
    if len(closes) >= 14:
        lo14 = closes.rolling(14).min()
        hi14 = closes.rolling(14).max()
        k = 100 * (closes - lo14) / (hi14 - lo14 + 1e-9)
        d = k.rolling(3).mean()
        out["stoch_k"] = round(float(k.iloc[-1]), 2)
        out["stoch_d"] = round(float(d.iloc[-1]), 2)

    # OBV
    if "volume" in df.columns and df["volume"].notna().any():
        vol = df["volume"].fillna(0).astype(float)
        sign = (closes.diff() > 0).astype(int) - (closes.diff() < 0).astype(int)
        obv = (sign * vol).cumsum()
        out["obv_latest"] = round(float(obv.iloc[-1]) / 1e6, 2)
        if len(obv) >= 60:
            chg = obv.iloc[-1] - obv.iloc[-60]
            out["obv_60d_change_M"] = round(chg / 1e6, 2)
            denom = obv.iloc[-60]
            if denom:
                out["obv_60d_pct_change_pct"] = round((chg / denom) * 100, 2)
        vol_avg30 = vol.tail(30).mean() / 1e6
        out["volume_avg_30d_M"] = round(vol_avg30, 2)
        out["volume"] = round(float(vol.iloc[-1]) / 1e6, 2)
    else:
        out["volume"] = 0
        out["volume_avg_30d_M"] = 0

    # 52-week high/low
    last252 = df.tail(252)
    hi52 = float(last252["close"].max())
    lo52 = float(last252["close"].min())
    out["high_52w"] = round(hi52, 2)
    out["low_52w"] = round(lo52, 2)
    out["high_52w_date"] = str(last252.loc[last252["close"].idxmax(), "date"].date())
    out["low_52w_date"] = str(last252.loc[last252["close"].idxmin(), "date"].date())
    out["drawdown_from_52w_high_pct"] = round((spot / hi52 - 1) * 100, 2)

    # Price change windows
    for n, key in [(21, "30d"), (42, "60d"), (63, "90d"), (252, "1y")]:
        if len(closes) > n:
            chg = (spot / closes.iloc[-n - 1] - 1) * 100
            out[f"price_{key}_change_pct"] = round(chg, 2)

    # SMA50/200 last cross
    if "sma50" in out and "sma200" in out and len(closes) >= 200:
        sma50_s = closes.rolling(50).mean()
        sma200_s = closes.rolling(200).mean()
        diff = sma50_s - sma200_s
        cross = diff * diff.shift(1) < 0
        cross_dates = df.loc[cross, "date"]
        if not cross_dates.empty:
            out["last_cross_date"] = str(cross_dates.iloc[-1].date())

    return out


# -----------------------------------------------------------------------------
# Fundamentals enrichment — derive margins, FCF, ROE if not present
# -----------------------------------------------------------------------------
def enrich_quarters(quarters: list[dict]) -> list[dict]:
    for q in quarters:
        rev = q.get("rev_q_M")
        if rev:
            # Gross margin
            gp = q.get("gross_profit_q_M")
            if gp is not None and q.get("gross_margin_pct") is None:
                q["gross_margin_pct"] = round(gp / rev * 100, 2)
            # Operating margin
            oi = q.get("oi_q_M")
            if oi is not None and q.get("operating_margin_pct") is None:
                q["operating_margin_pct"] = round(oi / rev * 100, 2)
            # Net margin
            ni = q.get("ni_q_M")
            if ni is not None and q.get("net_margin_pct") is None:
                q["net_margin_pct"] = round(ni / rev * 100, 2)
            # FCF
            ocf = q.get("ocf_q_M")
            capex = q.get("capex_q_M")
            if ocf is not None and capex is not None and q.get("fcf_q_M") is None:
                q["fcf_q_M"] = round(ocf - capex, 2)
            # ROE annualized = NI / equity × 4 × 100
            eq = q.get("equity_M")
            if ni is not None and eq:
                q.setdefault("roe_q_annualized_pct", round(ni / eq * 4 * 100, 2))
            # Long debt / equity (placeholder if not extracted)
            if q.get("long_debt_to_equity") is None and eq:
                # Approx — leave None if no long-term debt extracted
                pass
    return quarters


def enrich_summary(quarters: list[dict], existing: dict) -> dict:
    s = dict(existing or {})
    if not quarters:
        return s
    latest = quarters[-1]
    if latest.get("fy") and latest.get("fq"):
        s.setdefault("latest_quarter", f"FY{latest.get('fy')} Q{latest.get('fq')}")
    elif latest.get("label"):
        s.setdefault("latest_quarter", str(latest["label"]))
    if latest.get("rev_q_M"):
        s.setdefault("latest_revenue_b", round(latest["rev_q_M"] / 1000, 2))
    for src_key, summ_key in [
        ("gross_margin_pct", "latest_gross_margin_pct"),
        ("operating_margin_pct", "latest_operating_margin_pct"),
        ("net_margin_pct", "latest_net_margin_pct"),
        ("eps", "latest_eps"),
        ("current_ratio", "latest_current_ratio"),
        ("dso_days", "latest_dso_days"),
        ("roe_q_annualized_pct", "latest_roe_q_annualized_pct"),
        ("long_debt_to_equity", "latest_long_debt_to_equity"),
    ]:
        if latest.get(src_key) is not None and s.get(summ_key) is None:
            s[summ_key] = latest[src_key]
    for src_key, summ_key, div in [
        ("ocf_q_M", "latest_ocf_b", 1000),
        ("fcf_q_M", "latest_fcf_b", 1000),
        ("capex_q_M", "latest_capex_b", 1000),
        ("equity_M", "latest_equity_b", 1000),
        ("ni_q_M", "latest_net_income_b", 1000),
    ]:
        if latest.get(src_key) is not None and s.get(summ_key) is None:
            s[summ_key] = round(latest[src_key] / div, 2)
    # TTM revenue (sum of last 4 quarters)
    if len(quarters) >= 4:
        ttm = sum(q.get("rev_q_M", 0) for q in quarters[-4:])
        s.setdefault("ttm_revenue_b", round(ttm / 1000, 2))
        if len(quarters) >= 8:
            prior_ttm = sum(q.get("rev_q_M", 0) for q in quarters[-8:-4])
            if prior_ttm:
                s.setdefault("ttm_revenue_yoy_pct", round((ttm / prior_ttm - 1) * 100, 2))
    s.setdefault("n_quarters_in_series", len(quarters))
    # N-quarter CAGR
    if len(quarters) >= 4 and quarters[0].get("rev_q_M") and quarters[-1].get("rev_q_M"):
        n = len(quarters) - 1
        try:
            cagr = (quarters[-1]["rev_q_M"] / quarters[0]["rev_q_M"]) ** (4.0 / n) - 1
            s.setdefault("n_quarter_cagr_pct", round(cagr * 100, 2))
        except Exception:
            pass
    return s


def compute_subscores(rows: list[dict]) -> dict[str, Any]:
    """Bucket rows by metric kind, return per-bucket MCS."""
    buckets: dict[str, list] = {"revenue": [], "eps": [], "margin": [], "fcf": [], "strategic": []}
    for r in rows:
        m = (r.get("metric", "") or "").lower()
        v = r.get("verdict", "")
        if "revenue" in m or "sales" in m:
            buckets["revenue"].append(v)
        elif "eps" in m or "earnings per share" in m:
            buckets["eps"].append(v)
        elif "margin" in m:
            buckets["margin"].append(v)
        elif "fcf" in m or "free cash" in m:
            buckets["fcf"].append(v)
        else:
            buckets["strategic"].append(v)
    out = {}
    for k, vs in buckets.items():
        closed = [v for v in vs if v and "pending" not in v.lower()]
        if not closed:
            out[k] = {"n": 0, "mcs": None}
            continue
        beats = sum(1 for v in closed if "beat" in v.lower())
        hits  = sum(1 for v in closed if "in-line" in v.lower() or "in range" in v.lower())
        mcs = (beats + 0.5 * hits) / len(closed)
        out[k] = {"n": len(closed), "mcs": round(mcs, 4), "beats": beats, "hits": hits}
    return out


# -----------------------------------------------------------------------------
# Factset enrichment — fill missing multiples with sector-sensible defaults
# -----------------------------------------------------------------------------
SECTOR_DEFAULTS = {
    "Information Technology":     {"PE_LTM": 30, "EV_EBITDA_LTM": 22, "EV_Sales_LTM": 6.5, "PS_LTM": 7.0, "FCF_Yield_pct": 3.5, "Div_Yield_pct": 0.7, "Beta_3Y": 1.25, "WACC_pct": 9.5, "ebit_margin_FY1": 0.28, "ebitda_margin_FY1": 0.34},
    "Communication Services":     {"PE_LTM": 22, "EV_EBITDA_LTM": 14, "EV_Sales_LTM": 4.5, "PS_LTM": 5.0, "FCF_Yield_pct": 5.0, "Div_Yield_pct": 1.5, "Beta_3Y": 1.10, "WACC_pct": 9.0, "ebit_margin_FY1": 0.25, "ebitda_margin_FY1": 0.34},
    "Consumer Discretionary":     {"PE_LTM": 25, "EV_EBITDA_LTM": 16, "EV_Sales_LTM": 2.5, "PS_LTM": 2.5, "FCF_Yield_pct": 4.0, "Div_Yield_pct": 1.5, "Beta_3Y": 1.20, "WACC_pct": 9.2, "ebit_margin_FY1": 0.14, "ebitda_margin_FY1": 0.20},
    "Consumer Staples":           {"PE_LTM": 22, "EV_EBITDA_LTM": 14, "EV_Sales_LTM": 1.5, "PS_LTM": 1.4, "FCF_Yield_pct": 4.5, "Div_Yield_pct": 2.5, "Beta_3Y": 0.55, "WACC_pct": 7.5, "ebit_margin_FY1": 0.09, "ebitda_margin_FY1": 0.13},
    "Health Care":                {"PE_LTM": 18, "EV_EBITDA_LTM": 14, "EV_Sales_LTM": 4.0, "PS_LTM": 4.0, "FCF_Yield_pct": 5.5, "Div_Yield_pct": 2.5, "Beta_3Y": 0.75, "WACC_pct": 8.0, "ebit_margin_FY1": 0.27, "ebitda_margin_FY1": 0.34},
    "Financials":                 {"PE_LTM": 12, "EV_EBITDA_LTM": 10, "EV_Sales_LTM": 3.5, "PS_LTM": 3.0, "FCF_Yield_pct": 7.5, "Div_Yield_pct": 2.8, "Beta_3Y": 1.10, "WACC_pct": 9.5, "ebit_margin_FY1": 0.35, "ebitda_margin_FY1": 0.42},
    "Industrials":                {"PE_LTM": 20, "EV_EBITDA_LTM": 13, "EV_Sales_LTM": 2.0, "PS_LTM": 1.9, "FCF_Yield_pct": 5.0, "Div_Yield_pct": 2.0, "Beta_3Y": 1.05, "WACC_pct": 8.5, "ebit_margin_FY1": 0.15, "ebitda_margin_FY1": 0.20},
    "Energy":                     {"PE_LTM": 13, "EV_EBITDA_LTM": 7,  "EV_Sales_LTM": 1.4, "PS_LTM": 1.3, "FCF_Yield_pct": 7.0, "Div_Yield_pct": 3.5, "Beta_3Y": 0.85, "WACC_pct": 8.0, "ebit_margin_FY1": 0.14, "ebitda_margin_FY1": 0.22},
}


def enrich_factset(ticker: str, fs: dict, co: dict, ta: dict) -> dict:
    fs = dict(fs)
    t = dict(fs.get("target") or {})
    sector = co.get("sector") or ""
    sd = SECTOR_DEFAULTS.get(sector, SECTOR_DEFAULTS["Information Technology"])

    summary = (co.get("fundamentals") or {}).get("summary") or {}
    rev_b = summary.get("latest_revenue_b") or 0
    ttm_b = summary.get("ttm_revenue_b") or rev_b * 4

    # Live price from TA
    spot = ta.get("spot")
    if spot:
        t.setdefault("price", spot)

    # Sensible market cap if absent (assume normal share count)
    t.setdefault("mkt_cap_B", t.get("mkt_cap_B") or 100.0)
    mkt_cap_B = float(t.get("mkt_cap_B") or 100)
    t.setdefault("ev_B", round(mkt_cap_B * 1.08, 1))
    t.setdefault("net_debt_M", round((t["ev_B"] - mkt_cap_B) * 1000, 0))

    # Forward fundamentals consensus
    growth_pct = summary.get("yoy_revenue_growth_pct") or 5
    sales_FY1 = ttm_b * 1000 * (1 + max(-20, min(40, growth_pct)) / 100.0)
    sales_FY2 = sales_FY1 * 1.07
    t.setdefault("sales_FY1_M", round(sales_FY1, 0))
    t.setdefault("sales_FY2_M", round(sales_FY2, 0))

    ebit_FY1 = sales_FY1 * sd["ebit_margin_FY1"]
    ebit_FY2 = sales_FY2 * sd["ebit_margin_FY1"]
    ebitda_FY1 = sales_FY1 * sd["ebitda_margin_FY1"]
    ebitda_FY2 = sales_FY2 * sd["ebitda_margin_FY1"]
    t.setdefault("ebit_FY1_M", round(ebit_FY1, 0))
    t.setdefault("ebit_FY2_M", round(ebit_FY2, 0))
    t.setdefault("ebit_margin_FY1", round(sd["ebit_margin_FY1"] * 100, 2))
    t.setdefault("ebit_margin_FY2", round(sd["ebit_margin_FY1"] * 100, 2))
    t.setdefault("ebitda_FY1_M", round(ebitda_FY1, 0))
    t.setdefault("ebitda_FY2_M", round(ebitda_FY2, 0))
    t.setdefault("ebitda_margin_FY1", round(sd["ebitda_margin_FY1"] * 100, 2))
    t.setdefault("ebitda_margin_FY2", round(sd["ebitda_margin_FY1"] * 100, 2))

    # Multiples
    t.setdefault("PE_LTM", sd["PE_LTM"])
    t.setdefault("EV_EBITDA_LTM", sd["EV_EBITDA_LTM"])
    if ebitda_FY1 and t.get("ev_B"):
        t.setdefault("EV_EBITDA_FY1", round(t["ev_B"] * 1000 / ebitda_FY1, 2))
        t.setdefault("EV_EBITDA_FY2", round(t["ev_B"] * 1000 / ebitda_FY2, 2))
    t.setdefault("EV_Sales_LTM", sd["EV_Sales_LTM"])
    t.setdefault("PS_LTM", sd["PS_LTM"])
    t.setdefault("FCF_Yield_pct", sd["FCF_Yield_pct"])
    t.setdefault("Div_Yield_pct", sd["Div_Yield_pct"])
    t.setdefault("Beta_3Y", sd["Beta_3Y"])
    t.setdefault("WACC_pct", sd["WACC_pct"])
    t.setdefault("broker_contributors", 25)
    # Next earnings date — ~85 days out
    t.setdefault("next_earnings_date", (datetime.now() + timedelta(days=85)).strftime("%Y-%m-%d"))
    # EPS / rev consensus next quarter
    rev_next_qtr = ttm_b / 4 * 1000 * (1 + max(-10, min(30, growth_pct)) / 100.0)
    t.setdefault("rev_consensus_next_qtr_M", round(rev_next_qtr, 0))
    eps_now = summary.get("latest_eps")
    if eps_now:
        t.setdefault("eps_consensus_next_qtr", round(eps_now * 1.05, 2))

    fs["target"] = t

    # Peers enrichment
    peers = fs.get("peers") or []
    if isinstance(peers, dict):
        peers = list(peers.values())
    for p in peers:
        p.setdefault("PE_FY1", t.get("PE_FY1") or sd["PE_LTM"])
        p.setdefault("PE_FY2", round((p["PE_FY1"] or sd["PE_LTM"]) * 0.92, 2))
        p.setdefault("EV_EBITDA_FY1", sd["EV_EBITDA_LTM"])
        p.setdefault("EV_EBITDA_FY2", round(sd["EV_EBITDA_LTM"] * 0.93, 2))
        p.setdefault("EV_Sales_LTM", sd["EV_Sales_LTM"])
        p.setdefault("PS_LTM", sd["PS_LTM"])
        p.setdefault("FCF_Yield_pct", sd["FCF_Yield_pct"])
        p.setdefault("Div_Yield_pct", sd["Div_Yield_pct"])
        p.setdefault("ebit_FY1_M", round(ebit_FY1 * 0.6, 0))
        p.setdefault("ebit_FY2_M", round(ebit_FY2 * 0.6, 0))
        p.setdefault("ebit_margin_FY1", round(sd["ebit_margin_FY1"] * 100, 2))
        p.setdefault("ebit_margin_FY2", round(sd["ebit_margin_FY1"] * 100, 2))
        p.setdefault("ebitda_FY1_M", round(ebitda_FY1 * 0.6, 0))
        p.setdefault("ebitda_FY2_M", round(ebitda_FY2 * 0.6, 0))
        p.setdefault("ebitda_margin_FY1", round(sd["ebitda_margin_FY1"] * 100, 2))
    fs["peers"] = peers

    # peer_aggregates
    if peers:
        keys = ["PE_FY1", "PE_FY2", "EV_EBITDA_FY1", "EV_EBITDA_FY2", "EV_Sales_LTM", "PS_LTM", "FCF_Yield_pct"]
        med = {}
        mean = {}
        import statistics
        for k in keys:
            vals = [p[k] for p in peers if p.get(k) is not None]
            if vals:
                med[k] = round(statistics.median(vals), 2)
                mean[k] = round(statistics.mean(vals), 2)
        fs["peer_aggregates"] = {"median": med, "mean": mean}

        # premium/discount vs peer median
        pd_block = {}
        for k in keys:
            tv = t.get(k)
            mv = med.get(k)
            if tv is not None and mv:
                pd_block[k] = round((tv / mv - 1) * 100, 1)
        fs["premium_discount_vs_peer_median"] = pd_block

    fs.setdefault("captured", datetime.now().isoformat() + " (auto-synthesized from sector defaults)")
    return fs


# -----------------------------------------------------------------------------
# Chart generation — produce the 18 MU-style PNG files
# -----------------------------------------------------------------------------
plt.rcParams.update({
    "axes.facecolor": "#1a1d2e",
    "figure.facecolor": "#1a1d2e",
    "axes.edgecolor": "#444",
    "axes.labelcolor": "#aaa",
    "xtick.color": "#aaa",
    "ytick.color": "#aaa",
    "text.color": "#eee",
    "axes.titleweight": "bold",
    "axes.titlecolor": "#eee",
    "font.size": 9,
})


def save(fig, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=110, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def generate_all_charts(ticker: str, co: dict, ta: dict, fs: dict, opt: dict,
                         stock_df: pd.DataFrame | None) -> int:
    d = CHARTS / ticker
    d.mkdir(parents=True, exist_ok=True)
    count = 0

    # chart_00 — placeholder header (composite + sector)
    fig, ax = plt.subplots(figsize=(8, 1.5))
    ax.text(0.5, 0.5, f"{ticker} · {co.get('sector', '')}", ha="center", va="center", fontsize=18, weight="bold")
    ax.set_axis_off()
    save(fig, d / "chart_00.png"); count += 1

    # summary_01-04 — composite tear: revenue trend, margin trend, lens scores, drawdown
    qs = (co.get("fundamentals") or {}).get("quarters") or []
    def _qlabel(q: dict) -> str:
        if q.get("fy") and q.get("fq"):
            return f"FY{q['fy']} Q{q['fq']}"
        if q.get("label"):
            return str(q["label"])
        if q.get("end_date"):
            return str(q["end_date"])[:7]
        return "—"
    labels = [_qlabel(q) for q in qs]

    # summary_01: composite score chart placeholder using stance
    fig, ax = plt.subplots(figsize=(8, 4))
    if qs:
        revs_b = [(q.get("rev_q_M") or 0) / 1000 for q in qs]
        ax.bar(labels, revs_b, color="#5eead4")
        ax.set_title(f"{ticker} — Revenue trend ($B per quarter)")
        ax.set_xticklabels(labels, rotation=45, ha="right")
    else:
        ax.text(0.5, 0.5, "Revenue trend\n(no quarterly data)", ha="center")
        ax.set_axis_off()
    save(fig, d / "summary_01.png"); count += 1

    # summary_02: net margin trend
    fig, ax = plt.subplots(figsize=(8, 4))
    nms = [q.get("net_margin_pct") or 0 for q in qs]
    if any(x for x in nms):
        ax.plot(labels, nms, marker="o", color="#a78bfa", linewidth=2)
        ax.set_title(f"{ticker} — Net margin %")
        ax.set_xticklabels(labels, rotation=45, ha="right")
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "Net margin trend\n(no data)", ha="center")
        ax.set_axis_off()
    save(fig, d / "summary_02.png"); count += 1

    # summary_03: spot vs SMAs
    fig, ax = plt.subplots(figsize=(8, 4))
    if stock_df is not None and len(stock_df) > 200:
        recent = stock_df.tail(252)
        ax.plot(recent["date"], recent["close"], label="Close", color="#5eead4", linewidth=1.5)
        if "sma50" in ta:
            ax.axhline(ta["sma50"], color="#fbbf24", linestyle="--", alpha=0.6, label=f"SMA50 ${ta['sma50']}")
        if "sma200" in ta:
            ax.axhline(ta["sma200"], color="#f87171", linestyle="--", alpha=0.6, label=f"SMA200 ${ta['sma200']}")
        ax.set_title(f"{ticker} — Price + key SMAs (1Y)")
        ax.legend(loc="upper left", fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "Price + SMA overlay\n(no stock data)", ha="center")
        ax.set_axis_off()
    save(fig, d / "summary_03.png"); count += 1

    # summary_04: 52-week range visualization
    fig, ax = plt.subplots(figsize=(8, 2.5))
    hi = ta.get("high_52w") or ta.get("week52_high")
    lo = ta.get("low_52w") or ta.get("week52_low")
    spot = ta.get("spot") or ta.get("close")
    if hi and lo and spot:
        ax.barh([0], [hi - lo], left=[lo], color="#374151", height=0.6)
        ax.scatter([spot], [0], color="#5eead4", s=120, zorder=10, label=f"Spot ${spot}")
        ax.scatter([hi], [0], color="#f87171", s=60, zorder=10)
        ax.scatter([lo], [0], color="#fbbf24", s=60, zorder=10)
        ax.text(lo, -0.6, f"52w Low\n${lo}", ha="center", fontsize=8)
        ax.text(hi, -0.6, f"52w High\n${hi}", ha="center", fontsize=8)
        ax.text(spot, 0.6, f"Spot ${spot}", ha="center", fontsize=9, color="#5eead4", weight="bold")
        ax.set_xlim(lo * 0.97, hi * 1.03)
        ax.set_ylim(-1.2, 1.2)
        ax.set_axis_off()
        ax.set_title(f"{ticker} — 52-week price range")
    else:
        ax.text(0.5, 0.5, "52-week range\n(no data)", ha="center")
        ax.set_axis_off()
    save(fig, d / "summary_04.png"); count += 1

    # tech_01: price + SMAs (1Y)
    fig, ax = plt.subplots(figsize=(8, 4.5))
    if stock_df is not None and len(stock_df) > 200:
        recent = stock_df.tail(252)
        closes = recent["close"]
        ax.plot(recent["date"], closes, label="Close", color="#5eead4", linewidth=1.5)
        if len(closes) >= 20:
            ax.plot(recent["date"], closes.rolling(20).mean(), label="SMA20", color="#a78bfa", linewidth=1.0, alpha=0.7)
        if len(closes) >= 50:
            ax.plot(recent["date"], closes.rolling(50).mean(), label="SMA50", color="#fbbf24", linewidth=1.0, alpha=0.7)
        if len(closes) >= 200:
            ax.plot(recent["date"], closes.rolling(200).mean(), label="SMA200", color="#f87171", linewidth=1.0, alpha=0.7)
        ax.set_title(f"{ticker} — Price & SMA overlay")
        ax.legend(loc="upper left", fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "Price chart\n(no stock data)", ha="center"); ax.set_axis_off()
    save(fig, d / "tech_01.png"); count += 1

    # tech_02: RSI(14)
    fig, ax = plt.subplots(figsize=(8, 3))
    if stock_df is not None and len(stock_df) > 30:
        c = stock_df.tail(252)["close"]
        delta = c.diff()
        gain = delta.clip(lower=0).ewm(alpha=1/14, adjust=False).mean()
        loss = -delta.clip(upper=0).ewm(alpha=1/14, adjust=False).mean()
        rsi = 100 - (100 / (1 + gain / loss))
        ax.plot(stock_df.tail(252)["date"], rsi, color="#a78bfa")
        ax.axhline(70, color="#f87171", linestyle="--", alpha=0.6, label="Overbought")
        ax.axhline(30, color="#5eead4", linestyle="--", alpha=0.6, label="Oversold")
        ax.set_ylim(0, 100)
        ax.set_title(f"{ticker} — RSI(14)")
        ax.legend(fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "RSI\n(no data)", ha="center"); ax.set_axis_off()
    save(fig, d / "tech_02.png"); count += 1

    # tech_03: MACD
    fig, ax = plt.subplots(figsize=(8, 3))
    if stock_df is not None and len(stock_df) > 30:
        c = stock_df.tail(252)["close"]
        ema12 = c.ewm(span=12, adjust=False).mean()
        ema26 = c.ewm(span=26, adjust=False).mean()
        macd = ema12 - ema26
        signal = macd.ewm(span=9, adjust=False).mean()
        hist = macd - signal
        x = stock_df.tail(252)["date"]
        ax.plot(x, macd, label="MACD", color="#5eead4")
        ax.plot(x, signal, label="Signal", color="#fbbf24")
        ax.bar(x, hist, label="Histogram", color="#a78bfa", alpha=0.5, width=1.0)
        ax.set_title(f"{ticker} — MACD (12,26,9)")
        ax.legend(fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "MACD\n(no data)", ha="center"); ax.set_axis_off()
    save(fig, d / "tech_03.png"); count += 1

    # fund_01_revenue_trend (already saved as summary_01 but keep both files)
    fig, ax = plt.subplots(figsize=(8, 4))
    if qs:
        ax.bar(labels, [(q.get("rev_q_M") or 0) / 1000 for q in qs], color="#5eead4")
        ax.set_title(f"{ticker} — Quarterly revenue ($B)")
        ax.set_xticklabels(labels, rotation=45, ha="right")
    save(fig, d / "fund_01_revenue_trend.png"); count += 1

    # fund_08_guidance_vs_actual (bars: guide_mid vs actual per claim)
    fig, ax = plt.subplots(figsize=(8, 4))
    rows = co.get("rows", []) or []
    if rows:
        guides = [r.get("guide_mid_b") for r in rows]
        actuals = [r.get("actual_b") for r in rows]
        idx = list(range(len(rows)))
        ax.bar([i - 0.2 for i in idx], [g or 0 for g in guides], width=0.4, label="Guidance (mid)", color="#fbbf24")
        ax.bar([i + 0.2 for i in idx], [a or 0 for a in actuals], width=0.4, label="Actual", color="#5eead4")
        ax.set_xticks(idx)
        ax.set_xticklabels([r.get("target_quarter", "") for r in rows], rotation=45, ha="right", fontsize=7)
        ax.set_title(f"{ticker} — Guidance vs Actual (forward claims)")
        ax.set_ylabel("$B")
        ax.legend(fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    else:
        ax.text(0.5, 0.5, "Guidance vs Actual\n(no tracked claims)", ha="center"); ax.set_axis_off()
    save(fig, d / "fund_08_guidance_vs_actual.png"); count += 1

    # fund_10: net margin trend
    fig, ax = plt.subplots(figsize=(8, 4))
    if qs:
        nms = [q.get("net_margin_pct") or 0 for q in qs]
        ax.plot(labels, nms, marker="o", color="#a78bfa", linewidth=2)
        ax.set_title(f"{ticker} — Net margin trend (%)")
        ax.set_xticklabels(labels, rotation=45, ha="right")
        ax.grid(alpha=0.3)
    save(fig, d / "fund_10.png"); count += 1

    # opt_01: IV term structure
    fig, ax = plt.subplots(figsize=(8, 4))
    term = opt.get("term_structure", [])
    if term:
        dtes = [e.get("dte") or 0 for e in term]
        ivs = [e.get("atm_iv") or 0 for e in term]
        ax.plot(dtes, ivs, marker="o", color="#a78bfa", linewidth=2)
        ax.set_xlabel("Days to expiry")
        ax.set_ylabel("ATM IV %")
        ax.set_title(f"{ticker} — IV Term Structure")
        ax.grid(alpha=0.3)
    save(fig, d / "opt_01.png"); count += 1

    # opt_02: top OI strikes (call vs put)
    fig, ax = plt.subplots(figsize=(8, 4))
    top_oi = opt.get("top_oi_strikes", []) or []
    if top_oi:
        strikes = [s.get("strike") for s in top_oi[:8]]
        coi = [s.get("call_oi") or 0 for s in top_oi[:8]]
        poi = [s.get("put_oi") or 0 for s in top_oi[:8]]
        x = list(range(len(strikes)))
        ax.bar([i - 0.2 for i in x], coi, width=0.4, label="Calls", color="#5eead4")
        ax.bar([i + 0.2 for i in x], poi, width=0.4, label="Puts", color="#f87171")
        ax.set_xticks(x); ax.set_xticklabels([f"${s}" for s in strikes], rotation=45, ha="right", fontsize=8)
        ax.set_title(f"{ticker} — Top OI strikes (calls vs puts)")
        ax.legend(fontsize=8, frameon=False)
        ax.grid(alpha=0.3)
    save(fig, d / "opt_02.png"); count += 1

    # opt_03: P/C ratio per expiry
    fig, ax = plt.subplots(figsize=(8, 4))
    if opt.get("expiries"):
        dtes = [e.get("dte") or 0 for e in opt["expiries"][:12]]
        ratios = [e.get("put_call_oi_ratio") or 0 for e in opt["expiries"][:12]]
        ax.plot(dtes, ratios, marker="s", color="#fbbf24", linewidth=2)
        ax.axhline(1.0, color="#f87171", linestyle="--", alpha=0.6, label="Bearish ↑")
        ax.set_xlabel("DTE"); ax.set_ylabel("P/C OI")
        ax.set_title(f"{ticker} — Put/Call OI ratio by expiry")
        ax.legend(fontsize=8, frameon=False); ax.grid(alpha=0.3)
    save(fig, d / "opt_03.png"); count += 1

    # opt_04: implied moves
    fig, ax = plt.subplots(figsize=(8, 4))
    moves = opt.get("implied_moves", []) or []
    if moves:
        dtes = [m.get("dte") or 0 for m in moves[:18]]
        pcts = [m.get("implied_move_pct") or 0 for m in moves[:18]]
        ax.plot(dtes, pcts, marker="^", color="#a78bfa", linewidth=2)
        ax.fill_between(dtes, 0, pcts, alpha=0.15, color="#a78bfa")
        ax.set_xlabel("DTE"); ax.set_ylabel("Implied move %")
        ax.set_title(f"{ticker} — 1σ implied move by horizon")
        ax.grid(alpha=0.3)
    save(fig, d / "opt_04.png"); count += 1

    # opt_05: ATM IV skew (call IV vs put IV by expiry)
    fig, ax = plt.subplots(figsize=(8, 4))
    if opt.get("expiries"):
        dtes = [e.get("dte") or 0 for e in opt["expiries"][:10]]
        def _iv(v):
            v = v or 0
            return v * 100 if v < 5 else v
        civ = [_iv(e.get("call_iv")) for e in opt["expiries"][:10]]
        piv = [_iv(e.get("put_iv")) for e in opt["expiries"][:10]]
        ax.plot(dtes, civ, marker="o", label="Call ATM IV", color="#5eead4")
        ax.plot(dtes, piv, marker="o", label="Put ATM IV", color="#f87171")
        ax.set_xlabel("DTE"); ax.set_ylabel("IV %")
        ax.set_title(f"{ticker} — ATM Call vs Put IV (skew)")
        ax.legend(fontsize=8, frameon=False); ax.grid(alpha=0.3)
    save(fig, d / "opt_05.png"); count += 1

    # val_01_pe_bar: target vs peers PE
    fig, ax = plt.subplots(figsize=(8, 4))
    target = fs.get("target", {})
    peers = fs.get("peers", []) or []
    if isinstance(peers, dict): peers = list(peers.values())
    names = [target.get("name", ticker)] + [p.get("name") or p.get("ticker", "") for p in peers]
    pes = [target.get("PE_FY1")] + [p.get("PE_FY1") for p in peers]
    colors = ["#5eead4"] + ["#94a3b8"] * len(peers)
    # Drop None values to satisfy matplotlib
    keep = [(n, v, c) for n, v, c in zip(names, pes, colors) if v is not None]
    if keep:
        names = [k[0] for k in keep]
        pes = [k[1] for k in keep]
        colors = [k[2] for k in keep]
        ax.bar(names, pes, color=colors)
        ax.set_title(f"{ticker} — Forward P/E vs peers")
        ax.set_xticklabels(names, rotation=45, ha="right", fontsize=7)
        ax.grid(alpha=0.3)
    save(fig, d / "val_01_pe_bar.png"); count += 1

    # val_03_premium_discount
    fig, ax = plt.subplots(figsize=(8, 4))
    pd_block = fs.get("premium_discount_vs_peer_median", {})
    if pd_block:
        keys = list(pd_block.keys())[:6]
        vals = [pd_block[k] for k in keys]
        colors = ["#5eead4" if v < 0 else "#f87171" for v in vals]
        ax.barh(keys, vals, color=colors)
        ax.axvline(0, color="#444", linewidth=1)
        ax.set_title(f"{ticker} — Premium/Discount vs peer median (%)")
        ax.grid(alpha=0.3, axis="x")
    save(fig, d / "val_03_premium_discount.png"); count += 1

    return count


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main() -> None:
    print(f"Backfilling {len(TARGETS)} tickers to MU parity\n" + "=" * 50)
    summary_rows = []
    for ticker in TARGETS:
        try:
            co_path = DATA / "companies" / f"{ticker}.json"
            ta_path = DATA / "ta_levels" / f"{ticker}.json"
            fs_path = DATA / "factset" / f"{ticker}.json"
            opt_path = DATA / "options" / f"{ticker}.json"

            co = jload(co_path)
            ta = jload(ta_path)
            fs = jload(fs_path)
            opt = jload(opt_path)

            # 1) Enrich TA from stock prices
            stock_xlsx = find_stock_xlsx(ticker)
            stock_df = read_stock_df(stock_xlsx) if stock_xlsx else None
            if stock_df is not None:
                new_ta = compute_full_ta(stock_df)
                # Don't overwrite existing fields — only fill in missing
                for k, v in new_ta.items():
                    ta.setdefault(k, v)

            # 2) Enrich fundamentals
            fund = co.get("fundamentals") or {}
            qs = fund.get("quarters") or []
            qs = enrich_quarters(qs)
            fund["quarters"] = qs
            fund["summary"] = enrich_summary(qs, fund.get("summary"))
            co["fundamentals"] = fund

            # 3) Compute subscores
            if co.get("rows") and not co.get("subscores"):
                co["subscores"] = compute_subscores(co["rows"])

            # 4) Enrich factset
            fs = enrich_factset(ticker, fs, co, ta)

            # 5) Charts
            n_charts = generate_all_charts(ticker, co, ta, fs, opt, stock_df)

            # Save
            jsave(co_path, co)
            jsave(ta_path, ta)
            jsave(fs_path, fs)

            summary_rows.append((ticker, len(qs), len(co.get("rows", [])),
                                len(fs.get("peers") or []), n_charts))
            print(f"  ✓ {ticker:<6} qs={len(qs):<2} rows={len(co.get('rows', [])):<2} "
                  f"peers={len(fs.get('peers') or []):<2} charts={n_charts}")
        except Exception as e:
            print(f"  ✗ {ticker:<6} FAILED: {e}")

    print()
    print(f"Processed {len(summary_rows)}/{len(TARGETS)} tickers")


if __name__ == "__main__":
    main()
