## ADDED Requirements

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
