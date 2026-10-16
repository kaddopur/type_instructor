## MODIFIED Requirements

### Requirement: CI 使用共用測試指令

Pages 工作流程 SHALL 使用與本機驗證相同的指令，執行單元測試與一輪完整瀏覽器測試。通過後才可進入既有部署流程。

#### Scenario: CI 驗證

- **WHEN** Pages 工作流程驗證某個版本
- **THEN** lint、型別檢查、單元測試與完整瀏覽器測試都必須通過
- **AND** 部署仍限於既有 main 發布流程

#### Scenario: CI 並行分批

- **WHEN** Pages 工作流程執行完整瀏覽器測試
- **THEN** 兩個矩陣工作並行執行 Playwright 第 1/2 與 2/2 批
- **AND** 合計涵蓋每個瀏覽器案例，沒有遺漏或重複
- **AND** 任一批失敗就阻止部署，另一批仍執行至完成
