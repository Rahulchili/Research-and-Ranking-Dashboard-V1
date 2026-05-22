#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# backup_cowork_history.sh
# Copies your Claude Cowork session data + conversation transcripts into a
# dated folder under the project workspace, so your dev history is safe and
# can be committed to GitHub later.
#
# Run this every time you finish a big work session:
#   bash backup_cowork_history.sh
# ----------------------------------------------------------------------------
set -u

# Destination (same folder as the dashboard — easy to find, easy to commit)
DEST_ROOT="/Users/rahul/Rahul/Earnings/Q2Q_ER_Cowork/cowork_history_backups"
STAMP=$(date "+%Y-%m-%d_%H%M")
DEST="${DEST_ROOT}/${STAMP}"
mkdir -p "${DEST}"

echo "============================================================"
echo "  Cowork history backup → ${DEST}"
echo "============================================================"

# 1) Session folders (uploaded files, outputs, working files per session)
SESSIONS_SRC="${HOME}/Library/Application Support/Claude/local-agent-mode-sessions"
if [ -d "${SESSIONS_SRC}" ]; then
  echo "  [1/3] copying session folders…"
  rsync -aH --info=progress2 "${SESSIONS_SRC}/" "${DEST}/sessions/" 2>/dev/null \
    || cp -R "${SESSIONS_SRC}" "${DEST}/sessions"
else
  echo "  [1/3] session folder not found at ${SESSIONS_SRC} — skipping"
fi

# 2) Conversation transcripts (the JSONL files Claude writes for every chat)
# Cowork stores them in a private temp area. We find any JSONL file under
# /var/folders that lives in a claude-hostloop-plugins tree.
echo "  [2/3] copying conversation JSONL transcripts…"
mkdir -p "${DEST}/transcripts"
COUNT=0
while IFS= read -r f; do
  rel=$(echo "$f" | sed 's|.*/projects/||')
  mkdir -p "${DEST}/transcripts/$(dirname "$rel")"
  cp "$f" "${DEST}/transcripts/${rel}"
  COUNT=$((COUNT + 1))
done < <(find /var/folders -path '*claude-hostloop*' -name '*.jsonl' 2>/dev/null)
echo "        copied ${COUNT} transcript file(s)"

# 3) The Cowork plugin cache (skills, plugins, etc.) — small but useful
PLUGINS_SRC=$(find /var/folders -type d -name "claude-hostloop-plugins" 2>/dev/null | head -1)
if [ -n "${PLUGINS_SRC}" ] && [ -d "${PLUGINS_SRC}" ]; then
  echo "  [3/3] copying plugins cache snapshot…"
  rsync -aH "${PLUGINS_SRC}/" "${DEST}/plugins_cache/" 2>/dev/null \
    || cp -R "${PLUGINS_SRC}" "${DEST}/plugins_cache"
else
  echo "  [3/3] plugins cache not found — skipping"
fi

# Write a small manifest so future-you knows what's in this folder
{
  echo "Cowork history backup"
  echo "  taken: $(date)"
  echo "  by:    $(whoami)"
  echo "  host:  $(hostname)"
  echo ""
  echo "Contents:"
  echo "  sessions/         per-session folders (uploads, outputs, working files)"
  echo "  transcripts/      JSONL conversation history (every message you sent + reply)"
  echo "  plugins_cache/    snapshot of installed plugins/skills at time of backup"
  echo ""
  echo "Sizes:"
  du -sh "${DEST}"/* 2>/dev/null
} > "${DEST}/README.txt"

echo ""
echo "Done.  Backup is at:"
echo "  ${DEST}"
echo ""
echo "Total size:"
du -sh "${DEST}"
echo ""
echo "To commit it to GitHub later:"
echo "  cd /Users/rahul/Rahul/Earnings/Q2Q_ER_Cowork"
echo "  git add cowork_history_backups/${STAMP}"
echo "  git commit -m 'cowork history backup ${STAMP}'"
echo "  git push"
