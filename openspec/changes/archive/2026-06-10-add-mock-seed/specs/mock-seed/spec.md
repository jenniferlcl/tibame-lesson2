## ADDED Requirements

### Requirement: 模擬資料腳本指令
系統 SHALL 在 `apps/backend/package.json` 提供 `seed:mock` 指令（`node src/db/seed-mock.js`），開發者可一鍵建立覆蓋完整情境的模擬資料。

#### Scenario: 執行 seed:mock 指令
- **WHEN** 開發者在 `apps/backend/` 目錄執行 `npm run seed:mock`
- **THEN** 腳本成功完成，終端機顯示建立成功的用戶數、員工數、車輛數，程序 exit code 為 0

### Requirement: 冪等執行
`seed:mock` 腳本 SHALL 在執行前清空 `vehicles`、`employees`、`users` 三張表（依外鍵順序），確保每次執行結果一致，不累加重複資料。

#### Scenario: 重複執行不累加資料
- **WHEN** 開發者連續執行 `npm run seed:mock` 兩次
- **THEN** 第二次執行後，資料庫內的用戶數、員工數、車輛數與第一次執行後完全相同

### Requirement: 完整情境資料集
腳本 SHALL 建立覆蓋以下情境的資料集：
- 用戶：1 名 admin、至少 5 名 user
- 員工：至少 8 名，跨越至少 3 個不同部門
- 車輛：至少 12 台，四種狀態（available、in_use、maintenance、retired）各至少有 2 台；部分車輛指派給員工，部分未指派

#### Scenario: 車輛狀態覆蓋
- **WHEN** 執行 `npm run seed:mock` 完成後查詢資料庫
- **THEN** `vehicles` 表中 `available`、`in_use`、`maintenance`、`retired` 各狀態均有至少 2 筆資料

#### Scenario: 員工跨部門
- **WHEN** 執行 `npm run seed:mock` 完成後查詢資料庫
- **THEN** `employees` 表中至少包含 3 個不同 `department` 值

#### Scenario: 車輛指派分佈
- **WHEN** 執行 `npm run seed:mock` 完成後查詢資料庫
- **THEN** `vehicles` 表中同時存在 `assigned_employee_id IS NOT NULL` 與 `assigned_employee_id IS NULL` 的紀錄

### Requirement: 生產環境保護
腳本 SHALL 在 `NODE_ENV === 'production'` 時拒絕執行，並以非零 exit code 結束，印出明確的警告訊息。

#### Scenario: 生產環境阻擋
- **WHEN** 在 `NODE_ENV=production` 環境下執行 `npm run seed:mock`
- **THEN** 腳本立即中止，不修改任何資料庫資料，終端機顯示警告並以 exit code 1 結束
