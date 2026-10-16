# 遷移至 Vite 與 React

## Why

應用程式仍使用 React 15 與 Create React App 0.4。改動玩法或狀態管理前，先建立可運作的現代開發環境與正式建置。

## What Changes

- 以 Vite 與 React 外掛取代 react-scripts；提交鎖定檔與 Node 版本。
- 一起升級 React／React DOM，使用 createRoot 與 JSX 模組入口。
- 依 React 19 需求升級 Router 與 React Redux，移除不相容的 react-router-redux；既有 Redux 遊戲 reducer 保留至第 3 步。
- 保留 hash 網址、翻譯、樣式、規則及第 4 步才修正的已知問題。
- 讓靜態資源與既有離線建置在 /type_instructor/ 下運作。

## Capabilities

### New Capabilities

- `development-build`：可重複執行的 Vite 開發、測試與正式建置指令。

### Modified Capabilities

無。既有玩法與導覽基準仍作為驗收依據。

## Impact

影響建置設定、套件清單與鎖定檔、React 入口與路由整合、JSX 檔名、JSON 載入、靜態資源及開發文件。現代離線工具與 Pages 自動部署仍屬第 5 步。
