# 財務術語表

> 為 InvestSkill 各框架所產出的每個指標提供白話定義。每則條目皆附上公式、概略的「好 vs. 壞」區間，以及產出該指標的技能。區間僅為經驗法則，並非絕對標準——產業、成長階段與利率等情境永遠是關鍵。標題保留英文（財務術語慣用英文，亦使錨點連結穩定一致）。

**快速跳轉：** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [I](#i) · [M](#m) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [W](#w) · [Y](#y)

---

## A

### Altman Z-Score
**奧特曼 Z 分數。** 破產風險分數，結合五項加權比率（營運資金、保留盈餘、EBIT、權益、營收——皆相對於總資產）。
- **好 / 壞：** > 3.0 安全 · 1.8–3.0 灰色地帶 · < 1.8 財務困境。
- **由此技能產出：** `financial-report-analyst`、`result-validator`。

### Alpha
**超額報酬。** 在既定風險水準下，超越市場（或基準）預期所賺取的報酬。正 alpha 代表有實力或優勢；零 alpha 代表只是與市場打平。
- **由此技能產出：** `portfolio-review`。

### Asset Turnover
**資產周轉率。** 公司將資產轉換為營收的效率。`營收 ÷ 總資產`。
- **好 / 壞：** 越高越好，但因產業而異（零售偏高、公用事業偏低）。
- **由此技能產出：** `fundamental-analysis`。

---

## B

### Beta (β)
**貝他值。** 股票相對於市場的波動程度。β = 1 與市場同步；β > 1 波動更大；β < 1 較平穩；負 β 與市場反向。
- **好 / 壞：** 無好壞之分——它衡量的是*風險*。高 beta 會同時放大漲幅與跌幅。
- **由此技能產出：** `dcf-valuation`（用於 WACC）、`technical-analysis`、`portfolio-review`。

### Book Value
**帳面價值。** 資產負債表上的淨資產：`總資產 − 總負債`。權益的會計「清算」價值。
- **由此技能產出：** `stock-valuation`、`fundamental-analysis`。

### Burn Rate
**現金消耗率。** 公司支出超過營收的速度，通常用於尚未獲利的公司。常與**現金跑道（runway，剩餘可撐月數）**並列。
- **好 / 壞：** 消耗越低、跑道越長越安全。自由現金流為負且跑道短是警訊。
- **由此技能產出：** `financial-report-analyst`。

---

## C

### CAGR (Compound Annual Growth Rate)
**年複合成長率。** 多年期間平滑後的年化成長率。`(期末 ÷ 期初)^(1/年數) − 1`。
- **由此技能產出：** `dividend-analysis`、`fundamental-analysis`。

### Current Ratio
**流動比率。** 短期流動性：`流動資產 ÷ 流動負債`。公司能否支應未來 12 個月的帳款？
- **好 / 壞：** > 1.5 充裕 · 1.0–1.5 尚可 · < 1.0 可能吃緊。
- **由此技能產出：** `fundamental-analysis`、`financial-report-analyst`。

---

## D

### Days-to-Cover (Short Interest Ratio)
**回補天數 / 空單比率。** 依正常成交量計算，空頭需要幾天才能買回（回補）所有被放空的股票。`放空股數 ÷ 平均日成交量`。
- **好 / 壞：** 越高代表軋空的燃料越多。> 5 天值得注意；> 10 天為高。
- **由此技能產出：** `short-interest`。

### DCF (Discounted Cash Flow)
**現金流量折現。** 此估值法將未來自由現金流預估後，以折現率（WACC）折回現值。產出為每股**內在價值**。
- **由此技能產出：** `dcf-valuation`、`stock-valuation`。參見 [概念 → 內在價值如何運作](concepts-zh-tw.html)。

### Debt-to-Equity (D/E)
**負債權益比。** 槓桿：`總負債 ÷ 股東權益`。公司以債務 vs. 股東資金支應自身的比例。
- **好 / 壞：** < 1.0 保守 · 1.0–2.0 適中 · > 2.0 高槓桿（因產業而異——銀行與公用事業偏高）。
- **由此技能產出：** `fundamental-analysis`、`dividend-analysis`。

### Dividend Coverage Ratio
**股利保障倍數。** 盈餘（或自由現金流）可支應股利的倍數。`EPS ÷ 每股股利`，或使用 FCF 版本。
- **好 / 壞：** > 2 倍健康 · 1.5–2 倍尚可 · < 1.2 倍脆弱。
- **由此技能產出：** `dividend-analysis`。

### Dividend Payout Ratio
**股利發放率。** 以股利形式發出的盈餘占比。`股利 ÷ 淨利`。
- **好 / 壞：** < 60% 通常可持續 · 60–80% 留意 · > 100% 發放超過所賺（減股警訊）。
- **由此技能產出：** `dividend-analysis`。

### Dividend Yield
**股利殖利率。** 年股利占股價的百分比。`年股利 ÷ 股價`。
- **好 / 壞：** 極高殖利率（例如 > 7%）往往是*警訊*而非禮物——市場可能預期減股。參見 [Yield Trap](#yield-trap)。
- **由此技能產出：** `dividend-analysis`。

---

## E

### EBITDA
**稅前息前折舊攤銷前獲利。** 衡量營運現金產生能力的替代指標，排除資本結構與會計選擇的影響。
- **注意：** 忽略真實的資本成本；「EBITDA 不等於現金流」。
- **由此技能產出：** `stock-valuation`、`fundamental-analysis`。

### EPS (Earnings Per Share)
**每股盈餘。** 歸屬於每股的淨利。`淨利 ÷ 流通股數`。「稀釋 EPS」納入選擇權／可轉債。
- **由此技能產出：** 幾乎所有基本面技能。

### EV (Enterprise Value)
**企業價值。** 買方收購整間公司所付的價格：`市值 + 總負債 − 現金`。用以取代市值，使高負債與高現金公司可公平比較。
- **由此技能產出：** `stock-valuation`。

### EV/EBITDA
企業價值相對於營運獲利——不受資本結構影響的估值倍數。
- **好 / 壞：** < 10 倍常屬便宜 · 10–15 倍合理 · > 15 倍偏貴（因產業而異）。
- **由此技能產出：** `stock-valuation`。

---

## F

### FCF (Free Cash Flow)
**自由現金流。** 支應營運費用*與*資本支出後剩餘的現金。`營運現金流 − 資本支出`。是業主實際能取走的現金。
- **好 / 壞：** 持續為正且成長為黃金標準。FCF 為負則需有成長故事才合理。
- **由此技能產出：** `dcf-valuation`、`fundamental-analysis`、`dividend-analysis`。

### FCF Yield
**自由現金流收益率。** 自由現金流相對於市值。`FCF ÷ 市值`。是盈餘收益率的現金版本。
- **好 / 壞：** > 5% 吸引人 · 3–5% 合理 · < 3% 偏貴。
- **由此技能產出：** `stock-valuation`。

---

## G

### Gross Margin
**毛利率。** 扣除直接商品成本後的利潤。`(營收 − 銷貨成本) ÷ 營收`。是定價能力的初步判讀。
- **好 / 壞：** 越高且穩定代表有護城河；下滑代表競爭加劇。
- **由此技能產出：** `fundamental-analysis`、`competitor-analysis`。

### Greeks (Options)
**選擇權希臘字母。** 選擇權價格的敏感度：**Delta**（對標的價格）、**Gamma**（delta 的變化率）、**Theta**（時間價值衰減）、**Vega**（對波動率）、**Rho**（對利率）。
- **由此技能產出：** `options-analysis`。

---

## I

### Implied Volatility (IV)
**隱含波動率。** 市場預期的未來波動率，內含於選擇權價格中。IV 越高＝選擇權越貴＝預期波動越大。
- **由此技能產出：** `options-analysis`。

### IV Rank / IV Percentile
**隱含波動率排名／百分位。** 目前隱含波動率相對於過去一年自身水準的位置（0–100）。判斷選擇權相對於自身歷史是「貴」還是「便宜」。
- **好 / 壞：** 高 IV rank 偏向*賣出*權利金；低則偏向*買進*。
- **由此技能產出：** `options-analysis`。

### Interest Coverage Ratio
**利息保障倍數。** 營運獲利支付利息的容易程度。`EBIT ÷ 利息費用`。
- **好 / 壞：** > 5 倍安全 · 2–5 倍尚可 · < 1.5 倍危險。
- **由此技能產出：** `financial-report-analyst`、`dividend-analysis`。

---

## M

### Margin of Safety
**安全邊際。** 股價與你所估內在價值之間的折價。當你的估計出錯時，這就是保護你的緩衝。
- **好 / 壞：** 價值投資者通常希望在買進前有 20–40%+ 的安全邊際。
- **由此技能產出：** `dcf-valuation`、`stock-eval`。參見 [概念 → 安全邊際](concepts-zh-tw.html)。

### Moat
**護城河。** 保護長期利潤的持久競爭優勢——品牌、網路效應、轉換成本、規模或專利。
- **好 / 壞：** 寬 > 窄 > 無。會表現為長期偏高的 ROIC 與穩定的利潤率。
- **由此技能產出：** `competitor-analysis`、`stock-eval`。參見 [概念 → 解讀護城河](concepts-zh-tw.html)。

---

## P

### P/B (Price-to-Book)
**股價淨值比。** 股價相對於會計淨值。`股價 ÷ 每股帳面價值`。
- **好 / 壞：** 最適用於資產密集／金融類公司；< 1.0 可能代表便宜*或*有問題。
- **由此技能產出：** `stock-valuation`。

### P/E (Price-to-Earnings)
**本益比。** 每一元盈餘對應的股價。`股價 ÷ EPS`。最常被引用的倍數；應與公司自身歷史及同業相比，不可單獨判讀。
- **好 / 壞：** 沒有放諸四海皆準的「好」本益比——40 倍的成長股可能比 10 倍的衰退股還便宜。請搭配成長（見 PEG）。
- **由此技能產出：** `stock-valuation`、`stock-eval`。

### P/S (Price-to-Sales)
**股價營收比。** 每一元營收對應的股價。`市值 ÷ 營收`。適用於本益比失去意義的未獲利或早期公司。
- **由此技能產出：** `stock-valuation`。

### PEG Ratio
**本益成長比。** 依成長調整後的本益比。`本益比 ÷ 盈餘成長率(%)`。讓快速與緩慢成長者站在同一基準上比較。
- **好 / 壞：** ~1.0 合理 · < 1.0 可能便宜 · > 2.0 偏貴。
- **由此技能產出：** `stock-valuation`、`stock-eval`。

### Piotroski F-Score
**皮氏 F 分數。** 跨獲利能力、槓桿／流動性與營運效率的 0–9 分基本面健康檢核表。每符合一項得一分。
- **好 / 壞：** 7–9 強 · 4–6 中等 · 0–3 弱。
- **由此技能產出：** `stock-eval`、`fundamental-analysis`。

### Porter's Five Forces
**波特五力。** 從五種壓力評估產業吸引力的框架：同業競爭、供應商議價力、買方議價力、替代品威脅、新進者威脅。
- **由此技能產出：** `competitor-analysis`。

---

## Q

### Quick Ratio (Acid Test)
**速動比率 / 酸性測試。** 比流動比率更嚴格的流動性——排除存貨。`(流動資產 − 存貨) ÷ 流動負債`。
- **好 / 壞：** > 1.0 充裕。
- **由此技能產出：** `fundamental-analysis`。

---

## R

### Residual Income
**剩餘收益。** 高於所用權益資本成本的盈餘。唯有報酬超過資本成本時，才真正創造價值。
- **由此技能產出：** `stock-valuation`。

### ROA (Return on Assets)
**資產報酬率。** 每一元資產的利潤。`淨利 ÷ 總資產`。衡量管理層運用資產基礎的成效。
- **好 / 壞：** > 5% 穩健（因產業而異）。
- **由此技能產出：** `fundamental-analysis`。

### ROE (Return on Equity)
**股東權益報酬率。** 每一元股東權益的利潤。`淨利 ÷ 權益`。留意因高負債而虛增的 ROE。
- **好 / 壞：** > 15% 強 · 10–15% 尚可 · < 10% 弱。
- **由此技能產出：** `fundamental-analysis`、`stock-eval`。

### ROIC (Return on Invested Capital)
**投入資本報酬率。** 最純粹的獲利能力衡量：投入運作的*全部*資本（債務＋權益）所產生的報酬。`NOPAT ÷ 投入資本`。應與 WACC 相比——唯有 **ROIC > WACC** 才創造價值。
- **好 / 壞：** > 15% 優異 · 10–15% 良好 · 低於 WACC＝在毀滅價值。
- **由此技能產出：** `stock-eval`、`fundamental-analysis`、`competitor-analysis`。

---

## S

### Sharpe Ratio
**夏普比率。** 風險調整後報酬：每單位波動所對應的超額報酬。`(報酬 − 無風險利率) ÷ 標準差`。
- **好 / 壞：** > 1 良好 · > 2 很好 · < 1 偏弱。
- **由此技能產出：** `portfolio-review`。

### Short Float (Short Interest %)
**放空比例 / 空單佔流通股比。** 可自由交易股份中被放空的百分比。`放空股數 ÷ 流通股數`。
- **好 / 壞：** > 10% 偏高 · > 20% 高（空單擁擠，具軋空潛力）。
- **由此技能產出：** `short-interest`。

### Support & Resistance
**支撐與壓力。** 歷史上買盤（支撐）或賣盤（壓力）密集聚集的價位。突破這些價位即為技術訊號。
- **由此技能產出：** `technical-analysis`。

---

## T

### Terminal Value
**終值。** 在 DCF 中，明確預測期*之後*所有現金流的價值——往往占總值的 60–80%。對假設的永續成長率極為敏感。
- **由此技能產出：** `dcf-valuation`。參見 [概念 → 內在價值如何運作](concepts-zh-tw.html)。

---

## W

### WACC (Weighted Average Cost of Capital)
**加權平均資本成本。** 公司債務與權益的混合要求報酬率——即 DCF 中的折現率。`(E/V × 權益成本) + (D/V × 債務成本 × (1−稅率))`。
- **好 / 壞：** 無好壞之分——它是門檻。WACC 些微變動就會大幅牽動內在價值。
- **由此技能產出：** `dcf-valuation`。

---

## Y

### Yield Trap
**殖利率陷阱。** 殖利率誘人卻無法持續的股票——市場已預期即將減股。可透過發放率 > 100%、FCF 下滑或負債攀升辨識。
- **由此技能產出：** `dividend-analysis`。參見 [使用情境 → 股利投資人](use-cases-zh-tw.html)。

---

> **延伸閱讀：** [概念](concepts-zh-tw.html) 了解這些指標背後的思維模型 · [選擇技能](choose-a-skill-zh-tw.html) 找到合適的框架 · [資料與準確性](data-and-accuracy-zh-tw.html) 學會如何信任這些數字。

*僅供教育參考。並非投資建議。*
