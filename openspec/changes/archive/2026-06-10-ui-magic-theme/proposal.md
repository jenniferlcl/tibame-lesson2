## Why

現有畫面以純 Tailwind utility class 堆疊而成，缺乏視覺層次與互動動感，對內部用戶的使用體驗造成負擔，也無法呈現管理工具應有的專業感。以 Magic UI 設計語言為基準進行主題優化，提升整體視覺一致性與使用者信任感。

## What Changes

- 引入 Magic UI 設計元素：漸層色彩、Glassmorphism 卡片、帶動效的數字計數器（NumberTicker）
- 儀表板 KPI 卡片加入數字滾動動畫，改以 Bento Grid 排版
- 側邊欄加入品牌 logo 區域與選取項目的 highlight 動效
- 車輛狀態 badge 改以語意色（可用＝綠、使用中＝藍、維修中＝橘、報廢＝灰），搭配微動效
- 登入頁加入背景漸層紋理與 Magic UI 風格的輸入框/按鈕
- 全站加入統一的色彩 token（primary、surface、muted）至 `tailwind.config.js`

## Capabilities

### New Capabilities

- `ui-theme`: 跨頁面的視覺設計規範，包含色彩系統、元件動效標準、Bento Grid 版面結構，以及 Magic UI 元件用法

### Modified Capabilities

（無行為層面變更）

## Impact

- **前端**：`apps/frontend/src/components/`、`apps/frontend/src/pages/`、`apps/frontend/tailwind.config.js`
- **新增依賴**：`framer-motion`（動效）；Magic UI 元件以 copy 原始碼方式引入，無需 registry
- **後端**：不受影響
- **資料庫**：不受影響
