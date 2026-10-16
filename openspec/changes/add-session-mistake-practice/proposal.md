# 本場錯題練習

## Why

玩家需要在挑戰結束後，慢慢重練本場答錯的原題。

## What Changes

- 結果頁有錯題時顯示練習入口，保留原題與選項順序。
- 練習不計分、不計時。答錯移到隊尾，答對移除，直到全部答對。
- 關閉練習會清除進度，重開從本場錯題重新開始。
- 新挑戰、重新載入或直接開啟結果網址，不得帶出舊錯題。

## Capabilities

### Added Capabilities

- session-mistake-practice：本場錯題練習。

### Modified Capabilities

- gameplay：保存本場首次答錯的原題。

## Impact

修改挑戰狀態、結果頁、共用題目面板與中英日翻譯。不新增套件、路由或持久儲存。
