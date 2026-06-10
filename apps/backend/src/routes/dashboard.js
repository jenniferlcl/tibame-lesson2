const express = require('express');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const [vehicleStats, employeeCount, statusBreakdown, monthlyTrend] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'available')   AS available,
          COUNT(*) FILTER (WHERE status = 'maintenance') AS maintenance,
          COUNT(*) FILTER (WHERE status = 'in_use')      AS in_use,
          COUNT(*) FILTER (WHERE status = 'retired')     AS retired
        FROM vehicles
      `),
      pool.query('SELECT COUNT(*) AS total FROM employees'),
      pool.query(`
        SELECT status, COUNT(*) AS count
        FROM vehicles
        GROUP BY status
      `),
      pool.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
          COUNT(*) AS count
        FROM vehicles
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month
      `),
    ]);

    const v = vehicleStats.rows[0];
    res.json({
      totalVehicles:  parseInt(v.total),
      available:      parseInt(v.available),
      maintenance:    parseInt(v.maintenance),
      inUse:          parseInt(v.in_use),
      retired:        parseInt(v.retired),
      totalEmployees: parseInt(employeeCount.rows[0].total),
      vehicleStatusBreakdown: statusBreakdown.rows.map(r => ({
        status: r.status,
        count:  parseInt(r.count),
      })),
      monthlyTrend: monthlyTrend.rows.map(r => ({
        month: r.month,
        count: parseInt(r.count),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
