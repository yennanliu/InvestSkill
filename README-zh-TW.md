<div align="center">

# 📊 InvestSkill

### 美股市場專業投資分析工具

**23 個 AI 驅動分析框架 · 全平台支援 · 完全開源**

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=for-the-badge&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=for-the-badge&color=green)](https://github.com/yennanliu/InvestSkill/releases)
[![Test Suite](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/test.yml?style=for-the-badge&label=Tests)](https://github.com/yennanliu/InvestSkill/actions)

[🌐 線上文件](https://yennanliu.github.io/InvestSkill/) • [🎓 投資學習](https://yennanliu.github.io/InvestSkill/learning-zh-tw.html) • [📚 操作手冊](https://yennanliu.github.io/InvestSkill/cookbook.html) • [🐛 回報問題](https://github.com/yennanliu/InvestSkill/issues) • [💬 社群討論](https://github.com/yennanliu/InvestSkill/discussions) • [🇺🇸 English](README.md)

</div>

---

## 🎯 什麼是 InvestSkill？

InvestSkill 是企業級投資分析工具包，為各 AI 平台帶來機構級分析框架。透過 23 個完整框架進行專業股票分析——無需金融執照，無需 API 費用。

> **適合用於**：投資研究 · 盡職調查 · 投資組合管理 · 金融教育 · 股票評估

<div class="home-card">
  <span class="home-card-icon">🎓</span>
  <div class="home-card-body">
    <div class="home-card-title">投資新手？從學習指南開始</div>
    <p>六堂課的實戰指南，用白話講清楚每一項技能背後的概念——從讀懂資產負債表、為一門生意估值，到持有一個投資組合。提供繁體中文與英文，不需財金背景。</p>
    <p><a class="home-card-cta" href="https://yennanliu.github.io/InvestSkill/learning-zh-tw.html">開始學習 →</a></p>
  </div>
</div>

<table>
  <tr>
    <td width="50%">

### ✨ 23 個專業框架
- 6 個核心分析框架
- 2 個財務報告分析
- 4 個市場監控工具
- 6 個進階研究工具
- 3 個自動化元技能（含 2 個新增技能）

    </td>
    <td width="50%">

### 🔌 全平台支援
- Claude Code 插件
- Cursor IDE 規則
- Gemini CLI 提示詞
- GitHub Copilot
- ChatGPT & Claude.ai
- 任何大型語言模型

    </td>
  </tr>
</table>

---

## 🚀 快速開始（30 秒）

### Claude Code（推薦）
```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/us-stock-analysis:stock-eval AAPL
```

### Cursor 或 GitHub Copilot
```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .  # 或使用 GitHub Copilot
@prompts/stock-eval.md 評估蘋果公司
```

### Gemini CLI
```bash
cd /path/to/InvestSkill
gemini
> @prompts/stock-eval.md 評估蘋果公司
```

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
- **研究套組** — 串接所有框架
- **財務報告** — 10-K/10-Q 分析
- **多股比較** — 並排分析
- **批次分析** — 處理整個投資組合
- **情境測試** — 多頭/基本/空頭情境

</td>
</tr>
</table>

---

## 📋 23 個框架總覽

| 類別 | 框架 | 用途 |
|------|------|------|
| **核心分析** (6) | stock-eval · fundamental-analysis · technical-analysis · economics-analysis · dcf-valuation · stock-valuation | 全方位股票評估 |
| **財務報告** (3) | financial-report-analyst · 10k-digest · earnings-call-analysis | 深度文件分析 |
| **市場監控** (4) | insider-trading · institutional-ownership · dividend-analysis · short-interest | 活動與情緒追蹤 |
| **進階分析** (6) | competitor-analysis · options-analysis · portfolio-review · sector-analysis · **stock-screener** · **catalyst-calendar** | 專項研究角度 |
| **元技能** (3) | research-bundle · report-generator · full-report | 自動化與綜合輸出 |

> **v1.8.1 新功能：**
> - `10k-digest`（10-K 摘要）— 深度解析年報並輸出結構化 Markdown 文件，包含摘要、各節重點、關鍵指標表與來源引用，支援英文 / 繁體中文輸出
>
> **v1.8.0 新功能：**
> - `stock-screener`（股票篩選器）— 跨估值、品質、動能、情緒、成長五個維度對多支股票進行排名篩選，輸出排行榜、精選名單與迴避名單
> - `catalyst-calendar`（催化劑日曆）— 未來 90 天事件日曆：財報、總經事件、公司特定催化劑、影響力評分、事件驅動策略建議
>
> **v1.8.0 合併整合（減少重複）：**
> - `dcf-valuation` 合併至 `stock-valuation` — stock-valuation 現為包含完整 DCF 的超集版本；dcf-valuation 轉為精簡導引
> - `fundamental-analysis` 合併至 `stock-eval` — stock-eval 吸收深度財務報表分析；fundamental-analysis 轉為精簡導引
> - `research-bundle` 統一至 `full-report` — full-report 新增 --depth quick/standard/comprehensive 旗標

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
/us-stock-analysis:fundamental-analysis TICKER --visual
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

### Claude Code（一般使用者推薦）

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis
/plugin list  # 確認安裝
```

**驗證安裝：**
```bash
node scripts/setup-verify.js
```

### Cursor IDE（自動載入）

```bash
git clone https://github.com/yennanliu/InvestSkill.git
cd InvestSkill
cursor .
# 在 AI Chat（Cmd+K）中規則會自動載入
```

### Gemini CLI（自動載入）

```bash
cd /path/to/InvestSkill
gemini
# GEMINI.md 自動載入
# 所有提示詞可透過 @prompts/ 使用
```

### GitHub Copilot（自動載入）

在 **VS Code** 或 **JetBrains IDE** 中開啟儲存庫
Copilot 會自動載入 `.github/copilot-instructions.md`

### 通用存取（任何 AI）

1. 複製提示詞：`cat prompts/stock-valuation.md | pbcopy`
2. 貼入 ChatGPT、Claude.ai 或任何大型語言模型
3. 提問分析

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
/stock-eval AAPL
/fundamental-analysis AAPL --visual
/technical-analysis AAPL --chart
/stock-valuation AAPL --methods all
/competitor-analysis AAPL --moat
/financial-report-analyst AAPL 10-K
→ 相當於完整 50 頁分析報告
```

### 工作流程 3：財報季研究
```bash
# 30 分鐘財報研究流程
/fundamental-analysis TICKER --visual  # 財報前基準線
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
| **23 個精選框架** | ✅ 內建 | ❌ 需手動設定 |
| **信號區塊** | ✅ 標準化格式 | ❌ 格式不一致 |
| **全平台支援** | ✅ 原生支援 | ❌ 需要變通方案 |
| **零 API 費用** | ✅ 免費 | ❌ 需付費 API |
| **離線提示詞** | ✅ 全部內建 | ❌ 依賴外部連結 |
| **專業品質** | ✅ 機構級 | ⚠️ 品質不穩定 |
| **教育性** | ✅ 教授分析框架 | ❌ 只給答案 |

---

## 📊 專案狀態

**目前版本：** 1.8.0
**技能框架：** 23 個
**通用提示詞：** 23 個
**支援平台：** 6 個
**測試數量：** 294+ 個（全數通過）✅

---

## 🤝 貢獻

### 添加新技能

詳見 [**ADDING-NEW-SKILLS.md**](ADDING-NEW-SKILLS.md) 完整指南：
- 12 步驟說明
- 檔案結構範本
- 平台同步檢查清單
- 測試程序

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

**[GitHub](https://github.com/yennanliu/InvestSkill)** • **[網站](https://yennanliu.github.io/InvestSkill/)** • **[回報問題](https://github.com/yennanliu/InvestSkill/issues)** • **[社群討論](https://github.com/yennanliu/InvestSkill/discussions)**

</div>
