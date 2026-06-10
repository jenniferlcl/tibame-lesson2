## 1. Infrastructure & Project Setup

- [x] 1.1 建立 monorepo 目錄結構：`apps/frontend`、`apps/backend`，根目錄加 `docker-compose.yml`
- [x] 1.2 撰寫 `docker-compose.yml`：定義 `postgres`（port 5432）與 `pgadmin`（port 5050）服務，設定 volume 持久化
- [x] 1.3 建立 `apps/backend/.env.example` 與 `apps/frontend/.env.example`，記錄所需環境變數（DB_URL、JWT_SECRET、PORT 等）
- [x] 1.4 確認 Docker Compose 正常啟動，pgAdmin 可連線至 PostgreSQL

## 2. Database Schema

- [x] 2.1 撰寫 `apps/backend/src/db/schema.sql`：建立 `users` 表（id, username, password_hash, role, created_at）
- [x] 2.2 撰寫 `employees` 表：id, employee_no, name, department, email, phone, user_id(FK→users), created_at
- [x] 2.3 撰寫 `vehicles` 表：id, plate, brand, model, color, year, mileage, status ENUM, assigned_employee_id(FK→employees nullable), created_at, updated_at
- [x] 2.4 撰寫 `apps/backend/src/db/seed.sql`：插入預設 admin 帳號（bcrypt hash 密碼）與若干測試車輛/員工資料
- [x] 2.5 在 `docker-compose.yml` 掛載 `schema.sql` 與 `seed.sql` 作為 PostgreSQL init 腳本

## 3. Backend - Express App Setup

- [x] 3.1 初始化 Express 專案（`apps/backend`）：安裝 express、pg、bcrypt、jsonwebtoken、cookie-parser、cors、dotenv
- [x] 3.2 建立 Express app 入口 `src/index.js`，設定 JSON body parser、cookie-parser、CORS（允許前端 origin + credentials）
- [x] 3.3 建立 `src/db/pool.js`：使用 `pg.Pool` 連線 PostgreSQL
- [x] 3.4 建立 `src/middleware/authenticate.js`：驗證 HttpOnly Cookie JWT，將 payload 注入 `req.user`
- [x] 3.5 建立 `src/middleware/authorize.js`：接受 roles 陣列，拒絕非授權角色（回傳 403）

## 4. Backend - Auth API

- [x] 4.1 實作 `POST /api/auth/login`：驗證 username/password（bcrypt compare），成功則簽發 JWT 寫入 HttpOnly Cookie
- [x] 4.2 實作 `POST /api/auth/logout`：清除 JWT Cookie，回傳 200
- [x] 4.3 實作 `GET /api/auth/me`：回傳當前登入使用者的 `{ id, username, role }`（需 authenticate middleware）

## 5. Backend - Dashboard API

- [x] 5.1 實作 `GET /api/dashboard/stats`：查詢並回傳 `{ totalVehicles, available, maintenance, totalEmployees, vehicleStatusBreakdown, monthlyTrend }`

## 6. Backend - Vehicles API

- [x] 6.1 實作 `GET /api/vehicles`：支援 query params `search`（車牌模糊搜尋）與 `status`（過濾），回傳車輛列表含指派員工姓名
- [x] 6.2 實作 `POST /api/vehicles`：驗證必填欄位，建立車輛記錄（需 authenticate）
- [x] 6.3 實作 `PUT /api/vehicles/:id`：更新車輛資料，含指派員工邏輯（報廢車輛不可指派）（需 authenticate）
- [x] 6.4 實作 `DELETE /api/vehicles/:id`：刪除車輛（需 authenticate + authorize(['admin'])）

## 7. Backend - Employees API

- [x] 7.1 實作 `GET /api/employees`：回傳員工列表（需 authorize(['admin'])）
- [x] 7.2 實作 `POST /api/employees`：建立員工記錄及關聯 user 帳號（bcrypt 密碼），驗證 username 唯一性（需 admin）
- [x] 7.3 實作 `PUT /api/employees/:id`：更新員工資料，選擇性重設密碼（需 admin）
- [x] 7.4 實作 `DELETE /api/employees/:id`：刪除前確認無已指派車輛，同時刪除關聯 user 帳號（需 admin）

## 8. Frontend - Setup

- [x] 8.1 初始化 Vite + React 專案（`apps/frontend`），設定 Vite proxy 將 `/api` 轉導至後端 port
- [x] 8.2 安裝並設定 shadcn/ui（`npx shadcn@latest init`），選擇 New York style + CSS variables
- [x] 8.3 安裝 React Router v6、axios（或 fetch wrapper）、recharts（圖表）
- [x] 8.4 建立全域 API client（axios instance），啟用 `withCredentials: true`

## 9. Frontend - Auth

- [x] 9.1 建立 `AuthContext`：儲存當前使用者資訊（id, username, role），提供 login / logout 方法
- [x] 9.2 建立 `<PrivateRoute>` 元件：未登入則 redirect 至 /login
- [x] 9.3 建立 `<AdminRoute>` 元件：role !== 'admin' 則 redirect 至 /dashboard
- [x] 9.4 實作登入頁（/login）：username/password 表單，呼叫 POST /api/auth/login，成功後跳轉 /dashboard
- [x] 9.5 實作登出功能：呼叫 POST /api/auth/logout，清除 AuthContext 狀態並跳轉 /login

## 10. Frontend - Layout & Navigation

- [x] 10.1 建立 App 路由結構：/login（public）、/dashboard、/vehicles、/employees（protected）
- [x] 10.2 建立 Sidebar 導覽元件：顯示「儀表板」、「車輛管理」；admin 才顯示「員工管理」

## 11. Frontend - Dashboard Page

- [x] 11.1 建立 `/dashboard` 頁面，呼叫 GET /api/dashboard/stats
- [x] 11.2 實作四個 KPI 卡片（shadcn Card）：車輛總數、可用、維修中、員工人數
- [x] 11.3 實作車輛狀態分佈圓餅圖（recharts PieChart）
- [x] 11.4 實作每月趨勢折線圖或長條圖（recharts LineChart / BarChart）

## 12. Frontend - Vehicle Management Page

- [x] 12.1 建立 `/vehicles` 頁面，呼叫 GET /api/vehicles，顯示車輛表格（shadcn Table）
- [x] 12.2 實作搜尋列（車牌模糊搜尋）與狀態過濾下拉選單
- [x] 12.3 實作新增車輛 Dialog（shadcn Dialog + Form），呼叫 POST /api/vehicles
- [x] 12.4 實作編輯車輛 Dialog，含指派員工下拉選單（取自員工列表），呼叫 PUT /api/vehicles/:id
- [x] 12.5 實作刪除確認 Dialog（僅 admin 顯示刪除按鈕），呼叫 DELETE /api/vehicles/:id

## 13. Frontend - Employee Management Page

- [x] 13.1 建立 `/employees` 頁面（AdminRoute 保護），呼叫 GET /api/employees，顯示員工表格
- [x] 13.2 實作搜尋列（員工姓名模糊搜尋）
- [x] 13.3 實作新增員工 Dialog（含 username、password、role 欄位），呼叫 POST /api/employees
- [x] 13.4 實作編輯員工 Dialog（密碼欄位留空表示不修改），呼叫 PUT /api/employees/:id
- [x] 13.5 實作刪除確認 Dialog，呼叫 DELETE /api/employees/:id，處理「仍有指派車輛」的錯誤回應
