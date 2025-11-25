#!/bin/bash
# Codex CLI Review Hook for Claude Code
# Triggers after Claude Code stops responding
# Output is fed back into Claude Code's context

set -e

PROJECT_DIR="/home/geni/Documents/vale-village"
cd "$PROJECT_DIR"

# Read stdin JSON (contains transcript_path, session_id, cwd)
STDIN_DATA=$(cat)

# Parse transcript path from stdin
TRANSCRIPT_PATH=$(echo "$STDIN_DATA" | jq -r '.transcript_path // empty' 2>/dev/null || echo "")

# Get diff of uncommitted changes
DIFF=$(git diff HEAD 2>/dev/null || git diff 2>/dev/null || echo "")

# Skip if no changes or tiny changes
if [ -z "$DIFF" ]; then
  exit 0
fi

LINES_CHANGED=$(echo "$DIFF" | wc -l)
if [ "$LINES_CHANGED" -lt 10 ]; then
  exit 0
fi

# Check if codex is available
if ! command -v codex &> /dev/null; then
  echo "[Codex Review] codex CLI not installed. Run: npm install -g @openai/codex"
  exit 0
fi

# Extract recent conversation context if transcript available
CONTEXT=""
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  CONTEXT=$(tail -30 "$TRANSCRIPT_PATH" | jq -r 'select(.type == "user" or .type == "assistant") | "\(.type): \(.message.content // .content // "[tool]" | tostring | .[0:200])"' 2>/dev/null | tail -10 || echo "")
fi

echo ""
echo "========================================"
echo "[Codex Review] Reviewing $LINES_CHANGED lines of changes..."
echo "========================================"

# Build prompt
PROMPT="Review this git diff for bugs, security issues, and code quality.

CHANGES:
$DIFF"

if [ -n "$CONTEXT" ]; then
  PROMPT="$PROMPT

CONVERSATION CONTEXT (what was discussed):
$CONTEXT

Verify the changes match what was requested."
fi

# Run Codex review (use gpt-4o as fallback if codex model unavailable)
codex exec --full-auto --model gpt-4o "$PROMPT" 2>&1 || echo "[Codex Review] Review failed - check API key/auth"

echo "========================================"
echo "[Codex Review] Complete"
echo "========================================"
