## 1. 建立 seed-mock.js 腳本（後端）

- [x] 1.1 新增 `apps/backend/src/db/seed-mock.js`：加入 `NODE_ENV === 'production'` 保護判斷，若符合則印出紅色警告並 `process.exit(1)`
- [x] 1.2 在腳本中實作清空邏輯：依外鍵順序在同一 transaction 內執行 `DELETE FROM vehicles`、`DELETE FROM employees`、`DELETE FROM users`
- [x] 1.3 實作用戶資料插入：1 名 admin（帳號 `admin`）+ 9 名 user（`alice`～`ivan`），密碼統一為 `Mock1234!`，使用 `bcrypt.hash(password, 4)`
- [x] 1.4 實作員工資料插入：10 名員工，對應 10 名 user，跨 4 個部門（業務部 × 3、工程部 × 3、管理部 × 2、資訊部 × 2），含 `employee_no`、`name`、`department`、`email`、`phone`、`user_id`
- [x] 1.5 實作車輛資料插入：15 台車輛，狀態分佈為 available × 5、in_use × 4、maintenance × 3、retired × 3；in_use 的車輛指派給對應員工，其餘 `assigned_employee_id` 為 NULL
- [x] 1.6 腳本末尾印出建立結果摘要（用戶數、員工數、車輛數）並正常結束

## 2. 設定 npm 指令（後端）

- [x] 2.1 在 `apps/backend/package.json` 的 `scripts` 新增：`"seed:mock": "node src/db/seed-mock.js"`

## 3. 驗證

- [x] 3.1 執行 `npm run seed:mock`，確認終端機顯示成功摘要且 exit code 為 0
- [x] 3.2 重複執行 `npm run seed:mock`，確認資料不累加（與第一次結果相同）
- [x] 3.3 確認 DB 中四種車輛狀態各有至少 2 筆，且員工跨至少 3 個部門
- [x] 3.4 確認以 `NODE_ENV=production node src/db/seed-mock.js` 執行時被阻擋，exit code 為 1
