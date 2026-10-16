## ADDED Requirements

### Requirement: 與原始碼並存的單元測試

單元測試 SHALL 在 Node 環境使用 Vitest，檔名為 src/**/*.test.ts，放在原始碼旁，排除瀏覽器測試。pnpm test 與 pnpm test:unit SHALL 執行單元測試；pnpm test:unit:watch SHALL 提供監看模式。

#### Scenario: 執行單元檢查

- **WHEN** 執行 pnpm test:unit
- **THEN** 不啟動瀏覽器，執行出題、傷害狀態、路由與遊戲狀態測試

### Requirement: 統一瀏覽器測試

瀏覽器測試 SHALL 放在 tests/e2e，使用同一份 Playwright 設定。完整測試 SHALL 涵蓋桌面 Chromium、Firefox、WebKit 與手機 WebKit 模擬。標籤 SHALL 支援選取冒煙、玩法、無障礙與離線測試。

#### Scenario: 完整瀏覽器驗收

- **WHEN** 執行 pnpm test:e2e
- **THEN** 所有瀏覽器測試環境都對 /type_instructor/ 下的正式建置執行測試

#### Scenario: 開發環境冒煙檢查

- **WHEN** 執行 E2E_SERVER=dev pnpm test:e2e:smoke
- **THEN** 只在開發伺服器執行 Chromium 冒煙案例

### Requirement: CI 使用共用測試指令

Pages 工作流程 SHALL 使用與本機驗證相同的指令，執行單元測試與一輪完整瀏覽器測試。通過後才可進入既有部署流程。

#### Scenario: CI 驗證

- **WHEN** Pages 工作流程驗證某個版本
- **THEN** lint、型別檢查、單元測試與完整瀏覽器測試都必須通過
- **AND** 部署仍限於既有 master 發布流程
