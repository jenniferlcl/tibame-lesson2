## Requirements

### Requirement: 使用者可以用帳號密碼登入
系統 SHALL 以帳號/密碼驗證使用者身份，並將 JWT 寫入 HttpOnly Cookie。JWT payload SHALL 包含 `userId`、`role` 與 `exp`。

#### Scenario: 管理者登入成功
- **WHEN** admin 提交正確的帳號與密碼
- **THEN** 系統回傳 HTTP 200，設置含 JWT 的 HttpOnly Cookie，並回應 `{ role: "admin" }`

#### Scenario: 一般使用者登入成功
- **WHEN** user 提交正確的帳號與密碼
- **THEN** 系統回傳 HTTP 200，設置含 JWT 的 HttpOnly Cookie，並回應 `{ role: "user" }`

#### Scenario: 密碼錯誤
- **WHEN** 使用者提交錯誤密碼
- **THEN** 系統回傳 HTTP 401 含錯誤訊息，不設置 Cookie

#### Scenario: 帳號不存在
- **WHEN** 使用者提交不存在的帳號
- **THEN** 系統回傳 HTTP 401 含通用錯誤訊息（不暴露帳號是否存在）

### Requirement: 使用者可以登出
系統 SHALL 提供登出端點，清除 JWT Cookie。

#### Scenario: 登出成功
- **WHEN** 已登入使用者呼叫 POST /api/auth/logout
- **THEN** 系統清除 JWT Cookie 並回傳 HTTP 200

### Requirement: 受保護的路由需要驗證
系統 SHALL 拒絕未攜帶有效 JWT Cookie 的請求存取受保護的 API 端點。

#### Scenario: 未驗證請求存取受保護端點
- **WHEN** 請求未攜帶有效 JWT Cookie
- **THEN** 系統回傳 HTTP 401

#### Scenario: JWT 已過期
- **WHEN** 請求攜帶已過期的 JWT Cookie
- **THEN** 系統回傳 HTTP 401

### Requirement: 管理者專屬路由需要 admin 角色
系統 SHALL 拒絕非 admin 角色的已登入使用者存取管理者專屬端點。

#### Scenario: 一般使用者存取管理者端點
- **WHEN** role 為 `user` 的已登入使用者呼叫管理者專屬端點
- **THEN** 系統回傳 HTTP 403

#### Scenario: admin 存取管理者端點
- **WHEN** role 為 `admin` 的已登入使用者呼叫管理者專屬端點
- **THEN** 系統正常處理請求

### Requirement: 前端將未登入使用者重導至登入頁
系統 SHALL 在使用者未登入時存取受保護頁面時重導至 /login。

#### Scenario: 未登入存取儀表板
- **WHEN** 未登入使用者瀏覽至 /dashboard
- **THEN** 系統重導至 /login

#### Scenario: 一般使用者存取員工管理頁
- **WHEN** role 為 `user` 的已登入使用者瀏覽至 /employees
- **THEN** 系統重導至 /dashboard 或顯示 403 頁面；導覽選單 SHALL NOT 對一般使用者顯示該連結
