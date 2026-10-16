# 建立遷移基準

## Why

遷移 2016 年的 React 應用程式前，先記錄既有行為與驗證範圍，作為工具更新時的回歸檢查依據。

## What Changes

- 初始化 OpenSpec，記錄玩法、導覽與語言基準。
- 將錯誤的競速防禦連結及 3／20 分目標不一致列為後續修正，不把錯誤當成正確行為保留。
- 以 Node 測試既有出題函式、計分 reducer 與傷害回饋，附上執行方式與待做的瀏覽器檢查。

## Capabilities

### New Capabilities

- `gameplay`：既有單屬性題目、計分、回饋與遊戲模式。
- `navigation-and-language`：既有 hash 路由與三語導覽。

### Modified Capabilities

無。建立這份完成紀錄前，已直接將基準規格寫入 `openspec/specs`。封存時使用 `--skip-specs`，保留那些規格。

## Impact

只改動文件、測試與一個套件指令，不改執行時原始碼及相依版本。React／瀏覽器行為與正式建置，留待後續遷移步驟驗證。
