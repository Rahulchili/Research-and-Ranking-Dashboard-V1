# PRD: Stock Financial Analysis — Version Control & Migration Strategy

**Project:** Stock Financial Analysis Web App  
**Student:** Rahul  
**Mentor:** Sreeni  
**Date:** May 2026  
**Status:** Phase 2 — Preservation & Collaboration

-----

## 1. Background

Over the past two weeks, Rahul developed a Stock Financial Analysis web application using Claude Cowork (vibe coding). Starting from a PRD and step-by-step Cowork instructions, the app evolved incrementally — from 5 stocks → 10 stocks → 40 stocks. The output is a static HTML file (under 1MB) with separate CSS and JSON data files.

The current state:

- Single large HTML file (monolith) — hard to share and collaborate on
- CSS and JSON data co-located or embedded
- Development instructions and Cowork conversation history exist only on Rahul’s local/cloud desktop
- No version control, no backup, no team collaboration structure

**Risk:** If Rahul’s system is lost or reset, all development history and instructions are lost.

-----

## 2. Goals

1. **Preserve** the entire development history — PRD, Cowork instructions, iteration log
1. **Migrate** the static site to a shareable, accessible location (Google Drive → Google Sites → Firebase)
1. **Restructure** the codebase into proper separated files (HTML, CSS, JSON)
1. **Version control** the project in GitHub for team collaboration and backup
1. **Document** the process so it can be reconstructed or handed off to future students

-----

## 3. Scope

### In Scope

- Exporting and documenting all Cowork conversation history and prompts
- Separating HTML, CSS, and JSON into individual files
- Setting up a GitHub repository with proper folder structure
- Uploading the static site to Google Drive as staging
- Deploying to Google Sites as the first live hosting stage
- Documenting the Firebase migration path (to be executed when admin access is granted)

### Out of Scope

- Backend server development (Node.js, APIs)
- Database integration
- Authentication or user management
- Firebase deployment (blocked pending admin approval)

-----

## 4. Deliverables

|#|Deliverable                               |Owner        |Status|
|-|------------------------------------------|-------------|------|
|1|Cowork conversation export (markdown/text)|Rahul        |To Do |
|2|GitHub repo with folder structure         |Rahul        |To Do |
|3|Separated HTML / CSS / JSON files         |Rahul        |To Do |
|4|README.md with project history            |Rahul        |To Do |
|5|Files uploaded to Google Drive            |Rahul        |To Do |
|6|Static site live on Google Sites          |Rahul        |To Do |
|7|Firebase migration plan (documented)      |Rahul + Admin|Future|

-----

## 5. Folder Structure (GitHub Repository)

```
stock-financial-analysis/
│
├── README.md                        # Project overview and setup instructions
│
├── src/                             # Source code
│   ├── index.html                   # Main HTML page
│   ├── styles/
│   │   └── main.css                 # Stylesheet
│   └── data/
│       └── stocks.json              # Stock data (40 stocks)
│
├── docs/                            # Development documentation
│   ├── PRD.md                       # This document
│   ├── cowork_instructions/
│   │   ├── 01_initial_prd_prompt.md
│   │   ├── 02_5_stocks_iteration.md
│   │   ├── 03_10_stocks_iteration.md
│   │   └── 04_40_stocks_iteration.md
│   └── iteration_log.md             # Summary of what changed each week
│
└── deployment/
    ├── google_sites_guide.md        # How to upload to Google Sites
    └── firebase_migration_plan.md   # Future Firebase hosting plan
```

-----

## 6. Hosting Migration Stages

### Stage 1 — Google Drive (Immediate)

- Upload all files (HTML, CSS, JSON) to a shared Google Drive folder
- Share folder link with team members
- Use as staging area and file backup

### Stage 2 — Google Sites (Short Term)

- Create a new Google Site
- Embed or link the HTML page
- Share the Google Sites URL with team and mentor for review

### Stage 3 — Firebase Hosting (Future)

- Requires admin to create Firebase project and add Rahul as contributor
- Deploy using Firebase CLI: `firebase deploy`
- Provides a proper public URL with versioning support

-----

## 7. Success Criteria

- All Cowork instructions are documented and committed to GitHub
- HTML, CSS, and JSON are separated into individual files
- The app renders correctly from the GitHub repo structure
- The app is accessible via Google Sites URL
- Any team member can clone the repo and understand the development history
- Mentor (Sreeni) can verify the iteration log matches the actual development journey

-----

## 8. Timeline

|Week  |Milestone                                                |
|------|---------------------------------------------------------|
|Week 1|Export Cowork history, set up GitHub repo, separate files|
|Week 1|Upload to Google Drive                                   |
|Week 2|Deploy to Google Sites                                   |
|TBD   |Firebase deployment (pending admin)                      |

-----

## 9. Risks

|Risk                                        |Mitigation                                         |
|--------------------------------------------|---------------------------------------------------|
|Cowork history not exportable               |Manually copy-paste key prompts into markdown files|
|Google Sites rendering issues with JSON data|Test locally first; use relative file paths        |
|Firebase admin delay                        |Google Sites serves as interim live URL            |
|Team members unfamiliar with Git            |Include Git basics in CLAUDE_CODE_INSTRUCTIONS     |