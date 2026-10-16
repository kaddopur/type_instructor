## ADDED Requirements

### Requirement: 經驗證的 Pages 成品

GitHub Actions SHALL 安裝固定版本的 pnpm，使用凍結鎖定檔與宣告的 Node 版本。發布 dist 前 SHALL 通過邏輯與正式建置瀏覽器檢查。

#### Scenario: PR 驗證

- **WHEN** PR 的目標分支為 master
- **THEN** 執行安裝、測試與正式建置，不部署

### Requirement: 僅 master 可部署

只有成功的 master 建置 SHALL 可使用官方 Pages 成品與 OIDC 身分憑證部署。工作流程 SHALL 支援手動執行，並防止部署重疊。

#### Scenario: master 發布

- **WHEN** master 推送或在 master 手動執行且通過驗證
- **THEN** 將 dist 成品部署到 github-pages 環境

#### Scenario: 其他分支手動驗證

- **WHEN** 在其他分支手動執行工作流程
- **THEN** 驗證該分支，不發布
