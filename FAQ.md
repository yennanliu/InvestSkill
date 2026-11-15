# FAQ & Troubleshooting

Frequently asked questions and fixes for common issues with InvestSkill. A Traditional Chinese version is on the site: [常見問題](https://yennj12.js.org/InvestSkill/faq-zh-tw.html).

---

## Table of Contents

- [Installation](#installation)
- [Platforms](#platforms)
- [Choosing and Using Skills](#choosing-and-using-skills)
- [Data and Accuracy](#data-and-accuracy)
- [Output and Reports](#output-and-reports)
- [Versions and Updates](#versions-and-updates)
- [Bugs, Features and Help](#bugs-features-and-help)
- [Advanced](#advanced)

---

## Installation

**Q: What is the quickest way to install InvestSkill?**

A: One command, from the project directory where you want to use it. Pick your agent with `-a`:

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude
# agents: claude · cursor · copilot · gemini · codex · opencode · any
```

The installer copies every framework into `.investskill/prompts/` and wires up your agent's own entry point:

| `-a` | Wires up |
|------|----------|
| `claude` | `.claude/skills/<skill>/SKILL.md` (slash commands) |
| `cursor` | `.cursor/rules/investskill.mdc` |
| `copilot` | `.github/copilot-instructions.md` |
| `gemini` | `GEMINI.md` |
| `codex`, `opencode` | `AGENTS.md` |
| `any` | `.investskill/prompts/` only — paste into any LLM |

Run it with `-l` to print this list, `-h` for every option.

**Q: How do I install it in Claude Code as a plugin?**

A: Through the plugin marketplace:

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
/us-stock-analysis:stock-eval AAPL
```

The marketplace install gives namespaced commands (`/us-stock-analysis:<skill>`); `install.sh -a claude` installs project-level skills you call as `/<skill>`. Use either — not both in the same project, or every skill will appear twice.

**Q: Is it safe to pipe the installer to `bash`?**

A: It only copies markdown files and appends a marked block to your agent's config file. It never overwrites an existing file — instruction files are appended to between `<!-- InvestSkill:begin -->` and `<!-- InvestSkill:end -->` markers — and running it a second time changes nothing. If you'd rather check first, read [install.sh](install.sh) or download it and run it locally.

**Q: Can I install for my user account instead of one project?**

A: Yes — add `-g` to install into your home directory instead of the current project, or `-d DIR` to target another directory. `-r REF` installs from a specific branch or tag.

**Q: The plugin doesn't appear after installing it in Claude Code.**

A:
1. Restart Claude Code (`exit`, then `claude` again).
2. Check it is listed: `/plugin list` should show `us-stock-analysis`.
3. If not, remove and re-add the marketplace: `/plugin marketplace remove invest-skill`, then `/plugin marketplace add yennanliu/InvestSkill` and install again.

**Q: I get a "plugin not found" error.**

A: Check the marketplace is registered with `/plugin marketplace list`, then install with the full name `us-stock-analysis@invest-skill`. A network problem during `marketplace add` is the other common cause — re-run it.

**Q: How do I update or uninstall?**

A: In Claude Code, `/plugin marketplace update invest-skill` pulls the latest version; `/plugin uninstall us-stock-analysis` removes it. For `install.sh` installs, re-run the same command to update (it refreshes `.investskill/prompts/`); to uninstall, delete `.investskill/` and the `InvestSkill:begin … InvestSkill:end` block (or the `.claude/skills/` / `.cursor/rules/investskill.mdc` files it created).

---

## Platforms

**Q: Which platforms are supported?**

A: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Codex, OpenCode, and any chat LLM (ChatGPT, Claude.ai, Gemini web, local models through [Ollama](README-ollama.md)). The skills are plain markdown, so anything that can read a prompt can use them. See [Platform Compatibility](PLATFORM-COMPATIBILITY.md) for a side-by-side.

**Q: Are all 39 skills available on every platform?**

A: Yes. Every platform gets the same 39 skills: 34 analysis frameworks, 3 aliases (`fundamental-analysis`, `dcf-valuation`, `research-bundle`, which redirect to the skill that absorbed them), and 2 output tools (`report-generator` and `basket-report`).
- **Claude Code**: all 39 skills as slash commands
- **Cursor, Gemini CLI, Codex, OpenCode**: all 39 skills as `@.investskill/prompts/<skill>.md` files (or `@prompts/<skill>.md` inside a clone of the repo)
- **Copilot**: all 39 skills, referenced from `.github/copilot-instructions.md`
- **Any LLM**: 39 prompts in `prompts/`, one per skill

**Q: Why is the advertised count 34 and not 39?**

A: `report-generator` and `basket-report` are output tools — the first renders other skills' results as HTML/PDF, the second packages `compare` and `full-report` runs on a 2–5 stock basket into one linked deliverable — not analysis frameworks, and the three aliases are kept only so old commands keep working. They ship with the plugin but aren't counted.

**Q: How do I use a skill in Cursor, Gemini CLI, Codex or OpenCode?**

A: After `install.sh`, reference the prompt file in chat:

```
@.investskill/prompts/stock-eval.md Evaluate AAPL
```

The rule / instructions file the installer wrote tells the agent the frameworks exist, so you can also just ask ("run the bear-case framework on TSLA").

**Q: Cursor or Gemini doesn't seem to load the rules.**

A:
1. Check the file exists: `.cursor/rules/investskill.mdc` (Cursor) or `GEMINI.md` (Gemini) in the project root.
2. Make sure you opened / started the agent **in that directory** — Gemini CLI only reads `GEMINI.md` from where it was started.
3. Restart the editor or CLI session.
4. Ask "What InvestSkill frameworks are available?" — the agent should list them.

**Q: `@` file references don't resolve.**

A: Check the path: after `install.sh` the prompts are in `.investskill/prompts/`, not `prompts/`. File names use hyphens (`stock-eval.md`, not `stock_eval.md`).

**Q: How do I use it in ChatGPT, Claude.ai or another chat app?**

A: Paste the contents of a prompt file as your first message (or as a custom instruction / project prompt), then ask for the analysis: `cat .investskill/prompts/stock-eval.md | pbcopy` on macOS.

**Q: Can I run it fully offline?**

A: Yes, with a local model — see the [Ollama guide](README-ollama.md). The frameworks themselves need no network; only fetching live market data does, and with a local model you paste that data in yourself.

**Q: If I start an analysis in Claude Code, can I continue it in Cursor?**

A: Not as one session — each platform keeps its own context. The frameworks are identical everywhere, so copy the output across, or use `full-report` to produce a single HTML file you can share.

---

## Choosing and Using Skills

**Q: Which skill should I start with?**

A: `stock-eval` — it covers quality, value and risk in one pass and ends with a go/no-go signal. The [Choose a Skill](site/content/CHOOSE-A-SKILL.md) page maps every goal to the right framework.

**Q: What happened to `fundamental-analysis`, `dcf-valuation` and `research-bundle`?**

A: They were merged into larger skills and are now aliases: `fundamental-analysis` → `stock-eval`, `dcf-valuation` → `stock-valuation` (DCF is its Method 1), `research-bundle` → `full-report` (`--depth quick / standard / comprehensive`). The old commands still work and point you to the new skill.

**Q: Which skill should I use for valuation?**

A: `stock-valuation` — DCF, comparable companies, EV multiples and residual income in one model, with a sensitivity table. Pair it with `bear-case` to stress the assumptions.

**Q: How do I compare several stocks?**

A: `compare` puts 2–5 tickers on one table and argues the pick (`/compare AAPL MSFT GOOGL`). For a wider list, `stock-screener` ranks many tickers across valuation, quality, momentum, sentiment and growth.

**Q: How do I check whether a company's earnings or balance sheet can be trusted?**

A: `forensic-accounting` scores manipulation risk (Beneish M-Score, Altman Z, accruals, cash-vs-earnings divergence). `credit-check` looks at solvency and refinancing risk — the debt maturity wall, interest coverage and liquidity runway.

**Q: What should I run around earnings?**

A: Before the print: `earnings-preview` (consensus vs. whisper, implied move, a three-scenario grid). After: `earnings-call-analysis` on the transcript, then `thesis-tracker --update` to see whether your thesis still holds.

**Q: Does it cover ETFs, taxes and portfolio risk?**

A: Yes — `etf-analysis` (cost, tracking, overlap, structure), `tax-lens` (US tax mechanics, plus a `--non-us` module for foreign investors; educational, never tax advice), `portfolio-review` (allocation and rebalancing) and `risk-stress-test` (scenario replay, VaR/CVaR, liquidity).

**Q: How do I learn from my own trades?**

A: Write the thesis with `thesis-tracker` when you buy, then run `trade-postmortem` after you sell — it separates process from outcome and pulls out one lesson for your journal. `learning-coach` explains any skill's output metric by metric.

**Q: Can I use InvestSkill for crypto, forex, commodities or non-US stocks?**

A: Not reliably. The frameworks are built around US-listed equities and SEC filings. ETFs, US-listed ADRs and equity options (`options-analysis`) are covered; crypto, forex and commodities are not.

**Q: What if the ticker doesn't exist or is delisted?**

A: The skill will report missing data rather than invent it — every analysis skill has a data-validation gate. Always use the ticker (`AAPL`), not the company name.

---

## Data and Accuracy

**Q: Does InvestSkill fetch live market data?**

A: InvestSkill itself fetches nothing — it has no runtime. If your assistant can browse or call tools, the skills tell it which primary sources to read; otherwise it falls back to training data, which is out of date. Every analysis opens with a **Data & Sources** header so you can see which it used. For current prices, paste them in.

**Q: Can I paste my own financial data?**

A: Yes, and it is the most accurate way to work. Paste statements, a 10-K / 10-Q / 8-K, an earnings-call transcript or your holdings, then ask for the analysis:

```
@.investskill/prompts/financial-report-analyst.md
[paste the 10-K text]
Analyze financial quality and red flags
```

**Q: My assistant can't browse. How do I get the filing?**

A: Two optional zero-dependency scripts in the repo fetch the primary source for you to paste: `node scripts/fetch-edgar.js AAPL --form 10-K` saves the filing as text, and `node scripts/fetch-fundamentals.js AAPL` builds a reconciled statement pack from the SEC's XBRL data. They are not part of the plugin. See [Data & Accuracy](site/content/DATA-AND-ACCURACY.md).

**Q: How much history should I provide?**

A: At least two years of annual reports; five years for trend analysis; ten for cyclical businesses.

**Q: How do I check an analysis for hallucinated numbers?**

A: Run `fact-check` on it — it checks every figure against a primary source, recomputes derived numbers and re-issues the report with citations. `result-validator` then scores data quality, methodology and signal consistency.

---

## Output and Reports

**Q: What is the Investment Signal block?**

A: Every skill ends with the same box, so results are comparable across skills:

```
╔══════════════════════════════════════════════╗
║              INVESTMENT SIGNAL               ║
╠══════════════════════════════════════════════╣
║ Signal:      BULLISH / NEUTRAL / BEARISH     ║
║ Confidence:  HIGH / MEDIUM / LOW             ║
║ Horizon:     SHORT / MEDIUM / LONG-TERM      ║
║ Score:       X.X / 10                        ║
╠══════════════════════════════════════════════╣
║ Action:      BUY / HOLD / SELL               ║
║ Conviction:  STRONG / MODERATE / WEAK        ║
╚══════════════════════════════════════════════╝
```

The Score maps to the Signal (8–10 strongly bullish … 0–1.9 strongly bearish). Confidence should be LOW when the data is thin or from model memory. It is an educational summary, not a recommendation.

**Q: Can I get an HTML or PDF report?**

A: Yes. `full-report AAPL` runs several modules and saves a standalone HTML report to `output/`; `report-generator` turns any analysis into HTML you can print to PDF. Both work on any platform that can write files; in a chat app, copy the HTML into a file yourself.

**Q: Can I get charts?**

A: `chart-master` produces Mermaid, ASCII or Chart.js charts (moving averages, candlesticks, RSI/MACD and more) from the data in your analysis.

**Q: Can I get the output in Traditional Chinese?**

A: Ask for it in your request. `10k-digest` and `learning-coach` have an explicit `--lang zh-TW` option.

---

## Versions and Updates

**Q: Which version am I on?**

A: In Claude Code, `/plugin list` shows the installed version. In a clone of the repo, `jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json`. The latest release and what changed in each version are in [CHANGELOG.md](CHANGELOG.md) and on the [Releases page](https://github.com/yennanliu/InvestSkill/releases).

**Q: Which versions are supported?**

A: The latest minor release. Fixes ship as a new patch release rather than as backports — see [SECURITY.md](SECURITY.md).

**Q: How are versions numbered?**

A: SemVer. A new skill or capability is a minor release (1.12 → 1.13), fixes and prompt refinements are a patch, and breaking changes to skill names or the output contract are a major release.

**Q: Will my analysis change if I upgrade?**

A: It can — frameworks are refined between releases, so scores and confidence may shift. The signal block format stays the same within a major version. Re-run anything you rely on after an upgrade, and always verify important decisions independently.

**Q: Which Claude Code, Cursor or model version do I need?**

A: A recent version of your tool with skill / rules support; there's no hard minimum beyond that. InvestSkill is plain markdown and runs on any model — more capable models handle multi-module runs like `full-report` best.

---

## Bugs, Features and Help

**Q: How do I report a bug?**

A: Open a [GitHub Issue](https://github.com/yennanliu/InvestSkill/issues) with the platform, the version, the exact command, what you expected, and what you got (paste the output in a code block).

**Q: How do I suggest a feature?**

A: Start a [GitHub Discussion](https://github.com/yennanliu/InvestSkill/discussions) with the use case and an example of how you'd use it.

**Q: Where do I ask questions?**

A: [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions) for questions, [Issues](https://github.com/yennanliu/InvestSkill/issues) for bugs. The [Cookbook](https://yennj12.js.org/InvestSkill/cookbook.html) has worked examples for every skill.

---

## Advanced

**Q: Can I modify a framework?**

A: Yes — copy a prompt from `prompts/` (or `.investskill/prompts/`) and edit it. Keep the closing Investment Signal block if you want results to stay comparable.

**Q: Can I add my own skill or contribute one?**

A: Yes. `node scripts/new-skill.js <name> --category … --title … --desc …` scaffolds the skill with the full output contract and wires it into every file; see [ADDING-NEW-SKILLS.md](ADDING-NEW-SKILLS.md) and [CONTRIBUTING.md](CONTRIBUTING.md), then open a PR.

**Q: Why is an analysis slow?**

A: Multi-module skills (`full-report --depth comprehensive`) do far more work than a single skill like `stock-eval`. Use `--depth quick` or a single skill when you need a fast answer, or switch to a faster model.

**Q: Can I use the prompts programmatically?**

A: Yes — load a prompt as the system message:

```python
import anthropic

with open("prompts/stock-eval.md") as f:
    framework = f.read()

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    system=framework,
    messages=[{"role": "user", "content": "Evaluate AAPL"}],
)
```

---

## Still Need Help?

- [README](README.md) — overview and install
- [Cookbook](https://yennj12.js.org/InvestSkill/cookbook.html) — examples for every skill
- [Platform guides](README-claude-code.md) — Claude Code, [Cursor](README-cursor.md), [Gemini CLI](README-gemini.md), [Ollama](README-ollama.md)
- [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions) · [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues)
