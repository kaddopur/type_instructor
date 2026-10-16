## MODIFIED Requirements

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
