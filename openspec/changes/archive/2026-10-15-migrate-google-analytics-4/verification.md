# 驗證紀錄

日期：2026-10-15。環境：Node 24.19.0、pnpm 11.22.0。

- `pnpm test:unit`：6 個檔案共 23 個測試通過。
- `pnpm typecheck`：通過。
- `pnpm lint`：通過，沒有警告。
- `pnpm exec playwright test --workers=4`：Chromium、Firefox、桌面 WebKit 與手機 WebKit 共 160 個通過，耗時 1.6 分鐘。啟動時正式建置與本機背景快取程式產生均成功。
- 瀏覽器測試清單確認 CI 每批各 80 個案例。
- `openspec validate migrate-google-analytics-4 --strict`：封存前通過。
- `git diff --check`：通過。

單元測試檢查初始化、停用自動首次瀏覽事件、完整 hash 網址、目前標題、來源網址、避免重複、返回頁面、Google 腳本未載入時仍可排入事件，以及開發／本機預覽不啟用分析。瀏覽器測試以正式主機名稱提供本機建置，攔截並封鎖 Google 腳本，檢查首頁／選單／遊戲／返回的瀏覽事件，也確認本機預覽不載入分析、沒有 UA 片段。

測試不向 Google 傳送分析流量。既有玩法、無障礙、語言、版面與離線回歸測試通過。

程式使用 Google 文件中的手動網頁瀏覽 API。網站管理者仍需在 GA4 資料串流停用根據瀏覽紀錄收集的瀏覽事件、部署變更，並在 Realtime／DebugView 確認收到事件。帳戶與部署檢查仍待完成；本機測試只證明整合行為，不證明 GA 伺服器已收到資料。

## 後續調整：Type Instructor 專用串流

使用者建立專用串流並提供 G-6H3DMT5TLL。程式、測試、README 與規格現均使用這個 ID。使用者也展示 GA4 中根據瀏覽紀錄收集網頁瀏覽的核取方塊已取消。更新 ID 後的結果如下：

- `pnpm test:unit`：23 個通過。
- `pnpm typecheck` 與 `pnpm lint`：通過。
- `pnpm exec playwright test tests/e2e/analytics.spec.js --workers=4`：四個測試環境共 8 個通過，包含重新正式建置。

先前 160 個案例的完整測試早於這次只更換 ID 的更新。部署與伺服器收件確認仍待完成。
