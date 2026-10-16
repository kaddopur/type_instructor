# 更新像素介面

## Why

使用者選定第一款介面概念，要求分八步實作，每步一次提交。保留像素字型、黃藍重點與屬性配色，同時讓各語言的導覽、視覺層級與回饋一致。

## What Changes

1. 共用配色、字型與主要／次要控制元件。
2. 首頁標題、本機像素裝飾與操作分組。
3. 模式卡片、說明與成對的攻防按鈕。
4. 語言選擇勾選標記與淡黃選取狀態。
5. 緊湊開始對話框、模式標籤與等寬按鈕。
6. 答題頁層級、固定回饋、答案符號與 20 分進度。
7. 結果重點與清楚的重玩／導覽層級。
8. 瀏覽器、版面、無障礙與離線驗證，文件及封存。使用者也要求相配的網站圖示，需更新瀏覽器、Apple 與 PWA 圖示。

## Capabilities

### New Capabilities

- refreshed-interface：一致的像素介面與各模式進度顯示。

### Modified Capabilities

無。 Existing gameplay, safe-area and locale-layout guarantees remain in force.

## Impact

影響頁面元件、共用控制元件、CSS 主題變數、三份翻譯與瀏覽器檢查。不新增執行時相依套件，也不改遊戲規則。發布證據須與本機結果分開記錄。
