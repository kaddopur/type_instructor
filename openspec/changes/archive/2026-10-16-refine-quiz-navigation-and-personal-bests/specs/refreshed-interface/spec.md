## ADDED Requirements

### Requirement: Tailwind 元件樣式

新增或修改的元件版面、間距與字型 SHALL 使用 Tailwind CSS 工具類別，搭配共用 shadcn／Radix 控制元件及主題變數。共用主題定義、字型宣告與既有共用樣式規則 MAY 留在 CSS。

#### Scenario: 介面變更

- **WHEN** 新增或修改控制元件、紀錄標籤或響應式元件版面
- **THEN** 樣式使用 Tailwind 工具類別，不加入互相覆寫的元件專屬 CSS 規則
