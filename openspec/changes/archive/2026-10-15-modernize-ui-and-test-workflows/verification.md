# 驗證證據

實作版本：feat/tailwind-shadcn-a11y 上的 526cd42。此封存記錄已完成實作期間的驗證結果；封存本身只改文件。

## 已完成的本機檢查

- pnpm 凍結鎖定檔安裝、lint 與 TypeScript 檢查通過。
- pnpm test:unit：四組與原始碼並存的 Vitest 測試共 15 個通過。
- CI=1 pnpm test:e2e：108 個通過，每個瀏覽器環境 27 個，以兩個工作程序執行。
- E2E_SERVER=dev pnpm test:e2e:smoke：Chromium 的 7 個測試通過。
- 瀏覽器組合包括桌面 Chromium、Firefox、WebKit 與 iPhone 13 WebKit 模擬，涵蓋導覽／資源、玩法、鍵盤焦點、axe、屬性配色對比、離線使用與背景快取程式更新。
- cSpell 檢查原始碼與 tests/e2e：31 個檔案，零問題。
- 已檢查正式 JavaScript，未誤含 Vitest。
- 實作提交前 git diff --check 通過。

## 發布狀態與限制

此分支尚未推送、建立 PR、執行遠端 CI 或部署 Pages。上述本機結果不代表已驗證線上網站。手機檢查使用瀏覽器模擬，未執行手動螢幕閱讀器與實機檢查。

## 封存驗證

封存前對變更執行嚴格驗證；封存後對整合出的正式規格執行嚴格驗證。封存提交記錄這些文件。
