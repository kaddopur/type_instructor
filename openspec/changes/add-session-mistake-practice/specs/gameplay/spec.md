## ADDED Requirements

### Requirement: 保存本場原始錯題

系統 SHALL 在每題首次有效答錯時保存乾淨的原題，包含題幹、正解、選項順序與倍率，不重複保存同一題。

#### Scenario: 逾時前答錯

- **WHEN** 一般挑戰在錯誤回饋期間逾時
- **THEN** 結果包含該題，下一場的錯題清單從空白開始
