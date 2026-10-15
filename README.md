# Type Instructor of Pokémon

單屬性攻防記憶遊戲，支援英文、繁體中文與日文，以及一般／競速模式。
保留原本的像素介面，已完成 Vite／React 遷移與遊戲流程驗收。

## 開發

使用 Node.js 24.19.0（見 `.nvmrc`）；專案限定 Node 24，CI 讀取相同版本。
套件管理使用 pnpm 11.22.0（見 packageManager）；`.npmrc` 使用公開 npm registry。
沿用 pnpm-workspace.yaml 的套件發佈時間例外設定，僅保留 pnpm-lock.yaml 作為依賴鎖定檔。

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

開啟 http://localhost:5173/type_instructor/ 。`pnpm start` 也會啟動 Vite。
使用 hash URL，例如 `#/zh/menu`，以相容 GitHub Pages 的靜態託管。
未知語系使用英文，遊戲路由只接受單屬性（s）、basic／speedrun 與 attack／defend。
錯誤遊戲參數會回到目錄；結果需為安全整數，競速秒數不可為負；未匹配路徑回英文首頁。

## 建置與預覽

```sh
pnpm build
pnpm preview
```

正式輸出位於 `dist/`，預覽位址為 http://localhost:4173/type_instructor/ 。
Vite 的 base 設為 `/type_instructor/`，字型、圖示與 manifest 均使用此路徑。
正式建置會使用 Workbox 產生 service-worker.js 並預先快取本機資源；開發模式不註冊 worker。
已移除 sw-precache、舊快取 polyfill 與相關 dependency override。

舊的 `npm run deploy` 指令已移除；它會改寫 Git 歷史，且依賴舊的 `build/` 輸出。
改由下方 GitHub Actions workflow 部署 dist，不需另外推送產物分支。

## 測試

`pnpm lint` 檢查 JavaScript／TypeScript 與 React Hooks；`pnpm typecheck` 使用 strict TypeScript，
包含核心邏輯、store、hook、共用 UI 與原始碼旁的 unit tests。既有 JS 頁面逐步遷移。

| 指令 | 用途 |
|---|---|
| `pnpm test`／`pnpm test:unit` | Vitest 單次執行，Node 環境，15 個案例 |
| `pnpm test:unit:watch` | Vitest watch，開發時持續執行 |
| `pnpm test:e2e` | Playwright 完整矩陣，108 個案例 |
| `pnpm test:e2e:smoke` | Chromium 的 7 個關鍵流程，篩選 `@smoke` |
| `pnpm test:a11y` | 四種設定的 28 個無障礙案例，篩選 `@a11y` |

```text
src/
  lib/
    getQuiz.test.ts
    getStatus.test.ts
    routes.test.ts
  stores/
    quiz.test.ts
tests/
  e2e/
    navigation.spec.js
    gameplay.spec.js
    accessibility.spec.js
    offline.spec.js
    fixtures/legacy-service-worker.js
    support/offline-server.js
vitest.config.js
playwright.config.js
```

Unit tests 與原始碼放在一起（`src/**/*.test.ts`），涵蓋出題、效果、計分、輸入防護、
19／20 分邊界、結算、場次隔離與路由驗證。Vitest 共用 Vite 設定，只收集這些測試。
核心出題使用原生 `Math.max/min`；Lodash 僅用於抽樣與洗牌。

Playwright 僅收集 `tests/e2e/**/*.spec.js`，驗證完整頁面、鍵盤流程、axe、
屬性色對比、Pages 子路徑資源、worker 更新與離線遊玩。`@offline` 可篩選離線整合案例。

```sh
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

快速開發只需安裝 Chromium，再執行 `pnpm test:e2e:smoke`。
`E2E_SERVER=dev pnpm test:e2e:smoke` 使用 Vite 開發伺服器；預設使用正式 build／preview。
開發模式不註冊 worker，因此離線整合案例只適用正式版，會在開發模式跳過。
若已安裝 Google Chrome，可加 `PLAYWRIGHT_CHANNEL=chrome` 使用它執行 Chromium project。
測試自行啟動與停止伺服器，固定使用 `/type_instructor/` 子路徑。

CI 先執行 lint、typecheck、unit tests，再跑一次完整 E2E 矩陣。
完整矩陣已包含 smoke 與 a11y，CI 不另外重跑這些子集合。

## 遷移進度

- 第 1 步：現有系統 baseline 與邏輯測試已完成並歸檔。
- 第 2 步：Vite、React 19 與必要的相容性更新已完成並歸檔。
- 第 3 步：已移除 Redux，改用 Zustand 與遊戲 hook，已完成並歸檔。
- 第 4 步：已修正競速防禦入口，並將競速目標與三語說明統一為 20 分，已完成並歸檔。
- 第 5 步：Workbox 離線更新與 Pages workflow 已完成並歸檔。
- 第 6 步：本機與遠端 CI 完整驗收通過，已歸檔、合併、部署並驗證正式站。

正式遊戲：[Type Instructor](https://kaddopur.github.io/type_instructor/)。遷移 PR：[#2](https://github.com/kaddopur/type_instructor/pull/2)。

競速防禦入口會進入防禦題，競速達到 20 分後結束；19 分或因答錯扣分時會繼續。
目標值集中於 [gameRules.ts](src/lib/gameRules.ts)，遊戲邏輯與中英日說明共用此設定。

玩法、已知問題與完整驗收清單見 [OpenSpec baseline](openspec/baseline.md)。
第 2 步紀錄見 [Vite／React migration](openspec/changes/archive/2026-10-15-migrate-vite-react/)。
第 3 步變更與驗證紀錄見 [Zustand migration](openspec/changes/archive/2026-10-15-replace-redux-with-zustand/)。
第 4 步變更與驗證紀錄見 [Speedrun fixes](openspec/changes/archive/2026-10-15-fix-speedrun-rules/)。
第 5 步變更與驗證紀錄見 [Offline and deployment](openspec/changes/archive/2026-10-15-modernize-offline-deployment/)。

## 遊戲狀態

每場遊戲使用獨立的 [Zustand store](src/stores/quiz.ts)，直接管理開始、計時、
作答與回饋後的狀態更新；開始前、回饋期間、已選過的選項和結束後的輸入不計分。
[useGame](src/hooks/useGame.ts) 管理計時器並在離開時清理；重玩或變更遊戲路徑會建立新場次。
語言與模式沿用 URL，翻譯來自靜態 JSON；目前不持久保存遊戲狀態。

## 離線與版本更新

首次連線開啟正式版、完成快取後，重新整理與遊戲操作皆可離線使用。
worker 保留原本的網址與 scope；新版本安裝成功後會接手，但不強制重新整理正在玩的頁面。
玩家下次重新載入時才使用新版，並開始新的遊戲場次。

啟用新版 worker 時，只刪除同 scope 的舊 sw-precache 快取；其他網站快取不受影響。
若新版缺少必要資源而安裝失敗，舊 worker 與舊快取仍可離線使用。
目前的 Workbox 快取由 Workbox 清理過期內容，無需玩家手動清除瀏覽器資料。

## GitHub Pages 部署

[Pages workflow](.github/workflows/pages.yml) 使用 `.nvmrc`、固定 pnpm 版本與 frozen lockfile。
對 master 的 PR 會執行邏輯測試、正式建置與瀏覽器測試；通過後才能部署 dist 產物。
push 到 master 或在 master 手動執行 workflow 會部署到 github-pages environment。
其他分支的手動執行僅驗證，不部署；同時間只允許一個部署執行。

發布前，在 GitHub Settings → Pages → Build and deployment 將 Source 設為 **GitHub Actions**。
2026-10-15 第 6 步檢查時，此 repo 已設定為 GitHub Actions 來源。
新環境或 fork 若尚未切換，請先完成上方設定。
「Validate and deploy Pages」可在 master 手動執行；之後 master 的 push 會自動部署。
部署後於 Actions 的 github-pages environment 查看正式網址與結果。

完整驗收與發布紀錄見下方第 6 步文件；Pages 來源由使用者切換，本次沒有改動該設定。

## 完整驗收

```sh
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

共 108 個驗收案例：48 個完整遊戲流程、28 個導頁／邊界／資源案例、
28 個鍵盤流程／axe／屬性色對比案例，以及四個 worker 更新與離線案例。設定包含桌面 Chromium、Firefox、WebKit，
以及 iPhone 13 尺寸的 WebKit 模擬；手機模擬不代表實機 iOS 或 Android 驗證。
CI 執行此矩陣，全部通過才會部署。

驗收也涵蓋四個答案的可見範圍，並修正舊版在寬螢幕裁掉第二排答案的問題。
詳見 [第 6 步驗證與發布紀錄](openspec/changes/archive/2026-10-15-complete-migration-acceptance/verification.md)。

## UI 與無障礙操作

全站使用 Tailwind CSS 4 與共用像素風格；字型宣告保留在 `src/index.css`。
18 種屬性色集中於 Tailwind theme，`src/lib/typeStyles.ts` 使用完整 class 對照，
確保正式建置能產生隨機出題需要的每種顏色。文字依背景選黑／白，維持至少 4.5:1 的對比。
已移除各頁的舊 CSS、normalize.css 與 classnames。

Button／Dialog 改寫自 shadcn/ui new-york 的 Radix 版本，採本機原始碼，
保留其 MIT 授權於 `src/components/ui/LICENSE.md`。`components.json` 與 `@/` alias 供後續維護。
本次沒有加入 UI 不使用的圖示或動畫套件。

- 使用 Tab／Shift+Tab 移動，Enter／Space 開始或作答。
- 開始 Dialog 會聚焦開始按鈕並限制焦點範圍；Escape 或目錄連結返回目錄，不啟動計時。
- 各頁進入時聚焦第一個可操作元件：首頁 Start、目錄第一個入口、結果頁重玩；遊戲開始與換題後聚焦第一個可作答選項。第一個選項與重玩連結的無障礙描述分別包含題幹、結算結果。
- 答對／答錯有三語文字與持續的 live status；計時器不會每秒觸發播報。
- 回饋中與已選過的答案會標示不可作答，store 仍阻擋重複輸入。

```sh
pnpm test:a11y
```

此指令在四種設定執行共 28 個無障礙案例；加上 `--project=chromium-desktop` 可只執行 Chromium 的七個案例。
axe 掃描 WCAG 2 A／AA 與 2.1 AA 規則，涵蓋三語頁面、開始 Dialog 與作答後狀態。
自動測試不等同完整 WCAG 合規稽核，也不代表已完成人工螢幕閱讀器或手機實機驗證。
玩法仍有既定時間限制，若要提供不限時練習需另行設計。

步驟與驗收紀錄見 [UI migration](docs/ui-migration.md)。
