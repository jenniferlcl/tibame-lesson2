## ADDED Requirements

### Requirement: Dashboard displays KPI summary cards
The system SHALL display four KPI cards at the top of the dashboard page with real-time counts fetched from the API.

#### Scenario: Admin views dashboard KPI cards
- **WHEN** authenticated user navigates to /dashboard
- **THEN** system displays four cards: 車輛總數、可用車輛數、維修中車輛數、員工人數

#### Scenario: KPI data reflects current database state
- **WHEN** a vehicle status is changed and the dashboard is refreshed
- **THEN** KPI cards display updated counts

### Requirement: Dashboard displays vehicle status distribution chart
The system SHALL display a pie chart showing the count and percentage of vehicles in each status (可用、使用中、維修中、報廢).

#### Scenario: Pie chart renders with vehicle data
- **WHEN** there are vehicles in the database with varied statuses
- **THEN** pie chart shows each status segment with label and count

#### Scenario: Pie chart shows empty state
- **WHEN** there are no vehicles in the database
- **THEN** pie chart shows an empty state message

### Requirement: Dashboard displays monthly vehicle trend chart
The system SHALL display a line or bar chart showing monthly counts of vehicles added or active over the past 6 months.

#### Scenario: Trend chart renders with historical data
- **WHEN** there are vehicles with creation dates spanning multiple months
- **THEN** chart shows monthly breakdown for the past 6 months

#### Scenario: Trend chart shows placeholder when no data
- **WHEN** there is no historical vehicle data
- **THEN** chart shows a message indicating no data available

### Requirement: Dashboard is accessible to all authenticated users
The system SHALL allow both admin and regular users to view the dashboard.

#### Scenario: Regular user views dashboard
- **WHEN** authenticated user with role `user` navigates to /dashboard
- **THEN** system renders the full dashboard with KPI cards and charts
