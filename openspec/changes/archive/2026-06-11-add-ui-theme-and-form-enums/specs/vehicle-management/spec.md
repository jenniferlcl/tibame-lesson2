## MODIFIED Requirements

### Requirement: 已登入使用者可新增車輛
系統 SHALL 允許已登入用戶透過 shadcn/ui Dialog + Form 新增車輛。表單中 `status` 欄位 MUST 為 shadcn/ui Select（可用 / 使用中 / 維修中 / 報廢），`brand` 欄位 MUST 為 shadcn/ui Select（Toyota / Honda / Ford / Mazda / Nissan / Mitsubishi / BMW / Mercedes-Benz / 其他），`color` 欄位 MUST 為 shadcn/ui Select（白色 / 銀色 / 黑色 / 灰色 / 紅色 / 藍色 / 棕色 / 橘色 / 黃色 / 綠色 / 其他）。後端 `POST /api/vehicles` MUST 驗證 `status`、`brand`、`color` 均為合法 ENUM 值，違規分別回傳 `400 { message: 'Invalid status value' }`、`400 { message: 'Invalid brand value' }`、`400 { message: 'Invalid color value' }`。

#### Scenario: 使用者開啟新增對話框
- **WHEN** 使用者點擊「新增車輛」按鈕
- **THEN** shadcn/ui Dialog 開啟，顯示新增車輛表單

#### Scenario: 使用者成功新增車輛
- **WHEN** 使用者填寫完整表單（plate、brand、model 必填）並送出
- **THEN** 系統呼叫 POST /api/vehicles，車輛建立成功回傳 201，Dialog 關閉，新車輛顯示於列表

#### Scenario: status 下拉選單限制
- **WHEN** 使用者開啟新增車輛 Dialog
- **THEN** `status` 欄位顯示為 shadcn/ui Select，選項為「可用、使用中、維修中、報廢」

#### Scenario: brand 下拉選單限制
- **WHEN** 使用者開啟新增車輛 Dialog
- **THEN** `brand` 欄位顯示為 shadcn/ui Select，選項為 Toyota、Honda、Ford、Mazda、Nissan、Mitsubishi、BMW、Mercedes-Benz、其他

#### Scenario: color 下拉選單限制
- **WHEN** 使用者開啟新增車輛 Dialog
- **THEN** `color` 欄位顯示為 shadcn/ui Select，選項為白色、銀色、黑色、灰色、紅色、藍色、棕色、橘色、黃色、綠色、其他

#### Scenario: 後端拒絕非法 status 值
- **WHEN** 呼叫 POST /api/vehicles 並帶入 `status: 'broken'`（非合法 ENUM 值）
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

#### Scenario: 後端拒絕非法 brand 值
- **WHEN** 呼叫 POST /api/vehicles 並帶入 `brand: 'Unknown'`（非合法 ENUM 值）
- **THEN** 後端回傳 `400 { message: 'Invalid brand value' }`

#### Scenario: 後端拒絕非法 color 值
- **WHEN** 呼叫 POST /api/vehicles 並帶入 `color: 'purple'`（非合法 ENUM 值）
- **THEN** 後端回傳 `400 { message: 'Invalid color value' }`

#### Scenario: 車牌重複
- **WHEN** 使用者提交的車牌號碼已存在
- **THEN** 系統回傳錯誤，Dialog 顯示車牌已存在提示

#### Scenario: 缺少必填欄位
- **WHEN** 使用者提交的表單缺少必填欄位
- **THEN** Dialog 顯示驗證錯誤，不建立記錄

### Requirement: 已登入使用者可編輯車輛
系統 SHALL 允許已登入用戶透過 shadcn/ui Dialog + Form 編輯現有車輛。`status`、`brand`、`color` MUST 以 shadcn/ui Select 呈現，預設值為當前值。後端 `PUT /api/vehicles/:id` MUST 驗證 `brand`、`color` 為合法 ENUM 值，違規回傳 400。

#### Scenario: 使用者開啟編輯對話框
- **WHEN** 使用者點擊某車輛的編輯按鈕
- **THEN** shadcn/ui Dialog 開啟，`status`、`brand`、`color` Select 預設顯示該車輛當前值

#### Scenario: 使用者指派車輛給員工
- **WHEN** 使用者從指派員工 Select 選擇員工並儲存
- **THEN** 系統更新 assigned_employee_id，狀態設為使用中，Dialog 關閉

#### Scenario: 使用者清除車輛指派員工
- **WHEN** 使用者移除指派員工並儲存
- **THEN** 系統將 assigned_employee_id 設為 null，狀態恢復為可用

#### Scenario: 後端拒絕非法 status 值（PUT）
- **WHEN** 呼叫 PUT /api/vehicles/:id 並帶入非合法 status 值
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

#### Scenario: 後端拒絕非法 brand 值（PUT）
- **WHEN** 呼叫 PUT /api/vehicles/:id 並帶入非合法 brand 值
- **THEN** 後端回傳 `400 { message: 'Invalid brand value' }`

#### Scenario: 後端拒絕非法 color 值（PUT）
- **WHEN** 呼叫 PUT /api/vehicles/:id 並帶入非合法 color 值
- **THEN** 後端回傳 `400 { message: 'Invalid color value' }`
