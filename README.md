# Type Instructor

Pokémon 屬性相剋記憶練習。從四個選項中選出最有效的攻擊屬性，或受到傷害最少的自身屬性。
不用註冊，手機與電腦都能玩，支援英文、繁體中文與日文。

**非官方粉絲作品，與 Pokémon 官方無關，亦未獲其授權或贊助。**
Pokémon 的相關權利屬於各權利人。

## 開始遊玩

先看玩法與實際遊戲畫面，再從介紹頁按「開始遊戲」：

| 語言    | 遊戲介紹                                                                |
| ------- | ----------------------------------------------------------------------- |
| English | [About the game](https://kaddopur.github.io/type_instructor/#/en/about) |
| 中文    | [遊戲介紹](https://kaddopur.github.io/type_instructor/#/zh/about)       |
| 日本語  | [ゲーム紹介](https://kaddopur.github.io/type_instructor/#/ja/about)     |

也可以直接開啟[遊戲首頁](https://kaddopur.github.io/type_instructor/#/zh/)。

### 玩法與計分

1. 選擇一般遊玩或時間競速，再選攻擊或防禦。
2. 看清楚敵方屬性或敵方攻擊屬性，再從四個選項中作答。
3. 答對加 1 分，答錯扣 1 分。答錯後可在回饋結束時嘗試其他選項，答對則進入下一題。

每場將 18 種題幹屬性洗牌後依序出題，每輪各出現一次，跨輪也不會連續重複。
防禦題針對同一攻擊屬性，先練免疫、下一輪練抗性，再交替輪替；沒有免疫時練抗性。
抗性題不放入免疫選項，請選四個選項中受到傷害最少的屬性。重玩會重設題序與輪替紀錄。

| 模式     | 目標                                     |
| -------- | ---------------------------------------- |
| 一般遊玩 | 在 60 秒內取得最高分，最後分數可能為負分 |
| 時間競速 | 盡快達到 20 分，結果顯示經過秒數         |

### 本場錯題重練

完成挑戰後，如果本場有答錯的題目，結果頁會顯示「本場錯題重練」。重練保留原題與原選項，不計分、不計時，也不改變最佳紀錄。答錯後留在原題，可繼續選其他答案。本輪曾答錯的題目，答對後排到剩餘題目的最後再練；本輪一次答對才移除，直到全部練完。

同一題在挑戰中答錯多次只收錄一次。關閉後重開會從本場原始錯題清單開始；重新整理、開始新挑戰或離開遊戲頁面後，錯題資料不再保留。

按下開始對話框的「開始」後才會計時。鍵盤可用 Tab／Shift+Tab 移動焦點，
Enter 開啟連結，Enter／空白鍵開始或作答。開始對話框內按 Escape 可返回選單。

## 網站瀏覽統計

正式網站使用 Google Analytics 4（GA4），評估 ID 為 `G-6H3DMT5TLL`。
只在正式建置、且主機名稱為 `kaddopur.github.io` 時啟用；本機開發與預覽不會送出資料。

網站會在首次顯示頁面、切換頁面與返回上一頁時送出 `page_view`。
紀錄包含完整網址（含 `#/…` 路由）、頁面標題與來源頁面；同一網址連續觸發不會重複紀錄。
目前沒有另外傳送答題或遊戲事件。Google 腳本被阻擋或離線時，遊戲仍可操作。

### GA4 後台設定與確認

本專案手動傳送頁面瀏覽紀錄，並設定 `send_page_view: false`。
為避免與 GA4 的自動追蹤重複，請完成以下設定：

1. 開啟 GA4「管理」→「資料串流」，選擇評估 ID 為 `G-6H3DMT5TLL` 的網站串流。
2. 開啟「加強型評估」設定，在「網頁瀏覽」展開進階設定。
3. 關閉「根據瀏覽器記錄事件變更頁面」選項並儲存。其他評估選項可維持原設定。
4. 部署新版後，開啟正式網站並切換幾個頁面，在 GA4「即時」報表確認收到事件。
   需要核對參數時，使用 Tag Assistant 開啟偵錯，再到 DebugView 查看 `page_view`。

只有本機修改或測試通過，還不能證明 GA4 已收到正式網站的資料；必須部署後在報表確認。
自動測試會攔截 Google 請求，不會混入正式統計。
設定依據見 [Google 官方頁面瀏覽追蹤說明](https://developers.google.com/analytics/devguides/collection/ga4/views)。

## 安裝到手機或電腦

Type Instructor 是可安裝的網頁 App（PWA），可以從主畫面或電腦上的圖示開啟。

| 裝置／瀏覽器          | 安裝方式                                                            |
| --------------------- | ------------------------------------------------------------------- |
| iPhone／iPad · Safari | 分享選單 → 加入主畫面；若有「打開為網頁 App」，保持開啟後按「加入」 |
| Android · Chrome      | 右上角選單 → 安裝應用程式或加到主畫面，再依畫面指示完成             |
| 電腦 · Chrome／Edge   | 使用瀏覽器的安裝選項，完整選單步驟見介紹頁                          |

從 Threads 等 App 內開啟時，請先改用 Safari、Chrome 或 Edge。
選單名稱可能隨版本不同；無法安裝時仍能直接在瀏覽器遊玩。
完整步驟及官方說明連結見[介紹頁的安裝區塊](https://kaddopur.github.io/type_instructor/#/zh/about)。

### 離線使用與更新

首次連網開啟正式版、完成資源快取後，頁面、字型、遊戲截圖與遊戲操作都可離線使用。
**安裝成功不代表離線下載已完成。** 如果瀏覽器清除了網站資料，需要再次連網下載。
開發模式不註冊 service worker，也不提供離線快取。

新版會在背景安裝，不會強制重新整理正在玩的頁面；下次重新載入時使用新版，並開始新的場次。
若新版缺少資源而安裝失敗，舊版本與舊快取仍可使用。
快取更新會清理同 scope 的舊 sw-precache，其他網站的快取不受影響。

## 畫面與無障礙操作

Home 與遊戲頁維持固定布局，About 介紹頁可捲動；手機版使用動態視窗高度與安全區域。
主名稱統一為 Type Instructor，副標與非官方聲明支援三語，語言選項依英文、中文、日文排列。
介面採暖白背景與黃藍點綴，保留像素標題、18 種屬性色及本機 CJK 字型；長篇說明使用系統字型。

- 進入頁面時聚焦第一個可操作元件；遊戲開始與換題後聚焦第一個可作答選項。
- 開始對話框限制焦點範圍；重玩連結與第一個答案提供題目或結果的無障礙描述。
- 答對／答錯同時提供文字、符號與傷害倍率，並透過狀態訊息播報；計時器不會每秒播報。
- 回饋期間及已選過的答案會阻擋重複輸入；屬性色文字對比至少為 4.5:1。

預覽與實際遊戲截圖見[介紹頁紀錄](docs/landing-page/README.md)及[像素介面紀錄](docs/ui-refresh/README.md)。
瀏覽器自動測試不等同完整無障礙稽核；尚未完成實機安裝或人工螢幕閱讀器驗證。

## 本機開發

使用 Node.js 24.19.0（見 [.nvmrc](.nvmrc)）及 pnpm 11.22.0（見 [package.json](package.json)）。
專案限定 Node 24，CI 使用相同版本；依賴鎖定檔為 `pnpm-lock.yaml`。

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

開啟 http://localhost:5173/type_instructor/ 。`pnpm start` 也會啟動開發伺服器。
套件來源與發佈時間政策分別設定於 [.npmrc](.npmrc) 及 [pnpm-workspace.yaml](pnpm-workspace.yaml)。

### 程式碼格式

使用 Prettier 統一格式，保留 ESLint 檢查程式錯誤與 React Hooks。
Tailwind 官方外掛會依 `src/index.css` 的主題與斷點排序 class，
包含 `className` 與 `cn`、`clsx`、`cva` 呼叫中的類別。

```sh
pnpm format        # 整理格式
pnpm format:check  # 只檢查，不修改
```

安裝依賴時會設定 pre-commit hook（提交前檢查）。執行 `git commit` 時，
`lint-staged` 會先對暫存的 JS／TS 執行 `eslint --fix`，再用 Prettier 整理格式，
最後重跑 ESLint 確認結果。其他支援的檔案只執行 Prettier。
工具能修正的內容會自動加入這次提交；仍有錯誤時會阻擋提交，請修正後重試。
只暫存部分修改時，工具會保留未暫存的內容，不會一起提交。
可用 `pnpm lint:staged` 手動執行相同流程，或用 `pnpm lint:fix` 修正整個專案。

CI 仍會檢查完整專案；VS Code 安裝 Prettier 擴充套件後，儲存檔案會自動整理。
產生檔、鎖定檔、歷史 OpenSpec 歸檔、第三方測試資料與圖片／字型不參與格式整理。
完整範圍見 [.prettierignore](.prettierignore)。

### 技術與程式結構

React 19、Vite 8、React Router、Zustand 與 Tailwind CSS 4。元件樣式使用 Tailwind；全域 CSS 僅保留主題、字型、共用斷點與基礎規則。
核心邏輯、store、hook 和共用 UI 使用 TypeScript；既有頁面包含 JSX。
Button／Dialog 採用 shadcn/ui 的 Radix 版本原始碼，MIT 授權見 [UI 授權](src/components/ui/LICENSE.md)。

- [analytics.js](src/lib/analytics.js)：正式站 GA4 初始化、完整路由的頁面瀏覽紀錄與連續重複過濾。
- [gameRules.ts](src/lib/gameRules.ts)：集中定義競速目標 20 分，供遊戲邏輯與三語目標說明共用。
- [getQuiz.ts](src/lib/getQuiz.ts)：傷害矩陣、唯一最佳答案、每場獨立的 18 屬性題袋及防禦免疫／抗性輪替。
- [quiz.ts](src/stores/quiz.ts)：每場遊戲建立獨立狀態，管理開始、作答、計分、回饋與結束。
- [useGame.ts](src/hooks/useGame.ts)：管理計時器並在離開時清理；重玩或更換遊戲路徑會建立新場次。
- [src/lang](src/lang)：三語遊戲與介紹頁文案。語言、模式沿用 URL，不持久保存遊戲場次或紀錄。
- [src/fonts](src/fonts)：本機字型與 Cubic 11 來源／授權紀錄。

路由使用 hash，例如 `#/zh/menu`、`#/zh/about`，相容 GitHub Pages 靜態託管。
未知語系使用英文；遊戲路由只接受單屬性 `s`、`basic`／`speedrun`、`attack`／`defend`。
錯誤遊戲參數會回到目錄；結果需為安全整數，競速秒數不可為負；未匹配路徑回英文首頁。

### 建置、預覽與截圖

```sh
pnpm build
pnpm preview
```

正式輸出位於 `dist/`，預覽位址為 http://localhost:4173/type_instructor/ 。
Vite 的 base 固定為 `/type_instructor/`；字型、圖示、manifest 與離線資源皆使用此子路徑。
正式建置由 Workbox 產生 `service-worker.js`，並預先快取本機資源。

`pnpm screenshots:landing` 會建置遊戲，使用 Chromium 重拍三語的選單、攻擊與防禦題，及結果頁三個按鈕，共十二張實際截圖。
圖片直接擷取遊戲，來源紀錄位於 `src/images/landing/capture.json`。
重拍前需安裝 Playwright Chromium；操作方式見[截圖更新說明](docs/landing-page/README.md)。

## 測試

| 指令                          | 用途                                                 |
| ----------------------------- | ---------------------------------------------------- |
| `pnpm format:check`           | 檢查程式碼、設定與文件格式                           |
| `pnpm lint`                   | 檢查 JavaScript／TypeScript 與 React Hooks，禁止警告 |
| `pnpm typecheck`              | 執行 strict TypeScript 檢查；既有 JS 頁面逐步遷移    |
| `pnpm test`／`pnpm test:unit` | Vitest 單次執行，31 個案例                           |
| `pnpm test:unit:watch`        | 開發時持續執行單元測試                               |
| `pnpm test:e2e`               | 四種瀏覽器設定的 84 個玩家流程案例                   |
| `pnpm test:e2e:smoke`         | Chromium 的 7 個關鍵流程，篩選 `@smoke`              |
| `pnpm test:a11y`              | 四種瀏覽器設定的 24 個鍵盤／焦點案例，篩選 `@a11y`   |

單元測試放在原始碼旁（`src/**/*.test.ts`），使用 Node 環境，涵蓋題袋覆蓋與跨輪防重複、
防禦輪替、傷害倍率、計分、19／20 分邊界、場次隔離、原始錯題保存、練習佇列及路由驗證。Playwright 僅收集 `tests/e2e/**/*.spec.js`，涵蓋完整頁面、
開始與作答、完成與重玩、離開確認、三語切換、最高紀錄、鍵盤／觸控焦點、介紹頁進入遊戲及離線版本更新。

E2E 以玩家流程為範圍：繁中跑一般／競速與攻擊／防禦的完整流程，英文與日文保留開始、作答與離開的短流程。
不再執行逐像素布局、字型度量、完整 axe 掃描、GA4 接線或題袋全量排列等 E2E；
題袋、傷害、計分與路由規則仍由既有單元測試驗證。這會減少外觀與跨語系無障礙掃描的自動保障，
不代表這些介面要求已取消，也不代表已通過完整無障礙稽核。

```sh
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

完整矩陣包含桌面 Chromium、Firefox、WebKit，以及 iPhone 13 尺寸的 WebKit 模擬。
測試自行啟停伺服器，預設使用正式建置與預覽；手機模擬不代表 iOS 或 Android 實機驗證。

快速開發可先安裝 Chromium，執行 `pnpm test:e2e:smoke`。
`E2E_SERVER=dev pnpm test:e2e:smoke` 使用開發伺服器；開發模式會跳過正式版專用的離線案例。
已安裝 Google Chrome 時，可加 `PLAYWRIGHT_CHANNEL=chrome` 使用該瀏覽器執行 Chromium project。

### CI 共用檢查與瀏覽器測試平行執行

`checks` 集中執行一次格式檢查、lint、型別檢查與單元測試。
另外兩組 `build` 工作分別執行 Playwright 分片，目前各 42 個案例。
三組工作平行開始，全部通過才允許部署；只有第一個瀏覽器分片上傳 Pages 產物。
本機 `pnpm test:e2e` 仍執行完整 84 個案例。

```sh
pnpm test:e2e --shard=1/2
pnpm test:e2e --shard=2/2
```

以上指令可單獨重跑分片；本機共用預覽連接埠，請依序執行。
完整矩陣已包含 smoke 與 a11y，CI 不另外重跑這兩個子集合。

## GitHub Pages 部署

[Pages workflow](.github/workflows/pages.yml) 使用固定 Node／pnpm 版本與 `--frozen-lockfile` 安裝。

- 對 `main` 的 PR：驗證但不部署。
- 推送至 `main`，或在 `main` 手動執行 workflow：共用檢查與兩組瀏覽器測試皆成功後部署 `dist/`。
- 在其他分支手動執行 workflow：驗證但不部署。

新環境或 fork 請先到 GitHub Settings → Pages → Build and deployment，將 Source 設為 **GitHub Actions**。
部署使用官方 Pages 產物及 OIDC，發布至 `github-pages` 環境，同時間只允許一個部署執行。
`github-pages` 環境的允許部署分支也必須設為 `main`；變更預設分支時，需同步調整 workflow 與這條環境規則。
可從 Actions 的「Validate and deploy Pages」查看結果。

## 規格與歷史紀錄

目前行為以 [OpenSpec 規格](openspec/specs/)為準；開發與驗證紀錄保留於 [OpenSpec 歸檔](openspec/changes/archive/)。
[Baseline](openspec/baseline.md) 記錄遷移前狀態；Vite／React、Zustand、競速規則、離線部署及驗收的六步遷移已完成。

- [UI 元件與無障礙遷移](docs/ui-migration.md)
- [像素介面更新與預覽](docs/ui-refresh/README.md)
- [三語介紹頁、PWA 教學、截圖與驗證紀錄](docs/landing-page/README.md)
