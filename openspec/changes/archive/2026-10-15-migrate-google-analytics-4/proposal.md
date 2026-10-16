# 以 GA4 取代已停用的分析工具

## Why

網站仍載入 UA-6593436-4 的 analytics.js。使用者提供 GA4 評估 ID G-6H3DMT5TLL，以恢復資料收集。

## What Changes

- 用 Google 追蹤標籤取代 UA，只在正式 Pages 主機初始化一次。
- 各語言頁面標題更新後，手動傳送網頁瀏覽事件，包含 hash 路由。
- 排除開發環境與本機預覽；標籤遭封鎖時仍將事件排入佇列。
- 記錄必要的 GA4 瀏覽紀錄評估設定與驗證步驟。

## Capabilities

### New Capabilities

- site-analytics：正式環境的 GA4 網頁瀏覽事件。

## Impact

影響 HTML、共用語系頁面效果、分析輔助函式、測試與 README。不改相依套件、玩法、GA 帳戶，也不加入自訂遊戲事件。
