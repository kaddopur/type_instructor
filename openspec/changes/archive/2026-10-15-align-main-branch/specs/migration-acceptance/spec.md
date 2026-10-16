## MODIFIED Requirements

### Requirement: 發布證據

發布 SHALL 在本機與遠端驗證通過後執行，並記錄部署版本及線上驗證。報告 SHALL 列出未執行的測試。

#### Scenario: Pages 發布

- **WHEN** 通過檢查的遷移 PR 合併至 main
- **THEN** Pages 工作流程完成部署，已發布遊戲的資源與玩法檢查通過
