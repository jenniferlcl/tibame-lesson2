## Purpose

提供管理者查看系統內所有使用者對車輛與員工的操作紀錄，支援分頁瀏覽與時間排序。

## Requirements

### Requirement: 管理者可查看操作紀錄列表
系統 SHALL 提供 `/audit-log` 頁面，限 admin 角色存取，以 shadcn/ui Table 顯示系統內所有使用者對車輛與員工的操作紀錄，預設依時間降冪排列。

#### Scenario: 一般使用者嘗試存取 /audit-log
- **WHEN** role 為 `user` 的使用者瀏覽至 /audit-log
- **THEN** 系統重導至 /dashboard；側邊欄 SHALL NOT 對一般使用者顯示操作紀錄連結

#### Scenario: 管理者進入操作紀錄頁面
- **WHEN** admin 瀏覽至 /audit-log
- **THEN** 系統顯示操作紀錄表格，欄位包含：操作時間、操作者（username）、動作（action）、資源類型、資源 ID、摘要

#### Scenario: 紀錄依時間降冪排列
- **WHEN** admin 進入操作紀錄頁面
- **THEN** 最新的操作紀錄顯示於表格最上方

### Requirement: 操作紀錄支援分頁
系統 SHALL 對操作紀錄列表提供分頁功能，每頁預設顯示 20 筆，管理者可切換頁碼瀏覽歷史紀錄。

#### Scenario: 管理者切換到下一頁
- **WHEN** admin 點擊「下一頁」按鈕
- **THEN** 系統載入下一批操作紀錄，當前頁碼更新

#### Scenario: 最後一頁停用下一頁按鈕
- **WHEN** admin 已在最後一頁
- **THEN** 「下一頁」按鈕 SHALL 為 disabled 狀態

#### Scenario: 第一頁停用上一頁按鈕
- **WHEN** admin 在第一頁
- **THEN** 「上一頁」按鈕 SHALL 為 disabled 狀態

### Requirement: 後端提供操作紀錄 API
系統 SHALL 提供 `GET /api/audit-log` 端點，僅 admin 可呼叫，支援 `page`（預設 1）與 `limit`（預設 20）查詢參數，回傳 `{ data: AuditLog[], total: number }`。

#### Scenario: admin 呼叫 GET /api/audit-log
- **WHEN** admin 呼叫 GET /api/audit-log
- **THEN** 後端回傳 200，body 為 `{ data: [...], total: N }`，data 依 created_at 降冪排列

#### Scenario: 指定分頁參數
- **WHEN** admin 呼叫 GET /api/audit-log?page=2&limit=10
- **THEN** 後端回傳第 11～20 筆紀錄

#### Scenario: 一般使用者呼叫 GET /api/audit-log
- **WHEN** role 為 `user` 的使用者呼叫 GET /api/audit-log
- **THEN** 後端回傳 HTTP 403

### Requirement: 操作紀錄自動記錄車輛異動
系統 SHALL 在車輛新增、更新、刪除成功後自動寫入一筆 audit log，紀錄操作者、動作類型、車輛 ID 與操作摘要，不影響原 API 回應。

#### Scenario: 新增車輛後寫入 audit log
- **WHEN** 使用者成功呼叫 POST /api/vehicles
- **THEN** 系統寫入一筆 audit log，action 為 `create`，resource_type 為 `vehicle`，resource_id 為新車輛 ID

#### Scenario: 更新車輛後寫入 audit log
- **WHEN** 使用者成功呼叫 PUT /api/vehicles/:id
- **THEN** 系統寫入一筆 audit log，action 為 `update`，resource_type 為 `vehicle`，resource_id 為該車輛 ID

#### Scenario: 刪除車輛後寫入 audit log
- **WHEN** admin 成功呼叫 DELETE /api/vehicles/:id
- **THEN** 系統寫入一筆 audit log，action 為 `delete`，resource_type 為 `vehicle`，resource_id 為該車輛 ID

#### Scenario: audit log 寫入失敗不影響主回應
- **WHEN** audit log 寫入時發生資料庫錯誤
- **THEN** 原 API 回應正常回傳給呼叫端，錯誤僅記錄於 server log

### Requirement: 操作紀錄自動記錄員工異動
系統 SHALL 在員工新增、更新、刪除成功後自動寫入一筆 audit log，紀錄操作者、動作類型、員工 ID 與操作摘要，不影響原 API 回應。

#### Scenario: 新增員工後寫入 audit log
- **WHEN** admin 成功呼叫 POST /api/employees
- **THEN** 系統寫入一筆 audit log，action 為 `create`，resource_type 為 `employee`，resource_id 為新員工 ID

#### Scenario: 更新員工後寫入 audit log
- **WHEN** admin 成功呼叫 PUT /api/employees/:id
- **THEN** 系統寫入一筆 audit log，action 為 `update`，resource_type 為 `employee`，resource_id 為該員工 ID

#### Scenario: 刪除員工後寫入 audit log
- **WHEN** admin 成功呼叫 DELETE /api/employees/:id
- **THEN** 系統寫入一筆 audit log，action 為 `delete`，resource_type 為 `employee`，resource_id 為該員工 ID
