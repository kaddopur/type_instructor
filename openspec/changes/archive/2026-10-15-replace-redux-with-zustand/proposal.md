# 以 Zustand 取代 Redux

## Why

使用者選擇第 3 步改用 Zustand。應用程式只需小型遊戲場次狀態儲存區；語言字典與網址參數不需放入。

## What Changes

- 用 Zustand 場次儲存區取代 Redux actions／reducer／connect／Provider。
- Zustand 只放遊戲狀態；靜態翻譯依網址語言提供。
- 以 hook 取代類別式遊戲流程，在場次結束、換路徑或卸載時清理週期與回饋計時器。
- 保留既有介面、網址格式、計分及第 4 步才修正的競速問題。
- 讓基準測試改用正式 Zustand 操作，擴充生命週期檢查。

## Capabilities

### New Capabilities

- `game-session-state`：隔離的 Zustand 場次與具作答防護的遊戲操作。

### Modified Capabilities

無。仍以行為基準為依據，只改變場次狀態管理。

## Impact

移除 redux、react-redux 與 src/ducks，更新遊戲顯示、語系資料傳遞、測試、鎖定檔及文件。不加入持久化中介層或新玩法。
