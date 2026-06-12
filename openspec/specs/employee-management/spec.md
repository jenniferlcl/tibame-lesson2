## Requirements

### Requirement: 僅管理者可存取員工管理頁
系統 SHALL 將員工管理頁面及所有相關 API 端點限制為 role 為 `admin` 的使用者。

#### Scenario: 一般使用者瀏覽至 /employees
- **WHEN** role 為 `user` 的已登入使用者瀏覽至 /employees
- **THEN** 系統重導至 /dashboard 或顯示 403 頁面；導覽選單 SHALL NOT 對一般使用者顯示該連結

#### Scenario: 一般使用者呼叫員工 API 端點
- **WHEN** role 為 `user` 的使用者呼叫任何 /api/employees 端點
- **THEN** 系統回傳 HTTP 403

### Requirement: 管理者可檢視員工列表
系統 SHALL 向管理者顯示所有員工的列表。

#### Scenario: 管理者檢視員工列表
- **WHEN** admin 瀏覽至 /employees
- **THEN** 系統顯示表格，欄位包含：員工編號、姓名、部門、Email、電話、帳號（username）

#### Scenario: 管理者依姓名搜尋員工
- **WHEN** admin 在搜尋欄位輸入部分姓名
- **THEN** 系統過濾員工列表，僅顯示符合的結果

### Requirement: 管理者可新增員工
系統 SHALL 允許管理者透過 shadcn/ui Dialog + Form 新增員工（同時建立對應 user 帳號）。`department` 欄位 MUST 為 shadcn/ui Select（業務部 / 工程部 / 管理部 / 資訊部 / 財務部），`role` 欄位 MUST 為 shadcn/ui Select（一般使用者 / 管理者）。後端驗證行為不變。

#### Scenario: 管理者開啟新增員工對話框
- **WHEN** admin 點擊「新增員工」按鈕
- **THEN** shadcn/ui Dialog 開啟，顯示新增員工表單

#### Scenario: department 下拉選單限制
- **WHEN** 管理者開啟新增員工 Dialog
- **THEN** `department` 欄位顯示為 shadcn/ui Select，選項為「業務部、工程部、管理部、資訊部、財務部」

#### Scenario: role 下拉選單限制
- **WHEN** 管理者開啟新增員工 Dialog
- **THEN** `role` 欄位顯示為 shadcn/ui Select，選項為「一般使用者（user）、管理者（admin）」

#### Scenario: 管理者成功建立員工
- **WHEN** admin 提交含所有必填欄位的表單
- **THEN** 系統建立員工記錄及關聯 user 帳號，Dialog 關閉，新員工顯示於列表

#### Scenario: 後端拒絕非法 department 值
- **WHEN** 呼叫 POST /api/employees 並帶入 `department: '不存在部門'`
- **THEN** 後端回傳 `400 { message: 'Invalid department value' }`

#### Scenario: 後端拒絕非法 role 值
- **WHEN** 呼叫 POST /api/employees 並帶入 `role: 'superadmin'`
- **THEN** 後端回傳 `400 { message: 'Invalid role value' }`

#### Scenario: 帳號重複
- **WHEN** admin 提交已存在的 username
- **THEN** Dialog 顯示帳號已存在錯誤，不建立記錄

#### Scenario: 缺少必填欄位
- **WHEN** admin 提交缺少必填欄位的表單
- **THEN** 系統顯示驗證錯誤，不建立記錄

### Requirement: 管理者可編輯員工
系統 SHALL 允許管理者透過 shadcn/ui Dialog + Form 編輯員工資料。`department` 與 `role` MUST 以 shadcn/ui Select 呈現，預設值為當前值。

#### Scenario: 管理者開啟編輯對話框
- **WHEN** admin 點擊某員工的編輯按鈕
- **THEN** shadcn/ui Dialog 開啟，`department` 與 `role` Select 預設顯示該員工當前值

#### Scenario: 管理者修改員工部門
- **WHEN** admin 修改 department 欄位並儲存
- **THEN** 系統更新員工記錄，Dialog 關閉，列表反映變更

#### Scenario: 管理者將員工角色升為 admin
- **WHEN** admin 將 role 從 `user` 改為 `admin` 並儲存
- **THEN** 系統更新對應 user 帳號的 role，Dialog 關閉

#### Scenario: 後端拒絕非法值（PUT）
- **WHEN** 呼叫 PUT /api/employees/:id 並帶入非合法 department 或 role 值
- **THEN** 後端回傳 `400 { message: '...' }`

### Requirement: 管理者可刪除員工
系統 SHALL 允許管理者刪除員工記錄及其關聯的 user 帳號。

#### Scenario: 刪除無指派車輛的員工
- **WHEN** admin 點擊無指派車輛之員工的刪除按鈕並確認
- **THEN** 系統刪除員工及關聯 user 帳號，該員工不再出現於列表中

#### Scenario: 刪除仍有指派車輛的員工
- **WHEN** admin 嘗試刪除仍指派給一台或多台車輛的員工
- **THEN** 系統回傳錯誤，提示需先解除所有車輛指派後再刪除

### Requirement: 員工異動自動觸發 audit log
系統 SHALL 在員工成功新增、更新或刪除後，自動非同步寫入一筆 audit log，紀錄操作者、動作與員工 ID；此寫入操作 SHALL NOT 影響原 API 回應時間或結果。

#### Scenario: 新增員工觸發 audit log
- **WHEN** POST /api/employees 成功回傳 201
- **THEN** 系統在背景寫入 audit log（action=create, resource_type=employee）

#### Scenario: 更新員工觸發 audit log
- **WHEN** PUT /api/employees/:id 成功回傳 200
- **THEN** 系統在背景寫入 audit log（action=update, resource_type=employee）

#### Scenario: 刪除員工觸發 audit log
- **WHEN** DELETE /api/employees/:id 成功回傳 204
- **THEN** 系統在背景寫入 audit log（action=delete, resource_type=employee）

### Requirement: 員工記錄欄位
系統 SHALL 儲存並顯示以下欄位：employee_no（員工編號）、name（姓名）、department（部門）、email（Email）、phone（電話）、username（帳號）、role（`admin` | `user`）。

#### Scenario: 員工詳情顯示所有欄位
- **WHEN** admin 開啟員工的編輯表單
- **THEN** 所有欄位均以當前值顯示；密碼欄位留空（僅重設時填寫）
