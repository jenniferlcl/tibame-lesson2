'use strict';
const express = require('express');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;

  try {
    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT a.id, a.action, a.resource_type, a.resource_id, a.detail, a.created_at,
                u.username
         FROM audit_logs a
         LEFT JOIN users u ON a.user_id = u.id
         ORDER BY a.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*) FROM audit_logs'),
    ]);
    res.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
