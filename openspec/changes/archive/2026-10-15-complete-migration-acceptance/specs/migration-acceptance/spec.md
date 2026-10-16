## ADDED Requirements

### Requirement: 完整遊戲測試組合

驗收 SHALL 涵蓋英文、正體中文與日文的一般／競速、攻擊／防禦模式，包含實際完成、結果、重玩與語言保留。

#### Scenario: 完成一場遊戲

- **WHEN** 對正式建置執行驗收測試
- **THEN** 每種語言／模式組合都得到正確結果，並開始乾淨的新一場

### Requirement: 瀏覽器與版面涵蓋範圍

驗收 SHALL 涵蓋桌面 Chromium、Firefox、WebKit 與手機 WebKit 模擬，所有答案都須可見且可操作。報告 SHALL 區分模擬與實機。

#### Scenario: 答案可見性

- **WHEN** 遊戲在支援的測試檢視區顯示
- **THEN** 四個選項都完整位於遊戲檢視區內，不被裁切

### Requirement: 發布證據

發布 SHALL 在本機與遠端驗證通過後執行，並記錄部署版本及線上驗證。報告 SHALL 列出未執行的測試。

#### Scenario: Pages 發布

- **WHEN** 通過檢查的遷移 PR 合併至 master
- **THEN** Pages 工作流程完成部署，已發布遊戲的資源與玩法檢查通過
