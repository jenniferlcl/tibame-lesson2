## 1. 前端環境初始化

- [x] 1.1 執行 `npx shadcn@latest init`，設定 Tailwind CSS 路徑、CSS 變數（globals.css）、路徑別名（`@` → `src/`）
- [x] 1.2 安裝所需 shadcn/ui 元件：`npx shadcn@latest add button card dialog input select table badge alert`
- [x] 1.3 確認 `src/components/magic/NumberTicker.jsx` 已存在；若不存在則從現有程式碼複製或重建
- [x] 1.4 安裝圖表依賴（若尚未安裝）：`npm install recharts`

## 2. 後端：Dashboard 月趨勢 API

- [x] 2.1 修改 `apps/backend/src/routes/dashboard.js`：在 `GET /api/dashboard/stats` 查詢中新增 `monthlyVehicles` SQL（`DATE_TRUNC('month', created_at) GROUP BY` 近 6 個月）
- [x] 2.2 確認 API 回應格式包含 `monthlyVehicles: [{ month: "YYYY-MM", count: N }]`，共 6 筆

## 3. 登入頁（auth）

- [x] 3.1 以 shadcn/ui Card、CardHeader、CardContent 重建 `LoginPage.jsx` 外框
- [x] 3.2 表單欄位改用 shadcn/ui Input（帳號、密碼）與 Button（登入）
- [x] 3.3 登入失敗錯誤訊息改用 shadcn/ui Alert（destructive variant）顯示
- [x] 3.4 驗證登入成功後跳轉至 `/dashboard`，失敗顯示 Alert 而非 console.error

## 4. 共用佈局（AppLayout / Sidebar）

- [x] 4.1 以 shadcn/ui 相容樣式重建 `AppLayout.jsx`（Sidebar + Outlet 佈局）
- [x] 4.2 Sidebar 導覽連結：儀表板、車輛管理、員工管理（員工管理僅 admin 顯示）
- [x] 4.3 Sidebar 底部加入「登出」按鈕，呼叫 `POST /api/auth/logout`

## 5. 儀表板頁（dashboard）

- [x] 5.1 KPI 卡片改用 shadcn/ui Card 元件，數字以 `NumberTicker` 動畫呈現（車輛總數、可用數、維修中數、員工人數）
- [x] 5.2 車輛狀態圓餅圖：使用 recharts PieChart，資料來自 `vehicleStatusBreakdown`
- [x] 5.3 每月新增車輛長條圖：使用 recharts BarChart，資料來自 `monthlyVehicles`；前端補足空月份（count: 0）確保顯示 6 個月
- [x] 5.4 圖表無資料時顯示佔位提示文字

## 6. 車輛管理頁（vehicle-management）

- [x] 6.1 以 shadcn/ui Table（Table、TableHeader、TableRow、TableCell）重建車輛列表
- [x] 6.2 實作前端欄位排序：點擊車牌、年份、里程、狀態欄位標題切換升冪/降冪
- [x] 6.3 搜尋欄（Input）與狀態篩選（Select）保留現有邏輯
- [x] 6.4 狀態 Badge 改用 shadcn/ui Badge 元件，各狀態對應 variant
- [x] 6.5 新增車輛：以 shadcn/ui Dialog + Form 實作，`status` 與 `brand` 欄位使用 Select；必填驗證在 submit 時進行
- [x] 6.6 編輯車輛：Dialog 預填當前值，`assigned_employee_id` 以 Select 列出所有員工（含「無指派」選項）
- [x] 6.7 刪除車輛：僅 admin 顯示刪除按鈕；點擊後彈出 shadcn/ui AlertDialog 確認後刪除
- [x] 6.8 驗證 admin/user 刪除按鈕可見性正確（user 不顯示）

## 7. 員工管理頁（employee-management）

- [x] 7.1 以 shadcn/ui Table 重建員工列表（員工編號、姓名、部門、Email、電話、帳號）
- [x] 7.2 搜尋欄（Input）保留現有姓名搜尋邏輯
- [x] 7.3 新增員工：Dialog + Form，`department` 與 `role` 使用 Select；submit 時建立員工與 user 帳號
- [x] 7.4 編輯員工：Dialog 預填當前值，`department` 與 `role` Select 顯示現有值
- [x] 7.5 刪除員工：AlertDialog 確認後刪除；仍有指派車輛時顯示錯誤訊息
- [x] 7.6 驗證員工管理頁僅 admin 可存取（AdminRoute 保護）

## 8. 路由與保護路由

- [x] 8.1 確認 `PrivateRoute`（未登入 → /login）與 `AdminRoute`（非 admin → /dashboard）邏輯正確
- [x] 8.2 確認 `AuthContext` mount 時呼叫 `/api/auth/me` 還原 session，`user===undefined` 期間顯示載入狀態
- [x] 8.3 路由結構：`/` redirect → `/dashboard`，`/login`、`/dashboard`、`/vehicles`、`/employees`

## 9. 整合驗證

- [x] 9.1 `docker compose up -d` 啟動 DB，執行 seed，確認 admin/alice/bob 帳號可正常登入
- [x] 9.2 以 admin 帳號測試：登入 → 儀表板（KPI + 兩張圖） → 新增/編輯/刪除車輛 → 員工管理 CRUD
- [x] 9.3 以 user 帳號（alice）測試：登入 → 儀表板可見 → 車輛可新增/編輯但無刪除按鈕 → /employees 被重導
- [x] 9.4 確認 Husky pre-commit（lint + test）在根目錄通過
