# FAQ & Troubleshooting

Frequently asked questions and solutions for common issues with InvestSkill.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Platform-Specific Questions](#platform-specific-questions)
- [Usage & Features](#usage--features)
- [Compatibility & Versions](#compatibility--versions)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)
- [Advanced Questions](#advanced-questions)

---

## Installation Issues

### Claude Code

**Q: How do I install the InvestSkill plugin?**

A: 
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/plugin list  # Verify installation
```

**Q: The plugin doesn't appear after installation**

A: 
1. Restart Claude Code: `exit` and re-run `claude`
2. Clear cache: `/plugin marketplace remove yennanliu/InvestSkill` then re-add
3. Check version: `/plugin list` should show `us-stock-analysis v1.4.0`

**Q: I get "plugin not found" error**

A:
- Verify marketplace is added: `/plugin marketplace list`
- Try adding marketplace again: `/plugin marketplace add yennanliu/InvestSkill`
- Check internet connection
- Restart Claude Code

**Q: Can I use it locally without internet?**

A: No. InvestSkill requires internet for:
- Marketplace lookup
- Fetching current financial data
- Live market prices

### Cursor IDE

**Q: How do I set up InvestSkill in Cursor?**

A: Simply open the repository in Cursor — rules auto-load:
```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .
```

The `.cursor/rules/invest-skill.mdc` file auto-loads in Cursor AI Chat.

**Q: Rules not appearing in Cursor AI Chat**

A:
1. Verify `.cursor/rules/invest-skill.mdc` exists: `ls .cursor/rules/invest-skill.mdc`
2. Check file isn't empty: `wc -l .cursor/rules/invest-skill.mdc` (should be 100+)
3. Restart Cursor: Close and reopen
4. Verify rules are loaded: Ask "What analysis frameworks are available?" in Cursor Chat

**Q: @prompts/ references not working**

A:
1. Ensure you're in the InvestSkill directory: `pwd` should end with `/InvestSkill`
2. Verify prompts/ directory exists: `ls prompts/ | wc -l` (should show 17)
3. Check file name spelling: `@prompts/stock-eval.md` (not `stock_eval`)
4. Try full path: `@prompts/stock-valuation.md`

### Gemini CLI

**Q: How do I use InvestSkill with Gemini CLI?**

A:
```bash
cd /path/to/InvestSkill
gemini
# GEMINI.md auto-loads
> @prompts/stock-eval.md Evaluate AAPL
```

**Q: GEMINI.md not auto-loading**

A:
1. Verify you're in InvestSkill directory: `pwd`
2. Check GEMINI.md exists and is valid: `head -20 GEMINI.md`
3. Verify Gemini CLI is installed: `gemini --version`
4. Start fresh: `exit` and re-run `gemini`

**Q: Can I use InvestSkill outside the project directory?**

A: No. Gemini CLI only auto-loads `.md` files from the current directory. You can:
- Always `cd` to InvestSkill before running `gemini`
- Copy `prompts/` to your working directory
- Use `@` to reference files by full path if your Gemini version supports it

### GitHub Copilot

**Q: How do I set up Copilot for InvestSkill?**

A: 
- In VS Code: `.github/copilot-instructions.md` auto-loads
- In JetBrains: Same file auto-loads
- No manual setup needed

**Q: Copilot doesn't understand investment frameworks**

A:
1. Verify `.github/copilot-instructions.md` exists
2. Restart IDE
3. Ask explicitly: "Reference @prompts/stock-eval.md to analyze AAPL"

---

## Platform-Specific Questions

### Can I use skills across different platforms?

**Q: If I start analysis in Claude Code, can I continue in Cursor?**

A: Not directly. Each platform has its own session. However:
- The **same frameworks** are available on all platforms
- You can **copy results** from one platform to another
- Use the `research-bundle` skill for complete analysis you can share

### Do all platforms have the same 18 skills?

**Q: Are all 18 skills available on every platform?**

A: 
- **Claude Code**: ✅ All 18 skills as `/skill-name` commands
- **Cursor**: ✅ All 18 skills as `@prompts/skill-name.md` files
- **Gemini CLI**: ✅ All 18 skills as `@prompts/skill-name.md` files
- **Copilot**: ✅ All 18 frameworks via `.github/copilot-instructions.md`
- **Universal**: ✅ 17 prompts in `prompts/` (report-generator excluded)

**Why is report-generator excluded from Universal?**

Report-generator is an output tool (generates HTML/PDF), not an analysis framework. It works best when integrated with Claude Code's skill system.

### Version differences between platforms

**Q: Are all platforms on the same version?**

A: 
```bash
# Check all versions
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json  # Claude Code
jq '.metadata.version' .claude-plugin/marketplace.json               # Marketplace
grep "version" GEMINI.md | head -1                                   # Gemini
grep "version" .cursor/rules/invest-skill.mdc | head -1             # Cursor
```

All should show **1.4.0** (as of latest release).

If they differ:
```bash
npm run pre-release  # Run validation
git log --oneline | head -5  # Check recent commits
```

---

## Usage & Features

### Stock Analysis

**Q: What's the difference between stock-eval and fundamental-analysis?**

A:
- **stock-eval**: Quick quality scoring (Piotroski F-Score, ROIC/WACC, risk matrix)
  - Use when: You need a fast go/no-go decision
  - Output: Single 0-10 score with verdict
  
- **fundamental-analysis**: Deep financial statement dive
  - Use when: You want detailed financial quality analysis
  - Output: Multi-section analysis with visualizations

**Q: Which skill should I use for valuation?**

A:
- **dcf-valuation**: Single intrinsic value model with sensitivity
  - Use when: You want DCF-based fair value
  
- **stock-valuation**: Multi-method valuation (DCF + CCA + EV/EBITDA + P/E)
  - Use when: You want multiple valuation perspectives
  
- **fundamental-analysis**: Can include basic valuation
  - Use when: You're already doing comprehensive fundamental review

**Q: Can I use InvestSkill for crypto/forex/commodities?**

A: No. InvestSkill is designed specifically for **US stocks**. It won't work reliably for:
- Cryptocurrencies
- Forex pairs
- Commodities (oil, gold, etc.)
- International stocks (outside US)
- Options directly (but has options-analysis for equity options)

**Q: What if a stock doesn't exist or is delisted?**

A:
- Models may return errors or zero data
- Framework will note missing data
- Always verify ticker symbol before analysis
- Use `stock-eval AAPL` not `Apple` — must use ticker

### Data & Inputs

**Q: Can I paste my own financial data?**

A: Yes! Skills support:
- **Paste financial statements**: Balance sheet, income statement, cash flow
- **Paste SEC filings**: 10-K, 10-Q, 8-K text
- **Paste earnings transcripts**: Earnings call transcripts
- **Paste your portfolio**: Holdings list with allocations

Example:
```
@prompts/fundamental-analysis.md
[paste balance sheet and income statement]
Analyze financial quality and trends
```

**Q: What timeframe of data should I provide?**

A:
- **Minimum**: Last 2 years (2 annual reports)
- **Recommended**: Last 5 years (for trend analysis)
- **Ideal**: Last 10 years (for cyclical analysis)

**Q: Does InvestSkill fetch live market data?**

A: 
- Depends on platform and model
- May use training data (knowledge cutoff)
- For latest prices, provide current data in your query
- Always verify prices are up-to-date before making decisions

### Output & Reports

**Q: What's the Investment Signal Block?**

A: Standardized output format at end of every analysis:

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

Use the **Action** field (BUY/HOLD/SELL) as decision guidance.

**Q: Can I generate HTML/PDF reports?**

A: Yes, with Claude Code:
```bash
/us-stock-analysis:report-generator
# Outputs HTML file that you can print to PDF
```

For other platforms, copy analysis output to a document editor.

---

## Compatibility & Versions

### Version & Support

**Q: What version of InvestSkill is current?**

A: **v1.4.0** (released 2026-02-27)

Check your version:
```bash
# Claude Code
/plugin list | grep us-stock-analysis

# Cursor/Gemini (in repository)
jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json
```

**Q: Is my version supported?**

A:
- ✅ v1.4.0 and above: Full support
- ✅ v1.3.0: Full support (cross-AI features)
- ⚠️  v1.2.0 and below: Limited support (missing skills)

**Q: How often are new versions released?**

A:
- **Major versions** (1.0 → 2.0): As needed for significant changes
- **Minor versions** (1.3 → 1.4): Every 2-4 weeks
- **Patch versions** (1.4.0 → 1.4.1): As needed for bug fixes

**Q: Will my analysis change if I upgrade?**

A: Unlikely, but possible:
- Frameworks may be refined (more accurate results)
- Signal scoring may adjust (same direction, possibly different confidence)
- New prompts won't affect old analysis
- **Always verify important decisions independently**

### Platform Compatibility

**Q: Which Claude Code version do I need?**

A:
- **Minimum**: Claude Code v1.0+
- **Recommended**: Latest version
- **Check**: Run `claude --version`

**Q: Does InvestSkill work with Claude 3 / Claude 4?**

A: Yes! InvestSkill is model-agnostic:
- Works with Claude 3 Haiku, Sonnet, Opus
- Works with Claude 4.6 (recommended for best results)
- Works with any LLM via universal prompts

**Q: Which Cursor version do I need?**

A:
- **Minimum**: Cursor 0.30+
- **Recommended**: Latest version
- **Check**: Cursor Settings → About

**Q: Can I use InvestSkill with other Cursor extensions?**

A: Yes! The `.cursor/rules/` approach works alongside other extensions:
- Other rules files auto-load together
- InvestSkill rules don't conflict with standard Cursor features
- Safe to use with other analysis tools

---

## Bug Reports & Feature Requests

### How to Report a Bug

**Q: I found a bug. How do I report it?**

A: Open a [GitHub Issue](https://github.com/yennanliu/InvestSkill/issues) with:

1. **Title**: Brief description (e.g., "stock-eval fails for NVDA")
2. **Platform**: Claude Code / Cursor / Gemini / Copilot / Other
3. **Version**: Output of version check command
4. **Steps to reproduce**:
   ```
   1. Run /stock-eval NVDA
   2. Observe error message
   3. Expected behavior: [what should happen]
   ```
5. **Error message**: Full error text (use code block)
6. **System info**: OS (macOS/Linux/Windows), Claude Code version, etc.

### How to Request Features

**Q: I have a feature idea. How do I suggest it?**

A: Open a [GitHub Discussion](https://github.com/yennanliu/InvestSkill/discussions) with:

1. **Title**: Feature summary (e.g., "Add cryptocurrency analysis skills")
2. **Use case**: Why you need this feature
3. **Example**: How you'd use it
4. **Why InvestSkill**: Why this belongs in InvestSkill vs. other tools

**Q: What features are planned?**

A: See [CHANGELOG.md](CHANGELOG.md) for:
- What's in the current release
- What was added in each version
- Check GitHub Issues for planned features

### Getting Help

**Q: Where can I ask questions?**

A:
- 💬 **GitHub Discussions**: Best for general questions
- 🐛 **GitHub Issues**: For bugs and feature requests
- 📖 **Documentation**: Check README.md, COOKBOOK.md, this FAQ
- 🤔 **Ask in prompts**: You can ask Claude/Gemini how to use skills

---

## Advanced Questions

### Customization

**Q: Can I modify the frameworks?**

A: You can customize locally:

```bash
# Copy framework to your project
cp prompts/stock-eval.md my-custom-stock-eval.md

# Modify it
nano my-custom-stock-eval.md

# Use your version in Claude Code
# Copy content to clipboard and paste into chat
```

**Q: Can I create my own skills?**

A: Yes! See [ADDING-NEW-SKILLS.md](ADDING-NEW-SKILLS.md) for:
- Step-by-step walkthrough
- File structure
- Testing procedures
- Platform sync checklist

**Q: Can I contribute my skills to InvestSkill?**

A: Absolutely! Follow the [ADDING-NEW-SKILLS.md](ADDING-NEW-SKILLS.md) guide and open a PR. We welcome contributions!

### Performance & Optimization

**Q: Why is analysis slow sometimes?**

A:
- Model latency (depends on Claude Code server)
- Complex analysis (research-bundle is slower than stock-eval)
- Network latency (if fetching external data)
- Model capacity (during peak hours)

Optimization:
- Use simpler skills for quick decisions (stock-eval)
- Use research-bundle when you need comprehensive analysis
- Try Claude Sonnet for faster responses than Opus

**Q: Can I batch analyze multiple stocks?**

A: Yes, with `research-bundle`:
```bash
/us-stock-analysis:research-bundle AAPL,MSFT,GOOGL
```

Or manually in sequence:
```bash
/stock-eval AAPL
/stock-eval MSFT
/stock-eval GOOGL
# Then ask for comparison summary
```

### Integration & API

**Q: Can I use InvestSkill programmatically?**

A:
- **Claude Code plugin**: No direct API (use Claude API + plugin context)
- **Universal prompts**: Use Claude API with prompts as system message
- **Gemini CLI**: Run from scripts that call `gemini` command

**Q: Can I integrate with my own tools?**

A: Yes! Copy the prompts into your tool:
```python
# In your Python code
with open('prompts/stock-eval.md') as f:
    framework = f.read()

# Use with Claude API
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    system=framework,
    messages=[{"role": "user", "content": "Evaluate AAPL"}]
)
```

---

## Still Need Help?

- 📚 **[Documentation](README.md)** — Complete setup guides
- 📖 **[Cookbook](COOKBOOK.md)** — Examples and walkthroughs
- 🎯 **[Platform Guides](README-claude-code.md)** — Platform-specific instructions
- 💬 **[GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions)** — Ask questions
- 🐛 **[GitHub Issues](https://github.com/yennanliu/InvestSkill/issues)** — Report problems

---

**Last Updated**: 2026-04-11  
**FAQ Version**: 1.0  
**Covered Skills**: 18  
**Covered Platforms**: 5
