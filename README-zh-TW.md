# InvestSkill

專業投資分析與股票評估技能工具，適用於 Claude Code。

[![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml)
[![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-live-success)](https://yennanliu.github.io/InvestSkill/)

📚 **[查看文檔網站](https://yennanliu.github.io/InvestSkill/)**

## 安裝

```bash

claude

# 添加到市集
/plugin marketplace add yennanliu/InvestSkill


# 安裝
/plugin install us-stock-analysis


# 檢查已安裝列表

/plugin list

# 測試
- /us-stock-analysis:fundamental-analysis AAPL # - 基本面分析
- /us-stock-analysis:technical-analysis AAPL # - 技術面分析
- /us-stock-analysis:economics-analysis # - 經濟分析
```


- 本地開發

```bash

claude

# 添加本地市集
/plugin marketplace add /Users/jerryliu/InvestSkill

# 安裝插件
/plugin install us-stock-analysis@invest-skill
```

## 概述

InvestSkill 是一個綜合性的 Claude Code 插件市集，提供專業級的美股市場分析技能，包括基本面分析、技術分析、經濟評估和投資組合管理。

## 功能特色

- **股票評估**：全面的基本面與估值分析
- **經濟分析**：美國經濟指標及市場影響分析
- **基本面分析**：深入的財務報表分析
- **技術分析**：圖表形態與技術指標分析
- **投資組合檢視**：績效分析與優化建議
- **產業分析**：產業輪動與市場定位分析

## 安裝方式

### 一般使用者

添加市集並安裝插件：

```bash
# 從 GitHub 添加市集
/plugin marketplace add jerryliu/InvestSkill

# 安裝插件
/plugin install us-stock-analysis@invest-skill
```

### 本地開發

```bash
# 添加本地市集
/plugin marketplace add /Users/jerryliu/InvestSkill

# 安裝插件
/plugin install us-stock-analysis@invest-skill
```

## 可用技能

- `/stock-eval` - 全面分析美股股票
- `/economics-analysis` - 分析美國經濟指標
- `/fundamental-analysis` - 使用財報進行深入基本面分析
- `/technical-analysis` - 技術圖表與指標分析
- `/portfolio-review` - 投資組合績效與優化檢視
- `/sector-analysis` - 美股市場產業分析與輪動

## 使用範例

```bash
# 評估特定股票
/stock-eval AAPL

# 獲取經濟展望
/economics-analysis

# 深入基本面分析
/fundamental-analysis MSFT

# 技術圖表分析
/technical-analysis TSLA

# 檢視投資組合
/portfolio-review [貼上您的持股]

# 分析產業
/sector-analysis
```

## 專案結構

```
InvestSkill/
├── .claude-plugin/
│   └── marketplace.json          # 市集配置
├── plugins/
│   └── us-stock-analysis/
│       ├── .claude-plugin/
│       │   └── plugin.json       # 插件清單
│       ├── skills/
│       │   ├── stock-eval/
│       │   │   └── SKILL.md
│       │   ├── economics-analysis/
│       │   │   └── SKILL.md
│       │   ├── fundamental-analysis/
│       │   │   └── SKILL.md
│       │   ├── technical-analysis/
│       │   │   └── SKILL.md
│       │   ├── portfolio-review/
│       │   │   └── SKILL.md
│       │   └── sector-analysis/
│       │       └── SKILL.md
│       └── README.md
├── LICENSE
└── README.md
```

## CI/CD 與自動化

本專案包含完整的 GitHub Actions 工作流程，用於品質保證和自動發布。

### 自動化工作流程

**驗證 (`validate.yml`)**
- 在每次推送和 PR 至 main/develop 分支時執行
- 驗證 JSON 結構 (marketplace.json, plugin.json)
- 檢查必要檔案和欄位
- 驗證 SKILL.md frontmatter
- 確保檔案間的版本一致性

**PR 檢查 (`pr-check.yml`)**
- 在 Pull Request 上進行快速驗證
- JSON 語法檢查
- 必要欄位驗證
- SKILL.md 檔案檢查

**自動發布 (`release.yml`)**
- 在版本標籤 (v*) 觸發
- 建立發布套件 (.tar.gz)
- 生成 SHA256 校驗碼
- 建立包含附件的 GitHub 發布
- 從 CHANGELOG.md 提取發布說明

**自動標籤 (`label-pr.yml`)**
- 根據變更的檔案自動為 PR 加上標籤
- 添加大小標籤 (small/medium/large)
- 協助 PR 組織和審查

**首次貢獻者問候 (`greetings.yml`)**
- 歡迎新貢獻者
- 為首次提交 issues/PR 提供有用資訊

### 建立發布版本

建立新版本的步驟：

1. 更新版本號碼：
   ```bash
   # 更新 plugins/us-stock-analysis/.claude-plugin/plugin.json
   # 更新 .claude-plugin/marketplace.json
   ```

2. 更新 CHANGELOG.md：
   ```markdown
   ## [1.1.0] - 2026-02-16
   ### Added
   - 新功能描述
   ```

3. 提交變更：
   ```bash
   git add .
   git commit -m "chore: bump version to 1.1.0"
   git push origin main
   ```

4. 建立並推送標籤：
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

5. GitHub Actions 將自動：
   - 驗證插件結構
   - 建立發布套件
   - 生成發布說明
   - 發布包含附件的版本

### 驗證徽章

添加這些徽章以顯示建置狀態（更新使用者名稱/儲存庫）：

```markdown
![Validate](https://github.com/yennanliu/InvestSkill/actions/workflows/validate.yml/badge.svg)
![Release](https://github.com/yennanliu/InvestSkill/actions/workflows/release.yml/badge.svg)
```

## 貢獻

歡迎貢獻！請閱讀我們的[貢獻指南](CONTRIBUTING.md)以了解詳細資訊。

**快速開始：**

1. Fork 此儲存庫
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送至分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

詳細指南請參閱 [CONTRIBUTING.md](CONTRIBUTING.md)，包括：
- 添加新技能
- 建立插件
- 測試變更
- 提交訊息格式
- 版本編號

## 發布

與他人分享此市集：

1. 推送至 GitHub：
```bash
git add .
git commit -m "Initial plugin marketplace setup"
git push origin main
```

2. 使用者可以添加您的市集：
```bash
/plugin marketplace add jerryliu/InvestSkill
```

## 開發路線圖

- [ ] 添加選擇權分析技能
- [ ] 添加加密貨幣分析技能
- [ ] 整合財報日曆
- [ ] 添加新聞情緒分析
- [ ] 添加風險管理計算器
- [ ] 添加回測功能

## 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案。

## 免責聲明

本插件提供教育性分析，不構成財務建議。在做出投資決策前，請務必諮詢合格的財務顧問。過去的績效不保證未來的結果。

## 資源

- [Claude Code 文檔](https://code.claude.com/docs/)
- [插件開發指南](https://code.claude.com/docs/plugins)
- [市集指南](https://code.claude.com/docs/plugin-marketplaces)

## 支援

如有問題、疑問或建議，請在 GitHub 上開啟 issue。
