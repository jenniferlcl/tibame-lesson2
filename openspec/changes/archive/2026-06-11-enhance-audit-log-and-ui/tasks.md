## 1. 共用套件（@vms/shared）

- [x] 1.1 在 `packages/shared/src/audit-log.ts`（或現有動作定義檔）新增 `AUDIT_ACTION_LABELS` 常數，為每個 `AUDIT_ACTIONS` 項目提供繁體中文標籤
- [x] 1.2 在 `packages/shared/src/index.ts` 匯出 `AUDIT_ACTION_LABELS`

## 2. Web Shell — 版面與身分整合

- [x] 2.1 定位 Sidebar 元件（`apps/web/src/components/` 下的 sidebar 相關檔案），將外殼根容器改為 `h-screen flex`，sidebar 設 `h-full flex flex-col`，主內容區設 `flex-1 overflow-y-auto`
- [x] 2.2 在 Sidebar 底部加入使用者身分區塊（姓名 + 角色 badge），使用 `justify-between` 讓導覽項目與身分區塊分列上下
- [x] 2.3 在 Header 元件中移除使用者姓名 / 歡迎詞，僅保留主題切換按鈕與登出按鈕

## 3. Audit Log 頁面 — 動作欄標籤

- [x] 3.1 在 audit log 表格的「動作」欄 cell renderer 改為 `AUDIT_ACTION_LABELS[action] ?? action`
- [x] 3.2 確認動作篩選下拉（`<Select>` / Popover）選項文字也使用 `AUDIT_ACTION_LABELS`，對齊表格欄位

## 4. Audit Log 頁面 — 複選篩選

- [x] 4.1 將「動作」篩選從單值 `<Select>` 改為 Popover + Checkbox 清單，狀態型別為 `string[]`
- [x] 4.2 將「結果」篩選（`SUCCESS` / `FAILURE`）同樣改為複選（Checkbox group 或 Popover），狀態型別為 `string[]`
- [x] 4.3 送出 API 請求時將陣列以 `,` 串接：`actions.join(',')` → `action` query param；`outcomes.join(',')` → `outcome` query param
- [x] 4.4 實作「清除篩選」能將複選欄位 reset 至空陣列，且不傳入 query param

## 5. Audit Log 頁面 — API 參數欄

- [x] 5.1 在表格新增「API 參數」欄，cell renderer 判斷 `metadata` 是否有實質參數（非空物件）：無則顯示 `—`
- [x] 5.2 有實質參數時渲染觸發點（icon button 或縮略文字），包裹 shadcn/ui `<Tooltip>` 並將 `JSON.stringify(metadata, null, 2)` 以 `<pre>` 顯示於 tooltip 內容
- [x] 5.3 點擊觸發點時呼叫 `navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))`，成功後切換圖示或短暫顯示「已複製」文字（500ms 後 reset）

## 6. Audit Log 頁面 — 來源 IP 遮蔽

- [x] 6.1 撰寫 `maskIp(ip: string): string` utility：IPv4 拆 4 段，保留首尾兩段，中間替換為 `*`；非標準格式 fallback 原值
- [x] 6.2 在頁面層級新增 `maskIp` 開關狀態（`useState(true)`），並在來源 IP 欄標頭上方加入 shadcn/ui `<Switch>` 控制開關
- [x] 6.3 「來源 IP」欄 cell renderer 依開關狀態決定呼叫 `maskIp(ip)` 或直接顯示原始 `ip`

## 7. 日期欄位回填修正

- [x] 7.1 在車輛表單（`VehicleForm` 或 `VehicleDialog`）中，將 `purchasedAt` 的 `defaultValues` / `reset()` 傳入值改為 `isoDateString.slice(0, 10)`，確保 `<input type="date">` 正確顯示 `YYYY-MM-DD`
- [x] 7.2 在員工表單（`EmployeeForm` 或 `EmployeeDialog`）中，將 `hiredAt` 的 `defaultValues` / `reset()` 傳入值同樣改為 `isoDateString.slice(0, 10)`

## 8. 測試

- [x] 8.1 補充 / 更新 audit log 頁面的 Vitest 測試：複選動作篩選送出正確 query string、結果複選、IP 遮蔽開關切換、動作欄中文標籤顯示
- [x] 8.2 補充 / 更新 audit log 頁面的 Vitest 測試：API 參數 tooltip 有實質 metadata 時顯示觸發點、無 metadata 時顯示 `—`
- [x] 8.3 補充 / 更新 VehicleForm Vitest 測試：編輯時 `purchasedAt` 欄位值為 `YYYY-MM-DD` 格式
- [x] 8.4 補充 / 更新 EmployeeForm Vitest 測試：編輯時 `hiredAt` 欄位值為 `YYYY-MM-DD` 格式
- [x] 8.5 執行 `npm test` 確認所有測試綠燈，pre-commit hook 通過
