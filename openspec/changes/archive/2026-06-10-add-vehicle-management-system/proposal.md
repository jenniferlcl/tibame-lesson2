## Why

公司需要一套集中管理車輛與員工的 Web 系統，目前無數位化工具追蹤車輛狀態、指派紀錄與人員資料，導致管理成本高且資訊不透明。本次建立全端車輛管理系統，以角色權限區隔管理者與一般使用者的操作範圍。

## What Changes

- 新增登入頁，支援帳號/密碼驗證，以 JWT（HttpOnly Cookie）維持 session，區分 `admin` / `user` 兩種角色
- 新增首頁儀表板，上方顯示 KPI 卡片（車輛總數、可用數量、維修中數量、員工人數），下方顯示車輛狀態分佈圓餅圖與每月趨勢折線圖
- 新增車輛管理頁，支援檢視、新增、編輯車輛（一般使用者），管理者額外可刪除；車輛狀態分為「可用 / 使用中 / 維修中 / 報廢」，可指派給員工
- 新增員工管理頁，僅管理者可存取，完整 CRUD
- 後端以 Express 提供 RESTful API，資料庫使用 PostgreSQL（Docker 啟動，附 pgAdmin 網頁）

## Capabilities

### New Capabilities

- `auth`: 登入/登出、JWT 發放與驗證、角色型存取控制（RBAC）
- `dashboard`: 儀表板頁面，KPI 數據卡片與車輛狀態/趨勢圖表
- `vehicle-management`: 車輛資料 CRUD、狀態流轉（可用/使用中/維修中/報廢）、指派員工
- `employee-management`: 員工資料 CRUD，限管理者存取

### Modified Capabilities

(none — 全新系統，無既有 spec 變更)

## Impact

- **前端**：新建 React 專案，使用 shadcn/ui 元件庫，包含路由（React Router）與受保護路由邏輯
- **後端**：新建 Express 應用，包含 `/api/auth`、`/api/vehicles`、`/api/employees`、`/api/dashboard` 路由群組
- **資料庫**：PostgreSQL，透過 Docker Compose 啟動，含 pgAdmin；schema 包含 `users`、`vehicles`、`employees` 表
- **基礎設施**：新增 `docker-compose.yml`，定義 postgres 與 pgadmin 服務
