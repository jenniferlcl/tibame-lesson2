## MODIFIED Requirements

### Requirement: 新增員工
系統 SHALL 允許管理者透過表單新增員工（同時建立對應 user 帳號）。表單中 `department` 欄位 MUST 為下拉選單（業務部 / 工程部 / 管理部 / 資訊部 / 財務部），`role` 欄位 MUST 為下拉選單（一般使用者 / 管理者）。後端 `POST /api/employees` MUST 驗證 `department` 在允許清單內且 `role` 為 `admin` 或 `user`，違規回傳 `400 { message: '...' }`。

#### Scenario: department 下拉選單限制
- **WHEN** 管理者開啟新增員工表單
- **THEN** `department` 欄位顯示為下拉選單，選項為「業務部、工程部、管理部、資訊部、財務部」，不允許自由文字輸入

#### Scenario: role 下拉選單限制
- **WHEN** 管理者開啟新增員工表單
- **THEN** `role` 欄位顯示為下拉選單，選項為「一般使用者（user）、管理者（admin）」，不允許自由文字輸入

#### Scenario: 後端拒絕非法 department 值
- **WHEN** 呼叫 `POST /api/employees` 並帶入 `department: '不存在部門'`
- **THEN** 後端回傳 `400 { message: 'Invalid department value' }`

#### Scenario: 後端拒絕非法 role 值
- **WHEN** 呼叫 `POST /api/employees` 並帶入 `role: 'superadmin'`
- **THEN** 後端回傳 `400 { message: 'Invalid role value' }`

### Requirement: 編輯員工
系統 SHALL 允許管理者透過表單編輯員工資料。`department` 與 `role` 欄位 MUST 以下拉選單呈現，預設值為該員工的當前值。後端 `PUT /api/employees/:id` MUST 驗證 `department` 與 `role` 為合法值。

#### Scenario: 編輯表單預填當前值
- **WHEN** 管理者點擊某員工的編輯按鈕
- **THEN** 表單開啟，`department` 與 `role` 下拉選單預設顯示該員工的當前值

#### Scenario: 後端拒絕非法值（PUT）
- **WHEN** 呼叫 `PUT /api/employees/:id` 並帶入非合法 department 或 role 值
- **THEN** 後端回傳 `400 { message: '...' }`
