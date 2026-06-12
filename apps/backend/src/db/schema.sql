CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE vehicle_status AS ENUM ('available', 'in_use', 'maintenance', 'retired');

CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'user',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id           SERIAL PRIMARY KEY,
  employee_no  VARCHAR(50) NOT NULL UNIQUE,
  name         VARCHAR(100) NOT NULL,
  department   VARCHAR(100),
  email        VARCHAR(255),
  phone        VARCHAR(50),
  user_id      INT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id                   SERIAL PRIMARY KEY,
  plate                VARCHAR(20) NOT NULL UNIQUE,
  brand                VARCHAR(100) NOT NULL,
  model                VARCHAR(100) NOT NULL,
  color                VARCHAR(50),
  year                 SMALLINT,
  mileage              INT NOT NULL DEFAULT 0,
  status               vehicle_status NOT NULL DEFAULT 'available',
  assigned_employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS audit_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE SET NULL,
  action        VARCHAR(20) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id   INT,
  detail        JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
