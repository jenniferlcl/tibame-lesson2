## MODIFIED Requirements

### Requirement: 使用者可以用帳號密碼登入
系統 SHALL 以帳號/密碼驗證使用者身份，並將 JWT 寫入 HttpOnly Cookie。JWT payload SHALL 包含 `userId`、`role` 與 `exp`。登入表單 SHALL 使用 shadcn/ui Card、Input、Button 元件；驗證失敗 SHALL 以 shadcn/ui Alert 元件顯示錯誤訊息。

#### Scenario: 管理者登入成功
- **WHEN** admin 提交正確的帳號與密碼
- **THEN** 系統回傳 HTTP 200，設置含 JWT 的 HttpOnly Cookie，並回應 `{ role: "admin" }`

#### Scenario: 一般使用者登入成功
- **WHEN** user 提交正確的帳號與密碼
- **THEN** 系統回傳 HTTP 200，設置含 JWT 的 HttpOnly Cookie，並回應 `{ role: "user" }`

#### Scenario: 密碼錯誤
- **WHEN** 使用者提交錯誤密碼
- **THEN** 系統回傳 HTTP 401，前端以 shadcn/ui Alert（destructive variant）顯示錯誤訊息，不設置 Cookie

#### Scenario: 帳號不存在
- **WHEN** 使用者提交不存在的帳號
- **THEN** 系統回傳 HTTP 401 含通用錯誤訊息（不暴露帳號是否存在），前端以 Alert 顯示
