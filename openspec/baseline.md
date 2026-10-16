# 遷移基準與驗收紀錄

這份文件記錄遷移前的行為、已知問題與各步驟的驗證結果。來源版本：`4f1e318`（2016-09-26）。建立日期：2026-10-15。

## 文件格式與用語

規格與封存提案保留 OpenSpec 解析所需的英文標記：`Purpose` 是目的，`Requirements` 是需求，`Requirement` 是個別需求，`Scenario` 是驗收情境。`SHALL` 表示必須，`SHALL NOT` 表示不得，`MAY` 表示允許；`WHEN`、`THEN`、`AND` 分別標示條件、預期結果及附加結果。檔案路徑、指令、程式名稱與歷史版本不翻譯。

文件供維護此專案的開發者使用。「狀態儲存區」指保存單場遊戲資料的 store；「背景快取程式」指 service worker，負責離線資源與更新。「hash 路由」依網址 `#` 後的片段切換頁面。「冒煙測試」是快速確認主要功能可運作的測試；「端對端測試」則透過瀏覽器操作完整使用流程。

## 第 1 步：範圍與依據（歷史紀錄）

- `specs/gameplay/spec.md`：出題、計分、回饋、模式與重玩。
- `specs/navigation-and-language/spec.md`：頁面、hash 網址與三種語言。
- 實作依據：`src/lib/getQuiz.js`、`src/lib/getStatus.js`、`src/ducks/quizzes.js`、`src/components/{Quiz,Menu,Result,Lang,I18nLink,I18nPage}.js`、`src/index.js` 及語系 JSON。
- 這一步只加入文件、測試與測試指令，不改正式程式或相依版本。
- 自動測試直接執行既有出題函式與 reducer（依操作更新狀態的函式），不模擬 Lodash。屬性倍率測試只記錄程式行為，未用外部資料核對。

## 原有問題已在第 4 步修正

| 問題   | 原始行為                                  | 第 4 步修正與驗證                                                               |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------------- |
| BUG-01 | Menu 的競速防禦入口連到 `speedrun/attack` | 改連到 `speedrun/defend`，已驗證三語入口與題幹                                  |
| BUG-02 | Quiz 在 3 分結束，三語說明卻寫 20 分      | 統一為 20 分，共用 gameRules 設定；三語透過佔位符顯示目標，已驗證 19／20 分邊界 |

第 1 步未修正這兩項問題，也未將錯誤行為定為正確規格。第 4 步修正證據見 `changes/archive/2026-10-15-fix-speedrun-rules/verification.md`。

## 第 1 步：原始碼觀察與遷移風險（歷史紀錄）

- 防止重複作答的檢查位於 Quiz 元件。reducer 沒有防止重複派送操作；reducer 測試通過，不代表點擊防護已驗證。
- 卸載只清理週期計時器 interval，未清理答題延遲計時器 timeout。第 3 步須確認離開後不再換題或導頁。
- `getQuiz` 可接收上一個敵方屬性以避免重複，但當時呼叫端未傳入。這次遷移不新增「連續題目不能重複」規則。
- 競速結果使用作答當下記錄的整數秒。遷移保留整數秒顯示，並驗證最後一題不讀取其他場次時間。
- 網站宣告背景快取程式與 manifest（應用程式資訊清單），建置會產生離線快取。當時尚未實際驗證離線與舊版更新，留待第 5 步驗收。

## 現行自動化測試指令

第 2 步已改用 ES modules（JavaScript 標準模組格式）。第 5 步沿用 pnpm 設定並固定版本。Node.js 版本見 `.nvmrc`。

```sh
pnpm install --frozen-lockfile
pnpm test:unit
```

單元測試使用 Vitest，放在 `src` 原始碼旁。Playwright 瀏覽器測試集中於 `tests/e2e`，以 `pnpm test:e2e` 執行。測試直接載入原始碼，不再需要 Node 自訂模組解析鉤子或暫存安裝的 Lodash。

第 3 步已讓測試直接執行 Zustand 狀態儲存區，保留出題、計分與回饋案例，另驗證作答防護及場次隔離。單元測試不驗證 React 元件或瀏覽器生命週期；瀏覽器驗證見第 2、3 步的 verification.md。下方清單保留完整遷移驗收範圍。

## 第 3 步：已完成的實作

- 移除 Redux 與 React Redux；遊戲邏輯位於 `src/stores/quiz.js`。
- 作答防護集中於狀態操作；遊戲 hook 在離開或結束時清理週期與延遲計時器。
- 每場使用獨立狀態儲存區；換路徑或重玩都建立新場次。
- 當時 BUG-02 的目標常數放在狀態儲存區。第 4 步已移至共用 `src/lib/gameRules.js`，與三語說明統一。
- 驗證結果見 `changes/archive/2026-10-15-replace-redux-with-zustand/verification.md`。

## 第 5 步：已完成的實作

- 改用 Workbox 產生 `service-worker.js`，移除 sw-precache、相容程式與相依覆寫。
- 新背景快取程式啟用後，只清理確切註冊範圍的舊快取；更新不自動重新載入正在玩的頁面。
- 測試涵蓋接替舊背景快取程式、Workbox 版本更新、安裝失敗與離線遊玩。
- 加入 Pages 工作流程，以 pnpm 凍結鎖定檔安裝。第 5 步當時線上仍以 gh-pages 分支為來源；第 6 步開始時，使用者已改為工作流程發布。
- 驗證與發布前提見 `changes/archive/2026-10-15-modernize-offline-deployment/verification.md`。

## 第 1 步：執行結果（歷史紀錄）

- `openspec validate --specs --strict --no-interactive`：2 份規格通過，0 份失敗。
- `NODE_PATH=/tmp/type-instructor-baseline-deps/node_modules npm run test:baseline`：7 個測試通過，0 個失敗。使用 Node 22.23.2 與暫存安裝的 Lodash 4.15.0，未安裝舊 CRA 建置工具。
- Node 提示舊專案未宣告模組類型，不影響此次測試。套件模組設定留待 Vite 遷移處理。
- 當時尚未啟動舊 React 應用程式、執行正式建置或完成瀏覽器驗收。

## 第 6 步：已完成的瀏覽器驗收

以下項目已在本機桌面 Chromium／Firefox／WebKit 與手機 WebKit 模擬環境驗收。三語、四種模式都有完整結算與重玩案例；實機與正式發布的驗證限制，以第 6 步 verification.md 為準。

- [x] 根首頁預設英文；可依序操作首頁 → 語言 → 選單 → 遊戲 → 結果 → 重玩／選單／首頁。
- [x] 模式與題幹正確；競速防禦符合 BUG-01 修正目標。
- [x] 開始說明顯示時不計時；關閉後只啟動一個計時器。
- [x] 答對加一分、答錯減一分、允許負分，並顯示倍率及對應語言提示。
- [x] 500 毫秒回饋期間點擊無效；同一錯誤選項不重複計分；答錯保留原題，答對換題。
- [x] 一般模式從 60 秒倒數到零，回饋期間繼續計時；結果分數正確，只導頁一次。
- [x] 競速從零秒累計，符合 BUG-02 的 19／20 分邊界，結果用時正確。
- [x] 重玩清除舊題、分數與標記，保留語言、模式及攻防種類。
- [x] 回饋期間離開、快速返回及重玩，沒有殘留延遲或週期計時器；React StrictMode 不重複計時。
- [x] 正式建置的 hash 深連結、重新整理、返回與 Pages 子路徑資源正常。
- [x] 手機／桌面版面、三語文字、字型與圖片正常。
- [x] 首次連線後可離線遊玩，舊背景快取程式可更新，新版不被舊快取遮蔽。

第 6 步證據與發布結果見 `changes/archive/2026-10-15-complete-migration-acceptance/verification.md`。
