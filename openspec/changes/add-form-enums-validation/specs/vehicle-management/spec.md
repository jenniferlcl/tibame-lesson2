## MODIFIED Requirements

### Requirement: 新增車輛
系統 SHALL 允許已登入用戶透過表單新增車輛。表單中 `status` 欄位 MUST 為下拉選單（可用 / 使用中 / 維修中 / 報廢），`brand` 欄位 MUST 為下拉選單（Toyota / Honda / Ford / Mazda / Nissan / Mitsubishi / BMW / Mercedes-Benz / 其他）。後端 `POST /api/vehicles` MUST 驗證 `status` 為合法 ENUM 值，違規回傳 `400 { message: 'Invalid status value' }`。

#### Scenario: 成功新增車輛
- **WHEN** 用戶填寫完整表單（plate、brand、model 必填）並送出
- **THEN** 系統呼叫 `POST /api/vehicles`，車輛建立成功，回傳 201

#### Scenario: status 下拉選單限制
- **WHEN** 用戶開啟新增車輛表單
- **THEN** `status` 欄位顯示為下拉選單，選項為「可用、使用中、維修中、報廢」，不允許自由文字輸入

#### Scenario: 後端拒絕非法 status 值
- **WHEN** 呼叫 `POST /api/vehicles` 並帶入 `status: 'broken'`（非合法 ENUM 值）
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

### Requirement: 編輯車輛
系統 SHALL 允許已登入用戶透過表單編輯現有車輛。`status` 與 `brand` 欄位 MUST 以下拉選單呈現，預設值為該車輛的當前值。後端 `PUT /api/vehicles/:id` MUST 驗證 `status` 為合法 ENUM 值。

#### Scenario: 編輯表單預填當前值
- **WHEN** 用戶點擊某車輛的編輯按鈕
- **THEN** 表單開啟，`status` 與 `brand` 下拉選單預設顯示該車輛的當前值

#### Scenario: 後端拒絕非法 status 值（PUT）
- **WHEN** 呼叫 `PUT /api/vehicles/:id` 並帶入非合法 status 值
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`
