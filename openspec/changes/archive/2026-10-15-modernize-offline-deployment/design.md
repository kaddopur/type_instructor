# 設計

Vite 完成後直接使用 workbox-build 的 generateSW。應用程式已有 manifest 與原生註冊方式，不需 PWA 介面框架或用戶端函式庫。產生內嵌 Workbox 執行程式，預先快取本機 HTML、JS、CSS、字型、圖片與 manifest。背景快取程式範圍內的導覽以 index.html 作為備援。

保留 service-worker.js 與 /type_instructor/ 範圍。skipWaiting 與 clientsClaim 可接替舊背景快取程式，不需關閉全部舊分頁。不加入 controllerchange 重新載入處理；已載入的遊戲程式持續執行，直到玩家重新載入。註冊使用 updateViaCache=none。遊戲沒有需要在中途延後下載的程式區塊。

匯入的啟用輔助程式，只刪除在 origin/gh-pages 觀察到的確切舊快取名稱：sw-precache-v2-sw-precache- 加上 registration.scope。Workbox 自行清理其預快取中的過期項目。

停用 cleanupOutdatedCaches，因為它用快取名稱子字串比對，也可能誤中巢狀範圍。不清空所有快取，也不取消背景快取程式註冊。

安裝失敗時，必須保留原本啟用的背景快取程式與快取。

沿用使用者的 pnpm-workspace.yaml，重新產生 pnpm-lock.yaml。packageManager 固定 pnpm 11.22.0，保留 Node .nvmrc。移除 npm 鎖定檔，避免維護兩份不同的相依關係；現行指令改用 pnpm。

工作流程對目標為 master 的 PR 及 master 的推送，驗證鎖定安裝、邏輯、正式建置瀏覽器測試與建置。只有 master 可部署，使用 Pages 成品與 OIDC 身分驗證部署工作。支援手動執行；儲存庫 Pages 來源必須設為 GitHub Actions。正式發布仍需之後推送或合併。

本機 HTTP 測試伺服器先提供實際封存的舊背景快取引擎與精簡資源清單，再依序提供目前真實建置、產生的第二版 Workbox 建置，以及刻意失敗的建置。瀏覽器測試驗證成功接替、快取隔離、離線遊玩、安裝失敗復原，以及遊玩中不強制重新載入。
