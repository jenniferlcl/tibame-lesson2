## ADDED Requirements

### Requirement: Only admin can access the employee management page
The system SHALL restrict the employee management page and all related API endpoints to users with role `admin`.

#### Scenario: Regular user navigates to /employees
- **WHEN** authenticated user with role `user` navigates to /employees
- **THEN** system redirects to /dashboard or shows a 403 page; the nav link SHALL NOT be visible to regular users

#### Scenario: Regular user calls employee API endpoint
- **WHEN** user with role `user` calls any /api/employees endpoint
- **THEN** system returns HTTP 403

### Requirement: Admin can view the employee list
The system SHALL display a list of all employees to admin users.

#### Scenario: Admin views employee list
- **WHEN** admin navigates to /employees
- **THEN** system displays a table with columns: 員工編號、姓名、部門、Email、電話、帳號（username）

#### Scenario: Admin searches employees by name
- **WHEN** admin enters a partial name in the search field
- **THEN** system filters the employee list to matching results

### Requirement: Admin can add a new employee
The system SHALL allow admin to create a new employee record with a linked login account.

#### Scenario: Admin creates a new employee with required fields
- **WHEN** admin submits the employee form with employee_no, name, department, email, phone, username, password, and role
- **THEN** system creates the employee record and an associated user account, displaying the new employee in the list

#### Scenario: Admin creates an employee with duplicate username
- **WHEN** admin submits a form with a username already in the system
- **THEN** system returns an error indicating the username already exists

#### Scenario: Admin creates an employee with missing required fields
- **WHEN** admin submits the form with missing required fields
- **THEN** system displays validation errors and does not create the record

### Requirement: Admin can edit an existing employee
The system SHALL allow admin to update employee information and associated account details.

#### Scenario: Admin updates employee department
- **WHEN** admin changes the department field and saves
- **THEN** system updates the employee record and reflects the change in the list

#### Scenario: Admin changes employee role to admin
- **WHEN** admin changes the role field from `user` to `admin` and saves
- **THEN** system updates the user account role accordingly

### Requirement: Admin can delete an employee
The system SHALL allow admin to delete an employee record and its linked user account.

#### Scenario: Admin deletes an employee not assigned to any vehicle
- **WHEN** admin clicks delete on an employee with no assigned vehicles and confirms
- **THEN** system removes the employee and the linked user account; the employee no longer appears in the list

#### Scenario: Admin deletes an employee assigned to a vehicle
- **WHEN** admin attempts to delete an employee who is currently assigned to one or more vehicles
- **THEN** system returns an error indicating the employee must be unassigned from all vehicles before deletion

### Requirement: Employee record includes the following fields
The system SHALL store and display: employee_no (員工編號), name (姓名), department (部門), email (Email), phone (電話), username (帳號), role (`admin`|`user`).

#### Scenario: Employee detail view shows all fields
- **WHEN** admin opens an employee's edit form
- **THEN** all fields are displayed with current values; password field is empty (reset only)
