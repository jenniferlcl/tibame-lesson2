const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { DEPARTMENTS, USER_ROLES } = require('../lib/enums');
const { logAction } = require('../lib/audit');

const router = express.Router();
const adminOnly = [authenticate, authorize(['admin'])];

router.get('/', ...adminOnly, async (req, res) => {
  const { search } = req.query;
  const params = [];
  let where = '';
  if (search) {
    params.push(`%${search}%`);
    where = `WHERE e.name ILIKE $1`;
  }
  try {
    const { rows } = await pool.query(
      `SELECT e.*, u.username, u.role
       FROM employees e
       LEFT JOIN users u ON e.user_id = u.id
       ${where} ORDER BY e.id`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', ...adminOnly, async (req, res) => {
  const { employee_no, name, department, email, phone, username, password, role } = req.body;
  if (!employee_no || !name || !username || !password)
    return res.status(400).json({ message: 'employee_no, name, username, password are required' });
  if (department && !DEPARTMENTS.includes(department))
    return res.status(400).json({ message: 'Invalid department value' });
  if (role && !USER_ROLES.includes(role))
    return res.status(400).json({ message: 'Invalid role value' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const hash = await bcrypt.hash(password, 12);
    const userRes = await client.query(
      `INSERT INTO users (username, password_hash, role) VALUES ($1,$2,$3) RETURNING id`,
      [username, hash, role || 'user']
    );
    const userId = userRes.rows[0].id;
    const empRes = await client.query(
      `INSERT INTO employees (employee_no, name, department, email, phone, user_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [employee_no, name, department || null, email || null, phone || null, userId]
    );
    await client.query('COMMIT');
    res.status(201).json({ ...empRes.rows[0], username, role: role || 'user' });
    logAction(req.user.id, 'create', 'employee', empRes.rows[0].id, { name: empRes.rows[0].name });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ message: 'employee_no or username already exists' });
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.put('/:id', ...adminOnly, async (req, res) => {
  const { employee_no, name, department, email, phone, username, password, role } = req.body;
  const { id } = req.params;

  if (department && !DEPARTMENTS.includes(department))
    return res.status(400).json({ message: 'Invalid department value' });
  if (role && !USER_ROLES.includes(role))
    return res.status(400).json({ message: 'Invalid role value' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const empRes = await client.query('SELECT user_id FROM employees WHERE id = $1', [id]);
    if (!empRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'Employee not found' }); }
    const userId = empRes.rows[0].user_id;

    await client.query(
      `UPDATE employees SET
        employee_no = COALESCE($1, employee_no),
        name = COALESCE($2, name),
        department = COALESCE($3, department),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone)
       WHERE id = $6`,
      [employee_no, name, department, email, phone, id]
    );

    if (userId) {
      const userUpdates = [];
      const userParams = [];
      if (username) { userParams.push(username); userUpdates.push(`username = $${userParams.length}`); }
      if (password) { const h = await bcrypt.hash(password, 12); userParams.push(h); userUpdates.push(`password_hash = $${userParams.length}`); }
      if (role)     { userParams.push(role); userUpdates.push(`role = $${userParams.length}`); }
      if (userUpdates.length) {
        userParams.push(userId);
        await client.query(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userParams.length}`, userParams);
      }
    }

    await client.query('COMMIT');
    const { rows } = await pool.query(
      `SELECT e.*, u.username, u.role FROM employees e LEFT JOIN users u ON e.user_id = u.id WHERE e.id = $1`,
      [id]
    );
    res.json(rows[0]);
    logAction(req.user.id, 'update', 'employee', parseInt(id), { name: rows[0].name });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ message: 'employee_no or username already exists' });
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.delete('/:id', ...adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const assigned = await pool.query(
      'SELECT id FROM vehicles WHERE assigned_employee_id = $1 LIMIT 1', [id]
    );
    if (assigned.rows.length)
      return res.status(409).json({ message: 'Employee is assigned to one or more vehicles. Unassign them first.' });

    const empRes = await pool.query('SELECT user_id FROM employees WHERE id = $1', [id]);
    if (!empRes.rows.length) return res.status(404).json({ message: 'Employee not found' });

    const userId = empRes.rows[0].user_id;
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    if (userId) await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(204).send();
    logAction(req.user.id, 'delete', 'employee', parseInt(id), {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
