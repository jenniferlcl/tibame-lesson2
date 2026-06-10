-- Default admin: admin / Admin1234!
-- bcrypt hash of 'Admin1234!' with cost 12
INSERT INTO users (username, password_hash, role) VALUES
  ('admin', '$2b$12$aLl17.Fk4AAjUSMtBQV42OSfcMBrWvMq3nrWVmzuGDG1lB1Bq9EJi', 'admin'),
  ('alice',  '$2b$12$aLl17.Fk4AAjUSMtBQV42OSfcMBrWvMq3nrWVmzuGDG1lB1Bq9EJi', 'user'),
  ('bob',    '$2b$12$aLl17.Fk4AAjUSMtBQV42OSfcMBrWvMq3nrWVmzuGDG1lB1Bq9EJi', 'user')
ON CONFLICT (username) DO NOTHING;

INSERT INTO employees (employee_no, name, department, email, phone, user_id) VALUES
  ('E001', '系統管理員', '資訊部', 'admin@company.com', '02-1234-5678', (SELECT id FROM users WHERE username = 'admin')),
  ('E002', '王小明', '業務部', 'alice@company.com', '0912-345-678', (SELECT id FROM users WHERE username = 'alice')),
  ('E003', '李大華', '工程部', 'bob@company.com', '0923-456-789', (SELECT id FROM users WHERE username = 'bob'))
ON CONFLICT (employee_no) DO NOTHING;

INSERT INTO vehicles (plate, brand, model, color, year, mileage, status, assigned_employee_id) VALUES
  ('ABC-1234', 'Toyota', 'Camry',  '白色', 2021, 35000, 'available',   NULL),
  ('DEF-5678', 'Honda',  'CR-V',   '黑色', 2020, 62000, 'in_use',      (SELECT id FROM employees WHERE employee_no = 'E002')),
  ('GHI-9012', 'Ford',   'Ranger', '銀色', 2019, 89000, 'maintenance', NULL),
  ('JKL-3456', 'Mazda',  'CX-5',   '紅色', 2022, 12000, 'available',   NULL),
  ('MNO-7890', 'Nissan', 'Sentra', '藍色', 2018, 120000,'retired',     NULL)
ON CONFLICT (plate) DO NOTHING;
