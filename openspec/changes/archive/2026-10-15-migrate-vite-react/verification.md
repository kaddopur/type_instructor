# 第 2 步驗證

日期：2026-10-15。環境：macOS、Node 22.23.2、npm 10.9.8，以及由 Playwright 1.64.1 操作的已安裝 Google Chrome。

## 結果

Vite 8.3.4／plugin-react 6.1.2、React 與 React DOM 19.3.1、Router 8.4.0、React Redux 9.3.0、Redux 5.0.1 可一起安裝執行，不需覆寫 peer 相依要求。已提交的鎖定檔使用公開 npm 套件來源。Node 固定於 .nvmrc；package engines 要求 Node 22 系列的 22.22 以上版本。

| 檢查                     | 證據                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- |
| 依鎖定檔乾淨安裝         | `npm ci --fetch-retries=0 --fetch-timeout=20000` 通過，未使用 force 或 legacy-peer-deps |
| 正式邏輯基準             | `npm test`：7 個通過，0 個失敗                                                          |
| 套件稽核                 | `npm audit --audit-level=high`：0 個弱點                                                |
| 開發環境瀏覽器冒煙測試   | `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev npm run test:smoke`：3 個通過               |
| 正式建置與瀏覽器冒煙測試 | `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke`：建置與全部 3 個測試通過                 |

瀏覽器測試涵蓋三語、首頁／語言／選單路徑、一般攻防題、可見的答案回饋與分數變化、結果深連結、重玩重設、開始前不計時、60 秒倒數及自動結果導頁。英文／日文使用桌面檢視區；中文使用 390×844。導覽與資源測試未觀察到未捕捉的頁面錯誤。

資源測試確認字型可載入，manifest 與 PNG 圖示在 Pages 基底路徑下可取得，正式背景快取程式在 /type_instructor/ 啟用，首次安裝後可離線重新載入首頁。開發環境不註冊背景快取程式。

## 整合決策

- Router 2 與 react-router-redux 無法沿用於 React 19，因此將現代 hash 路由從第 3 步提前處理。語系仍由既有 I18nPage 包裝元件負責，底層改用 Router hooks。
- 已更新 Quiz 掛載／更新生命週期與延遲計時器清理，使現有 Redux 遊戲可在 createRoot 下執行。狀態管理轉換留待後續；使用者之後選定第 3 步改用 Zustand。
- sw-precache 保留到第 5 步。其 meow 相依只把 trim-newlines 當函式使用；針對該相依覆寫為相容的 3.x，移除回報弱點。覆寫後正式產生流程與瀏覽器背景快取程式啟用均通過。
- 移除舊部署指令，因為它會改寫 Git 歷史且假設輸出是 CRA 的 build 目錄。新的自動部署屬第 5 步。
- JSON 匯入、明確模組副檔名及 package type=module，讓基準測試使用原生 Node ESM；舊暫存解析鉤子已移除。

## 剩餘範圍

- 第 3 步：以 Zustand 與遊戲 hook 取代 Redux／React Redux 及類別式遊戲流程；驗證回饋期間重複輸入與切換路徑。
- 第 4 步：修正競速防禦連結，將目標統一為 20 分。本變更沒有修正這兩項問題，也沒有將其認定為正確行為。
- 第 5 步：更換舊離線工具，移除其相依覆寫與相容程式，驗證已安裝舊背景快取程式的更新，並設定 Pages 部署。
- 第 6 步：完整玩法驗收，包含競速完成、精確回饋時間、中斷／競態案例及更廣的裝置／瀏覽器範圍。

首次安裝後離線重新載入，不代表與舊背景快取程式更新相容。這些測試使用本機開發／預覽伺服器，未部署到線上 GitHub Pages。
