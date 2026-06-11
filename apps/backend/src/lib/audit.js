'use strict';
const pool = require('../db/pool');

async function logAction(userId, action, resourceType, resourceId, detail) {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, detail) VALUES ($1,$2,$3,$4,$5)',
      [userId, action, resourceType, resourceId, JSON.stringify(detail)]
    );
  } catch (err) {
    console.error('[audit] logAction failed:', err.message);
  }
}

module.exports = { logAction };
