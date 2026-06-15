# 使用情境與旅程

> [操作手冊](cookbook-zh-tw.html) 展示個別技能及其產出。本頁則呈現*帶著目標的人*如何端到端地串接技能——包含一則分析*翻轉結論*的實作案例，以及分析常見的出錯方式。指令以 Claude Code 斜線語法呈現；在其他平台請改為引用對應的 `prompts/*.md` 檔。

---

## 股利／收息投資人

**目標：** 打造一個能提供可靠且成長的收入的投組——同時避免踏入[殖利率陷阱](glossary-zh-tw.html#yield-trap)。

```
/dividend-analysis JNJ      ← 安全分數、發放率、保障倍數、成長連續紀錄
/dividend-analysis KO
/dividend-analysis O
/portfolio-review           ← 貼上候選名單；檢查集中度與混合殖利率
```

**該看什麼：** [發放率](glossary-zh-tw.html#dividend-payout-ratio)低於約 60%、[保障倍數](glossary-zh-tw.html#dividend-coverage-ratio) > 2 倍、正的 [FCF](glossary-zh-tw.html#fcf-free-cash-flow)，以及多年的成長連續紀錄。9% 殖利率搭配 110% 發放率是*警訊*，而非便宜貨——市場正在預期減股。

**決策準則：** 目標是投組混合殖利率約 3%+、平均安全分數高於 7.5，且單一持股不超過約 10%。

---

## 第一次投資的人

**目標：**「我有一些現金，想評估我的第一檔股票，又不想假裝自己是專家。」

```
/stock-eval AAPL            ← 一張總覽：品質、價值、護城河、風險
```

接著**別只看分數——要讀懂它。** 遇到不熟的名詞（[皮氏分數](glossary-zh-tw.html#piotroski-f-score)？[ROIC](glossary-zh-tw.html#roic-return-on-invested-capital)？）→ 打開[術語表](glossary-zh-tw.html)。想懂背後直覺 → 看[概念](concepts-zh-tw.html)。接著在信任它之前先複核：

```
/result-validator           ← 貼上 stock-eval 的產出；取得信心分數
```

**心態：** 訊號區塊是*起點*，不是定論。「BUY / MODERATE」搭配 **LOW 信心**意味著「有趣，但資料薄弱——多了解再行動」。先小額起步，部位大小要小到你輸得起，並閱讀[安全邊際](concepts-zh-tw.html#安全邊際與部位規模)。

---

## 財報季交易者

**目標：** 在法說*之前*備好計畫，在法說*之後*以紀律應對。

```
# 法說前
/fundamental-analysis NVDA          ← 基準：這一季的「好」長什麼樣？
/options-analysis NVDA --earnings   ← 市場正在定價多大的波動（IV）？

# 法說後
/earnings-call-analysis NVDA        ← 貼上逐字稿：語氣、財測差異、隱藏風險
/technical-analysis NVDA            ← 價格是確認還是否定了這個反應？
```

**該看什麼：** *財測*與*市場預期*之間的差距、相對於前一季的措辭轉變，以及已實現波動是否對得起你所付的[隱含波動率](glossary-zh-tw.html#implied-volatility-iv)。優勢在於*差異*，而非頭條數字。

---

## 總經／由上而下配置者

**目標：** 先讀懂總經天氣來布局，再向下鑽到個股。

```
/economics-analysis                 ← 循環：殖利率曲線、Fed 立場、領先指標
/sector-analysis                    ← 此循環下哪些類股領先？相對強度
/stock-eval JPM                     ← 受惠類股中的同類最佳標的
/portfolio-review                   ← 加入後是降低還是增加利率敏感度？
```

**該看什麼：** [總經循環](concepts-zh-tw.html)決定了傾向——升息有利金融與價值股，寬鬆有利成長與利率敏感的殖利率標的。先選類股*再*選個股，並在加碼風險前檢查投組層級的影響。

---

## 懷疑者／風險管理者

**目標：** 主動尋找*不該買*的理由——投資中最被低估的紀律。

```
/financial-report-analyst TSLA 10-K   ← 會計警訊、一次性項目、附註風險
/insider-trading TSLA                  ← 內部人是否趁強勢出貨？
/short-interest TSLA                   ← 聰明錢是否站在對立面？
/result-validator                      ← 多頭論述經得起檢驗嗎？
```

**該看什麼：** 訊號之間的分歧。基本面看多＋大量內部人賣出＋空單攀升，是一個值得在你下注*之前*解決的矛盾。目的不是唱衰——而是讓多頭論述自己證明它站得住。

---

## 實作案例：當分析翻轉答案

一則簡短、示意性的演練（虛構代號 **「XYZ」**），呈現一個論述應如何隨證據累積而*演進*——而非在第一步就鎖定。

| 步驟 | 技能 | 發現 | 即時訊號 |
|------|------|------|---------|
| 1 | `stock-eval` | 高 ROIC、乾淨的皮氏分數 8/9、合理本益比 | **看多** · 中信心 |
| 2 | `stock-valuation` | DCF＋同業比較顯示約低估 15% | **看多** · 更強 |
| 3 | `financial-report-analyst` | 10-K 揭露營收越來越集中於單一客戶＋應收帳款大增 | 信心**下降** |
| 4 | `insider-trading` | 兩位高階主管上月賣出大量持股 | 訊號弱化為**中性** |
| 5 | `result-validator` | 標示客戶集中＋內部人利益衝突；信心**低** | **持有**，而非買進 |

**教訓：** 步驟 1–2 看似乾淨的買點。*判斷力*來自步驟 3–5，財報與內部人資料引入了頭條指標所隱藏的風險。最終結論——**持有，等待下一份 10-Q**——正是那份分歧的*產物*，也正是綜合[訊號區塊](concepts-zh-tw.html#訊號區塊解剖)設計來凸顯的東西。高分數搭配低信心，是「再看仔細點」，而非「進場」。

---

## 反模式：分析如何出錯

| 反模式 | 為何傷人 | 解方 |
|--------|---------|------|
| **盲信單一 DCF 點估值** | 微調 WACC／永續成長率就會大幅擺盪 | 讀**悲觀／基準／樂觀區間**與敏感度表，而非單一數字 |
| **忽略 Confidence 欄位** | 看多*分數*搭配 LOW 信心只是猜測 | 把低信心當成「再蒐集資料」，而非「進場」 |
| **使用過時或臆測的資料** | AI 只會就你給的內容推理 | 貼上最新、第一手的財務數據；見[資料與準確性](data-and-accuracy-zh-tw.html) |
| **把殖利率陷阱誤當收入** | 10% 殖利率往往預告減股 | 檢查[發放率](glossary-zh-tw.html#dividend-payout-ratio)與 FCF，而非只看殖利率 |
| **錨定於單一訊號區塊** | 一個技能只看一個切面 | 跑 `research-bundle`／以 `result-validator` 交叉複核 |
| **混淆信心與信念** | 兩者是不同維度 | 見[訊號區塊解剖](concepts-zh-tw.html#訊號區塊解剖) |
| **綜合結果跳過驗證** | 互相分歧的子訊號被平均掉了 | 對 `full-report`／`research-bundle` 務必執行 `result-validator` |

---

> **下一步：** [選擇技能](choose-a-skill-zh-tw.html) 自行打造串接 · [概念](concepts-zh-tw.html) 提供推理脈絡 · [資料與準確性](data-and-accuracy-zh-tw.html) 行動前必讀。

*僅供教育用途。並非投資建議。代號僅作示意，並非推薦。*
