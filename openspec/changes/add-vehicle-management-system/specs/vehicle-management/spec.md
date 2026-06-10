## ADDED Requirements

### Requirement: All authenticated users can view the vehicle list
The system SHALL display a paginated, searchable list of vehicles accessible to all authenticated users.

#### Scenario: User views vehicle list
- **WHEN** authenticated user navigates to /vehicles
- **THEN** system displays a table with columns: 車牌、廠牌、車型、顏色、年份、里程、狀態、指派員工

#### Scenario: User searches vehicles by plate number
- **WHEN** user enters a partial plate number in the search field
- **THEN** system filters the vehicle list to matching results

#### Scenario: User filters vehicles by status
- **WHEN** user selects a status from the filter dropdown
- **THEN** system displays only vehicles with the selected status

### Requirement: All authenticated users can add a new vehicle
The system SHALL allow both admin and regular users to create a new vehicle record.

#### Scenario: User adds a vehicle with all required fields
- **WHEN** user submits a valid vehicle form (plate, brand, model, color, year, mileage, status)
- **THEN** system creates the vehicle record and displays it in the list

#### Scenario: User submits vehicle form with duplicate plate number
- **WHEN** user submits a form with a plate number already in the system
- **THEN** system returns an error indicating the plate number already exists

#### Scenario: User submits vehicle form with missing required fields
- **WHEN** user submits a form missing required fields (e.g., plate)
- **THEN** system displays validation errors and does not create the record

### Requirement: All authenticated users can edit an existing vehicle
The system SHALL allow both admin and regular users to modify vehicle information.

#### Scenario: User edits vehicle status to 維修中
- **WHEN** user opens a vehicle's edit form, changes status to 維修中, and submits
- **THEN** system updates the vehicle status and reflects the change in the list

#### Scenario: User assigns a vehicle to an employee
- **WHEN** user selects an employee from the assigned employee dropdown and saves
- **THEN** system updates the vehicle's assigned_employee_id and sets status to 使用中

#### Scenario: User clears the assigned employee from a vehicle
- **WHEN** user removes the assigned employee and saves
- **THEN** system sets assigned_employee_id to null and status reverts to 可用

### Requirement: Only admin can delete a vehicle
The system SHALL allow only users with role `admin` to delete a vehicle record.

#### Scenario: Admin deletes a vehicle
- **WHEN** admin clicks delete on a vehicle and confirms the action
- **THEN** system removes the vehicle record and it no longer appears in the list

#### Scenario: Regular user attempts to delete a vehicle
- **WHEN** user with role `user` attempts to call DELETE /api/vehicles/:id
- **THEN** system returns HTTP 403; the delete button SHALL NOT be visible in the UI for regular users

### Requirement: Vehicle record includes the following fields
The system SHALL store and display these fields for each vehicle: plate (車牌號碼), brand (廠牌), model (車型), color (顏色), year (年份), mileage (里程, km), status (狀態), assigned_employee_id (指派員工).

#### Scenario: Vehicle detail view shows all fields
- **WHEN** user opens a vehicle's detail or edit panel
- **THEN** all fields are displayed with current values

### Requirement: Vehicle status transitions are constrained
The system SHALL enforce valid vehicle status values: `available`(可用), `in_use`(使用中), `maintenance`(維修中), `retired`(報廢).

#### Scenario: Retired vehicle cannot be assigned to an employee
- **WHEN** user attempts to assign an employee to a vehicle with status 報廢
- **THEN** system returns a validation error and rejects the assignment
