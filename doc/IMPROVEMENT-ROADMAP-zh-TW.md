# InvestSkill — 改進路線圖

*審查日期：2026-09-23 · 審查版本 v1.11.0 · 27 個技能目錄 / 26 個對外宣稱的分析框架 · 389 項測試通過 · 69 個網站頁面 · **進度見 §0**（最後更新 2026-09-24，PR #27）*

> **範圍。** 從兩個角度對 InvestSkill 進行產品審查：作為美股投資人的**投資工具**，以及作為**學習金融知識的途徑**。本文提出新的 LLM 技能、既有技能的強化、網站內容，以及缺少的腳本，並列出審查過程中發現的一致性問題。僅為建議 — 本 PR 未修改任何技能、提示詞或網站頁面。
>
> English version: [IMPROVEMENT-ROADMAP.md](IMPROVEMENT-ROADMAP.md)
>
> 本文延續先前兩份審查 — [qa/PROJECT-REVIEW.md](../qa/PROJECT-REVIEW.md)（2026-07-02，結構與一致性）與 [SITE-ENRICHMENT-REVIEW.md](SITE-ENRICHMENT-REVIEW.md)（2026-06-15，網站內容）。它們的 P0/P1 項目多數已完成（術語表、概念、選擇技能、每技能頁面、搜尋、連結檢查、數量測試、學習課程）。本文從它們停下的地方接續。

---

## 0. 進度追蹤

§2 十大建議的執行狀態。每個項目出貨時，在該 PR 中更新此表。

| # | 建議 | 狀態 | 出貨 PR | 備註 |
|---|------|------|---------|------|
| 1 | 修正過時的數量並歸檔歷史文件（§7） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | §7 每一列都已修正；`COUNT_DOCS` 擴充至 FAQ / PLATFORM-COMPATIBILITY / CONTRIBUTING 與「N skills」聲明（§6.9）；四份文件移至 `doc/archive/`；`TODO.md` 改為精選前五 |
| 2 | 強制執行技能契約並加上測試（§4.1、§6.3） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | `Data & Sources` 表頭 24/24 · 資料驗證 24/24 · 論點失效條件 24/24（所有分析技能；輸出工具、別名、meta 技能除外）。`scripts/check-skill-contract.js` 已接進 `npm test`。`--lang zh-TW` 與 JSON 頁尾仍待辦 → `TODO.md` #5 |
| 3 | 重新分類 3 個轉址技能為別名；宣稱誠實的數量（§4.2） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | 採選項 (b)：**24 個框架 + 3 個別名 + 1 個輸出工具**。單一真實來源 `scripts/lib/skill-registry.js`，由測試、安裝測試與網站建置共同引用；`skills.html` 上有獨立的「Aliases」分類 |
| 4 | `etf-analysis`（§3.1） | ✅ 完成 | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | ETF 適配分數；成本、追蹤差異、流動性、集中度／傾斜、與使用者持股的重疊、配息紀錄、結構警示、ETF vs. 前五大成分股比較、UCITS 備註 |
| 5 | `earnings-preview`（§3.1） | ✅ 完成 | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | 共識 vs. 耳語、8 季超預期／漲跌表、隱含 vs. 實際波動、價格已反映什麼、KPI、三情境矩陣與部位規則；財報設定分數 |
| 6 | `thesis-tracker`（§3.1） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | 開立 / `--update` / `--review` / `--close` 四種模式、存檔契約、INTACT / WEAKENED / BROKEN 判定規則、論點健康分數；以 `new-skill.js` 腳手架建立 |
| 7 | `tax-lens`（§3.1） | ✅ 完成 | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | 交易／部位／投組三種模式 + `--non-us`（W-8BEN、預扣稅與協定、資本利得處理與例外、6 萬美元遺產稅免稅額、UCITS 比較）；強制非稅務建議關卡；稅務效率分數 |
| 8 | `learning-coach`（§3.1） | ✅ 完成 | [PR #27](https://github.com/yennanliu/InvestSkill/pull/27) | 解說／`--quiz` 模式、`--level`、`--lang zh-TW`；解說卡、蘇格拉底式提問梯、常見誤讀；訊號區塊沿用被解說的分析 |
| 9 | `scripts/sync-prompts.js` + `scripts/new-skill.js`（§6.1、§6.2） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | prompts 現在由 SKILL.md **產生**（`--check` 在 `npm test` 中）；腳手架一次把技能接進 11 個檔案。注意：重新產生後，先前手工精簡的 prompts 被 SKILL.md 全文取代 |
| 10 | `scripts/eval-skills.js`（§6.4） | ✅ 完成 | [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) | 以 `EVAL_CMD` 環境變數選擇啟用；樣本 `data/fixtures/ZEPH.md`（虛構公司）；硬性檢查透過共用解析器 `scripts/lib/signal-block.js`（§6.11），算術檢查為建議性；輸出 `qa/eval_YYYYMMDD.md` |

一併出貨：§6.9（擴充 `COUNT_DOCS`）、§6.11（`scripts/lib/signal-block.js`）、§4.4 的 `result-validator` 契約檢查（PR #26）；`risk-stress-test` — 第一層的第六個技能、不在十大之列 — 於 [PR #27](https://github.com/yennanliu/InvestSkill/pull/27)。**§3.1 第一層六個技能全部出貨。** 路線圖之外新增：`fact-check`——逐條陳述層級的查核與引用，補上 `result-validator` 旁缺少的另一半信任機制——於 [PR #28](https://github.com/yennanliu/InvestSkill/pull/28)；學習區第二部（第 9–13 課、「當答案是不」案例、+32 條術語）於 [PR #29](https://github.com/yennanliu/InvestSkill/pull/29)，依據[學習區缺口審查](LEARNING-GAP-REVIEW-zh-TW.md)。§8 P0/P1 中仍待辦：§4.3（`full-report` 執行所有框架）、全技能 `--lang zh-TW`、JSON 頁尾、繁中 Skill Reference 索引（§5.6）。

---

## 1. 專案現況

| 面向 | 現況 | 評估 |
|------|------|------|
| 技能 | 27 個目錄，對外宣稱 26 個（排除 `report-generator`） | 單一個股的覆蓋很廣；**ETF、稅務、財報前分析的覆蓋為零** |
| 技能契約 | 訊號區塊 27/27 · 資料驗證關卡 22/27 · 論點失效條件 21/27 · **標準化 Data & Sources 表頭（資料日期 · 來源 · 取得方式 · 信心度）1/27**（另有 11 個只有較鬆散的「資料來源」備註）· `--lang zh-TW` 2/27 | 網站承諾每份分析都標示資料來源；技能多數沒有做到，也沒有測試強制執行 |
| 轉址型技能 | `fundamental-analysis`（66 行）、`dcf-valuation`（108 行）、`research-bundle`（93 行，已標記棄用） | 在 README、網站分類、`full-report` 中都被算作並列為完整框架 |
| `full-report` | `--depth comprehensive` 執行 15 個模組 | 漏掉 v1.8 之後新增的 6 個框架（`10k-digest`、`bear-case`、`industry-map`、`catalyst-calendar`、`position-ladder`、`stock-screener`）；15 個模組中有 2 個是轉址 |
| 學習網站 | 8 課 + 概念、術語表（44 條）、選擇技能、使用情境、資料與準確性、5 個示範 — 雙語 | 基礎極佳。缺少：ETF、稅務、財報季機制、**虧損/放棄型**案例、自我測驗、非美國投資人指南 |
| 測試與腳本 | 389 項結構檢查、安裝腳本沙盒、連結檢查、每日網站審查 | 測的全是*結構*。沒有任何測試驗證提示詞執行後是否真的產出契約內容 |
| 文件衛生 | README、FAQ、PLATFORM-COMPATIBILITY 仍寫著「18 skills」「23 slash commands」「288+/294+ tests」 | 數量測試只涵蓋六個網站相關文件 |

**值得保留的優勢。** 雙形式發佈（SKILL.md + 通用提示詞）加上同步測試；標準化訊號區塊；同類工具少見的雙語、從第一原理出發的學習課程；誠實的「無執行環境、無 API 金鑰、資料由你掌握」立場；以及展示*判斷力*而非只展示格式的示範（META 10-K、PFE 價值陷阱、UPST 不交易）。

**一段話總結缺口。** InvestSkill 是一座深入的個股研究台，上面接了一層扎實的教學。它缺的是真實投資人工作流程的其餘部分：多數投資組合賴以建立的 ETF 核心、決定你真正留下多少錢的稅務層、財報*之前*的視角、寫下並追蹤論點的地方，以及從已平倉交易中學習的方法。在信任面，網站承諾每份分析都標示資料來源，但技能尚未強制執行。而工具鏈只測結構，從不測行為。

---

## 2. 十大建議

| # | 建議 | 類型 | 工作量 | 為何重要 |
|---|------|------|--------|----------|
| 1 | **修正過時的數量並歸檔歷史文件**（§7） | 一致性 | S | 可信度。整個 repo 中每小時投入回報最高的工作 |
| 2 | **強制執行技能契約**：每個分析技能都要有 Data & Sources 表頭 + 資料驗證 + 論點失效條件，並加上測試（§4.1、§6.3） | 信任 | M | 網站已經承諾了；只有 1/27 的技能做到 |
| 3 | **重新分類 3 個轉址技能**為別名，或恢復為真正的框架；宣稱誠實的數量（§4.2） | 信任 | S–M | 26 個「框架」中有 3 個是空殼 |
| 4 | **`etf-analysis`** — ETF / 指數基金盡職調查（§3.1） | 新技能 | M | 對美股散戶受眾而言最大的盲點 |
| 5 | **`earnings-preview`** — 財報*之前*的技能（§3.1） | 新技能 | M | `earnings-call-analysis` 是會後分析；`catalyst-calendar` 只列日期 |
| 6 | **`thesis-tracker`** — 撰寫、儲存、重新檢查論點（§3.1） | 新技能 | M | 實戰劇本步驟 1、9、10 背後沒有對應技能 |
| 7 | **`tax-lens`** — 美國稅務機制 + 非美國投資人模組（§3.1） | 新技能 | M | 稅決定你留下多少；W-8BEN / 預扣稅對繁中受眾至關重要 |
| 8 | **`learning-coach`** — 逐行解釋任何 InvestSkill 輸出並出題測驗（§3.1） | 新技能 | S–M | 連接專案的工具半邊與學習半邊 |
| 9 | **`scripts/sync-prompts.js` + `scripts/new-skill.js`** — 由 SKILL.md 產生 `prompts/*.md`，並腳手架新技能（§6.1、§6.2） | 工具 | M | 消除 12 步流程所依賴的手動同步 |
| 10 | **`scripts/eval-skills.js`** — 以固定樣本進行可選的行為評測（§6.4） | 工具 | L | 今天沒有任何東西驗證提示詞*能運作*，只驗證它長得對 |

建議的版本對應：#1–#3 → **1.11.1**（patch）· #4–#8 → **1.12.0 → 1.14.0**（每個 minor 一到兩個技能）· #9–#10 作為工具一併落地。

---

## 3. 新的 LLM 技能

工作量：**S** < 1 天 · **M** 1–3 天 · **L** 1 週以上（包含兩種檔案形式、兩種網站語言、測試、示範）。

### 3.1 第一層 — 填補投資人工作流程的真實缺口

| 技能 | 產出 | 輸入 | 搭配 | 工作量 |
|------|------|------|------|--------|
| `etf-analysis` | **ETF 適配分數 0–10**：費用率 vs. 同類、追蹤差異、AUM / 日均量 / 買賣價差、前十大持股權重與集中度、產業/因子/國家傾斜、**與使用者其他持股的重疊 %**、配息率與資本利得分配紀錄、結構警示（槓桿、反向、合成、ETN）、「買 ETF vs. 直接買前 5 大成分股」比較 | 代號（可多個）、可選的目前持股 | `portfolio-review`、`sector-analysis`、`stock-screener` | M |
| `earnings-preview` | 市場共識營收/EPS/財測與**耳語差距**；過去 8 季超預期比率與財報後漲跌分佈；選擇權隱含波動 vs. 實際波動；**價格已反映什麼**（目前股價隱含的成長率）；要看的 KPI；三情境矩陣（超預期且上修 / 超預期但下修 / 未達預期）與預期反應及部位管理規則 | 代號、財報日期、可選的上季逐字稿 | `earnings-call-analysis`（會後）、`options-analysis`、`catalyst-calendar` | M |
| `thesis-tracker` | 儲存的論點檔案 `output/thesis/<TICKER>.md`：一段話論點、3–5 個**帶門檻的 KPI**、失效觸發條件（從各技能的「論點失效」章節匯入）、催化劑清單、事前驗屍、決策日誌。`--update` 以新資料重讀並回傳 **INTACT / WEAKENED / BROKEN** 及具體變動的那一行 | 代號 + 先前分析，或既有論點檔案 | 所有單一個股技能；`position-ladder`、`bear-case` | M |
| `tax-lens` | 部位或投資組合的美國稅務機制：短期 vs. 長期資本利得、**洗售窗口檢查**、合格股息 vs. 一般股息（持有期間測試）、稅務批次選擇（指定批次 vs. FIFO）、稅損收割配對、帳戶配置（應稅 vs. IRA/401k）、預估年度稅務拖累。**`--non-us` 模組**：W-8BEN、30 % 股息預扣稅（或協定稅率）、非居民外國人一般不課美國資本利得稅、美國境內資產超過非居民免稅額的遺產稅曝險、愛爾蘭註冊 UCITS 替代方案。強制「非稅務建議 — 請諮詢專業人士」關卡 | 含批次/日期的持股，或擬進行的交易 | `position-ladder`、`portfolio-review`、`dividend-analysis`、`etf-analysis` | M |
| `risk-stress-test` | 投資組合 / 部位風險報告：貝他加權曝險、**歷史情境重演**（2008 金融危機、2020 年 3 月、2022 升息衝擊、2025 關稅衝擊）、95/99 % 參數化 VaR / CVaR、最大回撤估計、相關性飆升情境、利率 / 美元 / 油價敏感度、流動性（以 20 % 日均量出清所需天數）。風險預算分數 0–10 | 持股 + 權重 | `portfolio-review`、`economics-analysis`、`position-ladder` | M |
| `learning-coach` | 接收**任何 InvestSkill 輸出**，像導師一樣解釋：每個指標的白話意義、為何重要、好壞區間、對應的課程；接著提出 3–5 個蘇格拉底式問題與「什麼會改變你的看法？」。`--level beginner/intermediate` · `--lang zh-TW` · `--quiz` 模式練習某一課 | 貼上的分析，或課程名稱 | `result-validator`、整個學習課程 | S–M |

### 3.2 第二層 — 給進階使用者的深度

| 技能 | 產出 | 搭配 | 工作量 |
|------|------|------|--------|
| `forensic-accounting` | 目錄中提到卻從未計算的標準盈餘品質模型：**Beneish M-Score**、Altman Z、Sloan 應計比率、現金流 vs. 盈餘背離、資本化成本與收入認列檢查、更換會計師 / 關鍵查核事項、關係人交易警示。操縱風險分數 | `financial-report-analyst`、`bear-case` | M |
| `proxy-governance` | DEF 14A 委託書解讀：薪酬與績效的一致性、SBC 稀釋 vs. 買回抵銷、董事會獨立性與任期、雙重股權 / 控制條款、關係人交易、薪酬投票歷史。治理分數 0–10 | `financial-report-analyst`、`insider-trading` | M |
| `trade-postmortem` | 檢討一筆已平倉交易或一整年的交易：**流程 vs. 結果**矩陣（好決策 / 壞結果 …）、計畫遵循度、偵測到的偏誤（錨定、處置效應、FOMO）、事前技能會怎麼說、一行寫進日誌的教訓 | `thesis-tracker`、`position-ladder` | S–M |
| `investment-policy` | 給新手的投資政策聲明（IPS）：目標、期間、風險*承受能力* vs. *承受意願*、目標配置與區間、投入與再平衡規則、「我不會做的事」清單。之後 `portfolio-review` 以此為基準評分 | `portfolio-review`、`etf-analysis` | S–M |
| `ipo-analysis` | S-1 / 424B 解讀：商業模式與單位經濟、資金用途、雙重股權、閉鎖期到期日、發行中的內部人出售、以 IPO 價格區間做同業比較、首日漲幅基準率。IPO 品質分數 | `financial-report-analyst`、`catalyst-calendar` | M |
| `pair-trade` | 兩檔標的的相對價值設定：相關性與共整合代理、價差 z 分數、避險比率（貝他中性或美元中性）、價差應收斂的基本面理由、失效條件。`TODO.md` 中長期未完成的項目 | `competitor-analysis`、`technical-analysis` | M |

### 3.3 重點提案的草圖

**`etf-analysis` — 輸出骨架**

```
Data & Sources · 資料日期 · 發行商月報 · 公開說明書 · 取得方式 · 信心度

1. 基金卡         代號 · 發行商 · 追蹤指數 · 成立日 · AUM · 費用率 · 結構
2. 成本與追蹤     費用率 vs. 同類中位數 · 1/3/5 年追蹤差異 · 價差 · 日均量
3. 你持有什麼     前十大權重 · 持股數 · 產業 / 國家 / 因子傾斜 · 集中度警示
4. 重疊           與使用者其他持股的重疊 %（依權重） · 重複的個股
5. 配息           近 12 月配息率 · 合格股息比例 · 資本利得分配（近 5 年） · 稅務備註
6. 結構風險       槓桿 / 反向 / 合成 / ETN / 單一個股 → 每日重設警告
7. 替代方案       2–3 個更便宜或追蹤更好的同類 · 「vs. 直接買前 5 大」表
8. ETF 適配分數   0–10 含子分數 → 訊號區塊
```

**`earnings-preview` — 情境矩陣**

| 情境 | 機率 | 觸發條件 | 預期波動 | 事前佈局 |
|------|------|----------|----------|----------|
| 超預期且上修 | — | 營收 > 共識 + 財測上調 | + 隱含波動或更多 | 持有 / 加一階 |
| 超預期但下修 | — | EPS 超預期，財測下調 | 持平至 − | 趁強勢減碼 |
| 未達預期 | — | 營收或 EPS < 共識 | − 隱含波動或更多 | 遵守停損 |

另加：「價格已反映什麼」（目前股價隱含的 FCF 成長率，借用 §4.4 的反向 DCF 概念）、8 季超預期/漲跌表，以及隱含波動 vs. 實際波動，讓讀者判斷選擇權市場對這次事件是高估還是低估。

**`thesis-tracker` — 儲存檔案的契約**

```
# 論點 · <TICKER> · 建立 YYYY-MM-DD · 狀態 INTACT | WEAKENED | BROKEN
論點（一段話）· 為何是現在 · 期間
KPI         | 指標 | 門檻 | 最新值 | 日期 | ✓/✗
觸發條件    | 若 <事件/價格> → <行動>          （從「論點失效」章節匯入）
催化劑      | 日期 | 事件 | 預期影響
事前驗屍    | 「12 個月後，這筆投資虧了 40 %，因為……」
決策日誌    | 日期 | 行動 | 價格 | 理由 | 提供依據的技能
```

**`tax-lens --non-us` — 為什麼屬於這裡。** 本專案很大一部分讀者使用繁體中文網站。對買美股的非美國投資人來說，稅務層與美國本土內容教的完全不同：股息在源頭被預扣、資本利得一般不被美國課稅、遺產稅曝險的門檻遠低於美國人，而常見的解法（愛爾蘭註冊 UCITS ETF）根本不是美國上市產品。除了 `dividend-analysis` 裡的一行之外，沒有任何技能或課程提到這些。

**`learning-coach` — 橋樑。** 每一課都說「這是概念」；每個技能都說「這是數字」。今天兩者之間什麼都沒有。這個技能寫起來便宜（大多指向術語表和學習頁面），卻能給專案一個真正的教學迴圈：執行技能 → 執行教練 → 回答它的問題 → 用更好的輸入重新執行技能。

---

## 4. 既有技能的強化

### 4.1 讓契約成真（所有分析技能）

- 每個單一及多代號技能都加上 **Data & Sources 表頭**，格式對齊「資料與準確性」頁面已記載的區塊（資料日期 · 來源 · 取得方式 · 信心度）。今天只有 `full-report` 帶有完整表頭；11 個技能只有較鬆散的「資料來源」一行，缺少資料日期 / 取得方式 / 信心度欄位；15 個什麼都沒有。
- 為缺少的 5 個技能加上**資料驗證關卡**；為缺少的 6 個技能加上**論點失效條件**（meta/輸出型技能可列入允許清單）。
- 每個技能都支援 **`--lang zh-TW`**，不只 `10k-digest` 與 `full-report`。可以在每個 SKILL.md 與提示詞末端附加一段共用的「雙語輸出」說明。
- 訊號區塊之後加上**機器可讀的頁尾**（含 signal、confidence、score、as-of、sources 的 `json` 程式碼區塊），讓評測工具（§6.4）、`result-validator` 與未來網站的「貼上你的輸出」檢查器能解析結果，而不必對框線字元寫正規表達式。

### 4.2 誠實面對轉址技能

`fundamental-analysis`、`dcf-valuation`、`research-bundle` 是指向他處的空殼，卻在 README、`SKILL_CATEGORIES`、`CHOOSE-A-SKILL` 與 `full-report` 的模組表中被列為完整框架。二選一：

- **(a) 恢復** — 給每個一個真正不同的任務（例如 `dcf-valuation` 變成*反向* DCF / 預期投資工具；`fundamental-analysis` 變成不含估值的純報表深度解析），或
- **(b) 重新分類** — 移到「別名」類別，宣稱 **23 個框架 + 3 個別名**，並相應更新框架數量規則與測試。

選項 (b) 半天可完成；選項 (a) 是一次 minor 發佈。兩者都比把它們算進去更好。

### 4.3 `full-report` — 讓「comprehensive」名副其實

加入缺少的六個框架（`bear-case` 是最重要的遺漏 — 一份沒有紅隊的完整報告），把兩個轉址模組換成其目標，並重新分層：quick 5 · standard 10 · comprehensive **全部**。加上 `--skip <skill>` 控制成本。

### 4.4 針對性升級

| 技能 | 新增 | 原因 |
|------|------|------|
| `stock-valuation` | `--reverse` 模式：反解目前股價隱含的成長率 / 利潤率 | 操作手冊工作流程 E 與 META 示範都用了，但不是技能功能 |
| `stock-screener` | 命名預設篩選（`--preset piotroski`、`dividend-aristocrats`、`magic-formula`、`rule-of-40`、`net-net`）、產業中性排名、接受 ETF 代號 | 新手真正會問的篩選；今天每次都要客製 |
| `portfolio-review` | 券商 CSV 欄位對應（Schwab、Fidelity、IBKR、Firstrade）與 IPS 比較章節 | 使用者會貼匯出檔；技能沒有任何格式指引 |
| `catalyst-calendar` | 除息日、閉鎖期到期、每月 / 每季選擇權到期、S&P 與 Russell 指數成分調整日 | 已有 FOMC 與指數資格；漏掉會撼動個股的事件 |
| `result-validator` | 檢查 Data & Sources 表頭與 JSON 頁尾是否存在；輸出自身的 JSON 判定 | 使其成為 §6.4 的 CI 端裁判 |
| `economics-analysis` | 一行**景氣階段分類**（early / mid / late / recession），供 `sector-analysis` 與 `risk-stress-test` 使用 | 零件都在（殖利率曲線、LEI、紐約聯準機率）；結論未標準化 |
| `technical-analysis` | 相對 SPY 與產業 ETF 的相對強度；「趨勢 + 量 + RS」檢查表分數 | 操作手冊的 UPST 案例需要 3 項確認；把檢查表明文化 |
| `dividend-analysis` | 非美國持有人的預扣稅後殖利率一行 | 一行字，對繁中受眾意義重大 |

---

## 5. 網站內容（學習金融的角度）

### 5.1 新的學習課程

| # | 課程 | 涵蓋 | 相關技能 |
|---|------|------|----------|
| 9 | **ETF 與指數投資** | ETF 是什麼、費用率與追蹤差異、核心-衛星、重疊、什麼時候個股勝過 ETF | `etf-analysis`、`portfolio-review` |
| 10 | **稅務與帳戶類型** | 短期 vs. 長期、洗售、合格股息、稅損收割、應稅 vs. IRA/401k；**非美國投資人章節**（W-8BEN、預扣稅、遺產稅、UCITS） | `tax-lens`、`position-ladder` |
| 11 | **看懂財報季** | 季度週期、共識與財測、「超預期卻下跌」、隱含波動、如何讀新聞稿與 8-K | `earnings-preview`、`earnings-call-analysis` |
| 12 | **心理與流程** | 比第 6 課更深：處置效應、錨定、FOMO、事前驗屍、檢查表、寫日誌、流程 vs. 結果 | `trade-postmortem`、`thesis-tracker` |

> **狀態（2026-09-24，[PR #29](https://github.com/yennanliu/InvestSkill/pull/29)）：** 第 9 課（ETF）、第 10 課（稅，含非美國章節）、第 11 課（財報季）、第 12 課（心理）已出貨——網站上編為**第 10–13 課**，因為先新增了「第一筆交易之前」（帳戶、券商、下單、IPS）作為第 9 課。總經與 Fed、選擇權兩課仍待辦。見 [LEARNING-GAP-REVIEW-zh-TW.md](LEARNING-GAP-REVIEW-zh-TW.md)。
| 13 | **總體經濟與聯準會週期** | 利率、殖利率曲線、通膨、美元、景氣階段如何輪動產業 | `economics-analysis`、`sector-analysis` |
| 14 | **給股票投資人的選擇權** | 掩護性買權、保護性賣權、隱含波動對持股人的意義、為何不要裸賣 | `options-analysis` |

### 5.2 案例研究

- **一個虧損或「放棄」的案例。** 兩個學習總結案例（Apple、AMD）都以買進收尾。新增一個雙語案例，讓整個迴圈以**不買**收尾 — 操作手冊已有兩個候選（PFE 價值陷阱、UPST 不交易），但只以英文存在於 §3。
- **一個論點破裂的案例。** 買進 → KPI 破線 → 真正執行賣出紀律，並展示 `thesis-tracker` 檔案的前後對照。
- **第一筆 1 萬美元的 ETF 核心組合**，使用 `investment-policy` → `etf-analysis` → `portfolio-review`。

### 5.3 術語表缺口（44 → 約 70 條）

技能今天會輸出、但兩種語言都沒有條目的術語：Beneish M-Score · 應計比率 · 股票薪酬（SBC）· GAAP vs. non-GAAP · 洗售 · 除息日 · 合格股息 · Form 4 · 13F · 8-K · 殖利率曲線 / 倒掛 · VIX · 賣買權比 · ATR · MACD · 回撤 / 最大回撤 · Sortino 比率 · 商譽與減損 · 營運槓桿（DOL）· 反向 DCF · Rule of 40 · 財測 · 市場共識 · 費用率 · 追蹤差異 · W-8BEN / 預扣稅 · 閉鎖期 · 雙重股權。§6.5 的腳本可防止清單再長回來。

### 5.4 參考與信任頁面

- **非美國投資人指南**（雙語）— 券商、W-8BEN、預扣稅、匯率、遺產稅、UCITS 替代方案。很可能是繁中受眾閱讀最多的頁面。
- **自備資料（Bring Your Own Data）** — 七月審查中仍未完成的 C2 項目。**已部分出貨：** 資料與準確性頁新增「自備資料：無金鑰的 EDGAR 路徑」一節（助理依 `data.sec.gov` 步驟自行抓取 · 以 `fetch-edgar.js`／`fetch-fundamentals.js` 下載後貼上 · 貼上手邊已有的資料），且 `10k-digest`、`financial-report-analyst`、`fact-check` 內建取檔步驟。仍未完成：MCP 資料伺服器與券商 CSV 的操作範例。`data/` 中兩份零散的 10-K PDF 已移除——輔助工具可隨時重新產生純文字版。
- **網站版 FAQ** — `FAQ.md` 有 50 多個問答，但網站兩種語言都沒有 FAQ 頁面；它也仍寫著「18 skills」。
- **選擇技能頁面新增比較**：`bear-case` vs. `result-validator` · `catalyst-calendar` vs. `earnings-preview` · `position-ladder` vs. `portfolio-review` · `etf-analysis` vs. `stock-eval`。
- 每課結尾的**自我測驗**與**可列印的一頁速查表**（六月審查中皆仍未完成）。

### 5.5 互動式、零執行環境的工具

純靜態的客戶端 JavaScript 能維持「不執行任何東西、不回傳任何資料」的承諾，同時讓學習課程可以動手操作：

- **計算器**：複利、DCF 敏感度（WACC × 終端成長率矩陣）、部位大小 / 每筆風險、股息預扣稅影響、ETF 重疊（貼上兩份持股清單）。
- **提示詞產生器**：選技能 → 代號 → 旗標 → 可直接複製的提示詞。通用平台（ChatGPT / Gemini / 本地模型）使用者今天得手動組裝。
- **貼上你的輸出檢查器**：解析訊號區塊與 Data & Sources 表頭，標示缺少的欄位。用實際操作來教契約。
- **課程進度**（localStorage）與每課預估閱讀時間。
- 每個示範頁面的**「資料日期」橫幅**，由來源檔案中的日期驅動，讓讀者知道價格有多舊。

### 5.6 繁體中文對等

- 繁中導覽沒有**技能參考**索引（七月的 D2 項目仍未完成）；即使技能本文維持英文，也應產生繁中索引頁。
- §4.1 落地後，每技能頁面可呈現 `--lang zh-TW` 的輸出區塊。
- §6.6 的腳本可防止英文與繁中檔案漂移。

---

## 6. 缺少的腳本與工具

| # | 腳本 | 目的 | 工作量 | 狀態 |
|---|------|------|--------|------|
| 6.1 | `scripts/sync-prompts.js` | 由 `SKILL.md` **產生** `prompts/<name>.md`：去除 frontmatter、將 `/us-stock-analysis:x` 改寫為 `x`、套用平台用語允許清單。`--check` 模式供 CI 使用。今天同步只以檔案存在與 0.3×–2× 的 token 比例驗證 | M | ✅ PR #26 |
| 6.2 | `scripts/new-skill.js <name>` | 以已含契約章節的範本腳手架兩個檔案、將技能加入 `SKILL_CATEGORIES`、在兩份 `CHOOSE-A-SKILL` 插入佔位列、加上 CHANGELOG Unreleased 一行，然後跑測試。把 12 步手動流程壓縮成一步 | M | ✅ PR #26 |
| 6.3 | `scripts/check-skill-contract.js` | 對每個分析技能檢查：資料驗證關卡、Data & Sources 表頭、論點失效條件、訊號區塊、免責聲明、`--lang` 段落、JSON 頁尾。meta/輸出型技能列入允許清單。接進 `npm test` | S | ✅ PR #26 |
| 6.4 | `scripts/eval-skills.js` | **可選的行為評測**（`EVAL_CMD` 環境變數，例如 `claude -p`）。樣本放在 `data/fixtures/<TICKER>.md`，內含貼上的財務數據；執行每個技能；斷言 JSON 頁尾可解析、Data & Sources 存在、算術一致（FCF = OCF − capex、訊號 ↔ 分數區間）。輸出 `qa/eval_YYYYMMDD.md`。可考慮以 `claude plugin eval` 作為執行器 | L | ✅ PR #26 |
| 6.5 | `scripts/check-glossary-coverage.js` | 從技能擷取指標術語（精選的正規表達式清單）；每個術語都必須在 `GLOSSARY.md` 與 `GLOSSARY-zh-TW.md` 中有條目 | S | ⬜ |
| 6.6 | `scripts/check-zh-parity.js` | 每個 `site/content/X.md` 都有 `X-zh-TW.md`；標題數量在容許範圍內；英文在繁中之後被修改時警告（git log） | S | ⬜ |
| 6.7 | `scripts/check-demo-freshness.js` | 解析示範與操作手冊實際執行中的資料日期；超過 90 天警告；供 §5.5 的橫幅使用 | S | ⬜ |
| 6.8 | `scripts/fetch-edgar.js <TICKER> [10-K\|10-Q\|8-K\|DEF14A\|4]` | 無金鑰的輔助工具：解析 CIK、把最新申報文件下載到 `data/`，遵守 SEC 的 User-Agent 與頻率規則。可選、位於外掛之外 — 一條具體的「自備資料」路徑 | M | ✅ 以 `fetch-edgar.js`（HTML + 純文字 + 含標頭欄位的 `.json`，而非 PDF）與 `fetch-fundamentals.js`（XBRL companyfacts → `data/fixtures/<TICKER>.md` 資料包）出貨，共用 `scripts/lib/edgar.js`；腳本本身是可選指令、`npm test` 不會執行它們，但其離線測試 `scripts/test-edgar.js` 會納入 `npm test`；輸出不納入版本控制 |
| 6.9 | 擴充 `COUNT_DOCS` | 加入 `FAQ.md`、`PLATFORM-COMPATIBILITY.md`、`CONTRIBUTING.md` 與 README 的測試數量行 — 或歸檔過時文件（§7） | S | ✅ PR #26 |
| 6.10 | `scripts/build-cheatsheet.js` | 由術語表與訊號分數區間產生可列印速查表，使其永不漂移 | S | ⬜ |
| 6.11 | `scripts/lib/signal-block.js` | 供 6.3、6.4、`site-review.js` 與網站檢查器共用的訊號區塊 / JSON 頁尾解析器 | S | ✅ PR #26 |
| 6.12 | `scripts/gen-current-state.js` | 從檔案系統重新產生 `CLAUDE.md` 的「Current State」區塊（未完成的 A3 項目） | S | ⬜ |

---

## 7. 本次審查發現的一致性問題

全部已對照 v1.11.0 的工作樹驗證。適合一次 patch 發佈（**1.11.1**）。 **下表所有項目皆已在 [PR #26](https://github.com/yennanliu/InvestSkill/pull/26) 中修正。**

| 檔案 | 行 | 現在寫的 | 應該寫的 |
|------|----|----------|----------|
| `README.md` | 234 | "23 native slash commands" | 27（或 26 個框架） |
| `README.md` | 281 | "Add to `plugin.json` skills array" | 技能會自動探索；不需修改 `plugin.json` |
| `README.md` | 282、288 | "288+ tests"、"294+ passing" | 今天是 389 — 自動推導，或刪掉數字 |
| `README-zh-TW.md` | 402 | "294+ 個" | 同上 |
| `FAQ.md` | 139–146 | "18 skills" ×4 | 26 個框架 / 27 個技能 |
| `PLATFORM-COMPATIBILITY.md` | 48 | "All 18 skills" | 同上 |
| `CONTRIBUTING.md` | 17 | 連到 `issues/new?template=bug_report.md` | `.github/ISSUE_TEMPLATE/` 不存在 — 新增範本或移除參數 |
| `HIGH-IMPACT-IMPROVEMENTS.md`、`CI-CD-FIXES-SUMMARY.md`、`DEPLOYMENT-STATUS.md`、`TODO.md` | — | 歷史文件（2026 年 2–4 月、「18 skills」、TODO 最後更新 2026-02-24） | 移到 `doc/archive/`；把 `TODO.md` 改成精選前 5 名並連到本文 |
| `full-report` SKILL.md / 提示詞 | 模組表 | 15 個模組，其中 2 個是轉址 | 見 §4.3 |
| 網站「資料與準確性」頁 vs. 技能 | — | 「每份分析都應標示資料來源」 | 只有 `1/27` 技能含有該表頭 — 見 §4.1 |

---

## 8. 優先順序路線圖

| 優先級 | 主題 | 項目 | 版本 |
|--------|------|------|------|
| **P0 — 本週** | 可信度 | §7 修正 · 擴充 `COUNT_DOCS`（6.9）· 重新分類轉址技能（§4.2 選項 b）· `check-skill-contract.js`（6.3） | 1.11.1 |
| **P1 — 本月** | 契約與工具 | 所有技能加上 Data & Sources + 關卡 + `--lang`（§4.1）· `full-report` 全模組（§4.3）· `sync-prompts.js`（6.1）· `new-skill.js`（6.2）· 繁中技能參考（§5.6） | 1.11.2 或併入 1.12.0 |
| **P2 — 下一季** | 投資人工作流程 | `etf-analysis` + 第 9 課 · `earnings-preview` + 第 11 課 · `thesis-tracker` · `tax-lens` + 第 10 課 + 非美國投資人指南 · `learning-coach` · 術語表 +25 · 虧損/放棄案例 | 1.12.0 – 1.14.0 |
| **P3 — 之後** | 深度 | `risk-stress-test` · `forensic-accounting` · `proxy-governance` · `trade-postmortem` · `investment-policy` · 計算器與提示詞產生器 · `eval-skills.js`（6.4） | 1.15.0+ |
| **待辦** | | `ipo-analysis` · `pair-trade` · 第 12–14 課 · 測驗與速查表 | 視需求而定 |

---

## 9. 刻意不提出的項目

- **即時資料 API 整合、券商 API、警報、排程**（`TODO.md` 的最前面）。它們與專案最強的承諾矛盾 — 無執行環境、無金鑰、無遙測。「自備資料」頁面與可選的 EDGAR 輔助工具能帶來同樣好處，又不改變 InvestSkill 的本質。
- **加密貨幣、外匯、國際市場。** 名字就是*美股*分析；學習課程、術語表與稅務內容都以此為前提。在美股故事（ETF、稅務、財報）完成之前擴張，只會稀釋教學。
- **機器學習價格預測 / 回測引擎 / 統計套利。** 不是提示詞工程的交付物；LLM 無法可靠地計算這些，把它們當提示詞出貨會削弱「資料與準確性」的立場。
- **修改訊號區塊。** 它是每個技能、測試、示範與課程共享的唯一契約。資料來源與機器可讀性放在它*旁邊*（§4.1），不放進裡面。

---

*僅為建議。教育性專案 — 非財務或稅務建議。*
