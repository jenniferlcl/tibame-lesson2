## Why

目前 `seed.sql` 僅有 3 名用戶（admin/alice/bob）與少量固定資料，無法覆蓋車輛各狀態、員工跨部門、指派與未指派等多樣情境，導致開發時難以手動驗證完整功能，也無法重現邊界條件。新增 `seed:mock` 指令，一鍵建立覆蓋完整測試情境的模擬資料集。

## What Changes

- 新增 `apps/backend/src/db/seed-mock.js`：可重複執行的 Node.js 腳本，建立完整情境資料：
  - **用戶**：1 名 admin + 9 名 user
  - **員工**：10 名，跨 4 個部門（業務部、工程部、管理部、資訊部）
  - **車輛**：15 台，各狀態均有分佈（available × 5、in_use × 4、maintenance × 3、retired × 3）；部分車輛指派員工，部分未指派
  - 執行前自動清空 `vehicles → employees → users`（保留 schema），確保冪等性
- 在 `apps/backend/package.json` 新增腳本：`"seed:mock": "node src/db/seed-mock.js"`

## Capabilities

### New Capabilities

- `mock-seed`: 開發用模擬資料腳本，提供可重複執行、覆蓋完整情境的資料集，供手動測試與 demo 使用

### Modified Capabilities

（無行為層面變更）

## Impact

- **後端**：新增 `apps/backend/src/db/seed-mock.js`；修改 `apps/backend/package.json`
- **資料庫**：執行後覆蓋現有資料（非累加），僅預期在開發環境使用
- **前端 / 測試**：不受影響
