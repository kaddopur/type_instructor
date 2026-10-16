# 最終驗收與發布

日期：2026-10-15。環境：macOS、Node 22.23.2、pnpm 11.22.0、Playwright 1.64.1。

## 本機驗收

| 測試環境                    | 完整遊戲流程 | 背景快取程式更新／離線 | 結果      |
| --------------------------- | ------------ | ---------------------- | --------- |
| 桌面 Chromium               | 12           | 1                      | 13 個通過 |
| 桌面 Firefox                | 12           | 1                      | 13 個通過 |
| 桌面 WebKit                 | 12           | 1                      | 13 個通過 |
| 手機 WebKit，模擬 iPhone 13 | 12           | 1                      | 13 個通過 |

先執行 `pnpm test:acceptance --project=chromium-desktop --max-failures=1`，再一起執行其餘三個測試環境，共 52 個通過。各環境涵蓋英文／正體中文／日文 × 一般／競速 × 攻擊／防禦，實際完成遊戲，並檢查結果文字與數值、重玩重設、瀏覽器上一頁／下一頁、語言保留，以及 hash 深連結重新載入。

每個遊戲流程都檢查開始前不計時、單次一秒跳動、負分、快速重複輸入、翻譯後的傷害回饋、499／500 毫秒回饋邊界、答錯後重試與下一題狀態。一般模式在時間到期前正好 500 毫秒作答，涵蓋回饋與倒數同時結束，確認最終分數正確。競速檢查 19／20 分結束邊界，以及最後作答當下的秒數。

各環境的背景快取程式測試使用實際封存的 sw-precache 引擎與精簡資源清單。測試涵蓋缺少資源時安裝失敗、Workbox 成功接管、三語離線遊玩、第二版 Workbox、保留根路徑及巢狀應用的快取內容，以及遊玩中不強制重新載入。

### 發現並修正的問題

首次桌面測試失敗：在高度 720px 的檢視區，答案底部位於 1011.1875px。百分比垂直內距隨寬度增大，裁掉第二列。Quiz.css 現將每列上限設為 25dvh，窄螢幕保留 37.5% 尺寸，並使用 100dvh 與 vh 備援。四個測試環境的全部答案邊界現都通過，也已檢視桌面 Chromium 與手機 WebKit 截圖。

## 其他檢查

- 原生邏輯基準測試：12 個通過；套件稽核沒有已知弱點。
- 工作流程靜態驗證：actionlint v1.7.12 通過，未啟用選用的 shellcheck。
- OpenSpec 嚴格驗證與空白檢查通過。
- 乾淨安裝：移除產生的 node_modules 後，`pnpm install --frozen-lockfile` 通過，未使用相依覆寫。
- 最終 `pnpm test`：12 個通過；`pnpm test:smoke`：正式建置及 7 個瀏覽器測試通過。

## 發布進度

PR #2：https://github.com/kaddopur/type_instructor/pull/2

遠端 Ubuntu CI 已通過邏輯測試、7 個正式建置冒煙測試與全部 52 個驗收案例：https://github.com/kaddopur/type_instructor/actions/runs/38676470901

測試的實作版本為 b27285d9e2092926112550ce2aa985fa89df0ade。PR #2 通過檢查後，以 10aa46dc8b82416b940a34c3640bfea656bf5471 合併。github-pages 環境允許 master，Pages 已設為 workflow，因此不需修改 Pages 或環境設定。

master 建置與部署通過：
https://github.com/kaddopur/type_instructor/actions/runs/38676795520

發布網站：https://kaddopur.github.io/type_instructor/

線上 Chromium 驗證通過：首頁、實際防禦選單路徑、20 分目標、全部 20 次正確作答、受控時鐘的 9 秒結果、乾淨重玩、updateViaCache=none 的背景快取程式控制、離線重新載入與離線作答。未觀察到未捕捉的頁面錯誤。線上手機 WebKit 的中文防禦題也能在檢視區內顯示全部四個選項。

線上 JavaScript 與樣式表的檔名及完整 SHA-256 雜湊，都與本機測試的建置相同：

| 資源               | SHA-256                                                          |
| ------------------ | ---------------------------------------------------------------- |
| index-DGO7NqMb.js  | 7030d7d86abbb9ae1107b2f68336e7fc93c0b59684e00c3801a500dadc9d0fde |
| index-DxLf-clC.css | 0d9c905c0734d4db4dfcd4bf333986145d50874966d19118720d5016bb64ce2e |

最後的封存與文件提交不改動這些執行時資源。

## 實際驗證限制

Playwright WebKit 並非已安裝的 Safari 應用程式。手機設定模擬檢視區與輸入行為，不等於實體 iPhone。未測試實體 iOS／Android 裝置及所有瀏覽器版本。本機背景快取測試使用原始引擎與較小資源清單，未使用完整的 2016 年前端或既有使用者的瀏覽器設定檔。
