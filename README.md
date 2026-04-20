<div align="center">

# 📊 InvestSkill

### Professional Investment Analysis for US Stock Market

**18 AI-Powered Analysis Frameworks · Works Everywhere · Fully Open Source**

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=for-the-badge&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=for-the-badge&color=green)](https://github.com/yennanliu/InvestSkill/releases)
[![Test Suite](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/test.yml?style=for-the-badge&label=Tests)](https://github.com/yennanliu/InvestSkill/actions)

[🌐 Live Documentation](https://yennanliu.github.io/InvestSkill/) • [📚 Cookbook](https://yennanliu.github.io/InvestSkill/cookbook.html) • [🐛 Issues](https://github.com/yennanliu/InvestSkill/issues) • [💬 Discussions](https://github.com/yennanliu/InvestSkill/discussions)

</div>

---

## 🎯 What is InvestSkill?

InvestSkill is an enterprise-grade investment analysis toolkit that brings institutional-quality frameworks to every AI platform. Get professional stock analysis with 18 comprehensive frameworks—no financial license required, no API fees.

> **Perfect for**: Investment research • Due diligence • Portfolio management • Financial education • Stock evaluation

<table>
  <tr>
    <td width="50%">
      
### ✨ 18 Professional Frameworks
- 6 Core analysis frameworks
- 2 Financial reports analysis
- 4 Market monitoring tools
- 4 Advanced research tools
- 2 Meta-skills for automation

    </td>
    <td width="50%">
      
### 🔌 Works Everywhere
- Claude Code plugin
- Cursor IDE rules
- Gemini CLI prompts
- GitHub Copilot
- ChatGPT & Claude.ai
- Any LLM

    </td>
  </tr>
</table>

---

## 🚀 Quick Start (30 Seconds)

### Claude Code (Recommended)
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
```

### Cursor or GitHub Copilot
```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .  # or use GitHub Copilot
@prompts/stock-eval.md Evaluate Apple
```

### Gemini CLI
```bash
cd /path/to/InvestSkill
gemini
> @prompts/stock-eval.md Evaluate Apple
```

> 📖 **Full setup guides**: [Claude Code](README-claude-code.md) • [Cursor](README-cursor.md) • [Gemini CLI](README-gemini.md)

---

## 🏆 Core Features

<table>
<tr>
<td width="50%">

### 📊 Valuation & Analysis
- **Stock Valuation** — DCF + comps + EV multiples
- **Fundamental Analysis** — Deep financial dive
- **Technical Analysis** — Patterns & indicators
- **DCF Modeling** — Intrinsic value with scenarios
- **Competitor Moat** — Porter's Five Forces

</td>
<td width="50%">

### 💰 Specialized Analysis
- **Dividend Analysis** — Safety scoring & yield traps
- **Options Analysis** — Greeks, IV, strategies
- **Short Interest** — Squeeze potential
- **Insider Trading** — SEC Form 4 tracking
- **Earnings Calls** — Sentiment & tone analysis

</td>
</tr>
<tr>
<td width="50%">

### 📈 Market Intelligence
- **Institutional Ownership** — 13F tracking
- **Sector Rotation** — Market positioning
- **Economics Analysis** — Macro indicators
- **Portfolio Review** — Allocation optimization
- **Report Generation** — Professional HTML/PDF

</td>
<td width="50%">

### 🔗 Advanced Features
- **Research Bundle** — All frameworks chained
- **Financial Reports** — 10-K/10-Q analysis
- **Multi-Stock Compare** — Side-by-side analysis
- **Batch Analysis** — Process portfolios
- **Scenario Testing** — Bull/Base/Bear cases

</td>
</tr>
</table>

---

## 📋 The 18 Frameworks

| Category | Frameworks | Purpose |
|----------|-----------|---------|
| **Core Analysis** (6) | stock-eval · fundamental-analysis · technical-analysis · economics-analysis · dcf-valuation · stock-valuation | Comprehensive stock evaluation |
| **Financial Reports** (2) | 10-K/10-Q Analyst · Earnings Call | Deep-dive document analysis |
| **Market Monitoring** (4) | Insider Trading · Institutional · Dividends · Short Interest | Activity & sentiment tracking |
| **Advanced** (4) | Competitor · Options · Portfolio · Sector | Specialized research angles |
| **Meta** (2) | Research Bundle · Report Generator | Automation & synthesis |

---

## 💡 Real-World Use Cases

<details open>
<summary><b>📍 Due Diligence for Acquisition</b></summary>

```bash
/us-stock-analysis:stock-eval TARGET
/us-stock-analysis:financial-report-analyst TARGET 10-K
/us-stock-analysis:competitor-analysis TARGET --peers COMPETITORS
/us-stock-analysis:stock-valuation TARGET --methods all
→ Get institutional-quality valuation in minutes
```
</details>

<details>
<summary><b>💼 Portfolio Rebalancing Decision</b></summary>

```bash
/us-stock-analysis:portfolio-review
[paste your holdings]
→ Allocation analysis & optimization recommendations
```
</details>

<details>
<summary><b>🔍 Deep Earnings Analysis</b></summary>

```bash
/us-stock-analysis:fundamental-analysis TICKER --visual
/us-stock-analysis:earnings-call-analysis TICKER
[paste transcript]
→ Management tone, guidance, risks, opportunities
```
</details>

<details>
<summary><b>📈 Options Entry Planning</b></summary>

```bash
/us-stock-analysis:technical-analysis TICKER --chart
/us-stock-analysis:options-analysis TICKER --earnings
→ Technical setup + volatility expectations → strategy selection
```
</details>

---

## 🎯 Platform Guides

<table>
<tr>
<td><b>🔌 Claude Code</b><br><a href="README-claude-code.md">Full Guide →</a><br><br>• Plugin marketplace<br>• 18 slash commands<br>• Advanced workflows</td>
<td><b>🎯 Cursor IDE</b><br><a href="README-cursor.md">Full Guide →</a><br><br>• Auto-loading rules<br>• @prompts/ refs<br>• Natural language</td>
<td><b>💬 Gemini CLI</b><br><a href="README-gemini.md">Full Guide →</a><br><br>• File references<br>• Session memory<br>• Multi-framework chains</td>
<td><b>🤖 GitHub Copilot</b><br><a href="#github-copilot">Full Guide →</a><br><br>• Auto-loads<br>• VS Code & JetBrains<br>• Natural language</td>
<td><b>📚 Universal</b><br><a href="#any-ai-assistant">Full Guide →</a><br><br>• ChatGPT<br>• Claude.ai<br>• Any LLM</a></td>
</tr>
</table>

> **Status**: [Deployment Dashboard](DEPLOYMENT-STATUS.md) — Real-time platform availability & version sync

---

## 🛠️ Installation

### Claude Code (Recommended for Most Users)

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/plugin list  # Verify
```

**Verify Installation:**
```bash
node scripts/setup-verify.js
```

### Cursor IDE (Auto-Loading)

```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .
# Rules auto-load in AI Chat (Cmd+K)
```

### Gemini CLI (Auto-Loading)

```bash
cd /path/to/InvestSkill
gemini
# GEMINI.md auto-loads
# All prompts available via @prompts/
```

### GitHub Copilot (Auto-Loading)

Open repository in **VS Code** or **JetBrains IDE**  
Copilot automatically loads `.github/copilot-instructions.md`

### Universal Access (Any AI)

1. Copy prompt file: `cat prompts/stock-valuation.md | pbcopy`
2. Paste into ChatGPT, Claude.ai, or any LLM
3. Ask your question

---

## 📖 Documentation

| Resource | Content |
|----------|---------|
| **[README.md](README.md)** | This page — overview & features |
| **[Platform Guides](README-claude-code.md)** | Detailed setup for each platform |
| **[FAQ & Troubleshooting](FAQ.md)** | 50+ Q&A covering all platforms |
| **[Adding New Skills](ADDING-NEW-SKILLS.md)** | Contributor guide (12-step process) |
| **[Deployment Status](DEPLOYMENT-STATUS.md)** | Real-time platform sync & health |
| **[Cookbook](https://yennanliu.github.io/InvestSkill/cookbook.html)** | Examples & walkthroughs |
| **[Compatibility Matrix](PLATFORM-COMPATIBILITY.md)** | Feature comparison chart |
| **[CI/CD Guide](CI-CD-GUIDE.md)** | Release automation |

---

## 🎓 Example Workflows

### Workflow 1: Quick Stock Screening
```bash
# 5-minute evaluation
/stock-eval NVDA
/stock-eval AMD  
/stock-eval QCOM
→ Piotroski scores, ROIC, risk matrix for quick go/no-go
```

### Workflow 2: Complete Due Diligence
```bash
# Full institutional analysis
/stock-eval AAPL
/fundamental-analysis AAPL --visual
/technical-analysis AAPL --chart
/stock-valuation AAPL --methods all
/competitor-analysis AAPL --moat
/financial-report-analyst AAPL 10-K
→ Comprehensive 50-page report equivalent
```

### Workflow 3: Earnings Season Research
```bash
# 30-minute earnings playbook
/fundamental-analysis TICKER --visual  # Pre-earnings baseline
/earnings-call-analysis TICKER [paste transcript]  # Post-earnings
/technical-analysis TICKER --chart  # Setup quality
/options-analysis TICKER --earnings  # Vol expectations
→ Complete earnings thesis
```

### Workflow 4: Portfolio Optimization
```bash
/portfolio-review [paste your holdings]
→ Allocation analysis + rebalancing suggestions
```

---

## ✨ What Makes InvestSkill Different

| Feature | InvestSkill | Generic AI |
|---------|-----------|-----------|
| **18 Curated Frameworks** | ✅ Built-in | ❌ Manual setup |
| **Signal Blocks** | ✅ Standardized | ❌ Inconsistent |
| **All Platforms** | ✅ Native support | ❌ Workarounds |
| **No API Fees** | ✅ Free | ❌ Paid APIs |
| **Offline Prompts** | ✅ All included | ❌ External links |
| **Professional Quality** | ✅ Institutional | ⚠️ Variable |
| **Educational** | ✅ Teaches frameworks | ❌ Just answers |

---

## 🤝 Contributing

### Add a New Skill

See [**ADDING-NEW-SKILLS.md**](ADDING-NEW-SKILLS.md) for comprehensive guide:
- 12-step walkthrough
- File structure templates
- Platform sync checklist
- Testing procedures

### Report Issues

Found a bug? [Open an issue](https://github.com/yennanliu/InvestSkill/issues) with:
- Platform & version
- Steps to reproduce
- Expected vs. actual behavior

### Suggest Features

[Start a discussion](https://github.com/yennanliu/InvestSkill/discussions) with:
- Feature description
- Use case example
- Why it helps InvestSkill users

---

## 📊 Project Status

<table>
<tr>
<td width="50%">

**Current Version:** 1.4.0  
**Skills:** 18 frameworks  
**Prompts:** 17 universal files  
**Platforms:** 5 supported  

</td>
<td width="50%">

**Tests:** 292 passing ✅  
**CI/CD:** All workflows passing  
**Documentation:** Complete  
**License:** MIT (open source)

</td>
</tr>
</table>

**Recent Improvements:**
- ✅ Automated changelog generation
- ✅ Interactive release CLI
- ✅ Dry-run deployment validation
- ✅ 22 integration tests
- ✅ Release notification bot
- ✅ Comprehensive contributor guide
- ✅ Platform-specific documentation

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## ⚖️ Legal Disclaimer

**Educational Use Only.** InvestSkill provides analytical frameworks for learning and research purposes.

> This toolkit does **NOT** constitute financial advice. Always:
> - Consult qualified financial advisors
> - Do your own research (DYOR)
> - Verify analysis independently
> - Consider your risk tolerance

**Past performance ≠ future results**

---

## 🙋 Support & Community

**Questions?**
- 📖 [FAQ & Troubleshooting](FAQ.md) — 50+ answers
- 💬 [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions) — Ask the community
- 🐛 [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues) — Report problems

**Stay Updated:**
- ⭐ Star the repo for updates
- 🔔 Watch for new releases
- 📧 GitHub notifications

---

<div align="center">

### Made with ❤️ for the investment research community

**[GitHub](https://github.com/yennanliu/InvestSkill)** • **[Website](https://yennanliu.github.io/InvestSkill/)** • **[Issues](https://github.com/yennanliu/InvestSkill/issues)** • **[Discussions](https://github.com/yennanliu/InvestSkill/discussions)**

</div>
