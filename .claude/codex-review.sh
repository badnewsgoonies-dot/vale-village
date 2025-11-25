#!/bin/bash
# Codex CLI Review Hook for Claude Code
# Triggers on Stop - receives transcript via stdin
# Passes both git diff AND conversation context to Codex

set -e

# Read stdin JSON (contains transcript_path, session_id, cwd)
STDIN_DATA=$(cat)

# Parse JSON fields
TRANSCRIPT_PATH=$(echo "$STDIN_DATA" | jq -r '.transcript_path // empty')
CWD=$(echo "$STDIN_DATA" | jq -r '.cwd // empty')
PROJECT_DIR="${CWD:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"

cd "$PROJECT_DIR"

# Get git diff
DIFF=$(git diff HEAD 2>/dev/null || git diff 2>/dev/null || echo "")

# Skip if no changes
if [ -z "$DIFF" ]; then
  exit 0
fi

LINES_CHANGED=$(echo "$DIFF" | wc -l)
if [ "$LINES_CHANGED" -lt 10 ]; then
  exit 0
fi

# Extract transcript context (last 50 lines, focusing on assistant messages)
TRANSCRIPT_CONTEXT=""
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  # JSONL format - extract recent assistant messages for context
  TRANSCRIPT_CONTEXT=$(tail -100 "$TRANSCRIPT_PATH" | \
    jq -r 'select(.type == "assistant" or .type == "user") |
           "\(.type): \(.message.content // .content // "[tool use]" | tostring | .[0:500])"' 2>/dev/null | \
    tail -20 || echo "")
fi

echo ""
echo "=========================================="
echo "[CODEX REVIEW] Reviewing $LINES_CHANGED lines with conversation context"
echo "=========================================="

# Check if codex CLI is available
if command -v codex &> /dev/null; then

  # Build the review prompt with context
  REVIEW_PROMPT="You are reviewing code changes made by Claude Code.

## Conversation Context (what was being worked on):
$TRANSCRIPT_CONTEXT

## Git Diff to Review:
$DIFF

## Review Instructions:
1. Check for bugs, logic errors, or incomplete implementations
2. Flag any security vulnerabilities
3. Note TypeScript type issues
4. Check if the changes actually accomplish what was discussed
5. Note any todos or FIXMEs that were left behind

Be concise. Focus on actual issues. Say 'LGTM - changes look good' if no issues found."

  # Run codex in headless mode with full context
  echo "$REVIEW_PROMPT" | codex exec --full-auto -m gpt-5.1-codex-max -c reasoning.effort=xhigh

else
  # Fallback: show what would be reviewed
  echo "[CODEX REVIEW] Codex CLI not found. Install with: npm install -g @openai/codex"
  echo ""
  echo "Transcript context available: $([ -n "$TRANSCRIPT_CONTEXT" ] && echo "YES" || echo "NO")"
  echo "Changes to review: $LINES_CHANGED lines"
  echo ""
  echo "--- Recent conversation ---"
  echo "$TRANSCRIPT_CONTEXT" | head -10
  echo ""
  echo "--- Diff preview ---"
  echo "$DIFF" | head -30
  if [ "$LINES_CHANGED" -gt 30 ]; then
    echo "... ($LINES_CHANGED total lines)"
  fi
fi

echo ""
echo "=========================================="
echo "[CODEX REVIEW] Complete"
echo "=========================================="
