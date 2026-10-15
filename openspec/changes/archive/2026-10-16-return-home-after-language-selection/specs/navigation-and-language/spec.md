## MODIFIED Requirements

### Requirement: Localized navigation
系統 SHALL 支援 `en`、`zh`、`ja`，在切頁、遊戲、結果與重玩時保留 URL 中的語言。語系文字取自現有 JSON；保留像素字體風格；切換語言 SHALL NOT 改變全站根字級、控制元件尺寸、圓角或布局位置。翻譯文字可有不同字寬，容器應預留足夠空間。

#### Scenario: Change language
- **WHEN** 玩家從語言頁選擇英文、正體中文或日文，包括目前選取的語言
- **THEN** 前往所選語言的首頁，並將鍵盤焦點移到「開始」
- **AND** 後續頁面保留該語言；再次開啟語言頁時，控制元件維持相同尺寸、位置與圓角

#### Scenario: Change language on the introduction page
- **WHEN** 玩家在遊戲介紹頁切換語言
- **THEN** 保留介紹頁路徑並顯示所選語言，不返回首頁
