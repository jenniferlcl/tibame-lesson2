## Context

系統目前對車輛與員工的 CRUD 操作完全沒有紀錄，管理者無法追蹤操作軌跡。本次在不改變現有 API 回應格式的前提下，增加一個橫切關注點（cross-cutting concern）：每次資源變更後，非同步寫入 audit log 資料表，並提供管理者查詢介面。

## Goals / Non-Goals

**Goals:**
- 建立 `audit_logs` 資料表儲存操作軌跡
- 車輛與員工的 POST / PUT / DELETE 成功後自動寫入一筆 audit log
- `GET /api/audit-log`（admin only）支援分頁，回傳操作人 username、動作、資源類型、資源 ID、時間
- 前端 `/audit-log` 頁面（AdminRoute）顯示紀錄表格與分頁控制

**Non-Goals:**
- 登入 / 登出事件的 audit log（auth 路由不在本次範圍）
- Audit log 搜尋 / 篩選（分頁與時間排序即可，本期不做進階過濾）
- Audit log 刪除或保留政策
- 即時推播更新（WebSocket）

## Decisions

### 1. Audit log 寫入採「fire-and-forget」，不影響主 API 回應

**選擇**：在路由 handler 的成功回應 `res.json(...)` 之後，非同步呼叫 `logAction(...)` 但不 `await`，錯誤只 `console.error` 不影響主流程。  
**理由**：Audit log 是次要功能，不應讓寫入失敗導致車輛新增等主要操作失敗；對使用者而言感知不到延遲。  
**備選**：`await logAction(...)` — 強一致性，但 audit log 寫入失敗會使業務請求回傳 500，使用者體驗差。

### 2. `audit_logs` 欄位設計：`user_id`（FK → users）+ `action` + `resource_type` + `resource_id` + `detail`（JSONB）

**選擇**：`detail` 使用 PostgreSQL JSONB 儲存操作摘要（如新增的 plate、變更的欄位鍵值），`resource_type` 為 VARCHAR（'vehicle' | 'employee'）。  
**理由**：JSONB 彈性高，不同資源的摘要格式不同，無需為每種操作建立獨立欄位；`resource_type` + `resource_id` 組合可追蹤任意資源，未來擴充零成本。  
**備選**：純 TEXT 的 `message` 欄位 — 簡單但不可查詢、難以格式化顯示。

### 3. `logAction` 封裝為獨立 helper（`src/lib/audit.js`），不混入路由邏輯

**選擇**：新建 `apps/backend/src/lib/audit.js`，匯出 `logAction(userId, action, resourceType, resourceId, detail)` function，各路由 require 後呼叫。  
**理由**：路由層職責單一；日後若要改為 message queue 或外部日誌服務，只需修改 `audit.js` 一處。  
**備選**：在每個路由直接寫 `pool.query(INSERT INTO audit_logs ...)` — 重複程式碼，修改困難。

### 4. 分頁以 `LIMIT / OFFSET` 實作，前端帶 `page` + `limit` 查詢參數

**選擇**：`GET /api/audit-log?page=1&limit=20`，後端計算 `OFFSET = (page-1)*limit`，回傳 `{ data: [...], total: N }`。  
**理由**：與現有 API 風格一致（無 cursor-based pagination 需求）；前端只需計算總頁數即可驅動分頁元件。  
**備選**：Cursor-based pagination — 更適合大資料集，但本系統 audit log 量不大，複雜度不必要。

### 5. 前端分頁以本地 state 控制，不加入 URL query string

**選擇**：`AuditLogPage` 以 `useState` 管理 `page`，頁面重整回到第一頁。  
**理由**：管理者頁面不需要分享特定頁碼的 URL；與現有 VehiclesPage / EmployeesPage 的操作模式一致。  
**備選**：URL query string（`?page=2`）— 可分享連結，但需額外 useEffect + useSearchParams，超出本期需求。

## Risks / Trade-offs

- **[Risk] Fire-and-forget 可能遺漏紀錄** → Mitigation：`console.error` 確保錯誤可見於 server log；本系統為內部工具，偶發遺漏可接受。
- **[Risk] `user_id` FK 在 users 刪除後變 NULL（ON DELETE SET NULL）** → Mitigation：`detail` 欄位存入 `username` 快照，即使帳號被刪除仍可追溯操作人身份。
- **[Trade-off] JSONB `detail` 欄位無固定 schema** → 前端需處理欄位可能不存在的情況（`detail?.plate ?? '—'`）；搜尋 detail 內容需 `@>` 運算子，本期不提供此功能。

## Migration Plan

1. 在 `schema.sql` 新增 `audit_logs` 資料表 DDL（不影響現有資料表）
2. 重啟 DB（`docker compose down -v && docker compose up -d`）或手動執行 DDL（`psql -c "CREATE TABLE ..."`）
3. 部署後端：新增 `audit.js`、`routes/audit.js`，修改 vehicles / employees 路由
4. 部署前端：新增 `AuditLogPage.jsx`、修改 `App.jsx` 路由、修改側邊欄
5. Rollback：移除前端頁面與後端路由即可停用；`audit_logs` 表保留不影響其他功能
