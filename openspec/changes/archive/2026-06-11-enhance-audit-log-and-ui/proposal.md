## Why（動機）

稽核紀錄 (audit log) 頁面的篩選器只支援單選，且動作欄顯示原始字串而非人類可讀標籤，導致 admin 在追蹤多個目標時操作繁瑣、難以理解；同時前端外殼 (web shell) 存在使用者資訊重複顯示、側欄 (sidebar) 高度未固定、以及車輛與員工編輯彈窗日期欄空白等體驗問題，需一併修正以提升整體可用性。

## What Changes（變更內容）

**Audit log 頁面功能優化**

- 動作 (action)、結果 (outcome)、操作者 (actor) 篩選改為複選 (multi-select)；API 端 `auditLogListQuerySchema` 已支援多值，前端 UI 跟進
- 新增「API 參數」欄：無完整內容時顯示 `—`；hover 時以 tooltip 顯示 `metadata` 內容；點擊複製到剪貼簿並顯示已複製回饋
- 來源 IP 欄新增遮蔽開關（預設遮蔽），IPv4 遮蔽格式 `a.*.*.d`（第一與最後一碼保留，中間兩碼替換為 `*`）
- 動作欄改以 `AUDIT_ACTION_LABELS` 中文標籤顯示，與動作篩選下拉選項文字一致，未涵蓋動作 fallback 顯示原始字串

**Web Shell UI 修正**

- 移除頂部標頭 (header) 中的使用者姓名／歡迎詞，統一整合至左下角側欄；標頭保留主題切換與登出按鈕
- 側欄固定為視窗 100% 高度，主內容區獨立捲動，側欄與標頭不隨之捲動

**日期欄位回填修正**

- 車輛編輯彈窗「購買日期」(`purchasedAt`) 正確以 `YYYY-MM-DD` 格式回填，不顯示空白
- 員工編輯彈窗「入職日期」(`hiredAt`) 正確以 `YYYY-MM-DD` 格式回填，不顯示空白

## Capabilities（影響能力範圍）

### New Capabilities（新能力）

無。

### Modified Capabilities（修改既有能力）

- `audit-log`：前端 UI 新增複選篩選、API 參數 tooltip、來源 IP 遮蔽開關、動作欄改用中文標籤（需求層級變更）
- `web-shell`：側欄 100% 高度固定、使用者身分整合至左下角單一位置（需求層級變更）
- `vehicles`：編輯表單 `purchasedAt` 回填修正（需求層級變更）
- `employees`：編輯表單 `hiredAt` 回填修正（需求層級變更）

## Non-Goals（非目標）

- 本 change 不處理 audit log 後端查詢 API 結構調整（schema 已支援多值，無需修改）
- 本 change 不處理 audit log 資料匯出（CSV / PDF）
- 本 change 不處理 IP 地理位置解析
- 本 change 不處理 tooltip 內容的進階格式化（如 diff view）
- 本 change 不處理 i18n、multi-tenant、SSO 等 repo 層級非目標

## Impact（影響範圍）

**受影響檔案 / 結構**

- `apps/web/src/pages/AuditLogs.tsx`（或對應 audit log 頁面元件）—— 主要變更點
- `apps/web/src/components/AppShell.tsx`（或 Sidebar / Header 元件）—— 身分整合與側欄高度
- `apps/web/src/pages/Vehicles.tsx`（或 VehicleForm）—— purchasedAt 回填
- `apps/web/src/pages/Employees.tsx`（或 EmployeeForm）—— hiredAt 回填

**依賴新增**

無需新增 npm 依賴；shadcn/ui 現有 `Tooltip`、`Switch`、`Popover` 元件已足夠。

**新增環境變數**

無。

**新增 DB migration**

無。

**API 路由**

無新增端點；`GET /api/audit-logs` 既有多值 query 參數支援不需後端調整。

**前端路由**

無新增路由。

**測試覆蓋面**

- Web：新增 / 更新 AuditLogs 頁面的 Vitest 測試（複選篩選、tooltip、IP 遮蔽、動作標籤）
- Web：更新 VehicleForm / EmployeeForm 測試（日期回填）
- API：無新增測試需求
