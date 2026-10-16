# 更新離線快取與 Pages 部署

## Why

建置仍使用已棄用的 sw-precache 與相容程式；自動部署在 Vite 遷移時移除。既有使用者需要更新舊背景快取程式及快取，且不能中斷正在玩的遊戲。

## What Changes

- 在既有 service-worker.js 網址以 Workbox 產生正式背景快取程式。
- 預先快取本機遊戲資源，保留 hash 路由離線存取；成功啟用後，只刪除此程式確切範圍內已知的舊快取。
- 啟用已安裝更新，不自動重新載入正在玩的遊戲；下次重新載入才用新版。更新檢查略過 HTTP 腳本快取。
- 移除 sw-precache、其相依覆寫與舊快取相容程式。
- 採用使用者已暫存的 pnpm 設定，固定版本，CI 使用凍結鎖定檔安裝。
- 新增 master 專用的驗證後 Pages 部署流程，並支援 PR 驗證與手動執行。

## Capabilities

### New Capabilities

- `offline-updates`：按範圍隔離的離線快取，以及舊版／現行背景快取程式更新。
- `pages-deployment`：通過驗證的 pnpm 建置，透過 GitHub Pages 成品部署。

### Modified Capabilities

- `development-build`：以 pnpm 可重現安裝與 Workbox 產生流程取代 npm／sw-precache。

## Impact

影響建置腳本、背景快取清理輔助程式、註冊選項、套件管理檔案、Playwright 整合測試、Pages 工作流程及操作說明。不包含線上部署、推送、儲存庫設定變更或玩法修改。
