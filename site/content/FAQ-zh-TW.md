# 常見問題與疑難排解

InvestSkill 的常見問題與常見狀況的解法。英文版：[FAQ](faq.html)。

---

## 目錄

- [安裝](#安裝)
- [平台](#平台)
- [選擇與使用技能](#選擇與使用技能)
- [資料與準確性](#資料與準確性)
- [輸出與報告](#輸出與報告)
- [版本與更新](#版本與更新)
- [錯誤回報、功能建議與求助](#錯誤回報功能建議與求助)
- [進階](#進階)

---

## 安裝

**Q：最快的安裝方式是什麼？**

A：在你要使用的專案目錄執行一行指令，用 `-a` 指定你的 AI 工具：

```bash
curl -fsSL https://raw.githubusercontent.com/yennanliu/InvestSkill/main/install.sh | bash -s -- -a claude
# 可用的工具：claude · cursor · copilot · gemini · codex · opencode · any
```

安裝腳本會把所有框架複製到 `.investskill/prompts/`，並接上該工具自己的入口設定：

| `-a` | 安裝位置 |
|------|----------|
| `claude` | `.claude/skills/<skill>/SKILL.md`（斜線指令） |
| `cursor` | `.cursor/rules/investskill.mdc` |
| `copilot` | `.github/copilot-instructions.md` |
| `gemini` | `GEMINI.md` |
| `codex`、`opencode` | `AGENTS.md` |
| `any` | 只安裝 `.investskill/prompts/`——貼到任何大型語言模型即可使用 |

加上 `-l` 會列出這份對照表，`-h` 顯示所有選項。

**Q：如何在 Claude Code 以外掛方式安裝？**

A：透過外掛市集：

```bash
claude
/plugin marketplace add yennanliu/InvestSkill
/plugin install us-stock-analysis@invest-skill
/us-stock-analysis:stock-eval AAPL
```

從外掛市集安裝的指令帶有命名空間（`/us-stock-analysis:<skill>`）；`install.sh -a claude` 則安裝專案層級的技能，直接用 `/<skill>` 呼叫。兩種擇一即可——同一個專案兩種都裝，每個技能會出現兩次。

**Q：直接把安裝腳本 pipe 給 `bash` 安全嗎？**

A：它只會複製 markdown 檔案，並在 AI 工具的設定檔中附加一段有標記的區塊。它絕不覆蓋既有檔案——指令檔只會在 `<!-- InvestSkill:begin -->` 與 `<!-- InvestSkill:end -->` 標記之間附加內容——而且重複執行不會改變任何東西。想先確認的話，可以先讀 [install.sh](https://github.com/yennanliu/InvestSkill/blob/main/install.sh)，或下載後在本機執行。

**Q：可以裝在使用者層級，而不是單一專案嗎？**

A：可以——加上 `-g` 會安裝到家目錄而非目前的專案，`-d DIR` 指定其他目錄，`-r REF` 則從指定的分支或標籤安裝。

**Q：在 Claude Code 安裝後看不到外掛。**

A：
1. 重新啟動 Claude Code（`exit` 後再執行 `claude`）。
2. 確認有列出：`/plugin list` 應該會看到 `us-stock-analysis`。
3. 如果沒有，先移除再重新加入外掛市集：`/plugin marketplace remove invest-skill`，接著 `/plugin marketplace add yennanliu/InvestSkill`，然後重新安裝。

**Q：出現「plugin not found」錯誤。**

A：先用 `/plugin marketplace list` 確認外掛市集已登錄，再用完整名稱 `us-stock-analysis@invest-skill` 安裝。另一個常見原因是執行 `marketplace add` 時網路中斷——重新執行一次即可。

**Q：如何更新或解除安裝？**

A：在 Claude Code 中，`/plugin marketplace update invest-skill` 會拉取最新版；`/plugin uninstall us-stock-analysis` 會移除外掛。用 `install.sh` 安裝的話，重新執行同一行指令即可更新（會刷新 `.investskill/prompts/`）；要解除安裝，刪除 `.investskill/` 以及 `InvestSkill:begin … InvestSkill:end` 區塊（或安裝時建立的 `.claude/skills/`／`.cursor/rules/investskill.mdc` 檔案）。

---

## 平台

**Q：支援哪些平台？**

A：Claude Code、Cursor、GitHub Copilot、Gemini CLI、Codex、OpenCode，以及任何聊天型大型語言模型（ChatGPT、Claude.ai、Gemini 網頁版、透過 [Ollama](https://github.com/yennanliu/InvestSkill/blob/main/README-ollama.md) 執行的本機模型）。技能都是純 markdown，所以任何能讀提示詞的工具都能使用。各平台的並排比較見[平台相容性](https://github.com/yennanliu/InvestSkill/blob/main/PLATFORM-COMPATIBILITY.md)（英文）。

**Q：每個平台都能用全部 39 個技能嗎？**

A：可以。每個平台拿到的都是同樣的 39 個技能：34 個分析框架、3 個別名（`fundamental-analysis`、`dcf-valuation`、`research-bundle`，會轉址到吸收它們的技能），以及 2 個輸出工具（`report-generator` 與 `basket-report`）。
- **Claude Code**：全部 39 個技能皆為斜線指令
- **Cursor、Gemini CLI、Codex、OpenCode**：全部 39 個技能皆為 `@.investskill/prompts/<skill>.md` 檔案（在儲存庫的複本中則是 `@prompts/<skill>.md`）
- **Copilot**：全部 39 個技能，由 `.github/copilot-instructions.md` 引用
- **任何大型語言模型**：`prompts/` 中 39 個提示詞檔案，一個技能一個

**Q：為什麼宣稱的是 34 個，而不是 39 個？**

A：`report-generator` 是輸出工具（把其他技能的結果轉成 HTML／PDF），不是分析框架；三個別名則只是為了讓舊指令繼續可用而保留。它們都會隨外掛安裝，但不計入框架數。

**Q：在 Cursor、Gemini CLI、Codex 或 OpenCode 要怎麼使用技能？**

A：執行 `install.sh` 之後，在對話中引用提示詞檔案：

```
@.investskill/prompts/stock-eval.md 評估 AAPL
```

安裝腳本寫入的規則／指令檔會告訴 AI 這些框架存在，所以你也可以直接開口問（「用 bear-case 框架分析 TSLA」）。

**Q：Cursor 或 Gemini 好像沒有載入規則。**

A：
1. 確認檔案存在：專案根目錄下的 `.cursor/rules/investskill.mdc`（Cursor）或 `GEMINI.md`（Gemini）。
2. 確認你是**在那個目錄**開啟或啟動 AI 工具——Gemini CLI 只會讀取啟動目錄中的 `GEMINI.md`。
3. 重新啟動編輯器或 CLI 工作階段。
4. 問一句「有哪些 InvestSkill 框架可以用？」——AI 應該會列出來。

**Q：`@` 檔案引用找不到檔案。**

A：檢查路徑：用 `install.sh` 安裝後，提示詞在 `.investskill/prompts/`，不是 `prompts/`。檔名使用連字號（`stock-eval.md`，不是 `stock_eval.md`）。

**Q：在 ChatGPT、Claude.ai 或其他聊天 App 要怎麼用？**

A：把提示詞檔案的內容貼成第一則訊息（或設成自訂指令／專案提示詞），再提出分析需求。在 macOS 上可以用 `cat .investskill/prompts/stock-eval.md | pbcopy` 複製。

**Q：可以完全離線使用嗎？**

A：可以，搭配本機模型——見 [Ollama 指南](https://github.com/yennanliu/InvestSkill/blob/main/README-ollama.md)（英文）。框架本身不需要網路，只有抓取即時行情才需要；用本機模型時，資料由你自己貼進去。

**Q：在 Claude Code 開始的分析，可以接著在 Cursor 繼續嗎？**

A：無法延續同一個工作階段——每個平台各自保存上下文。不過各平台的框架完全相同，所以可以把輸出複製過去，或用 `full-report` 產出一份可分享的 HTML 檔。

---

## 選擇與使用技能

**Q：應該從哪個技能開始？**

A：`stock-eval`——它一次涵蓋品質、價值與風險，最後給出「要／不要」的訊號。[選擇技能](choose-a-skill-zh-tw.html)頁把每個目標對應到合適的框架。

**Q：`fundamental-analysis`、`dcf-valuation`、`research-bundle` 怎麼了？**

A：它們已併入更大的技能，現在是別名：`fundamental-analysis` → `stock-eval`、`dcf-valuation` → `stock-valuation`（DCF 是它的方法一）、`research-bundle` → `full-report`（`--depth quick / standard / comprehensive`）。舊指令仍可使用，並會引導你到新技能。

**Q：估值該用哪個技能？**

A：`stock-valuation`——DCF、比較公司法、EV 倍數與剩餘收益法整合在同一個模型，附敏感度表。再搭配 `bear-case` 壓力測試你的假設。

**Q：要怎麼比較好幾檔股票？**

A：`compare` 把 2–5 檔股票放在同一張表上，並論證該選哪一檔（`/compare AAPL MSFT GOOGL`）。清單更長時，`stock-screener` 會依估值、品質、動能、情緒與成長替多檔股票排名。

**Q：怎麼判斷一家公司的盈餘或資產負債表可不可信？**

A：`forensic-accounting` 評估財報操縱風險（Beneish M 分數、Altman Z 分數、應計項目、現金與盈餘的背離）。`credit-check` 看償債能力與再融資風險——債務到期牆、利息保障倍數與流動性可撐多久。

**Q：財報季前後該跑什麼？**

A：財報公布前：`earnings-preview`（市場共識 vs. 耳語數字、選擇權隱含波動、三情境矩陣）。公布後：用 `earnings-call-analysis` 分析法說會逐字稿，再用 `thesis-tracker --update` 檢查你的投資論點是否仍成立。

**Q：有涵蓋 ETF、稅務與投組風險嗎？**

A：有——`etf-analysis`（成本、追蹤、重疊、結構）、`tax-lens`（美國稅務機制，另有給外國投資人的 `--non-us` 模組；僅供教育，非稅務建議）、`portfolio-review`（配置與再平衡）以及 `risk-stress-test`（歷史情境重演、VaR／CVaR、流動性）。

**Q：怎麼從自己的交易中學習？**

A：買進時用 `thesis-tracker` 寫下投資論點，賣出後執行 `trade-postmortem`——它會把「流程」和「結果」分開檢討，並整理出一條寫進交易日誌的教訓。`learning-coach` 則能逐一解釋任何技能輸出中的指標。

**Q：InvestSkill 可以用在加密貨幣、外匯、原物料或非美股嗎？**

A：效果不可靠。這些框架是圍繞美國上市股票與 SEC 申報文件設計的。ETF、在美國掛牌的 ADR 與股票選擇權（`options-analysis`）都有涵蓋；加密貨幣、外匯與原物料則沒有。

**Q：如果股票代號不存在或已下市怎麼辦？**

A：技能會回報缺少資料，而不是自己編造——每個分析技能都有資料驗證關卡。請務必使用股票代號（`AAPL`），不要用公司名稱。

---

## 資料與準確性

**Q：InvestSkill 會抓取即時行情嗎？**

A：InvestSkill 本身什麼都不抓——它沒有任何執行環境。如果你的 AI 助理能上網或呼叫工具，技能會告訴它該讀哪些第一手來源；否則它只能退回訓練資料，而訓練資料是過時的。每份分析開頭都有 **Data & Sources（資料與來源）** 表頭，讓你看到它實際用了哪一種。需要最新價格時，請自己貼進去。

**Q：可以貼上自己的財務資料嗎？**

A：可以，而且這是最準確的用法。貼上財務報表、10-K／10-Q／8-K、法說會逐字稿或你的持股，再提出分析需求：

```
@.investskill/prompts/financial-report-analyst.md
[貼上 10-K 內文]
分析財報品質與警訊
```

**Q：我的 AI 助理無法上網，要怎麼取得申報文件？**

A：儲存庫內附兩支可選、零相依的腳本，替你抓取第一手來源供貼上：`node scripts/fetch-edgar.js AAPL --form 10-K` 把申報文件存成純文字，`node scripts/fetch-fundamentals.js AAPL` 則從 SEC 的 XBRL 數據產生已對帳的財報資料包。兩者都不屬於外掛本體。詳見[資料與準確性](data-and-accuracy-zh-tw.html)。

**Q：應該提供多少年的歷史資料？**

A：至少兩年的年報；要看趨勢就提供五年；景氣循環型的企業則提供十年。

**Q：怎麼檢查一份分析有沒有捏造的數字？**

A：對它執行 `fact-check`——它會逐一對照第一手來源查核每個數字、重算衍生數字，並重新產出附引用的報告。接著再用 `result-validator` 為資料品質、方法論與訊號一致性評分。

---

## 輸出與報告

**Q：投資訊號區塊（Investment Signal）是什麼？**

A：每個技能都以同一個框收尾，讓不同技能的結果可以互相比較：

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

Score（分數）對應 Signal（訊號）：8–10 為強烈看多……0–1.9 為強烈看空。資料不足或來自模型記憶時，Confidence（信心）應該是 LOW。這是教育性的摘要，不是投資建議。

**Q：可以產出 HTML 或 PDF 報告嗎？**

A：可以。`full-report AAPL` 會執行多個模組，並把獨立的 HTML 報告存到 `output/`；`report-generator` 能把任何分析轉成 HTML，再從瀏覽器列印成 PDF。兩者在任何能寫入檔案的平台上都能用；在聊天 App 中，請自己把 HTML 存成檔案。

**Q：可以產出圖表嗎？**

A：`chart-master` 能根據分析中的資料產出 Mermaid、ASCII 或 Chart.js 圖表（均線、K 線、RSI／MACD 等）。

**Q：可以用繁體中文輸出嗎？**

A：在需求中直接說明即可。`10k-digest` 與 `learning-coach` 另有明確的 `--lang zh-TW` 選項。

---

## 版本與更新

**Q：我現在用的是哪個版本？**

A：在 Claude Code 中，`/plugin list` 會顯示已安裝的版本。在儲存庫的複本中，執行 `jq '.version' plugins/us-stock-analysis/.claude-plugin/plugin.json`。最新版本與每一版的變更見 [CHANGELOG](changelog.html)（英文）與 [Releases 頁面](https://github.com/yennanliu/InvestSkill/releases)。

**Q：支援哪些版本？**

A：最新的次版本（minor）。修正會以新的修訂版（patch）發布，而不會回補到舊版本——見 [SECURITY.md](https://github.com/yennanliu/InvestSkill/blob/main/SECURITY.md)（英文）。

**Q：版本號是怎麼編的？**

A：採用語意化版本（SemVer）。新技能或新功能是次版本（1.12 → 1.13），修正與提示詞微調是修訂版，技能名稱或輸出合約的破壞性變更則是主版本。

**Q：升級之後，分析結果會變嗎？**

A：有可能——框架會在版本之間持續改進，分數與信心可能會變動。同一個主版本內，訊號區塊的格式維持不變。升級後請重新執行你倚賴的分析，重要決策也務必自行獨立驗證。

**Q：Claude Code、Cursor 或模型需要什麼版本？**

A：近期、支援技能／規則功能的工具版本即可，除此之外沒有硬性的最低版本。InvestSkill 是純 markdown，任何模型都能跑——能力越強的模型，越能處理 `full-report` 這類多模組分析。

---

## 錯誤回報、功能建議與求助

**Q：怎麼回報錯誤？**

A：開一個 [GitHub Issue](https://github.com/yennanliu/InvestSkill/issues)，附上平台、版本、確切的指令、你預期的結果，以及實際得到的結果（把輸出貼在程式碼區塊中）。

**Q：怎麼提出功能建議？**

A：在 [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions) 發起討論，說明使用情境並舉例你會怎麼用。

**Q：有問題要去哪裡問？**

A：一般問題請到 [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions)，錯誤請到 [Issues](https://github.com/yennanliu/InvestSkill/issues)。[操作手冊](cookbook-zh-tw.html)有每個技能的實際範例。

---

## 進階

**Q：可以修改框架嗎？**

A：可以——從 `prompts/`（或 `.investskill/prompts/`）複製一份提示詞來修改。如果希望結果仍能互相比較，請保留結尾的投資訊號區塊。

**Q：可以新增自己的技能，或貢獻給專案嗎？**

A：可以。`node scripts/new-skill.js <name> --category … --title … --desc …` 會建立含完整輸出合約的技能，並把它接到所有相關檔案；詳見 [ADDING-NEW-SKILLS.md](https://github.com/yennanliu/InvestSkill/blob/main/ADDING-NEW-SKILLS.md) 與[貢獻指南](contributing.html)（英文），然後開一個 PR。

**Q：為什麼分析有時候很慢？**

A：多模組技能（`full-report --depth comprehensive`）的工作量遠大於 `stock-eval` 這類單一技能。需要快速答案時，請用 `--depth quick` 或單一技能，或切換到速度較快的模型。

**Q：可以用程式呼叫這些提示詞嗎？**

A：可以——把提示詞載入成 system message：

```python
import anthropic

with open("prompts/stock-eval.md") as f:
    framework = f.read()

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    system=framework,
    messages=[{"role": "user", "content": "Evaluate AAPL"}],
)
```

---

## 還需要協助？

- [首頁](zh-tw.html)——總覽與安裝
- [操作手冊](cookbook-zh-tw.html)——每個技能的範例
- [選擇技能](choose-a-skill-zh-tw.html)——依目標找到合適的框架
- [GitHub Discussions](https://github.com/yennanliu/InvestSkill/discussions) · [GitHub Issues](https://github.com/yennanliu/InvestSkill/issues)
