# CLAUDE_CODE_INSTRUCTIONS.md

# Stock Financial Analysis — Version Control & Migration Implementation

**Student:** Rahul  
**Mentor:** Sreeni  
**Purpose:** Step-by-step instructions to preserve, restructure, and migrate the stock analysis project

-----

## OVERVIEW

You will complete this in 4 phases:

1. Export and document your Cowork history
1. Set up Git and GitHub
1. Restructure the codebase (separate HTML/CSS/JSON)
1. Upload to Google Drive and deploy to Google Sites

Work through each phase in order. Do not skip steps.

-----

## PHASE 1: Export Cowork History

### Step 1.1 — Export the conversation

Open your Claude Cowork session and look for a “Download” or “Export” option.

- If export is available: download as `.md` or `.txt`
- If no export: manually copy each major prompt block

### Step 1.2 — Organize into iteration files

Create a folder on your desktop called `cowork_export/`. Inside it, create one file per major iteration:

```
cowork_export/
  01_initial_prd_prompt.md
  02_5_stocks_iteration.md
  03_10_stocks_iteration.md
  04_40_stocks_iteration.md
```

For each file, paste the relevant Cowork instructions and prompts. At the top of each file, add:

```markdown
# Iteration: [Name]
Date: [approximate date]
Stocks covered: [number]
Key changes made: [brief description]
```

### Step 1.3 — Write the iteration log

Create `iteration_log.md` with this format:

```markdown
# Iteration Log — Stock Financial Analysis

## Week 1, Day 1
- Started from PRD
- Built initial 5-stock HTML page
- Key prompts: [summarize]

## Week 1, Day 3
- Expanded to 10 stocks
- Added CSS styling
- Key prompts: [summarize]

## Week 2
- Expanded to 40 stocks
- Separated JSON data
- Key prompts: [summarize]
```

-----

## PHASE 2: Set Up Git and GitHub

### Step 2.1 — Install Git (if not already installed)

Open your terminal (Command Prompt or Terminal) and check:

```bash
git --version
```

If not installed, download from: https://git-scm.com/downloads

### Step 2.2 — Configure Git with your identity

```bash
git config --global user.name "Rahul"
git config --global user.email "your.email@example.com"
```

### Step 2.3 — Create the project folder structure

```bash
mkdir stock-financial-analysis
cd stock-financial-analysis

mkdir -p src/styles
mkdir -p src/data
mkdir -p docs/cowork_instructions
mkdir deployment
```

### Step 2.4 — Initialize Git repository

```bash
git init
```

### Step 2.5 — Create a .gitignore file

```bash
echo ".DS_Store" > .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
```

### Step 2.6 — Create GitHub repository

1. Go to https://github.com and sign in (or create account)
1. Click the **+** button → **New repository**
1. Name it: `stock-financial-analysis`
1. Set to **Private** (share with Sreeni by adding as collaborator later)
1. Do NOT initialize with README (you will add your own)
1. Click **Create repository**
1. Copy the repository URL (e.g., `https://github.com/rahul/stock-financial-analysis.git`)

### Step 2.7 — Connect local repo to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/stock-financial-analysis.git
```

-----

## PHASE 3: Restructure the Codebase

### Step 3.1 — Separate your monolithic HTML file

Open your large HTML file. Extract the following:

**CSS → `src/styles/main.css`**

- Find all `<style>...</style>` blocks
- Cut the CSS content (not the tags) and paste into `src/styles/main.css`
- Replace the `<style>` block in HTML with:
  
  ```html
  <link rel="stylesheet" href="styles/main.css">
  ```

**JSON data → `src/data/stocks.json`**

- Find where stock data is defined (usually a JavaScript variable like `const stockData = [...]`)
- Cut the data array and paste into `src/data/stocks.json` as a valid JSON array
- In your HTML/JS, replace the inline data with a fetch call:
  
  ```javascript
  fetch('data/stocks.json')
    .then(response => response.json())
    .then(data => {
      // use data here — same as your original stockData variable
    });
  ```

**HTML → `src/index.html`**

- Save the cleaned HTML file to `src/index.html`

### Step 3.2 — Test locally

Open `src/index.html` in your browser. Verify:

- All 40 stocks display correctly
- Styling looks the same as before
- No console errors (press F12 to check)

If there are errors, fix the file paths first — they are the most common issue.

### Step 3.3 — Write the README

Create `README.md` in the root folder:

```markdown
# Stock Financial Analysis

A static web application for financial analysis of 40 stocks.
Built by Rahul under mentorship of Sreeni.

## Project Structure

- `src/index.html` — Main HTML page
- `src/styles/main.css` — Stylesheet
- `src/data/stocks.json` — Stock data (40 stocks)
- `docs/` — Development documentation and Cowork history
- `deployment/` — Hosting guides

## Development History

Built over 2 weeks using Claude Cowork (vibe coding).
Progressed from 5 → 10 → 40 stocks.
See `docs/iteration_log.md` for full history.

## How to Run

Open `src/index.html` in any browser. No server required.

## Hosting

Currently deployed on Google Sites.
Firebase hosting planned (pending admin setup).
```

### Step 3.4 — Copy your Cowork export files into docs

```bash
# Copy your exported cowork files into the repo
cp ~/Desktop/cowork_export/*.md docs/cowork_instructions/
```

-----

## PHASE 4: Commit to GitHub

### Step 4.1 — Add all files

```bash
git add .
```

### Step 4.2 — Verify what will be committed

```bash
git status
```

You should see all your files listed in green. Check that JSON and CSS files are included.

### Step 4.3 — Make the first commit

```bash
git commit -m "Initial commit: 40-stock financial analysis app with Cowork history"
```

### Step 4.4 — Push to GitHub

```bash
git push -u origin main
```

If prompted, log in with your GitHub credentials.

### Step 4.5 — Verify on GitHub

Go to your repository on GitHub. You should see all files organized in the correct folders.

Share the GitHub link with Sreeni.

-----

## PHASE 5: Google Drive Upload (Staging)

### Step 5.1 — Upload files to Google Drive

1. Open Google Drive
1. Create a folder: `Stock Analysis App`
1. Upload the entire `src/` folder contents (index.html, styles/, data/)
1. Share the folder with your team (Get link → Anyone with the link → Viewer)

### Step 5.2 — Test sharing

Send the Google Drive folder link to a teammate. Ask them to confirm they can see all files.

-----

## PHASE 6: Google Sites Deployment

### Step 6.1 — Create a Google Site

1. Go to https://sites.google.com
1. Click **+ New Site** (Blank)
1. Name it: `Stock Financial Analysis`

### Step 6.2 — Embed the HTML page

Option A — Embed via iframe:

- In Google Sites, click **Insert → Embed**
- Paste your Google Drive share link for `index.html`

Option B — Use Google Sites HTML embed:

- Click **Insert → Embed** → **Embed code**
- Paste a simplified version of your HTML for display

### Step 6.3 — Publish

- Click **Publish** in the top right
- Choose a URL slug (e.g., `stock-analysis-rahul`)
- Click **Publish**
- Share the Google Sites URL with Sreeni for review

-----

## PHASE 7: Future — Firebase Hosting (When Admin Ready)

These steps are for when your admin has set up the Firebase project.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize in your project folder
firebase init hosting

# When prompted:
# - Public directory: src
# - Single page app: No
# - Overwrite index.html: No

# Deploy
firebase deploy
```

You will receive a live URL like: `https://your-project.web.app`

-----

## CHECKPOINT SUMMARY

|Phase|Task                                    |Done?|
|-----|----------------------------------------|-----|
|1    |Cowork history exported and organized   |☐    |
|2    |Git initialized and GitHub repo created |☐    |
|3    |HTML/CSS/JSON separated into files      |☐    |
|3    |App tested locally — 40 stocks working  |☐    |
|4    |All files committed and pushed to GitHub|☐    |
|4    |GitHub link shared with Sreeni          |☐    |
|5    |Files uploaded to Google Drive          |☐    |
|6    |App live on Google Sites                |☐    |
|7    |Firebase (future — pending admin)       |☐    |

-----

## TROUBLESHOOTING

**JSON not loading in browser**

- Make sure you’re using `fetch()` not a direct variable reference
- If opening via `file://`, use a local server: `python -m http.server 8000` then visit `http://localhost:8000/src/`

**CSS not applying**

- Check the `<link>` tag path: `href="styles/main.css"` (relative, not absolute)

**Git push rejected**

- Run: `git pull origin main --rebase` then push again

**Cowork export not available**

- Manually copy-paste your key prompts into markdown files — even a rough summary is better than nothing