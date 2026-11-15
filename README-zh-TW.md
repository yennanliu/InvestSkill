<div align="center">

# 📊 InvestSkill

### 美股市場專業投資分析工具

**34 個 AI 驅動分析框架 · 全平台支援 · 完全開源**

**無需 API 金鑰 · 無需訂閱 · 完全免費**

[![Cost: $0](https://img.shields.io/badge/%E8%B2%BB%E7%94%A8-%240%20%C2%B7%20%E7%84%A1%E9%A0%88%20API%20%E9%87%91%E9%91%B0-22c55e?style=for-the-badge)](#-無需-api-金鑰完全免費)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=for-the-badge&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=for-the-badge&color=green)](https://github.com/yennanliu/InvestSkill/releases)
[![Test Suite](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/ci.yml?style=for-the-badge&label=Tests)](https://github.com/yennanliu/InvestSkill/actions)

[🌐 線上文件](https://yennj12.js.org/InvestSkill/) • [🎓 投資學習](https://yennj12.js.org/InvestSkill/learning-zh-tw.html) • [📚 操作手冊](https://yennj12.js.org/InvestSkill/cookbook.html) • [🐛 回報問題](https://github.com/yennanliu/InvestSkill/issues) • [💬 社群討論](https://github.com/yennanliu/InvestSkill/discussions) • [🇺🇸 English](README.md)

</div>

---

## 🎯 什麼是 InvestSkill？

InvestSkill 是企業級投資分析工具包，為各 AI 平台帶來機構級分析框架。透過 34 個完整框架進行專業股票分析——無需金融執照，無需 API 費用。

**不用註冊，也不用付費。** 沒有 API 金鑰、沒有資料商訂閱、不必設定帳單——你只要用手上已有的 AI 助理（免費方案或本機模型都可以），InvestSkill 本身就只是 markdown 提示詞。詳見 [無需 API 金鑰，完全免費](#-無需-api-金鑰完全免費)。

> **適合用於**：投資研究 · 盡職調查 · 投資組合管理 · 金融教育 · 股票評估

<div class="home-card">
  <span class="home-card-icon">🎓</span>
  <div class="home-card-body">
    <div class="home-card-title">投資新手？從學習指南開始</div>
    <p>十五堂課的實戰指南，提供繁體中文與英文：第一部用白話講清楚每一項技能背後的概念——讀懂資產負債表、為一門生意估值、持有一個投資組合；第二部是實務基礎——帳戶與下單、ETF 核心、稅（含非美國投資人）、財報季、保護計畫的心理學、總經與聯準會循環，以及給持股人的選擇權。不需財金背景。</p>
    <p><a class="home-card-cta" href="https://yennj12.js.org/InvestSkill/learning-zh-tw.html">開始學習 →</a></p>
  </div>
</div>

<table>
  <tr>
    <td width="50%">

### ✨ 34 個專業框架
- 5 個核心分析框架
- 5 個財務報告分析
- 4 個市場監控工具
- 15 個進階研究工具
- 5 個自動化元技能，加上 report-generator 與 basket-report 兩個輸出工具
- 另有 3 個別名（轉址至吸收它們的技能，不計入框架數）

    </td>
    <td width="50%">

### 🔌 全平台支援
- Claude Code 插件
- Cursor IDE 規則
- Gemini CLI 提示詞
- GitHub Copilot
- Codex 與 OpenCode
- ChatGPT、Claude.ai 與 Ollama 本機模型
- 任何大型語言模型

    </td>
  </tr>
</table>

---

## 🚀 快速開始（30 秒）

### 一行指令安裝（推薦）

在[官網選擇你的 AI 工具](https://yennj12.js.org/InvestSkill/#install)，或直接執行：

```bash
# Claude Code
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude

# 換成你的工具：cursor · copilot · gemini · codex · opencode · any
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a cursor
```

安裝腳本會把所有框架複製到 `.investskill/prompts/`，並接上該工具自己的入口設定：

| `-a` | 工具 | 安裝位置 |
|------|------|----------|
| `claude` | Claude Code | `.claude/skills/<skill>/SKILL.md`（斜線指令） |
| `cursor` | Cursor | `.cursor/rules/investskill.mdc` |
| `copilot` | GitHub Copilot | `.github/copilot-instructions.md` |
| `gemini` | Gemini CLI | `GEMINI.md` |
| `codex` | Codex | `AGENTS.md` |
| `opencode` | OpenCode | `AGENTS.md` |
| `any` | ChatGPT、Claude.ai、Ollama… | 只安裝 `.investskill/prompts/`，複製貼上即用 |

加上 `-g` 可安裝到使用者層級（而非單一專案）、`-d DIR` 指定目錄、`-h` 查看所有選項。既有的指令檔只會**附加**、不會覆蓋，重複執行不會產生重複內容。不想直接 pipe 到 `bash`？先看過腳本：[install.sh](install.sh)。

### Claude Code（外掛市集）
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
/us-stock-analysis:stock-eval AAPL
```

### 或複製整個儲存庫
```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .   # Cursor／Copilot：@prompts/stock-eval.md 評估蘋果公司
gemini     # Gemini CLI：> @prompts/stock-eval.md 評估蘋果公司
```

---

## 💸 無需 API 金鑰，完全免費

使用 InvestSkill **完全免費**——沒有任何東西要購買、註冊或設定。

| | |
|---|---|
| **API 金鑰** | **不需要。** 不用 OpenAI / Anthropic / Alpha Vantage / Polygon 金鑰。這個外掛從不呼叫任何 API——因為它根本沒有可執行的程式碼。 |
| **訂閱費用** | **不需要。** 沒有付費方案、沒有席次授權、沒有用量計費、不用開帳號。 |
| **行情資料費** | **不需要。** 不用 Bloomberg、不用付費資料源。AI 讀取公開申報文件與免費來源——或由你自己把數字貼進去。 |
| **安裝與執行環境** | **不需要。** 每個技能都只是純 markdown 提示詞。本機沒有任何程式在跑，也就不會回傳任何資料。 |
| **授權** | **MIT。** 可自由使用、分支修改，個人或商業用途皆可。 |

**你唯一需要的，是手上已經在用的 AI 助理。** 可以是付費方案（Claude Code、Cursor、Copilot）、免費方案（ChatGPT、Gemini、Claude.ai），也可以是透過 [Ollama](README-ollama.md) 完全離線的本機模型——用後者跑完所有框架，總成本就是 0。

> 因為沒有 API，也就沒有任何遙測：InvestSkill 不會看到你的股票代號、你的持股，或你的分析內容。數字實際從何而來，請見[資料與準確性](site/content/DATA-AND-ACCURACY-zh-TW.md)。

**也能用繁體中文。** 在任何框架後面加上 `--lang zh-TW`，整份分析——標題、內文與表格——都會以繁體中文輸出；Data & Sources 的欄位名稱、訊號方框與 JSON footer 則維持英文，讓工具仍能讀取。網站另有[中文技能參考](https://yennj12.js.org/InvestSkill/skills-zh-tw.html)與[非美國投資人指南](https://yennj12.js.org/InvestSkill/non-us-guide-zh-tw.html)。

**自備資料。** 申報文件類技能（`10k-digest`、`financial-report-analyst`、`fact-check`）內建一份無金鑰的 SEC EDGAR 取檔步驟，具工具能力的助理可自行照做。若你的助理無法上網，倉庫另附兩支可選、零相依的腳本替你抓取第一手來源供貼上——`node scripts/fetch-edgar.js AAPL --form 10-K` 把文件存成純文字，`node scripts/fetch-fundamentals.js AAPL` 從 SEC 的 XBRL 數據產生已對帳的財報資料包。兩者都不屬於外掛本體。詳見[資料與準確性](site/content/DATA-AND-ACCURACY-zh-TW.md#自備資料無金鑰的-edgar-路徑)頁。

---

## 🏆 核心功能

<table>
<tr>
<td width="50%">

### 📊 估值與分析
- **股票估值** — DCF + 比較公司法 + EV 倍數
- **基本面分析** — 深入財務報表分析
- **技術分析** — MA均線圖 (30/60/90/200/365日) + 具體進場/目標/停損建議，圖表形態、RSI/MACD、多時框對齊
- **DCF 建模** — 情境式內在價值估算
- **競爭護城河** — 波特五力分析

</td>
<td width="50%">

### 💰 專項分析
- **股息分析** — 安全評分與殖利率陷阱識別
- **選擇權分析** — Greeks、隱含波動率與策略
- **放空興趣** — 軋空潛力評估
- **內部人交易** — SEC Form 4 追蹤
- **財報電話會議** — 情緒與語調分析

</td>
</tr>
<tr>
<td width="50%">

### 📈 市場情報
- **機構持股** — 13F 申報追蹤
- **產業輪動** — 市場定位分析
- **經濟分析** — 總體經濟指標
- **投資組合檢視** — 配置優化建議
- **報告生成** — 專業 HTML/PDF 報告

</td>
<td width="50%">

### 🔗 進階功能
- **完整報告** — `full-report` 依深度串接多個框架並輸出 HTML
- **財務報告** — 10-K/10-Q 分析
- **多股比較** — `compare` 2–5 檔並排分析並給出選擇
- **批次分析** — 處理整個投資組合
- **情境測試** — 多頭/基本/空頭情境

</td>
</tr>
</table>

---

## 📋 34 個框架總覽

| 類別 | 框架 | 用途 |
|------|------|------|
| **核心分析** (5) | stock-eval · technical-analysis · economics-analysis · stock-valuation · **compare** | 全方位股票評估 |
| **財務報告** (5) | financial-report-analyst · 10k-digest · earnings-call-analysis · **forensic-accounting** · **credit-check** | 深度文件分析 |
| **市場監控** (4) | insider-trading · institutional-ownership · dividend-analysis · short-interest | 活動與情緒追蹤 |
| **進階分析** (15) | competitor-analysis · **industry-map** · options-analysis · portfolio-review · sector-analysis · **stock-screener** · **catalyst-calendar** · **bear-case** · **position-ladder** · **thesis-tracker** · **etf-analysis** · **earnings-preview** · **tax-lens** · **risk-stress-test** · **trade-postmortem** | 專項研究角度 |
| **元技能與輸出** (5 + 2 輸出工具) | full-report · chart-master · result-validator · **fact-check** · **learning-coach** · report-generator、**basket-report**（輸出工具，不計入框架） | 自動化與綜合輸出 |
| **別名** (3，不計入框架) | fundamental-analysis → stock-eval · dcf-valuation → stock-valuation · research-bundle → full-report | 舊名稱仍可用，會轉址到吸收它的技能 |

> 各版本新增了哪些技能與功能，請見 [CHANGELOG](CHANGELOG.md)（英文）。

---

## 💡 實際應用場景

<details open>
<summary><b>📍 收購目標盡職調查</b></summary>

```bash
/us-stock-analysis:stock-eval TARGET
/us-stock-analysis:financial-report-analyst TARGET 10-K
/us-stock-analysis:competitor-analysis TARGET --peers COMPETITORS
/us-stock-analysis:stock-valuation TARGET --methods all
→ 數分鐘內完成機構級估值報告
```
</details>

<details>
<summary><b>💼 投資組合再平衡決策</b></summary>

```bash
/us-stock-analysis:portfolio-review
[貼上您的持股]
→ 配置分析與優化建議
```
</details>

<details>
<summary><b>🔍 深度財報分析</b></summary>

```bash
/us-stock-analysis:stock-eval TICKER --visual
/us-stock-analysis:earnings-call-analysis TICKER
[貼上電話會議記錄]
→ 管理層語調、業績指引、風險與機會
```
</details>

<details>
<summary><b>📈 選擇權進場規劃</b></summary>

```bash
/us-stock-analysis:technical-analysis TICKER --chart
/us-stock-analysis:options-analysis TICKER --earnings
→ 技術面設置 + 波動率預期 → 策略選擇
```
</details>

---

## 🎓 學習這些框架

投資新手，或不確定該用哪個技能？從這裡開始：

| 指南 | 提供什麼 |
|------|---------|
| [概念](site/content/CONCEPTS-zh-TW.md) | 指標背後的思維模型——品質 vs. 價值 vs. 成長、內在價值、護城河、風險與訊號區塊 |
| [術語表](site/content/GLOSSARY-zh-TW.md) | 各技能所產出每個指標的白話定義、公式與好／壞區間 |
| [選擇技能](site/content/CHOOSE-A-SKILL-zh-TW.md) | 把你的目標對應到合適的框架，並比較功能重疊的技能 |
| [使用情境](site/content/USE-CASES-zh-TW.md) | 依投資人類型的端到端旅程——收息、新手、財報、總經、懷疑者 |
| [資料與準確性](site/content/DATA-AND-ACCURACY-zh-TW.md) | 數字從何而來、如何辨識幻覺，以及如何驗證產出 |

---

## 🛠️ 安裝方式

### curl 一行安裝（所有工具通用）

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a AGENT
# AGENT = claude | cursor | copilot | gemini | codex | opencode | any
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -l   # 查看各工具安裝位置
```

詳細對照表見上方[快速開始](#-快速開始30-秒)。

### Claude Code（一般使用者推薦）

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
/plugin list  # 確認安裝
```

**驗證安裝：**
```bash
node scripts/setup-verify.js
```

### Cursor、Gemini CLI、GitHub Copilot、Codex、OpenCode

用上方的 `install.sh` 指令，把 `-a` 換成 `cursor`／`gemini`／`copilot`／`codex`／`opencode` 即可——安裝後規則檔（`.cursor/rules/investskill.mdc`、`GEMINI.md`、`.github/copilot-instructions.md`、`AGENTS.md`）會自動載入，所有提示詞位於 `.investskill/prompts/`。

### 通用存取（任何 AI）

1. `install.sh -a any`（或直接複製儲存庫），取得 `.investskill/prompts/`
2. 複製提示詞：`cat .investskill/prompts/stock-valuation.md | pbcopy`
3. 貼入 ChatGPT、Claude.ai 或任何大型語言模型後提問

---

## 🎓 範例工作流程

### 工作流程 1：快速股票篩選
```bash
# 5 分鐘評估
/stock-eval NVDA
/stock-eval AMD
/stock-eval QCOM
→ Piotroski 評分、ROIC、風險矩陣，快速決策
```

### 工作流程 2：完整盡職調查
```bash
# 完整機構級分析
/stock-eval AAPL --visual
/technical-analysis AAPL --chart
/stock-valuation AAPL --methods all
/competitor-analysis AAPL --moat
/financial-report-analyst AAPL 10-K
→ 相當於完整 50 頁分析報告
```

### 工作流程 3：財報季研究
```bash
# 30 分鐘財報研究流程
/stock-eval TICKER --visual  # 財報前基準線
/earnings-call-analysis TICKER [貼上電話會議記錄]  # 財報後分析
/technical-analysis TICKER --chart  # 技術面設置
/options-analysis TICKER --earnings  # 波動率預期
→ 完整財報投資論點
```

### 工作流程 4：投資組合優化
```bash
/portfolio-review [貼上您的持股]
→ 配置分析 + 再平衡建議
```

---

## ✨ InvestSkill 的差異化優勢

| 功能 | InvestSkill | 通用 AI |
|------|------------|---------|
| **34 個精選框架** | ✅ 內建 | ❌ 需手動設定 |
| **信號區塊** | ✅ 標準化格式 | ❌ 格式不一致 |
| **全平台支援** | ✅ 原生支援 | ❌ 需要變通方案 |
| **零 API 費用** | ✅ 免費 | ❌ 需付費 API |
| **離線提示詞** | ✅ 全部內建 | ❌ 依賴外部連結 |
| **專業品質** | ✅ 機構級 | ⚠️ 品質不穩定 |
| **教育性** | ✅ 教授分析框架 | ❌ 只給答案 |

---

## 📊 專案狀態

**版本：** 最新版——見 [CHANGELOG](CHANGELOG.md)
**技能框架：** 34 個（另有 3 個別名、2 個輸出工具）
**通用提示詞：** 39 個
**支援平台：** 7 個
**測試：** 全數通過 ✅（結構、提示詞同步、技能契約、數量一致性、安裝腳本）

### 沙盒與延伸閱讀

InvestSkill 本身沒有執行環境。以下兩項在這個專案之外：

| 位置 | 內容 |
|------|------|
| [**InvestSkill-test**](https://github.com/yennanliu/InvestSkill-test)——沙盒 | 實際執行這些框架的姊妹專案。GitHub Actions 會 clone 最新版 InvestSkill 並發佈結果：[即時展示](https://yennj12.js.org/InvestSkill-test/showcase/live/index.html)（每個交易日隨機一檔標的，每一次都保留）、四檔股票籃子的[策展展示櫃](https://yennj12.js.org/InvestSkill-test/showcase/index.html)，以及可用任何分支或開啟中的 PR 試跑任何技能的工作流。那裡的輸出由模型生成、未經人工審閱。 |
| [**部落格的美股文章**](https://yennj12.js.org/yennj12_blog_V4/search/?q=%E7%BE%8E%E8%82%A1) | 作者在 YennJ12 Engineering Blog 的延伸閱讀。與本專案各自獨立：不屬於框架的一部分，也不在本專案的測試範圍內。 |

---

## 🤝 貢獻

### 添加新技能

詳見 [**ADDING-NEW-SKILLS.md**](ADDING-NEW-SKILLS.md) 完整指南。簡要流程：
1. `node scripts/new-skill.js <name> --category <core|reports|monitoring|advanced|meta> --title "…" --desc "…"`——建立含完整輸出合約的 `SKILL.md`，並把技能接到網站、README、跨 AI 設定檔與 CHANGELOG
2. 撰寫 `plugins/us-stock-analysis/skills/<name>/SKILL.md`，再執行 `node scripts/sync-prompts.js <name>` 產生 `prompts/<name>.md`
3. 執行 `npm test`，確認全部通過

### 回報問題

發現錯誤？請[開啟 Issue](https://github.com/yennanliu/InvestSkill/issues) 並附上：
- 平台與版本
- 重現步驟
- 預期與實際行為

---

## ⚖️ 法律聲明

**僅供教育用途。** InvestSkill 提供分析框架，用於學習與研究目的。

> 本工具包**不構成**財務建議。請務必：
> - 諮詢合格的財務顧問
> - 自行研究（DYOR）
> - 獨立驗證分析結果
> - 考量個人風險承受度

**過去績效不代表未來結果**

---

<div align="center">

### 為投資研究社群用心製作

**[GitHub](https://github.com/yennanliu/InvestSkill)** • **[網站](https://yennj12.js.org/InvestSkill/)** • **[回報問題](https://github.com/yennanliu/InvestSkill/issues)** • **[社群討論](https://github.com/yennanliu/InvestSkill/discussions)**

</div>
