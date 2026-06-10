const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'vms_db',
  user: process.env.DB_USER || 'vms_user',
  password: process.env.DB_PASSWORD || 'vms_password',
});

module.exports = pool;
