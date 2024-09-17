const express = require('express');
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// GET /tasks - Fetch all tasks for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /tasks - Create a new task
router.post('/', protect, async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const task = new Task({
      user: req.user._id,
      title,
      description,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /tasks/:id - Update an existing task
router.put('/:id', protect, async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
