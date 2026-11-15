# 示範：真實執行、真實截圖

這些示範展示 InvestSkill 在真實股票上的運作。每一份都是 **2026-10-11** 真實執行的結果，使用的資料是用專案內免金鑰小工具下載的 SEC 財報，以及 **2026-10-09 那斯達克收盤價**。每一頁都一步一步呈現：下了什麼指令、真實輸出的截圖、該注意哪些地方，以及結果。每頁最下方都附上完整、未經修改的輸出，讓你確認截圖沒有刻意挑選。

> **第一次來？** 先看[實機演練](WALKTHROUGH-zh-TW.md)（[English](WALKTHROUGH.md)）。它對微軟跑了四個技能，把方法講得最仔細。

> **僅供教育用途，不構成投資建議。** 數字以文中標示的日期為準，很快就會過時。

---

## 選一份示範

| 示範 | 語言 | 內容 | 技能數 | 主要結果 |
|------|------|------|--------|----------|
| [**實機演練：MSFT**](WALKTHROUGH-zh-TW.md) | 繁體中文 · [English](WALKTHROUGH.md) | 方法教學：資料 → 評估 → 唱反調 → 驗證 → 讀懂 | 4 | NEUTRAL · 5.5 · HOLD |
| [**RKLB 完整示範**](FULL-DEMO-RKLB.md) | 繁體中文 | 對 Rocket Lab 跑十個技能，涵蓋公司、價格、市場、風險四個問題 | 10 | NEUTRAL · 4.2 · HOLD（stock-eval） |
| [**AMD 10-K 深度解析**](FULL-DEMO-AMD.md) | 繁體中文 | 先深度解讀年報，再逐一驗證數字 | 2 | NEUTRAL · 5.5 · HOLD |
| [**META 10-K Deep Dive**](FULL-DEMO-META.md) | 英文 | 六個技能串接分析同一份年報 | 6 | NEUTRAL · 5.6 · HOLD |
| [**NVDA 10-K Deep Dive**](FULL-DEMO-NVDA.md) | 英文 | 與 AMD 相同的兩個步驟，分析 NVIDIA | 2 | BULLISH · 6.8 · HOLD |
| [**PLTR Full Demo**](FULL-DEMO-PLTR.md) | 英文 | 與 RKLB 相同的十個技能，分析 Palantir | 10 | NEUTRAL · 4.5 · HOLD（stock-eval） |

**該看哪一份？**

- **「這要怎麼用？」** → [實機演練](WALKTHROUGH-zh-TW.md)。
- **「我手上有一份 10-K，想讀懂它。」** → [AMD](FULL-DEMO-AMD.md)（深度解讀再驗證），或英文的 [META](FULL-DEMO-META.md)（多個技能分析同一份年報）。
- **「我想要一檔股票的完整分析。」** → [RKLB](FULL-DEMO-RKLB.md)，或英文的 [PLTR](FULL-DEMO-PLTR.md)。
- **「我想看幾檔股票放在同一份互相連結的報告裡。」** → 下面的展示櫃。

---

## 展示櫃：一個籃子、八個互相連結的頁面

[**InvestSkill 展示櫃**](https://yennj12.js.org/InvestSkill-test/showcase/index.html)放在姊妹專案 [`InvestSkill-test`](https://github.com/yennanliu/InvestSkill-test)。它用**同一份 2026-07-29 的資料快照**，把各個框架跑在一個四檔股票的籃子上——MU、SKHY、MRVL、SNDL，四檔在同一天下跌 7.8–9.6%——全部以繁體中文撰寫。

| 頁面 | 內容 |
|------|------|
| [總覽](https://yennj12.js.org/InvestSkill-test/showcase/index.html) | 這個籃子要回答的問題，以及每個框架用在哪裡的地圖 |
| [MU](https://yennj12.js.org/InvestSkill-test/showcase/mu.html) | 15 個模組的 `full-report`，加上 `bear-case`、`position-ladder` 與 `result-validator` |
| [四檔對決](https://yennj12.js.org/InvestSkill-test/showcase/screener.html) | `stock-screener`：22 個子分數，每一個旁邊都附原始輸入 |
| [工作流 A–G](https://yennj12.js.org/InvestSkill-test/showcase/workflows.html) | Cookbook 的七條工作流程；其中兩條在第一道閘門就停止，而這正是正確答案 |
| [產業鏈地圖](https://yennj12.js.org/InvestSkill-test/showcase/supply-chain.html) | 以 `industry-map` 畫出 HBM 價值鏈 |

值得注意的地方：每個頁面引用的價格都相同、每個分數旁邊都有它的輸入，而且刻意保留了三個資料瑕疵，讓 `result-validator` 有東西可抓（其中一份報告拒絕給出目標價）。

> **請留意日期。** 展示櫃是以 InvestSkill **v1.11.0**（27 個框架）製作的，數字為 2026-07-29 的資料——它示範的是方法，不是目前的數字，也不是目前的完整框架目錄。想在自己的籃子上做出同樣的形式，請用 [`basket-report`](skill-basket-report.html)（操作手冊的工作流程 J）。

---

## 示範是怎麼做出來的

每份示範都用同一套流程，所以任何一份你都能自己重現。

**1 · 取得第一手資料（不需要 API key）。**

```bash
export EDGAR_USER_AGENT="Your Name you@example.com"
npm run fetch:edgar -- AMD --form 10-K      # 財報全文 → data/filings/AMD/
npm run fetch:fundamentals -- AMD           # 申報數字 → data/fixtures/AMD.md
# 接著在資料包的 price: 那一行填上最新收盤價（SEC 沒有股價資料）
```

**2 · 以無介面模式執行技能，並限制可用工具。**

| 示範類型 | 允許的工具 | 原因 |
|----------|------------|------|
| 10-K 深度解析（AMD、META、NVDA） | 只能讀檔 | 財報就是全部的資料來源；不上網，就不會混入記憶中的數字或過時的網頁 |
| 完整示範（RKLB、PLTR） | 讀檔＋網路搜尋＋網頁擷取 | 歷史股價、Form 4 內部人交易、放空比率、法說會逐字稿都不在財報裡；每個網路數字都必須標註日期與來源 |

```bash
claude -p "/us-stock-analysis:financial-report-analyst AMD — use only data/filings/AMD/AMD_2026_10-K.txt and data/fixtures/AMD.md 全部內容請用繁體中文輸出。" --allowedTools Read
```

**3 · 用第二個技能檢查結果。** 每份示範最後都會對前面的輸出跑 `fact-check` 或 `result-validator`。

**4 · 截圖來自真實輸出。** 截圖是從存下來的輸出文字渲染而成，省略的段落會標示「… (lines omitted for length)」，節錄內的文字完全沒有修改。

---

## 這些示範的共同點

1. **每份輸出都以 `Data & Sources` 標頭開始**：每個數字從哪裡來、日期為何、可以信幾分。
2. **技能會說「無資料」，而不是用猜的。** 檔案裡沒有（或找不到）的數字，輸出會直接說明。
3. **技能之間會有不同意見，並說明原因。** 以 PLTR 為例，`stock-eval` 說 HOLD、`stock-valuation` 說 SELL、`technical-analysis` 說回檔再買：三種時間尺度，三個答案，各自都有理由。
4. **它們會抓出資料問題。** 在 10-K 示範中，分析技能每次都修正了 SEC 資料包：把 G&A 誤當 SG&A（META）、淨債務忽略了 $520 億有價證券（NVDA）、FCF 包含停業單位（AMD）。
5. **每個結論都附上失效條件。** 每份輸出都列出會翻轉訊號的條件。

---

## 舊版示範

先前的示範（2026 年 6–7 月）是用提示詞中提供的資料產生的長篇單一報告。現在已改為這些重新執行的版本：使用最新的 SEC 資料、當前股價、目前的技能組合，並呈現每一個步驟。舊版仍保留在 [git 歷史](https://github.com/yennanliu/InvestSkill/commits/main/site/content)中。

---

**免責聲明：** 僅供教育用途，不構成投資建議。
