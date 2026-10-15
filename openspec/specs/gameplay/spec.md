# Gameplay baseline

## Purpose

記錄技術遷移前應保留的玩法。依據 commit `4f1e318` 的原始碼整理；這不是已完成的瀏覽器驗收，也不是對官方屬性表的獨立認證。已知問題與後續驗收見 `openspec/baseline.md`。
## Requirements
### Requirement: Single-type questions
系統 SHALL 使用現有 18 種屬性產生單屬性題目，每題四個不重複選項，並且只有一個最佳答案。攻擊題選傷害倍率最高者，防禦題選受到傷害倍率最低者。

#### Scenario: Attack question
- **WHEN** 產生攻擊題
- **THEN** 題幹屬性代表防守方，選項代表攻擊屬性，正解倍率嚴格高於其他三個選項

#### Scenario: Defense question
- **WHEN** 產生防禦題
- **THEN** 題幹屬性代表攻擊方，選項代表防守屬性，正解倍率嚴格低於其他三個選項

### Requirement: Answer feedback and scoring
系統 SHALL 從零分開始，答對加一分、答錯減一分，允許負分；選過的選項顯示倍率與效果文字。答題後暫停接受作答 500 毫秒；同一選項每題只能計分一次。

#### Scenario: Wrong answer
- **WHEN** 玩家選擇未作答的錯誤選項
- **THEN** 扣一分、標記該選項，暫停後保留原題，玩家可選擇其他選項

#### Scenario: Correct answer
- **WHEN** 玩家選擇正確答案
- **THEN** 加一分並顯示回饋，暫停後換題；若已達結束條件則進入結果頁

#### Scenario: Repeated input
- **WHEN** 玩家在暫停期間點擊，或再次點擊已選過的選項
- **THEN** 分數與題目不因該次點擊改變

### Requirement: Basic mode
系統 SHALL 在玩家關閉開始說明後，以一秒為單位從 60 秒倒數；答題回饋期間仍計時，倒數至零進入分數結果頁。

#### Scenario: Start and finish
- **WHEN** 玩家進入一般模式並關閉開始說明
- **THEN** 開始倒數，時間歸零後顯示本場最終分數

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

### Requirement: Reset on a new game
系統 SHALL 在開始或重玩時清除上一場分數、答題標記與暫停狀態，依模式重設時間並顯示開始說明。

#### Scenario: Retry
- **WHEN** 玩家從結果頁選擇重玩
- **THEN** 以原語言、原模式及原攻防種類開始新的一場遊戲

### Requirement: Feedback categories
系統 SHALL 對倍率 0、0.5、1、2 分別顯示無效、不理想、一般與絕佳的對應語系文字。

#### Scenario: An immune matchup
- **WHEN** 已選選項的倍率為零
- **THEN** 顯示該語言的無效提示
