## Requirements

### Requirement: 已登入使用者可檢視車輛列表
系統 SHALL 顯示車輛列表，使用 shadcn/ui Table 元件，所有已登入使用者均可存取。列表 SHALL 支援依車牌、年份、里程、狀態欄位進行前端排序（點擊欄位標題切換升冪/降冪）。

#### Scenario: 使用者檢視車輛列表
- **WHEN** 已登入使用者瀏覽至 /vehicles
- **THEN** 系統以 shadcn/ui Table 顯示表格，欄位包含：車牌、廠牌、車型、顏色、年份、里程、狀態、指派員工

#### Scenario: 使用者以車牌搜尋車輛
- **WHEN** 使用者在搜尋欄位輸入部分車牌號碼
- **THEN** 系統過濾車輛列表，僅顯示符合的結果

#### Scenario: 使用者依狀態過濾車輛
- **WHEN** 使用者從過濾下拉選單選擇狀態
- **THEN** 系統僅顯示該狀態的車輛

#### Scenario: 使用者點擊欄位標題排序
- **WHEN** 使用者點擊「年份」欄位標題
- **THEN** 列表依年份升冪排列；再次點擊改為降冪排列

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

### Requirement: 車輛異動自動觸發 audit log
系統 SHALL 在車輛成功新增、更新或刪除後，自動非同步寫入一筆 audit log，紀錄操作者、動作與車輛 ID；此寫入操作 SHALL NOT 影響原 API 回應時間或結果。

#### Scenario: 新增車輛觸發 audit log
- **WHEN** POST /api/vehicles 成功回傳 201
- **THEN** 系統在背景寫入 audit log（action=create, resource_type=vehicle）

#### Scenario: 更新車輛觸發 audit log
- **WHEN** PUT /api/vehicles/:id 成功回傳 200
- **THEN** 系統在背景寫入 audit log（action=update, resource_type=vehicle）

#### Scenario: 刪除車輛觸發 audit log
- **WHEN** DELETE /api/vehicles/:id 成功回傳 204
- **THEN** 系統在背景寫入 audit log（action=delete, resource_type=vehicle）

### Requirement: 車輛狀態值受限
系統 SHALL 強制執行合法的車輛狀態值：`available`（可用）、`in_use`（使用中）、`maintenance`（維修中）、`retired`（報廢）。

#### Scenario: 報廢車輛不可指派員工
- **WHEN** 使用者嘗試將員工指派給狀態為報廢的車輛
- **THEN** 系統回傳驗證錯誤，拒絕此指派操作
