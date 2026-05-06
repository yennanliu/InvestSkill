#!/usr/bin/env bash
# Validates that the plugin is installable by Claude Code and Gemini CLI.
# Does not require auth — checks structure and manifest format only.
set -euo pipefail

PLUGIN_DIR="plugins/us-stock-analysis"
PLUGIN_JSON="$PLUGIN_DIR/.claude-plugin/plugin.json"
ERRORS=0

pass() { echo "  ✅ $1"; }
fail() { echo "  ❌ $1"; ERRORS=$((ERRORS + 1)); }
section() { echo ""; echo "── $1 ──"; }

# ── Claude Code plugin validation ──────────────────────────────────────────

section "Claude Code: plugin.json"

jq empty "$PLUGIN_JSON" 2>/dev/null && pass "Valid JSON" || { fail "Invalid JSON"; exit 1; }

for field in name description version author homepage license; do
  val=$(jq -r ".$field // empty" "$PLUGIN_JSON")
  [ -n "$val" ] && pass "$field = $val" || fail "Missing required field: $field"
done

version=$(jq -r '.version' "$PLUGIN_JSON")
echo "$version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' \
  && pass "Version semver OK: $version" \
  || fail "Version not semver: $version"

# skills field must not be a string array of names (invalid schema)
if jq -e '.skills | arrays | .[0] | strings' "$PLUGIN_JSON" >/dev/null 2>&1; then
  # Check if it's paths (starts with ./) or bare names
  first=$(jq -r '.skills[0]' "$PLUGIN_JSON" 2>/dev/null || true)
  if [[ "$first" == ./* ]]; then
    pass "skills field uses path format"
  else
    fail "skills field contains bare skill names — must be path strings (./...) or omitted"
  fi
else
  pass "skills field absent or uses path format (auto-discovery enabled)"
fi

section "Claude Code: skills directory structure"

SKILLS_DIR="$PLUGIN_DIR/skills"
if [ ! -d "$SKILLS_DIR" ]; then
  fail "skills/ directory missing"
else
  pass "skills/ directory exists"
  skill_count=0
  for skill_dir in "$SKILLS_DIR"/*/; do
    skill=$(basename "$skill_dir")
    if [ -f "$skill_dir/SKILL.md" ]; then
      pass "$skill/SKILL.md present"
      skill_count=$((skill_count + 1))
    else
      fail "$skill/ missing SKILL.md"
    fi
  done
  pass "Total skills: $skill_count"
fi

# ── Gemini CLI validation ───────────────────────────────────────────────────

section "Gemini CLI: GEMINI.md"

if [ ! -f "GEMINI.md" ]; then
  fail "GEMINI.md missing"
else
  pass "GEMINI.md exists ($(wc -l < GEMINI.md) lines)"

  while IFS= read -r line; do
    if echo "$line" | grep -qoE 'prompts/[a-z-]+\.md'; then
      ref=$(echo "$line" | grep -oE 'prompts/[a-z-]+\.md' | head -1)
      [ -f "$ref" ] && pass "Referenced $ref exists" || fail "Referenced $ref NOT FOUND"
    fi
  done < GEMINI.md
fi

section "Gemini CLI: prompts/ directory"

prompt_count=$(ls prompts/*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$prompt_count" -gt 0 ]; then
  pass "$prompt_count universal prompt files found"
else
  fail "No prompt files found in prompts/"
fi

for prompt_file in prompts/*.md; do
  first_line=$(head -1 "$prompt_file")
  if [ "$first_line" = "---" ]; then
    fail "$(basename "$prompt_file") has YAML frontmatter (not AI-agnostic)"
  fi
done

# ── Summary ────────────────────────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════"
if [ "$ERRORS" -gt 0 ]; then
  echo "  RESULT: ❌ $ERRORS error(s) found"
  exit 1
else
  echo "  RESULT: ✅ Plugin install checks passed"
fi
echo "══════════════════════════════════════"
