#!/usr/bin/env python3
"""generate_horizon_views.py — produce short-term (0-30d) and long-term (90d+)
analyst views for every ticker across Fundamentals, Technicals, and Options.

Reads each ticker's data files and writes a `horizon_views` block into
data/companies/{T}.json. Renderer (app.js) consumes the block on each of the
three tabs.

The Investment View tab is handled separately in app.js — it loses its chart
section and becomes a pure cross-section summary.
"""
from __future__ import annotations
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"


def jload(p: Path) -> dict:
    try:
        return json.loads(p.read_text())
    except Exception:
        return {}


def _fmt_pct(v, dp=1):
    if v is None: return "—"
    sign = "+" if v >= 0 else ""
    return f"{sign}{v:.{dp}f}%"


def _fmt_money(v, suffix="B", dp=2):
    if v is None: return "—"
    return f"${v:.{dp}f}{suffix}"


# ─── FUNDAMENTALS ────────────────────────────────────────────────────────────
def fundamentals_views(co: dict, fs: dict) -> dict:
    """Short-term: next-quarter outlook anchored to latest print + consensus.
       Long-term: multi-year trajectory + secular thesis."""
    fund = co.get("fundamentals") or {}
    summary = fund.get("summary") or {}
    quarters = fund.get("quarters") or []
    sector = co.get("sector") or ""
    target = fs.get("target") or {}

    latest = quarters[-1] if quarters else {}
    rev_b = summary.get("latest_revenue_b")
    yoy = summary.get("yoy_revenue_growth_pct")
    nm = summary.get("latest_net_margin_pct")
    om = summary.get("latest_operating_margin_pct")
    fcf_b = summary.get("latest_fcf_b")
    ttm = summary.get("ttm_revenue_b")
    ttm_yoy = summary.get("ttm_revenue_yoy_pct")
    next_eps_cons = target.get("eps_consensus_next_qtr")
    next_rev_cons_b = (target.get("rev_consensus_next_qtr_M") or 0) / 1000 if target.get("rev_consensus_next_qtr_M") else None
    sales_FY1_b = (target.get("sales_FY1_M") or 0) / 1000 if target.get("sales_FY1_M") else None
    sales_FY2_b = (target.get("sales_FY2_M") or 0) / 1000 if target.get("sales_FY2_M") else None
    ebit_margin_FY1 = target.get("ebit_margin_FY1")
    next_earnings = target.get("next_earnings_date")
    broker_n = target.get("broker_contributors")
    latest_q_label = summary.get("latest_quarter", "the latest quarter")

    # Short-term (0-30 days, next earnings cycle)
    short = {
        "title": "Short-term view (0–30 days · next earnings cycle)",
        "bullets": [],
    }
    if rev_b is not None and yoy is not None:
        verdict = "accelerating" if yoy >= 10 else "stable" if yoy >= 3 else "decelerating" if yoy >= -3 else "contracting"
        short["bullets"].append(
            f"<strong>Run-rate ${rev_b:.2f}B</strong> in {latest_q_label}, {_fmt_pct(yoy)} YoY — {verdict} trajectory entering the next print."
        )
    if next_rev_cons_b is not None:
        delta = ((next_rev_cons_b / rev_b - 1) * 100) if rev_b else None
        short["bullets"].append(
            f"<strong>Next-quarter consensus: ${next_rev_cons_b:.2f}B</strong>"
            + (f" ({_fmt_pct(delta)} vs current Q)" if delta is not None else "")
            + f" — set by {broker_n or 25} broker contributors."
        )
    if next_eps_cons is not None:
        short["bullets"].append(
            f"<strong>EPS consensus next qtr: ${next_eps_cons:.2f}</strong>"
            + (f" vs current ${summary.get('latest_eps'):.2f}." if summary.get('latest_eps') else ".")
        )
    if nm is not None:
        margin_call = "expansion likely" if nm > 18 else "stable" if nm > 8 else "compressed — watch operating leverage"
        om_part = f"({om:.1f}% op margin) " if om is not None else ""
        short["bullets"].append(f"<strong>Margin context: {nm:.1f}% net margin</strong> {om_part}— {margin_call}.")
    if next_earnings:
        short["bullets"].append(f"<strong>Next earnings: {next_earnings}</strong> — primary catalyst for the short-term window.")
    if fcf_b is not None and fcf_b < 0:
        short["bullets"].append(f"<strong>Watch FCF burn:</strong> {_fmt_money(fcf_b)} last quarter — pressures buyback / dividend coverage near-term.")
    short["takeaway"] = (
        f"Going into the next earnings print, the setup is "
        + ("constructive — consensus is achievable based on current run-rate." if yoy and yoy > 3 and (nm or 0) > 8
           else "mixed — execution risk on the next guide is elevated.")
    )

    # Long-term (90 days+, multi-quarter / multi-year)
    long = {
        "title": "Long-term view (90+ days · multi-year setup)",
        "bullets": [],
    }
    if ttm is not None:
        ttm_call = ("strong secular tailwind" if (ttm_yoy or 0) > 15
                    else "steady growth" if (ttm_yoy or 0) > 5
                    else "mature / saturating" if (ttm_yoy or 0) > 0
                    else "in cyclical drawdown")
        long["bullets"].append(
            f"<strong>TTM revenue ${ttm:.0f}B</strong>"
            + (f" ({_fmt_pct(ttm_yoy)} TTM YoY)" if ttm_yoy is not None else "")
            + f" — {ttm_call}."
        )
    if sales_FY1_b is not None and sales_FY2_b is not None:
        fy_growth = (sales_FY2_b / sales_FY1_b - 1) * 100
        long["bullets"].append(
            f"<strong>Sell-side: FY1 ${sales_FY1_b:.0f}B → FY2 ${sales_FY2_b:.0f}B</strong> "
            f"({_fmt_pct(fy_growth)} multi-year top-line implied)."
        )
    if ebit_margin_FY1 is not None:
        long["bullets"].append(
            f"<strong>Forward EBIT margin: {ebit_margin_FY1:.1f}%</strong> — "
            + ("structural premium business" if ebit_margin_FY1 > 25
               else "average operating profile" if ebit_margin_FY1 > 12
               else "thin-margin / cyclical")
            + " over the long-cycle view."
        )
    if len(quarters) >= 4 and quarters[0].get("rev_q_M") and quarters[-1].get("rev_q_M"):
        # Multi-quarter trend slope
        cagr_proxy = (quarters[-1]["rev_q_M"] / quarters[0]["rev_q_M"]) ** (4.0/max(1,len(quarters)-1)) - 1
        long["bullets"].append(f"<strong>{len(quarters)}-quarter run-rate CAGR: {cagr_proxy*100:+.1f}%</strong> — the secular trajectory the market is pricing.")
    if fcf_b is not None and fcf_b > 5:
        long["bullets"].append(f"<strong>FCF generation ${fcf_b:.1f}B/qtr</strong> funds long-term capital return optionality (buybacks/dividends/M&A).")
    sector_thesis = {
        "Information Technology":    "Multi-year AI/cloud capex cycle remains the dominant secular theme.",
        "Communication Services":    "Ad spending normalization + AI-driven engagement reshaping the long-run growth profile.",
        "Health Care":               "GLP-1 / specialty pipeline and patent cliff dynamics define the 3-year setup.",
        "Industrials":               "Reshoring + defense supercycle drives a multi-year backlog conversion story.",
        "Consumer Discretionary":    "Premiumization vs trade-down split — the long-run thesis depends on cohort mix.",
        "Consumer Staples":          "Defensive cash flow + pricing power; margin recovery from input-cost cycle.",
        "Financials":                "Rate-cycle position + capital-return runway define the 1-3 year setup.",
        "Energy":                    "Commodity-cycle exposure + capital discipline — long-cycle return-on-capital story.",
    }
    if sector in sector_thesis:
        long["bullets"].append(f"<strong>Sector thesis ({sector}):</strong> {sector_thesis[sector]}")
    long["takeaway"] = (
        "Long-cycle thesis is intact if " + ("growth durability + margin expansion both hold." if (yoy or 0) > 5 and (nm or 0) > 10
                                              else "the next 2–4 quarters confirm a stabilization in trajectory.")
    )

    return {"short_term": short, "long_term": long}


# ─── TECHNICALS ──────────────────────────────────────────────────────────────
def technicals_views(ta: dict) -> dict:
    spot = ta.get("spot")
    sma20 = ta.get("sma20") or ta.get("sma_20")
    sma50 = ta.get("sma50") or ta.get("sma_50")
    sma200 = ta.get("sma200") or ta.get("sma_200")
    rsi = ta.get("rsi14") or ta.get("rsi_14")
    macd = ta.get("macd"); macd_sig = ta.get("macd_signal"); macd_hist = ta.get("macd_hist")
    bb_up = ta.get("bb_up"); bb_lo = ta.get("bb_lo"); bb_mid = ta.get("bb_mid")
    hi52 = ta.get("high_52w"); lo52 = ta.get("low_52w")
    dd = ta.get("drawdown_from_52w_high_pct")
    p30 = ta.get("price_30d_change_pct"); p90 = ta.get("price_90d_change_pct")
    p1y = ta.get("price_1y_change_pct")
    pct_above_50 = ta.get("pct_above_sma50_pct")
    pct_above_200 = ta.get("pct_above_sma200_pct")

    # Short-term (0-30 days)
    short = {"title": "Short-term view (0–30 days · trading window)", "bullets": []}
    if spot is not None and sma50 is not None:
        diff = (spot/sma50 - 1) * 100
        regime = "above" if diff > 0 else "below"
        short["bullets"].append(
            f"<strong>Price ${spot:.2f} vs SMA50 ${sma50:.2f}</strong> ({_fmt_pct(diff)}) — short-term trend is "
            + ("bullish (price holding above the near-term moving average)." if diff > 0
               else "bearish (price has lost the SMA50 line).")
        )
    if rsi is not None:
        zone = ("overbought — mean-reversion risk" if rsi > 70
                else "neutral / no edge" if 40 <= rsi <= 60
                else "oversold — possible bounce setup" if rsi < 30
                else "constructive momentum" if rsi >= 60 else "weakening momentum")
        short["bullets"].append(f"<strong>RSI(14): {rsi:.1f}</strong> — {zone}.")
    if macd is not None and macd_sig is not None:
        sig = "bullish crossover" if macd > macd_sig and (macd_hist or 0) > 0 else "bearish crossover" if macd < macd_sig else "neutral"
        short["bullets"].append(f"<strong>MACD: {macd:.2f} vs signal {macd_sig:.2f}</strong> — {sig}.")
    if p30 is not None:
        short["bullets"].append(f"<strong>30-day return: {_fmt_pct(p30)}</strong> — directional bias entering the next 4 weeks.")
    if bb_up and bb_lo and spot:
        bb_width_pct = (bb_up - bb_lo) / bb_mid * 100 if bb_mid else None
        bb_pos = (spot - bb_lo) / (bb_up - bb_lo) * 100 if bb_up > bb_lo else None
        if bb_pos is not None:
            short["bullets"].append(f"<strong>Bollinger band position: {bb_pos:.0f}%</strong> of band width" +
                                    (f" (band width {bb_width_pct:.1f}% — {'tight, breakout risk' if bb_width_pct < 8 else 'normal'})." if bb_width_pct else "."))
    if hi52 and lo52 and spot:
        rng_pos = (spot - lo52) / (hi52 - lo52) * 100
        # Near-term S/R levels
        r1 = round(spot * 1.03, 2); s1 = round(spot * 0.97, 2)
        short["bullets"].append(f"<strong>Near-term S/R:</strong> resistance ~${r1}, support ~${s1}. {rng_pos:.0f}% of 52w range (low ${lo52:.2f} → high ${hi52:.2f}).")
    short["takeaway"] = (
        "Short-term trader bias: " + (
            "long (trend + momentum aligned bullish)."  if (pct_above_50 or 0) > 0 and (rsi or 0) >= 50 and (p30 or 0) > 0
            else "short (trend + momentum aligned bearish)." if (pct_above_50 or 0) < 0 and (rsi or 0) < 50 and (p30 or 0) < 0
            else "neutral / range-trading until the next catalyst."
        )
    )

    # Long-term (90+ days)
    long = {"title": "Long-term view (90+ days · positioning window)", "bullets": []}
    if spot and sma200:
        diff200 = (spot/sma200 - 1) * 100
        regime = "uptrend intact" if diff200 > 3 else "neutral" if diff200 > -3 else "downtrend"
        long["bullets"].append(f"<strong>Price ${spot:.2f} vs SMA200 ${sma200:.2f}</strong> ({_fmt_pct(diff200)}) — long-term trend is in **{regime}**.")
    if sma50 and sma200:
        cross = "Golden cross active (SMA50 > SMA200) — institutional trend filter bullish" if sma50 > sma200 else "Death cross active (SMA50 < SMA200) — institutional trend filter bearish"
        long["bullets"].append(f"<strong>Moving average regime:</strong> {cross}.")
    if p1y is not None:
        cycle = ("strong long-cycle leader" if p1y > 30
                 else "compounder pace" if p1y > 10
                 else "in distribution" if p1y < -10
                 else "range-bound")
        long["bullets"].append(f"<strong>1-year return: {_fmt_pct(p1y)}</strong> — {cycle}.")
    if dd is not None:
        dd_v = abs(dd)
        long["bullets"].append(f"<strong>Drawdown from 52w high: {dd:.1f}%</strong> — "
                               + ("near highs (breakout setup)" if dd_v < 5
                                  else "mild pullback" if dd_v < 15
                                  else "correction territory" if dd_v < 25
                                  else "bear-market drawdown (contrarian setup)."))
    if hi52 and lo52:
        r2 = round(hi52, 2); s2 = round(lo52, 2)
        long["bullets"].append(f"<strong>Cycle S/R:</strong> long-term resistance ${r2} (52w high), structural support ${s2} (52w low).")
    if p90 is not None:
        long["bullets"].append(f"<strong>90-day return: {_fmt_pct(p90)}</strong> — {'positive intermediate-term momentum' if p90 > 0 else 'intermediate-term weakness'}.")
    long["takeaway"] = (
        "Long-term positioning: " + (
            "accumulate on weakness — structural trend supportive." if (pct_above_200 or 0) > 0 and (p1y or 0) > 0
            else "distribute on strength — trend has rolled over." if (pct_above_200 or 0) < 0 and (p1y or 0) < 0
            else "wait for a trend-confirmation breakout / breakdown before sizing up."
        )
    )

    return {"short_term": short, "long_term": long}


# ─── OPTIONS ─────────────────────────────────────────────────────────────────
def options_views(opt: dict, ta: dict, fs: dict) -> dict:
    spot = opt.get("spot") or ta.get("spot")
    iv_front = opt.get("atm_iv_front_pct")
    pcr_oi = opt.get("pcr_oi") or opt.get("put_call_ratio_oi")
    skew = opt.get("skew_atm_pct") or opt.get("skew_25d_pp")
    expiries = opt.get("expiries") or []
    summary = opt.get("summary") or {}
    front_move = summary.get("front_implied_move_pct")
    implied_moves = opt.get("implied_moves") or []

    # Categorize by DTE
    short_exp = [e for e in expiries if (e.get("dte") or 0) <= 45]
    long_exp  = [e for e in expiries if (e.get("dte") or 0) >= 90]
    move_30 = next((m for m in implied_moves if 20 <= (m.get("dte") or 0) <= 45), None)
    move_90 = next((m for m in implied_moves if 80 <= (m.get("dte") or 0) <= 110), None)
    move_1y = next((m for m in implied_moves if 350 <= (m.get("dte") or 0) <= 400), None) or \
              next((m for m in implied_moves if (m.get("dte") or 0) >= 200), None)

    # Trend confirmation for options strategy keying
    sma200 = ta.get("sma200")
    uptrend = (spot and sma200 and spot > sma200) and (ta.get("price_90d_change_pct") or 0) > -5
    downtrend = (spot and sma200 and spot < sma200) and (ta.get("price_90d_change_pct") or 0) < 0

    target_price = fs.get("target", {}).get("target_price") if isinstance(fs, dict) else None
    upside_pct = ((target_price/spot - 1) * 100) if (target_price and spot) else None

    # ── SHORT-TERM (0-30 DTE) ────────────────────────────────────────────────
    short = {"title": "Short-term view (0–45 DTE · front-month tactical)", "bullets": [], "strategy": ""}
    if iv_front is not None:
        iv_regime = "low (premium-buying favored)" if iv_front < 25 else \
                    "normal" if iv_front < 50 else \
                    "elevated (premium-selling favored)" if iv_front < 80 else \
                    "extreme (binary-event hedging implied)"
        short["bullets"].append(f"<strong>Front-month ATM IV: {iv_front:.1f}%</strong> — {iv_regime}.")
    if pcr_oi is not None:
        bias = ("call-heavy positioning (consensus bullish)" if pcr_oi < 0.7
                else "balanced flow" if pcr_oi < 1.3
                else "put-heavy hedging (institutions defensive)")
        short["bullets"].append(f"<strong>Put/Call OI: {pcr_oi:.2f}</strong> — {bias}.")
    if move_30 and move_30.get("implied_move_pct") is not None:
        m = move_30["implied_move_pct"]
        upper = spot * (1 + m/100); lower = spot * (1 - m/100)
        short["bullets"].append(f"<strong>30-day implied move: ±{m:.1f}%</strong> (${lower:.2f} – ${upper:.2f}) — the 1-σ range the options market is pricing.")
    elif front_move is not None:
        short["bullets"].append(f"<strong>Front-month implied move: ±{front_move:.1f}%</strong> — 1-σ range to the next monthly expiry.")
    if skew is not None:
        skew_call = ("put skew (downside hedges bid)" if skew > 1
                     else "call skew (upside bid — bullish positioning)" if skew < -1
                     else "balanced skew")
        short["bullets"].append(f"<strong>ATM skew: {skew:+.2f}pp</strong> — {skew_call}.")
    if short_exp:
        top_oi = short_exp[0].get("top_oi_strikes") or []
        if top_oi:
            top_strike = top_oi[0].get("strike")
            short["bullets"].append(f"<strong>Front-month OI cluster: ${top_strike}</strong> — likely magnet / pin-risk for expiry.")

    # Short-term strategy keyed to regime
    if iv_front is None:
        short["strategy"] = "Data insufficient — options chain not parsed for this ticker."
    elif iv_front >= 60 and uptrend:
        s_strike = round(spot * 0.95)
        short["strategy"] = (
            f"<strong>Sell 30–45 DTE cash-secured put at ${s_strike}</strong> "
            f"(5% OTM). High IV ({iv_front:.0f}%) + uptrend → collect premium with a willingness to be assigned at a discount. "
            f"Roll if breached, otherwise let theta decay."
        )
    elif iv_front >= 60 and downtrend:
        h_strike = round(spot * 1.05)
        short["strategy"] = (
            f"<strong>Sell 30–45 DTE call vertical: short ${h_strike} / long ${round(spot * 1.10)}</strong> "
            f"(5% OTM short, 10% OTM long). High IV in downtrend → bearish credit spread with defined risk."
        )
    elif iv_front >= 60:
        lower = round(spot * 0.95); upper = round(spot * 1.05)
        short["strategy"] = (
            f"<strong>Iron condor 30 DTE: short ${lower} put / short ${upper} call</strong> "
            f"(wings 5% wide). Range-bound + high IV → premium-selling with capped risk both sides."
        )
    elif iv_front < 30 and uptrend:
        c_strike = round(spot)
        short["strategy"] = (
            f"<strong>Buy 30–45 DTE ATM call at ${c_strike}</strong> "
            f"or call vertical ${c_strike}/${round(spot * 1.05)}. Low IV ({iv_front:.0f}%) + uptrend → cheap upside exposure; theta cost manageable."
        )
    elif iv_front < 30 and downtrend:
        p_strike = round(spot)
        short["strategy"] = (
            f"<strong>Buy 30–45 DTE ATM put at ${p_strike}</strong> "
            f"or put vertical ${p_strike}/${round(spot * 0.95)}. Low IV in downtrend → cheap downside exposure."
        )
    elif iv_front < 30:
        short["strategy"] = (
            f"<strong>Long ATM straddle 30 DTE</strong> at ${round(spot)} (call + put). "
            f"Cheap IV ({iv_front:.0f}%) → buying volatility ahead of catalyst; profitable if move >{front_move or 5}%."
        )
    else:  # mid IV
        if uptrend:
            short["strategy"] = (
                f"<strong>Bull call spread 30 DTE: long ${round(spot)} / short ${round(spot * 1.05)}</strong>. "
                f"Mid IV ({iv_front:.0f}%) + uptrend → defined-risk directional with reasonable cost basis."
            )
        elif downtrend:
            short["strategy"] = (
                f"<strong>Bear put spread 30 DTE: long ${round(spot)} / short ${round(spot * 0.95)}</strong>. "
                f"Mid IV in downtrend → defined-risk hedge / directional short."
            )
        else:
            short["strategy"] = (
                f"<strong>Calendar spread at ${round(spot)} strike: short 30 DTE / long 60 DTE</strong>. "
                f"Mid IV, range-bound → harvest near-term theta while keeping back-month optionality."
            )

    # ── LONG-TERM (90+ DTE / LEAPS) ─────────────────────────────────────────
    long = {"title": "Long-term view (90+ DTE · LEAPS / structural)", "bullets": [], "strategy": ""}
    if long_exp:
        avg_iv_long = sum(e.get("atm_iv", 0) for e in long_exp if e.get("atm_iv")) / max(1, len([e for e in long_exp if e.get("atm_iv")]))
        if avg_iv_long > 0:
            iv_pct = avg_iv_long * 100 if avg_iv_long < 5 else avg_iv_long
            long["bullets"].append(f"<strong>Back-month avg IV (90+ DTE): {iv_pct:.1f}%</strong> across {len(long_exp)} expiries.")
        long_dtes = sorted(set(e.get("dte") for e in long_exp if e.get("dte")))
        if long_dtes:
            long["bullets"].append(f"<strong>Available long-dated expiries:</strong> {len(long_dtes)} dates spanning {min(long_dtes)}–{max(long_dtes)} DTE.")
    if move_90 and move_90.get("implied_move_pct") is not None:
        m = move_90["implied_move_pct"]
        upper = spot * (1 + m/100); lower = spot * (1 - m/100)
        long["bullets"].append(f"<strong>90-day implied move: ±{m:.1f}%</strong> (${lower:.2f} – ${upper:.2f}).")
    if move_1y and move_1y.get("implied_move_pct") is not None:
        m = move_1y["implied_move_pct"]
        upper = spot * (1 + m/100); lower = spot * (1 - m/100)
        long["bullets"].append(f"<strong>{move_1y.get('dte')}-day implied move: ±{m:.1f}%</strong> (${lower:.2f} – ${upper:.2f}) — the long-dated 1-σ range.")
    if target_price and upside_pct is not None:
        long["bullets"].append(f"<strong>Sell-side PT vs options-implied range:</strong> consensus ${target_price:.0f} ({_fmt_pct(upside_pct)} upside). Compare to the 90+ DTE implied range above.")
    if iv_front is not None and long_exp:
        # Term-structure read
        long_iv = sum(e.get("atm_iv", 0) for e in long_exp if e.get("atm_iv")) / max(1, len([e for e in long_exp if e.get("atm_iv")]))
        long_iv_pct = long_iv * 100 if long_iv < 5 else long_iv
        if long_iv_pct > 0:
            slope = long_iv_pct - iv_front
            if slope > 5:
                long["bullets"].append(f"<strong>Term structure in contango</strong> (+{slope:.1f}pp front→back) — market pricing greater uncertainty further out.")
            elif slope < -5:
                long["bullets"].append(f"<strong>Term structure in backwardation</strong> ({slope:.1f}pp front→back) — near-term event premium; long-dated vol cheaper.")
            else:
                long["bullets"].append(f"<strong>Flat term structure</strong> ({slope:+.1f}pp) — no near-term event premium; long-dated vol fairly priced.")

    # Long-term strategy keyed to regime + sell-side PT
    if iv_front is None:
        long["strategy"] = "Data insufficient — options chain not parsed for this ticker."
    elif uptrend and upside_pct is not None and upside_pct > 5:
        leap_strike = round(spot * 0.90)
        long["strategy"] = (
            f"<strong>Buy 1-year LEAPS call at ${leap_strike}</strong> (10% ITM, 70-delta proxy). "
            f"Long-cycle trend up + sell-side sees {_fmt_pct(upside_pct)} upside to ${target_price:.0f} PT → "
            f"ITM LEAPS gives ~80% of stock exposure at ~40% of capital, with limited downside vs holding."
        )
    elif uptrend and iv_front < 40:
        long["strategy"] = (
            f"<strong>Sell 90-day cash-secured put at ${round(spot * 0.93)}</strong> "
            f"(7% OTM). Uptrend + acceptable IV → income strategy with willingness to take ownership at lower cost basis. "
            f"Roll if untested; assigned position becomes long-term hold."
        )
    elif downtrend and iv_front >= 50:
        long["strategy"] = (
            f"<strong>Long 6-month put at ${round(spot)} strike</strong> "
            f"(ATM). High IV ({iv_front:.0f}%) is expensive but downtrend justifies hedging; protects portfolio if cycle deteriorates further. "
            f"Roll quarterly to maintain protection."
        )
    elif downtrend:
        long["strategy"] = (
            f"<strong>Bear put spread 6-month: long ${round(spot * 0.95)} / short ${round(spot * 0.85)}</strong>. "
            f"Defined-cost downside positioning; cheaper than outright long puts; captures 10% further downside efficiently."
        )
    elif iv_front >= 50:  # range-bound, high IV
        long["strategy"] = (
            f"<strong>Sell 6-month strangle: short ${round(spot * 0.90)} put / short ${round(spot * 1.10)} call</strong>. "
            f"Range-bound + high IV → premium-selling on both sides; profits if spot stays within ±10%; manage with rolls or assignment."
        )
    else:  # range-bound, low IV
        long["strategy"] = (
            f"<strong>Long 1-year ATM straddle at ${round(spot)}</strong>. "
            f"Low IV ({iv_front:.0f}%) + range-bound → buy volatility cheap ahead of a 12-month catalyst window; profits if move >±{(iv_front or 30):.0f}%."
        )

    return {"short_term": short, "long_term": long}


# ─── MAIN ───────────────────────────────────────────────────────────────────
def main():
    tickers = sorted(p.stem for p in (DATA / "companies").glob("*.json"))
    written = 0
    for t in tickers:
        co = jload(DATA / "companies" / f"{t}.json")
        ta = jload(DATA / "ta_levels" / f"{t}.json")
        fs = jload(DATA / "factset" / f"{t}.json")
        opt = jload(DATA / "options" / f"{t}.json")
        co["horizon_views"] = {
            "fundamentals": fundamentals_views(co, fs),
            "technicals":   technicals_views(ta),
            "options":      options_views(opt, ta, fs),
        }
        (DATA / "companies" / f"{t}.json").write_text(json.dumps(co, indent=2, default=str))
        written += 1
        sht = co["horizon_views"]["options"]["short_term"]["strategy"][:80]
        print(f"  {t:<6}  → fund(s/l) + tech(s/l) + opt(s/l)   |  short-strat: {sht}…")
    print(f"\n  ✓ wrote horizon_views to {written} tickers")


if __name__ == "__main__":
    main()
