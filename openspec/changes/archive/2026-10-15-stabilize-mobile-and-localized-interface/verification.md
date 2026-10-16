# 本機驗證

已在 fix/mobile-safari-app-shell 驗證，包含隨本封存提交的最終根字級與跨語言版面調整。較早的分次提交與檢查見 tasks.md 及 docs/ui-migration.md。

## 最終檢查

- pnpm lint：通過。
- pnpm typecheck：通過。
- pnpm test:unit：4 個 Vitest 檔案共 15 個通過。
- CI=1 pnpm test:e2e：桌面 Chromium、Firefox、WebKit 及 iPhone 尺寸 WebKit 模擬共 120 個通過；兩個工作程序，約 2.1 分鐘。
- openspec validate --all --strict：封存前 9 份既有規格通過；封存後再次檢查全部整合規格。
- git diff --check：提交前通過。

## 版面與字型證據

專用版面檢查涵蓋 en／zh／ja，尺寸為 390×600、844×390 與 1280×900。比對首頁、選單、語言頁、一般／競速結果，以及四種答題模式的開始說明、遊玩及回饋狀態。其他版面檢查模擬安全區域內距、確認文件與頁內不溢出、比對語言按鈕，並檢查對話框寬度、圓角與單行選單標籤。

完整測試也涵蓋鍵盤流程、axe 掃描、屬性配色對比、完整遊戲、資源、離線遊玩與真實背景快取程式更新。Pages 資源檢查會載入 Cubic 11，並在離線重新載入後取得字型。Cubic 11 涵蓋修正後中文字串的全部 88 個不同漢字。Chromium 實際字型檢查確認兩個日文結果按鈕只由 Cubic 11 顯示。實作期間已檢視中日文選單、日文結果、更新後英文選單及橫向答題截圖。

## 範圍限制

未驗證實體 iPhone 的 Liquid Glass 瀏覽器介面或手動螢幕閱讀器。以上皆為本機結果。封存後才推送及建立 PR；遠端 CI 與部署須另行確認。本次封存／推送／PR 交接未要求部署。
