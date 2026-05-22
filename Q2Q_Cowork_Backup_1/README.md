# Q2Q Cowork Backup #1

**Created:** May 19, 2026
**Purpose:** Preserve everything Claude Cowork touched during the Stock Financial Analysis project — all PRDs, conversation transcripts, tool outputs, working files, and the installed plugin/skill set.

This folder is your **time capsule**. If your laptop is lost, reset, or you start a brand new Cowork session, everything here lets you (or your mentor, or a future teammate) reconstruct what happened.

---

## What's inside

```
Q2Q_Cowork_Backup_1/
├── README.md                              ← you are here
│
├── 01_uploads/                            (10 files — your PRDs and instructions)
│   ├── PRD StockAnalysis VersionControl.md
│   ├── CLAUDE CODE INSTRUCTIONS StockAnalysis.md
│   ├── PRD_Rahul_Earnings_Analysis_v2.docx
│   ├── Rahul_Dynamic_Growth_Stock_Ranking_PRD.docx
│   ├── Rahul_Eight-Quarter_Confidence_Scoring_PRD_v2.0.docx
│   ├── Rahul_Claude_Cowork_Implementation_Playbook_Confidence_v2_1_1.docx
│   ├── Claude_Code_Instruction_Ranking_V1.docx
│   ├── Claude_Rahul_PRD_JSON_Dashboard.md
│   ├── Rahul_CLAUDE_CODE_BUILD_INSTRUCTIONS.md
│   └── Rahul_Claude_CoWork_MU_Dashboard_Prompt.md
│
├── 02_outputs/                            (~421 MB — every working file Claude generated)
│   - intermediate META / AMD / MU dashboards
│   - charts, JSON snapshots, executive summaries
│   - Investment-Dashboard-V1.zip (98 MB shareable package)
│
├── 03_session_artifacts/                  (~9 MB — the conversation history)
│   ├── subagents/                         (4 JSONL files — sub-agent conversations)
│   └── tool-results/                      (44 .txt files — every tool call's output)
│
├── 04_plugins_skills/                     (the Cowork skills installed at backup time)
│   - schedule, setup-cowork, xlsx, pdf, pptx, skill-creator,
│     consolidate-memory, etc.
│
└── 05_helpers/
    └── backup_cowork_history.sh           ← the script that made this folder
```

---

## What this backup covers vs. what it does NOT

**Covered (preserved here):**
- Every PRD and instruction document you ever uploaded.
- Every tool result (bash commands, file reads, web fetches) from this current session.
- Every sub-agent conversation from this session.
- The set of Cowork skills you had installed.
- 421 MB of working files (intermediate dashboards, charts, zips).

**NOT covered (lives on your Mac, not reachable from the sandbox):**
- Conversation transcripts from *other* Cowork sessions (earlier days/weeks). Those live at:
  `~/Library/Application Support/Claude/local-agent-mode-sessions/`
- To capture those, run the `backup_cowork_history.sh` script from your Mac Terminal:
  ```
  bash "/Users/rahul/Rahul/Earnings/Q2Q_ER_Cowork/backup_cowork_history.sh"
  ```
  That script reads your Mac's protected Library folder (which the sandbox cannot) and produces a parallel backup with the same structure.

---

## How to use this folder

**Right now:**
- Drag-copy or sync this folder to Google Drive (your team's shared drive). One-time, full history preserved.

**When you set up GitHub** (per the Version Control PRD):
- Add this folder to the repo: `git add Q2Q_Cowork_Backup_1 && git commit -m "Cowork backup 1"`
- Then it lives in two places: your laptop AND GitHub.

**Going forward:**
- Run `backup_cowork_history.sh` from Mac Terminal every Friday (or after big work sessions). Each run creates `cowork_history_backups/YYYY-MM-DD_HHMM/` with the latest state.

---

## Reading the conversation history

The transcripts in `03_session_artifacts/` are JSONL files (one JSON object per line). You can:
- Open any `.jsonl` in **VS Code** or **TextEdit** to read raw.
- Or run this one-liner in Terminal to pretty-print:
  ```
  cat 03_session_artifacts/subagents/agent-*.jsonl | python3 -m json.tool
  ```

The `tool-results/*.txt` files are plain text — every bash command Claude ran during this session, and what it returned.

---

## File counts (verified at backup time)

| Folder | Files | Size |
|---|---|---|
| 01_uploads | 10 | ~400 KB |
| 02_outputs | 100 | ~421 MB |
| 03_session_artifacts/subagents | 4 | 256 KB |
| 03_session_artifacts/tool-results | 44 | 8.9 MB |
| 04_plugins_skills | 8 folders | ~variable |
| 05_helpers | 1 | 2 KB |

**Total: ~430 MB**
