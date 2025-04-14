const mongoose = require('mongoose');

const Task = mongoose.model(
  'Task',
  new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: String, // e.g., 'low', 'medium', 'high'
    status: String, // e.g., 'pending', 'completed'
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  })
);

module.exports = Task;