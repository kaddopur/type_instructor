# 第 5 步驗證

日期：2026-10-15。本機環境：macOS、Node 22.23.2、pnpm 11.22.0，以及由 Playwright 1.64.1 操作的 Google Chrome。Workbox 建置版本：7.4.1。

## 結果

建置現使用 Workbox 產生 service-worker.js，內嵌執行程式並預先快取 11 個本機資源。舊網址與 /type_instructor/ 範圍保留。sw-precache、其 trim-newlines 覆寫與 cache-polyfill.js 已移除。

保留使用者已暫存的 pnpm 工作區設定。packageManager 固定 pnpm 11.22.0；已更新 pnpm-lock.yaml，移除 package-lock.json。腳本、Playwright 伺服器指令、現行文件與 CI 都改用 pnpm。

| 檢查           | 證據                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| 乾淨安裝       | 移除產生的 node_modules 後，`pnpm install --frozen-lockfile` 通過，未使用 force 或 peer 相依覆寫       |
| 邏輯測試       | `pnpm test`：12 個通過                                                                                 |
| 正式建置       | `pnpm build`：Vite 輸出與 Workbox 產生流程通過                                                         |
| 正式瀏覽器測試 | `PLAYWRIGHT_CHANNEL=chrome pnpm test:smoke`：7 個通過                                                  |
| 開發瀏覽器測試 | `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev pnpm test:smoke`：6 個通過，依設計略過背景快取程式更新測試 |
| 套件稽核       | `pnpm audit --audit-level=high`：沒有已知弱點                                                          |
| 工作流程驗證   | actionlint v1.7.12 對 .github/workflows/pages.yml 檢查通過；未啟用選用的 shellcheck 整合               |
| OpenSpec／空白 | 嚴格驗證與 git diff --check 通過                                                                       |

## 背景快取程式更新證據

測試資料 tests/fixtures/legacy-service-worker.js 保留 gh-pages 提交 fbecea9e343cf177c4a4641dd8e5f74c5fa3d47e 產生的背景快取引擎，只將預快取清單縮減為 index.html 測試頁。真實本機 HTTP 伺服器在同一背景快取網址與範圍下，依序提供各版建置；Playwright 不模擬其生命週期。

正式建置測試驗證以下項目：

1. 封存的背景快取程式可安裝、控制舊版頁面並儲存快取。
2. 產生的 Workbox 建置若引用刻意移除的預快取資源，就會安裝失敗；舊版仍啟用，舊頁面仍可離線開啟。
3. 目前真實背景快取程式啟用後，只刪除確切舊快取；目前頁面保持開啟，明確重新載入後才顯示新版。
4. 新應用程式可離線重新載入、前往中文防禦模式並作答。
5. 第二版 Workbox 修改 index.html 版本，遊戲開啟時啟用，不改網址或分數；明確重新載入後使用新版，新版也能離線重新載入。
6. 根層其他應用與巢狀應用的快取名稱及內容，在兩次更新後都保留；不新增重複註冊。

刻意停用 Workbox cleanupOutdatedCaches，因為其子字串比對也包含巢狀範圍。Workbox 啟用時仍會移除自己預快取中的過期項目。舊快取清理輔助程式只刪除封存建置觀察到的確切名稱 sw-precache-v2-sw-precache-<registration.scope>。

## Pages 工作流程與當時遠端狀態

工作流程驗證目標為 master 的 PR、master 推送與手動執行。依 .nvmrc 安裝 Node，安裝固定版本 pnpm，使用凍結鎖定檔，執行邏輯與正式瀏覽器檢查。只有 master 部署會上傳 dist。獨立的 OIDC 部署工作使用 github-pages 環境，依序部署，避免重疊。其他分支的手動執行不能發布。Actions 固定至提交 SHA。

唯讀執行 `gh api repos/kaddopur/type_instructor/pages`，回傳 build_type 為 legacy、來源分支 gh-pages、路徑 /、網址 https://kaddopur.github.io/type_instructor/。未改儲存庫設定。

使用工作流程發布前，須將審閱後的變更合併至 master，將 Settings → Pages → Source 改為 GitHub Actions，再於 master 執行。操作方式見 README。

## 限制與交接

本機 Chrome 與真實 HTTP 測試資料可驗證背景快取行為，但未涵蓋完整封存的 2016 年前端或既有使用者瀏覽器設定檔。未執行 Linux GitHub Actions、線上部署或廣泛跨瀏覽器驗收；完整驗收仍屬第 6 步。Workbox 安裝的 glob 相依有棄用提示，但目前套件稽核沒有已知弱點。

實作驗證早於使用者之後提出的封存與提交要求。本變更封存為 2026-10-15-modernize-offline-deployment，未推送、部署或修改 Pages 設定。
