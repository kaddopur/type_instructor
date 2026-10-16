# 開發與建置規格

## Purpose

記錄可重現的 pnpm 安裝與 Vite 開發、建置及預覽指令。規格也定義 React 掛載、路由相容性，以及 Pages 基底路徑下的正式資源載入要求。

## Requirements

### Requirement: 可重現的安裝

專案 SHALL 宣告支援的 Node 版本及固定的 pnpm 版本，使用公開 npm 套件來源，並提交 pnpm 鎖定檔。pnpm install --frozen-lockfile SHALL 能安裝經測試的相依套件，不需覆寫 peer 相依要求。

#### Scenario: 乾淨安裝

- **WHEN** 開發者用宣告的 Node／pnpm 版本執行 pnpm install --frozen-lockfile
- **THEN** 相依套件安裝成功，不需 force 或 legacy-peer-deps 覆寫

### Requirement: Vite 指令

專案 SHALL 提供 dev 與 start 指令供 Vite 開發；build 在 dist 產生 Vite 輸出與 Workbox；preview 預覽正式建置；test 執行邏輯檢查。

#### Scenario: 正式建置

- **WHEN** pnpm build 完成
- **THEN** dist 包含應用程式、靜態資源、manifest，以及位於 service-worker.js 的 Workbox 背景快取程式

### Requirement: React 與路由相容性

應用程式 SHALL 使用 createRoot、相容的狀態綁定及 hash 路由掛載，保留既有語言前綴路徑與玩法基準。

#### Scenario: 本機導覽

- **WHEN** 開發者啟動伺服器並開啟 /type_instructor/
- **THEN** 首頁正常顯示，可前往選單及遊戲，不發生執行時錯誤

### Requirement: 基底路徑下的資源

建置 SHALL 在 /type_instructor/ 下解析應用程式資源與正式背景快取程式註冊位置；開發環境 SHALL 不註冊正式背景快取程式。

#### Scenario: 預覽 Pages 路徑

- **WHEN** 在 /type_instructor/ 預覽正式建置
- **THEN** 腳本、樣式、字型、圖示、manifest 與背景快取程式都可成功取得
