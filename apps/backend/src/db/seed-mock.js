'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./pool');

if (process.env.NODE_ENV === 'production') {
  console.error('\x1b[31m[seed-mock] 禁止在生產環境執行！請確認 NODE_ENV 設定。\x1b[0m');
  process.exit(1);
}

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 依外鍵順序清空
    await client.query('DELETE FROM vehicles');
    await client.query('DELETE FROM employees');
    await client.query('DELETE FROM users');

    // 建立用戶（cost 4 加速開發環境 seed）
    const HASH = await bcrypt.hash('Mock1234!', 4);
    const userDefs = [
      { username: 'admin', role: 'admin' },
      { username: 'alice',  role: 'user' },
      { username: 'bob',    role: 'user' },
      { username: 'carol',  role: 'user' },
      { username: 'david',  role: 'user' },
      { username: 'eve',    role: 'user' },
      { username: 'frank',  role: 'user' },
      { username: 'grace',  role: 'user' },
      { username: 'henry',  role: 'user' },
      { username: 'ivan',   role: 'user' },
    ];
    const userIds = {};
    for (const u of userDefs) {
      const { rows } = await client.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        [u.username, HASH, u.role]
      );
      userIds[u.username] = rows[0].id;
    }

    // 建立員工（10 名，跨 4 個部門：業務部×3、工程部×3、管理部×2、資訊部×2）
    const employeeDefs = [
      { no: 'E001', name: '系統管理員', dept: '資訊部',  email: 'admin@company.com',  phone: '02-1000-0001', user: 'admin' },
      { no: 'E002', name: '王小明',    dept: '業務部',  email: 'alice@company.com',   phone: '0912-111-001', user: 'alice' },
      { no: 'E003', name: '李大華',    dept: '工程部',  email: 'bob@company.com',     phone: '0912-111-002', user: 'bob'   },
      { no: 'E004', name: '陳美玲',    dept: '業務部',  email: 'carol@company.com',   phone: '0912-111-003', user: 'carol' },
      { no: 'E005', name: '張志遠',    dept: '管理部',  email: 'david@company.com',   phone: '0912-111-004', user: 'david' },
      { no: 'E006', name: '林淑芬',    dept: '工程部',  email: 'eve@company.com',     phone: '0912-111-005', user: 'eve'   },
      { no: 'E007', name: '黃建國',    dept: '業務部',  email: 'frank@company.com',   phone: '0912-111-006', user: 'frank' },
      { no: 'E008', name: '吳雅婷',    dept: '管理部',  email: 'grace@company.com',   phone: '0912-111-007', user: 'grace' },
      { no: 'E009', name: '劉志豪',    dept: '工程部',  email: 'henry@company.com',   phone: '0912-111-008', user: 'henry' },
      { no: 'E010', name: '謝佳欣',    dept: '資訊部',  email: 'ivan@company.com',    phone: '0912-111-009', user: 'ivan'  },
    ];
    const empIds = {};
    for (const e of employeeDefs) {
      const { rows } = await client.query(
        'INSERT INTO employees (employee_no, name, department, email, phone, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
        [e.no, e.name, e.dept, e.email, e.phone, userIds[e.user]]
      );
      empIds[e.no] = rows[0].id;
    }

    // 建立車輛（15 台：available×5、in_use×4、maintenance×3、retired×3）
    const vehicleDefs = [
      // available × 5
      { plate: 'AAA-0001', brand: 'Toyota',        model: 'Camry',     color: '白色', year: 2022, mileage: 15000, status: 'available',   emp: null   },
      { plate: 'AAA-0002', brand: 'Honda',          model: 'Civic',     color: '銀色', year: 2021, mileage: 28000, status: 'available',   emp: null   },
      { plate: 'AAA-0003', brand: 'Mazda',          model: 'CX-5',      color: '紅色', year: 2023, mileage:  5000, status: 'available',   emp: null   },
      { plate: 'AAA-0004', brand: 'Nissan',         model: 'Sentra',    color: '藍色', year: 2020, mileage: 42000, status: 'available',   emp: null   },
      { plate: 'AAA-0005', brand: 'BMW',            model: '3 Series',  color: '黑色', year: 2022, mileage: 18000, status: 'available',   emp: null   },
      // in_use × 4（指派員工）
      { plate: 'BBB-0001', brand: 'Toyota',         model: 'RAV4',      color: '灰色', year: 2021, mileage: 55000, status: 'in_use',      emp: 'E002' },
      { plate: 'BBB-0002', brand: 'Honda',          model: 'CR-V',      color: '黑色', year: 2020, mileage: 63000, status: 'in_use',      emp: 'E003' },
      { plate: 'BBB-0003', brand: 'Ford',           model: 'Kuga',      color: '白色', year: 2021, mileage: 47000, status: 'in_use',      emp: 'E006' },
      { plate: 'BBB-0004', brand: 'Mitsubishi',     model: 'Outlander', color: '銀色', year: 2019, mileage: 78000, status: 'in_use',      emp: 'E007' },
      // maintenance × 3
      { plate: 'CCC-0001', brand: 'Ford',           model: 'Ranger',    color: '銀色', year: 2018, mileage: 92000, status: 'maintenance', emp: null   },
      { plate: 'CCC-0002', brand: 'Toyota',         model: 'Corolla',   color: '白色', year: 2019, mileage: 85000, status: 'maintenance', emp: null   },
      { plate: 'CCC-0003', brand: 'Honda',          model: 'Fit',       color: '紅色', year: 2017, mileage: 110000, status: 'maintenance', emp: null  },
      // retired × 3
      { plate: 'DDD-0001', brand: 'Nissan',         model: 'Tiida',     color: '灰色', year: 2015, mileage: 145000, status: 'retired',    emp: null   },
      { plate: 'DDD-0002', brand: 'Toyota',         model: 'Vios',      color: '白色', year: 2014, mileage: 168000, status: 'retired',    emp: null   },
      { plate: 'DDD-0003', brand: 'Mazda',          model: 'Mazda3',    color: '藍色', year: 2013, mileage: 190000, status: 'retired',    emp: null   },
    ];
    for (const v of vehicleDefs) {
      await client.query(
        'INSERT INTO vehicles (plate, brand, model, color, year, mileage, status, assigned_employee_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [v.plate, v.brand, v.model, v.color, v.year, v.mileage, v.status, v.emp ? empIds[v.emp] : null]
      );
    }

    await client.query('COMMIT');
    console.log(`\x1b[32m✓ seed:mock 完成\x1b[0m`);
    console.log(`  用戶：${userDefs.length} 筆（admin×1, user×9）`);
    console.log(`  員工：${employeeDefs.length} 筆（業務部×3, 工程部×3, 管理部×2, 資訊部×2）`);
    console.log(`  車輛：${vehicleDefs.length} 筆（available×5, in_use×4, maintenance×3, retired×3）`);
    console.log(`  預設密碼：Mock1234!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\x1b[31mseed-mock 失敗：\x1b[0m', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
