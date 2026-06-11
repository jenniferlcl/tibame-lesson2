## 1. 後端：資料庫 Schema

- [x] 1.1 在 `apps/backend/src/db/schema.sql` 新增 `audit_logs` 資料表（id SERIAL PK、user_id INT FK→users ON DELETE SET NULL、action VARCHAR(20)、resource_type VARCHAR(50)、resource_id INT、detail JSONB、created_at TIMESTAMPTZ DEFAULT NOW()）
- [x] 1.2 重新啟動 Docker DB（`docker compose down -v && docker compose up -d`）以套用新 schema，或手動執行 DDL

## 2. 後端：Audit Log Helper

- [x] 2.1 新建 `apps/backend/src/lib/audit.js`，匯出 `logAction(userId, action, resourceType, resourceId, detail)` function，以 `pool.query` 寫入 `audit_logs`；錯誤僅 `console.error`，不 throw

## 3. 後端：車輛路由掛接 audit log

- [x] 3.1 在 `apps/backend/src/routes/vehicles.js` 的 POST handler `res.status(201).json(...)` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'create', 'vehicle', rows[0].id, { plate: rows[0].plate })`
- [x] 3.2 在 PUT handler `res.json(...)` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'update', 'vehicle', id, { plate: rows[0].plate })`
- [x] 3.3 在 DELETE handler `res.status(204).send()` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'delete', 'vehicle', req.params.id, {})`

## 4. 後端：員工路由掛接 audit log

- [x] 4.1 在 `apps/backend/src/routes/employees.js` 的 POST handler commit 後 `res.status(201).json(...)` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'create', 'employee', empRes.rows[0].id, { name: empRes.rows[0].name })`
- [x] 4.2 在 PUT handler `res.json(rows[0])` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'update', 'employee', id, { name: rows[0].name })`
- [x] 4.3 在 DELETE handler `res.status(204).send()` 之後，fire-and-forget 呼叫 `logAction(req.user.id, 'delete', 'employee', req.params.id, {})`

## 5. 後端：Audit Log 查詢路由

- [x] 5.1 新建 `apps/backend/src/routes/audit.js`，`GET /`（admin only）：接受 `page`（預設 1）、`limit`（預設 20）查詢參數；JOIN users 取 username；回傳 `{ data: [...], total: N }`，依 `created_at DESC` 排序
- [x] 5.2 在 `apps/backend/src/index.js` 掛載 `app.use('/api/audit-log', auditRouter)`

## 6. 前端：操作紀錄頁面

- [x] 6.1 新建 `apps/frontend/src/pages/AuditLogPage.jsx`（具名匯出）：以 `useState` 管理 `page`（預設 1）與 `limit`（20）；`useEffect` 依 page 呼叫 `GET /api/audit-log?page=&limit=`；以 shadcn/ui Table 顯示操作時間、操作者、動作、資源類型、資源 ID、摘要六欄
- [x] 6.2 在 `AuditLogPage` 加入分頁控制列（上一頁 / 頁碼資訊 / 下一頁）；第一頁停用上一頁按鈕，最後一頁停用下一頁按鈕（依回傳 `total` 計算）

## 7. 前端：路由與導覽

- [x] 7.1 在 `apps/frontend/src/App.jsx` 新增 `/audit-log` 路由，以 `AdminRoute` 保護，渲染 `AuditLogPage`
- [x] 7.2 在 `apps/frontend/src/components/Sidebar.jsx`（或含導覽連結的元件）新增「操作紀錄」連結，僅對 admin 顯示，指向 `/audit-log`
