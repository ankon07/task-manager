const mongoose = require('mongoose');

const Task = mongoose.model(
  'Task',
  new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: String, // e.g., 'low', 'medium', 'high'
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed'],
      default: 'todo'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }, { timestamps: true })
);

module.exports = Task;
