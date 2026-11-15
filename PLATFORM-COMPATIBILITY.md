# InvestSkill Platform Compatibility Matrix

Platform support and feature comparison for InvestSkill. Every platform gets the same content: 39 skills — 34 analysis frameworks, 3 aliases (`fundamental-analysis`, `dcf-valuation`, `research-bundle`) and 2 output tools (`report-generator`, `basket-report`). Only the way they load differs.

## Install

Every non-Claude-Code platform installs with one command — only the `-a` agent changes:

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a <agent>
```

| `-a` | Platform | Wires up |
|------|----------|----------|
| `claude` | Claude Code (project skills) | `.claude/skills/<skill>/SKILL.md` |
| `cursor` | Cursor | `.cursor/rules/investskill.mdc` |
| `copilot` | GitHub Copilot | `.github/copilot-instructions.md` |
| `gemini` | Gemini CLI | `GEMINI.md` |
| `codex` | Codex | `AGENTS.md` |
| `opencode` | OpenCode | `AGENTS.md` |
| `any` | ChatGPT, Claude.ai, Ollama, any LLM | `.investskill/prompts/` only |

Every agent also gets all prompts in `.investskill/prompts/`. Existing instruction files are appended to inside an `InvestSkill:begin … InvestSkill:end` block, never overwritten, and re-running is a no-op. `-g` installs for your user instead of one project.

Claude Code can also install it as a plugin:

```bash
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
```

## Quick Comparison

| Feature | Claude Code | Cursor | Gemini CLI | Copilot | Codex / OpenCode | Any LLM (paste) | Ollama |
|---------|:-----------:|:------:|:----------:|:-------:|:----------------:|:---------------:|:------:|
| **34 analysis frameworks** (+ 3 aliases, 2 output tools) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Slash commands** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Auto-loaded config** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **`@` file references** | ➖ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Fetches live data itself** | ✅ with web tools | ✅ with web tools | ✅ with web tools | ✅ with web tools | ✅ with web tools | depends on the app | only via a tool-capable client |
| **Writes HTML reports to disk** | ✅ | ✅ | ✅ | ✅ | ✅ | copy the HTML yourself | copy the HTML yourself |
| **Works fully offline** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Legend**: ✅ supported · ➖ not applicable · ❌ not supported

InvestSkill itself never fetches data — it has no runtime. "Fetches live data" means the host assistant follows the skills' primary-source recipes with its own tools; without tools, paste the data in. See [Data & Accuracy](site/content/DATA-AND-ACCURACY.md).

---

## Platform Details

### Claude Code

**Type**: native plugin (marketplace) or project skills (`install.sh -a claude`)

- All 39 skills as slash commands — `/us-stock-analysis:<skill>` from the marketplace, `/<skill>` from `install.sh`. Use one method per project, or every skill appears twice.
- Skill arguments (`--depth`, `--lang zh-TW`, `--update`, …) work as written in each skill.
- Works with whichever model the session runs (`/model`).
- Update with `/plugin marketplace update invest-skill`, or re-run `install.sh`.

```bash
/us-stock-analysis:stock-eval AAPL
/us-stock-analysis:compare AAPL MSFT GOOGL
/us-stock-analysis:full-report NVDA --depth standard
```

Guide: [README-claude-code.md](README-claude-code.md)

### Cursor

**Type**: rules (`.cursor/rules/investskill.mdc`, auto-loaded) + prompt files

- Reference a framework with `@.investskill/prompts/<skill>.md`, or ask in plain language — the rule tells Cursor the frameworks exist.
- Rules are per project; run the installer in each project (or `-g`).

```
@.investskill/prompts/stock-valuation.md Analyze AAPL
```

Guide: [README-cursor.md](README-cursor.md)

### Gemini CLI

**Type**: `GEMINI.md` (auto-loaded from the directory you start in) + prompt files

- Start `gemini` in the project directory; reference `@.investskill/prompts/<skill>.md`.
- Works with any Gemini model the CLI can use.

```
> @.investskill/prompts/financial-report-analyst.md [paste 10-K text]
```

Guide: [README-gemini.md](README-gemini.md)

### GitHub Copilot

**Type**: workspace instructions (`.github/copilot-instructions.md`, auto-loaded in Copilot Chat)

- Works in VS Code and JetBrains IDEs with Copilot Chat.
- Ask by framework name ("use the stock-eval framework on AAPL") or attach the prompt file from `.investskill/prompts/`.

### Codex and OpenCode

**Type**: `AGENTS.md` instructions + prompt files

- Both read `AGENTS.md` from the project root; the installer appends an InvestSkill block to it.
- Reference `.investskill/prompts/<skill>.md` or ask by framework name.

### Any chat LLM (ChatGPT, Claude.ai, Gemini web, …)

**Type**: standalone markdown

- `install.sh -a any` (or a clone, or the [prompts/ folder on GitHub](https://github.com/yennanliu/InvestSkill/tree/main/prompts)) gives you the files.
- Paste a prompt as the first message or as a custom instruction, then ask: `cat .investskill/prompts/stock-valuation.md | pbcopy`.
- The model must handle the prompt length — the longest frameworks are several thousand words.

### Ollama (local open-source models)

**Type**: local model runtime (Qwen, Llama, DeepSeek, Mistral…) using the universal prompts

- `install.sh -a any`, then paste a prompt into `ollama run`, bake it into a Modelfile `SYSTEM` block, or point a tool-capable client (Open WebUI, Continue.dev, Cline) at `http://localhost:11434/v1`.
- Fully offline and private with plain `ollama run` — you paste the data yourself.
- Output quality tracks model size: ≥ 32B models (`qwen2.5:32b`, `llama3.1:70b`, `deepseek-r1:32b`) keep the tables and signal block intact; 7B/8B models drop them and invent numbers.

Guide: [README-ollama.md](README-ollama.md)

---

## Choosing a Platform

- **Claude Code** — slash commands, skill arguments, and file output for `full-report` / `report-generator`.
- **Cursor, Copilot, Codex, OpenCode** — you already work in that editor or agent; the frameworks load with the project.
- **Gemini CLI** — a terminal workflow with `@` file references.
- **Any chat LLM** — no install at all; paste and go.
- **Ollama** — offline, private, and free to run, at the cost of more manual data entry.

---

## Troubleshooting by Platform

- **Claude Code** — skills missing: restart, check `/plugin list`; still missing: remove and re-add the marketplace.
- **Cursor** — rules not loading: check `.cursor/rules/investskill.mdc` exists and the project folder is the workspace root, then restart.
- **Gemini CLI** — `GEMINI.md` not loading: start `gemini` from the project directory.
- **Copilot** — instructions not applied: check `.github/copilot-instructions.md` exists and reopen Copilot Chat.
- **Codex / OpenCode** — check `AGENTS.md` contains the InvestSkill block.
- **Any LLM** — prompt too long for the model: use a larger-context model or a shorter framework.
- **Everywhere** — `@` paths: after `install.sh` the prompts are in `.investskill/prompts/`; in a repo clone, `prompts/`.

More answers in the [FAQ](FAQ.md).

---

## Platform-Specific Files

- [GEMINI.md](GEMINI.md) — Gemini CLI instructions (in the repo)
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Copilot instructions
- [.cursor/rules/invest-skill.mdc](.cursor/rules/invest-skill.mdc) — Cursor rules
- [install.sh](install.sh) — the installer for every agent
- Issues: https://github.com/yennanliu/InvestSkill/issues · Discussions: https://github.com/yennanliu/InvestSkill/discussions
