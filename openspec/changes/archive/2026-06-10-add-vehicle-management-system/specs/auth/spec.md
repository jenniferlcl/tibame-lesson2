## ADDED Requirements

### Requirement: User can log in with username and password
The system SHALL authenticate users via username/password and issue a JWT stored in an HttpOnly cookie. The JWT payload SHALL include `userId`, `role`, and `exp`.

#### Scenario: Successful login as admin
- **WHEN** admin submits valid username and password
- **THEN** system returns HTTP 200, sets HttpOnly cookie containing JWT, and responds with `{ role: "admin" }`

#### Scenario: Successful login as regular user
- **WHEN** user submits valid username and password
- **THEN** system returns HTTP 200, sets HttpOnly cookie containing JWT, and responds with `{ role: "user" }`

#### Scenario: Login with incorrect password
- **WHEN** user submits incorrect password
- **THEN** system returns HTTP 401 with error message, no cookie is set

#### Scenario: Login with non-existent username
- **WHEN** user submits a username that does not exist
- **THEN** system returns HTTP 401 with generic error message (no username enumeration)

### Requirement: User can log out
The system SHALL provide a logout endpoint that clears the JWT cookie.

#### Scenario: Successful logout
- **WHEN** authenticated user calls POST /api/auth/logout
- **THEN** system clears the JWT cookie and returns HTTP 200

### Requirement: Protected routes require authentication
The system SHALL reject unauthenticated requests to protected API endpoints.

#### Scenario: Unauthenticated access to protected endpoint
- **WHEN** request arrives without valid JWT cookie
- **THEN** system returns HTTP 401

#### Scenario: Expired JWT
- **WHEN** request arrives with an expired JWT cookie
- **THEN** system returns HTTP 401

### Requirement: Admin-only routes require admin role
The system SHALL reject non-admin authenticated requests to admin-only endpoints.

#### Scenario: Regular user accesses admin endpoint
- **WHEN** authenticated user with role `user` calls an admin-only endpoint
- **THEN** system returns HTTP 403

#### Scenario: Admin accesses admin endpoint
- **WHEN** authenticated user with role `admin` calls an admin-only endpoint
- **THEN** system processes the request normally

### Requirement: Frontend redirects unauthenticated users to login page
The system SHALL redirect users who are not authenticated when they access protected pages.

#### Scenario: Unauthenticated access to dashboard
- **WHEN** unauthenticated user navigates to /dashboard
- **THEN** system redirects to /login

#### Scenario: Regular user accesses employee management page
- **WHEN** authenticated user with role `user` navigates to /employees
- **THEN** system shows 403 page or redirects to /dashboard
