# 修正競速規則

## Why

BUG-01 使競速防禦選單入口導向攻擊模式。BUG-02 使競速在 3 分結束，但各語言都寫明目標是 20 分。

## What Changes

- 將競速防禦入口導向 speedrun/defend。
- 設定共用的 20 分競速目標，供狀態儲存區與各語言說明使用。
- 將翻譯中的固定數字改成 scoreTarget 佔位符。
- 驗證各語言的兩個競速入口與 19／20 分邊界。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `gameplay`：競速在 20 分結束，說明使用共用目標。
- `navigation-and-language`：兩個競速入口都選到正確題型。

## Impact

影響一個規則常數、遊戲說明、三個翻譯值、一個選單網址、回歸測試與文件。不改相依套件與離線工具。
