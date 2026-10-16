# 設計

使用 Vite 與標準 React 外掛，基底路徑設為 /type_instructor/。只將含 JSX 的檔案改名為 .jsx。相對模組匯入明寫副檔名，讓 Node 基準測試不需自訂解析鉤子，就能載入正式邏輯。

React 19 需要 createRoot 與相容的 Redux 綁定。Router 2 使用舊 React context，因此現在就改用新版宣告式 HashRouter，移除 react-router-redux。既有 I18nPage 包裝元件改用 Router hooks 取得路由參數、位置與 navigate，仍負責既有語系處理。Redux 遊戲狀態與類別頁面保留到第 3 步。

將已棄用的生命週期操作移到掛載／更新方法，並清理計時器。這是必要整合工作；Redux 移除仍在第 3 步，依使用者更新的決定改採 Zustand。兩項已知問題仍記錄並保留至第 4 步修正。

將 manifest、favicon 與快取相容程式移到 public。暫時保留 sw-precache 產生流程，只在正式建置按設定的基底路徑註冊。第 5 步更換舊離線工具並處理已安裝的背景快取程式。不要對 Vite 輸出執行會改寫 Git 歷史的舊部署指令。
