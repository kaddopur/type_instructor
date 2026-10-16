# 測試流程規格

## Purpose

定義可重複執行的單元與瀏覽器測試、測試檔案位置、格式與提交前檢查，以及共用 CI 驗證流程，讓本機與部署前檢查使用一致指令與通過條件。

## Requirements

### Requirement: 與原始碼並存的單元測試

單元測試 SHALL 在 Node 環境使用 Vitest，檔名為 src/**/*.test.ts，放在原始碼旁，排除瀏覽器測試。pnpm test 與 pnpm test:unit SHALL 執行單元測試；pnpm test:unit:watch SHALL 提供監看模式。

#### Scenario: 執行單元檢查

- **WHEN** 執行 pnpm test:unit
- **THEN** 不啟動瀏覽器，執行出題、傷害狀態、路由與遊戲狀態測試

### Requirement: 統一瀏覽器測試

瀏覽器測試 SHALL 放在 tests/e2e，使用同一份 Playwright 設定。玩家流程測試 SHALL 涵蓋桌面 Chromium、Firefox、WebKit 與手機 WebKit 模擬。標籤 SHALL 支援選取冒煙、玩法、無障礙與離線測試。

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
- **THEN** 格式、lint、型別檢查、單元測試與完整瀏覽器測試都必須通過
- **AND** 部署仍限於既有 main 發布流程

#### Scenario: 共用品質檢查

- **WHEN** Pages 工作流程驗證某個版本
- **THEN** 由單一 `checks` 工作各執行一次格式、lint、型別與單元測試
- **AND** 兩個瀏覽器矩陣工作獨立並行啟動，不重複上述檢查
- **AND** 部署須等共用檢查及全部瀏覽器分批都成功

#### Scenario: CI 並行分批

- **WHEN** Pages 工作流程執行完整瀏覽器測試
- **THEN** 兩個矩陣工作並行執行 Playwright 第 1/2 與 2/2 批
- **AND** 合計涵蓋每個瀏覽器案例，沒有遺漏或重複
- **AND** 任一批失敗就阻止部署，另一批仍執行至完成

### Requirement: 一致的儲存庫格式

專案 SHALL 固定 Prettier 版本，使用官方 Tailwind 類別排序外掛，並以 `src/index.css` 作為 Tailwind 主題入口。`pnpm format` SHALL 寫入格式調整；`pnpm format:check` SHALL 只檢查，不寫入。

共用 `checks` 工作 SHALL 在部署前要求格式檢查通過。`.prettierignore` SHALL 排除產生的輸出、pnpm 鎖定檔、OpenSpec 封存、第三方測試資料、字型與圖片來源資源。

#### Scenario: 本機與 CI 格式檢查

- **WHEN** 貢獻者依序執行 `pnpm format` 與 `pnpm format:check`
- **THEN** 支援且持續維護的原始碼、設定與文件使用一致格式
- **AND** ESLint 仍負責程式正確性與 React Hooks 規則

### Requirement: 自動檢查暫存檔

安裝開發相依套件時 SHALL 安裝 simple-git-hooks 的提交前鉤子。lint-staged SHALL 對已暫存的 JavaScript／TypeScript 依序執行 ESLint 修正、Prettier 與 ESLint 檢查；其他支援的暫存檔使用 Prettier。

未解決的 lint 錯誤 SHALL 阻止提交。lint-staged SHALL 透過預設備份與還原行為，讓未暫存的修改不進入提交。

#### Scenario: 可自動修正的暫存修改

- **WHEN** 貢獻者提交含格式問題或可自動修正 lint 問題的檔案
- **THEN** 工具在提交完成前修正並暫存這些變更

#### Scenario: 未解決的 lint 錯誤

- **WHEN** 暫存檔含有 ESLint 無法修正的 lint 錯誤
- **THEN** 提交失敗，已暫存與未暫存的修改都保留

### Requirement: 玩家流程端對端測試範圍

必要端對端測試 SHALL 涵蓋導覽、完整遊玩／重玩、離開確認、紀錄保存、鍵盤／觸控焦點與離線使用。像素尺寸、字型度量、全面無障礙掃描、分析整合及窮舉演算法組合 SHALL NOT 列為必要端對端檢查。既有單元測試 SHALL 保留規則、路由、紀錄與分析驗證。

#### Scenario: 代表性玩家流程

- **WHEN** 執行必要瀏覽器測試
- **THEN** 四個瀏覽器／裝置測試環境都以正體中文完成一般／競速、攻擊／防禦的完整遊戲
- **AND** 三種語言都測試切換、開始、作答與離開
- **AND** 持續涵蓋鍵盤、滑鼠／觸控焦點、紀錄與離線背景快取程式更新

#### Scenario: 鍵盤與焦點無障礙測試

- **WHEN** 執行 `pnpm test:a11y`
- **THEN** 檢查鍵盤與焦點流程，不宣稱已完成全面 axe 或 WCAG 稽核
