# InvestSkill for Ollama

Run all 25 InvestSkill frameworks on **local open-source models** (Qwen, Llama, DeepSeek, Mistral…) via [Ollama](https://ollama.com) — no API key, no per-token cost, and your data stays on your machine.

**For multi-platform setup**, see [README.md](README.md).

---

## How it works

InvestSkill has no runtime — every framework is a plain-markdown prompt in [`prompts/`](prompts/). "Using it with Ollama" just means feeding one of those prompts to a local model. There is one thing to get right:

> ⚠️ **The frameworks need live market data** (current price, filings, earnings). A model in `ollama run` has **no internet** — it only sees what you give it. So pick a path:

| Path | Live data | Best for |
|------|:---------:|----------|
| **A — Plain `ollama run`** — paste the framework, then paste the data yourself | Manual | Quick, fully private, zero setup |
| **B — Tool-capable client** pointed at Ollama's OpenAI-compatible endpoint (Open WebUI, Continue.dev, Cline…) with a web-search tool enabled | Automatic | Full experience, closest to Claude Code / Gemini |

The framework files are identical either way — only how the model gets its data differs.

---

## Quick start

### 1. Install Ollama and pull a model

```bash
# https://ollama.com/download
ollama pull qwen2.5:32b        # recommended floor for reliable formatting + tool use
```

### Path A — paste (simplest)

```bash
ollama run qwen2.5:32b
```

Paste a framework, then the data it asks for:

```
>>> [paste the contents of prompts/stock-eval.md]

Evaluate Apple (AAPL). Live data (source: Google Finance, 2026-07-18):
- Price: $XXX   P/E: XX   Revenue: $XXB   [paste the figures the framework requests]
```

**Reusable shortcut** — bake a framework into a named model with a Modelfile:

```
# Modelfile
FROM qwen2.5:32b
SYSTEM """
<paste the full contents of prompts/stock-eval.md here>
"""
```

```bash
ollama create invest-eval -f Modelfile
ollama run invest-eval "Evaluate AAPL. Data below: ..."
```

### Path B — automatic data (tool-capable client)

Point any tool-capable client at Ollama's OpenAI-compatible endpoint (`http://localhost:11434/v1`), enable its web-search/fetch tool, and load a `prompts/*.md` file as the system prompt. The model then fetches prices and filings itself — matching the Claude Code / Gemini experience. Common clients: **Open WebUI** (built-in web search), **Continue.dev**, **Cline**.

---

## Recommended models

| Model | Notes |
|-------|-------|
| `qwen2.5:32b` · `llama3.1:70b` · `deepseek-r1:32b` | Reliable tables + Signal Block, dependable tool calls — **recommended** |
| `qwen2.5:14b` | Usable; occasional format drift |
| any `*:7b` / `*:8b` | Runs, but expect broken tables, skipped data fetches, and hallucinated numbers — not advised for real analysis |

Bigger is better here: the frameworks are long (500–4,200 words) and demand disciplined, structured output.

---

## Honest limitations

- **Output quality tracks model size.** Small local models drop the box-drawing Signal Block, mangle tables, and — worst — invent prices instead of fetching or asking. Prefer ≥ 32B.
- **No auto-load config.** Unlike Gemini (`GEMINI.md`) or Cursor (`.cursor/rules/`), Ollama has no project config — you load frameworks manually (paste, Modelfile, or client system prompt).
- **Data access is your setup's job, not Ollama's** — see Path A vs B above.
- **Always verify the numbers.** The frameworks say never trust training-data prices; on a local model, enforce that yourself.

---

## Documentation

- [README.md](README.md) — all platforms
- [PLATFORM-COMPATIBILITY.md](PLATFORM-COMPATIBILITY.md) — feature comparison
- [`prompts/`](prompts/) — the 25 framework files

---

*Educational analysis only — not financial advice. Verify independently and consult a qualified advisor.*
