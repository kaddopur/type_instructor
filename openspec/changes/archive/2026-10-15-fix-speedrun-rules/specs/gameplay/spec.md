## MODIFIED Requirements

### Requirement: Speedrun mode
系統 SHALL 在玩家關閉開始說明後，從零秒開始累計用時，達到 20 分後完成 500 毫秒答題回饋並結束。遊戲邏輯與中英日三語目標說明 SHALL 使用同一個目標設定；結果顯示最後答對當下捕捉的整數秒。

#### Scenario: Speedrun result
- **WHEN** 本場分數從 19 分答對增加至 20 分
- **THEN** 完成答題回饋後停止計時，顯示最後答對當下的本場用時

#### Scenario: Below the goal
- **WHEN** 分數達到 19 分，或因答錯而扣分
- **THEN** 遊戲繼續，未達 20 分不得進入結果頁

#### Scenario: Localized goal
- **WHEN** 玩家以英文、中文或日文進入競速模式
- **THEN** 開始說明顯示由同一目標設定產生的 20 分目標
