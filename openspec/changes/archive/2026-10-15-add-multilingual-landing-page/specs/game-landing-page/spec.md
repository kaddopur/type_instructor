## ADDED Requirements

### Requirement: 三語遊戲介紹

應用程式 SHALL 提供 en、zh、ja 的 /:lang/about，並可從首頁進入。介紹頁 SHALL 說明單屬性相剋、兩種模式、攻防選擇、答對加一分／答錯減一分、60 秒一般模式及 20 分競速模式。切換語言 SHALL 保留介紹頁路徑；遊玩按鈕 SHALL 保留目前語言。

#### Scenario: 閱讀後開始遊玩

- **WHEN** 玩家以支援語言閱讀介紹並開始遊玩
- **THEN** 以相同語言開啟遊戲選單

### Requirement: 真實三語截圖

頁面 SHALL 顯示選定語言的真實遊戲瀏覽器截圖；圖片存於本機，不作修改，並提供有意義的對應語言替代文字。文件 SHALL 記錄截圖來源與可重複執行的產生指令。

#### Scenario: 離線圖片

- **WHEN** 首次預快取完成後，正式頁面在離線狀態重新載入
- **THEN** 仍可從 Pages 基底路徑取得截圖與介紹內容

### Requirement: 響應式版面與頁內捲動

介紹頁 SHALL 適合手機與桌面寬度，不水平溢出；長篇內容可在安全區域外框內捲動。既有遊戲頁 SHALL 維持固定且不能捲動的版面。整頁 SHALL 可用鍵盤及語意標題導覽。

#### Scenario: 返回遊戲

- **WHEN** 玩家從介紹頁前往首頁或遊戲頁
- **THEN** 外框恢復正常的不能捲動版面

### Requirement: 首頁移除外部作者連結

首頁 SHALL 移除原作者或 GitHub 連結。介紹頁頁尾 SHALL 保留原始碼連結 https://github.com/kaddopur/type_instructor。

#### Scenario: 從介紹頁開啟原始碼連結

- **WHEN** 玩家啟動介紹頁的原始碼連結
- **THEN** 在新分頁安全開啟儲存庫
