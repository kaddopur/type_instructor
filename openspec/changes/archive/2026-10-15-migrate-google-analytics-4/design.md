# 設計

沿用現有頁面語言效果，在 document.title 設定後執行。小型輔助函式只在 kaddopur.github.io 的正式建置延後初始化 dataLayer／gtag 與非同步 Google 腳本。

手動排入 page_view 事件，帶入完整 page_location（含 hash）、目前 page_title，以及前一個追蹤網址作為 page_referrer；首次則用 document.referrer。連續相同網址只記一次，避免 React StrictMode 重複，但離開再返回仍記一次。

設定 send_page_view:false。網站管理者也必須在 GA4 資料串流的「加強型評估」停用根據瀏覽紀錄變更的網頁瀏覽，避免重複收集。玩法不得等待外部腳本或依賴分析成功。建置只快取本機資源，Google 腳本仍由外部載入。

參考資料：

- https://developers.google.com/tag-platform/gtagjs
- https://developers.google.com/analytics/devguides/collection/ga4/views
