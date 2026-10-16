# 改善答題導覽、最佳紀錄與多語字型

## Why

玩家無法從介面離開進行中的答題；滑鼠使用者換題後按 Tab 會跳過第一個答案；選單也未顯示已完成的最佳紀錄。全形英文字形使各語言文字不一致，且會溢出小對話框。介紹頁截圖需反映更新後介面。

## What Changes

- 在時間與分數中央加入離開按鈕，提供各語言確認視窗。
- 分開滑鼠／觸控與鍵盤的題目焦點行為。
- 在目前瀏覽器按模式與攻防題型保存正常完成的最佳紀錄。
- 拉丁字母、數字與中日文字改用 Cubic 11，各語言尺寸一致；加大首頁標題，讓窄版離開對話框仍易讀。
- 變更的控制元件與版面使用 Tailwind 及共用 shadcn／Radix 元件。
- 更新全部九張三語遊戲截圖，記錄含未提交修改的工作目錄來源。

## Capabilities

### Modified Capabilities

- accessible-interface：依輸入方式設定答案焦點。
- mobile-interface-layout：共用多語像素字型尺寸。
- navigation-and-language：離開確認與本機最佳紀錄。
- refreshed-interface：Tailwind 元件樣式。

## Impact

影響 Home、Menu、Quiz、翻譯、打包字型選擇、截圖產生、OpenSpec、文件及瀏覽器／單元測試。不改規則、相依版本、後端、發布設定或分析。
