const express = require('express');
const router = express.Router();
const db = require('../config/db');

//GET http://localhost:3000/api/todos/
//GET http://localhost:3000/api/todos/:id
//POST http://localhost:3000/api/todos/
//PATCH http://localhost:3000/api/todos/:id
//DELETE http://localhost:3000/api/todos/:id
//DELETE http://localhost:3000/api/todos/

// Get all tasks
router.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json(results);
  });
});

//get one task
router.get('/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('SELECT * FROM tasks WHERE id = ?', [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json(results[0]);
  });
});

//post a task
router.post('/', (req, res) => {
  const { title, description, deadline } = req.body;
  db.query(
    'INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)',
    [title, description, deadline],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(201).json({ id: results.insertId });
    },
  );
});

//patch a task
router.patch('/:id', (req, res) => {
  const taskId = req.params.id;

  const updateFields = Object.keys(req.body)
    .map((field) => `${field} = ?`)
    .join(', ');
  const updateValues = Object.values(req.body);

  db.query(
    `UPDATE tasks SET ${updateFields} WHERE id = ?`,
    [...updateValues, taskId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task updated successfully' });
    },
  );
});

//delete a task
router.delete('/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  });
});

//delete all tasks
router.delete('/', (req, res) => {
  db.query('DELETE FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ message: 'All tasks deleted successfully' });
  });
});

module.exports = router;