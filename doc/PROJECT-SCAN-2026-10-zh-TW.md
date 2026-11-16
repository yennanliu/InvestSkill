# InvestSkill — 專案全面掃描（2026-10）

*掃描日期：2026-10-24 · 掃描版本 v1.13.0（`main` @ 9925f72）· 34 個技能目錄／30 個對外宣稱的分析框架 · 網站共 91 頁*

> **範圍。** 對整個 repo 做一次完整的唯讀掃描：34 個技能（及其自動產生的 prompt）、所有腳本與 workflow、測試套件、根目錄文件，以及建置後的網站。本文列出**要修的 bug**、**可以改進的地方**、**可以新增的功能**，每一項都附上證據與建議做法。本 PR 只提出建議 —— 不修改任何技能、prompt、腳本或網站頁面。
>
> **狀態（2026-10-24，[#43](https://github.com/yennanliu/InvestSkill/pull/43) 與 [#44](https://github.com/yennanliu/InvestSkill/pull/44) 合併後）。** §2 的所有 bug 都已修正，§5 的七個批次全部出貨。逐項標記：✅ 已修正 · ◐ 部分完成 · ⬜ 待辦，標在下方每一列；仍未完成的項目列於 §8。各列保留 v1.13.0 時的證據，行號指向舊程式碼。
>
> English version: [PROJECT-SCAN-2026-10.md](PROJECT-SCAN-2026-10.md)
>
> **與先前審查的關係。** 本文接續 [IMPROVEMENT-ROADMAP-zh-TW.md](IMPROVEMENT-ROADMAP-zh-TW.md)（2026-09-23），該文的十大建議已全部上線（見該文 §0）。roadmap 已提過、但仍未完成的項目列在 §6 並標示目前狀態，不再重複論證；其餘內容都是這次的新發現。

---

## 0. 掃描方式

| 項目 | 方法 | 結果 |
|------|------|------|
| 單元測試 | `npm test` | ✅ 3.8 秒全綠 —— test-skills 517/0 · 技能契約 306/0（34 項豁免）· sync-prompts 一致 · test-llm-io 285/0 · test-edgar 217/0 · test-install 116/0 |
| Prompt 驗證 | `npm run validate` | ✅ 通過，但有 **88 個警告**：每個 prompt 都被標記「Missing sections: Instructions/Overview, Key Components」（`scripts/validate-prompts.js:94-95`），所以這些警告沒有參考價值 |
| 網站 | `npm run build:site` + `check-links` | ✅ 91 頁、6,409 個站內連結、0 個失效（不檢查 `#錨點` —— 見 B12） |
| 外掛 manifest | 對外掛與 marketplace 執行 `claude plugin validate` | ✅ 通過；一個警告：**沒有外掛圖示**（`ICON_MISSING`） |
| 其他 npm 指令 | `release:dry-run`、`integration-tests`、`release` | ❌ 見 A2–A4 |
| 內容 | 逐一閱讀每個 SKILL.md、網站內容頁與根目錄文件，並對照檔案驗證 | 下列發現皆附 `檔案:行號` |
| GitHub | 未關閉的 issue 與近期 PR | 10 個未關閉 issue，數個已過時（見 C1） |

嚴重度：🔴 bug／輸出錯誤 · 🟠 品質或可信度 · 🟡 加分項。工作量：**S** 少於半天 · **M** 1–2 天 · **L** 更多。狀態：✅ 已修正 · ◐ 部分完成 · ⬜ 待辦。

---

## 1. 摘要

有測試覆蓋的地方，專案狀況良好：離線測試全綠、prompt 由 SKILL.md 自動產生、輸出契約以真實模型輸出評分、網站沒有失效連結。問題集中在**測試碰不到的地方**：

1. **19 個技能的模板 bug。** `## Thesis Invalidation` 段落被放在訊號區塊的 code fence **裡面**，模型看到的是「失效條件被當成方框模板裡的字面文字」（A1）。契約檢查只數標題，所以照樣通過。
2. **發版工具壞了。** `npm run release` 只印出成功訊息、什麼都沒做；`release:dry-run` 與 `integration-tests` 因為讀取 `plugin.json` 中早已不存在的 `skills` 陣列而崩潰；`auto-deploy.yml` 只要版本號一合併就可能打 tag，違反「發版時機規則」（A2–A5）。
3. **`full-report` 不符合自己的契約。** 分數區間與共用 parser 不一致 —— 綜合分 6.2 在 prompt 裡是「Hold」，在 `signal-block.js` 裡卻是 BULLISH；`dividend-analysis` 有執行卻從未計入綜合分；quick 深度會把缺少的模組固定為 5.0（A6–A8）。
4. **不在數量測試範圍內的文件已經漂移。** README 連到的各平台指南仍寫「18 個框架」與「v1.4.0」；FAQ、SECURITY、PLATFORM-COMPATIBILITY 仍說 v1.4.0 是目前版本（B17–B18）。
5. **網站難以被找到、也難以搜尋。** 沒有 `sitemap.xml`、`robots.txt`、Open Graph 標籤或 `hreflang`；搜尋索引只保留每頁前 1,600 個字元，Cookbook 與詞彙表大部分內容都搜不到（B22–B23）。

以上都不需要新功能。一個聚焦的「正確性」PR（§5 第 1 批）即可修好前三項，其餘每項都是 S–M。

---

## 2. Bug —— 優先修正（🔴）

| # | Bug | 證據 | 修正 | 工作量 |
|---|-----|------|------|--------|
| A1 ✅ | **19 個技能的 Thesis Invalidation 位於訊號區塊 fence 內。** fence 在「All analysis concludes with this standardized block:」下一行就開啟，`## Thesis Invalidation` 與整份觸發條件都被當成 code block。自動產生的 prompt 與網站上每個技能頁也都一樣 | `stock-eval/SKILL.md:609-610`、`bear-case:194-195`、`stock-valuation:604-605`、`technical-analysis:616-617`、`financial-report-analyst:508-509`、`dcf-valuation:72-73`、`fundamental-analysis:30-31`；chart-master、competitor-analysis、dividend-analysis、earnings-call-analysis、economics-analysis、industry-map、insider-trading、institutional-ownership、options-analysis、position-ladder、sector-analysis、short-interest 同樣如此 | 把開頭的 fence 移到 `╔` 的前一行；在 `check-skill-contract.js` 加一條檢查：fence 內出現 `##` 標題就失敗 | S |
| A2 ✅ | **`npm run release` 什麼都不做。** 第 6 步只印出「✓ Version bumped / commit / tag / pushed」，沒有任何寫檔或 git 操作 | `scripts/release-interactive.js:258-263` | 實作它（更新三個 manifest、填上 CHANGELOG 日期、commit、tag），或刪除並在 CLAUDE.md 寫明手動步驟 | M |
| A3 ✅ | **`npm run release:dry-run` 崩潰**於 `plugin.skills.length` —— 改為自動發現後，`plugin.json` 已沒有 `skills` 陣列 | `scripts/release-dry-run.js:63` | 改用 `scripts/lib/skill-registry.js` 的 `listSkillDirs()` | S |
| A4 ✅ | **`npm run integration-tests` 22 項中 4 項失敗**，原因相同；它還把 `report-generator` 排除在 prompt 之外，但 `prompts/report-generator.md` 其實存在 | `scripts/integration-tests.js:148,244,256,270,274` | 同 A3；豁免清單改從 registry 取得 | S |
| A5 ✅ | **兩條發版路徑，其中一條會提早發版。** `auto-deploy.yml` 只要版本號進到 `main` 且測試通過就打 tag 發佈 —— 但 CLAUDE.md 允許在 feature branch 改版本號。它兩處 checkout 都取分支 HEAD 而非 `workflow_run.head_sha`，可能 tag 到之後的 commit。`release.yml` 又在 push tag 時建立另一個內容不同的 release | `auto-deploy.yml:33,112,162-166`；`release.yml` | 只保留一條路徑：由 tag 觸發的 `release.yml`（tag 由修好的 `npm run release` 建立）。退役 auto-deploy，或改為 checkout `head_sha` 且只在 tag 時執行 | M |
| A6 ✅ | **`full-report` 的分數區間與共用 parser 矛盾。** Buy 從 6.5 起、Hold 是 5.0–6.4，但 `signal-block.js` 把 ≥ 6.0 一律判為 BULLISH，所以 6.2 的綜合分在 live eval 會失敗 | `full-report/SKILL.md:127-136`；`scripts/lib/signal-block.js:59` | 改用標準的 6.0／4.0 切點，或像 `fact-check` 一樣在 parser 加 `full-report` 專屬規則 | S |
| A7 ✅ | **`dividend-analysis` 在 `full-report` 裡是孤兒** —— 列在模組表，卻不屬於任何階段或子分數，輸出永遠進不了綜合分 | `full-report/SKILL.md:51` | 放進 Capital Allocation 的階段與子分數 | S |
| A8 ✅ | **Quick 深度把缺少的子分數固定為 5.0**，綜合分有 15%（Risk Profile）是常數，護城河預設值也被平均進去 | `full-report/SKILL.md:140` | 只對實際執行的模組重新加權，並列出略過了哪些 | S |
| A9 ✅ | **`site-review.js` 回報 33 個框架** —— 它寫死 `OUTPUT_TOOLS` 且忽略 alias；正確數字是 30。自從 alias 重新分類後，每天的 QA 報告都是錯的 | `scripts/site-review.js:52-53,103`；`qa/site_review_20261023.md` | 改用 registry 的 `frameworkCount()` | S |
| A10 ✅ | **zh-TW Cookbook：多餘的 code fence 吞掉 §3.10。** 在第 648 行開始的區塊內又開了一個 ` ```bash `，導致訊號方框被渲染成段落，「### 3.10 完整報告」標題變成程式碼，目錄連結失效 | `site/content/COOKBOOK-zh-TW.md:648,679,701` | 補上關閉 fence；加入 fence 配對檢查（B12） | S |
| A11 ✅ | **技能內容的事實錯誤** | `short-interest:160` 說避險基金空單在 13F 揭露（13F 只揭露多頭部位）· `portfolio-review:196,219` 把洗售規則說成「持有 > 30 天」（實際是賣出前後 30 天內買回）· `tax-lens:264-273` 範例：2025-08-14 買進的批次，約 2026 年 7 月賣出卻被當成長期 · `economics-analysis:297` 仍說 Sahm 規則尚未觸發（2024 年 8 月已觸發）· `thesis-tracker:60,155,267` 把已結案檔案交給不存在的 `trade-postmortem` | 逐項更正；`portfolio-review` 的稅務機制改為引用 `tax-lens`；`trade-postmortem` 標為規劃中或直接實作（§4.1） | S |
| A12 ✅ | **什麼都沒檢查的 CI 步驟。** `pr-check.yml` 的「Check skills registry integrity」與 `check-plugin-install.sh:33` 迭代不存在的 `.skills[]`，因此永遠通過 | `.github/workflows/pr-check.yml`；`scripts/check-plugin-install.sh:33` | 刪除（`npm test` 的 registry 測試已涵蓋） | S |
| A13 ✅ | **全新 clone 無法執行 `build:site`。** `build-site.js` 需要 `markdown-it`／`markdown-it-anchor`，但 `package.json` 沒宣告任何依賴、`package-lock.json` 是空的；CI 臨時安裝，且有**三種不同版本鎖定**（deploy／site-review 用 `markdown-it-anchor` `^8.6.7`，`test.yml` 用 `^9.0.1`） | `site/build/build-site.js:4-5`；`deploy-pages.yml:34`；`site-review.yml:30`；`test.yml:64-65` | 兩者加入 `devDependencies`、提交 lockfile，CI 改用 `npm ci` 並加 npm cache | S |

---

## 3. 可改進之處（🟠／🟡）

### 3.1 技能 —— 契約與一致性

| # | 發現 | 證據 | 修正 | 工作量 |
|---|------|------|------|--------|
| B1 🟠 ✅ | **各技能的分數尺度不一致。** `bear-case` 說「空方論點越強分數越低」卻沒給換算式；`result-validator` 用五級信心與百分制，且從未對應到 Signal／Score；`report-generator`、`research-bundle` 缺少 Confidence／Horizon 說明行；Score Guide 在 5 個技能是粗體、其他是一般文字 | `bear-case:190,231`；`result-validator:113-118,153`；`report-generator:853`；`research-bundle:91` | bear-case 寫明 `Score = 10 − Strength`；result-validator 加對照表；統一說明行（並由契約測試強制） | S |
| B2 🟠 ✅ | **`Data & Sources` 位置錯誤**：`full-report` 放在 :232（Workflow 之後，雖然它自己說要「放在報告開頭」）；`portfolio-review` 的 Data Verification 在 :411 | 如上 | 兩者都移到最上方，和其他 28 個技能一致 | S |
| B3 🟡 ✅ | **17 個技能的 Data Verification 第 2 步是套版文字**（「近期財報、營收、P/E、P/S…」），對 `chart-master`、`stock-screener`（「for the ticker」）並不適用 | `stock-screener:9` | 寫成各技能專屬的步驟，如 `economics-analysis`、`sector-analysis` 已做的那樣 | S |
| B4 🟠 ✅ | **會把使用者導錯方向的重疊。** `stock-eval` 與 `stock-valuation` 各有一套完整 DCF，終值算法**不同**且互不引用；`dcf-valuation`／`fundamental-analysis` 的描述沒寫「alias」；現行技能仍引用 alias；`portfolio-review` 重複了 VaR、壓力測試與稅損收割，卻沒指向 `risk-stress-test`／`tax-lens`；單向引用（10k-digest ↛ financial-report-analyst、earnings-call ↛ earnings-preview、result-validator ↛ fact-check） | `stock-eval:395` vs `stock-valuation:435`；`competitor-analysis:49`；`position-ladder:59,376`；`report-generator:725`；`portfolio-review:196-219,337,362` | `stock-eval` 的內在價值改為引用 `stock-valuation`；alias 描述加上「Alias of …」前綴；替換 alias 引用；補上雙向「若要…請改用 X」；加測試禁止現行技能引用 alias | M |
| B5 🟡 ✅ | **過時的日期內容。** 2025 關稅衝擊區間仍是「待確認」（`risk-stress-test:99`，現已確定：SPX 約 2025-02-19 → 2025-04-08，約 −19%）；已於 2025 年 1 月解散的 Hindenburg 仍被當成現役（`short-interest:159`）；10b5-1 說明早於 2023 年冷卻期新規；2020–2024 年度表（`stock-eval:214`）；`full-report` 範例日期 2025-06-19；小錯誤（`bear-case:180`「支柱 1–7」但只有 6 個；`result-validator:25,65` 的上限與對空方論點不利的「總經順風」加分；`portfolio-review:207,291` 有兩個不同的交易成本公式） | 如上 | 做一次「日期內容清掃」PR；在發版檢查清單加入每年提醒 | S |
| B6 🟡 ✅ | **`learning-coach` 的指標→課程對照只到第 8 課**，但 quiz 模式列了第二部分的課程 | `learning-coach:64,121-132` | 對照表補上第 9–13 課 | S |
| B7 🟡 ⬜ | **Prompt 大小異常。** `report-generator`（約 9.8k tokens、856 行，大多是 CSS）是最大的 prompt，分析內容卻最少；`result-validator`（2.3k）與 `full-report`（4.5k）相對其承諾過於單薄 | `tests/prompt-budgets.json` | 報告模板移到技能引用的 asset；補強驗證器的判定與協調器的階段規則 | M |
| B8 🟡 ✅ | **`full-report` 宣稱支援 `zh-CN` 與 `ja`**，但沒有任何模組支援 | `full-report:205` | 在真正支援前先移除 | S |

### 3.2 腳本、測試與 CI

| # | 發現 | 證據 | 修正 | 工作量 |
|---|------|------|------|--------|
| B9 🟠 ✅ | **工具中寫死技能清單與數量**而非使用 registry：`notify-release.js:145`、`publish-cursor-rules.js:57`、`publish-gemini.js:223`、`record-deploy.js:20` 寫「18」；`auto-deploy.yml:197` 傳入 `SKILL_COUNT: toJSON(24)`（因此 v1.9 起每筆 `DEPLOYMENTS.md` 都寫 24）；`setup-verify.js:217-219` 把 alias 當成主要框架；`pre-release-check.js:69` | 如上 | 一律匯入 `frameworkCount()`／`ALIAS_SKILLS`／`OUTPUT_TOOLS`；加 grep 測試禁止在 registry 以外出現 `['report-generator']` | S |
| B10 🟠 ✅ | **三個重疊的 PR workflow**（`test.yml`、`pr-check.yml`、`validate.yml`）各自執行 `test-skills.js` 與 `test-edgar.js`，又在 bash 重複 jq／frontmatter／版本檢查 —— 但**沒有一個執行 `npm test`**，所以 `test-llm-io` 只在 `llm-eval.yml` 的路徑篩選下才會跑。`install-test.yml` 與 `install-script.yml` 重疊且 PR 沒設 `paths`。`test.yml` 的 build-test job 用 heredoc 覆寫 `package.json`、渲染舊頁面組並斷言 `'1.3.0'` | `test.yml:30,38,57-163`；`pr-check.yml:182,185`；`validate.yml:153,156` | 合併成一個 `ci.yml`：`npm ci` → `npm test` → `build:site` → `check-links`，加上 `concurrency` 與 `permissions: contents: read`。保留 `install-script.yml`、`llm-eval.yml` 作為專門 job | M |
| B11 🟠 ✅ | **每日 QA commit 洗版歷史。** `main` 的 279 個 commit 中有 114 個是「daily site review」；報告內含日期，所以即使沒有變化也會產生 commit；它只跑 `test-skills.js` 而非完整測試 | `git log`；`scripts/site-review.js:74,91` | 報告寫到 job summary／artifact，只在狀態改變（或失敗）時 commit；改跑 `npm test` | S |
| B12 🟡 ✅ | **測試缺口。** 連結檢查忽略 `#錨點`（291 個錨點連結，1 個失效 = A10）；沒有測試確認每個框架都出現在 `CHOOSE-A-SKILL(-zh-TW).md` —— `10k-digest` 與 `stock-screener` 兩個語言都缺；沒有測試涵蓋 `build:site` 輸出、zh-TW 一致性、外部連結、`new-skill.js` 或發版腳本；Test 14 用 regex 解析 `build-site.js` 原始碼 | `scripts/check-links.js`；`test-skills.js:684` | 檢查錨點與 fence 配對；斷言 CHOOSE-A-SKILL 覆蓋率；export `SKILL_CATEGORIES` 改用 `require`；加一個在暫存目錄執行 `new-skill.js` 的 smoke test | M |
| B13 🟡 ✅ | **廢棄或佔位用的腳本。** `generate-changelog.js`（未接線）；`publish-cursor-rules.js`／`publish-gemini.js`（TODO 佔位，目標是虛構的 `registry.gemini.ai`，以 `continue-on-error` 執行、輸出從未上傳）；`notify-release.js`（僅手動）；`validate-prompts.js` 對每個 prompt 都發出警告 | 如上 | 刪除或移到 `scripts/archive/`；讓 `validate-prompts.js` 檢查 prompt 實際應有的段落 | S |
| B14 🟡 ✅ | **腳本的小型健壯性問題。** `new-skill.js` 的分類 regex 只跳脫 `&`（`:258,270,278`），並對未加引號的路徑執行 `execSync`（`:307`）；`sync-prompts.js` 對未知的技能名稱靜默忽略（`:61`），`--check` 也不會發現孤兒 prompt | 如上 | 共用 `escapeRegExp`；改用 `execFileSync`；未知名稱報錯；比對 prompt 名稱與技能目錄 | S |
| B15 🟡 ⬜ | **沒有 lint／格式化／型別檢查。** 沒有 eslint、prettier、`.editorconfig`、`.nvmrc` 或 `// @ts-check`；shellcheck 只在 CI；顏色／pass／fail 輔助函式在 7 個腳本重複。`engines` 仍允許已 EOL 的 Node 18，且只有 install job 測試它 | `package.json`；`install-script.yml:75` | 加 `.editorconfig` + `.nvmrc`，對 `scripts/lib/*` 加 `// @ts-check`；共用 `scripts/lib/report.js`；`engines` 提高到 ≥ 20 | M |
| B16 🟡 ◐ | **Workflow 衛生。** 4 個 workflow 沒有頂層 `permissions:`；只有 2 個設 `concurrency`；`softprops/action-gh-release@v1`（已有 v2）；action 用 tag 而非 SHA 鎖定；`install-script.yml` 的 push `paths` 漏了 `scripts/lib/**` | 如上 | 併入 B10 一起處理 | S |

### 3.3 文件

| # | 發現 | 證據 | 修正 | 工作量 |
|---|------|------|------|--------|
| B17 🔴 ✅ | **README 連到的平台指南數量過時**：「18 個框架」（`README-claude-code.md:3,50`、`README-cursor.md:51`）、「21 個框架」（`README-gemini.md:49`），`README-claude-code.md:87` 仍推薦已棄用的 `research-bundle` | 如上 | 修正，並把這些檔案加入 `test-skills.js` 的 `COUNT_DOCS` | S |
| B18 🟠 ✅ | **「目前版本 v1.4.0」**出現在 `FAQ.md:37,167,293,307`、`README-claude-code.md:227,365`、`SECURITY.md:86-98,221`（支援版本表）、`PLATFORM-COMPATIBILITY.md:35,87,148,214,292,476-480` | 如上 | 改為「最新版」或從 `plugin.json` 讀取；更新 SECURITY 支援表；加版本宣稱檢查 | S |
| B19 🟠 ✅ | **發版與貢獻文件過時。** `RELEASE-QUICK-REFERENCE.md` 說更新「兩個檔案」（應為三個）且沒提 `npm run release`；`ADDING-NEW-SKILLS.md` 說技能自動發現（:172），檢查清單卻仍寫「Registered in plugin.json」（:321,397）、「270+ tests」（:356），也沒提 `new-skill.js`（CONTRIBUTING 同樣沒有）；`CI-CD-GUIDE.md:181,256-260` 指向不存在的檔案；`DEPLOYMENTS.md` 沒有 v1.13.0 紀錄 | 如上 | 技能檢查清單改為「執行 `node scripts/new-skill.js`」；A2／A5 完成後依 CLAUDE.md 規則重寫發版指南 | S |
| B20 🟡 ◐ | **根目錄文件過多。** `README-claude-code`／`-cursor`／`-gemini`／`-ollama`、`PLATFORM-COMPATIBILITY`、`FAQ` 共約 2,600 行，重複安裝與用法說明，也是最過時的檔案；發版資訊散落在 `RELEASE_NOTES`、`CHANGELOG`、`RELEASE-QUICK-REFERENCE`、`DEPLOYMENTS`；`.github/ENABLE_PAGES_NOW.md`／`SETUP_PAGES.md` 是一次性筆記 | 檔案大小 | 以 `install.sh` 的 agent 清單為準整合成一份平台指南；保留 CHANGELOG 與自動產生的 DEPLOYMENTS；其餘移到 `doc/archive/` | M |
| B21 🟡 ✅ | **README 前後不一。** Quick Start 以 `install.sh` 為主，Platform Support 表卻寫「Clone repo」（`README.md:250-253`）；FAQ 說「50+ 個問答」（實際 43 個）；「深色主題 UI」（網站預設淺色／跟隨系統）；同時使用兩個網址（`yennanliu.github.io/InvestSkill` 119 次 vs 正式的 `yennj12.js.org`）；`README-zh-TW.md:204-239` 保留了英文版已移除的 v1.8–v1.13 歷史 | 如上 | 對齊內容；統一使用正式網址 | S |

### 3.4 網站

| # | 發現 | 證據 | 修正 | 工作量 |
|---|------|------|------|--------|
| B22 🟠 ✅ | **沒有 SEO 基礎設施**：沒有 `sitemap.xml`、`robots.txt`，90 頁中 0 頁有 `og:image`、`twitter:card` 或 `hreflang` —— 但語言切換早已知道每組中英對應頁 | 建置後的 `_site/` | 由 `build-site.js` 全部產生；提供一張預設 OG 圖 | S |
| B23 🟠 ✅ | **搜尋只看每頁前 1,600 個字元。** 搜「Sortino」（在詞彙表中）沒有結果；138 KB 的 Cookbook 大部分搜不到 | `site/build/build-site.js:1679` | 依標題段落建立索引（標題 + 錨點 + 內文），搜尋結果也能直接跳到段落 | M |
| B24 🟠 ✅ | **無障礙。** 淺色模式連結／強調色 `#e8664e` 對 `#faf8f5` 對比 3.08:1、強調色按鈕上的白字 3.26:1、`--text-dim` 2.56:1（AA 需 4.5:1）；53 頁有兩個 `<h1>`；沒有 skip link | `site/build/style.css`；建置頁面 | 連結改用較深的色票（`--accent-ink`）、markdown H1 降級、加 skip link | S |
| B25 🟡 ✅ | **頁面重量。** `full-demo-rklb.html` 274 KB，一開頁就載入 1.5 MB 圖片；58 個 `<img>` 都沒有 `loading="lazy"` 或尺寸 | 建置後的 `_site/` | 在渲染器加入延遲載入與圖片尺寸 | S |
| B26 🟡 ◐ | **zh-TW 缺口與漂移。** 沒有中文技能參考索引（導覽寫 `技能參考（英文）`，`build-site.js:1108`）；技能頁、changelog、contributing、404 只有英文；中文 Cookbook 少了英文版的六個段落（WACC Calculation、Sensitivity Table、Document Orientation、Investment Thesis、Indicator Signals、Risk Factors）；AMD／RKLB 示範檔內容是中文卻沒有 `-zh-TW` 後綴（跨股票配對寫在 `build-site.js:184-188`） | 如上 | 產生帶中文分類的 `skills-zh-tw.html`；補上六個段落；實作 `check-zh-parity.js`（roadmap §6.6） | M |
| B27 🟡 ✅ | **FAQ 沒有上網站**；404 頁只有英文且無搜尋 | `FAQ.md`；`404.html` | （B18 更新後）把 FAQ 建成雙語頁面；404 改為雙語並加搜尋 | S |

### 3.5 Repo 與社群

| # | 發現 | 修正 | 工作量 |
|---|------|------|--------|
| C1 🟡 ◐ | **未關閉的 issue 需要整理。** #5（外掛無法載入：frontmatter 缺 `name:`）已無法重現 —— `claude plugin validate` 通過 —— 但只有機器人回覆；#6–#10 是只有股票代號的單字 issue（「AAPL」「NVDA」「Mram」）；#2「TODO 1」；#24 是第三方推廣；#11「提交到社群 marketplace」仍開著，且驗證器回報**沒有外掛圖示** | 回覆並關閉 #5（可順手在 frontmatter 加 `name:` 以防萬一）；關閉 #2、#6–#10 並附文件連結；決定 #24 的去留；為 #11 加上 `.claude-plugin/icon.png`（512–2048 px）後提交。新增 issue 模板（bug／技能需求／提問），把只有代號的 issue 導向正確位置 | S |
| C2 🟡 ✅ | **Marketplace 描述早於新技能** —— `plugin.json` 與 `marketplace.json` 都沒提到 ETF、稅務、財報前瞻、論點追蹤、風險壓力測試或 fact-check，而這些正是目前最具差異化的功能 | 更新兩處描述與 `keywords` | S |

---

## 4. 可新增的功能

### 4.1 新技能

roadmap 的第二層（該文 §3.2）仍是正確的清單；這次掃描補充了排序依據，以及 roadmap 沒涵蓋的五個缺口。

| 技能 | 為什麼是現在 | 狀態／證據 | 工作量 |
|------|-------------|-----------|--------|
| ✅ **`trade-postmortem`** | `thesis-tracker` 已經把結案檔案交給它 —— 目前是懸空引用（A11） | roadmap 第二層 · 已被引用、尚未實作 | M |
| ✅ **`forensic-accounting`** | 除了 `bear-case` 提到一句之外，沒有任何地方有 Altman Z、Beneish M、應計比率或扣除 SBC 的自由現金流 | roadmap 第二層 | M |
| ✅ **`compare`**（2–5 檔正面比較） | 散戶最常問的「X 還是 Y？」沒有對應技能；`stock-screener` 只排名，不論證兩者取捨 | **新提案** | M |
| ✅ **`credit-check`**（償債能力） | 債務到期牆、利息保障倍數趨勢、信評、契約條款、以現行利率再融資的風險 —— 目錄中完全沒有 | **新提案** | M |
| ✅ **產業 KPI 包**（`--sector bank / insurer / reit / biotech / saas`） | 通用指標在這些產業會誤導：銀行 CET1／NIM、保險綜合率（全目錄皆無）、REIT AFFO、生技管線／現金跑道、SaaS NRR／Rule of 40。適合做成 `stock-eval`／`financial-report-analyst` 的旗標，而非五個技能 | **新提案** | M |
| ⬜ **`special-situations`** | 分拆、併購套利價差、公開收購、現金增資 | **新提案** | M |
| ⬜ **`watchlist`** | 跨多份 `thesis-tracker` 檔案的監控：哪些已 WEAKENED、本週有哪些催化劑 | **新提案** —— 建立在 thesis-tracker 的存檔契約上 | M |
| ⬜ `proxy-governance`、`ipo-analysis`、`pair-trade`、`investment-policy` | 同 roadmap | roadmap 第二層 | 各 M |

### 4.2 既有技能的強化

| 強化 | 證據 | 工作量 |
|------|------|--------|
| ✅ **`full-report --depth comprehensive` 執行所有框架** —— 加入 `earnings-preview`、`industry-map`、`10k-digest`、`chart-master`、`position-ladder`，並透過 `thesis-tracker` 存下論點；`fact-check`／`result-validator` 改為真正的模組而非文字說明；新增 `--skip <skill>`（仍未實作） | comprehensive 目前只跑 15/30（`full-report:250`）· roadmap §4.3、TODO #1 | M |
| ✅ **所有框架支援 `--lang zh-TW`** —— 目前只有 3/30（`10k-digest`、`full-report`、`learning-coach`）。透過 `new-skill.js` 模板加入共用的「雙語輸出」段落，並加契約檢查 | TODO #2 | M |
| ✅ **機器可讀的 JSON footer**，接在方框之後（signal、score、confidence、horizon、as-of、sources）—— 目前完全沒有；有了它，`eval-skills.js`、`result-validator`、`watchlist` 就不必用 regex 解析框線字元 | TODO #2 | M |
| ⬜ `stock-valuation --reverse`（反向 DCF：股價隱含多少成長） | roadmap §4.4，尚未開始 | S |
| ⬜ `stock-screener` 預設組合（品質價值、GARP、股息成長、動能） | roadmap §4.4，尚未開始 | S |
| ⬜ `portfolio-review` 匯入券商 CSV（Schwab／Fidelity／IBKR 欄位對應） | roadmap §4.4，尚未開始 | S |
| ⬜ `catalyst-calendar`：除息日與每月選擇權到期日 | 部分完成（解禁 :174、指數納入 :169） | S |
| ⬜ `economics-analysis`：一個其他技能可引用的標準景氣判定（擴張／放緩／收縮／復甦） | 部分完成（:193） | S |
| ⬜ `technical-analysis`：相對產業 ETF 與 SPY 的相對強度 | 只有一行通用說明（:99） | S |
| ⬜ `dividend-analysis`：非美國持有人的預扣稅說明 | 只提到 ADR（:259） | S |
| ✅ `result-validator`：Signal／Score 對照 + JSON 判定 | B1、roadmap §4.4 | S |

### 4.3 網站與學習

| 功能 | 狀態 | 工作量 |
|------|------|--------|
| ✅ 課程 **總經與 Fed 週期**、**給股票投資人的選擇權** | 未完成（roadmap §5.1、TODO #3） | 各 M |
| ✅ 第 1–8 課的自我檢測（第二部分已有）與**可列印速查表** | 未完成（§5.4） | M |
| ✅ **非美國投資人指南**頁面（券商、匯兌、W-8BEN、開戶） | 未完成（§5.4、TODO #4） | M |
| ✅ 詞彙表 76 → 約 95：§5.3 清單上的 18 個詞（Beneish、應計、SBC、非 GAAP、Form 4、13F、8-K、殖利率曲線、VIX、put/call、ATR、MACD、商譽、營運槓桿、反向 DCF、Rule of 40、解禁、雙重股權），再加上 covered call、CPI、聯邦基金利率 | 未完成 —— 仍是 76 個 | S |
| ⬜ 案例：**論點破局**案例與 **$10k ETF 核心**案例 | 未完成（§5.2） | M |
| ⬜ **免執行環境的互動工具**：prompt 產生器（選技能 + 旗標 → 複製指令）、安全邊際／反向 DCF 計算器 | 未完成（§5.5） | M |
| ⬜ 每個示範頁加上**「資料日期」橫幅**（資料日期、技能版本） | **新提案** —— 示範資料日期為 2026-10-11，會逐漸過時 | S |
| ◐ **段落層級搜尋**並可深層連結（B23），404 頁加搜尋 | **新提案** | M |
| ✅ 中文技能參考索引 + 技能頁的中文分類標題（B26） | 未完成（§5.6） | M |

### 4.4 工具

| 功能 | 理由 | 工作量 |
|------|------|--------|
| ✅ **能正常運作的 `npm run release`**（A2） | 發版時機規則依賴它 | M |
| ✅ **`check-zh-parity.js`** —— 比對每組中英頁面的標題數與段落名稱 | 本可抓到 Cookbook 漂移（B26）與被吞掉的標題（A10） | S |
| ✅ SKILL.md 與網站內容的 **fence／標題 lint** | 本可抓到 A1 與 A10 | S |
| ⬜ **定期 live eval**（每週、所有單一股票技能、設成本上限），輸出各技能契約通過率的趨勢表 | 目前 live eval 只跑有變動的技能；模型更新可能讓沒動過的技能悄悄退化 | M |
| ⬜ CLAUDE.md 的 **「Current State」區塊自動產生**（版本、數量） | 移除最後一處手動維護的數字 | S |

---

## 5. 優先順序 —— 建議的 PR 分批

| 批次 | 內容 | 工作量 | 排序理由 |
|------|------|--------|----------|
| **1 · 正確性** | A1（19 個技能的 fence 修正 + lint）、A6–A8（`full-report` 分數區間、股息模組、重新加權）、A11（事實更正）、A10（中文 Cookbook fence）、A9（site-review 數量） | M | 錯誤的輸出今天就會傳到使用者與模型 |
| **2 · 發版與 CI** | A2–A5、A12、A13、B9–B11、B16：單一發版路徑、單一執行 `npm test` 的 CI、全面使用 registry、正式宣告依賴、安靜的 QA commit | M | 為下一次發版解除阻礙；移除會說謊的檢查 |
| **3 · 文件更新** | B17–B21 + 擴充 `COUNT_DOCS` 並加版本宣稱檢查；C1 issue 整理；C2 描述；外掛圖示 | S–M | 可信度；成本低 |
| **4 · 網站** | B22–B25、B27 | M | 可被發現性與無障礙 |
| **5 · 契約功能** | 全面 `--lang zh-TW`、JSON footer、B1–B4 一致性、`full-report` comprehensive + `--skip` | M–L | TODO 中兩個未完成項目；JSON footer 是 `watchlist` 與更好評測的基礎 |
| **6 · 新技能** | `trade-postmortem` → `forensic-accounting` → `compare` → `credit-check` → 產業 KPI 包 | L | 對使用者價值最高；從已被引用的那個開始 |
| **7 · 學習內容** | §4.3 的課程、測驗、速查表、非美國投資人指南、詞彙表、中英一致性 | L | 持續進行 |

第 1–3 批屬於 patch 版本（`1.13.1`）；第 5 批或第一個新技能則是下一個 minor 版本（`1.14.0`）。

---

## 6. Roadmap 未完成項目的狀態

| Roadmap 項目 | 掃描時（v1.13.0） | 現在 |
|--------------|-------------------|------|
| §4.3 `full-report` 執行所有框架、`--skip` | 15/30 個框架；沒有 `--skip` | ✅ #44 —— quick 5 · standard 10 · comprehensive 25（所有適用於單一個股的框架），`--skip` |
| §4.1 所有技能支援 `--lang zh-TW` | 3/30 | ✅ #44 —— 全部 34 個框架，由契約檢查強制 |
| §4.1 JSON footer | 無 | ✅ #43 —— 每個技能都有，並與方框比對 |
| §4.4 針對性升級 | 大多未完成 | ◐ `result-validator` 的契約檢查與訊號對照已完成（#43）；`--reverse`、篩選預設、券商 CSV、催化劑日期、景氣判定、相對強度、預扣稅說明仍未完成 |
| §5.1 總經與 Fed、選擇權課程 | 未完成 | ✅ #43 —— 第 14、15 課，中英雙語 |
| §5.3 詞彙表缺口 | 76 個詞 | ✅ #44 —— 中英各 124 個詞 |
| §5.4 速查表、非美國投資人指南 | 未完成 | ✅ 速查表 #43 · 非美國投資人指南 #44 |
| §5.5 互動工具 | 未完成 | ⬜ 未完成 |
| §5.6 中文技能參考索引 | 未完成 | ✅ #44 —— `skills-zh-tw.html` |
| §6.6 中英一致性檢查器 | 未完成 | ✅ #43 —— `check-zh-parity.js` 已納入 `npm test` |
| §3.2 第二層技能 | 尚無上線 | ◐ `forensic-accounting`、`trade-postmortem` 已上線（#43）；`proxy-governance`、`investment-policy`、`ipo-analysis`、`pair-trade` 未完成 |

---

## 7. 刻意不提出的項目

roadmap §9 的立場不變：技能內不接即時資料或券商 API、不做加密貨幣／外匯、不做 ML 股價預測、不更動訊號區塊的六個欄位。本次掃描也**不**建議在網站加入分析追蹤 ——「不回傳任何資料」是產品的一部分；若未來真的需要使用數據，應採無 cookie 方案，並在「資料與準確性」頁面明確說明。

---

## 8. 進度追蹤

更新於 2026-10-24，[#43](https://github.com/yennanliu/InvestSkill/pull/43)（第 1–7 批）與 [#44](https://github.com/yennanliu/InvestSkill/pull/44)（與第 5、7 批重疊的 roadmap P0–P2 項目）合併之後。

### 8.1 依批次

| 批次 | 狀態 | PR | 出貨內容 |
|------|------|----|----------|
| 1 · 正確性 | ✅ | #43 | A1（19 個技能 + 契約檢查：方框 fence 內只能有方框）、A6–A8、A9、A10、A11；另含 B5、B6、B8 |
| 2 · 發版與 CI | ✅ | #43 | A2（`scripts/lib/release.js`）、A3–A5（`release.yml` 是唯一發版路徑）、A12、A13、B9–B14；`ci.yml` 取代四個 workflow；錨點檢查、fence lint、選擇技能覆蓋率、`new-skill.js` smoke test |
| 3 · 文件更新 | ✅ | #43 | B17–B19、B21；擴充 `COUNT_DOCS` 並新增「過時目前版本」測試；C2；外掛圖示；issue 模板 |
| 4 · 網站 | ✅ | #43 | B22–B25、B27 |
| 5 · 契約功能 | ✅ | #43、#44 | JSON footer + parser；B1–B4；所有框架支援 `--lang zh-TW`；`full-report` comprehensive + `--skip` |
| 6 · 新技能 | ✅ | #43 | `trade-postmortem`、`forensic-accounting`、`compare`、`credit-check`、`--sector` 產業 KPI 包 —— 34 個框架 |
| 7 · 學習內容 | ✅ | #43、#44 | 第 14–15 課、第 1–8 課自我檢測、速查表、中文 Cookbook 一致性；詞彙表 76 → 124、非美國投資人指南、中文技能參考 |

### 8.2 仍待處理

| 項目 | 還剩什麼 | 追蹤位置 |
|------|----------|----------|
| B7 | 把 `report-generator` 的 HTML/CSS 模板移出 prompt；進一步補強 `result-validator` 與 `full-report` | `TODO.md` #5 |
| B15 | eslint、`scripts/lib/` 的 `// @ts-check`、`.editorconfig`／`.nvmrc`、`engines` ≥ 20 | `TODO.md` #5 |
| B16 | Actions 仍以 tag 而非 SHA 鎖定 | — |
| B20 | 平台指南已更新，但尚未整合成一份以 `install.sh` 為準的指南 | — |
| B26 | `FULL-DEMO-AMD.md`／`FULL-DEMO-RKLB.md` 維持原檔名（一致性檢查已知道跨股票配對）；技能頁依設計維持英文 | — |
| C1 | 需維護者處理：回覆並關閉 #5（已無法重現）、#2、#6–#10；決定 #24；為 #11 提交上架（[上架指南](ANTHROPIC-DIRECTORY-ONBOARDING.md)） | GitHub issues |
| §4.1 | `special-situations`、`watchlist`、`proxy-governance`、`ipo-analysis`、`pair-trade`、`investment-policy` | `TODO.md` #1 |
| §4.2 | `stock-valuation --reverse`、篩選預設、券商 CSV、催化劑除息日／選擇權到期日、單一景氣判定、相對強度、非美國預扣稅說明 | `TODO.md` #3 |
| §4.3 | 論點破局與 $10k ETF 案例、免執行環境的互動工具、示範頁「資料日期」橫幅、404 頁搜尋 | `TODO.md` #2、#4 |
| §4.4 | 定期 live eval 與通過率趨勢；CLAUDE.md「Current State」自動產生 | `TODO.md` #4 |
