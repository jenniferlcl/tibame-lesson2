## Why

系統目前缺乏操作軌跡紀錄，管理者無法追蹤誰在何時對哪筆資料執行了什麼操作，不符合內部稽核需求，也難以排查異常行為。

## What Changes

- **新增 `audit_logs` 資料表**：儲存操作者 user_id、操作動作（action）、目標資源類型（resource_type）、目標資源 ID（resource_id）、摘要快照（detail）、時間戳（created_at）
- **後端自動寫入 audit log**：車輛與員工的 POST（新增）、PUT（更新）、DELETE（刪除）完成後，自動非同步寫入一筆 audit log；不影響主要 API 回應
- **新增 `GET /api/audit-log` 路由**：admin only，支援分頁（page/limit）與依時間降冪排序；回傳紀錄陣列與總筆數
- **前端新增 `/audit-log` 頁面**：以 AdminRoute 保護，以 shadcn/ui Table 顯示紀錄，支援分頁導覽，並在側邊欄加入入口連結

## Capabilities

### New Capabilities

- `audit-log`：管理者查看操作紀錄的完整能力，涵蓋後端 API、資料表與前端頁面

### Modified Capabilities

- `employee-management`：員工的新增、更新、刪除操作完成後須寫入 audit log
- `vehicle-management`：車輛的新增、更新、刪除操作完成後須寫入 audit log

## Impact

- `apps/backend/src/db/schema.sql`：新增 `audit_logs` 資料表定義
- `apps/backend/src/lib/audit.js`（新檔）：`logAction(userId, action, resourceType, resourceId, detail)` helper
- `apps/backend/src/routes/audit.js`（新檔）：`GET /api/audit-log` 路由（admin only，分頁）
- `apps/backend/src/index.js`：掛載 `/api/audit-log` 路由
- `apps/backend/src/routes/vehicles.js`：POST/PUT/DELETE 完成後呼叫 logAction
- `apps/backend/src/routes/employees.js`：POST/PUT/DELETE 完成後呼叫 logAction
- `apps/frontend/src/pages/AuditLogPage.jsx`（新檔）：操作紀錄列表頁
- `apps/frontend/src/App.jsx`：新增 `/audit-log` AdminRoute
- `apps/frontend/src/components/Sidebar.jsx`（或 AppLayout）：新增側邊欄連結
