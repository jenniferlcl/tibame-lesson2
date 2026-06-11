## MODIFIED Requirements

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
系統 SHALL 允許已登入用戶透過 shadcn/ui Dialog + Form 新增車輛。表單中 `status` 欄位 MUST 為 shadcn/ui Select（可用 / 使用中 / 維修中 / 報廢），`brand` 欄位 MUST 為 shadcn/ui Select（Toyota / Honda / Ford / Mazda / Nissan / Mitsubishi / BMW / Mercedes-Benz / 其他）。後端 `POST /api/vehicles` MUST 驗證 `status` 為合法 ENUM 值，違規回傳 `400 { message: 'Invalid status value' }`。

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

#### Scenario: 後端拒絕非法 status 值
- **WHEN** 呼叫 POST /api/vehicles 並帶入 `status: 'broken'`
- **THEN** 後端回傳 `400 { message: 'Invalid status value' }`

#### Scenario: 車牌重複
- **WHEN** 使用者提交的車牌號碼已存在
- **THEN** 系統回傳錯誤，Dialog 顯示車牌已存在提示

#### Scenario: 缺少必填欄位
- **WHEN** 使用者提交的表單缺少必填欄位
- **THEN** Dialog 顯示驗證錯誤，不建立記錄

### Requirement: 已登入使用者可編輯車輛
系統 SHALL 允許已登入用戶透過 shadcn/ui Dialog + Form 編輯現有車輛。`status` 與 `brand` MUST 以 shadcn/ui Select 呈現，預設值為當前值。

#### Scenario: 使用者開啟編輯對話框
- **WHEN** 使用者點擊某車輛的編輯按鈕
- **THEN** shadcn/ui Dialog 開啟，`status` 與 `brand` Select 預設顯示該車輛當前值

#### Scenario: 使用者指派車輛給員工
- **WHEN** 使用者從指派員工 Select 選擇員工並儲存
- **THEN** 系統更新 assigned_employee_id，狀態設為使用中，Dialog 關閉

#### Scenario: 使用者清除車輛指派員工
- **WHEN** 使用者移除指派員工並儲存
- **THEN** 系統將 assigned_employee_id 設為 null，狀態恢復為可用
