#!/bin/bash
# StatAtlas repo-create retries (GitHub rate limit). Tries every 5 min, max 12 rounds.
LOG=/home/hatch/workspace/makefun/new-2026-11-26/team11/national-statistics-site/repo-create-retries.log
REPO=best-national-statistics-site-20261126
DIR=/home/hatch/workspace/makefun/new-2026-11-26/team11/national-statistics-site
for round in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if gh api "repos/taufan98/$REPO" --jq .html_url >/dev/null 2>&1; then
    echo "$(date -u +%H:%M:%S) round $round: $REPO EXISTS" >> "$LOG"
    (cd "$DIR" && git push -u origin main 2>&1 | tail -2 >> "$LOG")
    echo "$(date -u +%H:%M:%S) ALL DONE" >> "$LOG"
    exit 0
  fi
  echo "$(date -u +%H:%M:%S) round $round: creating $REPO ..." >> "$LOG"
  if gh repo create "taufan98/$REPO" --public --source "$DIR" --push >> "$LOG" 2>&1; then
    echo "$(date -u +%H:%M:%S) round $round: $REPO CREATED+PUSHED" >> "$LOG"
    echo "$(date -u +%H:%M:%S) ALL DONE" >> "$LOG"
    exit 0
  else
    echo "$(date -u +%H:%M:%S) round $round: $REPO FAILED (rate limit?)" >> "$LOG"
  fi
  [ "$round" = "12" ] && { echo "$(date -u +%H:%M:%S) ROUNDS EXHAUSTED" >> "$LOG"; exit 1; }
  sleep 300
done
