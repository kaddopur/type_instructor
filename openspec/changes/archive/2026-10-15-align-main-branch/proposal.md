# 將部署對齊 main 預設分支

## Why

儲存庫預設分支已改為 main，但 Pages 工作流程仍指向 master，github-pages 環境也只允許 master 部署。

## What Changes

- 對 main 觸發推送／PR 驗證；兩批驗證都成功後，只允許 main 上傳成品與部署。
- 將現有環境分支政策從 master 改名為 main。
- 更新現行說明與規格，保留歷史封存紀錄及第三方原始碼網址。

## Capabilities

### Modified Capabilities

- pages-deployment：只允許 main 發布。
- migration-acceptance：main 的發布驗收。
- test-workflows：main 發布前的共用檢查。

## Impact

影響 GitHub Actions、部署環境政策、README、現行介面遷移說明與 OpenSpec。不改應用行為或相依套件。
