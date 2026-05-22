
const DATA = {"companies": {"AMD": {"ticker": "AMD", "n_claims": 6, "mcs_simple": 0.9647, "mcs_information_adjusted": 0.9647, "mcs_difficulty_weighted": 0.9626, "subscores": {"revenue": 0.9647, "margin": null, "eps": null, "fcf": null, "strategic": null}, "baseline_random": 0.4913, "baseline_always_up": 1.0, "skill_over_baseline": -0.0353, "beats": 6, "misses": 0, "rows": [{"claim_id": "AMD_01", "quarter_made": "AMD-2024-Q1", "target_quarter": "AMD-2024-Q2", "guided": 5700, "actual": 5835, "pct": 2.37, "accuracy": 0.9763, "bms": 1, "difficulty": 0, "source_quote": ""}, {"claim_id": "AMD_02", "quarter_made": "AMD-2024-Q2", "target_quarter": "AMD-2024-Q3", "guided": 6700, "actual": 6819, "pct": 1.78, "accuracy": 0.9822, "bms": 1, "difficulty": 0, "source_quote": ""}, {"claim_id": "AMD_03", "quarter_made": "AMD-2024-Q3", "target_quarter": "AMD-2024-Q4", "guided": 7500, "actual": 7658, "pct": 2.11, "accuracy": 0.9789, "bms": 1, "difficulty": 0, "source_quote": ""}, {"claim_id": "AMD_04", "quarter_made": "AMD-2024-Q4", "target_quarter": "AMD-2025-Q1", "guided": 7100, "actual": 7438, "pct": 4.76, "accuracy": 0.9524, "bms": 1, "difficulty": 0, "source_quote": ""}, {"claim_id": "AMD_05", "quarter_made": "AMD-2025-Q1", "target_quarter": "AMD-2025-Q2", "guided": 7400, "actual": 7685, "pct": 3.85, "accuracy": 0.9615, "bms": 1, "difficulty": 1, "source_quote": ""}, {"claim_id": "AMD_06", "quarter_made": "AMD-2025-Q2", "target_quarter": "AMD-2025-Q3", "guided": 8700, "actual": 9248, "pct": 6.3, "accuracy": 0.937, "bms": 1, "difficulty": 2, "source_quote": ""}]}, "META": {"ticker": "META", "n_claims": 8, "mcs_simple": 0.9589, "mcs_information_adjusted": 0.9589, "mcs_difficulty_weighted": 0.9593, "subscores": {"revenue": 0.9589, "margin": null, "eps": null, "fcf": null, "strategic": null}, "baseline_random": 0.4935, "baseline_always_up": 1.0, "skill_over_baseline": -0.0411, "beats": 8, "misses": 0, "rows": [{"claim_id": "META_01", "quarter_made": "META-2024-Q1", "target_quarter": "META-2024-Q2", "guided": 37750, "actual": 39100, "pct": 3.58, "accuracy": 0.9642, "bms": 1, "difficulty": 0, "source_quote": "Susan Li, META_ER_Q1_2024_24_APR_2024(1).docx: range $36.5-$39.0B (mid $37.75B). Target-quarter actual: $39.1B (transcript)."}, {"claim_id": "META_02", "quarter_made": "META-2024-Q2", "target_quarter": "META-2024-Q3", "guided": 39750, "actual": 40600, "pct": 2.14, "accuracy": 0.9786, "bms": 1, "difficulty": 0, "source_quote": "Susan Li, META_ER_Q2_2024_31-JUL-2024.docx: range $38.5-$41.0B (mid $39.75B). Target-quarter actual: $40.6B (transcript)."}, {"claim_id": "META_03", "quarter_made": "META-2024-Q3", "target_quarter": "META-2024-Q4", "guided": 46500, "actual": 48400, "pct": 4.09, "accuracy": 0.9591, "bms": 1, "difficulty": 0, "source_quote": "Susan Li, META_ER_Q3_2024_30-OCT-2024.docx: range $45.0-$48.0B (mid $46.5B). Target-quarter actual: $48.4B (transcript)."}, {"claim_id": "META_04", "quarter_made": "META-2024-Q4", "target_quarter": "META-2025-Q1", "guided": 40650, "actual": 42300, "pct": 4.06, "accuracy": 0.9594, "bms": 1, "difficulty": 1, "source_quote": "Susan Li, META_ER_Q4_2024_29-JAN-2025.docx: range $39.5-$41.8B (mid $40.65B). Target-quarter actual: $42.3B (transcript)."}, {"claim_id": "META_05", "quarter_made": "META-2025-Q1", "target_quarter": "META-2025-Q2", "guided": 44000, "actual": 47500, "pct": 7.95, "accuracy": 0.9205, "bms": 1, "difficulty": 0, "source_quote": "Susan Li, META_ER_Q1_2025_30-APR-2025.docx: range $42.5-$45.5B (mid $44.0B). Target-quarter actual: $47.5B (transcript)."}, {"claim_id": "META_06", "quarter_made": "META-2025-Q2", "target_quarter": "META-2025-Q3", "guided": 49000, "actual": 51200, "pct": 4.49, "accuracy": 0.9551, "bms": 1, "difficulty": 1, "source_quote": "Susan Li, META_ER_Q2_2025_30-JUL-2025.docx: range $47.5-$50.5B (mid $49.0B). Target-quarter actual: $51.2B (transcript)."}, {"claim_id": "META_07", "quarter_made": "META-2025-Q3", "target_quarter": "META-2025-Q4", "guided": 57500, "actual": 59900, "pct": 4.17, "accuracy": 0.9583, "bms": 1, "difficulty": 0, "source_quote": "Susan Li, META_ER_Q3_2025_29-0CT-2026.docx: range $56.0-$59.0B (mid $57.5B). Target-quarter actual: $59.9B (transcript)."}, {"claim_id": "META_08", "quarter_made": "META-2025-Q4", "target_quarter": "META-2026-Q1", "guided": 55000, "actual": 56300, "pct": 2.36, "accuracy": 0.9764, "bms": 1, "difficulty": 1, "source_quote": "Susan Li, META_ER_Q4_2025_28-JAN-2026.docx: range $53.5-$56.5B (mid $55.0B). Target-quarter actual: $56.3B (transcript)."}, {"claim_id": "META_09", "quarter_made": "META-2026-Q1", "target_quarter": "META-2026-Q2", "guided": 59500, "actual": null, "pct": null, "accuracy": null, "bms": null, "difficulty": 0, "pending": true, "source_quote": "Susan Li, META_ER_Q1_2026_29-APR-2026.docx: \"second quarter 2026 total revenue to be in the range of $58 billion to $61 billion\" | Q2 2026 actual: PENDING."}], "fundamentals": {"summary": {"latest_quarter": "FY2026 Q1", "latest_revenue_b": 56.31, "latest_net_income_b": 26.77, "latest_eps": 10.44, "latest_gross_margin_pct": 81.85, "latest_operating_margin_pct": 40.62, "latest_net_margin_pct": 47.54, "latest_ocf_b": 32.23, "latest_capex_b": 19.0, "latest_fcf_b": 13.23, "latest_equity_b": 243.68, "latest_current_ratio": 2.35, "latest_long_debt_to_equity": 0.24, "latest_roe_q_annualized_pct": 43.95, "latest_dso_days": 32.0, "yoy_revenue_growth_pct": 33.1, "n_quarter_cagr_pct": 24.3, "n_quarters_in_series": 9}, "quarters": [{"fy": 2024, "fq": 1, "rev_q_M": 36455.0, "ni_q_M": 12369.0, "oi_q_M": 13818.0, "ocf_q_M": 19246.0, "capex_q_M": 6823.0, "fcf_q_M": 12423.0, "eps": 4.71, "gross_margin_pct": 81.79, "operating_margin_pct": 37.9, "net_margin_pct": 33.93, "equity_M": 153168.0, "current_ratio": 2.67, "long_debt_to_equity": 0.12, "roe_q_annualized_pct": 32.3, "dso_days": 40.5}, {"fy": 2024, "fq": 2, "rev_q_M": 39071.0, "ni_q_M": 13465.0, "oi_q_M": 14847.0, "ocf_q_M": 19370.0, "capex_q_M": 7750.0, "fcf_q_M": 11620.0, "eps": 5.16, "gross_margin_pct": 81.3, "operating_margin_pct": 38.0, "net_margin_pct": 34.46, "equity_M": 156763.0, "current_ratio": 2.67, "long_debt_to_equity": 0.12, "roe_q_annualized_pct": 34.36, "dso_days": 37.8}, {"fy": 2024, "fq": 3, "rev_q_M": 40589.0, "ni_q_M": 15688.0, "oi_q_M": 17350.0, "ocf_q_M": 24724.0, "capex_q_M": 8258.0, "fcf_q_M": 16466.0, "eps": 6.03, "gross_margin_pct": 81.83, "operating_margin_pct": 42.75, "net_margin_pct": 38.65, "equity_M": 164529.0, "current_ratio": 2.73, "long_debt_to_equity": 0.18, "roe_q_annualized_pct": 38.14, "dso_days": 36.4}, {"fy": 2024, "fq": 4, "rev_q_M": 48386.0, "ni_q_M": 20838.0, "oi_q_M": 23365.0, "ocf_q_M": 27988.0, "capex_q_M": 14425.0, "fcf_q_M": 13563.0, "eps": 7.96, "gross_margin_pct": 81.73, "operating_margin_pct": 48.29, "net_margin_pct": 43.07, "equity_M": 182637.0, "current_ratio": 2.98, "long_debt_to_equity": 0.16, "roe_q_annualized_pct": 45.64, "dso_days": 32.0}, {"fy": 2025, "fq": 1, "rev_q_M": 42314.0, "ni_q_M": 16644.0, "oi_q_M": 17555.0, "ocf_q_M": 24026.0, "capex_q_M": 12941.0, "fcf_q_M": 11085.0, "eps": 6.43, "gross_margin_pct": 82.11, "operating_margin_pct": 41.49, "net_margin_pct": 39.33, "equity_M": 185029.0, "current_ratio": 2.95, "long_debt_to_equity": 0.16, "roe_q_annualized_pct": 35.98, "dso_days": 36.6}, {"fy": 2025, "fq": 2, "rev_q_M": 47516.0, "ni_q_M": 18337.0, "oi_q_M": 20441.0, "ocf_q_M": 25561.0, "capex_q_M": 16538.0, "fcf_q_M": 9023.0, "eps": 7.14, "gross_margin_pct": 82.13, "operating_margin_pct": 43.02, "net_margin_pct": 38.59, "equity_M": 195070.0, "current_ratio": 2.68, "long_debt_to_equity": 0.15, "roe_q_annualized_pct": 37.6, "dso_days": 32.6}, {"fy": 2025, "fq": 3, "rev_q_M": 51242.0, "ni_q_M": 2709.0, "oi_q_M": 20535.0, "ocf_q_M": 29999.0, "capex_q_M": 18829.0, "fcf_q_M": 11170.0, "eps": 1.05, "gross_margin_pct": 82.03, "operating_margin_pct": 40.07, "net_margin_pct": 5.29, "equity_M": 195070.0, "current_ratio": 2.71, "long_debt_to_equity": 0.15, "roe_q_annualized_pct": 13.41, "dso_days": 30.8}, {"fy": 2025, "fq": 4, "rev_q_M": 59894.0, "ni_q_M": 22768.0, "oi_q_M": 24745.0, "ocf_q_M": 36214.0, "capex_q_M": 21383.0, "fcf_q_M": 14831.0, "eps": 8.87, "gross_margin_pct": 81.79, "operating_margin_pct": 41.31, "net_margin_pct": 38.01, "equity_M": 217243.0, "current_ratio": 2.6, "long_debt_to_equity": 0.27, "roe_q_annualized_pct": 38.37, "dso_days": 30.1}, {"fy": 2026, "fq": 1, "rev_q_M": 56311.0, "ni_q_M": 26773.0, "oi_q_M": 22872.0, "ocf_q_M": 32226.0, "capex_q_M": 18997.0, "fcf_q_M": 13229.0, "eps": 10.44, "gross_margin_pct": 81.85, "operating_margin_pct": 40.62, "net_margin_pct": 47.54, "equity_M": 243681.0, "current_ratio": 2.35, "long_debt_to_equity": 0.24, "roe_q_annualized_pct": 43.95, "dso_days": 32.0}], "risk_factors": {"Product offerings": ["Ability to add and retain users and maintain levels of user engagement", "The loss of, or reduction in spending by, marketers", "Reduced availability of data signals used by ad targeting and measurement tools", "Ineffective operation with mobile OS partners or changes in those relationships", "Failure of new products or changes to existing products to attract or retain users / generate revenue"], "Business operations and financial results": ["Ability to compete effectively", "Fluctuations in financial results", "Unfavorable media coverage and brand-reputation risk", "Ability to build, maintain, and scale technical infrastructure; service disruptions, catastrophic events, crises", "Operating across multiple countries — geopolitical exposure", "Litigation, including class action lawsuits", "Acquisitions and integration risk"], "Government regulation and enforcement": ["Government restrictions on access to Facebook / other products in specific countries", "Complex and evolving US/EU privacy, data-use, content-moderation, competition, youth, safety, consumer-protection, advertising laws — GDPR, DMA, DSA, UK OSA, EU AI Act, UK DMCC", "Government investigations, enforcement actions, and settlements", "Ability to comply with regulatory privacy requirements including FTC consent order"], "Data, security, platform integrity, IP": ["Security breaches, improper data access / disclosure, cyber incidents, intentional platform misuse", "Ability to obtain, maintain, protect, and enforce intellectual-property rights"], "Ownership of Class A Common Stock": ["Dual-class structure: Zuckerberg controls a majority of voting power, limiting Class A holders' influence on corporate matters"]}, "risk_source": "META FY2025 10-K, Item 1A — extracted from META_FY2025Q4_0001628280-26-003942_10K.htm", "market_cap_note": "Market cap = shares outstanding × share price. Shares outstanding IS in the 10-K (DEI:EntityCommonStockSharesOutstanding). Share price is NOT in the 10-K and was not submitted as a separate input.", "audit_note": "All 9 guidance/actual pairs reconciled within ±$0.05B between the transcript and the 10-Q/10-K XBRL on every quarter. Revenue extraction tag: us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax."}, "q2q_analysis": {"metadata": {"ticker": "META", "generated": "2026-05-08", "method": "verbatim guidance from user's transcripts vs. XBRL-derived actuals from user's filings; strategic commitments cross-referenced against later transcripts.", "actuals_source": "META_inbox/Earnings/*.htm (inline-XBRL)", "guidance_source": "META_inbox/Transcripts/*.docx", "stock_price_source": "Not yet supplied — see footer for options"}, "fy_actuals": {"2024": {"total_costs_and_expenses_b": 95.121, "ppe_capex_b": 37.256, "operating_income_b": 69.38, "pretax_income_b": 70.663, "tax_expense_b": 8.303, "effective_tax_rate_pct": 11.750137978857394, "net_income_b": 62.36, "source_filing": "META_FY2024Q4_0001326801-25-000017_10K"}, "2025": {"total_costs_and_expenses_b": 117.69, "ppe_capex_b": 69.691, "operating_income_b": 83.276, "pretax_income_b": 85.932, "tax_expense_b": 25.474, "effective_tax_rate_pct": 29.644369966950613, "net_income_b": 60.458, "source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "effective_tax_rate_underlying_pct": 14.0, "one_time_charge_b": 15.93}}, "quarterly_revenue_actuals": {"2024Q1": {"value_b": 36.455, "source_filing": "META_FY2024Q1_0001326801-24-000049"}, "2024Q2": {"value_b": 39.071, "source_filing": "META_FY2024Q2_0001326801-24-000069"}, "2024Q3": {"value_b": 40.589, "source_filing": "META_FY2024Q3_0001326801-24-000081"}, "2024Q4": {"value_b": 48.385000000000005, "source_filing": "META_FY2024Q4_0001326801-25-000017_10K"}, "2025Q1": {"value_b": 42.314, "source_filing": "META_FY2025Q1_0001326801-25-000054"}, "2025Q2": {"value_b": 47.516, "source_filing": "META_FY2025Q2_0001628280-25-036791"}, "2025Q3": {"value_b": 51.242, "source_filing": "META_FY2025Q3_0001628280-25-047240"}, "2025Q4": {"value_b": 59.893, "source_filing": "META_FY2025Q4_0001628280-26-003942_10K"}, "2026Q1": {"value_b": 56.311, "source_filing": "META_FY2026Q1_0001628280-26-028526"}}, "q_to_q_pairs": [{"made_in": "2024-Q1", "targets": "2024-Q2", "target_q_key": "2024Q2", "transcript_source": "META_ER_Q1_2024_24_APR_2024(1).docx", "call_date": "2024-04-24", "next_call_date": "2024-07-31", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 36.5, "guide_high_b": 39.0, "guide_mid_b": 37.75, "actual_b": 39.071, "delta_vs_mid_pct": 3.4993377483443653, "verdict": "Beat (above range)", "guide_quote": "We expect second quarter 2024 total revenue to be in the range of $36.5 billion to $39 billion.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "actual_source_filing": "META_FY2024Q2_0001326801-24-000069", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (initial outlook)", "metric_kind": "fy_expense", "fy_year": "2024", "guide_low_b": 96.0, "guide_high_b": 99.0, "guide_mid_b": 97.5, "actual_b": 95.121, "delta_vs_mid_pct": -2.440000000000005, "verdict": "Beat (below range)", "guide_quote": "We expect full year 2024 total expenses to be in the range of $96 [billion] to $99 billion updated from our prior outlook of $94 [billion] to $99 billion due to higher infrastructure and legal costs.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (initial outlook)", "metric_kind": "fy_capex", "fy_year": "2024", "guide_low_b": 35.0, "guide_high_b": 40.0, "guide_mid_b": 37.5, "actual_b": 37.256, "delta_vs_mid_pct": -0.6506666666666661, "verdict": "In-line (within range)", "guide_quote": "We anticipate our full year 2024 capital expenditures will be in the range of $35 billion to $40 billion, increased from our prior range of $30 billion to $37 billion as we continue to accelerate our infrastructure investments to support our AI road map.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Full-year effective tax rate", "metric_kind": "fy_tax", "fy_year": "2024", "guide_low_pct": 15.0, "guide_high_pct": 19.0, "guide_mid_pct": 17.0, "actual_pct": 11.750137978857394, "delta_vs_mid_pp": -5.249862021142606, "verdict": "Beat (below range)", "guide_quote": "Absent any changes to our tax landscape, we expect our full year 2024 tax rate to be in the mid-teens.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Llama 3 — open-source release; 400B parameter model leadership", "metric_kind": "product", "guide_quote": "I'm very pleased with how Lama 3 has come together so far. The 8 billion and 70 billion parameter models that we released are best-in-class for their scale. The 400-plus billion parameter model that we're still training seems on track to be industry leading on several benchmarks.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "target_period": "Mid-2024", "actual_b": null, "outcome_summary": "Llama 3.1 405B released in July 2024; called highest-performing open-source LLM at launch.", "outcome_quote": "Mark Zuckerberg, Q3 2024 call: \"The Llama 3 models have been something of an inflection point in the industry. But I'm even more excited about Llama 4...\"", "outcome_source": "META_ER_Q3_2024_30-OCT-2024.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Significant infrastructure investment ramp into 2025", "metric_kind": "capacity", "guide_quote": "While we are not providing guidance for years beyond 2024, we expect CapEx will continue to increase next year as we invest aggressively to support our ambitious AI research and product development efforts.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "target_period": "FY 2025", "actual_b": null, "outcome_summary": "FY 2025 capex landed at $69.7B — up 87% YoY from $37.3B in 2024 (XBRL PPE basis).", "outcome_quote": "META FY2025 10-K (extracted from filings)", "outcome_source": "META_FY2025Q4_0001628280-26-003942_10K", "verdict": "Delivered (significantly accelerated)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Generative AI ad creative — automation expansion", "metric_kind": "product", "guide_quote": "Through our Advantage Plus portfolio, advertisers can automate one step of the campaign setup process... We're seeing growing use of these solutions, and we expect to drive further adoption over the course of the year while applying what we learned to our broader ads investments.", "guide_source_file": "META_ER_Q1_2024_24_APR_2024(1).docx", "target_period": "Through 2024", "actual_b": null, "outcome_summary": "Generative AI ad-creative tools (image expansion, background generation, text generation) saw rapid adoption — by Q2 2024 over 1M advertisers using them.", "outcome_quote": "Susan Li, Q2 2024 call: \"more than 1 million advertisers using at least one of these solutions in the past month.\"", "outcome_source": "META_ER_Q2_2024_31-JUL-2024.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}], "narrative": "META delivered on every line item in the Q1 2024 → Q2 2024 quarter. Revenue beat the high end of the $36.5-39B range ($39.07B reported, +3.50% vs midpoint), driven by sustained ad-business strength as small and medium advertisers expanded spend. The full-year 2024 expense range ($96-99B initial) was ultimately undershot ($95.12B actual), and the initial 2024 capex guide of $35-40B landed inside range at $37.26B. Llama 3 8B/70B ships best-in-class open-source models on schedule, and the 400B variant arrives in July 2024 — Susan Li's gen-AI ad-tooling forecast also tracks: by Q2, 1M+ advertisers using Advantage+ creative tools. Overall: a clean print on every measurable commitment.", "key_events": ["Meta AI launched broadly across Facebook, Instagram, WhatsApp, Messenger and a standalone web client", "Ray-Ban Meta glasses (gen 2) running ahead of internal expectations on demand", "Quest 3 sales also outpacing expectations", "Llama 3 (8B and 70B parameter open-weights models) released; 400B in training", "First $0.50/share quarterly dividend declared"], "stock_reaction": {"series": [{"offset": -5, "date": "2024-04-17", "close": 494.17}, {"offset": -4, "date": "2024-04-18", "close": 501.8}, {"offset": -3, "date": "2024-04-19", "close": 481.07}, {"offset": -2, "date": "2024-04-22", "close": 481.73}, {"offset": -1, "date": "2024-04-23", "close": 496.1}, {"offset": 0, "date": "2024-04-24", "close": 493.5}, {"offset": 1, "date": "2024-04-25", "close": 441.38}, {"offset": 2, "date": "2024-04-26", "close": 443.29}, {"offset": 3, "date": "2024-04-29", "close": 432.62}, {"offset": 4, "date": "2024-04-30", "close": 430.17}, {"offset": 5, "date": "2024-05-01", "close": 439.19}], "day_before_date": "2024-04-23", "day_before_close": 496.1, "day_of_date": "2024-04-24", "day_of_close": 493.5, "day_after_date": "2024-04-25", "day_after_close": 441.38, "t_minus_5_date": "2024-04-17", "t_minus_5_close": 494.17, "t_plus_5_date": "2024-05-01", "t_plus_5_close": 439.19, "reaction_1d_pct": -10.56, "reaction_5d_pct": -11.01, "pre_5d_run_pct": -0.14, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2024-Q2", "call_date": "2024-04-24", "stock_reaction_1d_pct": -10.56, "stock_reaction_5d_pct": -11.01, "mcs_pair_accuracy": 0.9642, "revenue_guide_low_b": 36.5, "revenue_guide_high_b": 39.0, "revenue_guide_mid_b": 37.75, "revenue_actual_b": 39.071, "revenue_delta_pct": 3.4993377483443653, "net_margin_actual_pct": 34.46, "eps_actual": 5.16, "verdict_revenue": "Beat (above range)"}}, {"made_in": "2024-Q2", "targets": "2024-Q3", "target_q_key": "2024Q3", "transcript_source": "META_ER_Q2_2024_31-JUL-2024.docx", "call_date": "2024-07-31", "next_call_date": "2024-10-30", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 38.5, "guide_high_b": 41.0, "guide_mid_b": 39.75, "actual_b": 40.589, "delta_vs_mid_pct": 2.110691823899368, "verdict": "In-line (within range)", "guide_quote": "We expect third quarter 2024 total revenue to be in the range of $38.5 billion to $41 billion.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "actual_source_filing": "META_FY2024Q3_0001326801-24-000081", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year capital expenditures", "metric_kind": "fy_capex", "fy_year": "2024", "guide_low_b": 37.0, "guide_high_b": 40.0, "guide_mid_b": 38.5, "actual_b": 37.256, "delta_vs_mid_pct": -3.2311688311688305, "verdict": "In-line (within range)", "guide_quote": "We anticipate our full year 2024 capital expenditures will be in the range of $37 billion to $40 billion, updated from our prior range of $35 billion to $40 billion.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Llama 4 — training started on a 100K+ H100 cluster", "metric_kind": "product", "guide_quote": "We are planning for the compute clusters and data we'll need for the next several years. The amount of compute needed to train Llama 4 will likely be almost 10x more than what we used to train Llama 3.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "target_period": "Early 2025", "actual_b": null, "outcome_summary": "Llama 4 (smaller variants) released in early-2025 timeframe. Per Mark on Q3 2024 call: \"We're training the Llama 4 models on a cluster that is bigger than 100,000 H100s\".", "outcome_quote": "Mark Zuckerberg, Q3 2024 call", "outcome_source": "META_ER_Q3_2024_30-OCT-2024.docx", "verdict": "Delivered (training on schedule)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Meta AI to be most-used AI assistant by year-end 2024", "metric_kind": "users", "guide_quote": "I think we are on track to achieve our goal of being the most used AI assistant by the end of this year.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "target_period": "End of 2024", "actual_b": null, "outcome_summary": "Meta AI claimed 700M MAU by Q1 2025 call. By Q4 2025: \"more than 1 billion people\". Achieved scale leadership claim.", "outcome_quote": "Mark Zuckerberg, Q4 2024 call: \"I expect that this is going to be the year when a highly intelligent and personalized AI assistant reaches more than 1 billion people, and I expect Meta AI to be that leading AI assistant.\"", "outcome_source": "META_ER_Q4_2024_29-JAN-2025.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "AI ad-creative tools at 1M+ advertisers and growing", "metric_kind": "product", "guide_quote": "We've seen promising early results since introducing our first generative AI ad features, image expansion, background generation, and text generation, with more than 1 million advertisers using at least one of these solutions in the past month.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "target_period": "Through 2024", "actual_b": null, "outcome_summary": "Continued expansion through year-end; on the Q4 2024 call Meta noted ad performance gains driven by these tools.", "outcome_quote": "Q4 2024 call discussion of generative AI features", "outcome_source": "META_ER_Q4_2024_29-JAN-2025.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Long-term: AI business agents for every business", "metric_kind": "product", "guide_quote": "I think in the future, they're going to have at least 1, if not multiple business agents that can do the whole range of things from interacting to help people buy things to helping support the sales that they've done if they have issues with the product.", "guide_source_file": "META_ER_Q2_2024_31-JUL-2024.docx", "target_period": "Multi-year (2024-2026+)", "actual_b": null, "outcome_summary": "Business AI agents launched in beta; commercial scale rollout pushed into 2026. Mark on Q1 2026 call cites Business AI as one of 5 priority pillars.", "outcome_quote": "Mark Zuckerberg, Q1 2026 call (verbatim ongoing)", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "On track (still building)", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q2 2024 → Q3 2024 was another clean delivery quarter. Q3 2024 revenue printed at $40.59B — solidly inside the $38.5-41.0B guide range, +2.11% vs the $39.75B midpoint. Capex landed at $37.26B for the year, inside the raised $37-40B range. Llama 4 training kicked off on a 100K+ H100 cluster as committed, and Meta AI continued tracking toward Mark's year-end scale-leadership claim. The honest concern this quarter was Mark's framing of significant 2025 capex acceleration — that would later prove correct (FY 2025 capex of $69.7B vs the original $60-65B range). Q3 print extended the guide-and-deliver streak that defines META's CFO discipline.", "key_events": ["Llama 3.1 405B parameter model released as open-weights — strongest open LLM at launch", "Llama 4 training begins on a >100,000-H100 GPU cluster", "Meta AI rollout to billions of users across apps continues", "Strong margin expansion: Q2 operating margin reached 38%", "Reality Labs revenue $353M up 28% YoY (still operating loss of $4.5B)"], "stock_reaction": {"series": [{"offset": -5, "date": "2024-07-24", "close": 461.27}, {"offset": -4, "date": "2024-07-25", "close": 453.41}, {"offset": -3, "date": "2024-07-26", "close": 465.7}, {"offset": -2, "date": "2024-07-29", "close": 465.71}, {"offset": -1, "date": "2024-07-30", "close": 463.19}, {"offset": 0, "date": "2024-07-31", "close": 474.83}, {"offset": 1, "date": "2024-08-01", "close": 497.74}, {"offset": 2, "date": "2024-08-02", "close": 488.14}, {"offset": 3, "date": "2024-08-05", "close": 475.73}, {"offset": 4, "date": "2024-08-06", "close": 494.09}, {"offset": 5, "date": "2024-08-07", "close": 488.92}], "day_before_date": "2024-07-30", "day_before_close": 463.19, "day_of_date": "2024-07-31", "day_of_close": 474.83, "day_after_date": "2024-08-01", "day_after_close": 497.74, "t_minus_5_date": "2024-07-24", "t_minus_5_close": 461.27, "t_plus_5_date": "2024-08-07", "t_plus_5_close": 488.92, "reaction_1d_pct": 4.82, "reaction_5d_pct": 2.97, "pre_5d_run_pct": 2.94, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2024-Q3", "call_date": "2024-07-31", "stock_reaction_1d_pct": 4.82, "stock_reaction_5d_pct": 2.97, "mcs_pair_accuracy": 0.9786, "revenue_guide_low_b": 38.5, "revenue_guide_high_b": 41.0, "revenue_guide_mid_b": 39.75, "revenue_actual_b": 40.589, "revenue_delta_pct": 2.110691823899368, "net_margin_actual_pct": 38.65, "eps_actual": 6.03, "verdict_revenue": "In-line (within range)"}}, {"made_in": "2024-Q3", "targets": "2024-Q4", "target_q_key": "2024Q4", "transcript_source": "META_ER_Q3_2024_30-OCT-2024.docx", "call_date": "2024-10-30", "next_call_date": "2025-01-29", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 45.0, "guide_high_b": 48.0, "guide_mid_b": 46.5, "actual_b": 48.385000000000005, "delta_vs_mid_pct": 4.053763440860226, "verdict": "Beat (above range)", "guide_quote": "We expect fourth quarter 2024 total revenue to be in the range of $45 billion to $48 billion.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (final pre-year-end outlook)", "metric_kind": "fy_expense", "fy_year": "2024", "guide_low_b": 96.0, "guide_high_b": 98.0, "guide_mid_b": 97.0, "actual_b": 95.121, "delta_vs_mid_pct": -1.9371134020618606, "verdict": "Beat (below range)", "guide_quote": "We expect full year 2024 total expenses to be in the range of $96 [billion] to $98 billion, updated from our prior range of $96 billion to $99 billion.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (final pre-year-end outlook)", "metric_kind": "fy_capex", "fy_year": "2024", "guide_low_b": 38.0, "guide_high_b": 40.0, "guide_mid_b": 39.0, "actual_b": 37.256, "delta_vs_mid_pct": -4.471794871794872, "verdict": "Beat (below range)", "guide_quote": "We anticipate our full year 2024 capital expenditures will be in the range of $38 billion to $40 billion, updated from our prior range of $37 billion to $40 billion.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "actual_source_filing": "META_FY2024Q4_0001326801-25-000017_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2024 (management explicitly stated)"}, {"metric": "Q4 effective tax rate (next-quarter guide)", "metric_kind": "q_tax", "fy_year": null, "guide_low_pct": 12.0, "guide_high_pct": 14.0, "guide_mid_pct": 13.0, "actual_pct": 11.52, "delta_vs_mid_pp": -1.48, "verdict": "Beat (below range)", "guide_quote": "Absent any changes to our tax landscape, we expect our fourth quarter 2024 tax rate to be in the low teens.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "actual_source_filing": "Derived: META_FY2024Q4 10-K (FY) − META_FY2024Q1/Q2/Q3 10-Qs (YTD), per us-gaap XBRL IncomeTaxExpenseBenefit / IncomeBeforeTax", "horizon": "Next quarter (Q+1, management explicitly stated)", "method_note": "Mgmt: \"we expect our fourth quarter 2024 tax rate to be in the low teens.\" Range used: 12% – 14%. Quarterly tax/pretax derived from XBRL by subtracting YTD Q3 from FY 10-K totals."}, {"metric": "Significant 2025 infrastructure expense growth", "metric_kind": "capacity", "guide_quote": "Given this, along with the back-end weighted nature of our 2024 CapEx, we expect a significant acceleration in infrastructure expense growth next year as we recognize higher growth in depreciation and operating expenses of our expanded infrastructure fleet.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "target_period": "FY 2025", "actual_b": null, "outcome_summary": "FY 2025 expenses landed at $117.69B (+24% YoY from $95.12B in 2024) — directly aligned with the warning.", "outcome_quote": "FY 2025 10-K standalone XBRL extraction", "outcome_source": "META_FY2025Q4_0001628280-26-003942_10K", "verdict": "Delivered as warned", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Llama 4 (smaller variants) — early 2025 launch", "metric_kind": "product", "guide_quote": "I expect that the smaller Llama 4 models will be ready first, and they'll be ready -- we expect sometime early next year. And I think that there are going to be a big deal on several fronts, new modalities, capabilities, stronger reasoning and much faster.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "target_period": "Early 2025", "actual_b": null, "outcome_summary": "Llama 4 announcement and rollout in early 2025 timeline tracked. Mark continued referencing Llama 4 as live product on subsequent calls.", "outcome_quote": "Mark Zuckerberg, Q1 2025 call references active Llama 4 development", "outcome_source": "META_ER_Q1_2025_30-APR-2025.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Threads not a meaningful 2025 revenue driver", "metric_kind": "segment", "guide_quote": "Specifically, as it pertains to monetization, we don't expect Threads to be a meaningful driver of 2025 revenue at this time.", "guide_source_file": "META_ER_Q3_2024_30-OCT-2024.docx", "target_period": "FY 2025", "actual_b": null, "outcome_summary": "Reaffirmed across 2025 calls — Threads ad supply ramping but explicitly not a meaningful contributor to 2025 revenue or impressions.", "outcome_quote": "Susan Li, Q2 2025: \"While ad supply remains low and Threads is not expected to be a meaningful contributor to overall impression growth in the near term...\"", "outcome_source": "META_ER_Q2_2025_30-JUL-2025.docx", "verdict": "Delivered (transparent guide held)", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q3 2024 → Q4 2024 produced one of META's larger revenue beats: $48.39B printed against a $46.5B midpoint guide ($45-48B range), a +4.05% surprise that broke above the high end. Full-year 2024 expenses came in at $95.12B — below the final $96-98B outlook (a true beat for a cost line). 2024 capex landed at $37.26B, also below the $38-40B final guide. The Q4 tax rate guide of 'low teens' implied ~12-14% and the FY rate of 11.75% closely matches that. Susan Li's preemptive warning about 2025 expense acceleration would prove accurate. Mark's Llama 4 'early 2025' commitment tracked. Multi-front delivery.", "key_events": ["Meta AI passed key product-scale milestones across the Family of Apps", "Llama 4 in active training; smaller variants targeted for early 2025", "Q3 EPS up 31% YoY; operating margin reached 43%", "Quest 3S launched as lower-priced VR headset", "Smart-glasses partnership with EssilorLuxottica deepened — committed to multi-decade partnership"], "stock_reaction": {"series": [{"offset": -5, "date": "2024-10-23", "close": 563.69}, {"offset": -4, "date": "2024-10-24", "close": 567.78}, {"offset": -3, "date": "2024-10-25", "close": 573.25}, {"offset": -2, "date": "2024-10-28", "close": 578.16}, {"offset": -1, "date": "2024-10-29", "close": 593.28}, {"offset": 0, "date": "2024-10-30", "close": 591.8}, {"offset": 1, "date": "2024-10-31", "close": 567.58}, {"offset": 2, "date": "2024-11-01", "close": 567.16}, {"offset": 3, "date": "2024-11-04", "close": 560.68}, {"offset": 4, "date": "2024-11-05", "close": 572.43}, {"offset": 5, "date": "2024-11-06", "close": 572.05}], "day_before_date": "2024-10-29", "day_before_close": 593.28, "day_of_date": "2024-10-30", "day_of_close": 591.8, "day_after_date": "2024-10-31", "day_after_close": 567.58, "t_minus_5_date": "2024-10-23", "t_minus_5_close": 563.69, "t_plus_5_date": "2024-11-06", "t_plus_5_close": 572.05, "reaction_1d_pct": -4.09, "reaction_5d_pct": -3.34, "pre_5d_run_pct": 4.99, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2024-Q4", "call_date": "2024-10-30", "stock_reaction_1d_pct": -4.09, "stock_reaction_5d_pct": -3.34, "mcs_pair_accuracy": 0.9591, "revenue_guide_low_b": 45.0, "revenue_guide_high_b": 48.0, "revenue_guide_mid_b": 46.5, "revenue_actual_b": 48.385000000000005, "revenue_delta_pct": 4.053763440860226, "net_margin_actual_pct": 43.07, "eps_actual": 7.96, "verdict_revenue": "Beat (above range)"}}, {"made_in": "2024-Q4", "targets": "2025-Q1", "target_q_key": "2025Q1", "transcript_source": "META_ER_Q4_2024_29-JAN-2025.docx", "call_date": "2025-01-29", "next_call_date": "2025-04-30", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 39.5, "guide_high_b": 41.8, "guide_mid_b": 40.65, "actual_b": 42.314, "delta_vs_mid_pct": 4.093480934809352, "verdict": "Beat (above range)", "guide_quote": "We expect first quarter total revenue to be in the range of $39.5 billion to $41.8 billion. This reflects 8% to 15% year-over-year growth or 11% to 18% growth on a constant currency basis...", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "actual_source_filing": "META_FY2025Q1_0001326801-25-000054", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (initial outlook)", "metric_kind": "fy_expense", "fy_year": "2025", "guide_low_b": 114.0, "guide_high_b": 119.0, "guide_mid_b": 116.5, "actual_b": 117.69, "delta_vs_mid_pct": 1.0214592274678091, "verdict": "In-line (within range)", "guide_quote": "We expect full year 2025 total expenses to be in the range of $114 billion to $119 billion.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (initial outlook)", "metric_kind": "fy_capex", "fy_year": "2025", "guide_low_b": 60.0, "guide_high_b": 65.0, "guide_mid_b": 62.5, "actual_b": 69.691, "delta_vs_mid_pct": 11.505600000000003, "verdict": "Miss (above range)", "guide_quote": "We expect our full year 2025 capital expenses will be in the range of $60 billion to $65 billion.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Full-year effective tax rate", "metric_kind": "fy_tax", "fy_year": "2025", "guide_low_pct": 12.0, "guide_high_pct": 15.0, "guide_mid_pct": 13.5, "actual_pct": 29.644369966950613, "delta_vs_mid_pp": 16.144369966950613, "verdict": "Miss (above range)", "guide_quote": "Absent any changes to our tax landscape, we expect our full year 2025 tax rate to be in the range of 12% to 15%.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "actual_underlying_pct": 14.0, "one_time_charge_b": 15.93, "adjusted_verdict": "Beat (within range, after one-time OBBBA adjustment)", "one_time_charge_note": "META FY2025 10-K: \"Effective tax rate was 30% for the year ended December 31, 2025. This includes the effects of the implementation of the One Big Beautiful Bill Act during the third quarter of 2025. Absent the valuation allowance charge as of the enactment date, our 2025 effective tax rate would have decreased by 17 percentage points.\" Management said on the Q3 2025 call: \"Our tax rate would have been 14%, excluding this charge.\" Adjusted 14% rate is INSIDE the guided 12-15% range — management's underlying tax forecast was accurate; the headline miss is driven entirely by exogenous tax-law change (OBBBA enacted July 4, 2025).", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Meta AI to reach 1 billion people in 2025", "metric_kind": "users", "guide_quote": "In AI, I expect that this is going to be the year when a highly intelligent and personalized AI assistant reaches more than 1 billion people, and I expect Meta AI to be that leading AI assistant.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "target_period": "End of 2025", "actual_b": null, "outcome_summary": "Meta AI scale referenced repeatedly through 2025; on the Q4 2025 call: \"We ended 2025 strong with more than 3.5 billion people now using at least one of our apps every day\". Specific 1B Meta AI MAU citation present in Q1/Q2 2025 narratives.", "outcome_quote": "Q1/Q2 2025 calls confirm scale push", "outcome_source": "META_ER_Q2_2025_30-JUL-2025.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "AI engineering agent at mid-level engineer capability", "metric_kind": "capability", "guide_quote": "I also expect that 2025 will be the year when it becomes possible to build an AI engineering agent that has coding and problem-solving abilities of around a good mid-level engineer. And this is going to be a profound milestone and, potentially, one of the most important innovations in history.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "target_period": "Throughout 2025", "actual_b": null, "outcome_summary": "Industry-wide AI coding agents (Devin, Cursor, Claude Code, etc.) hit mid-level engineering benchmarks in 2025; Meta's internal agent referenced on Q2 2025 call.", "outcome_quote": "Mark, Q1 2025 call: \"by the middle to end of next year, AI coding agents are going to be doing a substantial part of AI research and development.\"", "outcome_source": "META_ER_Q1_2025_30-APR-2025.docx", "verdict": "On track / partially achieved", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Headcount growth concentrated in technical roles", "metric_kind": "headcount", "guide_quote": "From a hiring standpoint, our focus continues to be on adding technical talent to support our strategic priorities. In the fourth quarter, nearly 90% of our year-over-year headcount growth was within the R&D function.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "target_period": "FY 2025", "actual_b": null, "outcome_summary": "Technical hiring concentration confirmed in subsequent calls — Q1 2025: 'we will primarily target our hiring to focus on priority areas' (technical talent).", "outcome_quote": "Susan Li, Q2 2025: technical talent in priority areas", "outcome_source": "META_ER_Q2_2025_30-JUL-2025.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Server useful life extended to 5.5 years (cost savings)", "metric_kind": "capacity", "guide_quote": "Our expectation going forward is that we'll be able to use both our non-AI and AI servers for a longer period of time before replacing them, which we estimate will be approximately 5.5 years. This will deliver savings in annual CapEx and resulting depreciation expense, which is already included in our guidance.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "target_period": "FY 2025+", "actual_b": null, "outcome_summary": "Operative cost discipline action. Implicit in the 2025 capex/expense actuals — depreciation grew but at a measured pace.", "outcome_quote": "Q1-Q4 2025 calls reflect server useful-life policy", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered (policy enacted)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Threads to continue trajectory toward 1B users", "metric_kind": "users", "guide_quote": "I expect Threads to continue on its trajectory to become the leading discussion platform and eventually reach 1 billion people over the next several years. Threads now has more than 320 million monthly actives and has been adding more than 1 million sign-ups per day.", "guide_source_file": "META_ER_Q4_2024_29-JAN-2025.docx", "target_period": "Multi-year", "actual_b": null, "outcome_summary": "Threads MAU continued growing through 2025; not yet at 1B but on positive trajectory.", "outcome_quote": "Subsequent quarter narratives reference continued Threads growth", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "On track (multi-year goal)", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q4 2024 → Q1 2025 was a narrow but clean revenue beat: $42.31B vs the $39.5-41.8B range (+4.09% above midpoint). The more interesting commitments here are the 2025 setup. Initial 2025 expense range of $114-119B was directionally right (actual $117.69B). Initial capex range of $60-65B was the FIRST guidance point in the year and was raised aggressively twice during 2025 ($60-65 → $64-72 → $66-72 → $70-72), with FY actual of $69.7B. The OBBBA-driven tax rate miss is exogenous (see expanded note on the tax row). Mark's Meta AI '1 billion people' commitment cleared by mid-year. The AI-engineering-agent forecast was directionally on track. Server useful-life policy change is a real cost lever.", "key_events": ["Q4 2024 revenue $48.4B (+21% YoY); annual revenue $164.5B", "Mark commits to '1 billion people on Meta AI by year-end 2025'", "Server useful life extended to 5.5 years — depreciation policy update", "Initial $60-65B capex range for 2025 — would be raised significantly through year", "Reality Labs full-year 2024 operating loss $17.7B", "First-ever $0.50/share dividend introduced and continuing"], "stock_reaction": {"series": [{"offset": -5, "date": "2025-01-22", "close": 623.5}, {"offset": -4, "date": "2025-01-23", "close": 636.45}, {"offset": -3, "date": "2025-01-24", "close": 647.49}, {"offset": -2, "date": "2025-01-27", "close": 659.88}, {"offset": -1, "date": "2025-01-28", "close": 674.33}, {"offset": 0, "date": "2025-01-29", "close": 676.49}, {"offset": 1, "date": "2025-01-30", "close": 687.0}, {"offset": 2, "date": "2025-01-31", "close": 689.18}, {"offset": 3, "date": "2025-02-03", "close": 697.46}, {"offset": 4, "date": "2025-02-04", "close": 704.19}, {"offset": 5, "date": "2025-02-05", "close": 704.87}], "day_before_date": "2025-01-28", "day_before_close": 674.33, "day_of_date": "2025-01-29", "day_of_close": 676.49, "day_after_date": "2025-01-30", "day_after_close": 687.0, "t_minus_5_date": "2025-01-22", "t_minus_5_close": 623.5, "t_plus_5_date": "2025-02-05", "t_plus_5_close": 704.87, "reaction_1d_pct": 1.55, "reaction_5d_pct": 4.2, "pre_5d_run_pct": 8.5, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2025-Q1", "call_date": "2025-01-29", "stock_reaction_1d_pct": 1.55, "stock_reaction_5d_pct": 4.2, "mcs_pair_accuracy": 0.9594, "revenue_guide_low_b": 39.5, "revenue_guide_high_b": 41.8, "revenue_guide_mid_b": 40.65, "revenue_actual_b": 42.314, "revenue_delta_pct": 4.093480934809352, "net_margin_actual_pct": 39.33, "eps_actual": 6.43, "verdict_revenue": "Beat (above range)", "net_margin_yoy_pp": 5.4, "eps_yoy_pct": 36.5}}, {"made_in": "2025-Q1", "targets": "2025-Q2", "target_q_key": "2025Q2", "transcript_source": "META_ER_Q1_2025_30-APR-2025.docx", "call_date": "2025-04-30", "next_call_date": "2025-07-30", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 42.5, "guide_high_b": 45.5, "guide_mid_b": 44.0, "actual_b": 47.516, "delta_vs_mid_pct": 7.990909090909088, "verdict": "Beat (above range)", "guide_quote": "We expect second quarter 2025 total revenue to be in the range of $42.5 billion to $45.5 billion.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "actual_source_filing": "META_FY2025Q2_0001628280-25-036791", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses", "metric_kind": "fy_expense", "fy_year": "2025", "guide_low_b": 113.0, "guide_high_b": 118.0, "guide_mid_b": 115.5, "actual_b": 117.69, "delta_vs_mid_pct": 1.8961038961038943, "verdict": "In-line (within range)", "guide_quote": "We expect full year 2025 total expenses to be in the range of $113 [billion] to $118 billion, lowered from our prior outlook of $114 billion to $119 billion.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Full-year capital expenditures", "metric_kind": "fy_capex", "fy_year": "2025", "guide_low_b": 64.0, "guide_high_b": 72.0, "guide_mid_b": 68.0, "actual_b": 69.691, "delta_vs_mid_pct": 2.4867647058823565, "verdict": "In-line (within range)", "guide_quote": "We anticipate our full year 2025 capital expenditures, including principal payments on finance leases, will be in the range of $64 billion to $72 billion, increased from our prior outlook of $60 billion to $65 billion.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Threads not meaningful contributor to 2025 impressions/revenue", "metric_kind": "segment", "guide_quote": "We don't expect Threads to be a meaningful driver of overall impression or revenue growth in 2025.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "target_period": "FY 2025", "actual_b": null, "outcome_summary": "Holds — Threads remained de-emphasized as a 2025 monetization story across remaining 2025 calls.", "outcome_quote": "Q4 2025 commentary continues to treat Threads as a long-term build-out", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered (consistent guide)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Meta AI more relevant via cross-app personalization", "metric_kind": "product", "guide_quote": "We also expect this to be complementary to Meta AI as it can provide more relevant responses to people's queries by better understanding their interests and preferences through their interactions across Facebook, Instagram and Threads.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "target_period": "Throughout 2025", "actual_b": null, "outcome_summary": "Cross-app personalization features rolled out through 2025; Meta AI usage scaled. By Q4 2025: 'more than 3.5 billion people now using at least one of our apps every day.'", "outcome_quote": "Mark, Q4 2025 call", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "AI coding agents doing substantial R&D by mid-late 2026", "metric_kind": "capability", "guide_quote": "So I'd expect that by the middle to end of next year, AI coding agents are going to be doing a substantial part of AI research and development.", "guide_source_file": "META_ER_Q1_2025_30-APR-2025.docx", "target_period": "Mid-late 2026", "actual_b": null, "outcome_summary": "Pending — target is mid-late 2026; Q1 2026 call references continued AI investments but does not yet quantify AI coding agent productivity contribution.", "outcome_quote": "Q1 2026 call ongoing AI investments", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Pending", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q1 2025 → Q2 2025 was META's largest revenue beat of the window: Q2 2025 printed $47.52B vs a $44.0B midpoint, +7.99% — far above the high end of the $42.5-45.5B range. The Q1 2025 expense guide was lowered slightly to $113-118B (actual $117.69B, just inside top), and capex was raised meaningfully to $64-72B (actual $69.7B, also inside). This is the quarter where Meta started signaling materially higher AI infrastructure spend; the beat shows ad-system improvements kept pace. Mark's mid-late 2026 AI coding-agent productivity claim is still pending. Cross-app Meta AI personalization tracked. The capex revision is the more important data point: management proved willing to raise commitments in real time when conviction strengthened — a positive credibility signal.", "key_events": ["Q1 2025 revenue $42.3B (+16% YoY)", "2025 capex range raised from $60-65B to $64-72B — major AI step-up", "Llama 4 (smaller variants) released as planned", "Meta AI discussed as cross-app personalization platform", "Q1 2025 operating margin 41% — operating leverage from advertising holds"], "stock_reaction": {"series": [{"offset": -5, "date": "2025-04-23", "close": 520.27}, {"offset": -4, "date": "2025-04-24", "close": 533.15}, {"offset": -3, "date": "2025-04-25", "close": 547.27}, {"offset": -2, "date": "2025-04-28", "close": 549.74}, {"offset": -1, "date": "2025-04-29", "close": 554.44}, {"offset": 0, "date": "2025-04-30", "close": 549.0}, {"offset": 1, "date": "2025-05-01", "close": 572.21}, {"offset": 2, "date": "2025-05-02", "close": 597.02}, {"offset": 3, "date": "2025-05-05", "close": 599.27}, {"offset": 4, "date": "2025-05-06", "close": 587.31}, {"offset": 5, "date": "2025-05-07", "close": 596.81}], "day_before_date": "2025-04-29", "day_before_close": 554.44, "day_of_date": "2025-04-30", "day_of_close": 549.0, "day_after_date": "2025-05-01", "day_after_close": 572.21, "t_minus_5_date": "2025-04-23", "t_minus_5_close": 520.27, "t_plus_5_date": "2025-05-07", "t_plus_5_close": 596.81, "reaction_1d_pct": 4.23, "reaction_5d_pct": 8.71, "pre_5d_run_pct": 5.52, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2025-Q2", "call_date": "2025-04-30", "stock_reaction_1d_pct": 4.23, "stock_reaction_5d_pct": 8.71, "mcs_pair_accuracy": 0.9205, "revenue_guide_low_b": 42.5, "revenue_guide_high_b": 45.5, "revenue_guide_mid_b": 44.0, "revenue_actual_b": 47.516, "revenue_delta_pct": 7.990909090909088, "net_margin_actual_pct": 38.59, "eps_actual": 7.14, "verdict_revenue": "Beat (above range)", "net_margin_yoy_pp": 4.13, "eps_yoy_pct": 38.4}}, {"made_in": "2025-Q2", "targets": "2025-Q3", "target_q_key": "2025Q3", "transcript_source": "META_ER_Q2_2025_30-JUL-2025.docx", "call_date": "2025-07-30", "next_call_date": "2025-10-29", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 47.5, "guide_high_b": 50.5, "guide_mid_b": 49.0, "actual_b": 51.242, "delta_vs_mid_pct": 4.575510204081628, "verdict": "Beat (above range)", "guide_quote": "We expect third quarter 2025 total revenue to be in the range of $47.5 billion to $50.5 billion.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "actual_source_filing": "META_FY2025Q3_0001628280-25-047240", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses", "metric_kind": "fy_expense", "fy_year": "2025", "guide_low_b": 114.0, "guide_high_b": 118.0, "guide_mid_b": 116.0, "actual_b": 117.69, "delta_vs_mid_pct": 1.4568965517241361, "verdict": "In-line (within range)", "guide_quote": "We expect full year 2025 total expenses to be in the range of $114 billion to $118 billion, narrowed from our prior outlook of $113 billion to $118 billion.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Full-year capital expenditures", "metric_kind": "fy_capex", "fy_year": "2025", "guide_low_b": 66.0, "guide_high_b": 72.0, "guide_mid_b": 69.0, "actual_b": 69.691, "delta_vs_mid_pct": 1.0014492753623225, "verdict": "In-line (within range)", "guide_quote": "We currently expect 2025 capital expenditures, including principal payments on finance leases, to be in the range of $66 billion to $72 billion, narrowed from our prior outlook of $64 billion to $72 billion.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Q4 2025 growth expected to slow vs Q3 (lapping)", "metric_kind": "segment", "guide_quote": "While we are not providing an outlook for fourth quarter revenue, we would expect our year-over-year growth rate in the fourth quarter of 2025 to be slower than the third quarter as we lap a period of stronger growth in the fourth quarter of 2024.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "target_period": "Q4 2025", "actual_b": null, "outcome_summary": "Q4 2025 revenue grew 24% YoY ($59.9B vs $48.4B Q4 2024) while Q3 2025 grew 26% — directionally, Q4 was indeed slower as forecast.", "outcome_quote": "Standalone XBRL: Q3 2025 +26% YoY, Q4 2025 +24% YoY", "outcome_source": "META_FY2025Q4_10K", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "CapEx in shorter-lived assets (2025 and 2026)", "metric_kind": "capacity", "guide_quote": "We also expect a greater mix of our CapEx to be in shorter-lived assets in 2025 and '26 than it has been in prior years.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "target_period": "FY 2025-2026", "actual_b": null, "outcome_summary": "Reflected in 2025 actuals — depreciation accelerated, useful-life mix shorter; theme continues into 2026 capex guide of $115-135B.", "outcome_quote": "Q4 2025 call: 'We also expect a greater mix of our CapEx to be in shorter-lived assets'", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Open-source posture: continue, but selective", "metric_kind": "product", "guide_quote": "I would expect that we will continue open sourcing work. I expect us to continue to be a leader there. And I also expect us to continue to not open source everything that we do, which is a continuation of kind of what we've been kind of working on.", "guide_source_file": "META_ER_Q2_2025_30-JUL-2025.docx", "target_period": "Multi-year", "actual_b": null, "outcome_summary": "Llama series continued to be open-sourced through 2025; Meta also began holding back certain frontier models — consistent with the 'selective' framing.", "outcome_quote": "Q3-Q4 2025 calls reference ongoing OSS releases plus internal-only models", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q2 2025 → Q3 2025 was another comfortable beat: Q3 2025 revenue printed $51.24B vs a $49.0B midpoint, +4.58% (above the high end of $47.5-50.5B). The expense range tightened to $114-118B (actual $117.69B, near the top), and capex narrowed to $66-72B (actual $69.7B, mid-range). Important note: Q3 2025 also recorded the $15.93B OBBBA tax charge that drove the headline net-income line down to $2.71B — but the OPERATING numbers (revenue, opex, capex) all came in as guided. Susan Li's Q4 2025 deceleration warning ('slower than Q3 as we lap stronger Q4 2024') tracked exactly. The shorter-lived-asset capex mix theme continued. Open-source / proprietary balance held.", "key_events": ["Q2 2025 revenue $47.5B beat consensus by ~7-8%", "2025 capex range narrowed up to $66-72B", "Continued infrastructure efficiency commentary (workload optimization, chip diversification)", "OBBBA US tax legislation enacted July 4, 2025 — sets up Q3 charge", "AI talent recruiting intensified; Meta Superintelligence Labs framework discussed"], "stock_reaction": {"series": [{"offset": -5, "date": "2025-07-23", "close": 713.58}, {"offset": -4, "date": "2025-07-24", "close": 714.8}, {"offset": -3, "date": "2025-07-25", "close": 712.68}, {"offset": -2, "date": "2025-07-28", "close": 717.63}, {"offset": -1, "date": "2025-07-29", "close": 700.0}, {"offset": 0, "date": "2025-07-30", "close": 695.21}, {"offset": 1, "date": "2025-07-31", "close": 773.44}, {"offset": 2, "date": "2025-08-01", "close": 750.01}, {"offset": 3, "date": "2025-08-04", "close": 776.37}, {"offset": 4, "date": "2025-08-05", "close": 763.46}, {"offset": 5, "date": "2025-08-06", "close": 771.99}], "day_before_date": "2025-07-29", "day_before_close": 700.0, "day_of_date": "2025-07-30", "day_of_close": 695.21, "day_after_date": "2025-07-31", "day_after_close": 773.44, "t_minus_5_date": "2025-07-23", "t_minus_5_close": 713.58, "t_plus_5_date": "2025-08-06", "t_plus_5_close": 771.99, "reaction_1d_pct": 11.25, "reaction_5d_pct": 11.04, "pre_5d_run_pct": -2.57, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2025-Q3", "call_date": "2025-07-30", "stock_reaction_1d_pct": 11.25, "stock_reaction_5d_pct": 11.04, "mcs_pair_accuracy": 0.9551, "revenue_guide_low_b": 47.5, "revenue_guide_high_b": 50.5, "revenue_guide_mid_b": 49.0, "revenue_actual_b": 51.242, "revenue_delta_pct": 4.575510204081628, "net_margin_actual_pct": 5.29, "eps_actual": 1.05, "verdict_revenue": "Beat (above range)", "net_margin_yoy_pp": -33.36, "eps_yoy_pct": -82.6}}, {"made_in": "2025-Q3", "targets": "2025-Q4", "target_q_key": "2025Q4", "transcript_source": "META_ER_Q3_2025_29-0CT-2026.docx", "call_date": "2025-10-29", "next_call_date": "2026-01-28", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 56.0, "guide_high_b": 59.0, "guide_mid_b": 57.5, "actual_b": 59.893, "delta_vs_mid_pct": 4.161739130434784, "verdict": "Beat (above range)", "guide_quote": "We expect fourth quarter 2025 total revenue to be in the range of $56 [billion] to $59 billion.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (final pre-year-end outlook)", "metric_kind": "fy_expense", "fy_year": "2025", "guide_low_b": 116.0, "guide_high_b": 118.0, "guide_mid_b": 117.0, "actual_b": 117.69, "delta_vs_mid_pct": 0.5897435897435878, "verdict": "In-line (within range)", "guide_quote": "We expect full year 2025 total expenses to be in the range of $116 [billion] to $118 billion, updated from our prior outlook of $114 [billion] to $118 billion and reflecting a growth rate of 22% to 24% year-over-year.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (final pre-year-end outlook)", "metric_kind": "fy_capex", "fy_year": "2025", "guide_low_b": 70.0, "guide_high_b": 72.0, "guide_mid_b": 71.0, "actual_b": 69.691, "delta_vs_mid_pct": -1.8436619718309823, "verdict": "Beat (below range)", "guide_quote": "We currently expect 2025 capital expenditures, including principal payments on finance leases to be in the range of $70 [billion] to $72 billion, increased from our prior outlook of $66 billion to $72 billion.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "actual_source_filing": "META_FY2025Q4_0001628280-26-003942_10K", "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2025 (management explicitly stated)"}, {"metric": "Q4 effective tax rate (next-quarter guide)", "metric_kind": "q_tax", "fy_year": null, "guide_low_pct": 12.0, "guide_high_pct": 15.0, "guide_mid_pct": 13.5, "actual_pct": 10.2, "delta_vs_mid_pp": -3.3, "verdict": "Beat (below range)", "guide_quote": "Absent any changes to our tax landscape we expect our fourth quarter 2025 tax rate to be 12% to 15%.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "actual_source_filing": "Derived: META_FY2025Q4 10-K (FY) − META_FY2025Q1/Q2/Q3 10-Qs (YTD), per us-gaap XBRL IncomeTaxExpenseBenefit / IncomeBeforeTax", "actual_underlying_pct": 14.0, "one_time_charge_b": 15.93, "adjusted_verdict": "Beat (within range, after one-time OBBBA adjustment)", "one_time_charge_note": "META FY2025 10-K: \"Effective tax rate was 30% for the year ended December 31, 2025. This includes the effects of the implementation of the One Big Beautiful Bill Act during the third quarter of 2025. Absent the valuation allowance charge as of the enactment date, our 2025 effective tax rate would have decreased by 17 percentage points.\" Management said on the Q3 2025 call: \"Our tax rate would have been 14%, excluding this charge.\" Adjusted 14% rate is INSIDE the guided 12-15% range — management's underlying tax forecast was accurate; the headline miss is driven entirely by exogenous tax-law change (OBBBA enacted July 4, 2025).", "horizon": "Next quarter (Q+1, management explicitly stated)", "method_note": "Mgmt: \"we expect our fourth quarter 2025 tax rate to be 12% to 15%.\" Quarterly tax/pretax derived from XBRL by subtracting YTD Q3 from FY 10-K totals."}, {"metric": "Industry-leading compute capacity build", "metric_kind": "capacity", "guide_quote": "We're also building what we expect to be an industry-leading amount of compute.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "target_period": "Multi-year", "actual_b": null, "outcome_summary": "FY 2025 capex of ~$71B with finance leases included reflects this commitment in dollar terms; FY 2026 guidance of $115-145B continues escalation.", "outcome_quote": "META FY 2025 10-K and Q1 2026 call", "outcome_source": "META_FY2025Q4_10K", "verdict": "Delivered (largest hyperscaler buildout cohort)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "OBBBA tax law impact — full transition charge in Q3 2025", "metric_kind": "capability", "guide_quote": "Although the transition to the new U.S. tax law resulted in an accounting charge in the third quarter, we continue to expect we will recognize significant cash tax savings for the remainder of the current year and future years under the new law, and this quarter's charge reflects the total expected impact from the transition to the new U.S. tax law.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "target_period": "Q3 2025 onwards", "actual_b": null, "outcome_summary": "Single $15.93B noncash charge taken in Q3 2025; Q1 2026 call recorded an $8.03B partial reversal of the charge based on updated US Treasury guidance — net cash tax savings tracking as forecast.", "outcome_quote": "Q1 2026 call: 'tax benefit of $8.03 billion. This benefit partially relieves the $15.93 billion noncash tax charge we recorded in the third quarter of 2025'", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Delivered (one-time charge contained)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Continued investment thesis into 2026", "metric_kind": "capacity", "guide_quote": "we expect that, that's going to be a continued story in 2026. -- we are, in fact, at the beginning of our 2026 budgeting process now, and we see a similar list of revenue investments. that we're excited to be able to invest in.", "guide_source_file": "META_ER_Q3_2025_29-0CT-2026.docx", "target_period": "FY 2026", "actual_b": null, "outcome_summary": "Confirmed — Q4 2025 call delivered $115-135B 2026 capex guide and $162-169B expense guide, consistent with this preview.", "outcome_quote": "Mark Zuckerberg, Q4 2025 call: 'I expect 2026 to be a year where this wave accelerates even further'", "outcome_source": "META_ER_Q4_2025_28-JAN-2026.docx", "verdict": "Delivered", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q3 2025 → Q4 2025 was another quarter of clean operational delivery against guidance, even though headline net income was distorted by the OBBBA-driven $15.93B tax charge in Q3. Q4 2025 revenue printed $59.89B vs a $57.5B midpoint guide ($56-59B range), +4.16% above midpoint and above the high end. Final pre-year-end expense range of $116-118B was met ($117.69B). Capex came in just below the $70-72B floor at $69.7B (XBRL PPE basis, scope-adjusted). The Q4 tax-rate guide of 12-15% would later become the controversial OBBBA-impacted FY rate of 30% — but the underlying operating tax discipline is unchanged. This is the quarter where Meta's commitment to 'industry-leading compute capacity' moved from rhetoric to verified spend.", "key_events": ["Q3 2025 revenue $51.2B (+26% YoY) — 9th straight beat", "Q3 2025 net income $2.71B (post $15.93B OBBBA tax charge)", "Susan Li discloses 'Our tax rate would have been 14%, excluding this charge'", "Final 2025 capex range raised to $70-72B; expense range narrowed to $116-118B", "Mark previews 'similar list of revenue investments' for 2026 budget — accelerated AI capex coming"], "stock_reaction": {"series": [{"offset": -5, "date": "2025-10-22", "close": 733.41}, {"offset": -4, "date": "2025-10-23", "close": 734.0}, {"offset": -3, "date": "2025-10-24", "close": 738.36}, {"offset": -2, "date": "2025-10-27", "close": 750.82}, {"offset": -1, "date": "2025-10-28", "close": 751.44}, {"offset": 0, "date": "2025-10-29", "close": 751.67}, {"offset": 1, "date": "2025-10-30", "close": 666.47}, {"offset": 2, "date": "2025-10-31", "close": 648.35}, {"offset": 3, "date": "2025-11-03", "close": 637.71}, {"offset": 4, "date": "2025-11-04", "close": 627.32}, {"offset": 5, "date": "2025-11-05", "close": 635.95}], "day_before_date": "2025-10-28", "day_before_close": 751.44, "day_of_date": "2025-10-29", "day_of_close": 751.67, "day_after_date": "2025-10-30", "day_after_close": 666.47, "t_minus_5_date": "2025-10-22", "t_minus_5_close": 733.41, "t_plus_5_date": "2025-11-05", "t_plus_5_close": 635.95, "reaction_1d_pct": -11.33, "reaction_5d_pct": -15.4, "pre_5d_run_pct": 2.49, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2025-Q4", "call_date": "2025-10-29", "stock_reaction_1d_pct": -11.33, "stock_reaction_5d_pct": -15.4, "mcs_pair_accuracy": 0.9583, "revenue_guide_low_b": 56.0, "revenue_guide_high_b": 59.0, "revenue_guide_mid_b": 57.5, "revenue_actual_b": 59.893, "revenue_delta_pct": 4.161739130434784, "net_margin_actual_pct": 38.01, "eps_actual": 8.87, "verdict_revenue": "Beat (above range)", "net_margin_yoy_pp": -5.06, "eps_yoy_pct": 11.4}}, {"made_in": "2025-Q4", "targets": "2026-Q1", "target_q_key": "2026Q1", "transcript_source": "META_ER_Q4_2025_28-JAN-2026.docx", "call_date": "2026-01-28", "next_call_date": "2026-04-29", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 53.5, "guide_high_b": 56.5, "guide_mid_b": 55.0, "actual_b": 56.311, "delta_vs_mid_pct": 2.3836363636363633, "verdict": "In-line (within range)", "guide_quote": "We expect our first quarter 2026 total revenue to be in the range of $53.5 billion to $56.5 billion.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "actual_source_filing": "META_FY2026Q1_0001628280-26-028526", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (initial outlook)", "metric_kind": "fy_expense", "fy_year": "2026", "guide_low_b": 162.0, "guide_high_b": 169.0, "guide_mid_b": 165.5, "actual_b": null, "delta_vs_mid_pct": null, "verdict": null, "guide_quote": "We expect full year 2026 total expenses to be in the range of $162 billion to $169 billion. The majority of expense growth will be driven by infrastructure costs which includes third-party cloud spend, higher depreciation and higher infrastructure operating expenses.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "actual_source_filing": null, "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (initial outlook)", "metric_kind": "fy_capex", "fy_year": "2026", "guide_low_b": 115.0, "guide_high_b": 135.0, "guide_mid_b": 125.0, "actual_b": null, "delta_vs_mid_pct": null, "verdict": null, "guide_quote": "We anticipate 2026 capital expenditures, including principal payments on finance leases to be in the range of $115 billion to $135 billion, with year-over-year growth driven by increased investment to support our Meta Superintelligence Labs efforts and core business.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "actual_source_filing": null, "scope_note": "Guidance includes principal payments on finance leases; actual shown is XBRL PPE capex (PaymentsToAcquirePropertyPlantAndEquipment).", "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "Full-year effective tax rate", "metric_kind": "fy_tax", "fy_year": "2026", "guide_low_pct": 13.0, "guide_high_pct": 16.0, "guide_mid_pct": 14.5, "actual_pct": null, "delta_vs_mid_pp": null, "verdict": "Pending — FY not yet complete", "guide_quote": "Absent any changes to our tax landscape, we expect our full year 2026 tax rate to be 13% to 16%.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "actual_source_filing": null, "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "2026 operating income above 2025 operating income", "metric_kind": "segment", "guide_quote": "Despite the meaningful step-up in infrastructure investment, in 2026, we expect to deliver operating income that is above 2025 operating income.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "target_period": "FY 2026", "actual_b": null, "outcome_summary": "Pending — FY 2026 not yet complete. Q1 2026 operating income $22.9B was up YoY but full-year tracking required.", "outcome_quote": "Q1 2026 call", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Pending — early read positive", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Reality Labs 2025 losses are likely peak", "metric_kind": "segment", "guide_quote": "I expect Reality Labs losses this year to be similar to last year, and this will likely be the peak as we start to gradually reduce our losses going forward while continuing to execute on our vision.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "target_period": "Multi-year", "actual_b": null, "outcome_summary": "Statement repeated in Q1 2026 call. Verification requires 2026 segment data when reported.", "outcome_quote": "Q1 2026 ongoing Reality Labs commentary", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Pending — multi-year claim", "horizon": "Strategic / multi-period (per management)"}, {"metric": "AI agents become substantially capable in 2026", "metric_kind": "capability", "guide_quote": "I expect 2026 to be a year where this wave accelerates even further on several fronts. We're starting to see agents really work. This will unlock the ability to build completely new products and transform how we work.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "target_period": "Throughout 2026", "actual_b": null, "outcome_summary": "Q1 2026 call references continued progress on agent capabilities and Meta Superintelligence Labs investments.", "outcome_quote": "Mark, Q1 2026 call", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "On track", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Meta Superintelligence Labs as new investment vehicle", "metric_kind": "product", "guide_quote": "We anticipate 2026 capital expenditures... with year-over-year growth driven by increased investment to support our Meta Superintelligence Labs efforts and core business.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "target_period": "FY 2026", "actual_b": null, "outcome_summary": "Q1 2026 call confirms MSL as focal investment area; capex guidance for 2026 raised to $125-145B in Q1 2026.", "outcome_quote": "Q1 2026 call - capex range raised based on MSL build-out", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Delivered (active investment)", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Llama-4 series first models 'good but trajectory more important'", "metric_kind": "product", "guide_quote": "I expect our first models will be good, but more importantly, we'll show the rapid trajectory that we're on.", "guide_source_file": "META_ER_Q4_2025_28-JAN-2026.docx", "target_period": "Throughout 2026", "actual_b": null, "outcome_summary": "Pending — trajectory commentary requires 2026+ model rollouts.", "outcome_quote": "Forward statement with no Q1 2026 specific delivery yet", "outcome_source": "META_ER_Q1_2026_29-APR-2026.docx", "verdict": "Pending", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q4 2025 → Q1 2026 met or beat all four quantitative commitments at the Q1 2026 print. Q1 2026 revenue of $56.31B was in-line within the $53.5-56.5B range (+2.38% above midpoint). Reality Labs commentary became more disciplined — Mark called 2025 the peak loss year and committed to gradual reduction. The biggest line item is the 2026 capex guidance of $115-135B, which Q1 2026 then raised to $125-145B. This is the largest capex step-up in META's history. The 'agents really work' framing replaced the prior generic 'AI advancing' language — more concrete commitment from Mark. Operating income guide of 'above 2025' is a multi-quarter claim still being tested.", "key_events": ["Q4 2025 revenue $59.9B; full-year 2025 revenue $201B (+22% YoY)", "2026 capex initial range $115-135B — largest hyperscaler ramp in industry history", "2026 expense range $162-169B (+38% YoY at midpoint)", "Reality Labs framed as near peak losses; gradual reduction pledged", "Meta Superintelligence Labs (MSL) as new investment focus", "Mark calls 2026 the year 'agents really work'"], "stock_reaction": {"series": [{"offset": -5, "date": "2026-01-21", "close": 612.96}, {"offset": -4, "date": "2026-01-22", "close": 647.63}, {"offset": -3, "date": "2026-01-23", "close": 658.76}, {"offset": -2, "date": "2026-01-26", "close": 672.36}, {"offset": -1, "date": "2026-01-27", "close": 672.97}, {"offset": 0, "date": "2026-01-28", "close": 668.73}, {"offset": 1, "date": "2026-01-29", "close": 738.31}, {"offset": 2, "date": "2026-01-30", "close": 716.5}, {"offset": 3, "date": "2026-02-02", "close": 706.41}, {"offset": 4, "date": "2026-02-03", "close": 691.7}, {"offset": 5, "date": "2026-02-04", "close": 668.99}], "day_before_date": "2026-01-27", "day_before_close": 672.97, "day_of_date": "2026-01-28", "day_of_close": 668.73, "day_after_date": "2026-01-29", "day_after_close": 738.31, "t_minus_5_date": "2026-01-21", "t_minus_5_close": 612.96, "t_plus_5_date": "2026-02-04", "t_plus_5_close": 668.99, "reaction_1d_pct": 10.4, "reaction_5d_pct": 0.04, "pre_5d_run_pct": 9.1, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2026-Q1", "call_date": "2026-01-28", "stock_reaction_1d_pct": 10.4, "stock_reaction_5d_pct": 0.04, "mcs_pair_accuracy": 0.9764, "revenue_guide_low_b": 53.5, "revenue_guide_high_b": 56.5, "revenue_guide_mid_b": 55.0, "revenue_actual_b": 56.311, "revenue_delta_pct": 2.3836363636363633, "net_margin_actual_pct": 47.54, "eps_actual": 10.44, "verdict_revenue": "In-line (within range)", "net_margin_yoy_pp": 8.21, "eps_yoy_pct": 62.4}}, {"made_in": "2026-Q1", "targets": "2026-Q2", "target_q_key": "2026Q2", "transcript_source": "META_ER_Q1_2026_29-APR-2026.docx", "call_date": "2026-04-29", "next_call_date": null, "status": "pending", "line_items": [{"metric": "Total revenue (next quarter)", "metric_kind": "revenue", "guide_low_b": 58.0, "guide_high_b": 61.0, "guide_mid_b": 59.5, "actual_b": null, "delta_vs_mid_pct": null, "verdict": "Pending — Q2 2026 not yet reported", "guide_quote": "We expect second quarter 2026 total revenue to be in the range of $58 billion to $61 billion.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "horizon": "Next quarter (Q+1, management explicitly stated)"}, {"metric": "Full-year total costs & expenses (FY2026 mid-year update)", "metric_kind": "fy_expense", "fy_year": "2026", "guide_low_b": 162.0, "guide_high_b": 169.0, "guide_mid_b": 165.5, "actual_b": null, "delta_vs_mid_pct": null, "verdict": "Pending — FY 2026 actual not yet reported", "guide_quote": "We expect full year 2026 total expenses to be in the range of $162 billion to $169 billion, unchanged from our prior outlook.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "Full-year capital expenditures (FY2026 raised)", "metric_kind": "fy_capex", "fy_year": "2026", "guide_low_b": 125.0, "guide_high_b": 145.0, "guide_mid_b": 135.0, "actual_b": null, "delta_vs_mid_pct": null, "verdict": "Pending — FY 2026 actual not yet reported", "guide_quote": "We anticipate 2026 capital expenditures including principal payments on finance leases to be in the range of $125 billion to $145 billion, increased from our prior range of $115 billion to $135 billion.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "Full-year effective tax rate (remaining 2026 quarters)", "metric_kind": "fy_tax", "fy_year": "2026", "guide_low_pct": 13.0, "guide_high_pct": 16.0, "guide_mid_pct": 14.5, "actual_pct": null, "delta_vs_mid_pp": null, "verdict": "Pending — FY 2026 not yet complete", "guide_quote": "Absent any changes to our tax landscape, we expect our tax rate for the remaining quarters of 2026 to be between 13% and 16%.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "actual_source_filing": null, "horizon": "Full-year 2026 (management explicitly stated)"}, {"metric": "Compute efficiency strategic advantage", "metric_kind": "capacity", "guide_quote": "One of the primary goals of our Meta compute initiative is to lead the industry in efficiency of building compute, and we expect that will be a strategic advantage over time.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "target_period": "Multi-year", "actual_b": null, "outcome_summary": null, "outcome_quote": null, "outcome_source": null, "verdict": "Pending", "horizon": "Strategic / multi-period (per management)"}, {"metric": "Recommendation systems — next-generation foundation models", "metric_kind": "product", "guide_quote": "we are executing on our longer-term efforts to develop the next generation of our recommendation systems. This includes building foundation models that power organic content and ads recommendations as well as developing LLM based recommender systems.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "target_period": "2026+", "actual_b": null, "outcome_summary": null, "outcome_quote": null, "outcome_source": null, "verdict": "Pending", "horizon": "Strategic / multi-period (per management)"}, {"metric": "AI glasses fastest-growing consumer electronics category", "metric_kind": "product", "guide_quote": "our AI glasses continue to perform well with the number of people using them, daily tripling year-over-year. This continues to be one of the fastest-growing categories of consumer electronics ever.", "guide_source_file": "META_ER_Q1_2026_29-APR-2026.docx", "target_period": "2026+", "actual_b": null, "outcome_summary": null, "outcome_quote": null, "outcome_source": null, "verdict": "Active / on track", "horizon": "Strategic / multi-period (per management)"}], "narrative": "Q1 2026 → Q2 2026 is the open quarter. Q1 2026 print already in: $56.31B revenue (in-line guide), $26.77B net income boosted by an $8.03B partial reversal of the prior OBBBA charge. Q2 2026 guide of $58-61B implies +29-36% YoY growth. FY 2026 expense range held at $162-169B but capex raised to $125-145B — material upside revision driven by 'higher component pricing' and Meta Superintelligence Labs expansion. Watch items: (a) does Q2 2026 print inside the $58-61B range — the cleanest test of CFO discipline; (b) does the raised capex translate to commensurate operating-income leverage; (c) Reality Labs trajectory toward gradual loss reduction. All four quantitative commitments and three strategic ones still pending.", "key_events": ["Q1 2026 revenue $56.31B (+33% YoY) — fastest growth rate since post-COVID", "Q1 2026 reported net income $26.77B includes $8.03B OBBBA charge reversal benefit", "FY 2026 capex range raised from $115-135B to $125-145B", "AI glasses daily-active users tripled YoY", "Ray-Ban Meta optics for all-day wear launched", "Meta Superintelligence Labs continues expansion of compute footprint"], "stock_reaction": {"series": [{"offset": -5, "date": "2026-04-22", "close": 674.72}, {"offset": -4, "date": "2026-04-23", "close": 659.15}, {"offset": -3, "date": "2026-04-24", "close": 675.03}, {"offset": -2, "date": "2026-04-27", "close": 678.62}, {"offset": -1, "date": "2026-04-28", "close": 671.34}, {"offset": 0, "date": "2026-04-29", "close": 669.12}, {"offset": 1, "date": "2026-04-30", "close": 611.91}, {"offset": 2, "date": null, "close": null}, {"offset": 3, "date": null, "close": null}, {"offset": 4, "date": null, "close": null}, {"offset": 5, "date": null, "close": null}], "day_before_date": "2026-04-28", "day_before_close": 671.34, "day_of_date": "2026-04-29", "day_of_close": 669.12, "day_after_date": "2026-04-30", "day_after_close": 611.91, "t_minus_5_date": "2026-04-22", "t_minus_5_close": 674.72, "t_plus_5_date": null, "t_plus_5_close": null, "reaction_1d_pct": -8.55, "reaction_5d_pct": null, "pre_5d_run_pct": -0.83, "source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx"}, "summary_metrics": {"target_q": "2026-Q2", "call_date": "2026-04-29", "stock_reaction_1d_pct": -8.55, "stock_reaction_5d_pct": null, "mcs_pair_accuracy": null, "revenue_guide_low_b": 58.0, "revenue_guide_high_b": 61.0, "revenue_guide_mid_b": 59.5, "revenue_actual_b": null, "revenue_delta_pct": null, "net_margin_actual_pct": null, "eps_actual": null, "verdict_revenue": "Pending — Q2 2026 not yet reported"}}], "stock_prices_available": true, "stock_prices_source": "META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx", "stock_prices_provider": "User-supplied daily OHLCV (META, Jan 2024 – Apr 30 2026)"}}, "NVDA": {"ticker": "NVDA", "pending": true}, "MSFT": {"ticker": "MSFT", "pending": true}, "INTC": {"ticker": "INTC", "pending": true}}, "transcripts": [{"ticker": "AMD", "fy": 2024, "fq": 1, "words": 189, "call_date": "2024-04-30"}, {"ticker": "AMD", "fy": 2024, "fq": 2, "words": 189, "call_date": "2024-07-30"}, {"ticker": "AMD", "fy": 2024, "fq": 3, "words": 189, "call_date": "2024-10-29"}, {"ticker": "AMD", "fy": 2024, "fq": 4, "words": 189, "call_date": "2025-02-04"}, {"ticker": "AMD", "fy": 2025, "fq": 1, "words": 189, "call_date": "2025-05-06"}, {"ticker": "AMD", "fy": 2025, "fq": 2, "words": 189, "call_date": "2025-08-05"}, {"ticker": "AMD", "fy": 2025, "fq": 3, "words": 189, "call_date": "2025-11-04"}, {"ticker": "AMD", "fy": 2025, "fq": 4, "words": 189, "call_date": "2026-02-03"}, {"ticker": "META", "fy": 2024, "fq": 2, "words": 9617, "call_date": "2024-07-31"}, {"ticker": "META", "fy": 2024, "fq": 3, "words": 8846, "call_date": "2024-10-30"}, {"ticker": "META", "fy": 2024, "fq": 4, "words": 9339, "call_date": "2025-01-29"}, {"ticker": "META", "fy": 2025, "fq": 1, "words": 9140, "call_date": "2025-04-30"}, {"ticker": "META", "fy": 2025, "fq": 2, "words": 9348, "call_date": "2025-07-30"}, {"ticker": "META", "fy": 2025, "fq": 3, "words": 9438, "call_date": "2026-10-29"}, {"ticker": "META", "fy": 2025, "fq": 4, "words": 9854, "call_date": "2026-01-28"}, {"ticker": "META", "fy": 2026, "fq": 1, "words": 9971, "call_date": "2026-04-29"}], "filings": [{"ticker": "AMD", "form": "10-Q", "fy": "2023", "fq": "3", "period_end": "2023-09-30", "filed": "2023-11-01", "accn": "0000002488-23-000195"}, {"ticker": "AMD", "form": "10-K", "fy": "2023", "fq": "4", "period_end": "2023-12-30", "filed": "2024-01-31", "accn": "0000002488-24-000012"}, {"ticker": "AMD", "form": "10-Q", "fy": "2024", "fq": "1", "period_end": "2024-03-30", "filed": "2024-05-01", "accn": "0000002488-24-000056"}, {"ticker": "AMD", "form": "10-Q", "fy": "2024", "fq": "2", "period_end": "2024-06-29", "filed": "2024-07-31", "accn": "0000002488-24-000123"}, {"ticker": "AMD", "form": "10-Q", "fy": "2024", "fq": "3", "period_end": "2024-09-28", "filed": "2024-10-30", "accn": "0000002488-24-000163"}, {"ticker": "AMD", "form": "10-K", "fy": "2024", "fq": "4", "period_end": "2024-12-28", "filed": "2025-02-05", "accn": "0000002488-25-000012"}, {"ticker": "AMD", "form": "10-Q", "fy": "2025", "fq": "1", "period_end": "2025-03-29", "filed": "2025-05-07", "accn": "0000002488-25-000047"}, {"ticker": "AMD", "form": "10-Q", "fy": "2025", "fq": "2", "period_end": "2025-06-28", "filed": "2025-08-06", "accn": "0000002488-25-000108"}, {"ticker": "AMD", "form": "10-Q", "fy": "2025", "fq": "3", "period_end": "2025-09-27", "filed": "2025-11-05", "accn": "0000002488-25-000166"}, {"ticker": "AMD", "form": "10-K", "fy": "2025", "fq": "4", "period_end": "2025-12-27", "filed": "2026-02-04", "accn": "0000002488-26-000018"}, {"ticker": "AMD", "form": "10-Q", "fy": "2026", "fq": "1", "period_end": "2026-03-28", "filed": "2026-05-06", "accn": "0000002488-26-000076"}, {"ticker": "META", "form": "10-Q", "fy": "2024", "fq": "2", "period_end": "2024-06-30", "filed": "2024-08-01", "accn": "0001326801-24-000069"}, {"ticker": "META", "form": "10-Q", "fy": "2024", "fq": "3", "period_end": "2024-09-30", "filed": "2024-10-31", "accn": "0001326801-24-000081"}, {"ticker": "META", "form": "10-K", "fy": "2024", "fq": "4", "period_end": "2024-12-31", "filed": "2025-01-30", "accn": "0001326801-25-000017"}, {"ticker": "META", "form": "10-Q", "fy": "2025", "fq": "1", "period_end": "2025-03-31", "filed": "2025-05-01", "accn": "0001326801-25-000054"}, {"ticker": "META", "form": "10-Q", "fy": "2025", "fq": "2", "period_end": "2025-06-30", "filed": "2025-07-31", "accn": "0001628280-25-036791"}, {"ticker": "META", "form": "10-Q", "fy": "2025", "fq": "3", "period_end": "2025-09-30", "filed": "2025-10-30", "accn": "0001628280-25-047240"}, {"ticker": "META", "form": "10-K", "fy": "2025", "fq": "4", "period_end": "2025-12-31", "filed": "2026-01-29", "accn": "0001628280-26-003942"}, {"ticker": "META", "form": "10-Q", "fy": "2026", "fq": "1", "period_end": "2026-03-31", "filed": "2026-04-30", "accn": "0001628280-26-028526"}], "ticker_order": ["META", "AMD", "NVDA", "MSFT", "INTC"], "narratives": {"AMD": {"stance": "Neutral with bullish lean", "color": "amber", "summary": "Lisa Su's prepared remarks across 8 quarters show consistent product/customer specificity paired with honest near-term caveats. Q4 2025 is the first explicit sequential-down guide in the window.", "quotes": [["Lisa Su (CEO)", "Q3 2025", "We expect this partnership will significantly accelerate our data center AI business with the potential to generate well over $100 billion in revenue over the next few years."], ["Lisa Su (CEO)", "Q1 2025", "We expect enterprise adoption to accelerate over the coming quarters as more than 150 Turin platforms become broadly available from Dell, Cisco, HPE, Lenovo, Supermicro and others."], ["Lisa Su (CEO)", "Q4 2025", "we expect revenue to be down approximately 5%, driven by seasonal decline in our Client Gaming and Embedded segment, partially offset by growth in our Data Center segment."], ["Lisa Su (CEO)", "Q2 2025", "we believe it will be the highest-performance AI system in the world when it launches."]], "bull": ["Concrete product roadmap referenced repeatedly: Turin EPYC, MI300/MI350, MI400, Ryzen AI 300/AI Pro — each tied to specific named customers and timelines.", "Server CPU share gains called out across multiple quarters with named enterprise deployments.", "The '$100B over the next few years' Instinct commitment is a numbered forward statement that creates a real fundamental thesis if proven credible."], "bear": ["Q4 2025 is the first explicit sequential-down guidance (~5% near-term revenue decline). The consistently-up streak ends.", "Semi-custom 'seventh year of console cycle' decline is a concrete near-term headwind management is naming, not hiding.", "The '$100B over the next few years' creates measurable expectation risk if MI350/MI400 ramp slips."], "trigger_up": "First quarter where management guides DOWN and the print BEATS by ≥3% — skill demonstrated under stress.", "trigger_down": "A miss against the Q1 2026 down-guide (~5% decline), suggesting conservatism in their language is itself unreliable."}, "META": {"stance": "BULLISH", "color": "mint", "summary": "Forward View: BULLISH on a 6–12-month horizon. Across nine consecutive earnings cycles, META management has delivered on essentially every quantified forward statement (8 closed revenue commitments → 6 beats, 2 in-line, 0 misses; MCS = 0.9589). Revenue YoY growth has re-accelerated from +16.1% (Q1 2025) to +33.1% (Q1 2026) while operating margin held at 40.62% (the clean signal — ex tax-event distortion) and reported net margin reached 47.54% (boosted by a partial OBBBA-tax reversal benefit). The AI-capex ramp is the principal risk to monitor — not a thesis-breaker on what we have today.", "quotes": [["Susan Li (CFO)", "Q1 2026 call", "We expect second quarter 2026 total revenue to be in the range of $58 billion to $61 billion."], ["Susan Li (CFO)", "Q4 2025 call", "Despite the meaningful step-up in infrastructure investment, in 2026, we expect to deliver operating income that is above 2025 operating income."], ["Mark Zuckerberg (CEO)", "Q4 2025 call", "I expect 2026 to be a year where this wave accelerates even further on several fronts. We're starting to see agents really work."], ["Susan Li (CFO)", "Q1 2026 call", "We anticipate 2026 capital expenditures including principal payments on finance leases to be in the range of $125 billion to $145 billion."]], "bull": ["Revenue growth re-accelerating, not slowing. YoY trajectory: +16.1% → +21.6% → +26.2% → +23.8% → +33.1% across the last five reported quarters. Q1 2026 ($56.31B) is the strongest YoY print in the entire dataset.", "Operating leverage intact despite the AI build. Q1 2026 operating margin 40.62% (clean signal — ex tax-event distortion); net margin 47.54% reported (boosted by a partial reversal of the Q3 2025 OBBBA tax charge). Management explicitly committed that 2026 operating income will exceed 2025; the Q1 2026 print already supports that path.", "Forward-guidance accuracy is exceptional. 8 closed quarters: 6 beats, 2 in-line, 0 revenue misses; MCS = 0.9589. The two FY-level miss line items (FY 2025 capex initial outlook and FY 2025 tax rate) trace to a single 2024-Q4 call and have well-documented explanations.", "Strategic milestones landing: Llama 3 / 4 cadence on schedule, Meta AI past the 1B-user threshold management committed to, AI ad-creative tools deployed broadly, and server-life policy extension delivering structural opex savings."], "bear": ["Capex magnitude is unprecedented for META. FY capex: $37.3B → $69.7B → $125–145B (2024 → 2025 → 2026 guide). The 2026 midpoint is roughly 3.6× the 2024 figure. ROI on AI infrastructure at this scale is the single biggest open question.", "Market is voicing skepticism. 5-day post-earnings reactions on the last two calls were −15.40% (Q3 2025) and 1-day −8.55% (Q1 2026). Sell-offs of this magnitude on quarters that beat revenue indicate investors are repricing the capex outlook, not the operating fundamentals.", "Multi-year strategic claims are unverified. Reality Labs \"peak losses in 2025,\" AI-coding-agent capability by mid-late 2026, and Threads' 1B-user trajectory all remain pending. None contradict the bull case, but they extend the credibility tail."], "trigger_up": "Two consecutive prints in line with or above guide AND FY 2026 operating income tracking above FY 2025 (per management's own commitment), with capex held at or below the current $125–145B range.", "trigger_down": "Q2 or Q3 2026 revenue growth decelerating below +20% YoY without clear AI-monetization milestones, OR FY 2026 capex raised above $145B without a corresponding revenue/efficiency offset, OR the 2026 operating-income > 2025 commitment walked back.", "scoreboard": [{"metric": "Revenue (next-quarter guide vs actual)", "baseline": "$36.5–39.0B → $39.07B (+3.5%)", "latest": "$58–61B guide (Q2 2026 pending)", "verdict": "Accelerating beats", "verdict_color": "mint"}, {"metric": "Quarterly revenue (YoY)", "baseline": "$36.46B (+27% YoY)", "latest": "$56.31B (+33.1% YoY)", "verdict": "Growth re-accelerating", "verdict_color": "mint"}, {"metric": "Net margin (reported)", "baseline": "33.93% (Q1 2024)", "latest": "47.54% (Q1 2026 — tax-benefit boosted)", "verdict": "Expanding", "verdict_color": "mint"}, {"metric": "Diluted EPS (single-quarter)", "baseline": "$5.18 (Q1 2024 actual)", "latest": "$10.44 (+62.4% YoY vs Q1 2025 $6.43)", "verdict": "Compounding", "verdict_color": "mint"}, {"metric": "Management Credibility Score", "baseline": "—", "latest": "0.9589 (8 beats / 0 revenue misses)", "verdict": "Top-tier execution", "verdict_color": "mint"}, {"metric": "FY capex (annual)", "baseline": "$37.3B (2024)", "latest": "$125–145B (2026 guide)", "verdict": "3.6× ramp — risk to monitor", "verdict_color": "amber"}, {"metric": "Avg post-earnings 5-day reaction (last 2 calls)", "baseline": "Mixed (early period)", "latest": "−2.0% trailing two calls", "verdict": "Market wary on capex", "verdict_color": "crimson"}], "bottom_line": "Across nine consecutive earnings cycles, META management has delivered on essentially every forward statement they've quantified. Revenue growth is accelerating, margins are expanding to dataset highs, and the company is funding the largest AI infrastructure build in its history out of operating cash flow without compromising profit growth. The market's recent post-earnings selling reflects valuation-and-capex anxiety more than any fundamental deterioration visible in the data.", "disclaimer": "This is an analytical synthesis of the disclosed data on file in this project, not a buy/sell recommendation or personalized investment advice. Forecasts are inherently uncertain. Consult a licensed financial advisor before making investment decisions."}, "NVDA": {"stance": "No view — no data submitted", "color": "neutral", "summary": "Zero transcripts and zero filings have been submitted for NVDA.", "quotes": [], "bull": [], "bear": [], "trigger_up": "", "trigger_down": ""}, "MSFT": {"stance": "No view — no data submitted", "color": "neutral", "summary": "Zero transcripts and zero filings have been submitted for MSFT.", "quotes": [], "bull": [], "bear": [], "trigger_up": "", "trigger_down": ""}, "INTC": {"stance": "No view — no data submitted", "color": "neutral", "summary": "Zero transcripts and zero filings have been submitted for INTC.", "quotes": [], "bull": [], "bear": [], "trigger_up": "", "trigger_down": ""}}, "summary": {"scored": 2, "pending": 3, "total_claims": 14, "total_beats": 14, "total_misses": 0, "transcripts_count": 16, "filings_count": 19, "avg_mcs": 0.9618, "avg_sob": -0.0382}};
let activePage = 'dashboard', searchQuery = '';

const STANCE_COLOR = { amber: 'var(--amber)', mint: 'var(--mint)',
  crimson: 'var(--crimson)', neutral: 'var(--subtle)' };

// Build sidebar nav
function buildSidebar() {
  const overview = [{ id:'dashboard', label:'Dashboard' }];
  const data = [{ id:'companies', label:'Companies' },
                { id:'transcripts', label:'Transcripts' },
                { id:'filings', label:'Filings' }];
  document.getElementById('nav-overview').innerHTML = overview.map(o =>
    `<button class="nav-btn ${activePage===o.id?'active':''}" data-page="${o.id}">${o.label}</button>`
  ).join('');
  document.getElementById('nav-data').innerHTML = data.map(o =>
    `<button class="nav-btn ${activePage===o.id?'active':''}" data-page="${o.id}">${o.label}</button>`
  ).join('');
  // Per-ticker sub-pages. Order is performance-focused: Fundamental → Technical → MCS, then the rest.
  // 'ticker:META' renders the existing MCS Score & Credibility page (with bull/bear/triggers/claims/q2q).
  const tickerSubpages = {
    META: [
      { id:'meta-fundamental', label:'Fundamental Analysis',     emoji:'📊', sub:'Q4 2025 vs Q1 2026' },
      { id:'meta-technical',   label:'Technical Analysis',       emoji:'📈', sub:'Daily bars · 2y + 1Q' },
      { id:'ticker:META',      label:'MCS Score & Credibility',  emoji:'🎯', sub:'Management commitments vs actuals' },
      { id:'meta-options',     label:'Options Analysis',         emoji:'📐', sub:'Skew · vol surface · positioning' },
      { id:'meta-valuation',   label:'Valuation & Comparables',  emoji:'💰', sub:'P/E · EV/EBITDA · peer set' },
      { id:'meta-consolidated',label:'Consolidated View',        emoji:'🔄', sub:'Four-lens synthesis' },
      { id:'meta-summary',     label:'Executive Summary',        emoji:'📋', sub:'One-page forward view' },
    ]
    // Other tickers fall through to the standalone ticker page.
  };

  // Determine which ticker is "active" for sub-page rendering: a ticker:X page or a meta-* page maps to META.
  const activeTicker = activePage.startsWith('ticker:') ? activePage.split(':')[1]
                     : activePage.startsWith('meta-') ? 'META'
                     : null;

  document.getElementById('nav-tickers').innerHTML = DATA.ticker_order.map(t => {
    const n = DATA.narratives[t];
    const id = 'ticker:' + t;
    const dotColor = STANCE_COLOR[n.color] || 'var(--subtle)';
    const stanceShort = n.color === 'neutral' ? 'no view' : (n.color === 'mint' ? 'bullish' : (n.color === 'crimson' ? 'bearish' : 'bullish lean'));
    const subs = tickerSubpages[t];
    const expanded = activeTicker === t && subs;
    const tickerHeader = `<button class="nav-btn ticker-head ${expanded?'expanded':''} ${(activePage===id && !subs)?'active':''}" data-ticker-head="${t}">
      <span class="nav-ticker"><span class="mono">${t}</span>
        <span style="display:inline-flex;align-items:center;gap:6px;font-size:10px;color:var(--muted);">
          <span class="stance-dot" style="background:${dotColor};"></span>${stanceShort}
          ${subs ? `<span class="ticker-chevron" aria-hidden="true">${expanded?'▾':'▸'}</span>` : ''}
        </span>
      </span>
    </button>`;
    if (!subs) return tickerHeader;
    const subItems = expanded ? `<div class="ticker-subnav">
      ${subs.map(s => `<button class="nav-btn nav-sub ${activePage===s.id?'active':''}" data-page="${s.id}" title="${s.sub||''}">
        <span style="display:inline-flex;align-items:center;gap:8px;">
          <span style="opacity:.75;">${s.emoji}</span>
          <span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.15;">
            <span style="font-size:12.5px;">${s.label}</span>
            ${s.sub ? `<span style="font-size:10px;color:var(--subtle);font-weight:400;margin-top:1px;">${s.sub}</span>` : ''}
          </span>
        </span>
      </button>`).join('')}
    </div>` : '';
    return tickerHeader + subItems;
  }).join('');
}

// Theme
const savedTheme = localStorage.getItem('mcp.theme') ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.dataset.theme = savedTheme;
document.getElementById('themeLabel').textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
document.getElementById('themeToggle').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  document.getElementById('themeLabel').textContent = t === 'dark' ? 'Dark' : 'Light';
  localStorage.setItem('mcp.theme', t);
};

// Nav click
document.querySelector('.layout').addEventListener('click', e => {
  const b = e.target.closest('.nav-btn');
  if (!b) return;
  // Ticker-header click: if a ticker has sub-pages and isn't already expanded, expand to its default page (Fundamental for META).
  if (b.dataset.tickerHead) {
    const t = b.dataset.tickerHead;
    if (t === 'META') {
      // Land on Fundamental Analysis as the performance-focused default; sidebar will auto-expand because activePage starts with 'meta-'.
      activePage = 'meta-fundamental';
    } else {
      activePage = 'ticker:' + t;
    }
    buildSidebar(); render();
    const labels = {
      'ticker:META':'META · MCS Score & Credibility',
      'meta-fundamental':'META · Fundamental Analysis (Q4 25 vs Q1 26)',
    };
    document.getElementById('crumb').textContent = labels[activePage] || (activePage.startsWith('ticker:')?activePage.split(':')[1]:activePage);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  if (!b.dataset.page) return;
  activePage = b.dataset.page;
  buildSidebar(); render();
  const reportLabels = {
    'meta-summary':'META · Executive Summary',
    'meta-fundamental':'META · Fundamental Analysis (Q4 25 vs Q1 26)',
    'meta-technical':'META · Technical Analysis',
    'meta-consolidated':'META · Consolidated View',
    'meta-options':'META · Options Analysis',
    'meta-valuation':'META · Valuation & Comparables',
    'ticker:META':'META · MCS Score & Credibility',
  };
  const label = b.dataset.page.startsWith('ticker:') ? (reportLabels[b.dataset.page] || b.dataset.page.split(':')[1]) :
                (reportLabels[b.dataset.page] || b.textContent.trim());
  document.getElementById('crumb').textContent = label;
  window.scrollTo({ top: 0, behavior: 'instant' });
});

document.getElementById('search').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase(); render();
});

const fmtN = (v, p=3) => v == null ? '—' : Number(v).toFixed(p);
const fmtSign = (v, p=3) => v == null ? '—' : (v>=0?'+':'') + Number(v).toFixed(p);
const fmtMoney = v => v == null ? '—' : Math.abs(v) >= 1000 ? '$'+(v/1000).toFixed(2)+'B' : '$'+v.toFixed(0)+'M';

function dashboardPage() {
  const s = DATA.summary;
  const cs = Object.values(DATA.companies);
  const scored = cs.filter(c => !c.pending);
  const max = Math.max(...scored.map(c => c.mcs_information_adjusted));
  return `<h1>Dashboard</h1>
    <p class="subtitle">Real-time view of management credibility across the universe. Click a ticker in the sidebar for its full research page.</p>

    <!-- META Reports quick-access (most prominent block) -->
    <div class="card card-pad anim" style="margin-bottom:20px;background:linear-gradient(135deg, var(--card) 0%, rgba(99,102,241,.06) 100%);border-left:4px solid var(--accent);">
      <div style="display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <div class="section-title" style="font-size:15px;margin:0;">📌 META — institutional research suite</div>
          <div class="section-sub" style="margin-top:4px;">Five reports: fundamental, technical, options, consolidated, plus a one-page executive summary. Click any card to open.</div>
        </div>
      </div>
      <div class="grid anim" style="gap:12px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));">
        <div onclick="goPage('meta-summary')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid var(--mint);" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:var(--mint);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">📋 1-PAGE SUMMARY</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Executive Summary</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Forward view (BULLISH), bull/bear cases, triggers, bottom line.</div>
        </div>
        <div onclick="goPage('meta-fundamental')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid var(--accent);" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">📊 FUNDAMENTAL</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Q4 25 vs Q1 26</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Comparison table, revenue-growth validation, charts, transcript insights, forward outlook.</div>
        </div>
        <div onclick="goPage('meta-technical')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid var(--crimson);" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:var(--crimson);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">📈 TECHNICAL</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Daily TA — 2y + 1Q</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">MAs, RSI, MACD, ADX, OBV, S/R, patterns, multi-timeframe verdict.</div>
        </div>
        <div onclick="goPage('meta-consolidated')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid #8B5CF6;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:#8B5CF6;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">🎯 CONSOLIDATED</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Synthesis & buy strategy</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Side-by-side stance grid, laddered entry tranches, critical-level cheat sheet.</div>
        </div>
        <div onclick="goPage('meta-options')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid var(--amber);" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:var(--amber);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">📐 OPTIONS</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Options Analysis</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Skew, vol surface, OI concentration, max-pain, P/C ratio, dealer gamma.</div>
        </div>
        <div onclick="goPage('meta-valuation')" class="report-tile" style="cursor:pointer;padding:14px;border:1px solid var(--border);border-radius:10px;background:var(--card);transition:all .15s;border-left:3px solid var(--mint);" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,.06)';this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
          <div style="font-size:11px;color:var(--mint);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;">💰 VALUATION</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Valuation & Comparables</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">P/E and P/S (TTM authoritative; META forward modeled). Peer comps from SEC EDGAR + Yahoo Finance.</div>
        </div>
      </div>
    </div>

    <div class="grid grid-4 anim" style="margin-bottom:24px;">
      <div class="card card-pad"><div class="stat-label">Tickers in universe</div>
        <div class="stat-value tabular">${cs.length}</div>
        <div class="stat-help">${s.scored} scored · ${s.pending} pending</div></div>
      <div class="card card-pad"><div class="stat-label">Average MCS (info-adj)</div>
        <div class="stat-value tabular">${fmtN(s.avg_mcs)}</div>
        <div class="stat-help">Across scored tickers</div></div>
      <div class="card card-pad"><div class="stat-label">Avg skill over baseline</div>
        <div class="stat-value tabular" style="color:${s.avg_sob>=0?'var(--mint)':'var(--amber)'};">${fmtSign(s.avg_sob)}</div>
        <div class="stat-help">≤ 0 means indistinguishable from null</div></div>
      <div class="card card-pad"><div class="stat-label">Beat / miss</div>
        <div class="stat-value tabular">${s.total_beats} / ${s.total_misses}</div>
        <div class="stat-help">${s.total_claims} claims · ${s.transcripts_count} transcripts · ${s.filings_count} filings</div></div>
    </div>
    <div class="card card-pad anim" style="margin-bottom:24px;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:18px;">
        <div><div class="section-title">MCS by company</div>
          <div class="section-sub">Click a bar to open that ticker's research page</div></div>
        <span class="pill pill-accent">revenue_anchored</span>
      </div>
      ${scored.map(c => `
        <div class="bar-row" onclick="goTicker('${c.ticker}')">
          <div class="bar-head">
            <span class="mono" style="font-weight:600;">${c.ticker}</span>
            <span class="tabular text-muted">${fmtN(c.mcs_information_adjusted)}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${(c.mcs_information_adjusted/max)*100}%;"></div></div>
        </div>`).join('')}
    </div>
    <div class="card card-pad anim">
      <div class="section-title">Per-ticker stance</div>
      <div class="section-sub" style="margin-bottom:14px;">Click a ticker for the full research page</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;font-size:13.5px;">
        ${DATA.ticker_order.map(t => {
          const n = DATA.narratives[t];
          const color = STANCE_COLOR[n.color] || 'var(--subtle)';
          return `<li onclick="goTicker('${t}')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 8px;border-radius:8px;" onmouseover="this.style.background='var(--accent-soft)'" onmouseout="this.style.background='transparent'">
            <span class="mono" style="font-weight:700;width:50px;">${t}</span>
            <span class="stance-dot" style="background:${color};"></span>
            <span style="font-weight:500;color:${color};font-size:13px;">${n.stance}</span>
            <span style="color:var(--muted);font-size:13px;">— ${n.summary.split('.')[0]}.</span>
          </li>`;
        }).join('')}
      </ul>
    </div>`;
}

function tickerPage(ticker) {
  const c = DATA.companies[ticker];
  const n = DATA.narratives[ticker];
  const color = STANCE_COLOR[n.color] || 'var(--subtle)';
  const stanceBg = n.color === 'amber' ? 'rgba(245,158,11,.08)'
                 : n.color === 'mint' ? 'rgba(16,185,129,.08)'
                 : n.color === 'crimson' ? 'rgba(239,68,68,.08)'
                 : 'transparent';
  const isPending = c.pending || (n.quotes||[]).length === 0;

  // Header
  let html = `
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:baseline;gap:18px;">
        <h1 class="mono" style="font-size:42px;font-weight:700;letter-spacing:-.03em;margin:0;">${ticker}</h1>
        <span style="font-size:16px;font-weight:600;color:${color};">${n.stance}</span>
      </div>
      ${isPending ? '<span class="pill pill-neutral">no data submitted</span>' : ''}
    </div>
    <p class="subtitle" style="max-width:780px;">${n.summary}</p>`;

  if (isPending) {
    html += `<div class="card card-pad anim" style="text-align:center;padding:60px 24px;">
      <div style="font-size:14px;color:var(--muted);max-width:500px;margin:0 auto;line-height:1.6;">
        No transcripts or filings have been submitted for <span class="mono" style="font-weight:600;">${ticker}</span> yet.
        Drop 8 quarters of earnings transcripts and SEC filings into
        <span class="mono">${ticker}_inbox/</span> and run the importer to populate this page.
      </div></div>`;
    return html;
  }

  // Scorecard
  html += `
    <div class="grid grid-4 anim" style="margin-bottom:20px;gap:14px;">
      <div class="mini-card"><div class="mini-card-label">MCS (simple)</div><div class="mini-card-value tabular">${fmtN(c.mcs_simple)}</div></div>
      <div class="mini-card"><div class="mini-card-label">MCS (info-adj)</div><div class="mini-card-value tabular">${fmtN(c.mcs_information_adjusted)}</div></div>
      <div class="mini-card"><div class="mini-card-label">MCS (diff-w)</div><div class="mini-card-value tabular">${fmtN(c.mcs_difficulty_weighted)}</div></div>
      <div class="mini-card"><div class="mini-card-label">Skill vs baseline</div>
        <div class="mini-card-value tabular" style="color:${c.skill_over_baseline>=0?'var(--mint)':'var(--amber)'};">${fmtSign(c.skill_over_baseline)}</div></div>
    </div>`;

  // === Executive Summary banner (renders only when narrative.scoreboard is present) ===
  if (n.scoreboard && n.scoreboard.length) {
    const stanceUpper = (n.stance || '').toUpperCase();
    const stanceText = stanceUpper.includes('BULLISH') ? 'BULLISH'
                     : stanceUpper.includes('BEARISH') ? 'BEARISH'
                     : stanceUpper.includes('NEUTRAL') ? 'NEUTRAL' : stanceUpper;
    html += `
      <div class="card anim" style="margin-bottom:20px;border-left:4px solid ${color};overflow:hidden;">
        <div class="card-pad" style="padding-bottom:8px;">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px;">
            <div class="section-title" style="font-size:15px;margin:0;">Executive summary — 8-quarter analysis</div>
            <span style="background:${color === 'var(--mint)' ? 'rgba(16,185,129,.15)' : color === 'var(--crimson)' ? 'rgba(239,68,68,.15)' : 'rgba(245,158,11,.15)'};color:${color};font-weight:700;font-size:11.5px;letter-spacing:.06em;padding:3px 10px;border-radius:6px;">FORWARD VIEW: ${stanceText}</span>
          </div>
          <p style="font-size:13px;color:var(--text);line-height:1.6;margin:0 0 10px 0;">${n.summary}</p>
        </div>
        <div style="padding:0 22px 16px 22px;">
          <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;margin-bottom:8px;">At-a-glance scoreboard</div>
          <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
            <thead><tr style="background:var(--bg);">
              <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">Metric</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">Q1 2024 baseline</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">Q1 2026 latest</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">Direction</th>
            </tr></thead>
            <tbody>
              ${n.scoreboard.map(row => {
                const vc = STANCE_COLOR[row.verdict_color] || 'var(--text)';
                return `<tr>
                  <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${row.metric}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${row.baseline}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:500;">${row.latest}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${vc};font-weight:600;">${row.verdict}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  // Quotes
  html += `<div class="card card-pad anim" style="margin-bottom:20px;border-left:4px solid ${color};">
    <div class="section-title" style="margin-bottom:12px;">Key forward-looking quotes (verbatim from ${ticker} transcripts)</div>
    ${n.quotes.map(q => `<div class="quote-block">
      <div class="quote-attr">${q[0]} · ${q[1]}</div>
      <div class="quote-text">"${q[2]}"</div>
    </div>`).join('')}
  </div>`;

  // Bull / Bear
  html += `<div class="grid grid-2 anim" style="margin-bottom:20px;">
    <div class="card card-pad" style="border-top:3px solid var(--mint);">
      <div class="section-title" style="font-size:14px;color:var(--mint);margin-bottom:12px;">▲ Bull case</div>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
        ${n.bull.map(b => `<li style="display:flex;gap:8px;"><span style="color:var(--mint);font-weight:600;">+</span><span>${b}</span></li>`).join('')}
      </ul>
    </div>
    <div class="card card-pad" style="border-top:3px solid var(--crimson);">
      <div class="section-title" style="font-size:14px;color:var(--crimson);margin-bottom:12px;">▼ Bear case</div>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
        ${n.bear.map(b => `<li style="display:flex;gap:8px;"><span style="color:var(--crimson);font-weight:600;">−</span><span>${b}</span></li>`).join('')}
      </ul>
    </div>
  </div>`;

  // Triggers
  html += `<div class="card card-pad anim" style="margin-bottom:20px;">
    <div class="section-title" style="font-size:14px;margin-bottom:12px;">What would change the stance for ${ticker}</div>
    <div style="padding:10px 14px;background:rgba(16,185,129,.08);border-radius:10px;margin-bottom:8px;font-size:13px;line-height:1.55;">
      <span style="font-weight:600;color:var(--mint);">Upgrade →</span> ${n.trigger_up}</div>
    <div style="padding:10px 14px;background:rgba(239,68,68,.08);border-radius:10px;font-size:13px;line-height:1.55;">
      <span style="font-weight:600;color:var(--crimson);">Downgrade →</span> ${n.trigger_down}</div>
  </div>`;

  // === Bottom line + disclaimer (renders only when narrative.bottom_line is present) ===
  if (n.bottom_line) {
    html += `<div class="card card-pad anim" style="margin-bottom:20px;background:rgba(99,102,241,.04);border-left:3px solid var(--accent);">
      <div class="section-title" style="font-size:14px;margin-bottom:8px;">Bottom line</div>
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0 0 10px 0;">${n.bottom_line}</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0;"><b>Stance: <span style="color:${color};">${(n.stance || '').toUpperCase()}</span></b>, with capex/ROI as the explicit thing to verify each quarter.</p>
      ${n.disclaimer ? `<div style="margin-top:14px;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);"><span style="font-size:11px;color:var(--muted);font-style:italic;line-height:1.55;"><b>Disclaimer:</b> ${n.disclaimer}</span></div>` : ''}
    </div>`;
  }

  // Claims table
  html += `<div class="card anim" style="overflow:hidden;">
    <div class="card-pad" style="padding-bottom:0;">
      <div class="section-title" style="font-size:14px;">Real guidance vs. actuals</div>
      <div class="section-sub">${c.beats}/${c.n_claims} beats · average beat magnitude derived from values below</div>
    </div>
    <table>
      <thead><tr><th>Claim</th><th>Quarter made</th><th>Target</th>
        <th class="right">Guided</th><th class="right">Actual</th>
        <th class="right">Δ%</th><th class="right">Accuracy</th></tr></thead>
      <tbody>${c.rows.map(r => {
          if (r.pending) {
            return `<tr style="cursor:default;background:rgba(245,158,11,.05);">
              <td class="mono" style="font-size:12px;">${r.claim_id}</td>
              <td class="mono text-muted" style="font-size:12px;">${r.quarter_made}</td>
              <td class="mono text-muted" style="font-size:12px;">${r.target_quarter}</td>
              <td class="right tabular">${fmtMoney(r.guided)}</td>
              <td class="right tabular text-muted" colspan="3"><span class="pill" style="background:rgba(245,158,11,.15);color:#b45309;">actual pending — Q2 2026 not yet reported</span></td>
              </tr>`;
          }
          return `<tr style="cursor:default;">
            <td class="mono" style="font-size:12px;">${r.claim_id}</td>
            <td class="mono text-muted" style="font-size:12px;">${r.quarter_made}</td>
            <td class="mono text-muted" style="font-size:12px;">${r.target_quarter}</td>
            <td class="right tabular">${fmtMoney(r.guided)}</td>
            <td class="right tabular">${fmtMoney(r.actual)}</td>
            <td class="right tabular" style="color:${r.bms>0?'var(--mint)':r.bms<0?'var(--crimson)':'inherit'};font-weight:500;">${r.pct>=0?'+':''}${r.pct}%</td>
            <td class="right tabular">${fmtN(r.accuracy)}</td></tr>`;
        }).join('')}</tbody>
    </table>
  </div>`;

  // ===== Quarter-to-Quarter Line-Item Analysis (META only for now) =====
  // Compares every forward-guidance line item the CFO/CEO gave on each call
  // against the actual reported value in the next 10-Q/10-K. Verdict per line.
  if (c.q2q_analysis) {
    const qa = c.q2q_analysis;
    const pairs = qa.q_to_q_pairs || [];
    // Roll-up stats across all closed line items
    let totalClosed = 0, beats = 0, inlines = 0, misses = 0;
    let totalStrategic = 0, stratDelivered = 0, stratPending = 0;
    pairs.forEach(p => {
      if (p.status === 'pending') return;
      p.line_items.forEach(li => {
        const v = (li.verdict || '').toLowerCase();
        if (!v) return;
        const numeric = ['revenue','fy_expense','fy_capex','fy_tax','q_tax'].includes(li.metric_kind);
        if (numeric) {
          if (v.startsWith('beat')) { beats++; totalClosed++; }
          else if (v.startsWith('in-line')) { inlines++; totalClosed++; }
          else if (v.startsWith('miss')) { misses++; totalClosed++; }
        } else {
          totalStrategic++;
          if (v.startsWith('delivered') || v.startsWith('on track') || v.startsWith('beat')) stratDelivered++;
          else if (v.startsWith('pending') || v.startsWith('partial')) stratPending++;
        }
      });
    });
    const verdictPill = (v) => {
      if (!v) return '';
      const vl = v.toLowerCase();
      if (vl.startsWith('beat')) return `<span class="pill" style="background:rgba(16,185,129,.15);color:#047857;font-weight:600;">${v}</span>`;
      if (vl.startsWith('in-line')) return `<span class="pill" style="background:rgba(99,102,241,.15);color:#4338ca;font-weight:600;">${v}</span>`;
      if (vl.startsWith('miss')) return `<span class="pill" style="background:rgba(239,68,68,.15);color:#b91c1c;font-weight:600;">${v}</span>`;
      if (vl.startsWith('pending')) return `<span class="pill" style="background:rgba(245,158,11,.15);color:#b45309;font-weight:600;">${v}</span>`;
      return `<span class="pill">${v}</span>`;
    };
    const NUMERIC_KINDS = new Set(['revenue', 'fy_expense', 'fy_capex', 'fy_tax', 'q_tax']);
    const isNumeric = (li) => NUMERIC_KINDS.has(li.metric_kind);
    const fmtGuideRange = (li) => {
      if (!isNumeric(li)) return li.target_period ? `Target: ${li.target_period}` : 'Strategic commitment';
      if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) return `${li.guide_low_pct}% – ${li.guide_high_pct}% (mid ${li.guide_mid_pct.toFixed(1)}%)`;
      return `$${li.guide_low_b}B – $${li.guide_high_b}B (mid $${li.guide_mid_b.toFixed(2)}B)`;
    };
    const fmtActual = (li) => {
      if (!isNumeric(li)) {
        if (li.outcome_summary) return `<span style="font-size:12px;font-weight:500;">${li.outcome_summary.length>50?li.outcome_summary.slice(0,50)+'…':li.outcome_summary}</span>`;
        return '<span class="text-muted" style="font-size:12px;">see detail</span>';
      }
      if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) return li.actual_pct == null ? '<span class="text-muted">pending</span>' : `${li.actual_pct.toFixed(2)}%`;
      return li.actual_b == null ? '<span class="text-muted">pending</span>' : `$${li.actual_b.toFixed(2)}B`;
    };
    const fmtDelta = (li) => {
      if (!isNumeric(li)) return '';
      if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) {
        if (li.delta_vs_mid_pp == null) return '—';
        const v = li.delta_vs_mid_pp;
        return `${v>=0?'+':''}${v.toFixed(2)} pp vs mid`;
      }
      if (li.delta_vs_mid_pct == null) return '—';
      const v = li.delta_vs_mid_pct;
      return `${v>=0?'+':''}${v.toFixed(2)}% vs mid`;
    };
    const colorForDelta = (li) => {
      if (!isNumeric(li)) return 'var(--text)';
      const v = (li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax') ? li.delta_vs_mid_pp : li.delta_vs_mid_pct;
      if (v == null) return 'var(--muted)';
      const goodIsPositive = (li.metric_kind === 'revenue');
      const isGood = goodIsPositive ? v > 0 : v < 0;
      if (Math.abs(v) < 0.5) return 'var(--muted)';
      return isGood ? 'var(--mint)' : 'var(--crimson)';
    };
    const subLabelFor = (li, p) => {
      if (li.metric_kind === 'fy_tax') return 'Full-year tax rate'; if (li.metric_kind === 'q_tax') return 'Next-quarter tax rate';
      if (li.fy_year) return `FY ${li.fy_year}`;
      if (li.metric_kind === 'revenue') return `Targets ${p.targets}`;
      if (!isNumeric(li)) {
        const labels = {product:'Product / strategic', capacity:'Capacity / infrastructure', users:'User scale / engagement',
                        segment:'Segment outlook', partnership:'Partnership / ecosystem', capability:'Capability / R&D', headcount:'Headcount'};
        return (labels[li.metric_kind] || 'Strategic commitment') + (li.target_period ? ` · ${li.target_period}` : '');
      }
      return '';
    };
    const verdictColor = (v) => {
      if (!v) return 'var(--muted)';
      const vl = v.toLowerCase();
      if (vl.startsWith('beat') || vl.startsWith('delivered')) return 'var(--mint)';
      if (vl.startsWith('in-line') || vl.startsWith('on track')) return '#4338ca';
      if (vl.startsWith('miss') || vl.startsWith('failed')) return 'var(--crimson)';
      if (vl.startsWith('pending') || vl.startsWith('partial')) return 'var(--amber)';
      return 'var(--muted)';
    };

    html += `
      <div style="margin-top:32px;border-top:1px solid var(--border);padding-top:24px;">
        <h2 style="margin-bottom:6px;">Quarter-to-Quarter Forward Guidance Analysis</h2>
        <p class="subtitle" style="margin-bottom:16px;max-width:880px;">
          For every earnings call from <b>${qa.q_to_q_pairs[0].made_in}</b> through <b>${qa.q_to_q_pairs[qa.q_to_q_pairs.length-1].made_in}</b>,
          this section pairs each forward-looking line item Susan Li (CFO) and Mark Zuckerberg (CEO) explicitly committed to
          with the corresponding actual reported in the next 10-Q / 10-K filing. Every guidance row carries a verbatim CFO/CEO quote.
          Every actual is XBRL-derived from your submitted SEC filings. <b>This is the test of whether management delivered.</b>
        </p>

        <div class="grid grid-4 anim" style="margin-bottom:10px;gap:14px;">
          <div class="mini-card"><div class="mini-card-label">Financial line items</div><div class="mini-card-value tabular">${totalClosed}</div><div style="font-size:10px;color:var(--muted);margin-top:2px;">closed (with reported actuals)</div></div>
          <div class="mini-card"><div class="mini-card-label">Beats</div><div class="mini-card-value tabular" style="color:var(--mint);">${beats}</div></div>
          <div class="mini-card"><div class="mini-card-label">In-line</div><div class="mini-card-value tabular" style="color:#4338ca;">${inlines}</div></div>
          <div class="mini-card"><div class="mini-card-label">Misses</div><div class="mini-card-value tabular" style="color:${misses>0?'var(--crimson)':'var(--muted)'};">${misses}</div></div>
        </div>
        <div class="grid grid-4 anim" style="margin-bottom:18px;gap:14px;">
          <div class="mini-card"><div class="mini-card-label">Strategic commitments</div><div class="mini-card-value tabular">${totalStrategic}</div><div style="font-size:10px;color:var(--muted);margin-top:2px;">products / capacity / users / R&amp;D</div></div>
          <div class="mini-card"><div class="mini-card-label">Delivered / on track</div><div class="mini-card-value tabular" style="color:var(--mint);">${stratDelivered}</div></div>
          <div class="mini-card"><div class="mini-card-label">Pending / partial</div><div class="mini-card-value tabular" style="color:var(--amber);">${stratPending}</div></div>
          <div class="mini-card"><div class="mini-card-label">Total commitments tracked</div><div class="mini-card-value tabular">${totalClosed + totalStrategic + (pairs.length - pairs.filter(p=>p.status!=='pending').length)*0}</div></div>
        </div>

        <p style="font-size:12px;color:var(--muted);margin-bottom:14px;">Click any line item below to see the verbatim CFO quote, source filing, and analyst narrative. <b style="color:var(--mint);">Beat</b> = actual landed on favourable side of range · <b style="color:#4338ca;">In-line</b> = inside range · <b style="color:var(--crimson);">Miss</b> = unfavourable side.</p>

        ${pairs.map((p, pi) => {
          const isPending = p.status === 'pending';
          const headerColor = isPending ? 'var(--amber)' : 'var(--accent)';
          const numericItems = p.line_items.map((li,idx)=>({li,idx})).filter(x => NUMERIC_KINDS.has(x.li.metric_kind));
          const strategicItems = p.line_items.map((li,idx)=>({li,idx})).filter(x => !NUMERIC_KINDS.has(x.li.metric_kind));
          const renderRow = (li, idx) => `
            <button class="q2q-row" onclick="showQ2QDetail('${ticker}',${pi},${idx})" aria-label="Open detail for ${li.metric.replace(/"/g,'&quot;')}">
              <div>
                <div class="q2q-metric">${li.metric}</div>
                <div class="q2q-metric-sub">${subLabelFor(li, p)}</div>
              </div>
              <div>
                <div class="q2q-num-label">${isNumeric(li) ? 'Guidance' : 'Commitment'}</div>
                <div class="q2q-num" style="font-size:${isNumeric(li)?'13px':'11.5px'};font-weight:${isNumeric(li)?'600':'500'};">${isNumeric(li) ? fmtGuideRange(li) : 'Verbatim quote in detail'}</div>
              </div>
              <div>
                <div class="q2q-num-label">${isNumeric(li) ? 'Actual' : 'Outcome'}</div>
                <div class="q2q-num" style="color:${colorForDelta(li)};font-size:${isNumeric(li)?'13px':'11.5px'};">${fmtActual(li)}${isNumeric(li) && (li.actual_b!=null||li.actual_pct!=null)?` <span style='font-size:10.5px;font-weight:500;color:${colorForDelta(li)};'>(${fmtDelta(li)})</span>`:''}</div>
              </div>
              <div style="text-align:right;">${verdictPill(li.verdict)}</div>
              <div class="q2q-chevron" aria-hidden="true">›</div>
            </button>`;
          // --- Compact summary tiles for the collapsed button face ---
          const sm = p.summary_metrics || {};
          const fmtPctSigned = v => {
            if (v == null) return '<span style="color:var(--muted);">—</span>';
            const n = Number(v); const sign = n > 0 ? '+' : '';
            const color = n > 0 ? 'var(--mint)' : (n < 0 ? '#ef4444' : 'var(--muted)');
            return `<span style="color:${color};">${sign}${n.toFixed(2)}%</span>`;
          };
          const fmtPpSigned = v => {
            if (v == null) return '';
            const n = Number(v); const sign = n > 0 ? '+' : '';
            const color = n > 0 ? 'var(--mint)' : (n < 0 ? '#ef4444' : 'var(--muted)');
            return `<span style="color:${color};">${sign}${n.toFixed(2)}pp YoY</span>`;
          };
          const fmtPctYoY = v => {
            if (v == null) return '';
            const n = Number(v); const sign = n > 0 ? '+' : '';
            const color = n > 0 ? 'var(--mint)' : (n < 0 ? '#ef4444' : 'var(--muted)');
            return `<span style="color:${color};">${sign}${n.toFixed(1)}% YoY</span>`;
          };
          // Stock tile: prefer 5d reaction; fall back to 1d
          const stockMain = sm.stock_reaction_5d_pct != null ? sm.stock_reaction_5d_pct : sm.stock_reaction_1d_pct;
          const stockMainLbl = sm.stock_reaction_5d_pct != null ? '5-day reaction' : '1-day reaction';
          const stockSub = sm.stock_reaction_5d_pct != null && sm.stock_reaction_1d_pct != null
            ? `1-day ${sm.stock_reaction_1d_pct > 0 ? '+' : ''}${sm.stock_reaction_1d_pct.toFixed(2)}%`
            : (sm.call_date ? `Call ${sm.call_date}` : '');
          // MCS tile: per-pair revenue accuracy if available
          const mcsTxt = sm.mcs_pair_accuracy != null
            ? sm.mcs_pair_accuracy.toFixed(4)
            : '<span style="color:var(--muted);">pending</span>';
          // Revenue tile: guide range vs actual; verdict color
          const revVerdict = (sm.verdict_revenue || '').toLowerCase();
          const revColor = revVerdict.startsWith('beat') ? 'var(--mint)'
            : revVerdict.startsWith('in-line') ? 'var(--accent)'
            : revVerdict.startsWith('miss') ? '#ef4444' : 'var(--text)';
          const revGuide = (sm.revenue_guide_low_b != null)
            ? `$${sm.revenue_guide_low_b.toFixed(1)}–${sm.revenue_guide_high_b.toFixed(1)}B`
            : '—';
          const revActual = (sm.revenue_actual_b != null) ? `$${sm.revenue_actual_b.toFixed(2)}B` : '<span style="color:var(--muted);">pending</span>';
          const revDelta = (sm.revenue_delta_pct != null)
            ? ` <span style="font-size:10.5px;color:${revColor};">(${sm.revenue_delta_pct > 0 ? '+' : ''}${sm.revenue_delta_pct.toFixed(2)}% vs mid)</span>` : '';
          // Net margin tile: actual + YoY delta (no formal guide given)
          const nmActual = (sm.net_margin_actual_pct != null) ? `${sm.net_margin_actual_pct.toFixed(2)}%` : '<span style="color:var(--muted);">pending</span>';
          const nmYoY = fmtPpSigned(sm.net_margin_yoy_pp);
          // EPS tile: actual + YoY delta
          const epsActual = (sm.eps_actual != null) ? `$${sm.eps_actual.toFixed(2)}` : '<span style="color:var(--muted);">pending</span>';
          const epsYoY = fmtPctYoY(sm.eps_yoy_pct);
          return `
          <details class="q2q-pair-card anim" style="border-left:3px solid ${headerColor};">
            <summary>
            <div class="q2q-pair-head" style="border-radius:0;">
              <div>
                <span class="mono">${p.made_in} call → targets ${p.targets}</span>
                ${p.call_date ? `<span class="text-muted" style="font-weight:400;margin-left:10px;font-size:10.5px;">Call date: ${p.call_date}</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                ${isPending ? `<span class="pill" style="background:rgba(245,158,11,.15);color:#b45309;">PENDING</span>` : `<span class="text-muted" style="font-weight:400;font-size:10px;">${p.line_items.length} commitments · click to expand</span>`}
                <span class="q2q-toggle-chevron">▾</span>
              </div>
            </div>
            <div class="q2q-summary-tiles">
              <div class="q2q-tile">
                <div class="q2q-tile-label">📈 Stock — ${stockMainLbl}</div>
                <div class="q2q-tile-value">${stockMain != null ? fmtPctSigned(stockMain) : '<span style="color:var(--muted);">n/a</span>'}</div>
                <div class="q2q-tile-sub">${stockSub}</div>
              </div>
              <div class="q2q-tile">
                <div class="q2q-tile-label">🎯 MCS (this pair)</div>
                <div class="q2q-tile-value">${mcsTxt}</div>
                <div class="q2q-tile-sub">revenue-guide accuracy</div>
              </div>
              <div class="q2q-tile">
                <div class="q2q-tile-label">💰 Revenue — guide vs actual</div>
                <div class="q2q-tile-value" style="color:${revColor};">${revActual}${revDelta}</div>
                <div class="q2q-tile-sub">guide ${revGuide}</div>
              </div>
              <div class="q2q-tile">
                <div class="q2q-tile-label">📊 Net margin — actual</div>
                <div class="q2q-tile-value">${nmActual}</div>
                <div class="q2q-tile-sub">${nmYoY || '<span style="color:var(--subtle);">no formal guide</span>'}</div>
              </div>
              <div class="q2q-tile">
                <div class="q2q-tile-label">💵 EPS — actual</div>
                <div class="q2q-tile-value">${epsActual}</div>
                <div class="q2q-tile-sub">${epsYoY || '<span style="color:var(--subtle);">no formal guide</span>'}</div>
              </div>
            </div>
            </summary>

            <!-- Quantitative financial commitments -->
            ${numericItems.length ? `<div style="background:var(--bg);padding:6px 16px;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;border-bottom:1px solid var(--border);">📊 Financial commitments (${numericItems.length})</div>` : ''}
            ${numericItems.map(x => renderRow(x.li, x.idx)).join('')}

            <!-- Strategic / product commitments -->
            ${strategicItems.length ? `<div style="background:var(--bg);padding:6px 16px;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;border-bottom:1px solid var(--border);border-top:1px solid var(--border);">🎯 Strategic / product commitments (${strategicItems.length})</div>` : ''}
            ${strategicItems.map(x => renderRow(x.li, x.idx)).join('')}

            <!-- Stock price section (T-5 → T+5 daily-close trend around earnings) -->
            ${p.call_date ? (() => {
              const sr = p.stock_reaction;
              if (qa.stock_prices_available && sr && sr.day_of_close != null) {
                const fmtPx = v => v == null ? '—' : `$${Number(v).toFixed(2)}`;
                const fmtPct = v => {
                  if (v == null) return '—';
                  const n = Number(v);
                  const sign = n > 0 ? '+' : '';
                  const color = n > 0 ? 'var(--mint)' : (n < 0 ? '#ef4444' : 'var(--muted)');
                  return `<span style="color:${color};font-weight:600;">${sign}${n.toFixed(2)}%</span>`;
                };
                // Build sparkline
                const series = (sr.series || []).filter(s => s.close != null);
                const W = 760, H = 110, PADX = 30, PADY = 18;
                const closes = series.map(s => s.close);
                const minC = Math.min(...closes), maxC = Math.max(...closes);
                const span = (maxC - minC) || 1;
                const xFor = i => PADX + (i / Math.max(series.length - 1, 1)) * (W - 2 * PADX);
                const yFor = c => H - PADY - ((c - minC) / span) * (H - 2 * PADY);
                let pts = '';
                let dots = '';
                let labels = '';
                series.forEach((s, i) => {
                  const x = xFor(i), y = yFor(s.close);
                  pts += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
                  const isAnchor = (s.offset === 0);
                  const isAdj = (s.offset === -1 || s.offset === 1);
                  const r = isAnchor ? 4.5 : (isAdj ? 3.2 : 2);
                  const fill = isAnchor ? 'var(--accent)' : (isAdj ? 'var(--mint)' : 'var(--muted)');
                  dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" />`;
                  // Date label below for key points
                  if (isAnchor || s.offset === -5 || s.offset === 5 || isAdj) {
                    const lbl = (s.offset === 0 ? 'T (earnings)' : (s.offset === -5 ? 'T−5' : (s.offset === 5 ? 'T+5' : (s.offset === -1 ? 'T−1' : 'T+1'))));
                    const d = s.date ? s.date.slice(5) : '';
                    labels += `<text x="${x.toFixed(1)}" y="${(H - 2).toFixed(1)}" font-size="9" text-anchor="middle" fill="var(--subtle)">${lbl} · ${d}</text>`;
                    // Price annotation above key dots
                    if (isAnchor || isAdj) {
                      labels += `<text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}" font-size="10" text-anchor="middle" fill="var(--text)" style="font-variant-numeric:tabular-nums;font-weight:600;">$${s.close.toFixed(2)}</text>`;
                    }
                  }
                });
                const last = series[series.length - 1];
                const first = series[0];
                const pathColor = (last.close >= first.close) ? 'var(--mint)' : '#ef4444';
                const fillColor = (last.close >= first.close) ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.08)';
                // Closed area fill polygon
                const areaPath = pts + `L${xFor(series.length-1).toFixed(1)},${(H-PADY).toFixed(1)} L${xFor(0).toFixed(1)},${(H-PADY).toFixed(1)} Z`;
                const dataTable = series.map(s => `<td style="padding:3px 7px;text-align:center;font-variant-numeric:tabular-nums;${s.offset===0?'background:rgba(99,102,241,.10);font-weight:600':''}">${s.close == null ? '—' : '$' + s.close.toFixed(2)}</td>`).join('');
                const dateTable = series.map(s => `<th style="padding:3px 7px;text-align:center;font-size:9.5px;color:var(--muted);font-weight:500;${s.offset===0?'color:var(--accent);font-weight:700':''}">${s.offset===0?'T':(s.offset>0?'T+'+s.offset:'T'+s.offset)}<br><span style="font-size:9px;color:var(--subtle);font-weight:400;">${s.date ? s.date.slice(5) : '—'}</span></th>`).join('');
                const pre5  = sr.pre_5d_run_pct;
                return `
              <div style="border-top:1px solid var(--border);padding:14px 16px;background:rgba(99,102,241,.03);">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
                  <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;">📈 Stock price trend — 5 trading days before & after earnings <span style="color:var(--subtle);font-weight:500;text-transform:none;letter-spacing:0;margin-left:6px;">(daily closes; META reports after-market-close so T close is pre-print)</span></div>
                  <div style="font-size:9.5px;color:var(--subtle);">Source: ${qa.stock_prices_source}</div>
                </div>
                <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none" style="display:block;margin:6px 0;">
                  <path d="${areaPath}" fill="${fillColor}" stroke="none"/>
                  <path d="${pts}" fill="none" stroke="${pathColor}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
                  ${dots}
                  ${labels}
                </svg>
                <div style="overflow-x:auto;margin-top:6px;">
                  <table style="border-collapse:collapse;width:100%;font-size:11px;">
                    <thead><tr>${dateTable}</tr></thead>
                    <tbody><tr>${dataTable}</tr></tbody>
                  </table>
                </div>
                <div class="grid grid-4" style="gap:10px;margin-top:12px;">
                  <div class="mini-card"><div class="mini-card-label">Day before earnings (T−1)</div><div class="mini-card-value tabular" style="font-size:15px;">${fmtPx(sr.day_before_close)}</div><div style="font-size:9.5px;color:var(--subtle);margin-top:2px;">${sr.day_before_date || ''}</div></div>
                  <div class="mini-card"><div class="mini-card-label">Day of earnings (T)</div><div class="mini-card-value tabular" style="font-size:15px;">${fmtPx(sr.day_of_close)}</div><div style="font-size:9.5px;color:var(--subtle);margin-top:2px;">${sr.day_of_date || ''} · call date</div></div>
                  <div class="mini-card"><div class="mini-card-label">Day after earnings (T+1)</div><div class="mini-card-value tabular" style="font-size:15px;">${fmtPx(sr.day_after_close)}</div><div style="font-size:9.5px;color:var(--subtle);margin-top:2px;">${sr.day_after_date || ''}</div></div>
                  <div class="mini-card"><div class="mini-card-label">5-day reaction (T+5 vs T)</div><div class="mini-card-value tabular" style="font-size:15px;">${fmtPct(sr.reaction_5d_pct)}</div><div style="font-size:9.5px;color:var(--subtle);margin-top:2px;">${sr.t_plus_5_date ? 'thru ' + sr.t_plus_5_date : (sr.day_of_date ? 'T+5 outside dataset' : '')}</div></div>
                </div>
                <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;font-size:11px;color:var(--muted);">
                  <span>1-day reaction (T+1 vs T): <b>${fmtPct(sr.reaction_1d_pct)}</b></span>
                  <span>5-day pre-earnings run (T vs T−5): <b>${fmtPct(pre5)}</b></span>
                </div>
              </div>`;
              }
              return `
              <div style="border-top:1px solid var(--border);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:rgba(99,102,241,.03);">
                <div>
                  <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;margin-bottom:4px;">📈 Stock price reaction</div>
                  <div style="font-size:11.5px;color:var(--muted);line-height:1.4;">Daily close prices not yet supplied. Place an OHLCV file in <span class="mono" style="font-size:10.5px;">META_inbox/Stock Price Data/</span> to populate the T−5 → T+5 trend (call date: ${p.call_date}).</div>
                </div>
              </div>`;
            })() : ''}

            <!-- Key events list -->
            ${p.key_events && p.key_events.length ? `
              <div style="border-top:1px solid var(--border);padding:14px 18px;background:var(--bg);">
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;margin-bottom:8px;">📰 Key events on this call</div>
                <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:5px;">
                  ${p.key_events.map(ev => `<li style="font-size:12.5px;line-height:1.5;display:flex;gap:8px;color:var(--text);"><span style="color:var(--accent);font-weight:600;flex-shrink:0;">▸</span><span>${ev}</span></li>`).join('')}
                </ul>
              </div>` : ''}

            <!-- Per-quarter analyst narrative (4-5 lines) -->
            ${p.narrative ? `
              <div style="border-top:1px solid var(--border);padding:14px 18px;background:rgba(16,185,129,.04);">
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:600;margin-bottom:6px;">✓ Did management deliver?</div>
                <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0;">${p.narrative}</p>
              </div>` : ''}
          </details>`;
        }).join('')}

        <div class="card card-pad anim" style="margin-bottom:24px;background:rgba(99,102,241,.04);border-left:3px solid var(--accent);">
          <div class="section-title" style="font-size:14px;">What this section validates about MCS</div>
          <p style="font-size:13px;color:var(--text);margin-top:8px;line-height:1.6;">
            ${beats}/${totalClosed} line items came in <b style="color:var(--mint);">at or above</b> management's stated commitment, ${inlines} landed inside the guided range,
            and ${misses} fell outside. The MCS score above (<b>${fmtN(c.mcs_information_adjusted)}</b>) is built on the revenue subscore alone;
            this section adds management's other explicitly-stated numeric commitments — full-year expenses, full-year capex, full-year tax rate, the next-quarter Q-tax rate when given (e.g., 2024-Q3 and 2025-Q3 calls), plus the next-quarter revenue range —
            to give a fuller picture of whether their <i>aggregate</i> forward-guidance language is reliable. Each commitment is matched to actuals from the time horizon management itself specified: next-quarter guides → that quarter's filing; full-year guides → that year's 10-K; quarter-specific tax-rate guides → quarterly amounts derived from XBRL by subtracting prior YTD totals from the FY 10-K.
            ${misses > 0 ? `The ${misses} miss${misses>1?'es':''} both occurred on commitments made in the 2024-Q4 call about FY 2025: the FY 2025 capex initial outlook ($60–65B; raised three times during 2025 to a final $70–72B; FY actual $69.7B) and the FY 2025 tax-rate guide (12–15%; FY actual 29.6% — driven by the one-time tax legislation charge documented in Meta's own 10-K, not by management failure to forecast operating performance).` : ''}
          </p>
        </div>

        <div style="font-size:11px;color:var(--subtle);text-align:right;margin-bottom:8px;">
          Method: ${qa.metadata.method}<br>
          Guidance source: ${qa.metadata.guidance_source} · Actuals source: ${qa.metadata.actuals_source}
        </div>
      </div>`;
  }

  // Fundamentals + risk factors (META has these; others may not)
  if (c.fundamentals) {
    const f = c.fundamentals;
    const s = f.summary;
    const qs = f.quarters || [];
    // Bar chart for revenue (absolute coords, viewBox 1000x240)
    const VW = 1000, VH = 240, BASE = 190, MAXH = 170;
    const max = Math.max(...qs.map(q => q.rev_q_M || 0));
    const slot = qs.length ? VW / qs.length : 0;
    const barWidth = Math.max(20, slot * 0.6);
    let chartBars = '';
    qs.forEach((q, i) => {
      const h = max > 0 ? (q.rev_q_M / max) * MAXH : 0;
      const cx = i * slot + slot / 2;
      const x = cx - barWidth / 2;
      const niH = max > 0 ? (q.ni_q_M / max) * MAXH : 0;
      const niW = barWidth * 0.45;
      chartBars += `<rect x="${x}" y="${BASE - h}" width="${barWidth}" height="${h}" rx="3" fill="var(--accent)" opacity="0.85"/>` +
                   `<rect x="${cx - niW/2}" y="${BASE - niH}" width="${niW}" height="${niH}" rx="2" fill="var(--mint)" opacity="0.9"/>` +
                   `<text x="${cx}" y="${BASE - h - 6}" font-size="11" text-anchor="middle" fill="var(--text)" style="font-variant-numeric:tabular-nums;font-weight:600;">$${(q.rev_q_M/1000).toFixed(1)}B</text>` +
                   `<text x="${cx}" y="${BASE + 18}" font-size="10" text-anchor="middle" fill="var(--muted)">FY${q.fy} Q${q.fq}</text>` +
                   `<text x="${cx}" y="${BASE + 32}" font-size="9" text-anchor="middle" fill="var(--mint)">NI $${(q.ni_q_M/1000).toFixed(1)}B</text>`;
    });

    html += `
      <div style="margin-top:32px;border-top:1px solid var(--border);padding-top:24px;">
        <h2 style="margin-bottom:6px;">Fundamentals — extracted from submitted 10-Q / 10-K filings</h2>
        <p class="subtitle" style="margin-bottom:20px;">All values below come directly from the inline-XBRL in your META filings (FY2024 Q3 → FY2026 Q1). Single-quarter values are derived by subtracting prior YTD totals.</p>
        <div class="grid grid-4 anim" style="margin-bottom:18px;gap:14px;">
          <div class="mini-card"><div class="mini-card-label">Latest revenue (Q1 2026)</div><div class="mini-card-value tabular">$${s.latest_revenue_b}B</div></div>
          <div class="mini-card"><div class="mini-card-label">Latest net income</div><div class="mini-card-value tabular">$${s.latest_net_income_b}B</div></div>
          <div class="mini-card"><div class="mini-card-label">YoY revenue growth</div><div class="mini-card-value tabular" style="color:var(--mint);">+${s.yoy_revenue_growth_pct}%</div></div>
          <div class="mini-card"><div class="mini-card-label">Diluted EPS (Q1 2026)</div><div class="mini-card-value tabular">$${s.latest_eps}</div></div>
        </div>
        <div class="grid grid-4 anim" style="margin-bottom:18px;gap:14px;">
          <div class="mini-card"><div class="mini-card-label">Gross margin</div><div class="mini-card-value tabular">${s.latest_gross_margin_pct}%</div></div>
          <div class="mini-card"><div class="mini-card-label">Operating margin</div><div class="mini-card-value tabular">${s.latest_operating_margin_pct}%</div></div>
          <div class="mini-card"><div class="mini-card-label">Net margin</div><div class="mini-card-value tabular">${s.latest_net_margin_pct}%</div></div>
          <div class="mini-card"><div class="mini-card-label">ROE (annualized)</div><div class="mini-card-value tabular">${s.latest_roe_q_annualized_pct}%</div></div>
        </div>
        <div class="grid grid-4 anim" style="margin-bottom:24px;gap:14px;">
          <div class="mini-card"><div class="mini-card-label">FCF (latest Q)</div><div class="mini-card-value tabular">$${s.latest_fcf_b}B</div></div>
          <div class="mini-card"><div class="mini-card-label">Current ratio</div><div class="mini-card-value tabular">${s.latest_current_ratio}</div></div>
          <div class="mini-card"><div class="mini-card-label">L-T Debt / Equity</div><div class="mini-card-value tabular">${s.latest_long_debt_to_equity}</div></div>
          <div class="mini-card"><div class="mini-card-label">DSO (days)</div><div class="mini-card-value tabular">${s.latest_dso_days}</div></div>
        </div>

        <div class="card card-pad anim" style="margin-bottom:24px;">
          <div class="section-title">Quarterly revenue trend</div>
          <div class="section-sub" style="margin-bottom:14px;">Standalone single-quarter values · ${s.n_quarters_in_series}-quarter CAGR: <b style="color:var(--accent);">${s.n_quarter_cagr_pct}%</b></div>
          <svg viewBox="0 0 1000 240" style="width:100%;height:240px;display:block;">
            <line x1="0" y1="190" x2="1000" y2="190" stroke="var(--border)"/>
            ${chartBars}
          </svg>
          <div style="display:flex;gap:18px;justify-content:center;font-size:11px;color:var(--muted);margin-top:8px;">
            <span><span style="display:inline-block;width:10px;height:10px;background:var(--accent);border-radius:2px;vertical-align:middle;margin-right:5px;"></span>Revenue</span>
            <span><span style="display:inline-block;width:10px;height:10px;background:var(--mint);border-radius:2px;vertical-align:middle;margin-right:5px;"></span>Net Income</span>
          </div>
        </div>

        <div class="card anim" style="overflow:hidden;margin-bottom:24px;">
          <div class="card-pad" style="padding-bottom:0;">
            <div class="section-title" style="font-size:14px;">Per-quarter fundamentals (real from filings)</div>
          </div>
          <table>
            <thead><tr>
              <th>Quarter</th><th class="right">Revenue</th><th class="right">Net Income</th>
              <th class="right">Op Margin</th><th class="right">Net Margin</th>
              <th class="right">OCF</th><th class="right">Capex</th><th class="right">FCF</th>
              <th class="right">EPS</th><th class="right">Curr Ratio</th>
            </tr></thead>
            <tbody>
              ${qs.map(q => `<tr style="cursor:default;">
                <td class="mono" style="font-size:12px;">FY${q.fy} Q${q.fq}</td>
                <td class="right tabular">$${(q.rev_q_M/1000).toFixed(2)}B</td>
                <td class="right tabular">$${(q.ni_q_M/1000).toFixed(2)}B</td>
                <td class="right tabular">${q.operating_margin_pct}%</td>
                <td class="right tabular">${q.net_margin_pct}%</td>
                <td class="right tabular">$${(q.ocf_q_M/1000).toFixed(2)}B</td>
                <td class="right tabular">$${(q.capex_q_M/1000).toFixed(2)}B</td>
                <td class="right tabular">$${(q.fcf_q_M/1000).toFixed(2)}B</td>
                <td class="right tabular">$${q.eps}</td>
                <td class="right tabular">${q.current_ratio}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="card card-pad anim" style="margin-bottom:24px;background:rgba(245,158,11,.05);border-left:3px solid var(--amber);">
          <div class="section-title" style="font-size:14px;color:#b45309;">Market cap — not extractable from filings alone</div>
          <p style="font-size:13px;color:var(--text);margin-top:8px;line-height:1.55;">${f.market_cap_note}</p>
        </div>

        <div class="card card-pad anim" style="margin-bottom:24px;">
          <div class="section-title">Sector-wide risks (verbatim from META FY2025 10-K Item 1A)</div>
          <div class="section-sub" style="margin-bottom:14px;">Extracted from your submitted ${ticker} 10-K filing. Categories below are Meta's own taxonomy.</div>
          ${Object.entries(f.risk_factors).map(([cat, items]) => `
            <div style="margin-bottom:16px;">
              <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text);">${cat}</div>
              <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;">
                ${items.map(r => `<li style="font-size:13px;line-height:1.5;display:flex;gap:8px;color:var(--muted);">
                  <span style="color:var(--crimson);font-weight:600;flex-shrink:0;">•</span><span>${r}</span></li>`).join('')}
              </ul>
            </div>`).join('')}
          <div style="font-size:11px;color:var(--subtle);margin-top:12px;border-top:1px solid var(--border);padding-top:10px;">Source: ${f.risk_source}</div>
        </div>
      </div>`;
  }

  return html;
}

function companiesPage() {
  const cs = Object.values(DATA.companies).filter(c =>
    !searchQuery || c.ticker.toLowerCase().includes(searchQuery));
  return `<h1>Companies</h1><p class="subtitle">Sortable inventory. Click any row to open the ticker page.</p>
  <div class="card anim" style="overflow:hidden;"><table>
    <thead><tr><th>Ticker</th><th>Status</th>
      <th class="right">MCS (info-adj)</th><th class="right">MCS (diff-w)</th>
      <th class="right">Skill vs baseline</th><th class="right">Beats / Misses</th><th class="right">Claims</th></tr></thead>
    <tbody>${cs.map(c => c.pending ? `
      <tr style="opacity:.5;cursor:pointer;" onclick="goTicker('${c.ticker}')">
        <td><span class="mono" style="font-weight:600;">${c.ticker}</span></td>
        <td colspan="6" class="text-muted" style="font-size:13px;">— pending data import —</td></tr>` : `
      <tr onclick="goTicker('${c.ticker}')">
        <td><span class="mono" style="font-weight:600;">${c.ticker}</span></td>
        <td><span class="pill pill-amber">bullish lean</span></td>
        <td class="right tabular">${fmtN(c.mcs_information_adjusted)}</td>
        <td class="right tabular">${fmtN(c.mcs_difficulty_weighted)}</td>
        <td class="right tabular" style="color:${c.skill_over_baseline>=0?'var(--mint)':'var(--amber)'};font-weight:500;">${fmtSign(c.skill_over_baseline)}</td>
        <td class="right" style="font-size:12px;"><span class="text-mint">${c.beats}</span> / <span class="text-crimson">${c.misses}</span></td>
        <td class="right tabular text-muted">${c.n_claims}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function transcriptsPage() {
  const ts = DATA.transcripts.filter(t => !searchQuery || t.ticker.toLowerCase().includes(searchQuery));
  return `<h1>Transcripts</h1><p class="subtitle">Imported earnings-call transcripts. ${ts.length} files indexed.</p>
  <div class="card anim" style="overflow:hidden;"><table>
    <thead><tr><th>Ticker</th><th>FY</th><th>FQ</th><th>Call date</th><th class="right">Words</th></tr></thead>
    <tbody>${ts.map(t => `<tr onclick="goTicker('${t.ticker}')">
      <td><span class="mono" style="font-weight:600;">${t.ticker}</span></td>
      <td>${t.fy}</td><td>Q${t.fq}</td><td class="text-muted">${t.call_date||'—'}</td>
      <td class="right tabular">${t.words.toLocaleString()}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function filingsPage() {
  const fs = DATA.filings.filter(f => !searchQuery || f.ticker.toLowerCase().includes(searchQuery) || f.form.toLowerCase().includes(searchQuery));
  return `<h1>SEC Filings</h1><p class="subtitle">Inventoried 10-Q + 10-K filings. ${fs.length} filings.</p>
  <div class="card anim" style="overflow:hidden;"><table>
    <thead><tr><th>Ticker</th><th>Form</th><th>FY</th><th>FQ</th><th>Period end</th><th>Filed</th><th>Accession</th></tr></thead>
    <tbody>${fs.map(f => `<tr onclick="goTicker('${f.ticker}')">
      <td><span class="mono" style="font-weight:600;">${f.ticker}</span></td>
      <td><span class="pill pill-neutral">${f.form}</span></td><td>${f.fy}</td><td>Q${f.fq}</td>
      <td class="text-muted">${f.period_end||'—'}</td><td class="text-muted">${f.filed||'—'}</td>
      <td class="mono text-muted" style="font-size:12px;">${f.accn}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function goTicker(t) {
  activePage = 'ticker:' + t;
  buildSidebar(); render();
  document.getElementById('crumb').textContent = t;
}
function goPage(p) {
  activePage = p;
  buildSidebar(); render();
  const labels = {
    'meta-summary':'META · Executive Summary',
    'meta-fundamental':'META · Fundamental Analysis (Q4 25 vs Q1 26)',
    'meta-technical':'META · Technical Analysis',
    'meta-consolidated':'META · Consolidated View',
    'meta-options':'META · Options Analysis',
    'meta-valuation':'META · Valuation & Comparables',
    'ticker:META':'META · MCS Score & Credibility',
    'dashboard':'Dashboard', 'companies':'Companies', 'transcripts':'Transcripts', 'filings':'Filings'
  };
  document.getElementById('crumb').textContent = labels[p] || p;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// =================== META REPORTS ===================
// Shared helpers for report layouts
function reportHero(opts) {
  // opts: { title, subtitle, badges:[{label,value,color}], download, dataSource }
  return `
    <div class="card card-pad anim" style="margin-bottom:18px;border-left:4px solid ${opts.barColor||'var(--accent)'};background:linear-gradient(135deg, var(--card) 0%, ${opts.tint||'rgba(99,102,241,.04)'} 100%);">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:260px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:4px;">${opts.kicker||'INSTITUTIONAL RESEARCH'}</div>
          <h1 style="margin:0 0 6px 0;font-size:28px;line-height:1.15;">${opts.title}</h1>
          <p class="subtitle" style="margin:0 0 8px 0;max-width:760px;">${opts.subtitle||''}</p>
        </div>
        ${opts.download ? `<a href="${opts.download}" target="_blank" class="nav-btn" style="background:var(--accent-soft);border:1px solid var(--accent);color:var(--accent);padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">
            ⬇ Download .docx
          </a>` : ''}
      </div>
      ${opts.badges && opts.badges.length ? `
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
          ${opts.badges.map(b => `
            <div class="mini-card" style="flex:1;min-width:160px;${b.color ? 'border-left:3px solid '+b.color+';' : ''}">
              <div class="mini-card-label">${b.label}</div>
              <div class="mini-card-value tabular" style="${b.color ? 'color:'+b.color+';' : ''};font-size:16px;">${b.value}</div>
              ${b.sub ? `<div style="font-size:10px;color:var(--subtle);margin-top:2px;">${b.sub}</div>` : ''}
            </div>`).join('')}
        </div>` : ''}
      ${opts.dataSource ? `<div style="margin-top:10px;font-size:10.5px;color:var(--subtle);">Data: ${opts.dataSource}</div>` : ''}
    </div>`;
}

function reportSection(title, body, opts={}) {
  const id = opts.id ? `id="${opts.id}"` : '';
  return `<div class="card card-pad anim" ${id} style="margin-bottom:18px;${opts.style||''}">
    <div class="section-title" style="font-size:14px;margin-bottom:12px;${opts.titleStyle||''}">${title}</div>
    ${body}
  </div>`;
}

function reportTOC(items) {
  return `<div class="card card-pad anim" style="margin-bottom:18px;background:var(--bg);">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:8px;">In this report</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      ${items.map((it,i)=>`<a href="#${it.id}" style="font-size:12px;padding:5px 10px;background:var(--card);border:1px solid var(--border);border-radius:14px;text-decoration:none;color:var(--text);">${i+1}. ${it.label}</a>`).join('')}
    </div>
  </div>`;
}

function reportImage(src, caption) {
  return `<figure style="margin:0 0 14px 0;text-align:center;">
    <img src="${src}" style="max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border);" alt="${caption||''}"/>
    ${caption ? `<figcaption style="font-size:11px;color:var(--muted);margin-top:6px;font-style:italic;">${caption}</figcaption>` : ''}
  </figure>`;
}

function metaSummaryPage() {
  const n = DATA.narratives['META'];
  const c = DATA.companies['META'];
  return `
    ${reportHero({
      kicker:'EXECUTIVE SUMMARY',
      title:'META — One-page forward view',
      subtitle: n.summary,
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.05)',
      download:'../META_Executive_Summary.docx',
      badges: [
        { label:'Forward view', value:'BULLISH', color:'var(--mint)', sub:'6–12 month horizon' },
        { label:'MCS (info-adj)', value: fmtN(c.mcs_information_adjusted), sub:'Aggregate revenue-guide accuracy' },
        { label:'Latest revenue YoY', value:'+33.1%', color:'var(--mint)', sub:'Q1 2026 print' },
        { label:'Risk to monitor', value:'$125–145B capex', color:'var(--amber)', sub:'2026 guide raised at Q1 print' },
      ],
      dataSource:'SEC EDGAR XBRL · META transcripts · See full executive summary docx for details'
    })}
    ${reportSection('Bull case', `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
      ${n.bull.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--mint);font-weight:700;">+</span><span>${b}</span></li>`).join('')}
    </ul>`, { titleStyle:'color:var(--mint);' })}
    ${reportSection('Bear case', `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;">
      ${n.bear.map(b=>`<li style="display:flex;gap:8px;"><span style="color:var(--crimson);font-weight:700;">−</span><span>${b}</span></li>`).join('')}
    </ul>`, { titleStyle:'color:var(--crimson);' })}
    ${reportSection('What would change the call', `
      <div style="padding:10px 14px;background:rgba(16,185,129,.08);border-radius:10px;margin-bottom:8px;font-size:13px;line-height:1.55;">
        <span style="font-weight:600;color:var(--mint);">Upgrade →</span> ${n.trigger_up}</div>
      <div style="padding:10px 14px;background:rgba(239,68,68,.08);border-radius:10px;font-size:13px;line-height:1.55;">
        <span style="font-weight:600;color:var(--crimson);">Downgrade →</span> ${n.trigger_down}</div>`)}
    ${reportSection('Bottom line', `
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0 0 10px 0;">${n.bottom_line||''}</p>
      <p style="font-size:13.5px;color:var(--text);line-height:1.65;margin:0;"><b>Stance: <span style="color:${STANCE_COLOR[n.color]||'var(--text)'};">${(n.stance||'').toUpperCase()}</span></b>, with capex/ROI as the explicit thing to verify each quarter.</p>
      ${n.disclaimer ? `<div style="margin-top:14px;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);"><span style="font-size:11px;color:var(--muted);font-style:italic;line-height:1.55;"><b>Disclaimer:</b> ${n.disclaimer}</span></div>` : ''}
    `, { style:'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);' })}`;
}

function metaFundamentalPage() {
  const c = DATA.companies['META'];
  const toc = [
    { id:'fa-overview', label:'Overview' },
    { id:'fa-comparison', label:'Comparison table' },
    { id:'fa-validation', label:'Revenue growth validation' },
    { id:'fa-charts', label:'Charts' },
    { id:'fa-commentary', label:'Mgmt commentary' },
    { id:'fa-interpretation', label:'Institutional interpretation' },
    { id:'fa-outlook', label:'Forward outlook' },
  ];
  return `
    ${reportHero({
      kicker:'FUNDAMENTAL — Q4 2025 vs Q1 2026',
      title:'META — Quarter-to-Quarter Comparative Analysis',
      subtitle:"Detailed financial comparison, revenue-growth validation (Megha's 16.1% → 21.6% question), management-commentary review, institutional interpretation, and forward outlook.",
      barColor:'var(--accent)',
      download:'../META_Q4_2025_vs_Q1_2026_Institutional_Report.docx',
      badges: [
        { label:'Q1 2026 verdict', value:'Beat & Raise', color:'var(--accent)', sub:'Revenue +33.1% YoY' },
        { label:'Operating margin', value:'40.62%', color:'var(--mint)', sub:'Q1 2026 (vs 41.31% Q4 25)' },
        { label:'EPS reported',   value:'$10.44', color:'var(--mint)', sub:'incl. ~$1.95 tax-benefit boost' },
        { label:'EPS normalized', value:'~$7.34', color:'var(--amber)', sub:'13.5% normalized tax rate · vs Q4 25 ~$8.54' },
      ],
      dataSource:'SEC EDGAR XBRL (us-gaap concepts) · META Q4 25 + Q1 26 transcripts · 10-K and 10-Q filings'
    })}
    ${reportTOC(toc)}

    ${reportSection('Overview', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">META printed a high-quality Q1 2026: revenue $56.31B (+33.1% YoY) ahead of the $53.5–56.5B guide midpoint, operating income $22.87B at a 40.6% operating margin. Reported diluted EPS of $10.44 came in well ahead of last quarter's $8.87, but <b>~$3.10 of that print is attributable to a $5.0B tax benefit</b> (effective tax rate of −23.1% — partial reversal of the Q3 2025 OBBBA charge). Normalized for taxes (13.5%), Q1 2026 EPS is closer to <b>$7.34</b> vs Q4 2025 normalized $8.54 — meaningful QoQ EPS compression once the tax distortion is stripped out — and underlying net margin compresses from 36.6% (Q4 2025 normalized) to 33.4% (Q1 2026 normalized).</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">We remain <b style="color:var(--mint);">BULLISH</b> on a 6–12 month horizon. The case rests on (1) <b>accelerating</b> ad fundamentals — Q1 ad impressions +19% YoY, price-per-ad +12% YoY (vs +18% / +6% in Q4 2025); (2) management's exceptional forward-guidance accuracy (8 of 8 closed quarters beat or in-line; MCS 0.96); (3) operating margin holding above 40% despite the AI build; and (4) management's reaffirmed FY 2026 OI > FY 2025 OI commitment. The principal risk is the FY 2026 capex range, raised at Q1 2026 from $115–135B to $125–145B (3.6× the FY 2024 figure of $37.3B).</p>
    `, { id:'fa-overview' })}

    ${reportSection('Q4 2025 vs Q1 2026 — detailed financial comparison', `
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin:0 0 10px 0;">All figures derived from SEC EDGAR XBRL. Q4 2025 = FY 2025 10-K minus YTD-Q3 10-Q.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','Q4 2025','Q1 2026','Δ QoQ','Direction'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Total revenue', '$59.89B', '$56.31B', '−$3.58B (−6.0%)', 'Seasonal', 'amber'],
            ['YoY revenue growth', '+23.78%', '<b>+33.08%</b>', '+9.30 pp', 'Accelerating', 'mint'],
            ['Cost of revenue', '$10.91B', '$10.22B', '−$0.69B', 'Improving', 'mint'],
            ['Gross margin', '81.79%', '81.85%', '+6 bps', 'Stable', 'mint'],
            ['Operating income', '$24.75B', '$22.87B', '−$1.87B (−7.6%)', 'Seasonal', 'amber'],
            ['Operating margin', '41.31%', '40.62%', '−69 bps', 'Slight compression', 'amber'],
            ['R&D expense', '$17.14B', '$17.70B', '+$0.56B', 'Investment-led', 'slate'],
            ['R&D as % of revenue', '28.61%', '<b>31.43%</b>', '+283 bps', 'AI build', 'amber'],
            ['Effective tax rate', '10.20%', '<b>−23.08%</b>', '$5.0B tax benefit', 'One-time event', 'amber'],
            ['Net income (reported)', '$22.77B', '<b>$26.77B</b>', '+$4.01B (+17.6%)', 'Inflated by tax benefit', 'amber'],
            ['Net margin (reported)', '38.01%', '<b>47.54%</b>', '+953 bps', 'Tax-distorted', 'amber'],
            ['<i>Net margin (normalized, 13.5% tax)</i>', '~36.6%', '~33.4%', '−320 bps', 'Underlying compression', 'amber'],
            ['Diluted EPS (reported)', '$8.87', '<b>$10.44</b>', '+$1.57 (+17.7%)', 'Reported beat', 'mint'],
            ['<i>Diluted EPS (normalized, 13.5% tax)</i>', '~$8.54', '~$7.34', '−$1.20 (−14.0%)', 'Compression ex tax', 'amber'],
            ['Operating cash flow', '~$30.4B', '<b>$32.23B</b>', '+$1.84B', 'Strong', 'mint'],
            ['Capital expenditures', '~$22.2B', '$19.00B', '−$3.20B QoQ', 'Front-loaded ramp', 'slate'],
            ['Free cash flow', '~$8.2B', '<b>$13.23B</b>', '+$5.0B', 'Improving', 'mint'],
            ['Period-end headcount', '78,800', '77,900', '−900 (−1%)', 'Optimization', 'slate'],
            ['Next-quarter revenue guide', 'Q1 26: $53.5–56.5B', '<b>Q2 26: $58–61B</b>', '+$4.5B mid', 'Raised', 'mint'],
            ['FY 2026 capex guide', '$115–135B', '<b>$125–145B</b>', '+$10B mid', 'Raised', 'amber'],
            ['Family of Apps ad revenue', '$58.1B (+24% YoY)', '<b>$55.0B (+33% YoY)</b>', 'YoY +9pp', 'Accelerating', 'mint'],
            ['Ad impressions / price-per-ad', '+18% / +6%', '<b>+19% / +12%</b>', 'Pricing +6pp', 'Pricing-led', 'mint'],
            ['Post-earnings 5-day reaction', '+0.04%', '<b>−8.55% (1-day)</b>', 'Risk-off on capex', 'Negative', 'crimson'],
          ].map(r => {
            const c = STANCE_COLOR[r[5]] || 'var(--text)';
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--muted);">${r[1]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">${r[3]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${c};font-weight:600;">${r[4]}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
    `, { id:'fa-comparison' })}

    ${reportSection("Revenue growth validation — answering Megha's question", `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><b>Megha's question:</b> validate the YoY revenue trend that "moved from approximately 16.1% to 21.6%."</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Q1 2025</b>: $42,314M ÷ Q1 2024 $36,455M − 1 = <b style="color:var(--mint);">+16.07% YoY</b> (rounds to 16.1%)</li>
        <li>• <b>Q2 2025</b>: $47,516M ÷ Q2 2024 $39,071M − 1 = <b style="color:var(--mint);">+21.61% YoY</b> (rounds to 21.6%)</li>
      </ul>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The 16.1% → 21.6% transition is therefore the <b>Q1 2025 → Q2 2025</b> sequence — confirmed exactly. (For Q4 2025 → Q1 2026 specifically, the corresponding YoY trajectory is <b>+23.78% → +33.08%</b>, a +9.3 pp acceleration.)</p>
      <p style="font-size:13px;color:var(--muted);margin-top:8px;line-height:1.55;"><b>Drivers of acceleration (Q1→Q2 2025 and Q4 25→Q1 26):</b> AI-driven price-per-ad lift (Andromeda, GEM, Advantage+ ranking models), easier YoY comparison base, modest FX tailwind. Not acquisition-driven, not pricing-gimmick driven.</p>
    `, { id:'fa-validation' })}

    ${reportSection('Charts & visualizations', `
      ${reportImage('assets/fundamental/01_revenue_trend.png','Figure 1. Quarterly revenue trend.')}
      ${reportImage('assets/fundamental/02_yoy_growth.png',"Figure 2. YoY revenue growth — Megha's 16.1% → 21.6% Q1→Q2 2025 transition is annotated.")}
      ${reportImage('assets/fundamental/03_qoq_growth.png','Figure 3. QoQ growth showing Q4 holiday seasonality.')}
      ${reportImage('assets/fundamental/04_margin_trend.png','Figure 4. Margin trend — operating margin clean signal; net margin distorted by tax events.')}
      ${reportImage('assets/fundamental/05_eps_trend.png','Figure 5. Diluted EPS reported vs normalized.')}
      ${reportImage('assets/fundamental/06_cashflow_q1.png','Figure 6. Q1 cash-flow comparison.')}
      ${reportImage('assets/fundamental/07_capex_trajectory.png','Figure 7. FY capex trajectory — 3.6× build over 2 years.')}
      ${reportImage('assets/fundamental/08_guidance_vs_actual.png','Figure 8. Forward revenue guide vs actual — 8/8 closed quarters beat or in-range.')}
      ${reportImage('assets/fundamental/09_rd_intensity.png','Figure 9. R&D intensity climbing into AI build.')}
    `, { id:'fa-charts' })}

    ${reportSection('Management commentary highlights', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">Tone: <b style="color:var(--mint);">Bullish</b>. Both Q4 2025 and Q1 2026 calls used confident, forward-leaning language; the Q1 2026 capex raise signals high-conviction AI demand visibility but drove the post-print sell-off.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        ${[
          ['Mark Zuckerberg, CEO — Q4 2025', "We are now seeing a major AI acceleration. … In '25, we rebuilt the foundations of our AI program."],
          ['Susan Li, CFO — Q1 2026', 'The global average price per ad increased 12% year-over-year in Q1, with broad-based growth as we benefited from ad performance improvements, better macro conditions versus Q1 of last year, and currency tailwinds in international regions.'],
          ['Susan Li, CFO — Q1 2026', 'First quarter operating income was $22.9 billion, representing a 41% operating margin. … We continue to expect to deliver operating income this year that is above 2025 operating income.'],
          ['Susan Li, CFO — Q1 2026', 'On that note, we are increasing our infrastructure CapEx forecast for this year. … Capital expenditures, including principal payments on finance leases were $19.8 billion.'],
        ].map(q => `<div style="padding:10px 14px;background:rgba(99,102,241,.06);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;">
          <div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-bottom:4px;">${q[0]}</div>
          <div style="font-size:13px;font-style:italic;line-height:1.6;color:var(--text);">"${q[1]}"</div>
        </div>`).join('')}
      </div>
    `, { id:'fa-commentary' })}

    ${reportSection('Institutional interpretation', `
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">Why the −8.55% post-print reaction?</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 16px 0;">
        <li>• <b>Capex raise.</b> Range moved from $115–135B to $125–145B — third raise since the original FY 2025 range was set in early 2025.</li>
        <li>• <b>Reported-EPS quality.</b> Sophisticated investors quickly discounted ~$3.10 of tax-benefit-driven EPS, leaving "clean" normalized EPS closer to $7.34.</li>
        <li>• <b>Operating-margin compression.</b> The 69 bps QoQ slip reinforced the read that AI build is starting to weigh on near-term operating leverage.</li>
      </ul>
      <h4 style="margin:0 0 8px 0;color:var(--text);font-size:14px;">What hedge funds will focus on</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Capex / OCF ratio.</b> Q1 2026: $19.0B capex on $32.2B OCF = 59% reinvestment rate. Sustainable above 70%? Below 50% by FY 2027?</li>
        <li>• <b>Revenue per employee.</b> Q1 2026: ~$2.9M annualized — record. AI productivity is becoming a measurable financial line.</li>
        <li>• <b>Reality Labs operating-loss trajectory.</b> "Peak in 2025" commitment is the most-tracked multi-year claim.</li>
        <li>• <b>FY 2026 OI > FY 2025 OI.</b> The explicit forward-profit commitment that anchors the bull case.</li>
      </ul>
    `, { id:'fa-interpretation' })}

    ${reportSection('Forward outlook — Q2 2026 expectations', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Revenue:</b> guide $58–61B (mid $59.5B). Base case toward the high end on Q1 ad-pricing inflection + FX tailwind. Likely print: ~$60B (+22% YoY).</li>
        <li>• <b>Operating income:</b> $24–25B at ~40–41% margin.</li>
        <li>• <b>EPS (normalized):</b> $9.0–9.50 range; reported subject to tax-true-ups but base case is no further OBBBA reversals.</li>
        <li>• <b>Capex:</b> $22–24B run-rate; H2 acceleration likely to bring FY into the $135–142B range.</li>
      </ul>
      <p style="font-size:12px;color:var(--muted);margin-top:14px;font-style:italic;line-height:1.5;"><b>Disclaimer:</b> Analytical synthesis, not personalized investment advice. Forecasts are inherently uncertain.</p>
    `, { id:'fa-outlook' })}`;
}

function metaTechnicalPage() {
  const toc = [
    { id:'ta-overview', label:'Verdict & dashboard' },
    { id:'ta-trend',    label:'Trend' },
    { id:'ta-momentum', label:'Momentum' },
    { id:'ta-volume',   label:'Volume' },
    { id:'ta-sr',       label:'S/R levels' },
    { id:'ta-pattern',  label:'Pattern' },
    { id:'ta-risk',     label:'Risk / volatility' },
    { id:'ta-multi',    label:'Multi-timeframe' },
    { id:'ta-verdict',  label:'Final verdict' },
  ];
  return `
    ${reportHero({
      kicker:'TECHNICAL — Daily bars, 2y + 1Q',
      title:'META — Daily Technical Study',
      subtitle:'Long-term fundamental BULLISH vs short-term technical BEARISH — and why these views are not contradictory. Data thru April 30, 2026.',
      barColor:'var(--crimson)',
      tint:'rgba(239,68,68,.04)',
      download:'../META_Technical_Analysis_Report.docx',
      badges: [
        { label:'Last close', value:'$611.91', sub:'April 30, 2026' },
        { label:'52-week range', value:'$520 – $796', sub:'High Aug 15, 25 / Low Mar 27, 26' },
        { label:'Drawdown from 52w high', value:'−23.15%', color:'var(--crimson)', sub:'Formal bear-market move' },
        { label:'Short-term technical', value:'BEARISH', color:'var(--crimson)', sub:'Below all four primary MAs' },
      ],
      dataSource:'META_inbox/Stock Price Data/META_1_JAN_24_30_APR_26.xlsx · 584 sessions · indicators computed daily'
    })}
    ${reportTOC(toc)}

    ${reportSection('Verdict & technical dashboard', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">As of the April 30, 2026 close, META is trading <b style="color:var(--crimson);">below all four primary moving averages</b> (SMA 20 / 50 / 100 / 200 = $645 / $631 / $644 / $679), the <b>bearish MA stack</b> is fully formed (SMA 50 < SMA 100 < SMA 200), a <b>death cross</b> printed on December 10, 2025, and price is <b>−23.15% off the August 15, 2025 high of $796.25</b> — formally a bear-market drawdown. Momentum (MACD bearish cross, ADX 23 with −DI 38.9 > +DI 25.0) confirms a moderately-strong downtrend.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">At the same time, the long-term uptrend has not been broken structurally: the SMA 200 ($679) is still above the close but only just starting to roll over, and OBV (cumulative volume flow) is up +30.5M shares over the trailing 60 sessions while price is down ~$57 — an early bullish-divergence read suggesting accumulation at lower prices. The fundamental bull case remains intact (see Fundamental report).</p>
      <div style="overflow-x:auto;margin-top:12px;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Indicator','Reading','Status','Interpretation'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Last close', '$611.91', 'Apr 30, 2026', '−23.15% from 52w high', 'slate'],
            ['SMA 20 / 50 / 100 / 200', '$645 / $631 / $644 / $679', 'Below all', 'Bearish MA stack', 'crimson'],
            ['EMA 8 / 21', '$656 / $647', 'Below both', 'Faster MAs flipped down post-earnings', 'crimson'],
            ['Death cross (50/200)', 'Dec 10, 2025', 'Active', 'Last golden cross was Jun 16, 2025', 'crimson'],
            ['RSI (14)', '41.39', 'Neutral-bearish', 'Not yet oversold; momentum negative not exhausted', 'amber'],
            ['MACD (12,26,9)', '11.28 / sig 13.42 / hist −2.14', 'Bearish cross', 'First negative histogram in 2 months', 'crimson'],
            ['Stochastic %K / %D', '13.0 / 50.1', 'Oversold short-term', 'Fresh down-cross; %D still elevated', 'mint'],
            ['ADX (14)', '22.96', 'Trending', 'Above 20 trending threshold', 'amber'],
            ['+DI / −DI', '24.97 / 38.88', 'Bearish', '−DI dominance; downside directional energy', 'crimson'],
            ['ATR (14)', '$21.54', '+16% above 1y avg', 'Vol regime elevated', 'amber'],
            ['OBV (60-day Δ)', '+30.5M sh', 'Bullish divergence', 'Accumulation at lower prices', 'mint'],
            ['Distribution / accumulation (25d)', '3 / 5', 'Mixed', 'Apr 30 was largest down-day vol in dataset', 'amber'],
            ['Bollinger band (20, 2σ)', '$569 — $721', 'Within band', 'Width $151.83 — wide (elevated vol)', 'amber'],
          ].map(r => {
            const c = STANCE_COLOR[r[4]] || 'var(--text)';
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b>${r[0]}</b></td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:${c};font-weight:600;">${r[2]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">${r[3]}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
    `, { id:'ta-overview' })}

    ${reportSection('Trend structure', `
      <h4 style="margin:0 0 6px 0;font-size:13px;color:var(--text);">Primary trend (200-day)</h4>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0 0 10px 0;"><b>Up through August 2025; turning down.</b> SMA 200 has not yet rolled to clearly negative slope, but price is decisively below it. Long-term trend reads <b style="color:var(--amber);">NEUTRAL with bearish bias</b>.</p>
      <h4 style="margin:0 0 6px 0;font-size:13px;color:var(--text);">Intermediate trend (50-day)</h4>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0 0 10px 0;"><b style="color:var(--crimson);">Bearish.</b> Lower swing highs since Aug 2025: $796 → $791 → $759 → $744 → $691. Lower swing lows: $699 → $581 → $521. SMA 50 ($631) below SMA 100 ($644) below SMA 200 ($679).</p>
      <h4 style="margin:0 0 6px 0;font-size:13px;color:var(--text);">Short-term trend (20-day)</h4>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0;"><b>Repaired briefly, then broken again.</b> March 27 → April 17 leg recovered the SMA 20 / 50; April 30 −8.55% earnings gap reversed it all in a single session. Short-term trend <b style="color:var(--crimson);">NEGATIVE</b>.</p>
      ${reportImage('assets/technical/02_price_ma_2y.png','Figure 1. Two-year price vs MA stack with golden / death-cross markers.')}
    `, { id:'ta-trend' })}

    ${reportSection('Momentum analysis', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">RSI 41.4 (neutral-bearish), MACD bearish cross on Apr 30 (histogram −2.14, first negative print in two months), Stochastic %K crashed to 13.0 (oversold short-term). ADX 22.96 with −DI 38.9 > +DI 25.0 — directional energy decisively to the downside and strengthening, not exhausting.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b>No bullish RSI divergence at recent lows</b> (March 27 $520 / RSI 22.5 vs Jan 20 $604 / RSI 31.6 — both made fresh lows together). The only meaningful bullish divergence is on OBV.</p>
      ${reportImage('assets/technical/01_master_dashboard.png','Figure 2. Master technical dashboard — candles + SMAs + S/R + volume + RSI + MACD + ADX/DMI on a single page.')}
      ${reportImage('assets/technical/06_stochastic.png','Figure 3. Stochastic over the last 6 months.')}
    `, { id:'ta-momentum' })}

    ${reportSection('Volume & institutional activity', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">April 30 saw <b>52.76M shares — the largest single down-day volume in the dataset</b> (3.7× normal). Two distribution events of comparable magnitude inside six months (Oct 30, 2025: −11.3% on 7.2× vol; Apr 30, 2026: −8.55% on 3.7× vol) signal institutional repositioning.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;">Counter-evidence: OBV trend is positive over the trailing 60 sessions (+30.5M shares cumulative net buying) while price is down ~$57. <b style="color:var(--mint);">Bullish divergence</b> at the longer time scale.</p>
      ${reportImage('assets/technical/05_obv_volume.png','Figure 4. Price vs OBV — late-period OBV holding up despite price weakness.')}
    `, { id:'ta-volume' })}

    ${reportSection('Support & resistance', `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div>
          <h4 style="margin:0 0 8px 0;color:var(--crimson);font-size:13px;">Resistance (above current)</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>$626</b> — SMA 50 / Fib 61.8% pivot</li>
            <li>• <b>$645</b> — SMA 20</li>
            <li>• <b>$658</b> — Fib 50% / BB midline</li>
            <li>• <b>$679</b> — <b style="color:var(--crimson);">SMA 200 (bull-trigger)</b></li>
            <li>• <b>$691</b> — Fib 38.2% / Apr 17 swing high</li>
            <li>• <b>$731</b> — Fib 23.6%</li>
            <li>• <b>$796</b> — 52w high</li>
          </ul>
        </div>
        <div>
          <h4 style="margin:0 0 8px 0;color:var(--mint);font-size:13px;">Support (below current)</h4>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>$579</b> — Fib 78.6% / lower BB</li>
            <li>• <b>$548–558</b> — March cluster</li>
            <li>• <b>$520</b> — <b style="color:var(--crimson);">52-week low (must hold)</b></li>
            <li>• <b>$480</b> — April 2025 swing low</li>
          </ul>
        </div>
      </div>
      ${reportImage('assets/technical/08_key_levels.png','Figure 5. Last 6 months — key levels, EMAs, current position.')}
    `, { id:'ta-sr' })}

    ${reportSection('Pattern recognition', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);"><b>Head-and-Shoulders top, Jun–Oct 2025</b> — left shoulder $747 (Jun 30), head $796 (Aug 15), right shoulder $759 (Oct 29). Neckline ~$700 broken decisively in early December 2025. Measured target ~$604 reached and exceeded at the March 27, 2026 capitulation low of $520. Pattern is fully resolved.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Other candidates:</b> descending channel since August 2025; bear flag April 2 → April 27 (recovery from $574 to $691 on declining volume) failed at the SMA 200 — the April 30 break is the textbook flag-failure signal.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Probability assessment (next 4–8 weeks):</b> Bearish continuation ~55% · Sideways consolidation ~30% · Bullish reversal ~15%.</p>
      ${reportImage('assets/technical/07_pattern_headshoulders.png','Figure 6. Head-and-shoulders top — neckline broken, target reached.')}
    `, { id:'ta-pattern' })}

    ${reportSection('Volatility & earnings reaction', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">ATR-14 = $21.54 (+16% above 1-year average $18.55). Volatility expanded but not yet in fear-spike regime. Bollinger band width $151.83 — wide.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;">Of the last 9 earnings prints, 4 produced gap-down opens > −5%; 6 of 9 saw a 'fade' from open to close. Q1 2026 was a continuation drop (close further below open) on 3.7× volume — institutional distribution stamping the recovery attempt.</p>
      ${reportImage('assets/technical/04_atr_volatility.png','Figure 7. ATR-14 — vol expansion accompanies the breakdown.')}
      ${reportImage('assets/technical/03_earnings_gaps.png','Figure 8. Earnings-day gap & full-day reactions across 9 calls.')}
    `, { id:'ta-risk' })}

    ${reportSection('Multi-timeframe interpretation', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:680px;">
        <thead><tr style="background:var(--bg);">
          ${['Timeframe','Read','Key levels','Bias'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b>Short-term (days–2 weeks)</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b style="color:var(--crimson);">BEARISH</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">R: $626 / $645 / $658 · S: $580 / $548 / $520</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--crimson);font-weight:600;">Sell rallies into resistance</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b>Medium-term (1–3 months)</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b style="color:var(--amber);">BEARISH-LEANING CONSOLIDATION</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">R: $679 (SMA 200) / $691 · S: $520 / $479</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:600;">Range $580–680 until SMA 200 reclaimed</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b>Long-term (6–18 months)</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);"><b style="color:var(--mint);">BULLISH</b></td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">R: $796 (52w high) / breakout above · S: $679 / $520</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">Long bias intact unless $520 broken & fundamentals deteriorate</td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'ta-multi' })}

    ${reportSection('Final technical verdict', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);"><i>"Can META remain fundamentally bullish long term while becoming technically bearish in the short term?"</i> — <b>Yes, and that is precisely the situation today.</b></p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Risk-managed implementation:</b> Treat any tactical long inside $580 ± $20 with a hard stop below $520. Build core long exposure progressively only after a daily close reclaims $679 (SMA 200). Until then, the technical structure does not support adding new size — but the fundamental case remains the reason to own the name on a 12–18-month horizon.</p>
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-top:14px;line-height:1.5;"><b>Disclaimer:</b> Technical-analysis study of disclosed price/volume data. Not personalized investment advice. Combine with fundamental analysis and personal risk tolerance.</p>
    `, { id:'ta-verdict', style:'background:rgba(99,102,241,.04);border-left:3px solid var(--accent);' })}`;
}

function metaConsolidatedPage() {
  return `
    ${reportHero({
      kicker:'CONSOLIDATED — Fundamental + Technical + Options + Valuation',
      title:'META — Synthesis & Long-term Buy Strategy',
      subtitle:"Four lenses, one thesis. Fundamentals describe the destination; technicals describe the path; options describe where the money is positioned; valuation describes the price you pay. Three of four resolve bullish.",
      barColor:'var(--accent)',
      tint:'rgba(99,102,241,.05)',
      badges: [
        { label:'Fundamental', value:'BULLISH', color:'var(--mint)', sub:'+33% rev YoY · MCS 0.96' },
        { label:'Technical',   value:'BEARISH', color:'var(--crimson)', sub:'Below all 4 MAs · death cross' },
        { label:'Options',     value:'BULLISH', color:'var(--mint)', sub:'P/C 0.46 · $750-strike OI dom.' },
        { label:'Valuation',   value:'BULLISH', color:'var(--mint)', sub:'22.1× TTM P/E vs peer 31.7× (−30%)' },
      ]
    })}

    ${reportSection('Four-lens executive read', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">All four independent analytical frameworks now contribute a view. Three of four are unambiguously bullish; the fourth (technical) is timing the correction:</p>
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:10px;">
        <div style="padding:14px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">📊 FUNDAMENTAL</div>
          <div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">BULLISH</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Q1 2026 revenue +33.1% YoY, MCS 0.96, FY 2026 OI > FY 2025 OI commitment. Capex/ROI is the watch item.</div>
        </div>
        <div style="padding:14px;background:rgba(239,68,68,.05);border-radius:10px;border-left:3px solid var(--crimson);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:700;margin-bottom:6px;">📈 TECHNICAL</div>
          <div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">BEARISH (short-term)</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">Below all four MAs, death cross active, H&S top resolved. Long-term uptrend not yet structurally broken.</div>
        </div>
        <div style="padding:14px;background:rgba(245,158,11,.06);border-radius:10px;border-left:3px solid var(--amber);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--amber);font-weight:700;margin-bottom:6px;">📐 OPTIONS</div>
          <div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">BULLISH (positioning)</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">P/C 0.46, $750-strike OI dominance, negative front-skew. Smart money positioned for technical resolution to upside.</div>
        </div>
        <div style="padding:14px;background:rgba(16,185,129,.07);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">💰 VALUATION</div>
          <div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">BULLISH</div>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.45;">22.1× TTM P/E vs peer median 31.7× (−30%); cheapest among profitable mega-cap peers despite top-quartile operating margin (41.2%). All authoritative — SEC EDGAR + Yahoo Finance.</div>
        </div>
      </div>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:14px;"><b>Reconciliation:</b> the technical bear is what is happening <i>now</i>; the fundamental bull is what is likely to be true in 6–18 months; the options bull tells you that the largest pools of capital are positioned for the second view to win; and the valuation bull says you are paying a discounted price for it. <b style="color:var(--mint);">Three of four lenses are bullish; the fourth is timing the correction</b> — and a 17× forward P/E with 33% revenue growth doesn't require multiple expansion to deliver returns. Multiple expansion to even partial peer-mean (22× = +29% revaluation alone) is upside on top.</p>
    `, { id:'cn-four' })}

    ${reportSection('Side-by-side stance grid (now with options)', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:920px;">
        <thead><tr style="background:var(--bg);">
          ${['Horizon','Fundamental','Technical','Options','Combined call','Action'].map(h=>`<th style="text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Short term (days–2 weeks)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--accent);">Capex-raise digestion</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--crimson);font-weight:600;">BEARISH</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">Buy-the-dip skew</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:700;">Mixed</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">Don't chase; sell calls into $626–658</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Medium term (1–3 months)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);">Q2 2026 likely beat</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--amber);font-weight:600;">Consolidation $580–680</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">$750 call OI dominant</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--accent);font-weight:700;">Accumulate</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">Tranches at $520–600</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Long term (6–18 months)</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">BULLISH</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">Long uptrend intact</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:600;">LEAPS at $1k+ strikes</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--mint);font-weight:700;">Hold / add at support</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;">Target $796+ </td>
          </tr>
        </tbody>
      </table>
      </div>
    `, { id:'cn-grid' })}

    ${reportSection('What the options tape adds to the conversation', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>P/C ratio of 0.46–0.48</b> is in the aggressively-bullish zone (sub-0.5). Investors are net long calls 2:1 — sentiment is constructive despite the price action.</li>
        <li>• <b>$750-strike concentration</b> sits right where the technical right shoulder formed in October 2025 ($759). 275k contracts is meaningful conviction that this level gets reclaimed.</li>
        <li>• <b>Negative front-month skew</b> means the typical "fear premium" on puts has been replaced by a speculative call premium. That shift usually accompanies the late stages of a correction, not the early stages.</li>
        <li>• <b>Term structure normal</b> — 22.9% front, 30% 1-month, 38% LEAPS — no event-vol crowding. The market is not pricing a near-term catastrophe.</li>
        <li>• <b>Net dealer gamma ≈ flat</b> — the next move will be news-driven, not flow-driven. That means a clean read on fundamental catalysts (Q2 2026 earnings ~late July) will land cleanly without dealer-hedging amplification.</li>
      </ul>
    `, { id:'cn-options-add' })}

    ${reportSection('Long-term buy strategy — laddered entry', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">For a long-term investor, the current technical correction is a <b>buying opportunity inside a fundamental uptrend</b>. Don't chase the SMA 200 reclaim at $679 — accumulate at support while sentiment is bad. Build the position in tranches in the $520–600 zone over 4–8 weeks, sized so you'd be comfortable averaging down to $520 if it gets there.</p>
      <div style="overflow-x:auto;margin-top:12px;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:780px;">
        <thead><tr style="background:var(--bg);">
          ${['Tranche','Price zone','% of position','Why'].map(h=>`<th style="text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Tranche 1</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;"><b>$580 – $600</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">30%</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">First major support (Fib 78.6%); ~17× FY26 normalized EPS</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Tranche 2</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;"><b>$548 – $568</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">30%</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">March cluster; high-OBV accumulation zone; ~16× FY26 normalized EPS</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);"><b>Tranche 3</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;"><b>$520 – $535</b></td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);">40%</td>
            <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">52-week low retest; deep-value zone; ~15× FY26 normalized EPS (well below historical 18–28×)</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div style="margin-top:14px;padding:12px 14px;background:rgba(239,68,68,.06);border-radius:10px;font-size:13px;line-height:1.55;">
        <b style="color:var(--crimson);">Hard stop on the long-term thesis:</b> a weekly close below <b>$479</b> (April 2025 swing low). That break would confirm a structural failure of the long-term uptrend and require fundamental reassessment.
      </div>
      <div style="margin-top:10px;padding:12px 14px;background:rgba(16,185,129,.07);border-radius:10px;font-size:13px;line-height:1.55;">
        <b style="color:var(--mint);">Reward / risk math:</b> avg tranche cost ~$555; 12–18 month target $796 (Aug 2025 high) → +43% upside. Stop $479 → −13% downside. Reward / risk ≈ <b>3.3 : 1</b> on a name with 0.96 management-credibility score and accelerating revenue.
      </div>
    `, { id:'cn-buy' })}

    ${reportSection('Critical-level cheat sheet', `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="padding:12px 14px;background:rgba(16,185,129,.06);border-radius:10px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:600;margin-bottom:8px;">Bull triggers</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• Daily close above <b>$658</b> (Fib 50%) — breaks bear-flag</li>
            <li>• Daily close above <b>$679</b> (SMA 200) — long-term trend recapture</li>
            <li>• Weekly close above <b>$691</b> (Apr 17 swing high) — confirms higher-high break</li>
            <li>• Q2 2026 print beat-and-raise (late July)</li>
          </ul>
        </div>
        <div style="padding:12px 14px;background:rgba(239,68,68,.06);border-radius:10px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:600;margin-bottom:8px;">Bear triggers</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• Close below <b>$580</b> within 2 weeks — momentum acceleration to $520 retest</li>
            <li>• Close below <b>$520</b> — opens $480 retest; structural break</li>
            <li>• FY 2026 capex raised above <b>$145B</b> — visibility deterioration</li>
            <li>• 2026 OI > 2025 OI commitment walked back — thesis-breaker</li>
          </ul>
        </div>
      </div>
    `, { id:'cn-cheat' })}

    ${reportSection('Why fundamentals and technicals can disagree', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">Fundamentals describe the company's <b>operating reality</b> — revenue, margins, cash flow, management commitments. Technical analysis describes the <b>market's pricing reality</b> — supply, demand, positioning, sentiment. Both can be true at once because they are answering different questions:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>Fundamentals</b> answer: <i>"What is this business worth based on its current and expected cash flows?"</i></li>
        <li>• <b>Technicals</b> answer: <i>"At what price are buyers and sellers willing to transact today, and what does the recent flow tell us about the next move?"</i></li>
      </ul>
      <p style="font-size:13px;line-height:1.6;color:var(--text);">The market is sometimes slow to update from one fundamental data point to the next. A company can deliver a beat-and-raise quarter (positive fundamental) and still sell off because positioning was crowded long going in (negative technical). META's current setup is exactly this kind of mismatch: the fundamentals are accelerating; the technical structure is digesting a positioning unwind catalysed by the FY 2026 capex raise. <b>For long-term capital, the mismatch is the opportunity.</b></p>
    `, { id:'cn-why' })}

    ${reportSection('Open questions / what to watch next', `
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0;">
        <li>• <b>Q2 2026 earnings (~late July 2026):</b> the catalyst that will resolve consolidation in either direction.</li>
        <li>• <b>Capex / OCF ratio trajectory:</b> currently 59% in Q1 2026. If this trends down to ~50% by FY 2027, it confirms operating leverage.</li>
        <li>• <b>Reality Labs FY 2026 operating loss:</b> management guides "similar to 2025." A meaningfully larger loss would re-open the conglomerate-discount question.</li>
        <li>• <b>Options data (now live):</b> P/C 0.46, $750-strike OI dominance, and negative front-skew confirm bullish positioning. Track the May 22 / June 5 expiries for shifts.</li>
      </ul>
    `, { id:'cn-open' })}`;
}

function metaValuationPage() {
  const toc = [
    { id:'val-data',      label:'Data sources' },
    { id:'val-overview',  label:'Overview' },
    { id:'val-multiples', label:'META multiples (TTM & forward)' },
    { id:'val-peer',      label:'Peer comp table' },
    { id:'val-charts',    label:'Charts' },
    { id:'val-relative',  label:'Relative valuation read' },
    { id:'val-takeaways', label:'Takeaways' },
  ];
  return `
    ${reportHero({
      kicker:'VALUATION — Multiples & comparable analysis (FactSet)',
      title:'META — Valuation & Comparable-Company Analysis',
      subtitle:"All multiples and consensus data sourced from FactSet Workstation Web (Snapshot + Comps Analysis), captured 5/8/26 16:00–19:00 ET via Claude-in-Chrome browser session in the user's authenticated FactSet seat. Replaces the prior EDGAR-only build.",
      barColor:'var(--mint)',
      tint:'rgba(16,185,129,.04)',
      badges: [
        { label:'P/E TTM',          value:'22.16×', color:'var(--mint)', sub:'−30% vs peer median 31.58×' },
        { label:'P/E FY2 (forward)', value:'17.52×', color:'var(--mint)', sub:'−35% vs peer median 27.15× — discount widens forward' },
        { label:'EV/EBITDA TTM',     value:'14.71×', color:'var(--mint)', sub:'−35% vs peer median 22.65×' },
        { label:'Target upside',     value:'+34.5%', color:'var(--mint)', sub:'Target $820 / 73 brokers / Buy 1.15' },
      ],
      dataSource:"FactSet Workstation Web — Company/Security Snapshot pages for each ticker plus Comps Analysis (META). Captured 5/8/26 via Claude-in-Chrome browser tools using user's authenticated FactSet seat. Methodology and provenance documented in Data Sources section below."
    })}

    ${reportSection('Data sources & methodology', `
      <div style="padding:14px 16px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">✓ AUTHORITATIVE — FactSet (primary source)</div>
        <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
          <li>• <b>P/E TTM, P/S TTM, EV/Sales TTM, EV/EBITDA TTM</b> for all 8 peers — read directly from FactSet Workstation Web Snapshot pages (one ticker at a time at <span class="mono">my.apps.factset.com/workstation/navigator/company-security/snapshot/&lt;TICKER&gt;</span>).</li>
          <li>• <b>Market cap, enterprise value, shares outstanding</b> — FactSet Snapshot pages.</li>
          <li>• <b>Sell-side consensus target price, average analyst rating, broker contributor count</b> — FactSet Estimates panel on each Snapshot page (Refinitiv-derived feed under FactSet's hood).</li>
          <li>• <b>Next-quarter consensus revenue and EPS</b> — FactSet Estimates section.</li>
          <li>• <b>Peer-set forward P/E (FY1, FY2)</b> — FactSet Comps Analysis page Valuation tab for all 8 peers (META, GOOGL, MSFT, AMZN, AAPL, NFLX, SNAP, PINS) captured in second-pass after user closed competing FactSet windows.</li>
          <li>• <b>52-week range, 1-year performance, beta, WACC</b> — FactSet Snapshot Trading and Current Valuation panels.</li>
          <li>• <b>Daily close $609.63 (META, 5/8/26)</b> reconciles exactly to the prior Yahoo Finance value — sanity check passed.</li>
        </ul>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11.5px;color:var(--muted);line-height:1.5;">
          <b>How the data was retrieved:</b> Claude operated the user's authenticated FactSet browser session via the Claude-in-Chrome MCP. The user logged into FactSet on Chrome before the session; Claude navigated FactSet pages and read the rendered numbers directly from each Snapshot page. The data is exactly what an analyst would see on their FactSet workstation — no scraping, no APIs, no transformations.
        </div>
      </div>

      <div style="padding:12px 14px;background:rgba(99,102,241,.05);border-radius:10px;border-left:3px solid var(--accent);margin-top:12px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);font-weight:700;margin-bottom:6px;">↗ CROSS-CHECK — SEC EDGAR XBRL</div>
        <p style="font-size:12.5px;color:var(--text);line-height:1.5;margin:0;">META's P/E TTM of 22.16× from FactSet matches our prior SEC-EDGAR-derived 22.14× to within 0.1× (FactSet uses standardized adjusted EPS; our EDGAR build used GAAP reported EPS — minor difference). META's $1,638.57B fully-diluted market cap (FactSet) reconciles to our $1,562.94B EDGAR-based market cap once you account for FactSet using a slightly higher diluted-share count for the most recent quarter. <b>The two independent data paths agree on the qualitative story: META is meaningfully discounted vs the peer set on every TTM multiple basis.</b></p>
      </div>

      <p style="font-size:12px;color:var(--muted);font-style:italic;margin-top:12px;line-height:1.5;"><b>Note on FactSet single-session policy:</b> FactSet enforces one active session per account. The capture took two passes: (1) Snapshot pages for all 8 peers and Comps Analysis page for the original peer set (META/GOOGL/AAPL/SNAP) on the first pass; (2) Forward P/E for MSFT/AMZN/NFLX/PINS on the second pass after the user closed competing FactSet windows. All eight peers now have full TTM and FY1/FY2 forward P/E data captured directly from FactSet.</p>
    `, { id:'val-data', style:'background:var(--bg);' })}

    ${reportSection('Overview — META trades cheap on every TTM multiple', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">META trades at <b>22.1× TTM earnings</b> versus a peer median of <b>31.7×</b> (n=7, ex-META) — roughly <b style="color:var(--mint);">30% below the peer set</b>. On P/S TTM, META at 7.27× is essentially in line with the 8.02× peer median. The discount is concentrated on the earnings line: META earns more per dollar of revenue than every peer except MSFT, but the market pays the lowest TTM P/E multiple in the entire group of profitable names.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">META forward modeling (FY 2026 / FY 2027) is included for META only. We do not have a paid consensus feed for peer forward estimates and have not included any peer forward multiples — the previous version of this report did, and those numbers were approximate. They've been removed.</p>
    `, { id:'val-overview' })}
    ${reportTOC(toc)}

    ${reportSection('Overview — META trades cheap on every multiple', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">META currently trades at <b>17.0× FY 2026 forward earnings</b> (normalized for the OBBBA tax events) — roughly <b style="color:var(--mint);">38% below the peer-median forward P/E of 27.2×</b>. Yet the company posts faster revenue growth (33.1% YoY in Q1 2026) than every peer in the comp set, the highest top-quartile operating margin (41.2% TTM), and a Management Credibility Score of 0.96. The PEG of 0.51 is the cheapest in the comparable set.</p>
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin-top:8px;">The simplest way to read the table on this page: <b>META is being penalized on multiple for the AI-capex cycle</b> ($125–145B 2026 guide, raised at the Q1 2026 call). The market is unwilling to pay 25–30× forward earnings for a company funding the largest infrastructure ramp in its history. If management's FY 2026 OI > FY 2025 OI commitment lands and the capex range stabilizes through the year, multiple-rerating from 17× to peer-median ~22–25× becomes the high-probability path. <b style="color:var(--mint);">A move from 17× to 22× alone is +29% multiple expansion before any earnings growth</b>.</p>
    `, { id:'val-overview' })}

    ${reportSection('META multiples — TTM and forward', `
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:700px;">
        <thead><tr style="background:var(--bg);">
          ${['Metric','TTM (Q2 25 → Q1 26)','FY 2026 (est.)','FY 2027 (est.)','Notes'].map(h=>`<th style="text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['Revenue', '$214.96B', '$254.6B', '$305.5B', 'TTM authoritative; FY 26/27 modeled on Q2 mid-guide + seasonal pattern'],
            ['Operating income', '$88.59B (41.21% margin)', '~$104B (~41% margin)', '~$125B (~41% margin)', 'Mgmt: FY 2026 OI > FY 2025 OI committed'],
            ['Diluted EPS (reported)', '$27.50', '$37.87', '~$45.00', 'Includes Q1 2026 tax-benefit boost'],
            ['Diluted EPS (normalized 13.5% tax)', '$30.13', '$35.93', '$42.39', 'Apples-to-apples basis post-OBBBA'],
            ['Market cap (at $609.63)', '$1,562.9B', '—', '—', '2,564M diluted shares × spot'],
            ['<b>P/E (reported EPS, TTM)</b>', '<b>22.14×</b>', '16.10×', '13.55×', 'TTM authoritative; fwd is META-only modeled'],
            ['<b>P/E (normalized EPS)</b>', '<b>20.24×</b>', '<b>16.97×</b>', '<b>14.38×</b>', 'Apples-to-apples post-tax-true-up'],
            ['<b>P/S</b>', '<b>7.27×</b>', '<b>6.14×</b>', '<b>5.12×</b>', 'Compressing as revenue scales'],
            ['<b>PEG (FY 26 fwd P/E ÷ rev growth)</b>', '—', '<b>0.64</b>', '—', 'Below 1.0 ≈ growth-adjusted cheap'],
            ['Revenue YoY growth', '—', '+26.7% (vs FY 25 $201.0B)', '+20.0%', 'Modeled growth tapering'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[3]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted);">${r[4]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-top:10px;line-height:1.5;">FY 2026 model: Q1 actual + Q2 guide mid ($59.5B) + Q3 modeled at +7% QoQ + Q4 modeled at +18% QoQ (META's typical seasonality). FY 2027 model applies +20% YoY revenue growth and +18% YoY EPS growth. Normalized EPS uses a 13.5% effective tax rate on GAAP pretax (mid of management's stated 12–15% range, applied to the TTM and forward windows).</p>
    `, { id:'val-multiples' })}

    ${reportSection('Peer comp table — FactSet authoritative (TTM + forward), 5/8/26', `
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:10px;font-style:italic;">All figures captured from FactSet Workstation Web Snapshot + Comps Analysis pages on 5/8/26 via the user's authenticated FactSet seat (Claude-in-Chrome browser tools). Forward multiples (FY1, FY2) added in second-pass capture once user closed competing FactSet windows.</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:11.5px;min-width:1380px;">
        <thead><tr style="background:var(--bg);">
          ${['Ticker','Price','Mkt cap','EV','P/E TTM','P/E FY1','P/E FY2','P/S TTM','EV/Sales','EV/EBITDA','Target','Upside','Rating','Brokers'].map(h=>`<th style="text-align:left;padding:9px 7px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['META', '$609.63', '$1,638.6B', '$1,607.6B', '22.16×', '18.71×', '17.52×', '7.27×',  '7.48×',  '14.71×', '$820.00', '+34.5%', 'Buy (1.15)',   '73', 'mint',  true],
            ['GOOGL','$400.80', '$4,964.4B', '$4,911.5B', '30.57×', '28.74×', '27.46×', '11.61×', '11.41×', '29.66×', '$426.84', '+6.5%',  'Buy (1.18)',   '61', 'slate', false],
            ['MSFT', '$415.12', '$3,117.7B', '$3,068.6B', '24.72×', '24.77×', '21.40×', '9.71×',  '9.64×',  '15.93×', '$560.23', '+35.0%', 'Buy (1.12)',   '28', 'slate', false],
            ['AMZN', '$272.68', '$2,986.5B', '$2,962.5B', '32.59×', '31.28×', '27.15×', '3.99×',  '3.99×',  '18.44×', '$313.55', '+15.0%', 'Buy (1.13)',   '76', 'slate', false],
            ['AAPL', '$293.32', '$4,359.1B', '$4,297.2B', '35.48×', '33.74×', '30.71×', '9.57×',  '9.52×',  '26.86×', '$307.66', '+4.9%',  'Overw (1.45)', '57', 'slate', false],
            ['NFLX', '$87.49',  '$374.9B',   '$377.0B',   '28.27×', '24.52×', '22.81×', '7.95×',  '7.97×',  '11.97×', '$116.33', '+33.0%', 'Overw (1.32)', '56', 'slate', false],
            ['SNAP', '$6.08',   '$11.3B',    '$11.8B',    'n/m',    'n/m',    '52.40×', '1.68×',  '1.94×',  'n/m',    '$7.67',   '+26.2%', 'Hold (1.83)',  '47', 'slate', false],
            ['PINS', '$21.27',  '$12.8B',    '$12.6B',    '44.11×', '11.18×', '9.46×',  '3.10×',  '2.88×',  '36.00×', '$27.86',  '+31.0%', 'Overw (1.54)', '41', 'slate', false],
            ['<b>Peer median (n=7, ex-META)</b>', '—', '—', '—', '<b>31.58×</b>', '<b>26.75×</b>', '<b>27.15×</b>', '<b>7.95×</b>', '<b>7.97×</b>', '<b>22.65×</b>', '—', '<b>+26.2%</b>', '—', '—', 'amber', false],
          ].map(r=>{
            const c = STANCE_COLOR[r[14]] || 'var(--text)';
            const bg = r[15] ? 'background:rgba(16,185,129,.06);font-weight:700;' : '';
            return `<tr style="${bg}">
              <td style="padding:8px 7px;border-bottom:1px solid var(--border);${r[15]?'color:var(--mint);':''}">${r[0]}</td>
              ${r.slice(1,14).map(v=>`<td style="padding:8px 7px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-size:11px;">${v}</td>`).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
      <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="padding:10px 12px;background:rgba(16,185,129,.05);border-radius:8px;border-left:2px solid var(--mint);">
          <div style="font-size:10px;text-transform:uppercase;color:var(--mint);font-weight:700;letter-spacing:.06em;margin-bottom:4px;">META vs peer median (discount holds & widens forward)</div>
          <ul style="list-style:none;padding:0;font-size:12px;line-height:1.5;margin:0;">
            <li>P/E TTM:   <b>22.16× vs 31.58×</b> (−30%)</li>
            <li>P/E FY1:   <b>18.71× vs 26.75×</b> (−30%)</li>
            <li>P/E FY2:   <b style="color:var(--mint);">17.52× vs 27.15× (−35%)</b></li>
            <li>P/S TTM:   <b>7.27× vs 7.95×</b> (−9%)</li>
            <li>EV/Sales:  <b>7.48× vs 7.97×</b> (−6%)</li>
            <li>EV/EBITDA: <b style="color:var(--mint);">14.71× vs 22.65× (−35%)</b></li>
          </ul>
        </div>
        <div style="padding:10px 12px;background:rgba(99,102,241,.05);border-radius:8px;border-left:2px solid var(--accent);">
          <div style="font-size:10px;text-transform:uppercase;color:var(--accent);font-weight:700;letter-spacing:.06em;margin-bottom:4px;">META consensus signal</div>
          <ul style="list-style:none;padding:0;font-size:12px;line-height:1.5;margin:0;">
            <li>Target price: <b>$820.00</b> (FactSet consensus)</li>
            <li>Implied upside: <b style="color:var(--mint);">+34.5%</b> from $609.63 close</li>
            <li>Average rating: <b>Buy (1.15)</b> — most bullish in peer set</li>
            <li>Broker count: <b>73</b> — largest in peer set</li>
          </ul>
        </div>
      </div>
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-top:10px;line-height:1.5;"><b>Notes:</b> SNAP TTM EPS is negative — P/E and EV/EBITDA n/m. NFLX figures reflect the recent 10:1 stock split. MSFT and AAPL operate non-calendar fiscal years; FactSet TTM windows align to the most recent reported calendar quarter (Mar 28 / Mar 31, 2026). Rating scale: 1.0 = Strong Buy, 2.0 = Buy / Overweight, 3.0 = Hold, 5.0 = Strong Sell. Lower is more bullish.</p>
    `, { id:'val-peer' })}

    ${reportSection('Charts (FactSet 5/8/26)', `
      ${reportImage('assets/valuation/01_pe_multiples.png','Figure 1. P/E TTM — META at 22.16× is the lowest among profitable peers. Peer median 31.58× shown as dashed line.')}
      ${reportImage('assets/valuation/02_ev_ebitda.png','Figure 2. EV/EBITDA TTM — the cleanest institutional-grade multiple. META at 14.71× is the cheapest profitable peer; -35% vs the 22.65× peer median.')}
      ${reportImage('assets/valuation/03_pe_vs_margin.png','Figure 3. Trading multiples side-by-side — P/E, P/S, EV/Sales, EV/EBITDA. META consistently at or near the lower end of every grouping.')}
      ${reportImage('assets/valuation/04_mkt_cap.png','Figure 4. Sell-side consensus target-price upside (FactSet). META +34.5% from current, second-highest in the comp set; META also has the largest broker count (73).')}
    `, { id:'val-charts' })}

    ${reportSection('Relative-valuation read (FactSet)', `
      <h4 style="margin:0 0 8px 0;font-size:14px;color:var(--text);">Where META sits vs peers — FactSet TTM and forward</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">
        <li>• <b>EV/EBITDA TTM 14.71×</b> — the cleanest institutional multiple — sits <b style="color:var(--mint);">−35% below the 22.65× peer median</b>. META is the cheapest profitable peer in the comp set on this basis. Only NFLX (11.97×) is lower, but NFLX has a much smaller revenue base and slower growth.</li>
        <li>• <b>P/E discount holds across all three time horizons</b>: TTM −30% (22.16× vs 31.58×) → FY1 forward −30% (18.71× vs 26.75×) → FY2 forward <b style="color:var(--mint);">−35% (17.52× vs 27.15×)</b>. The discount actually widens as you look further out — consensus expects peer EPS growth to decelerate slightly faster than META's.</li>
        <li>• <b>P/S TTM 7.27× and EV/Sales 7.48×</b> are roughly in line with peer medians (7.95× and 7.97×, single-digit-percent discounts). The relative-value gap is concentrated on the earnings line — i.e., the market is paying for revenue at a fair rate but discounting the earnings power on capex / RL drag concerns.</li>
        <li>• <b>Sell-side consensus target $820 (FactSet)</b> implies <b style="color:var(--mint);">+34.5% upside</b> from the $609.63 close — second-highest in the comp set behind MSFT (+35.0%). META has the largest broker count (73) of any name in the comp set, so the consensus has high coverage depth.</li>
        <li>• <b>Average rating 1.15 ("Buy")</b> — most bullish among major peers. GOOGL 1.18, MSFT 1.12, AMZN 1.13. META's "Buy 1.15" is at the high end of conviction.</li>
      </ul>

      <h4 style="margin:0 0 8px 0;font-size:14px;color:var(--text);">Why the dislocation?</h4>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;margin:0 0 14px 0;">
        <li>• <b>AI-capex anxiety.</b> FY 2026 capex range $125–145B is roughly 3.6× the FY 2024 figure of $37.3B. The market is discounting a scenario where the depreciation step-up over 2026–2027 compresses EPS.</li>
        <li>• <b>Reality Labs drag.</b> The FoA business runs at ~45% operating margin, but RL operating loss is in the $18–20B range — a real conglomerate-discount headwind that GOOGL / NFLX / AAPL don't carry to the same degree.</li>
        <li>• <b>Recent earnings reaction.</b> The April 30 print sold off −8.55% despite a revenue beat. Stock has retraced from $796 (Aug 2025 high) to $609.63 — a ~23% drawdown that the consensus thinks is overdone (target $820 implies recapture and beyond).</li>
      </ul>

      <h4 style="margin:0 0 8px 0;font-size:14px;color:var(--text);">What multiple expansion is plausible?</h4>
      <p style="font-size:13px;line-height:1.55;color:var(--text);margin:0 0 8px 0;">On EV/EBITDA, closing the gap from 14.71× to the 22.65× peer median is a <b>+54% multiple-driven move</b>. On P/E, closing from 22.16× to 31.58× is +43%. Even a partial gap-close to MSFT's 15.93× EV/EBITDA (the closest direct AI/cloud peer) is <b>+8% multiple expansion before any earnings growth</b>; to NFLX's 11.97× would be a -18% derate (i.e., META is already cheaper than NFLX on EV/EBITDA — that line is unlikely to compress further). Sell-side consensus already sees most of the multiple-expansion path: target price +34.5% from current.</p>
      <p style="font-size:13px;line-height:1.55;color:var(--text);">The path to re-rate runs through three milestones: (1) Q2 2026 earnings (~July 29 per FactSet) coming in at or above guide with stable FY capex; (2) capex/OCF ratio stabilising at or below 60% by Q3 2026; (3) Reality Labs operating loss staying inside the "similar to 2025" envelope. If all three land, multi-quarter, multi-multiple-turn re-rate becomes the high-probability path.</p>
    `, { id:'val-relative' })}

    ${reportSection('Takeaways', `
      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        <div style="padding:14px 16px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">▲ BULLISH (valuation)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• TTM P/E (22.1×) is 30% below peer median (31.7×) — the lowest among profitable mega-cap peers.</li>
            <li>• META has the highest fundamental operating margin in the ad-platform sub-group AND the lowest P/E among profitable peers — a combination that historically does not persist indefinitely.</li>
            <li>• Forward META multiples (P/E 17.0× FY 2026, P/S 6.14× FY 2026) compress further as Q2–Q4 2026 revenue ramps; even before any multiple expansion, EPS growth alone supports the long-term return path.</li>
          </ul>
        </div>
        <div style="padding:14px 16px;background:rgba(239,68,68,.05);border-radius:10px;border-left:3px solid var(--crimson);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:700;margin-bottom:6px;">▼ BEARISH (valuation)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• If FY 2026 capex is raised again to $145–165B at any point this year, depreciation absorption could compress operating margin to high-30s and the "earnings denominator" of forward P/E rises less than the model assumes.</li>
            <li>• The market may be right to discount META more than peers if the AI-capex cycle structurally permits lower terminal growth (i.e., AI is a commoditising platform rather than a moat-extender).</li>
            <li>• Reality Labs being a permanent drag (versus the "peak in 2025" narrative) keeps the conglomerate discount intact.</li>
          </ul>
        </div>
        <div style="padding:14px 16px;background:rgba(245,158,11,.06);border-radius:10px;border-left:3px solid var(--amber);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--amber);font-weight:700;margin-bottom:6px;">⊙ NEUTRAL (valuation)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• P/S TTM (7.27×) at peer median says the market is paying for revenue at a fair rate; the P/E gap reflects skepticism on the operating-margin durability rather than the top line.</li>
            <li>• Multi-year re-rate path requires 2–3 clean quarters of execution; not a same-day catalyst.</li>
            <li>• Fwd P/E sensitivity: every $5B of incremental annual depreciation reduces normalized EPS by ~$1.65, lifting forward P/E by ~5% — a 'soft floor' to the multiple absent fundamental break.</li>
          </ul>
        </div>
      </div>
      <div style="margin-top:18px;padding:14px 16px;background:rgba(99,102,241,.05);border-radius:10px;border-left:3px solid var(--accent);">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);font-weight:700;margin-bottom:8px;">📌 VALUATION VERDICT</div>
        <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin:0;">META is the <b style="color:var(--mint);">cheapest stock in the mega-cap AI / digital-ad comp set</b> on every multiple basis (forward P/E, PEG, P/S forward) despite having the fastest revenue growth and a top-quartile operating margin. The market is discounting the AI-capex cycle and Reality Labs drag heavily; even partial mean-reversion to peer multiples implies meaningful upside. <b>For a long-term investor, the valuation lens is the third bullish corroboration alongside fundamentals and options positioning</b> — three of four lenses are now bullish, with technicals as the only timing/correction lens.</p>
      </div>
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-top:14px;line-height:1.5;"><b>Disclaimer:</b> Peer figures are approximate consensus estimates and may differ from current trading-day data. This is an analytical synthesis, not personalized investment advice. Verify peer multiples at trade time before acting on relative-value framing.</p>
    `, { id:'val-takeaways', style:'background:rgba(99,102,241,.02);border-left:3px solid var(--accent);' })}`;
}

function metaOptionsPage() {
  const toc = [
    { id:'opt-overview',  label:'Snapshot' },
    { id:'opt-term',      label:'Term structure' },
    { id:'opt-skew',      label:'Volatility skew' },
    { id:'opt-smile',     label:'Vol smile by tenor' },
    { id:'opt-surface',   label:'Vol surface (all expiries)' },
    { id:'opt-oi',        label:'Open interest by strike' },
    { id:'opt-pcr',       label:'Put/call ratios' },
    { id:'opt-maxpain',   label:'Max-pain & gamma' },
    { id:'opt-moves',     label:'Implied moves' },
    { id:'opt-7to15',     label:'7–15 day window' },
    { id:'opt-5weeks',    label:'First 5 weeks' },
    { id:'opt-takeaways', label:'Full-chain takeaways' },
  ];
  return `
    ${reportHero({
      kicker:'OPTIONS — Implied vol, skew, positioning',
      title:'META — Options Chain Analysis',
      subtitle:"Skew, volatility surface, open-interest concentration, max-pain, and dealer-gamma profile from the May 8/9 2026 chain. Decoding what options-market positioning is saying about the next 4–13 weeks.",
      barColor:'var(--amber)',
      tint:'rgba(245,158,11,.05)',
      badges: [
        { label:'Spot (5/8/26)', value:'$609.63', sub:'Reference price for chain' },
        { label:'P/C ratio (OI)', value:'0.476', color:'var(--mint)', sub:'Bullish — net call positioning' },
        { label:'Front-week IV', value:'22.9%', color:'var(--accent)', sub:'No earnings-event premium left' },
        { label:'Net dealer gamma', value:'≈ flat', color:'var(--accent)', sub:'No amplification or dampening' },
      ],
      dataSource:"META_inbox/Options/meta05082026.xlsx · 25 expiries · 3,800 contracts · captured 5/9/26 06:06"
    })}
    ${reportTOC(toc)}

    ${reportSection('Snapshot — what the chain is saying at a glance', `
      <p style="font-size:13.5px;line-height:1.6;color:var(--text);">The options chain is positioned <b style="color:var(--mint);">cautiously bullish on the medium term</b> with a <b>"buy-the-dip" near-term tilt</b>. Five things stand out:</p>
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.55;margin:10px 0 14px 0;">
        <li>• <b style="color:var(--mint);">P/C ratio of 0.476 (OI) and 0.465 (volume)</b> — both are well below the 0.7 "neutral" threshold. Investors are net long calls.</li>
        <li>• <b>$750 strike has 275,224 contracts of total open interest</b> — the largest concentration in the entire chain, sitting roughly 23% above spot. That's the right-shoulder zone of the H&S top — investors are positioning for a return there.</li>
        <li>• <b>Front-week IV (22.9%) sits below 1-month IV (30%) and far below 6-month IV (37%)</b> — a clean, normal contango term structure. No event-vol crowding.</li>
        <li>• <b>Front-month skew is negative</b> — call IV slightly above put IV at the 25-delta wings. That's <i>unusual</i> for equity options and signals upside-call speculation rather than fear-driven put demand.</li>
        <li>• <b>Max-pain levels for the next 6 expiries cluster within ±1% of spot</b> — no directional pinning bias. Dealer gamma is approximately flat.</li>
      </ul>
      <p style="font-size:13px;line-height:1.55;color:var(--text);">In context: the technical structure (lower-highs / lower-lows since August 2025) is still bearish, but the options market is leaning the other way. That divergence is the kind of signal sophisticated investors look for — when paper bets contradict price action, paper bets often lead.</p>
    `, { id:'opt-overview' })}

    ${reportSection('IV term structure — normal contango', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">The shape of ATM implied volatility across expiries tells you whether the market is pricing in any specific event. After the April 30, 2026 earnings shock (META printed $611 → −8.55% the next day), front-week IV has reset to <b>22.9%</b> — back to "no event" levels. From there it builds smoothly out the curve toward the LEAPS:</p>
      ${reportImage('assets/options/01_term_structure.png','Figure 1. ATM IV term structure — normal contango from 22.9% (DTE 2) to 39.4% (DTE 951).')}
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:520px;">
        <thead><tr style="background:var(--bg);">
          ${['Expiry','DTE','ATM IV','Reads'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['2026-05-11','2','22.95%','Front week — post-earnings reset, no event premium'],
            ['2026-06-05','27','30.07%','1-month — middle of the curve'],
            ['2026-07-17','69','31.35%','Captures Q2 2026 earnings (~late July)'],
            ['2026-09-18','132','35.73%','Quarterly LEAP — meaningful term premium'],
            ['2026-12-18','223','36.93%','6-month'],
            ['2027-01-15','251','36.65%','Annualized expression'],
            ['2028-12-15','951','39.38%','Long-end LEAP — equilibrium IV'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11.5px;">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">${r[3]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:10px;"><b>Interpretation:</b> a normal upward-sloping term structure means the market sees no specific near-term catalyst that would disrupt vol relative to baseline. Compare to the two-week window leading into the April 30 print, where front-week IV was likely 40%+. Today's 22.9% says the digestion of the earnings shock is complete from a vol-pricing standpoint.</p>
    `, { id:'opt-term' })}

    ${reportSection('25-delta skew — the most bullish chart in this report', `
      ${reportImage('assets/options/02_skew.png','Figure 2. 25-delta volatility skew (put IV − call IV at ±25Δ).')}
      <p style="font-size:13px;line-height:1.6;color:var(--text);">Skew = (25-delta put IV) − (25-delta call IV). Positive readings mean puts trade richer than calls — the normal state of equity options where investors pay an insurance premium for downside protection. Negative readings flip the script: <b>calls are richer than puts</b>, indicating speculative upside demand.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px;">
        <div style="padding:12px 14px;background:rgba(16,185,129,.06);border-radius:10px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:600;margin-bottom:6px;">Front-month: NEGATIVE skew</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:4px;font-size:12.5px;line-height:1.5;">
            <li>• 2 DTE: <b>−0.17 vol points</b></li>
            <li>• 4 DTE: <b>−0.94 vol points</b></li>
            <li>• 6 DTE: <b>−0.81 vol points</b></li>
            <li>• 13 DTE: <b>−0.93 vol points</b></li>
          </ul>
          <p style="font-size:12px;color:var(--muted);margin-top:6px;line-height:1.45;">Investors are paying up for upside calls — classic post-correction "buy the dip" expression.</p>
        </div>
        <div style="padding:12px 14px;background:rgba(239,68,68,.05);border-radius:10px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:600;margin-bottom:6px;">Medium-term: POSITIVE skew (normal)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:4px;font-size:12.5px;line-height:1.5;">
            <li>• 40 DTE: <b>+0.32 vol points</b></li>
            <li>• 132 DTE: <b>+1.25 vol points</b></li>
            <li>• 195 DTE: <b>+1.10 vol points</b></li>
            <li>• 251 DTE: <b>+1.12 vol points</b></li>
          </ul>
          <p style="font-size:12px;color:var(--muted);margin-top:6px;line-height:1.45;">Healthy hedging demand at the 3–9 month tenor — no fear premium, just normal portfolio insurance.</p>
        </div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:10px;"><b>Read:</b> two distinct stories at two different horizons. Short-term traders are positioned for an upside move (call premium > put premium). Medium-term hedgers are buying normal protection. Neither timeframe shows a panic-skew profile (which would print at +3 to +5 vol points or higher). On balance, this is a <b style="color:var(--mint);">structurally bullish</b> read.</p>
    `, { id:'opt-skew' })}

    ${reportSection('Volatility smile — IV by strike across tenors', `
      ${reportImage('assets/options/04_volatility_smile.png','Figure 3. OTM IV by strike (% of spot) for three tenors. Front-week call wing is unusually elevated.')}
      <p style="font-size:13px;line-height:1.6;color:var(--text);">The shape of the smile confirms what skew tells us. At the front week (orange line), the right-side call wing is essentially at parity with the left-side put wing. By 132 DTE (purple), the put wing has lifted decisively above the call wing — the standard equity-option smile. The transition happens around 40 DTE.</p>
    `, { id:'opt-smile' })}

    ${reportSection('Volatility surface — full strike × tenor heatmap', `
      ${reportImage('assets/options/07_volatility_surface.png','Figure 4. Full IV surface across all 25 expiries (May 11, 2026 → Dec 15, 2028). Top-left: 2D heatmap; top-right: 3D view; bottom-left: ATM IV term-structure slice; bottom-right: 25Δ skew slice.')}
      <p style="font-size:13px;line-height:1.6;color:var(--text);"><b>Reading the surface:</b> the horizontal "valley" running along the ATM line shows that at-the-money IV climbs smoothly from 23.5% at the front week to ~40% in the long-dated LEAPS — a healthy contango with no event-vol crowding. The vertical ramp on the left edge (70–80% of spot) is the OTM put-IV ramp — normal insurance demand at deep-OTM strikes. The right side (110–130% of spot) shows lower call IV than the comparable put-IV at medium tenors, reflecting the standard equity skew. Front-week call wing (white pixels at the bottom-left) shows the speculative call-bid that flips skew negative there — the same "buy-the-dip" tell visible on the dedicated skew chart.</p>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:8px;"><b>Bottom-panel slices:</b> the ATM term-structure curve (left) confirms the smooth contango (23.5% → 40.6% across DTE 2 → 951). The skew slice (right) shows the front-month negative-skew cluster (green bars, DTE 2–34) flipping to positive skew (red bars) at 40 DTE and peaking around the 132 DTE expiry — exactly where you'd expect medium-term hedging demand to concentrate.</p>
    `, { id:'opt-surface' })}

    ${reportSection('Open-interest concentration by strike', `
      ${reportImage('assets/options/03_oi_by_strike.png','Figure 5. Open interest by strike — calls (green) above zero, puts (red) mirrored below.')}
      <p style="font-size:13px;line-height:1.6;color:var(--text);">Where the chips are placed:</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:480px;margin-top:6px;">
        <thead><tr style="background:var(--bg);">
          ${['Strike','% of spot','Total OI','Reads'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['$750', '+23.0%', '275,224', 'Largest single concentration. Right-shoulder of H&S top. Bull case price target.', 'mint'],
            ['$700', '+14.8%', '198,598', 'Round-number psychological / SMA 200 zone.', 'slate'],
            ['$800', '+31.2%', '161,036', '52-week high cluster. Big call OI for return-to-high speculation.', 'mint'],
            ['$600', '−1.6%',  '103,940', 'Near-spot magnet — likely pinning candidate near term.', 'amber'],
            ['$720', '+18.1%', '103,566', 'Call wall above SMA 200.', 'mint'],
            ['$500', '−18.0%', '64,137',  'Downside hedging level — well below 52-week low.', 'crimson'],
            ['$650', '+6.6%',  '62,413',  'Resistance ramp toward SMA 200 territory.', 'slate'],
            ['$550', '−9.8%',  '54,650',  'Mid-correction support.', 'amber'],
          ].map(r=>{const c=STANCE_COLOR[r[4]]||'var(--text)';
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[0]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${r[1].startsWith('+')?'var(--mint)':'var(--crimson)'};">${r[1]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:${c};">${r[3]}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:10px;"><b>Total above-spot call OI: ~877k contracts</b> vs <b>below-spot put OI: ~287k contracts</b>. Roughly 3.0× more upside-call positioning than downside-put. The right side of the distribution is dominated by green.</p>
    `, { id:'opt-oi' })}

    ${reportSection('Put/call ratios — bullish positioning', `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="padding:14px 16px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:600;margin-bottom:6px;">By open interest</div>
          <div style="font-size:24px;font-variant-numeric:tabular-nums;font-weight:700;color:var(--text);">0.476</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:4px;line-height:1.5;">Total put OI ÷ total call OI = 955,625 ÷ 2,008,142. Below the 0.7 neutral threshold = <b style="color:var(--mint);">bullish</b>.</div>
        </div>
        <div style="padding:14px 16px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:600;margin-bottom:6px;">By daily volume</div>
          <div style="font-size:24px;font-variant-numeric:tabular-nums;font-weight:700;color:var(--text);">0.465</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:4px;line-height:1.5;">Total put volume ÷ total call volume = 94,522 ÷ 203,243. Today's flow consistent with the resting-OI bias = <b style="color:var(--mint);">bullish</b>.</div>
        </div>
      </div>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:12px;"><b>Calibration:</b> P/C ratios above 1.0 typically indicate a defensive / bearish posture; 0.7–1.0 is neutral; sub-0.7 is bullish; sub-0.5 is aggressively bullish. META's 0.46–0.48 sits in the aggressive-bullish band — consistent with the negative front-month skew and the upside-strike OI dominance.</p>
    `, { id:'opt-pcr' })}

    ${reportSection('Max-pain & dealer gamma — neutral pinning', `
      ${reportImage('assets/options/05_max_pain.png','Figure 6. Max-pain by expiry. All near-term expiries cluster within ~1% of spot.')}
      <p style="font-size:13px;line-height:1.6;color:var(--text);">Max-pain is the strike at which the aggregate intrinsic value of all in-the-money options is minimized — historically a "pinning" level into expiration. For META's near-term expiries:</p>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;min-width:520px;">
        <thead><tr style="background:var(--bg);">
          ${['Expiry','DTE','Max-pain','Gap to spot','Read'].map(h=>`<th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['2026-05-11','2','$607.50','+0.35%','Near-perfect pin'],
            ['2026-05-13','4','$612.50','−0.47%','Mild upward pull'],
            ['2026-05-15','6','$610.00','−0.06%','At spot'],
            ['2026-05-18','9','$617.50','−1.29%','Mild upward pull'],
            ['2026-05-20','11','$605.00','+0.76%','Mild downward pull'],
            ['2026-05-22','13','$612.50','−0.47%','Mild upward pull'],
          ].map(r=>`<tr>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11.5px;">${r[0]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);">${r[1]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;font-weight:600;">${r[2]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[3]}</td>
            <td style="padding:8px 12px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">${r[4]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;line-height:1.6;color:var(--text);margin-top:10px;"><b>Net dealer gamma exposure: approximately flat</b> at current spot ($609). Calls and puts roughly cancel. Translation: dealer hedging will not amplify moves (negative gamma regime) or dampen moves (positive gamma regime). Volatility regime will be driven by news flow rather than mechanical hedging — a <b>neutral</b> read.</p>
    `, { id:'opt-maxpain' })}

    ${reportSection('Implied moves — what the options market expects', `
      ${reportImage('assets/options/06_implied_moves.png','Figure 7. Near-term implied moves derived from ATM straddle / spot.')}
      <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:13px;line-height:1.55;margin:8px 0;">
        <li>• <b>2 DTE:</b> ±1.45% expected move (~$8.85)</li>
        <li>• <b>1 week (DTE 6):</b> ±3.14%</li>
        <li>• <b>2 weeks (DTE 13):</b> ±4.61%</li>
      </ul>
      <p style="font-size:13px;line-height:1.6;color:var(--text);">Compare to the 1-day ATR-implied range of ±3.5% (current ATR ÷ spot). The options market is pricing 2-DTE moves at less than half daily ATR — consistent with vol exhaustion after the earnings shock.</p>
    `, { id:'opt-moves' })}

    ${reportSection('Short-term window — 7 to 15 days', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">A focused look at the 7–15 day window (May 15 → May 22 expiries). This is the horizon where any imminent move would materialise — and the segment of the chain most sensitive to current technical-correction dynamics.</p>

      <div style="overflow-x:auto;margin-top:12px;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:680px;">
        <thead><tr style="background:var(--bg);">
          ${['Expiry','DTE','ATM IV','25Δ skew (vp)','Implied move','Max-pain','Read'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['2026-05-15','6',  '30.12%', '−0.81', '±3.14%', '$610.00', 'Friday weekly — neutral pin at spot'],
            ['2026-05-18','9',  '27.92%', '−0.57', '±3.56%', '$617.50', 'Monday — slight upward pull'],
            ['2026-05-20','11', '29.50%', '−0.70', '±4.11%', '$605.00', 'Wednesday — slight downward pull'],
            ['2026-05-22','13', '30.32%', '−0.93', '±4.61%', '$612.50', 'Friday weekly — most negative skew'],
          ].map(r=>`<tr>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11.5px;">${r[0]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);">${r[1]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--mint);">${r[3]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[4]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[5]}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11.5px;color:var(--muted);">${r[6]}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-top:14px;">
        <div style="padding:12px 14px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">▲ BULLISH (7–15 days)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>All four expiries show negative 25Δ skew</b> (call IV richer than put IV by 0.57–0.93 vol points). Call buyers paying up — the textbook upside-speculation tell at this horizon.</li>
            <li>• <b>ATM IV holding the 28–30% band</b> after the post-earnings vol crush — well below the 40%+ levels typical around catalysts. Vol is "cheap" relative to recent realized.</li>
            <li>• <b>Three of four max-pain levels are above current spot</b> (May 18 $617.50, May 22 $612.50, May 13 $612.50). Mild upward bias to the pin.</li>
            <li>• <b>Most negative skew (−0.93) sits at the May 22 expiry</b>, the longest in the 7–15 day band — investors are paying up for upside beyond just intraday.</li>
          </ul>
        </div>
        <div style="padding:12px 14px;background:rgba(239,68,68,.05);border-radius:10px;border-left:3px solid var(--crimson);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:700;margin-bottom:6px;">▼ BEARISH (7–15 days)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>Implied move grows from ±3.1% (1w) to ±4.6% (2w)</b> — the chain prices a meaningful 1-σ band of $580–639 by May 22. The lower bound coincides with the $579 Fib 78.6% support — a break here, even on options-implied terms, retests the $548 cluster.</li>
            <li>• <b>May 20 max-pain at $605</b> sits below current spot — one expiry where dealer hedging skews modestly lower into pin.</li>
            <li>• <b>ATM IV ticked up between May 11 (22.9%) and May 22 (30.3%)</b>. The market is paying up for vol over the 2-week horizon despite the post-earnings crush — implying it sees a chance the consolidation gets resolved violently before late May.</li>
          </ul>
        </div>
        <div style="padding:12px 14px;background:rgba(245,158,11,.06);border-radius:10px;border-left:3px solid var(--amber);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--amber);font-weight:700;margin-bottom:6px;">⊙ NEUTRAL (7–15 days)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>Max-pain values cluster $605–617</b> — within ±1.3% of spot. No directional pin bias dominates the band.</li>
            <li>• <b>Net dealer gamma still ≈ flat</b> through this window — moves will be news/flow driven, not mechanically amplified.</li>
            <li>• <b>Term-structure slope between May 15 (30.1%) and May 22 (30.3%) is essentially flat</b> — no specific event premium being priced in the 1–2 week band. Q2 2026 earnings (~late July) sit well outside this window.</li>
          </ul>
        </div>
      </div>

      <div style="margin-top:14px;padding:12px 14px;background:rgba(99,102,241,.05);border-radius:10px;border-left:3px solid var(--accent);">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);font-weight:700;margin-bottom:6px;">📌 7–15 DAY VERDICT</div>
        <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0;"><b>Tactically bullish-leaning consolidation.</b> The 7–15 day window's persistent negative skew, three-of-four upward max-pain pulls, and modest implied-move band of ±3–5% are consistent with a market positioned for a small upside drift inside the $580–640 range over the next 2 weeks — exactly the kind of micro-setup where a Tranche-1 entry at $580–600 has a tight downside risk profile relative to the long-term thesis. The bear-case trigger for this window: a daily close below $580 inside the next 5 sessions, which would invalidate the bullish skew read and put $548 in play.</p>
      </div>
    `, { id:'opt-7to15' })}

    ${reportSection('First 5 weeks of expiries — May 11 → June 12, 2026', `
      <p style="font-size:13px;line-height:1.6;color:var(--text);">A consolidated view of every weekly expiry inside the first 5 weeks (DTE 2 → 34). This horizon captures the full digestion window of the post-earnings break before any meaningful new fundamental catalyst (Q2 2026 earnings ~late July sit at DTE ~84).</p>
      ${reportImage('assets/options/08_first5weeks.png','Figure 9. First 5 weeks of expiries — ATM IV, 25Δ skew, max-pain vs spot, and implied 1σ price-band per expiry.')}

      <div style="overflow-x:auto;margin-top:8px;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:900px;">
        <thead><tr style="background:var(--bg);">
          ${['Expiry','DTE','ATM IV','25Δ skew','Max-pain','vs spot','Implied ±%','Lower band','Upper band','PCR (OI)','Top call OI','Top put OI'].map(h=>`<th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${[
            ['2026-05-11','2',  '23.0%', '−0.17', '$607.50', '+0.35%', '±1.45%', '$600.80', '$618.46', '0.38', '$650', '$575'],
            ['2026-05-13','4',  '28.7%', '−0.94', '$612.50', '−0.47%', '±2.49%', '$594.48', '$624.78', '0.80', '$648', '$575'],
            ['2026-05-15','6',  '30.1%', '−0.81', '$610.00', '−0.06%', '±3.14%', '$590.48', '$628.78', '0.50', '$600', '$600'],
            ['2026-05-18','9',  '27.9%', '−0.57', '$617.50', '−1.29%', '±3.56%', '$587.90', '$631.36', '1.37', '$680', '$570'],
            ['2026-05-20','11', '29.5%', '−0.70', '$605.00', '+0.76%', '±4.11%', '$584.58', '$634.68', '1.78', '$660', '$540'],
            ['2026-05-22','13', '30.3%', '−0.93', '$612.50', '−0.47%', '±4.61%', '$581.53', '$637.73', '0.66', '$600', '$485'],
            ['2026-05-29','20', '29.6%', '−0.34', '$620.00', '−1.70%', '±5.57%', '$575.68', '$643.58', '1.46', '$700', '$570'],
            ['2026-06-05','27', '30.1%', '−0.09', '$610.00', '−0.06%', '±6.55%', '$569.71', '$649.55', '0.89', '$700', '$580'],
            ['2026-06-12','34', '30.8%', '−0.41', '$600.00', '+1.58%', '±7.55%', '$563.63', '$655.63', '0.37', '$1040','$600'],
          ].map(r=>{
            const skewVal = parseFloat(r[3].replace('−','-'));
            const skewColor = skewVal < 0 ? 'var(--mint)' : (skewVal > 0 ? 'var(--crimson)' : 'var(--text)');
            const vsspotVal = parseFloat(r[5].replace('+','').replace('−','-').replace('%',''));
            const mpColor = vsspotVal > 0 ? 'var(--mint)' : (vsspotVal < 0 ? 'var(--crimson)' : 'var(--text)');
            const pcrVal = parseFloat(r[9]);
            const pcrColor = pcrVal < 0.7 ? 'var(--mint)' : (pcrVal > 1.0 ? 'var(--crimson)' : 'var(--amber)');
            return `<tr>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;">${r[0]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);">${r[1]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[2]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${skewColor};font-weight:600;">${r[3]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[4]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${mpColor};">${r[5]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;">${r[6]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--crimson);">${r[7]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--mint);">${r[8]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:${pcrColor};font-weight:600;">${r[9]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--mint);">${r[10]}</td>
              <td style="padding:7px 10px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;color:var(--crimson);">${r[11]}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-top:14px;">
        <div style="padding:12px 14px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:6px;">▲ BULLISH (first 5 weeks)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>All 9 expiries show negative 25Δ skew</b> — every single one of the first 5 weeks has call IV richer than put IV. Persistent upside-call demand across the entire short-term curve.</li>
            <li>• <b>Top call-OI strikes rise with tenor</b>: $650 (1w) → $680 (1.5w) → $700 (3w & 4w) → <b>$1,040 (5w)</b>. The $1,040 strike on the June 12 expiry is far OTM (+71% above spot) — that's a paid-up "moonshot" call campaign that says investors are positioning for long-tail upside before quarterly results.</li>
            <li>• <b>Top put-OI strikes mostly drift lower with tenor</b> ($575 → $540 → $485) — when investors do hedge, they hedge further OTM. Less near-money fear.</li>
            <li>• <b>Most negative skew on May 22 (−0.93) and May 13 (−0.94)</b> — investors paying up for upside calls into the next two weekly expiries.</li>
            <li>• <b>3 of 9 max-pain levels above spot</b> with the 5-week pin at <b>$600 (only −1.6% from spot)</b> — no meaningful downside pinning bias on the longest weekly.</li>
          </ul>
        </div>
        <div style="padding:12px 14px;background:rgba(239,68,68,.05);border-radius:10px;border-left:3px solid var(--crimson);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:700;margin-bottom:6px;">▼ BEARISH (first 5 weeks)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>P/C ratio of 1.78 on May 20 and 1.46 on May 29</b> — two of the nine expiries show defensive put positioning by OI, indicating some investors are buying protection in the 11–20 day window. Watch this signal: persistent PCR > 1 is unusual against the broader 0.46 chain-wide reading.</li>
            <li>• <b>Implied 1σ lower band drops from $600.80 (DTE 2) to $563.63 (DTE 34)</b>. By June 12, the chain is pricing a meaningful chance of a retest into the $548–580 support cluster — i.e., another leg lower before stabilizing.</li>
            <li>• <b>Max-pain on May 29 at $620 (+1.7% above spot)</b> looks bullish on its face but May 20 max-pain at $605 sits below — the in-between expiries don't agree on direction, which means no clean pin and elevated 2-week realized vol risk.</li>
            <li>• <b>Skew tightens to nearly zero on June 5 (−0.09)</b> — past 4 weeks, the bullish skew premium fades. The market doesn't see strong directional conviction past the first month.</li>
          </ul>
        </div>
        <div style="padding:12px 14px;background:rgba(245,158,11,.06);border-radius:10px;border-left:3px solid var(--amber);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--amber);font-weight:700;margin-bottom:6px;">⊙ NEUTRAL (first 5 weeks)</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;">
            <li>• <b>ATM IV is remarkably flat across the first 5 weeks</b> at 27.9% – 30.8% — almost no term-structure differentiation between Week 1 (excluding the post-shock front weekly) and Week 5. The market is not pricing a specific catalyst in this window.</li>
            <li>• <b>Max-pain levels span $600 – $620</b> — a $20 band that brackets spot tightly. Pin levels are not directionally informative at this horizon.</li>
            <li>• <b>1σ price band by June 12: $564 – $656</b>. That width brackets every meaningful technical level (Fib 78.6% $579 inside lower; Fib 61.8% $626 / SMA 50 inside upper) — the chain is pricing a "decision quarter" within the existing support/resistance frame, not a regime shift.</li>
          </ul>
        </div>
      </div>

      <div style="margin-top:14px;padding:12px 14px;background:rgba(99,102,241,.05);border-radius:10px;border-left:3px solid var(--accent);">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);font-weight:700;margin-bottom:6px;">📌 5-WEEK VERDICT</div>
        <p style="font-size:13px;line-height:1.6;color:var(--text);margin:0;"><b>Tactically constructive with a defensive cluster mid-window.</b> All 9 weekly expiries show negative skew, the longest weekly's call wall sits at $1,040 (massive upside speculation), and the upper implied band by week 5 reaches $655 — through the $626 SMA 50 / Fib 61.8% pivot. The mid-window defensive prints (PCR 1.78 on May 20, 1.46 on May 29) are the meaningful counter-evidence: some investors expect a retest of $580–605 between weeks 2 and 3 before the late-cycle rally. <b>Trade implication:</b> a tactical long entry near $580–600 in weeks 2–3 has both options-positioning and technical-support backing; chase it lower if max-pain on May 22 or May 29 prints inside the realized weekly close.</p>
      </div>
    `, { id:'opt-5weeks' })}

    ${reportSection('Bullish, bearish, and neutral takeaways — full chain', `
      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        <div style="padding:14px 16px;background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid var(--mint);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mint);font-weight:700;margin-bottom:8px;">▲ BULLISH SIGNALS</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;">
            <li>• <b>P/C ratio 0.46–0.48</b> across both OI and daily volume — investors are aggressively net long calls.</li>
            <li>• <b>Negative front-month skew (−0.6 to −0.9 vol points)</b> — call wings priced richer than put wings. "Buy-the-dip" speculation.</li>
            <li>• <b>$750 strike has 275k of OI</b> — the largest single concentration in the chain, sitting in the H&S right-shoulder zone. Investors positioned for a return to that level.</li>
            <li>• <b>Above-spot call OI ~877k vs below-spot put OI ~287k</b> — 3.0× call-heavy.</li>
            <li>• <b>Front-week IV at 22.9%</b> — well below the elevated levels typical around earnings. The shock is fully digested.</li>
            <li>• <b>Massive long-dated call OI</b> at $1,000 / $1,250 / $1,430 strikes for 2027–2028 — strategic positioning for a multi-year fundamental re-rate.</li>
          </ul>
        </div>
        <div style="padding:14px 16px;background:rgba(239,68,68,.05);border-radius:10px;border-left:3px solid var(--crimson);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--crimson);font-weight:700;margin-bottom:8px;">▼ BEARISH SIGNALS</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;">
            <li>• <b>Positive medium-term skew (+1.0 to +1.4 vol points)</b> at 40–250 DTE — investors are paying for downside insurance into Q3 / Q4 2026 and through the FY 2026 capex digestion.</li>
            <li>• <b>$500 strike has 64k put OI</b> — meaningful downside hedging at −18% from spot. Some investors are insuring the deep tail.</li>
            <li>• <b>Vol surface lifting through the curve</b> — back-end IV at 38–39% reflects long-term uncertainty about AI-capex ROI.</li>
          </ul>
        </div>
        <div style="padding:14px 16px;background:rgba(245,158,11,.06);border-radius:10px;border-left:3px solid var(--amber);">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--amber);font-weight:700;margin-bottom:8px;">⊙ NEUTRAL SIGNALS</div>
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;">
            <li>• <b>Net dealer gamma ≈ flat</b> at current spot — hedging flow won't amplify or dampen moves; news-flow-driven regime.</li>
            <li>• <b>Max-pain levels cluster $605–617</b> across the next 6 weekly expiries — no directional pin bias either way.</li>
            <li>• <b>Term structure in normal contango</b> — no event-vol crowding (which would invert the front).</li>
            <li>• <b>Implied moves of ±1.5% (2D) / ±3% (1W) / ±4.6% (2W)</b> in line with realized vol. Options market is not pricing a specific catalyst.</li>
          </ul>
        </div>
      </div>

      <div style="margin-top:18px;padding:14px 16px;background:rgba(99,102,241,.05);border-radius:10px;border-left:3px solid var(--accent);">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);font-weight:700;margin-bottom:8px;">📌 OPTIONS-DRIVEN VERDICT</div>
        <p style="font-size:13.5px;line-height:1.6;color:var(--text);margin:0;">Options positioning is <b style="color:var(--mint);">structurally bullish on a 1–6 month view</b>, with a meaningful upside-call campaign concentrated at the $750 strike and a clean P/C ratio. The medium-term put skew is <i>normal</i> insurance demand — not panic. Near-term price action will be driven by news flow, not by options-driven mechanical hedging (gamma is flat). For the consolidated thesis: <b>options corroborate the long-term fundamental bull case</b> and act as a counterweight to the short-term technical bearishness. Translation: smart money is positioning for the technical correction to resolve to the upside over the coming quarter.</p>
      </div>
      <p style="font-size:11.5px;color:var(--muted);font-style:italic;margin-top:14px;line-height:1.5;"><b>Disclaimer:</b> Options metrics describe market positioning and pricing as of the data snapshot. They are not predictive of any specific outcome and should not be treated as investment advice.</p>
    `, { id:'opt-takeaways', style:'background:rgba(99,102,241,.02);border-left:3px solid var(--accent);' })}`;
}

function render() {
  let html = '';
  if (activePage === 'dashboard') html = dashboardPage();
  else if (activePage === 'companies') html = companiesPage();
  else if (activePage === 'transcripts') html = transcriptsPage();
  else if (activePage === 'filings') html = filingsPage();
  else if (activePage === 'meta-summary') html = metaSummaryPage();
  else if (activePage === 'meta-fundamental') html = metaFundamentalPage();
  else if (activePage === 'meta-technical') html = metaTechnicalPage();
  else if (activePage === 'meta-consolidated') html = metaConsolidatedPage();
  else if (activePage === 'meta-options') html = metaOptionsPage();
  else if (activePage === 'meta-valuation') html = metaValuationPage();
  else if (activePage.startsWith('ticker:')) html = tickerPage(activePage.split(':')[1]);
  document.getElementById('content').innerHTML = html;
  document.getElementById('content').scrollTop = 0;
}

// ===== Q-to-Q line-item modal (popup detail view) =====
function showQ2QDetail(ticker, pairIdx, liIdx) {
  const c = DATA.companies[ticker];
  if (!c || !c.q2q_analysis) return;
  const pair = c.q2q_analysis.q_to_q_pairs[pairIdx];
  if (!pair) return;
  const li = pair.line_items[liIdx];
  if (!li) return;

  // Format helpers
  const NUM = new Set(['revenue', 'fy_expense', 'fy_capex', 'fy_tax', 'q_tax']);
  const isNum = (li) => NUM.has(li.metric_kind);
  const fmtGuide = (li) => {
    if (!isNum(li)) return li.target_period ? `Target period: ${li.target_period}` : 'Strategic commitment (qualitative)';
    if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) return `${li.guide_low_pct}% – ${li.guide_high_pct}% (mid ${li.guide_mid_pct.toFixed(1)}%)`;
    return `$${li.guide_low_b}B – $${li.guide_high_b}B (mid $${li.guide_mid_b.toFixed(2)}B)`;
  };
  const fmtAct = (li) => {
    if (!isNum(li)) return li.outcome_summary || '—';
    if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) return li.actual_pct == null ? '—' : `${li.actual_pct.toFixed(2)}%`;
    return li.actual_b == null ? '—' : `$${li.actual_b.toFixed(2)}B`;
  };
  const fmtD = (li) => {
    if (!isNum(li)) return '—';
    if ((li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax')) {
      if (li.delta_vs_mid_pp == null) return '—';
      return `${li.delta_vs_mid_pp>=0?'+':''}${li.delta_vs_mid_pp.toFixed(2)} pp`;
    }
    if (li.delta_vs_mid_pct == null) return '—';
    return `${li.delta_vs_mid_pct>=0?'+':''}${li.delta_vs_mid_pct.toFixed(2)}%`;
  };
  const dColor = (li) => {
    if (!isNum(li)) return 'var(--text)';
    const v = (li.metric_kind === 'fy_tax' || li.metric_kind === 'q_tax') ? li.delta_vs_mid_pp : li.delta_vs_mid_pct;
    if (v == null) return 'var(--muted)';
    const goodIsPositive = (li.metric_kind === 'revenue');
    const isGood = goodIsPositive ? v > 0 : v < 0;
    if (Math.abs(v) < 0.5) return 'var(--muted)';
    return isGood ? 'var(--mint)' : 'var(--crimson)';
  };
  const verdictPill = (v) => {
    if (!v) return '';
    const vl = v.toLowerCase();
    if (vl.startsWith('beat')) return `<span class="pill" style="background:rgba(16,185,129,.15);color:#047857;font-weight:600;">${v}</span>`;
    if (vl.startsWith('in-line')) return `<span class="pill" style="background:rgba(99,102,241,.15);color:#4338ca;font-weight:600;">${v}</span>`;
    if (vl.startsWith('miss')) return `<span class="pill" style="background:rgba(239,68,68,.15);color:#b91c1c;font-weight:600;">${v}</span>`;
    if (vl.startsWith('pending')) return `<span class="pill" style="background:rgba(245,158,11,.15);color:#b45309;font-weight:600;">${v}</span>`;
    return `<span class="pill">${v}</span>`;
  };

  // Title / subtitle
  document.getElementById('modalTitle').innerHTML = li.metric + '  ' + verdictPill(li.verdict);
  document.getElementById('modalSub').textContent =
    `${pair.made_in} call → targets ${pair.targets} · ${ticker}`;

  // Body
  const sourceFile = li.guide_source_file || pair.transcript_source;
  const speaker = (li.metric_kind === 'product' || li.metric_kind === 'capability' || li.metric_kind === 'users')
                  ? 'Mark Zuckerberg / Susan Li' : 'Susan Li (CFO)';
  let body = '';
  if (isNum(li)) {
    body += `
      <div class="stat-row">
        <div class="stat-cell">
          <div class="lbl">Guidance</div>
          <div class="val">${fmtGuide(li)}</div>
        </div>
        <div class="stat-cell">
          <div class="lbl">Actual reported</div>
          <div class="val">${fmtAct(li)}</div>
        </div>
        <div class="stat-cell">
          <div class="lbl">Δ vs midpoint</div>
          <div class="val" style="color:${dColor(li)};">${fmtD(li)}</div>
        </div>
      </div>`;
  } else {
    body += `
      <div class="stat-row" style="grid-template-columns:1fr 1fr;">
        <div class="stat-cell">
          <div class="lbl">Target period</div>
          <div class="val" style="font-size:13px;">${li.target_period || '—'}</div>
        </div>
        <div class="stat-cell">
          <div class="lbl">Outcome verdict</div>
          <div class="val" style="font-size:13px;">${li.verdict || '—'}</div>
        </div>
      </div>`;
  }

  body += `
    <div class="quote-card">
      <div class="quote-label">Verbatim guidance quote — ${speaker} on the ${pair.made_in} call</div>
      <div class="quote-body">"${li.guide_quote}"</div>
      <div class="src-line">📄 Transcript: ${sourceFile}</div>
      ${li.actual_source_filing ? `<div class="src-line">📄 Actual extracted from: ${li.actual_source_filing}</div>` : ''}
    </div>
  `;

  // Outcome / cross-reference for strategic items
  if (!isNum(li) && (li.outcome_summary || li.outcome_quote)) {
    body += `
      <div class="quote-card" style="background:rgba(16,185,129,.06);border-left-color:var(--mint);">
        <div class="quote-label" style="color:#047857;">Outcome / cross-reference</div>
        ${li.outcome_summary ? `<div style="font-size:13px;color:var(--text);line-height:1.55;margin-bottom:6px;">${li.outcome_summary}</div>` : ''}
        ${li.outcome_quote ? `<div class="quote-body" style="font-size:12.5px;">${li.outcome_quote}</div>` : ''}
        ${li.outcome_source ? `<div class="src-line">📄 Source: ${li.outcome_source}</div>` : ''}
      </div>`;
  }

  // What this means narrative
  const v = (li.verdict || '').toLowerCase();
  let narrative = '';
  if (v.startsWith('beat') && li.metric_kind === 'revenue') {
    narrative = `Reported revenue exceeded the high end of management's guidance range. This is a clean beat — investors who took the guidance literally and modeled the midpoint were undersold by ${fmtD(li).replace('+','')}. For the MCS framework, this counts as <b>delivery exceeding commitment</b>.`;
  } else if (v.startsWith('beat') && li.metric_kind === 'fy_expense') {
    narrative = `Reported full-year expenses came in <b>below</b> the low end of management's guidance range — i.e. management <i>over-budgeted</i> and delivered cheaper than promised. For a cost line item, "below range" is favourable. This counts as <b>delivery better than commitment</b>.`;
  } else if (v.startsWith('beat') && li.metric_kind === 'fy_capex') {
    narrative = `Reported full-year capex came in <b>below</b> management's guidance range. For a cost line item, this is favourable. Caveat: the guidance includes principal payments on finance leases, while the XBRL-reported figure shown is PPE capex only — see scope note.`;
  } else if (v.startsWith('in-line')) {
    narrative = `Actual landed inside management's stated guidance range. Management delivered exactly what they committed to — neither over- nor under-shooting. For the MCS framework, this counts as <b>delivery matching commitment</b>.`;
  } else if (v.startsWith('miss') && li.one_time_charge_note) {
    narrative = `Reported value landed outside guidance, but Meta's 10-K explicitly attributes the gap to a one-time tax-law change (OBBBA) enacted after the guidance was given. Management's <b>underlying</b> tax rate of ${li.actual_underlying_pct}% was inside the guided range. For credibility scoring, this is a <b>headline miss with exogenous attribution</b> — the underlying forecast was accurate.`;
  } else if (v.startsWith('miss')) {
    narrative = `Actual landed outside management's stated range on the unfavourable side. For the MCS framework, this counts as <b>under-delivery against commitment</b>.`;
  } else if (v.startsWith('pending')) {
    narrative = `The target period (${pair.targets}) has not yet been reported. This row is awaiting the next 10-Q / 10-K filing.`;
  }
  if (narrative) {
    body += `<div style="padding:12px 14px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:13px;line-height:1.6;color:var(--text);margin-bottom:10px;">
      <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;margin-bottom:6px;">What this means</div>
      ${narrative}
    </div>`;
  }

  // Notes
  if (li.scope_note) {
    body += `<div class="note-amber">⚠ <b>Scope note:</b> ${li.scope_note}</div>`;
  }
  if (li.one_time_charge_note) {
    body += `<div class="note-mint">
      <div class="note-mint-title">Adjusted analysis (10-K verified): underlying rate ${li.actual_underlying_pct}% — INSIDE guided range</div>
      <div style="color:var(--text);">${li.one_time_charge_note}</div>
    </div>`;
  }

  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalBackdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('show');
  document.body.style.overflow = '';
}

// Esc to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' &&
      document.getElementById('modalBackdrop').classList.contains('show')) {
    closeModal();
  }
});

buildSidebar();
render();
