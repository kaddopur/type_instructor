# 驗證紀錄

日期：2026-10-15。環境：Node 24.19.0、pnpm 11.22.0。

- 使用 Ruby 標準 YAML 函式庫解析 `.github/workflows/pages.yml`。確認 main 的 push／PR 篩選、手動觸發、分批 [1, 2]、dist 上傳，以及部署依賴完整建置矩陣。針對 push／pull_request／workflow_dispatch、main／master／feature、分批 1／2 的所有組合評估兩個條件式，共 18 個案例全部通過。PR 不上傳也不部署；main 的 push 或手動執行只由第 1 批上傳；其他分支不發布。部署仍須兩批都成功。
- `pnpm lint`、`pnpm typecheck`：通過。
- `pnpm test:unit`：6 個檔案共 23 個案例通過。
- `openspec validate align-main-branch --strict`：封存前通過。
- `git diff --check`：通過。

重新讀取遠端設定的結果：

- 儲存庫 defaultBranchRef 為 main；沒有需要調整目標分支的開啟中 PR。
- 已將 github-pages 現有分支政策 63104846 從 master 改為 main。GET deployment-branch-policies 回傳一項分支政策，名稱為 main。
- 環境仍為 custom_branch_policies=true、protected_branches=false。
- Pages 的 build_type 維持 workflow。舊 source.branch=gh-pages 中繼資料不是發布觸發來源，因此保留。
- `git remote set-head origin -a` 已將本機 origin/HEAD 從 master 更新為 main。

現行規格與文件已更新。歷史封存與第三方 sw-precache 原始碼網址刻意保留 master。最初只改分支名稱，未改應用程式碼與建置行為，因此沒有重跑瀏覽器測試；後續 CI 修正見下文。遠端工作流程與此變更的正式發布，仍待推送並合併至 main。

## CI 後續修正：色盤測試時鐘競態

CI 在 Firefox 色盤對比測試回報 `clock.pauseAt: Cannot fast-forward to the past`。測試先安裝即時時鐘，再以測試執行端的 `new Date()` 作為暫停時間；呼叫抵達瀏覽器前，瀏覽器時間可能已超過目標。現已比照既有玩法與導覽測試，固定安裝時間，並在 10 秒後暫停。玩法與對比檢查未改動，仍檢查全部 18 種屬性。

- Firefox 色盤測試以兩個工作程序重複執行 20 次：20 次通過，耗時 33.8 秒。
- `pnpm lint`：通過。
- `CI=1 pnpm test:e2e --shard=1/2`：以兩個工作程序執行，80 個案例通過，耗時 1.3 分鐘，包含原先失敗的 Firefox 色盤案例。
