## Requirements

### Requirement: 已登入使用者可檢視車輛列表
系統 SHALL 顯示可搜尋的車輛列表，所有已登入使用者均可存取。

#### Scenario: 使用者檢視車輛列表
- **WHEN** 已登入使用者瀏覽至 /vehicles
- **THEN** 系統顯示表格，欄位包含：車牌、廠牌、車型、顏色、年份、里程、狀態、指派員工

#### Scenario: 使用者以車牌搜尋車輛
- **WHEN** 使用者在搜尋欄位輸入部分車牌號碼
- **THEN** 系統過濾車輛列表，僅顯示符合的結果

#### Scenario: 使用者依狀態過濾車輛
- **WHEN** 使用者從過濾下拉選單選擇狀態
- **THEN** 系統僅顯示該狀態的車輛

### Requirement: 已登入使用者可新增車輛
系統 SHALL 允許已登入用戶透過表單新增車輛。表單中 `status` 欄位 MUST 為下拉選單（可用 / 使用中 / 維修中 / 報廢），`brand` 欄位 MUST 為下拉選單（Toyota / Honda / Ford / Mazda / Nissan / Mitsubishi / BMW / Mercedes-Benz / 其他）。後端 `POST /api/vehicles` MUST 驗證 `status` 為合法 ENUM 值，違規回傳 `400 { message: 'Invalid status value' }`。

#### Scenario: 使用者成功新增車輛
- **WHEN** 使用者填寫完整表單（plate、brand、model 必填）並送出
- **THEN** 系統呼叫 POST /api/vehicles，車輛建立成功，回傳 201，並顯示於列表中

#### Scenario: status 下拉選單限制
- **WHEN** 使用者開啟新增車輛表單
- **THEN** `status` 欄位顯示為下拉選單，選項為「可用、使用中、維修中、報廢」，不允許自由文字輸入

#### Scenario: brand 下拉選單限制
- **WHEN** 使用者開啟新增車輛表單
- **THEN** `brand` 欄位顯示為下拉選單，選項為 Toyota、Honda、Ford、Mazda、Nissan、Mitsubishi、BMW、Mercedes-Benz、其他

#### Scenario: 後端拒絕非法 status 值
- **WHEN** 呼叫 POST /api/vehicles 並帶入 `status: 'broken'`（非合法 ENUM 值）
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

#### Scenario: 車牌重複
- **WHEN** 使用者提交的車牌號碼已存在於系統中
- **THEN** 系統回傳錯誤，指出車牌號碼已存在

#### Scenario: 缺少必填欄位
- **WHEN** 使用者提交的表單缺少必填欄位（如 plate）
- **THEN** 系統顯示驗證錯誤，不建立記錄

### Requirement: 已登入使用者可編輯車輛
系統 SHALL 允許已登入用戶透過表單編輯現有車輛。`status` 與 `brand` 欄位 MUST 以下拉選單呈現，預設值為該車輛的當前值。後端 `PUT /api/vehicles/:id` MUST 驗證 `status` 為合法 ENUM 值。

#### Scenario: 編輯表單預填當前值
- **WHEN** 使用者點擊某車輛的編輯按鈕
- **THEN** 表單開啟，`status` 與 `brand` 下拉選單預設顯示該車輛的當前值

#### Scenario: 使用者指派車輛給員工
- **WHEN** 使用者從指派員工下拉選單選擇員工並儲存
- **THEN** 系統更新 assigned_employee_id，狀態設為使用中

#### Scenario: 使用者清除車輛指派員工
- **WHEN** 使用者移除指派員工並儲存
- **THEN** 系統將 assigned_employee_id 設為 null，狀態恢復為可用

#### Scenario: 後端拒絕非法 status 值（PUT）
- **WHEN** 呼叫 PUT /api/vehicles/:id 並帶入非合法 status 值
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

### Requirement: 僅管理者可刪除車輛
系統 SHALL 僅允許 role 為 `admin` 的使用者刪除車輛記錄。

#### Scenario: 管理者刪除車輛
- **WHEN** admin 點擊車輛刪除按鈕並確認操作
- **THEN** 系統刪除車輛記錄，列表中不再顯示該車輛

#### Scenario: 一般使用者嘗試刪除車輛
- **WHEN** role 為 `user` 的使用者嘗試呼叫 DELETE /api/vehicles/:id
- **THEN** 系統回傳 HTTP 403；UI 中一般使用者 SHALL NOT 顯示刪除按鈕

### Requirement: 車輛記錄欄位
系統 SHALL 為每台車輛儲存並顯示以下欄位：plate（車牌號碼）、brand（廠牌）、model（車型）、color（顏色）、year（年份）、mileage（里程，km）、status（狀態）、assigned_employee_id（指派員工）。

#### Scenario: 車輛詳情顯示所有欄位
- **WHEN** 使用者開啟車輛的詳情或編輯面板
- **THEN** 所有欄位均以當前值顯示

### Requirement: 車輛狀態值受限
系統 SHALL 強制執行合法的車輛狀態值：`available`（可用）、`in_use`（使用中）、`maintenance`（維修中）、`retired`（報廢）。

#### Scenario: 報廢車輛不可指派員工
- **WHEN** 使用者嘗試將員工指派給狀態為報廢的車輛
- **THEN** 系統回傳驗證錯誤，拒絕此指派操作
