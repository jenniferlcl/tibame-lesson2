const express = require('express');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { VEHICLE_STATUSES } = require('../lib/enums');

const router = express.Router();

const VEHICLE_SELECT = `
  SELECT v.*, e.name AS assigned_employee_name
  FROM vehicles v
  LEFT JOIN employees e ON v.assigned_employee_id = e.id
`;

router.get('/', authenticate, async (req, res) => {
  const { search, status } = req.query;
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`v.plate ILIKE $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`v.status = $${params.length}`);
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  try {
    const { rows } = await pool.query(`${VEHICLE_SELECT} ${where} ORDER BY v.id`, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { plate, brand, model, color, year, mileage, status, assigned_employee_id } = req.body;
  if (!plate || !brand || !model)
    return res.status(400).json({ message: 'plate, brand, model are required' });
  if (status && !VEHICLE_STATUSES.includes(status))
    return res.status(400).json({ message: 'Invalid status value' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (plate, brand, model, color, year, mileage, status, assigned_employee_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [plate, brand, model, color || null, year || null, mileage || 0, status || 'available', assigned_employee_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Plate number already exists' });
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { plate, brand, model, color, year, mileage, status, assigned_employee_id } = req.body;

  if (status && !VEHICLE_STATUSES.includes(status))
    return res.status(400).json({ message: 'Invalid status value' });
  if (status === 'retired' && assigned_employee_id)
    return res.status(400).json({ message: 'Retired vehicles cannot be assigned to an employee' });

  try {
    const { rows } = await pool.query(
      `UPDATE vehicles SET
        plate = COALESCE($1, plate),
        brand = COALESCE($2, brand),
        model = COALESCE($3, model),
        color = COALESCE($4, color),
        year  = COALESCE($5, year),
        mileage = COALESCE($6, mileage),
        status = COALESCE($7, status),
        assigned_employee_id = $8
       WHERE id = $9 RETURNING *`,
      [plate, brand, model, color, year, mileage, status, assigned_employee_id ?? null, id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Plate number already exists' });
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
