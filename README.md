# Type Instructor of Pokémon

單屬性攻防記憶遊戲，支援英文、繁體中文與日文，以及一般／競速模式。
保留原本的像素介面，目前正在分階段更新技術環境。

## 開發

使用 Node.js 22.23.2（見 `.nvmrc`）；Router 要求至少 22.22，專案限定 Node 22。
專案的 `.npmrc` 使用公開 npm registry。

```sh
nvm use
npm ci
npm run dev
```

開啟 http://localhost:5173/type_instructor/ 。`npm start` 也會啟動 Vite。
使用 hash URL，例如 `#/zh/menu`，以相容 GitHub Pages 的靜態託管。

## 建置與預覽

```sh
npm run build
npm run preview
```

正式輸出位於 `dist/`，預覽位址為 http://localhost:4173/type_instructor/ 。
Vite 的 base 設為 `/type_instructor/`，字型、圖示與 manifest 均使用此路徑。
目前仍沿用 sw-precache 產生離線 service worker，僅在正式建置註冊；
完整的離線工具替換、舊快取更新與 GitHub Actions 部署留待第 5 步。

舊的 `npm run deploy` 指令已移除；它會改寫 Git 歷史，且依賴舊的 `build/` 輸出。
目前尚未提供新的自動部署指令。

## 測試

出題、計分與效果提示的 7 個 baseline 測試：

```sh
npm test
```

`npm run test:baseline` 執行相同測試。測試直接使用專案相依套件與原始碼。

瀏覽器 smoke tests 涵蓋三語導頁、一般模式攻防、作答回饋、結果重玩、
倒數結束、桌面／手機視窗、Pages 子路徑資源、service worker 註冊與首次離線重新整理：

```sh
npx playwright install chromium
npm run test:smoke
SMOKE_SERVER=dev npm run test:smoke
```

第一個指令組測試正式 build／preview；第二個測試開發伺服器。
若本機已安裝 Google Chrome，可在測試指令前加 `PLAYWRIGHT_CHANNEL=chrome`，
使用該瀏覽器而不另行下載 Chromium。測試會自行啟動與停止伺服器。

## 遷移進度

- 第 1 步：現有系統 baseline 與邏輯測試已完成並歸檔。
- 第 2 步：Vite、React 19 與必要的 Router／Redux bindings 相容性更新。
- 第 3 步：移除 Redux，改用 Zustand 與遊戲 hook。
- 第 4 步：修正競速防禦錯誤連結，以及競速目標 3／20 分不一致。
- 第 5 步：更新離線工具與 Pages 部署。
- 第 6 步：完整驗收。

目前兩個已知競速問題仍待第 4 步處理。Redux 的遊戲狀態仍保留至第 3 步。
舊離線工具的一個間接依賴使用相容的 trim-newlines 3.x override 修補，
之後替換 sw-precache 時一併移除。

玩法、已知問題與完整驗收清單見 [OpenSpec baseline](openspec/baseline.md)。
本次變更與驗證紀錄見 [Vite／React migration](openspec/changes/archive/2026-10-15-migrate-vite-react/)。
