# 完成遷移驗收與發布

## Why

第 1 至 5 步已實作並封存。使用者要求完成第 6 步與剩餘發布工作，包括完整驗收、封存與提交、遠端檢查及發布。

## What Changes

- 驗證三種語言與四種遊戲模式的完整結算及重玩。
- 涵蓋桌面 Chromium、Firefox、WebKit、手機 WebKit 模擬，以及版面、回饋／計時邊界、瀏覽器導覽、離線使用與背景快取程式更新。
- 修正實際重現的退化問題，不新增玩法。
- 將可重複執行的驗收測試加入 CI，補齊基準證據與清單。
- 封存並提交、推送分支、驗證 PR、合併、部署，再驗證 Pages。

## Capabilities

### New Capabilities

- `migration-acceptance`：可重複執行的行為與版面檢查，並明確列出瀏覽器驗證限制。

### Modified Capabilities

無。只有在驗收發現行為缺陷、需要更新規格時才調整。

## Impact

影響驗收測試與設定、CI、最終文件，以及有證據支持的相容性修正。發布沿用只允許 master 的 Pages 工作流程。已唯讀確認遠端 Pages 來源為 workflow，目前不用更動設定。
