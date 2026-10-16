# Pages 部署規格

## Purpose

定義經驗證後透過 GitHub Actions 發布的流程，只允許 main 部署到 GitHub Pages。

## Requirements

### Requirement: 經驗證的 Pages 成品

GitHub Actions SHALL 安裝固定版本的 pnpm，使用凍結鎖定檔與宣告的 Node 版本。發布 dist 前 SHALL 通過邏輯與正式建置瀏覽器檢查。

#### Scenario: PR 驗證

- **WHEN** PR 的目標分支為 main
- **THEN** 執行安裝、測試與正式建置，不部署

### Requirement: 僅 main 可部署

只有成功的 main 建置 SHALL 可使用官方 Pages 成品與 OIDC 身分憑證部署。工作流程 SHALL 支援手動執行，並防止部署重疊。

#### Scenario: main 發布

- **WHEN** main 推送或在 main 手動執行且通過驗證
- **THEN** 將 dist 成品部署到 github-pages 環境

#### Scenario: 其他分支手動驗證

- **WHEN** 在其他分支手動執行工作流程
- **THEN** 驗證該分支，不發布

#### Scenario: 分批驗證與部署條件

- **WHEN** 在 main 執行兩批瀏覽器驗證
- **THEN** 只有第 1 批上傳 Pages 成品
- **AND** 部署須等共用 `checks` 工作與兩批測試都成功
