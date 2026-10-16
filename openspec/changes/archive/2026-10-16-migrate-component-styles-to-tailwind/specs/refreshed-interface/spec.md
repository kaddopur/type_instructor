## MODIFIED Requirements

### Requirement: Tailwind 元件樣式

所有元件的版面、間距、字型、響應式、狀態及偽元素樣式 SHALL 使用 Tailwind CSS 工具類別，搭配共用 shadcn／Radix 控制元件與主題變數。CSS SHALL 只保留 Tailwind 匯入、主題變數、字型宣告、共用響應式變體與全文件基礎規則。語意類別名稱 MAY 保留作測試定位，但不定義元件專屬 CSS。

#### Scenario: 介面變更

- **WHEN** 頁面或共用控制元件顯示
- **THEN** 元件樣式來自 Tailwind 工具類別，不需獨立 Landing 樣式表或元件選擇器 CSS 規則

#### Scenario: 顯示行為一致

- **WHEN** 將遷移結果與已核准介面比對
- **THEN** 像素尺寸、各語言版面、響應式行為、鍵盤焦點與玩法均不變
