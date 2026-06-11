## Why

現有 VMS 前端 UI 層以手刻 Tailwind 為主，缺乏系統化元件庫支撐，維護成本高且視覺一致性難以保證。本次全面重建前端與後端，引入 shadcn/ui 元件庫與 Magic UI 動態效果，提升開發效率與使用者體驗，同時整頓後端架構與資料庫初始化流程。

## What Changes

- **登入頁**：以 shadcn/ui Card + Form + Input 重建，保留 JWT httpOnly cookie 機制與 admin/user 角色驗證
- **儀表板**：上方 KPI 卡片套用 Magic UI NumberTicker 動畫數字；下方新增圓餅圖（車輛狀態分佈）與長條圖（每月新增車輛趨勢），資料來自真實 DB
- **車輛管理頁**：以 shadcn/ui Table + Dialog + Form 重建 CRUD 介面；支援車輛狀態（可用 / 使用中 / 維修中 / 報廢）與指派員工（一對一）；刪除僅限 admin
- **員工管理頁**：僅限 admin，以 shadcn/ui Table + Dialog + Form 重建 CRUD 介面，員工建立時同步建立 user 帳號（同一 transaction）
- **後端**：整頓 Express 路由與中介層結構，統一錯誤回應格式 `{ message }`；`/api/dashboard/stats` 補充月趨勢資料
- **資料庫**：schema.sql / seed.sql 不變，Docker Compose 保留 postgres + pgAdmin 服務

## Capabilities

### New Capabilities

（無新 capability，所有功能均為現有 spec 的重建與強化）

### Modified Capabilities

- `auth`：登入 UI 改用 shadcn/ui 元件；錯誤提示改用 shadcn/ui Alert；其餘 JWT 行為不變
- `dashboard`：儀表板補充每月新增車輛趨勢長條圖（API 需新增月趨勢資料欄位）；KPI 卡片套用 Magic UI NumberTicker
- `vehicle-management`：整個頁面以 shadcn/ui 重建；Dialog 替代 inline 表單；Table 支援排序欄位
- `employee-management`：整個頁面以 shadcn/ui 重建；Dialog 替代 inline 表單

## Impact

- **前端**：覆蓋 `apps/frontend/src/pages/`、`apps/frontend/src/components/`；安裝 shadcn/ui（需執行 `npx shadcn@latest init`）與 Magic UI 元件；依賴 recharts 繪製圖表
- **後端**：`apps/backend/src/routes/dashboard.js` 新增月趨勢查詢；其餘路由結構不變
- **資料庫**：schema / seed 不變
- **基礎設施**：`docker-compose.yml` 不變
