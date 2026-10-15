## MODIFIED Requirements

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
