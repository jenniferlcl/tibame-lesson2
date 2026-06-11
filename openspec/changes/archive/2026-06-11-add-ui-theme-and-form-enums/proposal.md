## Why

現有系統 UI 視覺缺乏層次感，無法傳達現代管理後台的品質感；車輛表單的顏色欄位為純文字輸入，使用者體驗差且後端對 `brand`、`color` 缺乏 enum 驗證，導致任意字串可寫入資料庫。

## What Changes

- **UI 主題強化（Magic UI 風格）**：Tailwind 新增 glow shadow tokens 與 shimmer keyframe；全域 utility class `.text-gradient`（漸層文字）與 `.shimmer-bg`（光暈掃過動畫）；主內容區改為 radial gradient 背景；儀表板 KPI 圖示加入彩色光暈與 shimmer 動效；三個頁面標題改為漸層文字；車輛與員工表格列 hover 加入左側品牌色條
- **車輛顏色下拉選單**：`VehiclesPage` 新增 `COLOR_LIST` 常數，`color` 欄位從 `<Input>` 改為 shadcn/ui `<Select>`
- **後端 Enum 驗證補強**：`enums.js` 新增 `VEHICLE_BRANDS`（9 種）與 `VEHICLE_COLORS`（11 種）；`POST /api/vehicles` 及 `PUT /api/vehicles/:id` 加入 brand、color 非法值回 400 的驗證

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `vehicle-management`：新增 color 欄位改為下拉選單的 UX 需求；後端 API 須驗證 brand 與 color 為合法 enum 值
- `ui-theme`：新增漸層標題、KPI 光暈、shimmer 動效、radial gradient 背景、表格列左側 hover 色條等視覺規格

## Impact

- `apps/backend/src/lib/enums.js`：新增 `VEHICLE_BRANDS`、`VEHICLE_COLORS`
- `apps/backend/src/routes/vehicles.js`：POST/PUT handler 加入 brand/color 驗證
- `apps/frontend/src/pages/VehiclesPage.jsx`：color 欄位改 Select、新增 `COLOR_LIST`
- `apps/frontend/tailwind.config.js`：新增 boxShadow glow tokens、shimmer keyframe/animation
- `apps/frontend/src/index.css`：新增 `.text-gradient`、`.shimmer-bg` utilities
- `apps/frontend/src/components/AppLayout.jsx`：main 改 radial gradient 背景
- `apps/frontend/src/pages/DashboardPage.jsx`：標題漸層、KPI glow + shimmer
- `apps/frontend/src/pages/EmployeesPage.jsx`：標題漸層、表格 hover 左側色條
