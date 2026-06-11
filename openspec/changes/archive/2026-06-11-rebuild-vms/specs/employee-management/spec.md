## MODIFIED Requirements

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

#### Scenario: 帳號重複
- **WHEN** admin 提交已存在的 username
- **THEN** Dialog 顯示帳號已存在錯誤，不建立記錄

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
