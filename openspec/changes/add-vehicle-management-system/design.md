## Context

從零建立一套全端車輛管理系統，包含前端 React SPA、後端 Express REST API 與 PostgreSQL 資料庫。系統需支援兩種角色（admin / user），並透過 Docker Compose 提供本機開發環境。

## Goals / Non-Goals

**Goals:**
- 以 JWT（HttpOnly Cookie）實作無狀態認證與 RBAC
- 提供車輛 CRUD 與狀態管理（含員工指派）
- 員工管理頁僅管理者可存取
- Docker Compose 一鍵啟動 PostgreSQL + pgAdmin
- 前端使用 shadcn/ui 建構一致的 UI

**Non-Goals:**
- 車輛出借/歸還工作流程（本期不含）
- 行動裝置 App
- 第三方 OAuth / SSO
- 實時通知（WebSocket）

## Decisions

### 1. JWT 存於 HttpOnly Cookie（而非 localStorage）

**選擇**：JWT access token 存於 HttpOnly + Secure + SameSite=Strict Cookie。  
**理由**：防止 XSS 直接竊取 token；SameSite 降低 CSRF 風險。  
**備選**：localStorage — 實作簡單，但 XSS 可直接讀取，安全性不足。

### 2. REST API（而非 GraphQL）

**選擇**：標準 RESTful API，路由群組 `/api/auth`、`/api/vehicles`、`/api/employees`、`/api/dashboard`。  
**理由**：CRUD 場景明確，REST 複雜度低、快取友好，團隊熟悉度高。  
**備選**：GraphQL — 適合複雜查詢，但本系統需求不需要彈性查詢能力。

### 3. Monorepo 結構

**選擇**：`apps/frontend`（React）+ `apps/backend`（Express）在同一 repo，共用 `docker-compose.yml`。  
**理由**：開發體驗一致，env 配置與 Docker 設定集中管理。  
**備選**：分開 repo — 部署彈性較高，但本階段增加協作摩擦。

### 4. RBAC 實作於 Express Middleware

**選擇**：`authenticate` middleware（驗證 JWT）+ `authorize(roles)` middleware（檢查角色）掛在路由層。  
**理由**：職責分離，每條路由的權限一目了然，易測試。

### 5. 資料庫 Schema 設計

三張核心表：
- `users`：id, username, password_hash, role(`admin`|`user`), created_at
- `employees`：id, employee_no, name, department, email, phone, user_id(FK→users), created_at
- `vehicles`：id, plate, brand, model, color, year, mileage, status(`available`|`in_use`|`maintenance`|`retired`), assigned_employee_id(FK→employees nullable), created_at, updated_at

`users` 與 `employees` 1-to-1 關聯（員工登入帳號）；車輛可選擇性指派給員工。

### 6. 前端路由保護

使用 React Router v6 `<PrivateRoute>` 元件，從 JWT payload 解析角色，未授權則 redirect 至登入頁或 403。

## Risks / Trade-offs

- **[Risk] JWT 無法即時撤銷** → Mitigation：設定短效期（2h），搭配登出時清除 cookie；若需撤銷，後期可加 Redis 黑名單
- **[Risk] Cookie SameSite 在跨域開發環境失效** → Mitigation：開發環境使用 Vite proxy 或統一 origin，避免跨域
- **[Risk] 密碼以明文儲存風險** → Mitigation：使用 bcrypt hash（cost factor 12）
- **[Trade-off] Monorepo vs 分開部署** → 本期優先開發速度，正式環境再拆分 Docker image
