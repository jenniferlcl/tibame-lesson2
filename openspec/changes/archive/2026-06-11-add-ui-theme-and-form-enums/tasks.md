## 1. 後端：Enum 擴充與驗證

- [x] 1.1 在 `apps/backend/src/lib/enums.js` 新增 `VEHICLE_BRANDS`（Toyota / Honda / Ford / Mazda / Nissan / Mitsubishi / BMW / Mercedes-Benz / 其他）與 `VEHICLE_COLORS`（白色 / 銀色 / 黑色 / 灰色 / 紅色 / 藍色 / 棕色 / 橘色 / 黃色 / 綠色 / 其他），並更新 module.exports
- [x] 1.2 在 `apps/backend/src/routes/vehicles.js` 的 POST handler 加入 `brand` 與 `color` 的 enum 驗證（非法值回 400），位置在既有 status 驗證之後
- [x] 1.3 在 `apps/backend/src/routes/vehicles.js` 的 PUT handler 加入相同的 `brand` 與 `color` enum 驗證

## 2. 前端：車輛顏色下拉選單

- [x] 2.1 在 `apps/frontend/src/pages/VehiclesPage.jsx` 新增 `COLOR_LIST` 常數陣列（內容與後端 `VEHICLE_COLORS` 一致）
- [x] 2.2 將 `VehicleDialog` 中 `color` 欄位從 `<Input>` 改為 shadcn/ui `<Select>`，並以 `COLOR_LIST` 作為選項來源，placeholder 為「選擇顏色」

## 3. 前端：Tailwind 主題擴充

- [x] 3.1 在 `apps/frontend/tailwind.config.js` 的 `theme.extend.boxShadow` 新增 `glow-indigo`、`glow-green`、`glow-blue`、`glow-amber`、`glow-violet` 五種光暈 token
- [x] 3.2 在 `apps/frontend/tailwind.config.js` 的 `theme.extend` 新增 `keyframes.shimmer` 與 `animation.shimmer` 定義（2.5 秒線性無限循環）

## 4. 前端：全域 CSS Utility

- [x] 4.1 在 `apps/frontend/src/index.css` 的 `@layer utilities` 新增 `.text-gradient`（品牌主色至 Indigo 400 漸層文字）與 `.shimmer-bg`（水平光暈掃過動畫）utility class

## 5. 前端：UI 視覺強化

- [x] 5.1 在 `apps/frontend/src/components/AppLayout.jsx` 的 `<main>` 元素加入極淡 radial gradient 背景（Indigo 6% opacity，從頂部向下漸消）
- [x] 5.2 在 `apps/frontend/src/pages/DashboardPage.jsx` 將頁面標題「儀表板」套用 `.text-gradient` class
- [x] 5.3 在 `apps/frontend/src/pages/DashboardPage.jsx` 更新 `KpiCard` 元件：圖示區加入對應 `shadow-glow-*` token，並疊加 `.shimmer-bg` 動畫 div
- [x] 5.4 在 `apps/frontend/src/pages/VehiclesPage.jsx` 將頁面標題「車輛管理」套用 `.text-gradient` class，並在表格 `<TableRow>` 加入左側 hover 色條（`border-l-2 border-l-transparent hover:border-l-brand-primary/40 transition-colors`）
- [x] 5.5 在 `apps/frontend/src/pages/EmployeesPage.jsx` 將頁面標題「員工管理」套用 `.text-gradient` class，並在表格 `<TableRow>` 加入相同左側 hover 色條
