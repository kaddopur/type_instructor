# 設計

將 push 與 pull_request 的分支篩選明確設為 main；成品上傳與部署工作都檢查 refs/heads/main。保留其他分支的手動驗證、PR 不部署、只有第 1 批上傳成品、兩批都須成功，以及現有的部署並行控制與 OIDC 身分驗證設定。

現有 github-pages 環境使用名為 master 的自訂分支政策。只將這項政策改名為 main，不改動其他環境規則。Pages 已設定 build_type=workflow，因此不用更動舊 gh-pages 來源中繼資料。

解析工作流程後，驗證 push、PR、手動事件、兩批測試及 main／其他分支的觸發與部署條件。更新遠端政策後重新讀取確認。這次只改分支名稱，不必重跑完整瀏覽器回歸測試；執行既有 lint、型別檢查、單元測試與 OpenSpec 嚴格驗證。
