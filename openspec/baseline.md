# 遷移 baseline 與驗收紀錄

來源：`4f1e318`（2016-09-26）。建立日期：2026-10-15。

## 第 1 步範圍與依據（歷史紀錄）

- `specs/gameplay/spec.md`：出題、計分、回饋、模式、重玩。
- `specs/navigation-and-language/spec.md`：頁面、hash URL、三種語言。
- 實作依據：`src/lib/getQuiz.js`、`src/lib/getStatus.js`、`src/ducks/quizzes.js`、`src/components/{Quiz,Menu,Result,Lang,I18nLink,I18nPage}.js`、`src/index.js`、語系 JSON。
- 此步只有文件、測試及測試指令；正式環境的程式與相依版本不變。
- 自動化測試直接執行既有出題與 reducer，沒有 mock Lodash。屬性倍率是程式的特徵測試，沒有外部資料校驗。

## 原有問題與第 4 步修正狀態

| ID     | 原始行為                               | 第 4 步修正                                                                           |
| ------ | -------------------------------------- | ------------------------------------------------------------------------------------- |
| BUG-01 | Menu 的競速防禦連到 `speedrun/attack`  | 已連到 `speedrun/defend`，三語入口與題幹皆已驗證                                      |
| BUG-02 | Quiz 的目標為 3 分，三語說明均為 20 分 | 已統一為 20 分；共用 gameRules 設定，三語以 placeholder 顯示目標，19／20 分邊界已驗證 |

兩項皆不在第一步修正，也不以通過測試將錯誤行為固定為正確規格。
第 4 步修正與證據見 `changes/archive/2026-10-15-fix-speedrun-rules/verification.md`。

## 原始碼觀察與遷移風險（第 1 步紀錄）

- 防止重複作答的 guard 在 Quiz 元件，reducer 本身沒有防重複 dispatch；reducer 測試不代表點擊 guard 已驗證。
- 卸載只清理 interval，答題 timeout 沒有清理；第 3 步應驗證離開後不再換題或導頁。
- `getQuiz` 可接收上一個敵人以避免重複，但目前呼叫端沒有傳入；遷移不新增「連續題目不能重複」規則。
- 競速結算使用答題時捕捉的整數秒；遷移維持整數秒顯示，並驗證最後一題不讀到其他場次的時間。
- 網站宣告 service worker 與 manifest，建置產生離線快取；目前尚未實際驗證離線與舊版更新，第 5 步驗收。

## 自動化測試

第 2 步已改為 ES modules；第 5 步沿用 pnpm 設定並固定版本，現行指令（Node.js 版本見 `.nvmrc`）：

```sh
pnpm install --frozen-lockfile
pnpm test:unit
```

現行 unit tests 使用 Vitest，放在 `src` 原始碼旁；Playwright 測試集中於 `tests/e2e`，
使用 `pnpm test:e2e` 執行。測試直接載入原始碼，不再需要 Node resolve hook 或暫存安裝的 Lodash。
第 3 步將測試改為直接執行 Zustand store，原有出題、計分、回饋案例保留，
另驗證作答防護與場次隔離。此指令不會驗證 React 元件或瀏覽器生命週期；
瀏覽器驗證見第 2、3 步的 verification.md，以下清單保留完整遷移的驗收範圍。

### 第 3 步實作狀態

- Redux 與 React Redux 已移除；遊戲邏輯位於 `src/stores/quiz.js`。
- 作答防護集中在 store action；hook 在離開或結束時清理 interval 和 timeout。
- 每場遊戲使用獨立的 store，路徑改變與重玩皆建立新場次。
- 當時 BUG-02 的目標常數位於 store；第 4 步已移至共用的 `src/lib/gameRules.js` 並與三語說明統一。
- 驗證結果見 `changes/archive/2026-10-15-replace-redux-with-zustand/verification.md`。

### 第 5 步實作狀態

- 改用 Workbox 產生 `service-worker.js`，移除 sw-precache、polyfill 與 override。
- 舊快取僅在新 worker 啟用後按確切 scope 清理；更新不會自動重載正在玩的頁面。
- 測試涵蓋舊 worker 接替、Workbox 版本更新、失敗安裝與離線遊玩。
- 已加入使用 pnpm frozen lockfile 的 Pages workflow；第 5 步當時線上以 gh-pages 分支為來源；第 6 步開始時使用者已切換為 workflow。
- 驗證與發布前置條件見 `changes/archive/2026-10-15-modernize-offline-deployment/verification.md`。

### 第 1 步執行結果（歷史紀錄）

- `openspec validate --specs --strict --no-interactive`：2 份規格通過，0 失敗。
- `NODE_PATH=/tmp/type-instructor-baseline-deps/node_modules npm run test:baseline`：7 個測試通過，0 失敗。使用 Node 22.23.2 與暫存安裝的 Lodash 4.15.0，沒有安裝舊 CRA 建置鏈。
- Node 會提示舊專案未宣告 module type；不影響此次測試，package module 設定留待 Vite 遷移處理。
- 尚未啟動舊 React 應用、執行正式建置或完成瀏覽器驗收。

## 第 6 步瀏覽器驗收清單

以下項目已完成本機桌面 Chromium／Firefox／WebKit 與手機 WebKit 模擬驗收。
三語、四種模式各有完整結算與重玩案例；實機與正式發布驗證限制以第 6 步 verification.md 為準。

- [x] 根首頁英文預設；首頁 → 語言 → 選單 → 遊戲 → 結果 → 重玩／選單／首頁。
- [x] 選對模式與題幹；競速防禦符合 BUG-01 的修正目標。
- [x] 開始說明顯示時不計時；關閉一次只啟動一個計時器。
- [x] 答對加一分、答錯減一分、允許負分、顯示倍率和翻譯提示。
- [x] 回饋 500 毫秒內點擊無效；錯誤選項不能重複計分；錯後保留原題，對後換題。
- [x] 一般模式從 60 倒數到零，回饋期間照常計時，結算分數正確且只導頁一次。
- [x] 競速從零累計，符合 BUG-02 的 19／20 分邊界，結算用時正確。
- [x] 重玩清除舊題、分數與標記，保留語言、模式與攻防種類。
- [x] 回饋中離開、快速返回與重玩，沒有殘留 timeout／interval；React StrictMode 不重複計時。
- [x] 正式建置的 hash 深連結、重新整理、返回與 Pages 子路徑資源正常。
- [x] 手機／桌面版面、三語文字、字型與圖片正常。
- [x] 首次連線後離線可玩，舊 service worker 能更新，新版不被舊快取遮蔽。

第 6 步證據與發布結果見 `changes/archive/2026-10-15-complete-migration-acceptance/verification.md`。
