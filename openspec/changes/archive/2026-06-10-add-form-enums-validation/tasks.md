## 1. 後端：建立允許值清單模組

- [x] 1.1 新增 `apps/backend/src/lib/enums.js`：匯出 `VEHICLE_STATUSES`（['available','in_use','maintenance','retired']）、`DEPARTMENTS`（['業務部','工程部','管理部','資訊部','財務部']）、`USER_ROLES`（['admin','user']）

## 2. 後端：車輛路由驗證

- [x] 2.1 修改 `apps/backend/src/routes/vehicles.js`：在 `POST /` 處理函式引入 `VEHICLE_STATUSES`，若 `status` 有值且不在清單內則回傳 `400 { message: 'Invalid status value' }`
- [x] 2.2 修改 `apps/backend/src/routes/vehicles.js`：在 `PUT /:id` 處理函式加入相同的 status 驗證

## 3. 後端：員工路由驗證

- [x] 3.1 修改 `apps/backend/src/routes/employees.js`：在 `POST /` 處理函式引入 `DEPARTMENTS` 與 `USER_ROLES`，若 `department` 有值且不在清單內則回傳 `400 { message: 'Invalid department value' }`；若 `role` 有值且不在清單內則回傳 `400 { message: 'Invalid role value' }`
- [x] 3.2 修改 `apps/backend/src/routes/employees.js`：在 `PUT /:id` 處理函式加入相同的 department 與 role 驗證

## 4. 前端：共用 Select 元件

- [x] 4.1 新增 `apps/frontend/src/components/Select.jsx`：具名匯出 `Select`，接收 `options`（`{ value, label }[]`）、`value`、`onChange`、`placeholder`、`disabled` props；以 Tailwind 統一樣式，render 原生 `<select>`

## 5. 前端：車輛表單改用下拉選單

- [x] 5.1 修改 `apps/frontend/src/pages/VehiclesPage.jsx`：匯入 `Select` 元件，將新增/編輯表單中的 `status` 欄位改用 `Select`，選項為「可用(available) / 使用中(in_use) / 維修中(maintenance) / 報廢(retired)」
- [x] 5.2 修改 `apps/frontend/src/pages/VehiclesPage.jsx`：將 `brand` 欄位改用 `Select`，選項為 Toyota、Honda、Ford、Mazda、Nissan、Mitsubishi、BMW、Mercedes-Benz、其他
- [x] 5.3 確認編輯表單開啟時，`status` 與 `brand` 的 `Select` 預設顯示該車輛的當前值

## 6. 前端：員工表單改用下拉選單

- [x] 6.1 修改 `apps/frontend/src/pages/EmployeesPage.jsx`：將 `department` 欄位改用 `Select`，選項對應後端允許清單（業務部 / 工程部 / 工程部 / 資訊部 / 財務部）
- [x] 6.2 修改 `apps/frontend/src/pages/EmployeesPage.jsx`：將 `role` 欄位改用 `Select`，選項為「一般使用者(user) / 管理者(admin)」
- [x] 6.3 確認編輯表單開啟時，`department` 與 `role` 的 `Select` 預設顯示該員工的當前值

## 7. 驗證

- [x] 7.1 確認後端拒絕 `status: 'broken'`，回傳 400
- [x] 7.2 確認後端拒絕 `department: '不存在部門'`，回傳 400
- [x] 7.3 確認後端拒絕 `role: 'superadmin'`，回傳 400
- [x] 7.4 確認前端車輛表單無法手動輸入非法 status 值
- [x] 7.5 確認編輯表單正確預填當前車輛/員工的欄位值
