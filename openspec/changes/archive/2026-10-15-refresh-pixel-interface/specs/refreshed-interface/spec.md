## ADDED Requirements

### Requirement: 一致的像素導覽

介面 SHALL 共用暖色背景、白色表面、炭黑外框與黃色主要操作的主題變數。首頁 SHALL 將開始／語言操作分組；選單 SHALL 顯示兩張有說明的模式卡片，各有成對攻防按鈕。語言選擇 SHALL 以可見勾選區分目前語言與鍵盤焦點。

#### Scenario: 各語言導覽

- **WHEN** 玩家切頁，或在 en、zh、ja 間切換
- **THEN** 相同檢視區的控制元件維持一致尺寸、圓角與位置

### Requirement: 清楚的遊戲資訊層級

開始對話框 SHALL 顯示所選模式與目標，主要及次要按鈕等寬。答題頁 SHALL 預留回饋空間，保留四個彩色答案控制元件。結果頁 SHALL 突出分數或所用秒數。

#### Scenario: 分數進度

- **WHEN** 競速模式進行中
- **THEN** 進度以 20 分為目標，保留實際分數，不改變遊戲狀態

#### Scenario: 回饋與重玩

- **WHEN** 提交答案且遊戲完成
- **THEN** 回饋同時提供目前語言文字與符號，結果頁第一個操作仍是重玩

### Requirement: 響應式與無障礙支援

改版 SHALL 保留安全區域外框、鍵盤流程、對比、Pages 基底路徑與離線使用。自動檢查 SHALL 涵蓋全部語言與瀏覽器測試環境；實機驗證限制 SHALL 明確記錄。

#### Scenario: 瀏覽器驗收

- **WHEN** 驗證正式建置
- **THEN** 完整遊戲、跨語言版面一致性、無障礙與離線檢查都通過

### Requirement: 配套應用圖示

瀏覽器 favicon、Apple 觸控圖示與 PWA manifest 圖示 SHALL 使用本機黃、炭黑、藍配色的像素 T 圖。SVG／ICO／PNG SHALL 可在 Pages 基底路徑下取得，並納入離線預快取。

#### Scenario: 圖示載入

- **WHEN** 應用程式載入瀏覽器及 manifest 圖示
- **THEN** 所有引用資源都可取得，點陣圖尺寸與宣告相符
