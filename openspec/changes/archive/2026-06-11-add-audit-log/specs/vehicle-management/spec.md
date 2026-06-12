## ADDED Requirements

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
