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
系統 SHALL 支援 `en`、`zh`、`ja`，在切頁、遊戲、結果與重玩時保留 URL 中的語言。語系文字取自現有 JSON；保留像素字體風格；切換語言 SHALL NOT 改變全站根字級、控制元件尺寸、圓角或布局位置。翻譯文字可有不同字寬，容器應預留足夠空間。

#### Scenario: Change language
- **WHEN** 玩家從語言頁選擇中文或日文
- **THEN** URL 更新為對應語言，後續頁面顯示該語言
- **AND** 在相同可視尺寸下，控制元件維持相同尺寸、位置與圓角

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

### Requirement: Confirm leaving an active game
Quiz SHALL 在同一列依序顯示計時、離開遊戲與分數。離開入口 SHALL 開啟本地化確認視窗，優先聚焦繼續遊戲；確認期間計時繼續。取消或關閉視窗 SHALL 保留本場進度並將焦點還給離開入口；確認離開 SHALL 返回目前語言的選單。

#### Scenario: Cancel exit
- **WHEN** 玩家選擇繼續遊戲或關閉離開確認視窗
- **THEN** 保留本場進度並繼續答題

### Requirement: Local personal bests
選單 SHALL 在攻擊、防禦入口下分別顯示一般模式最高分及競速模式最短完成秒數，使用目前瀏覽器儲存並跨語言共用。僅正常完成一局 SHALL 更新紀錄；中途離開或直接開啟結果網址 SHALL NOT 寫入紀錄。沒有紀錄時 SHALL 顯示「—」；儲存失敗 SHALL NOT 阻止遊戲完成。

#### Scenario: Completed game
- **WHEN** 玩家正常完成一局，且成績優於該模式及題目種類的既有紀錄
- **THEN** 更新本機紀錄，返回選單或重新載入後仍可查看
