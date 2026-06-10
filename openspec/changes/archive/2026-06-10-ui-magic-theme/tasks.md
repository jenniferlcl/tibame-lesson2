## 1. 安裝依賴與基礎設定

- [x] 1.1 在 `apps/frontend/` 安裝 `framer-motion`：`npm install framer-motion`
- [x] 1.2 在 `apps/frontend/tailwind.config.js` 的 `extend.colors` 新增語意色 token：`brand-primary`、`surface`、`muted`、`border-subtle`，以及車輛狀態色 `status-available`、`status-in-use`、`status-maintenance`、`status-retired`

## 2. 共用元件與色彩 badge（前端）

- [x] 2.1 新增 `apps/frontend/src/components/VehicleStatusBadge.jsx`：依 status 值回傳對應語意色 badge（綠/藍/橘/灰 + 中文標籤），取代現有各頁面的狀態顯示
- [x] 2.2 新增 `apps/frontend/src/components/magic/` 目錄，並加入 `NumberTicker.jsx`（from Magic UI，以 framer-motion 實作從 0 到目標值的滾動動畫，支援 `useReducedMotion` 跳過動畫）

## 3. 登入頁優化（前端）

- [x] 3.1 修改 `apps/frontend/src/pages/LoginPage.jsx`：外層改為漸層背景（`bg-gradient-to-br`），登入表單包覆於帶陰影卡片（`shadow-xl rounded-2xl backdrop-blur`）內
- [x] 3.2 更新輸入框與按鈕樣式，套用新色彩 token（`bg-surface`、`border-subtle`、`bg-brand-primary`）

## 4. 側邊欄優化（前端）

- [x] 4.1 修改 `apps/frontend/src/components/Sidebar.jsx`：頂部新增品牌識別區域（icon + 「VMS 車隊管理」文字）
- [x] 4.2 導航項目加入選取中 highlight（`bg-brand-primary/10 text-brand-primary`）與 hover 過渡（`transition-colors duration-150`）

## 5. 儀表板 Bento Grid 與 KPI 動畫（前端）

- [x] 5.1 修改 `apps/frontend/src/pages/DashboardPage.jsx`：將 KPI 卡片區域改為 CSS Grid Bento 排版（`grid-cols-4` 搭配不同 `col-span`）
- [x] 5.2 KPI 卡片數字改用 `NumberTicker` 元件顯示，數字來源保持原有 API 呼叫不變
- [x] 5.3 KPI 卡片加入圖示（可用 lucide-react 已安裝的 icon）與底色漸層（`bg-gradient-to-br`）

## 6. 車輛列表 badge 更新（前端）

- [x] 6.1 修改 `apps/frontend/src/pages/VehiclesPage.jsx`：將狀態顯示欄位替換為 `VehicleStatusBadge` 元件
