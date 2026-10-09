# InvestSkill × MCP — 可行性調查與路線圖

*調查日期：2026-10-09 · 調查版本 v1.12.0（34 個技能目錄 / 30 個分析框架）· MCP 規格版本 2026-07-28*

> **範圍。** 回答三個問題：（1）能否、以及是否應該把 InvestSkill 的功能以 MCP（Model Context Protocol）伺服器形式提供，還是維持純技能（skill）；（2）若值得做，有哪些**免費**的執行平台——不必付錢維持 24/7 伺服器，最好是 serverless；（3）一條可執行的路線圖。本文為調查與建議，**本 PR 不新增任何程式碼、技能或網站頁面**。
>
> **關於數字的準確性。** 平台額度與規格細節變動頻繁。第 6 節列出每一項的來源；標註「⚠️ 次級來源」者，代表官方頁面未能直接確認、來源之間有出入，實作前請再到官方定價頁核對。

---

## 0. 結論摘要（TL;DR）

| 問題 | 結論 |
|------|------|
| **技術上可行嗎？** | **可行，而且很直接。** MCP 的三個伺服器原語剛好對應 InvestSkill 的三種資產：**Prompts** ↔ 34 份 `prompts/*.md`；**Resources** ↔ 技能檔、術語表、學習課程；**Tools** ↔ 現成的確定性程式碼（`scripts/lib/signal-block.js`、`scripts/lib/edgar.js`）。2026-09-13 定稿的官方 **Skills 擴充（SEP-2640, `io.modelcontextprotocol/skills`）** 更是直接以 `SKILL.md` 為單位透過 MCP 發佈技能。 |
| **值得做嗎？** | **值得，但只做「附加層」，不取代技能。** 若只是把 markdown 原封不動包成 MCP prompts，價值很低——Claude Code、Claude.ai 與多數主流代理工具已原生支援 Agent Skills／`SKILL.md`，`install.sh` 也已覆蓋七種代理。MCP 真正的增量價值在**技能做不到的事**：(a) 確定性計算工具（DCF、WACC、VaR 等 LLM 不擅長的算術）；(b) 一手資料工具（keyless SEC EDGAR）；(c) 輸出驗證工具（訊號區塊／技能契約檢查）；(d) 觸及只吃 MCP 的客戶端。技能仍是**單一真實來源**，MCP 伺服器由它**產生**，比照 `sync-prompts.js` 的做法。 |
| **免費怎麼跑？** | **首選：本機 stdio 伺服器（`npx` 啟動）——成本 $0、無伺服器、無金鑰、無遙測**，完全符合專案「無 runtime、無金鑰、無遙測」的承諾。需要遠端網址時，**次選 Cloudflare Workers 免費方案**（每日 100,000 次請求、超量直接拒絕而非計費），只放「靜態內容＋純函式計算」；EDGAR 工具**不要**放到共享遠端（CPU 上限、SEC 公平存取規則、隱私）。備案：Google Cloud Run 免費額度（每月 200 萬次請求，但需綁信用卡）。 |
| **路線圖** | 第 0 階段 決策與規則（S）→ 第 1 階段 本機 stdio MCP 伺服器＋測試（M）→ 第 2 階段 發佈（npm、MCP Registry、文件、網站雙語）（S–M）→ 第 3 階段 唯讀遠端端點於 Cloudflare Workers Free（S–M）→ 第 4 階段 Skills 擴充與 MCP Apps（待客戶端支援，L）。詳見 §4。 |

---

## 1. 背景

### 1.1 InvestSkill 現況

- 是**提示工程外掛**，不是傳統軟體：34 個技能目錄（30 個分析框架 + 3 個別名 + 1 個輸出工具），每個技能同時存在 `plugins/us-stock-analysis/skills/<name>/SKILL.md`（Claude Code 形式）與 `prompts/<name>.md`（通用形式，由 `scripts/sync-prompts.js` 產生）。
- `prompts/` 合計約 **720 KB**，平均每份約 21 KB，最大的 `report-generator.md` 約 33.7 KB（粗估 5k–9k tokens／份）。
- 已有的**確定性程式碼**（MCP tools 的現成素材）：
  - `scripts/lib/signal-block.js` — `parseSignalBlock()`、`validateOutput()`、`expectedSignalForScore()` 等，解析與驗證訊號區塊。
  - `scripts/lib/edgar.js` — 零相依的 SEC EDGAR 存取（ticker → CIK、filings 索引、XBRL companyfacts），內建 User-Agent 與請求節流。
  - `scripts/lib/skill-registry.js` — 技能分類（框架／別名／輸出工具／meta）的單一真實來源。
- 專案的核心承諾（路線圖 §9）：**無 runtime、無金鑰、無遙測**。即時資料 API／券商 API 被明確列為「刻意不做」。`qa/PROJECT-REVIEW.md` 的 C2 項與路線圖 §5 的「自備資料」則留有一個未完成項：**「MCP 資料伺服器的操作範例」**。

### 1.2 MCP 在 2026 年 10 月的狀態

| 項目 | 現況 |
|------|------|
| 規格版本 | **2026-07-28**（以日期命名）。基礎協定改為**無狀態、自足的請求**，以 `server/discover` 取代原本的 `initialize` 握手，移除協定層 session。 |
| 伺服器原語 | **Tools**（模型呼叫的函式）、**Resources**（給模型或使用者的資料）、**Prompts**（給使用者的模板化訊息／工作流程）。 |
| 傳輸 | **stdio**（主機以子程序啟動伺服器）與 **Streamable HTTP**（單一 HTTPS 端點）。舊的 HTTP+SSE 傳輸已棄用。 |
| 官方擴充 | **Skills**（`io.modelcontextprotocol/skills`，SEP-2640，2026-09-13 定稿）、**MCP Apps**（`io.modelcontextprotocol/ui`，對話中內嵌互動 HTML）、**Tasks**（長時間非同步工作）、兩個授權擴充。 |
| Skills 擴充的客戶端支援 | 依官方 [Extension Support Matrix](https://modelcontextprotocol.io/extensions/client-matrix)（社群維護）：**mcpc** 完整支援；**ChatGPT**、**fast-agent**、**MCP Inspector** 部分支援；Claude、Cursor、VS Code Copilot 等**尚未列出**。 |
| MCP Apps 的客戶端支援 | Claude（web / Desktop）、ChatGPT、Cursor、VS Code GitHub Copilot、Microsoft 365 Copilot、Goose 等已支援。 |
| TypeScript SDK | `@modelcontextprotocol/sdk` 1.32.x（v1 線）與 `@modelcontextprotocol/server` 2.3.x（v2 線）並存；Cloudflare 的無狀態範例使用 v2。 |

---

## 2. 問題一：能做嗎？該做嗎？還是維持純技能？

### 2.1 對應關係：InvestSkill 的資產 → MCP 原語

| InvestSkill 資產 | MCP 原語 | 範例 | 價值 |
|------------------|----------|------|------|
| 34 份 `prompts/*.md` | **Prompts**（`prompts/list`、`prompts/get`，帶參數 `ticker`、`lang`） | 使用者在支援的客戶端以斜線指令選用 `stock-eval`，帶入 `NVDA` | 低～中：與原生技能重複；但對只吃 MCP 的客戶端是唯一入口 |
| 同上 | **Skills 擴充**（`skills/list` + `resources/read`，`skill://stock-eval/SKILL.md`） | 客戶端依名稱與描述自動挑選技能、按需載入 | 中：語意最貼切（模型自選、漸進載入），但**客戶端支援仍少** |
| 術語表、學習課程、`CHOOSE-A-SKILL` | **Resources** | `investskill://glossary`、`investskill://lessons/valuation` | 低～中：`learning-coach` 搭配時有用 |
| `signal-block.js` | **Tools** | `validate_output(text)` → 訊號區塊是否完整、分數與訊號是否一致 | **高**：把目前只在 CI 跑的檢查交到使用者手上 |
| `edgar.js` | **Tools** | `edgar_company_facts(ticker)`、`edgar_latest_filing(ticker, form)` | **高**：直接補上 C2「MCP 資料伺服器」缺口，且 keyless |
| （新增）財務計算 | **Tools** | `dcf(fcf[], growth, wacc, terminal)`、`wacc(...)`、`reverse_dcf(...)`、`var(returns, cl)` | **高**：LLM 算術不可靠是路線圖 §9 拒絕「ML／回測」的理由；確定性計算正好補上 |
| `chart-master`／`report-generator` 的 HTML | **MCP Apps**（未來） | 在 Claude／ChatGPT 對話中內嵌互動圖表 | 中：體驗好，但工作量大 |

### 2.2 各客戶端的增量價值

| 客戶端 | 現在怎麼用 InvestSkill | MCP 帶來的增量 |
|--------|------------------------|----------------|
| Claude Code | 外掛市集 + 原生技能 | 技能部分**無增量**；**工具**（計算、EDGAR、驗證）有增量 |
| Claude.ai / Claude Desktop | 上傳技能或貼上 prompt | 工具有增量；遠端連接器可一鍵加入 |
| ChatGPT | 貼上 prompt | 透過 MCP 連接器取得工具；Skills 擴充為「部分支援」 |
| Cursor、VS Code Copilot、Gemini CLI、Codex 等 | `install.sh` 寫入規則檔／技能目錄 | 工具有增量；技能部分多為重複 |
| 只支援 MCP 的代理（Goose、自建 agent、各式 IDE 外掛） | 難以使用 | **新觸及**：prompts + tools 一次到位 |

**觀察：** 2025–2026 年間 Agent Skills（`SKILL.md`，見 [agentskills.io](https://agentskills.io/)）已成為跨工具的格式，這**降低了**「把技能搬到 MCP 只為了發佈」的必要性。MCP 的價值因此集中在**工具層**。

### 2.3 做 MCP 的代價與風險

| 風險 | 說明 | 緩解 |
|------|------|------|
| 違背「無 runtime、無金鑰、無遙測」 | 一旦有遠端伺服器，就有 runtime、帳單與記錄使用者查詢（股票代號、持倉）的可能 | **本機 stdio 優先**；遠端版只放靜態內容與純函式、**不記錄請求內容**、不收任何金鑰；在路線圖 §9 改寫措辭為「外掛本身無 runtime；MCP 伺服器與 `fetch-edgar.js` 一樣是選用工具」 |
| 雙重維護 | 技能與 MCP 內容不同步 | MCP 的 prompts／resources **由 `SKILL.md` 產生**（擴充 `sync-prompts.js` 或在建置時讀取 `prompts/`），加入同步檢查測試 |
| 相依套件 | 目前 `scripts/` 是零相依；MCP SDK 會帶入相依 | 放在獨立套件（如 `mcp/` 子目錄自帶 `package.json`），根目錄維持零相依、外掛目錄不受影響 |
| Token 成本 | 工具定義會佔用上下文；最大的 prompt 約 9k tokens | 工具數控制在約 10 個以內；Claude Code 對 MCP 輸出預設上限 25,000 tokens、超過 10,000 會警告，現有 prompt 皆在範圍內 |
| 資料準確性與責任 | EDGAR 工具回傳的數字會被模型直接引用 | 工具輸出附來源 URL 與 accession number，與 `fact-check` 的引用格式一致；延續免責聲明 |
| SEC 公平存取 | SEC 要求可識別的 User-Agent 並限制每秒 10 次；共享遠端伺服器會把所有使用者的請求集中在同一 IP／UA | EDGAR 工具**只在本機 stdio 提供**，使用者以 `EDGAR_USER_AGENT` 自報身分 |
| 安全 | MCP 工具等同任意程式執行；工具描述應視為不受信任 | 工具全部唯讀、無檔案寫入、無外部指令執行；EDGAR 只連 `sec.gov`／`data.sec.gov` |

### 2.4 判斷

**建議做，但要定位清楚：**

1. **技能維持主體與單一真實來源。** 不要把 InvestSkill 改寫成 MCP-first。
2. **MCP 伺服器 = 「技能的發佈管道」＋「技能缺少的確定性工具層」。** 其中工具層才是值得投入的理由。
3. **不要做「只有 prompts 的 MCP」**——它和原生技能、`install.sh` 高度重複，維護成本大於收益。
4. **本機優先、遠端選用**，以守住專案承諾。

---

## 3. 問題二：免費的執行平台

### 3.1 關鍵觀察：最省錢的「伺服器」是不要伺服器

MCP 的 **stdio 傳輸**由使用者的 AI 客戶端在**使用者自己的電腦**上以子程序啟動，用完即結束。沒有 24/7 主機、沒有帳單、沒有冷啟動、也沒有任何請求離開使用者的機器（EDGAR 除外，且直接連 SEC）。對 InvestSkill 這種以靜態內容＋輕量計算為主的伺服器，這是**成本 $0、隱私最佳、最符合專案承諾**的方案。

發佈方式（全部免費）：

| 管道 | 說明 |
|------|------|
| npm + `npx` | 使用者設定 `"command": "npx", "args": ["-y", "investskill-mcp"]` 即可 |
| 官方 MCP Registry（`registry.modelcontextprotocol.io`） | 以 `server.json` 登錄 metadata，指向 npm 套件；Registry 本身只存 metadata（仍為 Preview ⚠️ 次級來源） |
| Claude Code 外掛 `.mcp.json` | 外掛可內建 MCP 伺服器（`${CLAUDE_PLUGIN_ROOT}`），工具會命名為 `mcp__plugin_<外掛>_<伺服器>__<工具>`。**建議另開一個外掛**（如 `investskill-tools`），不要放進 `us-stock-analysis`，以免安裝技能就被迫啟動程序 |
| `install.sh` | 可新增 `--with-mcp` 旗標，為各代理寫入 MCP 設定（需遵守 Install Script Rule：不覆寫使用者檔案、重跑結果位元組相同） |

### 3.2 若需要遠端網址：免費 serverless 平台比較

> 遠端的用途：ChatGPT／Claude.ai 等網頁客戶端只能連遠端 MCP（無法啟動本機程序）。

| 平台 | 免費額度（2026-10 查證） | 對 MCP 的支援 | 適合 InvestSkill 嗎？ |
|------|--------------------------|---------------|------------------------|
| **Cloudflare Workers（Free）** | 每日 **100,000** 次請求、每分鐘 1,000 次突發上限；每次請求 **10 ms CPU**（等待網路不計）；128 MB 記憶體；Worker 大小 3 MB；每請求 50 個子請求；**超量直接回錯誤、不會計費**。SQLite 版 Durable Objects 亦可在免費方案使用 | 官方 `createMcpHandler`（無狀態、搭配 `@modelcontextprotocol/server` v2）；舊的 `McpAgent` **已棄用** | ✅ **首選。** 720 KB 的 prompts 可直接打包；純函式計算遠低於 10 ms；無狀態規格讓每次請求自足，不需 Durable Objects。❌ EDGAR：大型公司的 companyfacts JSON 達數 MB，解析很可能超過 10 ms CPU |
| **Google Cloud Run** | 每月 **200 萬**次請求、180,000 vCPU-秒、360,000 GiB-秒；北美 1 GiB 免費流量 | 任何容器皆可（Node SDK 的 Streamable HTTP） | ✅ 備案。CPU 寬裕，可跑 EDGAR 解析。⚠️ 需綁定帳單帳戶／信用卡，超量會計費；需留意「僅請求期間配置 CPU」設定 |
| **Vercel（Hobby）** | 函式呼叫次數 ⚠️ 來源不一（Vercel 員工於 2026-02 社群貼文稱 100 萬／月，舊資料為 10 萬）；超量會**暫停帳戶**而非計費。**Hobby 限非商業用途** | 官方 `mcp-handler`（前身 `@vercel/mcp-adapter`），Next.js 路由 | ⚠️ 可行，但需引入 Next.js；非商業條款需留意 |
| **Deno Deploy（Free）** | ⚠️ 來源不一：約 100 萬次請求／月、每請求約 50 ms CPU；流量額度在 2026 年下修。Deploy Classic 已於 2026-07-20 退場 | 標準 Web `fetch` handler 即可 | ⚠️ 可行，但額度數字不穩定 |
| **Hugging Face Spaces** | ⚠️ 免費 CPU 硬體（cpu-basic）是否需付費方案，來源有出入；閒置後會休眠（冷啟動慢） | Gradio `launch(mcp_server=True)` 直接暴露 MCP | ❌ 不建議：需改用 Python／Gradio，與專案的 Node 技術棧不符 |
| GitHub Pages | 免費，但僅靜態檔案 | 無法執行 MCP 伺服器 | ❌ 不能當 MCP 端點（但網站本身已在用） |

### 3.3 建議

1. **預設：本機 stdio，經 npm 發佈。** 費用 $0，無遠端。
2. **遠端：Cloudflare Workers Free**，只提供「prompts／skills／resources ＋ 純函式計算＋輸出驗證」，**不含 EDGAR**、**不記錄請求內容**、**無驗證機制**（內容公開唯讀，與 GitHub 上的 markdown 相同）。超量時 Free 方案只會拒絕請求，不會產生帳單——正好是「不想付 24/7 伺服器費用」所需要的保證。
3. **只有在**未來需要遠端 EDGAR 時才考慮 Cloud Run，並另行評估 SEC 公平存取與隱私。

---

## 4. 問題三：路線圖

工作量：S ≈ 半天到 1 天、M ≈ 2–4 天、L ≈ 1 週以上。依 Release Timing Rule，新增 MCP 伺服器屬於「有意義的新能力」→ **MINOR** 版本（如 1.13.0）。

### 第 0 階段 — 決策與規則（S）

- [ ] 在 `doc/IMPROVEMENT-ROADMAP(-zh-TW).md` §9 改寫「無 runtime」措辭：外掛本身無 runtime；MCP 伺服器與 `fetch-edgar.js` 同屬**選用**工具，預設本機執行。
- [ ] 在 `CLAUDE.md` 新增 **MCP Server Rule**（比照 Bring-Your-Own-Data Helpers Rule）：伺服器在外掛之外、內容由 `SKILL.md` 產生、`npm test` 只跑離線測試、遠端版不得含 EDGAR 或記錄請求。
- [ ] 確定套件名稱（如 `investskill-mcp`）並確認 npm 上可用。

### 第 1 階段 — 本機 stdio MCP 伺服器（M）

目錄建議：`mcp/`（自帶 `package.json`，相依 `@modelcontextprotocol/server` v2 與 `zod`；根目錄維持零相依）。

**Prompts**（自動產生）
- [ ] 讀取 `prompts/*.md`，以 `skill-registry.js` 過濾：分析框架 + 輸出工具列入；別名以描述註明轉向目標。
- [ ] 參數：`ticker`（選填）、`lang`（`en` / `zh-TW`）、`context`（使用者自備資料）。

**Tools**（第一版約 8 個，全部唯讀）

| 工具 | 來源 | 說明 |
|------|------|------|
| `list_skills` | `skill-registry.js` | 列出框架、分類與一句話描述——給**不支援 prompts 的客戶端**用 |
| `get_skill` | `prompts/<name>.md` | 回傳技能全文；同上，確保只支援 tools 的客戶端也能使用 |
| `validate_output` | `signal-block.js` | 檢查分析結果的訊號區塊、資料來源表頭、論點失效條件、免責聲明 |
| `dcf` / `reverse_dcf` | 新增純函式 | 確定性 DCF 與反推隱含成長率，回傳每年明細供模型引用 |
| `wacc` | 新增純函式 | CAPM + 稅後債務成本 |
| `edgar_company_facts` | `edgar.js` | XBRL 主要財務數據（附 accession number 與 URL）— **僅本機** |
| `edgar_latest_filing` | `edgar.js` | 最新 10-K／10-Q 純文字（截斷並分頁）— **僅本機** |

**Resources**
- [ ] `investskill://glossary`、`investskill://lessons/<slug>`、`investskill://choose-a-skill`（英文與 zh-TW）。

**測試**（`scripts/test-mcp.js`，加入 `npm test`）
- [ ] 以 SDK 的記憶體內傳輸啟動伺服器，`prompts/list` 數量 = `prompts/` 檔案數（**一致性檢查**，比照 Test 13）。
- [ ] 每個工具的 golden case（DCF 對照手算；`validate_output` 對照合格與缺項的合成輸出，與 `check-skill-contract.js` 結果一致）。
- [ ] EDGAR 工具使用既有的 `scripts/lib/edgar-mock-fetch.js`，**不連網**。
- [ ] 斷言工具清單中**沒有**任何寫檔或執行指令的工具。

### 第 2 階段 — 發佈與文件（S–M）

- [ ] npm 發佈（`npx -y investskill-mcp`）；在 `release-interactive.js` 中與外掛版本同步（Version Consistency Rule 擴充至 `mcp/package.json`）。
- [ ] 官方 MCP Registry `server.json`。
- [ ] 選用的 Claude Code 外掛 `investskill-tools`（`.mcp.json`），列入 `.claude-plugin/marketplace.json`。
- [ ] `install.sh --with-mcp`：為 claude／cursor／copilot／gemini／codex 寫入 MCP 設定（遵守 Install Script Rule；`test-install.js` 加 parity 檢查）。
- [ ] 文件：`README.md`、`README-zh-TW.md`、各平台 `README-*.md`、`PLATFORM-COMPATIBILITY.md`。
- [ ] 網站（**中英雙語**）：`DATA-AND-ACCURACY(-zh-TW).md` 的「自備資料」新增 MCP 路徑——即 C2 未完成項；`COOKBOOK(-zh-TW).md` 新增設定食譜。
- [ ] `CHANGELOG.md` 與版本號（MINOR）。

### 第 3 階段 — 唯讀遠端端點（S–M）

- [ ] `mcp/worker.ts`：`createMcpHandler`，**同一份**伺服器定義但排除 EDGAR 工具（以旗標控制，測試斷言遠端版工具清單不含 `edgar_*`）。
- [ ] 建置時把 `prompts/` 內嵌為字串（約 720 KB，遠低於 3 MB 上限）。
- [ ] `.github/workflows/mcp-deploy.yml`：`wrangler deploy`，以 `CLOUDFLARE_API_TOKEN` secret；只在 release tag 時部署。
- [ ] 不啟用 Workers Logs／Analytics 中的請求內容記錄；在網站「Data & Accuracy」頁寫明。
- [ ] 量測：以 `wrangler dev` 確認每個工具 CPU 時間遠低於 10 ms。

### 第 4 階段 — 標準擴充（L，視客戶端支援而定）

- [ ] **Skills 擴充**：實作 `skills/list`／`skills/get`，以 `skill://<name>/SKILL.md` 提供技能，manifest 附 SHA-256 與大小（可在建置時由 `SKILL.md` 計算）。待 Claude、Cursor、VS Code 等主流客戶端出現在[支援矩陣](https://modelcontextprotocol.io/extensions/client-matrix)後再做。
- [ ] **MCP Apps**：讓 `chart-master`／`report-generator` 的 HTML 在 Claude／ChatGPT 對話中內嵌顯示。
- [ ] 視需求評估遠端 EDGAR（Cloud Run），需另做隱私與 SEC 公平存取審查。

### 時程建議

| 版本 | 內容 |
|------|------|
| 1.13.0 | 第 0–2 階段：本機 stdio 伺服器、測試、npm、文件、網站雙語 |
| 1.13.x | 第 3 階段：Cloudflare Workers 唯讀端點 |
| 之後 | 第 4 階段：Skills 擴充、MCP Apps |

---

## 5. 刻意不建議的做法

- **把技能改寫成 MCP-first、刪除 `SKILL.md`。** Agent Skills 已是跨工具格式；MCP 版本應是衍生品。
- **只包 prompts 的 MCP。** 與原生技能及 `install.sh` 重複，成本大於收益。
- **付費行情 API、券商 API、需要使用者金鑰的工具。** 與路線圖 §9 一致，維持不做。
- **在共享遠端伺服器上代理 SEC EDGAR。** CPU 上限、SEC 公平存取規則與隱私三者皆不利。
- **在遠端版加入使用量分析或請求記錄。** 違背「無遙測」承諾。
- **Python／Gradio 版本。** 技術棧分裂；Node 已能覆蓋所有需求。

---

## 6. 參考資料

查證日期 2026-10-09。⚠️ = 次級來源或來源之間有出入，實作前請核對官方頁面。

**MCP 規格與擴充**
- [MCP Specification（2026-07-28）](https://modelcontextprotocol.io/specification/latest) — 無狀態基礎協定、Tools／Resources／Prompts、擴充列表
- [Skills 擴充概覽](https://modelcontextprotocol.io/extensions/skills/overview) — `skills/list`、`skills/get`、`skill://` URI、manifest 與驗證規則、每技能 512 檔／16 MiB 建議上限
- [Skills Over MCP 工作小組](https://modelcontextprotocol.io/community/working-groups/skills-over-mcp) — SEP-2640 於 2026-09-13 定稿
- [Extension Support Matrix](https://modelcontextprotocol.io/extensions/client-matrix) — 各客戶端對 Skills／MCP Apps 的支援
- [Agent Skills 規格](https://agentskills.io/specification)
- ⚠️ [MCP 2026-07-28 無狀態變更說明（Appwrite）](https://appwrite.io/blog/post/mcp-goes-stateless-in-the-2026-07-28-specification)

**Claude Code**
- [Claude Code — MCP](https://code.claude.com/docs/en/mcp) — 外掛 `.mcp.json`、工具命名、輸出上限（10k 警告／25k 預設上限）

**平台**
- [Cloudflare Workers 定價](https://developers.cloudflare.com/workers/platform/pricing/)、[限制](https://developers.cloudflare.com/workers/platform/limits/) — 每日 100,000 次、10 ms CPU、128 MB、3 MB、50 子請求
- [Cloudflare `createMcpHandler`](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/) — 無狀態 MCP handler；`McpAgent` 已棄用
- [Durable Objects 免費方案（2025-04-07）](https://developers.cloudflare.com/changelog/2025-04-07-durable-objects-free-tier/)
- [Google Cloud Run 定價](https://cloud.google.com/run/pricing) — 每月 200 萬次請求免費
- [Vercel — 部署 MCP 伺服器](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel)、[Vercel 限制](https://vercel.com/docs/limits)
- ⚠️ [Vercel 社群：Hobby 呼叫次數上限差異](https://community.vercel.com/t/vercel-hobby-tier-function-invocation-limit-discrepancy-between-dashboard-and-email/32796)
- ⚠️ [各家免費額度比較（2026-09）](https://flaviocopes.com/hosting-free-tiers/)、[Deno Deploy 免費額度](https://agentdeals.dev/vendor/deno-deploy)
- ⚠️ [Cloudflare 免費方案上的 MCP 伺服器與 10 ms CPU 實測](https://dev.to/301st/an-mcp-server-on-cloudflares-free-plan-measured-against-the-10-ms-cpu-limit-468b)
- [Hugging Face MCP 課程 — Gradio MCP](https://huggingface.co/learn/mcp-course/en/unit1/gradio-mcp)

**SEC**
- [Accessing EDGAR Data（公平存取規則）](https://www.sec.gov/os/accessing-edgar-data)

**專案內部**
- [doc/IMPROVEMENT-ROADMAP-zh-TW.md](IMPROVEMENT-ROADMAP-zh-TW.md) §5（自備資料）、§9（刻意不提出的項目）
- [qa/PROJECT-REVIEW.md](../qa/PROJECT-REVIEW.md) C2
- `scripts/lib/signal-block.js`、`scripts/lib/edgar.js`、`scripts/lib/skill-registry.js`

---

*僅為調查與建議。教育用途專案——非財務或稅務建議。*
