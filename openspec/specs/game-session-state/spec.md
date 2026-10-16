# 遊戲場次狀態規格

## Purpose

定義由 Zustand 管理的獨立遊戲場次、作答操作防護與計時器清理，確保重玩、切換路徑或回饋期間離開時，不會把舊場次狀態帶入新場次。

## Requirements

### Requirement: Zustand 管理遊戲狀態

應用程式 SHALL 以 Zustand 管理遊戲狀態，不包含 Redux 執行程式、React Redux 綁定、Provider、action 派送機制或 reducer 相依。語言字典 SHALL 為靜態資料，依網址語言選取。

#### Scenario: 遊戲操作

- **WHEN** 玩家開始遊戲並選擇答案
- **THEN** Zustand 操作依玩法基準更新時間、分數與回饋

### Requirement: 獨立場次

每個掛載的遊戲場次 SHALL 從自己的全新狀態開始。重玩或切換遊戲路徑 SHALL 重設遊戲，不混入其他場次狀態。

#### Scenario: 回饋期間切換模式

- **WHEN** 玩家在回饋尚未結束時前往另一場遊戲
- **THEN** 新遊戲顯示開始說明、零分與該模式的初始時間

### Requirement: 操作防護

遊戲操作 SHALL 拒絕開始前、回饋期間、結束後的作答，也拒絕無效選項及本題已選過的選項。

#### Scenario: 快速重複作答

- **WHEN** 回饋結束前重複選擇同一選項
- **THEN** 只有第一次有效作答會改變分數

### Requirement: 計時器生命週期

遊戲 hook SHALL 在開始說明關閉後只啟動一個週期計時器；結束或卸載時，清除週期與回饋延遲計時器，在 StrictMode 下也相同。

#### Scenario: 回饋期間離開

- **WHEN** 玩家在回饋延遲結束前離開遊戲
- **THEN** 延遲更新或結果導頁都不影響下一頁或下一場
