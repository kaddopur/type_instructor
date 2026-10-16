## ADDED Requirements

### Requirement: 正式環境 GA4 網頁瀏覽

系統 SHALL 在 kaddopur.github.io 提供的正式建置使用 G-6H3DMT5TLL，並 SHALL 移除已停用的 UA 追蹤片段。

#### Scenario: 首次開頁與切換路徑

- **WHEN** 各語言頁面顯示，或玩家前往另一頁
- **THEN** 手動傳送 page_view，包含完整 hash 網址、更新後頁面標題與來源網址
- **AND** Google 追蹤標籤只初始化一次，設定 send_page_view:false

#### Scenario: 重複觸發與返回頁面

- **WHEN** 未離開目前網址，卻重複觸發追蹤
- **THEN** 只排入一次 page_view
- **AND** 前往其他網址再返回時，另記一次瀏覽

#### Scenario: 本機開發或預覽

- **WHEN** 使用開發建置，或主機名稱不是 kaddopur.github.io
- **THEN** 不載入 Google 腳本，也不初始化分析

#### Scenario: Google 腳本無法使用

- **WHEN** Google 腳本遭封鎖或網路離線
- **THEN** 導覽與玩法仍可操作，分析呼叫保留在佇列中

### Requirement: 分析設定文件

專案 SHALL 說明手動網頁瀏覽策略，以及避免依瀏覽紀錄重複收集所需的 GA4 設定。

#### Scenario: 網站管理者驗證部署

- **WHEN** 網站管理者依 README 操作
- **THEN** 能停用依瀏覽紀錄自動收集的網頁瀏覽，並在部署後以 Realtime 或 DebugView 確認收集結果
