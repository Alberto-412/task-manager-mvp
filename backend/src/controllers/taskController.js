const pool = require('../config/db');

const VALID_STATUSES = ['pending', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

async function getTasks(req, res) {
  const { status } = req.query;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.userId];

  if (status && VALID_STATUSES.includes(status)) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const [tasks] = await pool.query(query, params);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
}

async function getTaskById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
}

async function createTask(req, res) {
  const { title, description, priority, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, due_date, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.userId, title, description || null, priority || 'medium', due_date || null]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
}

async function updateTask(req, res) {
  const { title, description, priority, due_date } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.userId,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await pool.query(
      `UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, description || null, priority || 'medium', due_date || null, req.params.id, req.userId]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
}

async function updateTaskStatus(req, res) {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.userId,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [
      status,
      req.params.id,
      req.userId,
    ]);

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
}

async function deleteTask(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al borrar la tarea' });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
