# 更新介面與測試流程

## 紀錄狀態

這份紀錄補寫使用者已要求且已完成的實作，範圍為 `feat/tailwind-shadcn-a11y` 上的 `8f22d2b` 至 `526cd42`。紀錄寫於本機驗證後，不代表實作前已核准提案。此封存不包含發布與遠端 CI。

## Why

既有遊戲需要可重用的無障礙控制元件與一致的鍵盤焦點，讓玩家能操作開始對話框並取得各語言回饋。測試也需要明確分開快速單元測試與瀏覽器驗收，讓本機及 CI 能使用一致指令。

## What Changes

- 將頁面樣式改用 Tailwind 與像素風格的 shadcn／Radix 控制元件。
- 加入無障礙開始對話框、三語回饋與第一個操作項目的焦點。
- 將邏輯測試移至原始碼旁，以 Vitest 執行。
- 將瀏覽器測試整併到 tests/e2e，共用一份 Playwright 設定。
- 以標籤選取測試，在既有 Pages 工作流程執行一輪完整瀏覽器測試。

## Capabilities

### New Capabilities

- `accessible-interface`：鍵盤焦點、模態對話框行為、回饋與對比。
- `test-workflows`：單元／瀏覽器測試分工、瀏覽器組合與 CI 指令。

### Modified Capabilities

無。既有玩法與 Pages 發布要求繼續適用。

## Impact

影響介面元件、樣式、測試工具、套件相依、文件與 CI。繼續支援 hash 路由與 /type_instructor/ 部署基底路徑。
