#!/bin/bash
# Codex CLI Review Hook for Claude Code
# Triggers after Claude Code stops responding
# Output is fed back into Claude Code's context

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/home/user/vale-village}"
cd "$PROJECT_DIR"

# Get diff of uncommitted changes
DIFF=$(git diff HEAD 2>/dev/null || git diff 2>/dev/null || echo "")

# Skip if no changes
if [ -z "$DIFF" ]; then
  exit 0
fi

# Count changed lines (skip review for tiny changes)
LINES_CHANGED=$(echo "$DIFF" | wc -l)
if [ "$LINES_CHANGED" -lt 10 ]; then
  exit 0
fi

echo ""
echo "=========================================="
echo "[CODEX REVIEW] Reviewing $LINES_CHANGED lines of changes..."
echo "=========================================="

# Check if codex CLI is available
if command -v codex &> /dev/null; then
  # Run codex in quiet/headless mode
  # The review output will be fed back to Claude Code
  echo "$DIFF" | codex --quiet --approval-mode full-auto \
    "You are a code reviewer. Review this git diff for:
1. Bugs or logic errors
2. Security vulnerabilities
3. TypeScript type issues
4. Violations of project conventions

Be concise. Only mention actual issues. If the code looks good, say 'LGTM'.

Diff:
"
else
  # Fallback: just show what would be reviewed
  echo "[CODEX REVIEW] Codex CLI not found. Install with: npm install -g @openai/codex"
  echo "[CODEX REVIEW] Changes pending review:"
  echo "$DIFF" | head -50
  if [ "$LINES_CHANGED" -gt 50 ]; then
    echo "... ($LINES_CHANGED total lines)"
  fi
fi

echo ""
echo "=========================================="
echo "[CODEX REVIEW] Complete"
echo "=========================================="
