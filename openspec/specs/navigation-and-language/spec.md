# Navigation and language baseline

## Purpose

記錄遷移時應保留的頁面流程、既有網址與語系行為。依據 commit `4f1e318` 的原始碼整理；已知錯誤連結見 `openspec/baseline.md`。
## Requirements
### Requirement: Hash routes
系統 SHALL 使用 hash 路由提供首頁、選單、語言選擇、遊戲與結果頁。遊戲路徑為 `/:lang/quizzes/:category/:gameType/:quizType`，結果路徑附加 `/result/:value`；保留既有網址相容性及 `s` 單屬性分類值。

#### Scenario: Root entry
- **WHEN** 玩家開啟沒有語言前綴的根路徑
- **THEN** 顯示英文首頁

#### Scenario: Result navigation
- **WHEN** 玩家完成遊戲
- **THEN** 結果頁提供重玩與返回選單，並可返回首頁

### Requirement: Localized navigation
系統 SHALL 支援 `en`、`zh`、`ja`，在切頁、遊戲、結果與重玩時保留 URL 中的語言。語系文字取自現有 JSON；既有像素字體及中文、日文較大的字級應保留。

#### Scenario: Change language
- **WHEN** 玩家從語言頁選擇中文或日文
- **THEN** URL 更新為對應語言，後續頁面顯示該語言

### Requirement: Mode selection
系統 SHALL 提供一般與競速兩種模式的攻擊、防禦入口，每個入口導向對應的模式與題目種類，並保留玩家選擇的語言。

#### Scenario: Basic defense
- **WHEN** 玩家選擇一般模式防禦
- **THEN** 進入 `basic/defend` 的防禦題

#### Scenario: Speedrun defense
- **WHEN** 玩家從任一語言選單選擇競速防禦
- **THEN** 進入 `speedrun/defend` 並顯示防禦題幹

#### Scenario: Speedrun attack
- **WHEN** 玩家從任一語言選單選擇競速攻擊
- **THEN** 進入 `speedrun/attack` 並顯示攻擊題幹
