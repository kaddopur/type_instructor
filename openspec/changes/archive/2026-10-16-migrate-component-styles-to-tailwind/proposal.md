# 完成 Tailwind 元件樣式遷移

## Why

頁面版面與共用控制元件仍依賴兩份元件樣式表。重複選擇器與未分層覆寫讓 Tailwind 類別的效果難以判斷，也可能改變已驗證的多語介面。

## What Changes

- 將所有元件版面、字型、響應式、狀態與偽元素樣式，移入所屬 React 元件的 Tailwind 工具類別。
- index.css 只保留框架匯入、主題變數、字型宣告、共用響應式變體與全文件基礎規則。
- 移除 Landing.css，整併重複頁面版面類別。
- 保留目前像素尺寸、斷點、外觀、焦點行為、玩法、截圖、支援語言與離線資源。
- 與目前建置比對計算樣式及元素尺寸位置，再執行既有瀏覽器與單元測試。

## Capabilities

### Modified Capabilities

- refreshed-interface：完成以 Tailwind 管理元件樣式。

## Impact

影響 AppShell、Home、Menu、Lang、Quiz、Result、Landing 與共用 Dialog 樣式。不改相依套件、翻譯、規則、路由或儲存。
