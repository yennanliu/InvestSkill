#!/usr/bin/env bash
#
# InvestSkill installer — wires the InvestSkill analysis frameworks into your AI coding agent.
#
#   curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude
#
# There is no runtime and nothing is compiled: the script copies markdown prompts
# into your project and adds a small pointer block to your agent's config file.
#
set -euo pipefail

REPO="yennanliu/InvestSkill"
REF="main"
AGENT="claude"
DIR="$PWD"
GLOBAL=0

MARK_BEGIN="<!-- InvestSkill:begin -->"
MARK_END="<!-- InvestSkill:end -->"

AGENTS="claude cursor copilot gemini codex opencode any"

# ── output helpers ───────────────────────────────────────────────────────────
if [ -t 1 ]; then
  B=$'\033[1m'; DIM=$'\033[2m'; GRN=$'\033[32m'; RED=$'\033[31m'; RST=$'\033[0m'
else
  B=''; DIM=''; GRN=''; RED=''; RST=''
fi
say()  { printf '%s\n' "$*"; }
ok()   { printf '%s✓%s %s\n' "$GRN" "$RST" "$*"; }
info() { printf '%s·%s %s\n' "$DIM" "$RST" "$*"; }
die()  { printf '%s✗%s %s\n' "$RED" "$RST" "$*" >&2; exit 1; }

usage() {
  cat <<EOF
${B}InvestSkill installer${RST}

  curl -fsSL https://raw.githubusercontent.com/$REPO/main/install.sh | bash -s -- -a AGENT

${B}Options${RST}
  -a AGENT   Target agent: $AGENTS  (default: claude)
  -d DIR     Install into DIR (default: current directory)
  -g         Install for the user, not one project (\$HOME instead of DIR)
  -r REF     Branch or tag to install from (default: main)
  -l         List supported agents and where each one is wired
  -h         Show this help

${B}What it installs${RST}
  .investskill/prompts/*.md   every framework (and alias), as plain markdown
  plus one agent-native entry point (a skill, a rule, or an instructions block)
EOF
}

list_agents() {
  cat <<EOF
${B}Agent            Installs to${RST}
claude           .claude/skills/<skill>/SKILL.md   (slash commands)
cursor           .cursor/rules/investskill.mdc
copilot          .github/copilot-instructions.md
gemini           GEMINI.md
codex            AGENTS.md
opencode         AGENTS.md
any              .investskill/prompts/ only (paste into any LLM)
EOF
}

while getopts ":a:d:r:glh" opt; do
  case "$opt" in
    a) AGENT="$OPTARG" ;;
    d) DIR="$OPTARG" ;;
    r) REF="$OPTARG" ;;
    g) GLOBAL=1 ;;
    l) list_agents; exit 0 ;;
    h) usage; exit 0 ;;
    :) die "Option -$OPTARG needs a value. Try -h." ;;
    \?) die "Unknown option -$OPTARG. Try -h." ;;
  esac
done

AGENT=$(printf '%s' "$AGENT" | tr '[:upper:]' '[:lower:]')
case " $AGENTS " in
  *" $AGENT "*) ;;
  *) die "Unsupported agent '$AGENT'. Supported: $AGENTS" ;;
esac

[ "$GLOBAL" -eq 1 ] && DIR="$HOME"
command -v curl >/dev/null 2>&1 || die "curl is required."
command -v tar  >/dev/null 2>&1 || die "tar is required."
mkdir -p "$DIR" || die "Cannot write to $DIR"

# ── fetch ────────────────────────────────────────────────────────────────────
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

say ""
say "${B}InvestSkill${RST} → $AGENT ${DIM}($DIR)${RST}"
info "Downloading ${REPO}@${REF} …"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" \
  | tar -xzf - -C "$TMP" --strip-components=1 \
  || die "Download failed. Check the network, or the -r ref '$REF'."
[ -d "$TMP/prompts" ] || die "Archive has no prompts/ directory — wrong ref?"

# ── always: the frameworks themselves ────────────────────────────────────────
PROMPTS_REL=".investskill/prompts"
mkdir -p "$DIR/$PROMPTS_REL"
cp "$TMP/prompts/"*.md "$DIR/$PROMPTS_REL/"
# report-generator and basket-report are output tools and fundamental-analysis / dcf-valuation /
# research-bundle are alias stubs that redirect to the skill that absorbed them
# — all are installed, none is counted as an analysis framework. Keep this list
# in sync with OUTPUT_TOOLS and ALIAS_SKILLS in scripts/lib/skill-registry.js (tests check it).
COUNT=0
ALIASES=0
OUTPUTS=0
for f in "$DIR/$PROMPTS_REL"/*.md; do
  # Bash leaves an unmatched glob literal — skip it rather than counting it.
  [ -e "$f" ] || continue
  case "$(basename "$f" .md)" in
    report-generator|basket-report) OUTPUTS=$((OUTPUTS + 1)) ;;
    fundamental-analysis|dcf-valuation|research-bundle) ALIASES=$((ALIASES + 1)) ;;
    *) COUNT=$((COUNT + 1)) ;;
  esac
done
ok "$COUNT analysis frameworks (+ $ALIASES aliases + $OUTPUTS output tools) → $PROMPTS_REL/"

skill_names() { ls -1 "$TMP/prompts" | sed 's/\.md$//' | sort; }

# A compact, agent-native pointer block. Kept short on purpose: the detail
# lives in the prompt files, which the agent reads on demand.
pointer_block() {
  say "$MARK_BEGIN"
  say "## InvestSkill — investment analysis frameworks"
  say ""
  say "This project includes $COUNT structured US-stock analysis frameworks in \`$PROMPTS_REL/\`."
  say "When the user asks for investment analysis, read the matching framework file and"
  say "follow it exactly — its output contract, tables, and Investment Signal Block."
  say ""
  say "Available frameworks:"
  skill_names | sed 's|^|- `'"$PROMPTS_REL"'/|; s|$|.md`|'
  say ""
  say "Example: *\"Evaluate AAPL\"* → read \`$PROMPTS_REL/stock-eval.md\` and apply it to AAPL."
  say "Educational frameworks only — not financial advice."
  say "$MARK_END"
}

# Append the block once; re-running replaces nothing and duplicates nothing.
wire_into() {
  target="$DIR/$1"
  mkdir -p "$(dirname "$target")"
  if [ -f "$target" ] && grep -qF "$MARK_BEGIN" "$target"; then
    info "$1 already wired — left untouched"
    return
  fi
  if [ -f "$target" ]; then
    { printf '\n'; pointer_block; } >>"$target"
    ok "Appended InvestSkill block → $1"
  else
    pointer_block >"$target"
    ok "Created $1"
  fi
}

# ── per-agent wiring ─────────────────────────────────────────────────────────
case "$AGENT" in
  claude)
    src="$TMP/plugins/us-stock-analysis/skills"
    [ -d "$src" ] || die "Archive has no skills/ directory — wrong ref?"
    mkdir -p "$DIR/.claude/skills"
    cp -R "$src/." "$DIR/.claude/skills/"
    ok "$(ls -1 "$src" | wc -l | tr -d ' ') skills → .claude/skills/"
    say ""
    say "Next: run ${B}claude${RST} → ${B}\"Evaluate AAPL with the stock-eval skill\"${RST}"
    info "Prefer the marketplace? /plugin marketplace add $REPO"
    ;;
  cursor)
    mkdir -p "$DIR/.cursor/rules"
    {
      say "---"
      say "description: InvestSkill — US stock analysis frameworks"
      say "globs: [\"**/*.md\"]"
      say "alwaysApply: false"
      say "---"
      say ""
      pointer_block
    } >"$DIR/.cursor/rules/investskill.mdc"
    ok "Created .cursor/rules/investskill.mdc"
    say ""
    say "Next: open the project in Cursor → ${B}@$PROMPTS_REL/stock-eval.md Evaluate Apple${RST}"
    ;;
  copilot)
    wire_into ".github/copilot-instructions.md"
    say ""
    say "Next: in Copilot Chat → ${B}#file:$PROMPTS_REL/stock-eval.md Evaluate Apple${RST}"
    ;;
  gemini)
    wire_into "GEMINI.md"
    say ""
    say "Next: run ${B}gemini${RST} → ${B}@$PROMPTS_REL/stock-eval.md Evaluate Apple${RST}"
    ;;
  codex|opencode)
    wire_into "AGENTS.md"
    say ""
    say "Next: start $AGENT in this directory → ${B}Evaluate AAPL using the stock-eval framework${RST}"
    ;;
  any)
    say ""
    say "Next: paste a framework into any LLM →"
    say "  ${B}cat $PROMPTS_REL/stock-eval.md${RST}"
    ;;
esac

say ""
info "Docs: https://yennj12.js.org/InvestSkill/ · Uninstall: rm -rf $PROMPTS_REL"
say ""
