## Why

員工「部門」、車輛「品牌」等欄位目前為自由文字輸入，導致同一部門出現多種寫法（如「業務部」vs「業務」），資料不一致且難以篩選。車輛「狀態」後端雖有 ENUM，但前端未限制輸入，送出非法值時 DB 拋出 500 錯誤而非明確的 400。統一改以下拉選單約束輸入並在後端驗證，確保資料一致性並提升表單使用體驗。

## What Changes

- **前端**：
  - 車輛表單：`status` 改為下拉選單（可用 / 使用中 / 維修中 / 報廢）；`brand` 改為下拉選單（Toyota、Honda、Ford、Mazda、Nissan、Mitsubishi、BMW、Mercedes-Benz、其他）
  - 員工表單：`department` 改為下拉選單（業務部 / 工程部 / 管理部 / 資訊部 / 財務部）；`role` 改為下拉選單（一般使用者 / 管理者）
  - 新增共用 `<Select>` 元件（`apps/frontend/src/components/Select.jsx`）
- **後端**：
  - `POST /api/vehicles`、`PUT /api/vehicles/:id`：驗證 `status` 必須為合法 ENUM 值，違規回傳 `400 { message: 'Invalid status value' }`
  - `POST /api/employees`、`PUT /api/employees/:id`：驗證 `department` 須在允許清單內，`role` 必須為 `admin` 或 `user`，違規回傳 `400 { message: '...' }`
  - 新增 `apps/backend/src/lib/enums.js`：統一管理所有允許值清單，供各路由引用

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `vehicle-management`: 車輛新增/編輯表單的 `status` 與 `brand` 欄位改為下拉選單；後端 POST/PUT 新增欄位值驗證
- `employee-management`: 員工新增/編輯表單的 `department` 與 `role` 欄位改為下拉選單；後端 POST/PUT 新增欄位值驗證

## Impact

- **前端**：`apps/frontend/src/pages/VehiclesPage.jsx`、`apps/frontend/src/pages/EmployeesPage.jsx`、新增 `apps/frontend/src/components/Select.jsx`
- **後端**：`apps/backend/src/routes/vehicles.js`、`apps/backend/src/routes/employees.js`、新增 `apps/backend/src/lib/enums.js`
- **資料庫**：不受影響（沿用現有 ENUM 定義）
