# 選擇技能

> 23 個框架不算少。本頁將你的*目標*對應到合適的技能——並釐清大家最常問的重疊之處。第一次來？先從 `stock-eval` 開始；它一次就觸及品質、價值與風險。

---

## 從你的目標出發

| 我想要… | 使用 | 接著可考慮 |
|---------|------|-----------|
| 快速篩選一檔股票（要 / 不要） | `stock-eval` | `result-validator` |
| 深入了解這門*生意* | `fundamental-analysis` | `competitor-analysis` |
| 判斷它*便宜還是貴* | `stock-valuation` | `dcf-valuation` |
| 取得嚴謹的*內在價值* | `dcf-valuation` | `stock-valuation` |
| 讀 10-K／10-Q 找出警訊 | `financial-report-analyst` | `earnings-call-analysis` |
| 評估一場法說會 | `earnings-call-analysis` | `options-analysis` |
| 檢查*股利是否安全* | `dividend-analysis` | `portfolio-review` |
| *抓進出場時機* | `technical-analysis` | `chart-master` |
| 評估*競爭護城河* | `competitor-analysis` | `fundamental-analysis` |
| 看*聰明錢*的動向 | `institutional-ownership` | `insider-trading` |
| 追蹤*內部人*買賣 | `insider-trading` | `short-interest` |
| 衡量*軋空*潛力 | `short-interest` | `technical-analysis` |
| 挑選*選擇權*策略 | `options-analysis` | `technical-analysis` |
| 判讀*總經*環境 | `economics-analysis` | `sector-analysis` |
| 找*類股輪動*機會 | `sector-analysis` | `stock-eval` |
| 檢視我的*整體投組* | `portfolio-review` | `dividend-analysis` |
| 建立*單一完整投資論述* | `research-bundle` | `result-validator` |
| 匯出*精美的 HTML 報告* | `full-report` | `report-generator` |
| 為報告製作*圖表* | `chart-master` | `report-generator` |
| *快速複核*任何分析 | `result-validator` | — |

---

## 決策樹

```
你的起點是什麼？

├─ 「我有一檔代號，想知道值不值得看」
│     └─ stock-eval  ──(有潛力?)──► research-bundle ──► result-validator
│
├─ 「我想知道它值多少」
│     ├─ 單一嚴謹模型 ........... dcf-valuation
│     └─ 多種方法交叉驗證 ...... stock-valuation
│
├─ 「正值財報季」
│     └─ fundamental-analysis（基準）
│           └─ earnings-call-analysis（法說後）
│                 └─ options-analysis（波動率＋策略）
│
├─ 「我從由上而下／總經思考」
│     └─ economics-analysis ──► sector-analysis ──► stock-eval
│
├─ 「我重視現金流（收息）」
│     └─ dividend-analysis ──► portfolio-review
│
├─ 「我在交易一個型態」
│     └─ short-interest ──► technical-analysis ──► options-analysis ──► chart-master
│
└─ 「我要完整全包、可匯出」
      └─ full-report （全部跑一遍，存成 HTML 檔）
```

---

## 技能比較（大家最常問的重疊）

### `stock-eval` vs. `fundamental-analysis` vs. `stock-valuation`
這三者重疊最多。差別在於**深度與目的**：

| 技能 | 最適合 | 深度 | 產出 |
|------|--------|------|------|
| `stock-eval` | 快速、全面的*要 / 不要* | 廣而淺 | 品質＋價值＋護城河＋風險，整合為單一訊號 |
| `fundamental-analysis` | *了解這門生意* | 財報面深入 | 損益表、資產負債表、現金流深掘 |
| `stock-valuation` | *價格合不合理？* | 估值面深入 | P/E · P/S · EV/EBITDA · DCF · 剩餘收益，並列比較 |

**經驗法則：** 先 `stock-eval` 判斷*是否*值得深掘；再以 `fundamental-analysis`（生意）與 `stock-valuation`（價格）探究*為什麼*。

### `dcf-valuation` vs. `stock-valuation`
- **`dcf-valuation`**——單一方法做到嚴謹：預測現金流、WACC、悲觀／基準／樂觀、敏感度表。當你想要一個站得住腳的*內在價值*、並看清它有多脆弱時使用。
- **`stock-valuation`**——*多種*方法一次到位（DCF＋同業比較＋EV 倍數＋剩餘收益），三角交叉成一個區間。當你想從多個角度看這檔股票值多少時使用。

單一 DCF 可能精準地錯。用 `stock-valuation` 三角交叉，正是壓力測試它的方法。

### `research-bundle` vs. `full-report`
- **`research-bundle`**——串接各分析技能，**在對話中**綜合成單一論述。互動、可對談、迭代快。
- **`full-report`**——跑完所有模組並將獨立 HTML 檔**存到 `output/`**（主視覺標頭、互動圖表、足球場估值圖、綜合訊號）。最適合用於分享、存檔或列印。

同一套引擎，不同*交付*方式：對話中閱讀 vs. 匯出分享。

### 基本面 vs. 技術面——何時用哪個
| | 基本面（`fundamental-analysis`、`stock-eval`、`*-valuation`） | 技術面（`technical-analysis`、`chart-master`） |
|---|---|---|
| 回答 | 該持有*什麼*、它*值不值得* | *何時*進出場 |
| 時間框架 | 數月至數年 | 數日至數月 |
| 輸入 | 財務報表、申報文件 | 價格、成交量、指標 |
| 可一起用？ | 可——基本面挑標的，技術面抓時機 |

它們並非對手。[波段交易旅程](use-cases-zh-tw.html) 同時運用兩者：以基本面選股，以技術面抓時機。

---

> **下一步：** [使用情境](use-cases-zh-tw.html) 展示這些串接的完整流程 · [概念](concepts-zh-tw.html) 解釋各項指標 · [資料與準確性](data-and-accuracy-zh-tw.html) 談如何信任產出。

*僅供教育用途。並非投資建議。*
