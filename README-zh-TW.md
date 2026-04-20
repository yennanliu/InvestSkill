<div align="center">

# 📊 InvestSkill

### 美股市場專業投資分析工具

**18 個 AI 驅動分析框架 · 全平台支援 · 完全開源**

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yennanliu/InvestSkill?style=for-the-badge&color=gold)](https://github.com/yennanliu/InvestSkill/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/yennanliu/InvestSkill?style=for-the-badge&color=green)](https://github.com/yennanliu/InvestSkill/releases)
[![Test Suite](https://img.shields.io/github/actions/workflow/status/yennanliu/InvestSkill/test.yml?style=for-the-badge&label=Tests)](https://github.com/yennanliu/InvestSkill/actions)

[🌐 線上文件](https://yennanliu.github.io/InvestSkill/) • [📚 操作手冊](https://yennanliu.github.io/InvestSkill/cookbook.html) • [🐛 回報問題](https://github.com/yennanliu/InvestSkill/issues) • [💬 社群討論](https://github.com/yennanliu/InvestSkill/discussions) • [🇺🇸 English](README.md)

</div>

---

## 🎯 什麼是 InvestSkill？

InvestSkill 是企業級投資分析工具包，為各 AI 平台帶來機構級分析框架。透過 18 個完整框架進行專業股票分析——無需金融執照，無需 API 費用。

> **適合用於**：投資研究 · 盡職調查 · 投資組合管理 · 金融教育 · 股票評估

<table>
  <tr>
    <td width="50%">

### ✨ 18 個專業框架
- 6 個核心分析框架
- 2 個財務報告分析
- 4 個市場監控工具
- 4 個進階研究工具
- 2 個自動化元技能

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
- **技術分析** — 圖表形態與技術指標
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

## 📋 18 個框架總覽

| 類別 | 框架 | 用途 |
|------|------|------|
| **核心分析** (6) | stock-eval · fundamental-analysis · technical-analysis · economics-analysis · dcf-valuation · stock-valuation | 全方位股票評估 |
| **財務報告** (2) | financial-report-analyst · earnings-call-analysis | 深度文件分析 |
| **市場監控** (4) | insider-trading · institutional-ownership · dividend-analysis · short-interest | 活動與情緒追蹤 |
| **進階分析** (4) | competitor-analysis · options-analysis · portfolio-review · sector-analysis | 專項研究角度 |
| **元技能** (2) | research-bundle · report-generator | 自動化與綜合輸出 |

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
| **18 個精選框架** | ✅ 內建 | ❌ 需手動設定 |
| **信號區塊** | ✅ 標準化格式 | ❌ 格式不一致 |
| **全平台支援** | ✅ 原生支援 | ❌ 需要變通方案 |
| **零 API 費用** | ✅ 免費 | ❌ 需付費 API |
| **離線提示詞** | ✅ 全部內建 | ❌ 依賴外部連結 |
| **專業品質** | ✅ 機構級 | ⚠️ 品質不穩定 |
| **教育性** | ✅ 教授分析框架 | ❌ 只給答案 |

---

## 📊 專案狀態

**目前版本：** 1.4.0
**技能框架：** 18 個
**通用提示詞：** 17 個
**支援平台：** 5 個
**測試數量：** 292 個（全數通過）✅

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
